import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import type { SpecialStat } from '@/utils/specialUtils';
import { shorthandBySpecial, specialIcons } from '@/utils/specialUtils';
import { cn } from '@/utils/cn';

export default function SpecialFineTuner({
  stat,
  value,
  min,
  max,
  className = '',
  onIncrement,
  onDecrement,
}: {
  stat: SpecialStat;
  value: number;
  min: number;
  max: number;
  className: string;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  const Icon = specialIcons[stat];
  return (
    <Box className={cn('flex w-24 flex-col place-items-center text-center', className)}>
      <Typography className="whitespace-nowrap">Fine Tune</Typography>
      <div className="place-items-center">
        <Typography className="hidden whitespace-nowrap text-xs lg:inline-flex lg:items-center">
          <Icon size={14} style={{ marginRight: 4 }} />
          {stat}
        </Typography>
        <Typography className="block whitespace-nowrap text-xs lg:hidden">
          {shorthandBySpecial[stat]}
        </Typography>
        <div className="flex flex-row place-items-center">
          <IconButton {...(value < min ? { disabled: true } : {})} onClick={onDecrement}>
            <RemoveIcon />
          </IconButton>
          <Typography className="min-w-4">{value}</Typography>
          <IconButton {...(value >= max ? { disabled: true } : {})} onClick={onIncrement}>
            <AddIcon />
          </IconButton>
        </div>
      </div>
    </Box>
  );
}
