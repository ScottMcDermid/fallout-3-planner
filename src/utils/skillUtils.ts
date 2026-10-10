import type { SpecialStat, SpecialSet } from '@/utils/specialUtils';

export type Skill =
  | 'Barter'
  | 'Big Guns'
  | 'Energy Weapons'
  | 'Explosives'
  | 'Lockpick'
  | 'Medicine'
  | 'Melee Weapons'
  | 'Repair'
  | 'Science'
  | 'Small Guns'
  | 'Sneak'
  | 'Speech'
  | 'Unarmed';

export type SkillShorthand =
  | 'BAR'
  | 'BIG'
  | 'ENR'
  | 'EXP'
  | 'LOC'
  | 'MED'
  | 'MEL'
  | 'REP'
  | 'SCI'
  | 'SML'
  | 'SNK'
  | 'SPE'
  | 'UNA';

export type SkillsModifier = Partial<SkillsSet>;
export const MAX_SKILL_LEVEL = 100;

export type SkillsSet = {
  [key in Skill]: number;
};

export const getSkillsSetTemplate: () => SkillsSet = () => ({
  Barter: 0,
  'Big Guns': 0,
  'Energy Weapons': 0,
  Explosives: 0,
  Lockpick: 0,
  Medicine: 0,
  'Melee Weapons': 0,
  Repair: 0,
  Science: 0,
  'Small Guns': 0,
  Sneak: 0,
  Speech: 0,
  Unarmed: 0,
});

const skills: Skill[] = [
  'Barter',
  'Big Guns',
  'Energy Weapons',
  'Explosives',
  'Lockpick',
  'Medicine',
  'Melee Weapons',
  'Repair',
  'Science',
  'Small Guns',
  'Sneak',
  'Speech',
  'Unarmed',
];

export const shorthandBySkill: { [key in Skill]: SkillShorthand } = {
  Barter: 'BAR',
  'Big Guns': 'BIG',
  'Energy Weapons': 'ENR',
  Explosives: 'EXP',
  Lockpick: 'LOC',
  Medicine: 'MED',
  'Melee Weapons': 'MEL',
  Repair: 'REP',
  Science: 'SCI',
  'Small Guns': 'SML',
  Sneak: 'SNK',
  Speech: 'SPE',
  Unarmed: 'UNA',
};

// Primary S.P.E.C.I.A.L. stat governing each skill's base value.
export const primarySpecialBySkill: { [key in Skill]: SpecialStat } = {
  Barter: 'Charisma',
  'Big Guns': 'Endurance',
  'Energy Weapons': 'Perception',
  Explosives: 'Perception',
  Lockpick: 'Perception',
  Medicine: 'Intelligence',
  'Melee Weapons': 'Strength',
  Repair: 'Intelligence',
  Science: 'Intelligence',
  'Small Guns': 'Agility',
  Sneak: 'Agility',
  Speech: 'Charisma',
  Unarmed: 'Endurance',
};

export const NUM_TAG_SKILLS = 3;
export const TAG_SKILL_BONUS = 15;
export const BASE_SKILL_POINTS_PER_LEVEL = 10;
export const EDUCATED_BONUS_SKILL_POINTS = 3;

// Initial skill value = 2 + (2 x primary stat) + ceil(Luck / 2)
export function getBaseSkillValue(special: SpecialSet, skill: Skill): number {
  const primaryStat = special[primarySpecialBySkill[skill]];
  return 2 + primaryStat * 2 + Math.ceil(special.Luck / 2);
}

export function sumSkillSet(baseSkills: SkillsSet, modifier: SkillsModifier): SkillsSet {
  return Object.fromEntries(
    (Object.keys(baseSkills) as (keyof SkillsSet)[]).map((skill) => [
      skill,
      baseSkills[skill as Skill] + (modifier[skill] ?? 0),
    ]),
  ) as SkillsSet;
}

export function diffSkillSet(baseSkills: SkillsSet, modifier: SkillsModifier): SkillsSet {
  return Object.fromEntries(
    (Object.keys(baseSkills) as (keyof SkillsSet)[]).map((skill) => [
      skill,
      baseSkills[skill as Skill] - (modifier[skill] ?? 0),
    ]),
  ) as SkillsSet;
}

export default skills;
