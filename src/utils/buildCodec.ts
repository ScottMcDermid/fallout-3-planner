/**
 * Build Codec — encodes/decodes the full character build state into a compact,
 * URL-safe string using binary packing + lz-string compression.
 *
 * Encoding format (v5):
 *   Byte 0: version (5)
 *   Then bit-packed fields:
 *     - character name: 8-bit length + UTF-8 bytes
 *     - gender: 1 bit (index into genders array)
 *     - special: 7x 4 bits (values 1-10, index into specialStats array order)
 *     - tagSkills: 3x 4 bits (index into skills array, 13 values)
 *   Then per levelUp (count encoded as 6 bits, max 63):
 *     - skillPoints: 13x 7 bits (values 0-100)
 *     - perk: 6 bits (index into PERKS_LIST, 58 perks + "none" sentinel)
 *     - specialIncrease: 3 bits (index into specialStats array, sentinel 7 = none)
 *     - tagSkill: 4 bits (index into skills array, sentinel 15 = none)
 *     - bobbleheads: 5-bit count + 5 bits per index into BOBBLEHEADS_LIST
 */

import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

import genders, { type Gender } from '@/utils/genderUtils';
import specialStats, { type SpecialSet, type SpecialStat, getSpecialSetTemplate } from '@/utils/specialUtils';
import skills, { getSkillsSetTemplate, type Skill, type SkillsSet } from '@/utils/skillUtils';
import perks from '@/utils/perkUtils';
import bobbleheads from '@/utils/bobbleheadUtils';
import type { LevelUp } from '@/utils/levelUtils';

// Canonical ordering for perks indexing
const PERKS_LIST: string[] = perks.map((perk) => perk.name);
const BOBBLEHEADS_LIST: string[] = bobbleheads.map((bobblehead) => bobblehead.name);
const NO_PERK_INDEX = 63; // sentinel (6 bits max value)
const NO_SPECIAL_INDEX = 7; // sentinel (3 bits)
const NO_SKILL_INDEX = 15; // sentinel (4 bits)
const MAX_BOBBLEHEADS_PER_LEVEL = 19; // fits in 5 bits, and there are only 19 bobbleheads total

const CODEC_VERSION = 5;

// ─── Bit Writer / Reader ────────────────────────────────────────────────────

class BitWriter {
  private buffer: number[] = [];
  private currentByte = 0;
  private bitPos = 0; // next bit position in currentByte (0-7, MSB first)

  writeBits(value: number, numBits: number): void {
    for (let i = numBits - 1; i >= 0; i--) {
      const bit = (value >> i) & 1;
      this.currentByte = (this.currentByte << 1) | bit;
      this.bitPos++;
      if (this.bitPos === 8) {
        this.buffer.push(this.currentByte);
        this.currentByte = 0;
        this.bitPos = 0;
      }
    }
  }

  toUint8Array(): Uint8Array {
    // Flush remaining bits (pad with zeros on the right)
    const result = [...this.buffer];
    if (this.bitPos > 0) {
      result.push(this.currentByte << (8 - this.bitPos));
    }
    return new Uint8Array(result);
  }
}

class BitReader {
  private data: Uint8Array;
  private bytePos = 0;
  private bitPos = 0; // next bit position in current byte (0-7, MSB first)

  constructor(data: Uint8Array) {
    this.data = data;
  }

  readBits(numBits: number): number {
    let value = 0;
    for (let i = 0; i < numBits; i++) {
      const byte = this.data[this.bytePos];
      const bit = (byte >> (7 - this.bitPos)) & 1;
      value = (value << 1) | bit;
      this.bitPos++;
      if (this.bitPos === 8) {
        this.bytePos++;
        this.bitPos = 0;
      }
    }
    return value;
  }
}

// ─── Encode ─────────────────────────────────────────────────────────────────

export interface BuildData {
  characterName: string;
  gender: Gender;
  special: SpecialSet;
  tagSkills: Skill[];
  levelUps: LevelUp[];
}

export function encodeBuild(data: BuildData): string {
  const writer = new BitWriter();

  // Version byte (8 bits)
  writer.writeBits(CODEC_VERSION, 8);

  // Character name: 8-bit length + UTF-8 bytes (each 8 bits)
  const nameBytes = new TextEncoder().encode((data.characterName ?? '').slice(0, 255));
  writer.writeBits(nameBytes.length, 8);
  for (let i = 0; i < nameBytes.length; i++) {
    writer.writeBits(nameBytes[i], 8);
  }

  // Gender (1 bit)
  writer.writeBits(Math.max(0, genders.indexOf(data.gender)), 1);

  // S.P.E.C.I.A.L. (7x 4 bits)
  for (const stat of specialStats) {
    writer.writeBits(data.special[stat] & 0xf, 4);
  }

  // Tag Skills (3x 4 bits)
  for (const skill of data.tagSkills) {
    writer.writeBits(Math.max(0, skills.indexOf(skill)), 4);
  }

  // Number of levelUps (6 bits, max 63)
  const numLevelUps = Math.min(data.levelUps.length, 63);
  writer.writeBits(numLevelUps, 6);

  // Each LevelUp
  for (let i = 0; i < numLevelUps; i++) {
    const levelUp = data.levelUps[i];

    // Skill points: 13x 7 bits (values 0-100)
    for (const skill of skills) {
      writer.writeBits((levelUp.skillPoints[skill] ?? 0) & 0x7f, 7);
    }

    // Perk: 6 bits
    const perkIndex = levelUp.perk ? PERKS_LIST.indexOf(levelUp.perk) : -1;
    writer.writeBits(perkIndex >= 0 ? perkIndex : NO_PERK_INDEX, 6);

    // Special increase: 3 bits
    const specialIndex = levelUp.specialIncrease ? specialStats.indexOf(levelUp.specialIncrease) : -1;
    writer.writeBits(specialIndex >= 0 ? specialIndex : NO_SPECIAL_INDEX, 3);

    // Tag skill: 4 bits
    const tagSkillIndex = levelUp.tagSkill ? skills.indexOf(levelUp.tagSkill) : -1;
    writer.writeBits(tagSkillIndex >= 0 ? tagSkillIndex : NO_SKILL_INDEX, 4);

    // Bobbleheads: 5-bit count + 5 bits per bobblehead index
    const bobbleheadIndexes = (levelUp.bobbleheads ?? [])
      .map((name) => BOBBLEHEADS_LIST.indexOf(name))
      .filter((idx) => idx >= 0)
      .slice(0, MAX_BOBBLEHEADS_PER_LEVEL);
    writer.writeBits(bobbleheadIndexes.length, 5);
    for (const idx of bobbleheadIndexes) {
      writer.writeBits(idx, 5);
    }
  }

  // Convert to binary string and compress
  const bytes = writer.toUint8Array();
  const binaryString = String.fromCharCode.apply(null, Array.from(bytes));
  return compressToEncodedURIComponent(binaryString);
}

// ─── Decode ─────────────────────────────────────────────────────────────────

export function decodeBuild(code: string): BuildData | null {
  try {
    const binaryString = decompressFromEncodedURIComponent(code);
    if (!binaryString) return null;

    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const reader = new BitReader(bytes);

    // Version
    const version = reader.readBits(8);
    if (version !== 4 && version !== 5) return null;

    // Character name: 8-bit length + UTF-8 bytes
    const nameLen = reader.readBits(8);
    const nameBytes = new Uint8Array(nameLen);
    for (let i = 0; i < nameLen; i++) {
      nameBytes[i] = reader.readBits(8);
    }
    const characterName = new TextDecoder().decode(nameBytes);

    // Gender
    const genderIdx = reader.readBits(1);
    const gender = genders[genderIdx] ?? genders[0];

    // S.P.E.C.I.A.L.
    const special: SpecialSet = getSpecialSetTemplate();
    for (const stat of specialStats) {
      special[stat] = reader.readBits(4);
    }

    // Tag Skills
    const tagSkills: Skill[] = [];
    for (let i = 0; i < 3; i++) {
      const idx = reader.readBits(4);
      tagSkills.push(skills[idx] ?? skills[0]);
    }

    // LevelUps
    const numLevelUps = reader.readBits(6);
    const levelUps: LevelUp[] = [];

    for (let i = 0; i < numLevelUps; i++) {
      const skillPoints: SkillsSet = getSkillsSetTemplate();
      for (const skill of skills) {
        skillPoints[skill] = reader.readBits(7);
      }

      const perkIndex = reader.readBits(6);
      const perk = perkIndex < PERKS_LIST.length ? PERKS_LIST[perkIndex] : null;

      const specialIndex = reader.readBits(3);
      const specialIncrease: SpecialStat | undefined =
        specialIndex < specialStats.length ? specialStats[specialIndex] : undefined;

      const tagSkillIndex = reader.readBits(4);
      const tagSkill: Skill | undefined = tagSkillIndex < skills.length ? skills[tagSkillIndex] : undefined;

      const bobbleheads: string[] = [];
      if (version === 5) {
        const bobbleheadCount = reader.readBits(5);
        for (let j = 0; j < bobbleheadCount; j++) {
          const idx = reader.readBits(5);
          if (idx < BOBBLEHEADS_LIST.length) bobbleheads.push(BOBBLEHEADS_LIST[idx]);
        }
      } else {
        const bobbleheadIndex = reader.readBits(5);
        if (bobbleheadIndex < BOBBLEHEADS_LIST.length) bobbleheads.push(BOBBLEHEADS_LIST[bobbleheadIndex]);
      }

      levelUps.push({ skillPoints, perk, specialIncrease, tagSkill, bobbleheads });
    }

    return {
      characterName,
      gender,
      special,
      tagSkills,
      levelUps,
    };
  } catch {
    return null;
  }
}
