import type { IconType } from 'react-icons';
import { FaBrain, FaEye } from 'react-icons/fa';
import { FaPeopleArrows } from 'react-icons/fa6';
import { GiMuscleUp, GiHeartBeats, GiRunningNinja, GiClover } from 'react-icons/gi';

import type { Skill } from '@/utils/skillUtils';

export type SpecialStat =
  | 'Strength'
  | 'Perception'
  | 'Endurance'
  | 'Charisma'
  | 'Intelligence'
  | 'Agility'
  | 'Luck';

export type SpecialShorthand = 'STR' | 'PER' | 'END' | 'CHA' | 'INT' | 'AGI' | 'LCK';

export type SpecialModifier = Partial<SpecialSet>;

export type SpecialSet = {
  [key in SpecialStat]: number;
};

export const MIN_SPECIAL_LEVEL = 1;
export const MAX_SPECIAL_LEVEL = 10;
export const BASE_SPECIAL_LEVEL = 5;
export const EXTRA_SPECIAL_POINTS = 5;
export const TOTAL_SPECIAL_POINTS = 40; // 5 points x 7 stats + 5 extra to distribute

export const baseSpecial: SpecialSet = {
  Strength: BASE_SPECIAL_LEVEL,
  Perception: BASE_SPECIAL_LEVEL,
  Endurance: BASE_SPECIAL_LEVEL,
  Charisma: BASE_SPECIAL_LEVEL,
  Intelligence: BASE_SPECIAL_LEVEL,
  Agility: BASE_SPECIAL_LEVEL,
  Luck: BASE_SPECIAL_LEVEL,
};

export const getSpecialSetTemplate: () => SpecialSet = () => ({
  Strength: 0,
  Perception: 0,
  Endurance: 0,
  Charisma: 0,
  Intelligence: 0,
  Agility: 0,
  Luck: 0,
});

// Each S.P.E.C.I.A.L. stat is the primary governing stat for these skills.
// Every point in the stat grants +2 to each associated skill (Luck grants +1
// skill point, rounded up, to every skill instead).
export const skillsBySpecial: { [key in SpecialStat]: Skill[] } = {
  Strength: ['Melee Weapons'],
  Perception: ['Energy Weapons', 'Explosives', 'Lockpick'],
  Endurance: ['Big Guns', 'Unarmed'],
  Charisma: ['Barter', 'Speech'],
  Intelligence: ['Medicine', 'Repair', 'Science'],
  Agility: ['Small Guns', 'Sneak'],
  Luck: [],
};

export const getSpecialFromSkill = (skill: Skill): SpecialStat => {
  const stat = specialStats.filter((stat) => skillsBySpecial[stat].includes(skill))[0];
  return stat;
};

const specialStats: SpecialStat[] = [
  'Strength',
  'Perception',
  'Endurance',
  'Charisma',
  'Intelligence',
  'Agility',
  'Luck',
];

export const shorthandBySpecial: { [key in SpecialStat]: SpecialShorthand } = {
  Strength: 'STR',
  Perception: 'PER',
  Endurance: 'END',
  Charisma: 'CHA',
  Intelligence: 'INT',
  Agility: 'AGI',
  Luck: 'LCK',
};

export const specialIcons: Record<SpecialStat, IconType> = {
  Strength: GiMuscleUp,
  Perception: FaEye,
  Endurance: GiHeartBeats,
  Charisma: FaPeopleArrows,
  Intelligence: FaBrain,
  Agility: GiRunningNinja,
  Luck: GiClover,
};

// Derived stat formulas
export const getMaxHitPoints = (endurance: number, level: number): number =>
  90 + endurance * 20 + level * 10;

export const getActionPoints = (agility: number): number => 65 + agility * 2;

export const getCarryWeight = (strength: number): number => 150 + strength * 10;

export default specialStats;
