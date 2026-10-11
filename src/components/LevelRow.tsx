import React from 'react';
import { IconButton, Tooltip, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import type { Level } from '@/utils/levelUtils';

import specialStats from '@/utils/specialUtils';
import type { SpecialStat } from '@/utils/specialUtils';
import { getPerkDisplayName } from '@/utils/perkUtils';
import { useCharacterStore } from '@/data/characterStore';
import PerkIcon from '@/components/PerkIcon';
import BobbleheadIcon from '@/components/BobbleheadIcon';

export default function LevelRow({
  level,
  previousLevel,
  striped,
  onRemoveHandler,
  onModifyHandler,
}: {
  level: Level;
  previousLevel: Level | undefined;
  striped?: boolean;
  onRemoveHandler?: () => void;
  onModifyHandler?: () => void;
}) {
  const { gender } = useCharacterStore();
  const rowClassName = `w-full h-full self-stretch justify-self-stretch flex items-center justify-center px-0 ${
    striped ? 'bg-white/[0.03]' : ''
  }`;
  const perkTakenThisLevel = previousLevel
    ? level.perksTaken[level.perksTaken.length - 1]
    : undefined;
  const tookPerkThisLevel = previousLevel && level.perksTaken.length > previousLevel.perksTaken.length;

  const bobbleheadsFoundThisLevel = previousLevel
    ? level.bobbleheadsFound.slice(previousLevel.bobbleheadsFound.length)
    : [];

  return (
    <>
      <div className={`${rowClassName} flex-col gap-0.5 text-lg`}>
        <span>{level.level}</span>
        {(tookPerkThisLevel && perkTakenThisLevel) || bobbleheadsFoundThisLevel.length > 0 ? (
          <span className="flex items-center justify-center gap-1 text-white/40">
            {tookPerkThisLevel && perkTakenThisLevel ? (
              <Tooltip title={`Perk: ${getPerkDisplayName(perkTakenThisLevel, gender)}`}>
                <span className="inline-flex">
                  <PerkIcon perk={perkTakenThisLevel} size="0.75rem" />
                </span>
              </Tooltip>
            ) : null}
            {bobbleheadsFoundThisLevel.map((bobblehead) => (
              <Tooltip key={bobblehead} title={`Bobblehead: ${bobblehead}`}>
                <span className="inline-flex">
                  <BobbleheadIcon bobblehead={bobblehead} size="0.75rem" />
                </span>
              </Tooltip>
            ))}
          </span>
        ) : null}
      </div>
      {specialStats.map((stat: SpecialStat) => (
        <div key={stat} className={rowClassName}>
          <Typography
            {...(previousLevel && level.special[stat] > previousLevel.special[stat]
              ? { color: 'secondary' }
              : {})}
          >
            {level.special[stat]}
          </Typography>
        </div>
      ))}
      <div className={`${rowClassName} hidden xl:flex`}>
        <Typography
          {...(previousLevel && level.hitPoints > previousLevel.hitPoints
            ? { color: 'secondary' }
            : {})}
        >
          {level.hitPoints}
        </Typography>
      </div>
      <div className={`${rowClassName} hidden xl:flex`}>
        <Typography
          {...(previousLevel && level.actionPoints > previousLevel.actionPoints
            ? { color: 'secondary' }
            : {})}
        >
          {level.actionPoints}
        </Typography>
      </div>
      <div className={`${rowClassName} hidden xl:flex`}>
        <Typography
          {...(previousLevel && level.carryWeight > previousLevel.carryWeight
            ? { color: 'secondary' }
            : {})}
        >
          {level.carryWeight}
        </Typography>
      </div>
      <div className={rowClassName}>
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
