import type { SpecialStat } from '@/utils/specialUtils';
import type { Skill } from '@/utils/skillUtils';

// Fallout 3 has 20 bobbleheads scattered across the Capital Wasteland: one
// for each S.P.E.C.I.A.L. stat (+1, permanently) and one for each skill
// (+10, permanently). Each is unique, so it can only be found/taken once.
export type Bobblehead = {
  name: string;
  special?: SpecialStat;
  skill?: Skill;
  description: string;
};

export const BOBBLEHEAD_SPECIAL_BONUS = 1;
export const BOBBLEHEAD_SKILL_BONUS = 10;

export const bobbleheads: Bobblehead[] = [
  { name: 'Strength', special: 'Strength', description: '+1 Strength, permanently.' },
  { name: 'Perception', special: 'Perception', description: '+1 Perception, permanently.' },
  { name: 'Endurance', special: 'Endurance', description: '+1 Endurance, permanently.' },
  { name: 'Charisma', special: 'Charisma', description: '+1 Charisma, permanently.' },
  { name: 'Intelligence', special: 'Intelligence', description: '+1 Intelligence, permanently.' },
  { name: 'Agility', special: 'Agility', description: '+1 Agility, permanently.' },
  { name: 'Luck', special: 'Luck', description: '+1 Luck, permanently.' },
  { name: 'Barter', skill: 'Barter', description: '+10 Barter, permanently.' },
  { name: 'Big Guns', skill: 'Big Guns', description: '+10 Big Guns, permanently.' },
  { name: 'Energy Weapons', skill: 'Energy Weapons', description: '+10 Energy Weapons, permanently.' },
  { name: 'Explosives', skill: 'Explosives', description: '+10 Explosives, permanently.' },
  { name: 'Lockpick', skill: 'Lockpick', description: '+10 Lockpick, permanently.' },
  { name: 'Medicine', skill: 'Medicine', description: '+10 Medicine, permanently.' },
  { name: 'Melee Weapons', skill: 'Melee Weapons', description: '+10 Melee Weapons, permanently.' },
  { name: 'Repair', skill: 'Repair', description: '+10 Repair, permanently.' },
  { name: 'Science', skill: 'Science', description: '+10 Science, permanently.' },
  { name: 'Small Guns', skill: 'Small Guns', description: '+10 Small Guns, permanently.' },
  { name: 'Sneak', skill: 'Sneak', description: '+10 Sneak, permanently.' },
  { name: 'Speech', skill: 'Speech', description: '+10 Speech, permanently.' },
  { name: 'Unarmed', skill: 'Unarmed', description: '+10 Unarmed, permanently.' },
];

export const hasTakenBobblehead = (bobbleheadsFound: string[], name: string): boolean =>
  bobbleheadsFound.includes(name);

export default bobbleheads;
