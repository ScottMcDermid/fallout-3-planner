import React from 'react';
import type { IconBaseProps } from 'react-icons';
import type { Skill } from '@/utils/skillUtils';

import { GiPistolGun, GiMissileLauncher, GiExplosiveMaterials, GiFist, GiChatBubble } from 'react-icons/gi';
import { FaWrench, FaFlask, FaUserNinja, FaBriefcaseMedical, FaLock } from 'react-icons/fa';
import { TbBolt } from 'react-icons/tb';
import { LuSword } from 'react-icons/lu';
import { MdAttachMoney } from 'react-icons/md';

const iconBySkill: { [key in Skill]: React.ComponentType<IconBaseProps> } = {
  Barter: MdAttachMoney,
  'Big Guns': GiMissileLauncher,
  'Energy Weapons': TbBolt,
  Explosives: GiExplosiveMaterials,
  Lockpick: FaLock,
  Medicine: FaBriefcaseMedical,
  'Melee Weapons': LuSword,
  Repair: FaWrench,
  Science: FaFlask,
  'Small Guns': GiPistolGun,
  Sneak: FaUserNinja,
  Speech: GiChatBubble,
  Unarmed: GiFist,
};

export default function SkillIcon({ skill, style, ...props }: { skill: Skill } & IconBaseProps) {
  const Icon = iconBySkill[skill];
  return <Icon style={{ verticalAlign: 'middle', flexShrink: 0, ...style }} {...props} />;
}
