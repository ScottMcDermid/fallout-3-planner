import React from 'react';
import { IconButton, Tooltip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import type { Level } from '@/utils/levelUtils';

import specialStats from '@/utils/specialUtils';
import type { SpecialStat } from '@/utils/specialUtils';
import { getPerkDisplayName } from '@/utils/perkUtils';
import { useCharacterStore } from '@/data/characterStore';

export default function LevelRow({
  level,
  previousLevel,
  onRemoveHandler,
  onModifyHandler,
}: {
  level: Level;
  previousLevel: Level | undefined;
  onRemoveHandler?: () => void;
  onModifyHandler?: () => void;
}) {
  const { gender } = useCharacterStore();
  const perkTakenThisLevel = previousLevel
    ? level.perksTaken[level.perksTaken.length - 1]
    : undefined;
  const tookPerkThisLevel = previousLevel && level.perksTaken.length > previousLevel.perksTaken.length;

  return (
    <>
      <div className="px-0 text-lg">
        <Tooltip title={tookPerkThisLevel && perkTakenThisLevel ? `Perk: ${getPerkDisplayName(perkTakenThisLevel, gender)}` : ''}>
          <span>{level.level}</span>
        </Tooltip>
      </div>
      {specialStats.map((stat: SpecialStat) => (
        <div key={stat} className="px-0">
          <Typography
            {...(previousLevel && level.special[stat] > previousLevel.special[stat]
              ? { color: 'secondary' }
              : {})}
          >
            {level.special[stat]}
          </Typography>
        </div>
      ))}
      <div className="hidden xl:block">
        <Typography
          {...(previousLevel && level.hitPoints > previousLevel.hitPoints
            ? { color: 'secondary' }
            : {})}
        >
          {level.hitPoints}
        </Typography>
      </div>
      <div className="hidden xl:block">
        <Typography
          {...(previousLevel && level.actionPoints > previousLevel.actionPoints
            ? { color: 'secondary' }
            : {})}
        >
          {level.actionPoints}
        </Typography>
      </div>
      <div className="hidden xl:block">
        <Typography
          {...(previousLevel && level.carryWeight > previousLevel.carryWeight
            ? { color: 'secondary' }
            : {})}
        >
          {level.carryWeight}
        </Typography>
      </div>
      <div>
        {onModifyHandler ? (
          <Tooltip title="Modify">
            <IconButton
              className="p-0 px-1"
              aria-label="Modify"
              onClick={() => onModifyHandler()}
              sx={(theme) => ({
                color: theme.palette.grey[500],
              })}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
        ) : null}
        {onRemoveHandler ? (
          <Tooltip title="Remove">
            <IconButton
              className="p-0 px-1"
              aria-label="Delete"
              onClick={() => onRemoveHandler()}
              sx={(theme) => ({
                color: theme.palette.grey[500],
              })}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
}
