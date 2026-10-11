import specialStats, {
  type SpecialSet,
  type SpecialStat,
  getSpecialSetTemplate,
  getActionPoints,
  getCarryWeight,
  getMaxHitPoints,
  MAX_SPECIAL_LEVEL,
} from '@/utils/specialUtils';
import skills, {
  type Skill,
  type SkillsSet,
  getSkillsSetTemplate,
  getBaseSkillValue,
  MAX_SKILL_LEVEL,
  BASE_SKILL_POINTS_PER_LEVEL,
  EDUCATED_BONUS_SKILL_POINTS,
  TAG_SKILL_BONUS,
} from '@/utils/skillUtils';
import { EDUCATED_PERK, perks } from '@/utils/perkUtils';
import { BOBBLEHEAD_SKILL_BONUS, BOBBLEHEAD_SPECIAL_BONUS, bobbleheads } from '@/utils/bobbleheadUtils';

export type Level = {
  level: number;
  special: SpecialSet;
  skills: SkillsSet;
  hitPoints: number;
  actionPoints: number;
  carryWeight: number;
  perksTaken: string[];
  bobbleheadsFound: string[];
};

// Describes what changed going from one level to the next.
export type LevelUp = {
  skillPoints: SkillsSet;
  perk: string | null;
  specialIncrease?: SpecialStat; // used by Intense Training
  tagSkill?: Skill; // used by Tag!
  bobbleheads?: string[];
};

export const levelTemplate: Level = {
  level: 0,
  special: getSpecialSetTemplate(),
  skills: getSkillsSetTemplate(),
  hitPoints: 0,
  actionPoints: 0,
  carryWeight: 0,
  perksTaken: [],
  bobbleheadsFound: [],
};

export const levelUpTemplate: LevelUp = {
  skillPoints: getSkillsSetTemplate(),
  perk: null,
};

export const getSkillPointsForLevel = (intelligence: number, hasEducated: boolean): number =>
  BASE_SKILL_POINTS_PER_LEVEL + intelligence + (hasEducated ? EDUCATED_BONUS_SKILL_POINTS : 0);

export const getBaseLevel = (special: SpecialSet, tagSkills: Skill[]): Level => {
  const newSkills: SkillsSet = skills.reduce((newSkills, skill) => {
    const base = getBaseSkillValue(special, skill);
    const tagBonus = tagSkills.includes(skill) ? TAG_SKILL_BONUS : 0;
    return {
      ...newSkills,
      [skill]: Math.min(MAX_SKILL_LEVEL, base + tagBonus),
    };
  }, getSkillsSetTemplate());

  return {
    level: 1,
    special,
    skills: newSkills,
    hitPoints: getMaxHitPoints(special.Endurance, 1),
    actionPoints: getActionPoints(special.Agility),
    carryWeight: getCarryWeight(special.Strength),
    perksTaken: [],
    bobbleheadsFound: [],
  };
};

export const applyLevelUpToLevel = (level: Level, levelUp: LevelUp): Level => {
  const foundBobbleheads = (levelUp.bobbleheads ?? [])
    .map((name) => bobbleheads.find((bobblehead) => bobblehead.name === name))
    .filter((bobblehead): bobblehead is (typeof bobbleheads)[number] => !!bobblehead);

  const newSpecial: SpecialSet = specialStats.reduce((newSpecial, stat) => {
    const increase = levelUp.specialIncrease === stat ? 1 : 0;
    const bobbleheadBonus =
      foundBobbleheads.filter((bobblehead) => bobblehead.special === stat).length * BOBBLEHEAD_SPECIAL_BONUS;
    return {
      ...newSpecial,
      [stat]: Math.min(MAX_SPECIAL_LEVEL, level.special[stat] + increase + bobbleheadBonus),
    };
  }, getSpecialSetTemplate());

  const perkSkillBonus = levelUp.perk ? perks.find((perk) => perk.name === levelUp.perk)?.skillBonus : undefined;

  const newSkills: SkillsSet = skills.reduce((newSkills, skill) => {
    const tagBonus = levelUp.tagSkill === skill ? TAG_SKILL_BONUS : 0;
    const perkBonus = perkSkillBonus?.[skill] ?? 0;
    const bobbleheadBonus =
      foundBobbleheads.filter((bobblehead) => bobblehead.skill === skill).length * BOBBLEHEAD_SKILL_BONUS;
    return {
      ...newSkills,
      [skill]: Math.min(
        MAX_SKILL_LEVEL,
        level.skills[skill] + (levelUp.skillPoints[skill] ?? 0) + tagBonus + perkBonus + bobbleheadBonus,
      ),
    };
  }, getSkillsSetTemplate());

  const newLevel = level.level + 1;

  return {
    level: newLevel,
    special: newSpecial,
    skills: newSkills,
    hitPoints: getMaxHitPoints(newSpecial.Endurance, newLevel),
    actionPoints: getActionPoints(newSpecial.Agility),
    carryWeight: getCarryWeight(newSpecial.Strength),
    perksTaken: levelUp.perk ? [...level.perksTaken, levelUp.perk] : level.perksTaken,
    bobbleheadsFound:
      levelUp.bobbleheads && levelUp.bobbleheads.length > 0
        ? [...level.bobbleheadsFound, ...levelUp.bobbleheads]
        : level.bobbleheadsFound,
  };
};

export const hasTakenPerk = (perksTaken: string[], name: string): boolean =>
  perksTaken.includes(name);

export const countPerkRanksTaken = (perksTaken: string[], name: string): number =>
  perksTaken.filter((perk) => perk === name).length;

export const hasEducatedPerk = (perksTaken: string[]): boolean =>
  hasTakenPerk(perksTaken, EDUCATED_PERK);
