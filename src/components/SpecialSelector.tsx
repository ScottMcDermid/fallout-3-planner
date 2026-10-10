import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import type { SpecialStat } from '@/utils/specialUtils';
import { MAX_SPECIAL_LEVEL, MIN_SPECIAL_LEVEL, shorthandBySpecial } from '@/utils/specialUtils';
import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

export default function SpecialSelector({
  stat,
  value,
  color,
  canIncrement,
  incrementHandler,
  decrementHandler,
}: {
  stat: SpecialStat;
  value: number;
  color?: string;
  canIncrement: boolean;
  incrementHandler: () => void;
  decrementHandler: () => void;
}) {
  const isMaxed = useMemo(
    () => value >= MAX_SPECIAL_LEVEL || !canIncrement,
    [value, canIncrement],
  );

  const isMin = useMemo(() => value <= MIN_SPECIAL_LEVEL, [value]);

  return (
    <Box className="m-1 flex flex-col">
      <Typography color="default" className="whitespace-nowrap text-center text-xs">
        <Typography className="hidden lg:block" component={'span'}>
          {stat}
        </Typography>
        <Typography className="block lg:hidden" component={'span'}>
          {shorthandBySpecial[stat]}
        </Typography>
      </Typography>
      <ToggleButtonGroup className="mt-1 flex min-w-20 p-1">
        <ToggleButton
          disabled={isMin}
          className="w-6 p-0 text-lg"
          value={false}
          aria-label={`decrement ${stat}`}
          onClick={decrementHandler}
        >
          -
        </ToggleButton>
        <ToggleButton value={false} className="flex-1 p-1" disabled>
          <Typography color={color || 'primary'}>{value}</Typography>
        </ToggleButton>
        <ToggleButton
          disabled={isMaxed}
          aria-label={`increment ${stat}`}
          value={false}
          onClick={incrementHandler}
          className="w-6 p-0 text-lg"
        >
          +
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
