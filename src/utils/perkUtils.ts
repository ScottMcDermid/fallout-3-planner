import type { SpecialStat } from '@/utils/specialUtils';
import type { Skill, SkillsModifier } from '@/utils/skillUtils';
import type { Gender } from '@/utils/genderUtils';

export type PerkRequirements = {
  special?: Partial<Record<SpecialStat, number>>;
  skills?: Partial<Record<Skill, number>>;
};

// Most perks are purely flavor/combat effects for the purposes of a leveling
// planner. `skillBonus` captures the (rare) perks that grant a flat,
// immediate bonus to specific skills, applied once per rank taken.
// `special` on Intense Training is handled specially (see characterStore).
export type Perk = {
  name: string;
  level: number;
  ranks: number;
  requirements?: PerkRequirements;
  skillBonus?: SkillsModifier;
  description: string;
};

export const INTENSE_TRAINING = 'Intense Training';
export const TAG_PERK = 'Tag!';
export const EDUCATED_PERK = 'Educated';

export const perks: Perk[] = [
  {
    name: 'Black Widow / Lady Killer',
    level: 2,
    ranks: 1,
    description: '+10% damage against the opposite sex, plus unique dialogue options.',
  },
  {
    name: "Daddy's Boy / Daddy's Girl",
    level: 2,
    ranks: 3,
    requirements: { special: { Intelligence: 4 } },
    skillBonus: { Science: 5, Medicine: 5 },
    description: 'Each rank grants +5 Science and +5 Medicine.',
  },
  {
    name: 'Gun Nut',
    level: 2,
    ranks: 3,
    requirements: { special: { Intelligence: 4, Agility: 4 } },
    skillBonus: { 'Small Guns': 5, Repair: 5 },
    description: 'Each rank grants +5 Small Guns and +5 Repair.',
  },
  {
    name: 'Little Leaguer',
    level: 2,
    ranks: 3,
    requirements: { special: { Strength: 4 } },
    skillBonus: { 'Melee Weapons': 5, Explosives: 5 },
    description: 'Each rank grants +5 Melee Weapons and +5 Explosives.',
  },
  {
    name: 'Thief',
    level: 2,
    ranks: 3,
    requirements: { special: { Perception: 4, Agility: 4 } },
    skillBonus: { Lockpick: 5, Sneak: 5 },
    description: 'Each rank grants +5 Lockpick and +5 Sneak.',
  },
  {
    name: 'Swift Learner',
    level: 2,
    ranks: 3,
    requirements: { special: { Intelligence: 4 } },
    description: 'Each rank grants +10% bonus Experience Points earned.',
  },
  {
    name: INTENSE_TRAINING,
    level: 2,
    ranks: 10,
    description: 'Put a single point into any one S.P.E.C.I.A.L. attribute.',
  },
  {
    name: 'Child at Heart',
    level: 4,
    ranks: 1,
    requirements: { special: { Charisma: 4 } },
    description: 'Unlocks unique dialogue options with children.',
  },
  {
    name: 'Comprehension',
    level: 4,
    ranks: 1,
    requirements: { special: { Intelligence: 4 } },
    description: '+1 bonus skill point whenever a skill book is read.',
  },
  {
    name: EDUCATED_PERK,
    level: 4,
    ranks: 1,
    requirements: { special: { Intelligence: 4 } },
    description: '+3 skill points every time you advance a level.',
  },
  {
    name: 'Entomologist',
    level: 4,
    ranks: 1,
    requirements: { special: { Intelligence: 4 }, skills: { Science: 40 } },
    description: '+50% damage to insects and other bugs.',
  },
  {
    name: 'Scoundrel',
    level: 4,
    ranks: 3,
    requirements: { special: { Charisma: 4 } },
    skillBonus: { Speech: 5, Barter: 5 },
    description: 'Each rank grants +5 Speech and +5 Barter.',
  },
  {
    name: 'Iron Fist',
    level: 4,
    ranks: 3,
    requirements: { special: { Strength: 4 } },
    description: 'Each rank grants +5 points of Unarmed damage.',
  },
  {
    name: 'Bloody Mess',
    level: 6,
    ranks: 1,
    description: '+5% overall damage with all weapons.',
  },
  {
    name: 'Lead Belly',
    level: 6,
    ranks: 1,
    requirements: { special: { Endurance: 5 } },
    description: '-50% radiation taken whenever drinking from a water source.',
  },
  {
    name: 'Toughness',
    level: 6,
    ranks: 1,
    requirements: { special: { Endurance: 5 } },
    description: '+10% Damage Resistance, up to a maximum of 85%.',
  },
  {
    name: 'Fortune Finder',
    level: 6,
    ranks: 1,
    requirements: { special: { Luck: 5 } },
    description: 'Considerably more bottle caps found in containers.',
  },
  {
    name: 'Gunslinger',
    level: 6,
    ranks: 1,
    description: '+25% V.A.T.S. accuracy with one-handed weapons.',
  },
  {
    name: 'Demolition Expert',
    level: 6,
    ranks: 3,
    requirements: { skills: { Explosives: 50 } },
    description: 'Each rank grants +20% damage with explosives.',
  },
  {
    name: 'Commando',
    level: 8,
    ranks: 1,
    description: '+25% V.A.T.S. accuracy with two-handed rifle-type weapons.',
  },
  {
    name: 'Rad Resistance',
    level: 8,
    ranks: 1,
    requirements: { special: { Endurance: 5 } },
    description: '+25% Radiation Resistance, permanently.',
  },
  {
    name: 'Scrounger',
    level: 8,
    ranks: 1,
    requirements: { special: { Luck: 5 } },
    description: 'Considerably more ammunition found in containers.',
  },
  {
    name: 'Size Matters',
    level: 8,
    ranks: 3,
    requirements: { special: { Endurance: 5 } },
    skillBonus: { 'Big Guns': 15 },
    description: 'Each rank grants +15 Big Guns.',
  },
  {
    name: 'Strong Back',
    level: 8,
    ranks: 1,
    requirements: { special: { Strength: 5, Endurance: 5 } },
    description: 'Carry an additional 50 lbs. of equipment.',
  },
  {
    name: 'Impartial Mediation',
    level: 8,
    ranks: 1,
    requirements: { special: { Charisma: 5 } },
    description: '+30 Speech when your Karma is neutral.',
  },
  {
    name: 'Animal Friend',
    level: 10,
    ranks: 2,
    requirements: { special: { Charisma: 6 } },
    description:
      'Rank 1: hostile animals become neutral. Rank 2: they also come to your aid in combat.',
  },
  {
    name: 'Finesse',
    level: 10,
    ranks: 1,
    description: '+5% Critical Chance.',
  },
  {
    name: 'Mister Sandman',
    level: 10,
    ranks: 1,
    requirements: { skills: { Sneak: 60 } },
    description: 'Instantly kill a sleeping NPC and earn bonus XP.',
  },
  {
    name: 'Mysterious Stranger',
    level: 10,
    ranks: 1,
    requirements: { special: { Luck: 6 } },
    description: 'A chance the Mysterious Stranger appears in V.A.T.S. to help you.',
  },
  {
    name: 'Nerd Rage!',
    level: 10,
    ranks: 1,
    requirements: { special: { Intelligence: 5 }, skills: { Science: 50 } },
    description: 'Strength raised to 10 and +50% Damage Resistance when HP drops to 20% or lower.',
  },
  {
    name: 'Night Person',
    level: 10,
    ranks: 1,
    description: '+2 Intelligence and +2 Perception from 6 p.m. to 6 a.m.',
  },
  {
    name: 'Here and Now',
    level: 10,
    ranks: 1,
    description: 'Instantly gain an additional experience level.',
  },
  {
    name: 'Pyromaniac',
    level: 12,
    ranks: 1,
    requirements: { skills: { Explosives: 60 } },
    description: '+50% damage with fire-based weapons.',
  },
  {
    name: 'Cannibal',
    level: 12,
    ranks: 1,
    description: 'While sneaking, feed on corpses to regain health (costs Karma).',
  },
  {
    name: 'Life Giver',
    level: 12,
    ranks: 1,
    requirements: { special: { Endurance: 6 } },
    description: '+30 Hit Points.',
  },
  {
    name: 'Robotics Expert',
    level: 12,
    ranks: 1,
    requirements: { skills: { Science: 50 } },
    description: '+25% damage to robots; can shut them down by sneaking up on them.',
  },
  {
    name: 'Sniper',
    level: 12,
    ranks: 1,
    requirements: { special: { Perception: 6, Agility: 6 } },
    description: '+25% chance to hit the target\u2019s head in V.A.T.S.',
  },
  {
    name: 'Silent Running',
    level: 12,
    ranks: 1,
    requirements: { special: { Agility: 6 }, skills: { Sneak: 50 } },
    skillBonus: { Sneak: 10 },
    description: '+10 Sneak; running no longer affects your ability to sneak.',
  },
  {
    name: 'Fast Metabolism',
    level: 12,
    ranks: 1,
    description: '+20% Hit Points restored with Stimpaks.',
  },
  {
    name: 'Lawbringer',
    level: 14,
    ranks: 1,
    description: 'Sell severed fingers; Regulator hit squads stop spawning.',
  },
  {
    name: 'Chemist',
    level: 14,
    ranks: 1,
    requirements: { skills: { Medicine: 60 } },
    description: 'Chems last twice as long.',
  },
  {
    name: 'Contract Killer',
    level: 14,
    ranks: 1,
    description: 'Sell severed ears; Talon Company hit squads stop spawning.',
  },
  {
    name: 'Cyborg',
    level: 14,
    ranks: 1,
    requirements: { skills: { Medicine: 60, Science: 60 } },
    skillBonus: { 'Energy Weapons': 10 },
    description: '+10 Energy Weapons, +10% Damage/Poison/Radiation Resistance.',
  },
  {
    name: 'Light Step',
    level: 14,
    ranks: 1,
    requirements: { special: { Perception: 6, Agility: 6 } },
    description: 'Floor traps and mines will not be triggered by you.',
  },
  {
    name: 'Master Trader',
    level: 14,
    ranks: 1,
    requirements: { special: { Charisma: 6 }, skills: { Barter: 60 } },
    description: 'All items cost 25% less.',
  },
  {
    name: 'Adamantium Skeleton',
    level: 14,
    ranks: 1,
    description: 'Damage taken by limbs reduced by 50%.',
  },
  {
    name: TAG_PERK,
    level: 16,
    ranks: 1,
    description: 'Select a fourth Tag Skill, instantly raising it by 15 points.',
  },
  {
    name: 'Better Criticals',
    level: 16,
    ranks: 1,
    requirements: { special: { Perception: 6, Luck: 6 } },
    description: '+50% damage with critical hits.',
  },
  {
    name: 'Action Boy / Action Girl',
    level: 16,
    ranks: 1,
    requirements: { special: { Agility: 6 } },
    description: '+25 Action Points.',
  },
  {
    name: 'Chem Resistant',
    level: 16,
    ranks: 1,
    requirements: { skills: { Medicine: 60 } },
    description: '50% less likely to develop an addiction to chems.',
  },
  {
    name: 'Infiltrator',
    level: 18,
    ranks: 1,
    requirements: { special: { Perception: 7 }, skills: { Lockpick: 70 } },
    description: 'Get a second attempt at any lock you were previously locked out of.',
  },
  {
    name: 'Computer Whiz',
    level: 18,
    ranks: 1,
    requirements: { special: { Intelligence: 7 }, skills: { Science: 70 } },
    description: 'Get a second attempt at any terminal you were previously locked out of.',
  },
  {
    name: 'Concentrated Fire',
    level: 18,
    ranks: 1,
    requirements: { skills: { 'Energy Weapons': 60, 'Small Guns': 60 } },
    description: '+5% accuracy for subsequent V.A.T.S. hits on the same body part.',
  },
  {
    name: 'Paralyzing Palm',
    level: 18,
    ranks: 1,
    requirements: { skills: { Unarmed: 70 } },
    description: '30% chance to paralyze an enemy for 30 seconds with an unarmed V.A.T.S. attack.',
  },
  {
    name: 'Solar Powered',
    level: 20,
    ranks: 1,
    requirements: { special: { Endurance: 7 } },
    description: '+2 Strength and +1 HP every 10 seconds while outside, 6 a.m. to 6 p.m.',
  },
  {
    name: 'Ninja',
    level: 20,
    ranks: 1,
    requirements: { skills: { 'Melee Weapons': 80, Sneak: 80 } },
    description:
      '+15% critical chance with Melee/Unarmed; +25% damage with sneak attack criticals.',
  },
  {
    name: "Grim Reaper's Sprint",
    level: 20,
    ranks: 1,
    description: 'A kill in V.A.T.S. restores all your Action Points.',
  },
  {
    name: 'Explorer',
    level: 20,
    ranks: 1,
    description: 'Every location in the world is revealed on your map.',
  },
  // Broken Steel (DLC) raises the level cap to 30 and adds the following perks.
  {
    name: 'Deep Sleep',
    level: 22,
    ranks: 1,
    description: 'Get the Well Rested XP bonus for 8 hours no matter what bed you sleep in.',
  },
  {
    name: 'Puppies!',
    level: 22,
    ranks: 1,
    description: 'If Dogmeat dies, a replacement puppy will be waiting for you outside Vault 101.',
  },
  {
    name: 'Quantum Chemist',
    level: 22,
    ranks: 1,
    requirements: { skills: { Science: 70 } },
    description:
      'Every 10 Nuka-Cola you carry are automatically converted into a Nuka-Cola Quantum.',
  },
  {
    name: "Devil's Highway",
    level: 24,
    ranks: 1,
    description: 'Instantly set your Karma to Very Evil. Requires Karma above Very Evil.',
  },
  {
    name: 'Escalator to Heaven',
    level: 24,
    ranks: 1,
    description: 'Instantly set your Karma to Very Good. Requires Karma below Very Good.',
  },
  {
    name: 'Karmic Rebalance',
    level: 24,
    ranks: 1,
    description: 'Instantly set your Karma to Neutral. Requires non-Neutral Karma.',
  },
  {
    name: 'No Weaknesses',
    level: 24,
    ranks: 1,
    description: 'Any S.P.E.C.I.A.L. stat below 5 is instantly raised to 5.',
  },
  {
    name: 'Nerves of Steel',
    level: 26,
    ranks: 1,
    requirements: { special: { Agility: 7 } },
    description: 'Action Points regenerate much more quickly.',
  },
  {
    name: 'Rad Tolerance',
    level: 26,
    ranks: 1,
    requirements: { special: { Endurance: 7 } },
    description: 'No longer suffer any ill effects from Minor Radiation Poisoning.',
  },
  {
    name: 'Warmonger',
    level: 26,
    ranks: 1,
    requirements: { special: { Intelligence: 7 } },
    description: 'Build every custom weapon type without needing to find its schematics first.',
  },
  {
    name: 'Party Boy / Party Girl',
    level: 28,
    ranks: 1,
    description: 'No longer suffer the withdrawal effects of Alcohol Addiction.',
  },
  {
    name: 'Rad Absorption',
    level: 28,
    ranks: 1,
    requirements: { special: { Endurance: 7 } },
    description: 'Your radiation level slowly decreases on its own over time.',
  },
  {
    name: 'Almost Perfect',
    level: 30,
    ranks: 1,
    description: 'All S.P.E.C.I.A.L. stats are instantly raised to 9.',
  },
  {
    name: 'Nuclear Anomaly',
    level: 30,
    ranks: 1,
    description:
      'Erupt into a devastating nuclear explosion whenever your Health drops to 20 or less (nearby allies suffer the blast too).',
  },
];

// A handful of perks have a gendered display name (the internal/canonical
// `perk.name` stays the same so storage/requirements/ranks all line up).
const genderedPerkNames: Record<string, Record<Gender, string>> = {
  'Black Widow / Lady Killer': { Female: 'Black Widow', Male: 'Lady Killer' },
  "Daddy's Boy / Daddy's Girl": { Female: "Daddy's Girl", Male: "Daddy's Boy" },
  'Action Boy / Action Girl': { Female: 'Action Girl', Male: 'Action Boy' },
  'Party Boy / Party Girl': { Female: 'Party Girl', Male: 'Party Boy' },
};

export const getPerkDisplayName = (name: string, gender: Gender): string =>
  genderedPerkNames[name]?.[gender] ?? name;

export default perks;
