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
  const stripeClassName = striped ? 'bg-emerald-400/[0.05]' : '';
  const cellClassName = 'w-full h-full min-h-12 flex items-center justify-center px-0';
  const perkTakenThisLevel = previousLevel
    ? level.perksTaken[level.perksTaken.length - 1]
    : undefined;
  const tookPerkThisLevel = previousLevel && level.perksTaken.length > previousLevel.perksTaken.length;

  const bobbleheadsFoundThisLevel = previousLevel
    ? level.bobbleheadsFound.slice(previousLevel.bobbleheadsFound.length)
    : [];

  const hasPerksOrBobbleheads =
    (tookPerkThisLevel && perkTakenThisLevel) || bobbleheadsFoundThisLevel.length > 0;

  return (
    <div
      className={`col-span-full grid w-full grid-cols-[3rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-center sm:grid-cols-[5rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] xl:grid-cols-[5rem_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] ${stripeClassName}`}
    >
      <div className={`${cellClassName} text-lg`}>
        <span>{level.level}</span>
      </div>
      {specialStats.map((stat: SpecialStat) => (
        <div key={stat} className={cellClassName}>
          <Typography
            {...(previousLevel && level.special[stat] > previousLevel.special[stat]
              ? { color: 'secondary' }
              : {})}
          >
            {level.special[stat]}
          </Typography>
        </div>
      ))}
      <div className={`${cellClassName} hidden xl:flex`}>
        <Typography
          {...(previousLevel && level.hitPoints > previousLevel.hitPoints
            ? { color: 'secondary' }
            : {})}
        >
          {level.hitPoints}
        </Typography>
      </div>
      <div className={`${cellClassName} hidden xl:flex`}>
        <Typography
          {...(previousLevel && level.actionPoints > previousLevel.actionPoints
            ? { color: 'secondary' }
            : {})}
        >
          {level.actionPoints}
        </Typography>
      </div>
      <div className={`${cellClassName} hidden xl:flex`}>
        <Typography
          {...(previousLevel && level.carryWeight > previousLevel.carryWeight
            ? { color: 'secondary' }
            : {})}
        >
          {level.carryWeight}
        </Typography>
      </div>
      <div className={cellClassName}>
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
      {hasPerksOrBobbleheads ? (
        <div className="col-span-full flex w-full flex-wrap items-center justify-start gap-1 px-2 pb-1.5 text-white/40">
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
        </div>
      ) : null}
    </div>
  );
}
