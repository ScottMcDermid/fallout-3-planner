import React from 'react';
import type { IconBaseProps } from 'react-icons';
import { GiStoneBust } from 'react-icons/gi';

import { bobbleheads } from '@/utils/bobbleheadUtils';
import { specialIcons } from '@/utils/specialUtils';
import SkillIcon from '@/components/SkillIcon';

export default function BobbleheadIcon({ bobblehead, style, ...props }: { bobblehead: string } & IconBaseProps) {
  const data = bobbleheads.find((b) => b.name === bobblehead);
  if (data?.skill) {
    return <SkillIcon skill={data.skill} style={{ verticalAlign: 'middle', flexShrink: 0, ...style }} {...props} />;
  }
  const Icon = (data?.special && specialIcons[data.special]) || GiStoneBust;
  return <Icon style={{ verticalAlign: 'middle', flexShrink: 0, ...style }} {...props} />;
}
