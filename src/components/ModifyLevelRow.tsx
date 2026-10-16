import React, { useMemo, useState, useEffect } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Box, Button, IconButton, LinearProgress, TextField, Tooltip, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import type { Level, LevelUp } from '@/utils/levelUtils';
import { applyLevelUpToLevel, getSkillPointsForLevel, hasEducatedPerk, countPerkRanksTaken } from '@/utils/levelUtils';

import SkillSelector from '@/components/SkillSelector';
import SkillFineTuner from '@/components/SkillFineTuner';
import LevelRow from '@/components/LevelRow';
import PerkIcon from '@/components/PerkIcon';
import BobbleheadIcon from '@/components/BobbleheadIcon';

import { useCharacterStore } from '@/data/characterStore';

import specialStats, { MAX_SPECIAL_LEVEL, skillsBySpecial, specialIcons } from '@/utils/specialUtils';
import type { SpecialStat } from '@/utils/specialUtils';
import skills, { MAX_SKILL_LEVEL, type Skill, type SkillsSet, getSkillsSetTemplate, sumSkillSet } from '@/utils/skillUtils';
import perks, { INTENSE_TRAINING, TAG_PERK, getPerkDisplayName, type Perk } from '@/utils/perkUtils';
import bobbleheads, { hasTakenBobblehead } from '@/utils/bobbleheadUtils';

function getUnmetRequirements(level: Level, perk: Perk): string[] {
  const { special: specialReqs, skills: skillReqs } = perk.requirements ?? {};
  const unmet: string[] = [];
  if (perk.level > level.level + 1) {
    unmet.push(`Level ${perk.level}`);
  }
  if (specialReqs) {
    for (const [stat, min] of Object.entries(specialReqs)) {
      const have = level.special[stat as SpecialStat];
      if (have < (min ?? 0)) unmet.push(`${stat} ${min} (have ${have})`);
    }
  }
  if (skillReqs) {
    for (const [skill, min] of Object.entries(skillReqs)) {
      const have = level.skills[skill as Skill];
      if (have < (min ?? 0)) unmet.push(`${skill} ${min} (have ${have})`);
    }
  }
  return unmet;
}

export default function ModifyLevelRow({
  level,
  levelUp,
  compact,
  onCommitLevelUp,
  onLevelUpChange,
  onCancelHandler,
}: {
  level: Level;
  levelUp?: LevelUp;
  compact?: boolean;
  onCommitLevelUp: (levelUp: LevelUp) => void;
  onLevelUpChange?: (levelUp: LevelUp) => void;
  onCancelHandler?: () => void;
}) {
  const { tagSkills, gender, actions: { setCharacterData } } = useCharacterStore();

  const [skillUps, setSkillUps] = useState<SkillsSet>(
    levelUp ? levelUp.skillPoints : getSkillsSetTemplate(),
  );
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [selectedPerk, setSelectedPerk] = useState<string | null>(levelUp?.perk ?? null);
  const [selectedBobbleheads, setSelectedBobbleheads] = useState<string[]>(levelUp?.bobbleheads ?? []);
  const [specialIncrease, setSpecialIncrease] = useState<SpecialStat | undefined>(
    levelUp?.specialIncrease,
  );
  const [newTagSkill, setNewTagSkill] = useState<Skill | undefined>(levelUp?.tagSkill);
  const [perkSearch, setPerkSearch] = useState('');
  const [bobbleheadSearch, setBobbleheadSearch] = useState('');

  const pointsAvailable = useMemo(
    () => getSkillPointsForLevel(level.special.Intelligence, hasEducatedPerk(level.perksTaken)),
    [level.special.Intelligence, level.perksTaken],
  );

  const pointsSpent = useMemo(
    () => skills.reduce((sum, skill) => sum + (skillUps[skill] ?? 0), 0),
    [skillUps],
  );

  const availablePerks = useMemo(
    () => perks.filter((perk) => countPerkRanksTaken(level.perksTaken, perk.name) < perk.ranks),
    [level],
  );

  const filteredPerks = useMemo(() => {
    const query = perkSearch.trim().toLowerCase();
    if (!query) return availablePerks;
    return availablePerks.filter(
      (perk) =>
        getPerkDisplayName(perk.name, gender).toLowerCase().includes(query) ||
        perk.description.toLowerCase().includes(query),
    );
  }, [availablePerks, perkSearch, gender]);

  const availableBobbleheads = useMemo(
    () => bobbleheads.filter((bobblehead) => !hasTakenBobblehead(level.bobbleheadsFound, bobblehead.name)),
    [level],
  );

  const filteredBobbleheads = useMemo(() => {
    const query = bobbleheadSearch.trim().toLowerCase();
    if (!query) return availableBobbleheads;
    return availableBobbleheads.filter(
      (bobblehead) =>
        bobblehead.name.toLowerCase().includes(query) ||
        bobblehead.description.toLowerCase().includes(query),
    );
  }, [availableBobbleheads, bobbleheadSearch]);

  const toggleBobblehead = (name: string) => {
    setSelectedBobbleheads((current) =>
      current.includes(name) ? current.filter((b) => b !== name) : [...current, name],
    );
  };

  const handleSkillSelected = (skill: Skill) => {
    setSkillUps({
      ...skillUps,
      [skill]: Math.max(0, Math.min(MAX_SKILL_LEVEL - level.skills[skill], pointsAvailable - pointsSpent)),
    });
    setSelectedSkill(skill);
  };

  const handleSkillUnselected = (skill: Skill) => {
    setSkillUps({ ...skillUps, [skill]: 0 });
    setSelectedSkill(skill);
  };

  const handleSkillIncremented = (skill: Skill) => {
    setSkillUps({ ...skillUps, [skill]: skillUps[skill] + 1 });
    setSelectedSkill(skill);
  };

  const handleSkillDecremented = (skill: Skill) => {
    setSkillUps({ ...skillUps, [skill]: skillUps[skill] - 1 });
    setSelectedSkill(skill);
  };

  const currentLevelUp: LevelUp = useMemo(
    () => ({
      skillPoints: skillUps,
      perk: selectedPerk,
      specialIncrease,
      tagSkill: newTagSkill,
      bobbleheads: selectedBobbleheads,
    }),
    [skillUps, selectedPerk, specialIncrease, newTagSkill, selectedBobbleheads],
  );

  const baseSkills = useMemo(() => sumSkillSet(level.skills, getSkillsSetTemplate()), [level]);

  // Split all skills into two even rows, spread across the width rather than
  // crammed into a single line.
  const skillRows = useMemo(() => {
    const allSkills = specialStats.flatMap((stat) => skillsBySpecial[stat]);
    const half = Math.ceil(allSkills.length / 2);
    return [allSkills.slice(0, half), allSkills.slice(half)];
  }, []);

  useEffect(() => {
    onLevelUpChange?.(currentLevelUp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLevelUp]);

  const nextLevel = useMemo(() => applyLevelUpToLevel(level, currentLevelUp), [level, currentLevelUp]);

  const canLevelUp = useMemo(
    () =>
      pointsSpent === pointsAvailable &&
      selectedPerk !== null &&
      (selectedPerk !== INTENSE_TRAINING || !!specialIncrease) &&
      (selectedPerk !== TAG_PERK || !!newTagSkill),
    [pointsSpent, pointsAvailable, selectedPerk, specialIncrease, newTagSkill],
  );

  const handleCommit = () => {
    onCommitLevelUp(currentLevelUp);
    if (selectedPerk === TAG_PERK && newTagSkill && !tagSkills.includes(newTagSkill)) {
      setCharacterData({ tagSkills: [...tagSkills, newTagSkill] });
    }
    setSkillUps(getSkillsSetTemplate());
    setSelectedSkill(null);
    setSelectedPerk(null);
    setSpecialIncrease(undefined);
    setNewTagSkill(undefined);
    setSelectedBobbleheads([]);
    setPerkSearch('');
    setBobbleheadSearch('');
  };

  return (
    <>
      {/* padding for level column */}
      <div></div>
      {/* padding for special stat columns — skills are listed side by side below instead */}
      {specialStats.map((stat) => (
        <div key={stat}></div>
      ))}
      {/* padding for derived stat columns on xl */}
      <div className="hidden xl:block"></div>
      <div className="hidden xl:block"></div>
      <div className="hidden xl:block"></div>

      {/* Skill selectors — side by side rather than grouped under their S.P.E.C.I.A.L. stat */}
      <div className="col-span-full flex w-full flex-col gap-5 px-2 py-4">
        <Typography
          variant="caption"
          className="text-center"
          sx={{ color: pointsSpent === pointsAvailable ? 'text.secondary' : 'error.main' }}
        >
          {pointsSpent < pointsAvailable
            ? `Spend ${pointsAvailable - pointsSpent} more skill point${
                pointsAvailable - pointsSpent === 1 ? '' : 's'
              } (${pointsSpent}/${pointsAvailable})`
            : pointsSpent > pointsAvailable
              ? `${pointsSpent - pointsAvailable} skill point${
                  pointsSpent - pointsAvailable === 1 ? '' : 's'
                } over the limit (${pointsSpent}/${pointsAvailable})`
              : `All ${pointsAvailable} skill points spent`}
        </Typography>
        {skillRows.map((row, i) => (
          <div key={i} className="flex w-full flex-wrap items-start justify-center gap-x-6 gap-y-4">
            {row.map((skill) => (
              <Box key={`${level.level}-${skill}`} className={compact ? 'w-full sm:w-16' : 'w-full sm:w-16 lg:w-36'}>
                <SkillSelector
                  skill={skill}
                  compact={compact}
                  color={skillUps[skill] > 0 ? 'secondary' : ''}
                  base={baseSkills[skill]}
                  value={level.skills[skill] + skillUps[skill]}
                  tag={tagSkills.includes(skill)}
                  selectHandler={() => handleSkillSelected(skill)}
                  unselectHandler={() => handleSkillUnselected(skill)}
                  incrementHandler={() => handleSkillIncremented(skill)}
                  decrementHandler={() => handleSkillDecremented(skill)}
                />
              </Box>
            ))}
          </div>
        ))}
      </div>

      <div className="col-span-full w-full justify-start">
        {selectedSkill && (
          <SkillFineTuner
            className={compact ? '' : 'lg:hidden'}
            compact={compact}
            skill={selectedSkill}
            value={skillUps[selectedSkill]}
            onIncrement={() => {
              setSkillUps({ ...skillUps, [selectedSkill]: skillUps[selectedSkill] + 1 });
            }}
            onDecrement={() => {
              setSkillUps({ ...skillUps, [selectedSkill]: skillUps[selectedSkill] - 1 });
            }}
          />
        )}
      </div>

      {/* Perk & Bobblehead pickers — side by side when there's room, stacked otherwise */}
      <div className="col-span-full flex w-full flex-wrap gap-2 px-2 py-2">
        <div className="min-w-[16rem] flex-[2]">
          <Typography variant="subtitle2" className="block pb-1 font-bold tracking-wide text-gray-100 uppercase">
            Choose a perk <span className="text-[11px] font-normal tracking-normal text-gray-500 normal-case">(required)</span>
          </Typography>
          <TextField
            value={perkSearch}
            onChange={(e) => setPerkSearch(e.target.value)}
            placeholder="Search perks…"
            variant="outlined"
            size="small"
            fullWidth
            className="pb-1.5"
            slotProps={{ input: { className: 'text-xs' } }}
          />
          <div className="rounded-lg border border-white/10 bg-black/20 p-1.5 shadow-inner">
            {filteredPerks.length > 0 ? (
              <div className="grid max-h-64 grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-1.5 overflow-y-auto pr-1">
                {filteredPerks.map((perk) => {
                  const nextRank = countPerkRanksTaken(level.perksTaken, perk.name) + 1;
                  const unmetRequirements = getUnmetRequirements(level, perk);
                  const locked = unmetRequirements.length > 0;
                  const button = (
                    <Button
                      key={perk.name}
                      variant={selectedPerk === perk.name ? 'contained' : 'outlined'}
                      size="small"
                      disabled={locked}
                      className="h-full flex-col items-start justify-start gap-0.5 whitespace-normal rounded-md px-2 py-1.5 text-left normal-case"
                      onClick={() => {
                        setSelectedPerk(perk.name);
                        if (perk.name !== INTENSE_TRAINING) setSpecialIncrease(undefined);
                        if (perk.name !== TAG_PERK) setNewTagSkill(undefined);
                      }}
                    >
                      <span className="flex items-center gap-1 text-xs leading-tight font-bold">
                        <PerkIcon perk={perk.name} size={14} />
                        {getPerkDisplayName(perk.name, gender)}
                        {perk.ranks > 1 && (
                          <span className="font-normal opacity-70">
                            ({nextRank}/{perk.ranks})
                          </span>
                        )}
                      </span>
                      <span className="text-left text-[11px] leading-snug normal-case opacity-80">{perk.description}</span>
                      {locked && (
                        <span className="text-left text-[11px] leading-snug normal-case text-amber-400/90">
                          Requires {unmetRequirements.join(', ')}
                        </span>
                      )}
                    </Button>
                  );
                  return locked ? (
                    <Tooltip key={perk.name} title={`Requires ${unmetRequirements.join(', ')}`} arrow>
                      <span className="h-full">{button}</span>
                    </Tooltip>
                  ) : (
                    button
                  );
                })}
              </div>
            ) : (
              <Typography variant="caption" className="block p-2 text-center text-gray-500 italic">
                No perks match your search
              </Typography>
            )}
          </div>

          {selectedPerk === INTENSE_TRAINING && (
            <div className="pt-2">
              <Typography variant="caption" className="block pb-1 text-gray-400">
                Choose a S.P.E.C.I.A.L. stat to increase
              </Typography>
              <div className="flex flex-wrap gap-1">
                {specialStats.map((stat) => {
                  const Icon = specialIcons[stat];
                  const disabled = level.special[stat] >= MAX_SPECIAL_LEVEL;
                  return (
                    <Button
                      key={stat}
                      size="small"
                      disabled={disabled}
                      variant={specialIncrease === stat ? 'contained' : 'outlined'}
                      onClick={() => setSpecialIncrease(stat)}
                    >
                      <Icon size={14} style={{ marginRight: 4 }} />
                      {stat}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedPerk === TAG_PERK && (
            <div className="pt-2">
              <Typography variant="caption" className="block pb-1 text-gray-400">
                Choose a fourth tag skill
              </Typography>
              <div className="flex flex-wrap gap-1">
                {skills
                  .filter((skill) => !tagSkills.includes(skill))
                  .map((skill) => (
                    <Button
                      key={skill}
                      size="small"
                      variant={newTagSkill === skill ? 'contained' : 'outlined'}
                      onClick={() => setNewTagSkill(skill)}
                    >
                      {skill}
                    </Button>
                  ))}
              </div>
            </div>
          )}
        </div>

        <div className="min-w-[16rem] flex-1">
          <Typography variant="subtitle2" className="block pb-1 font-bold tracking-wide text-gray-100 uppercase">
            Found a bobblehead?{' '}
            <span className="text-[11px] font-normal tracking-normal text-gray-500 normal-case">
              (optional, select any number)
            </span>
          </Typography>
          <TextField
            value={bobbleheadSearch}
            onChange={(e) => setBobbleheadSearch(e.target.value)}
            placeholder="Search bobbleheads…"
            variant="outlined"
            size="small"
            fullWidth
            className="pb-1.5"
            slotProps={{ input: { className: 'text-xs' } }}
          />
          <div className="rounded-lg border border-white/10 bg-black/20 p-1.5 shadow-inner">
            {filteredBobbleheads.length > 0 ? (
              <div className="grid max-h-64 grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-1.5 overflow-y-auto pr-1">
                {filteredBobbleheads.map((bobblehead) => {
                  const selected = selectedBobbleheads.includes(bobblehead.name);
                  return (
                    <Button
                      key={bobblehead.name}
                      variant={selected ? 'contained' : 'outlined'}
                      size="small"
                      className="h-full flex-col items-start justify-start gap-0.5 whitespace-normal rounded-md px-2 py-1.5 text-left normal-case"
                      onClick={() => toggleBobblehead(bobblehead.name)}
                    >
                      <span className="flex items-center gap-1 text-xs leading-tight font-bold">
                        <BobbleheadIcon bobblehead={bobblehead.name} size={14} />
                        {bobblehead.name}
                      </span>
                      <span className="text-left text-[11px] leading-snug normal-case opacity-80">
                        {selected ? 'Click to remove' : bobblehead.description}
                      </span>
                    </Button>
                  );
                })}
              </div>
            ) : (
              <Typography variant="caption" className="block p-2 text-center text-gray-500 italic">
                {availableBobbleheads.length > 0 ? 'No bobbleheads match your search' : 'No bobbleheads remaining'}
              </Typography>
            )}
          </div>
        </div>
      </div>

      {/* Padding for modify level row */}
      <div className="col-span-full flex w-full justify-end">
        {onCancelHandler ? (
          <Tooltip title="Cancel">
            <IconButton
              className="p-0 px-1"
              aria-label="Cancel"
              onClick={() => onCancelHandler()}
              sx={(theme) => ({
                color: theme.palette.grey[500],
              })}
            >
              <CloseIcon />
            </IconButton>
          </Tooltip>
        ) : null}
      </div>
      <LevelRow level={nextLevel} previousLevel={level} />

      {/* Footer */}
      <div className="col-span-full w-full">
        <LinearProgress
          className="w-full"
          variant="determinate"
          color="primary"
          value={Math.min((pointsSpent / pointsAvailable) * 100, 100)}
        />
        <Button
          variant="outlined"
          size="large"
          className="w-full"
          onClick={handleCommit}
          {...(!canLevelUp ? { disabled: true } : {})}
        >
          <ArrowUpwardIcon /> <span className="pt-1">Level Up</span>
        </Button>
        <div className="w-full py-2 text-center text-xs text-ghost">
          {pointsSpent}/{pointsAvailable} skill points spent
          {selectedPerk
            ? ` · Perk: ${getPerkDisplayName(selectedPerk, gender)}${
                (perks.find((p) => p.name === selectedPerk)?.ranks ?? 1) > 1
                  ? ` (${countPerkRanksTaken(level.perksTaken, selectedPerk) + 1}/${
                      perks.find((p) => p.name === selectedPerk)?.ranks
                    })`
                  : ''
              }`
            : ' · No perk selected'}
          {selectedBobbleheads.length > 0 ? ` · Bobbleheads: ${selectedBobbleheads.join(', ')}` : ''}
        </div>
      </div>
    </>
  );
}
