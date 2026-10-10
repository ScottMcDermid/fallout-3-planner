import React, { useMemo, useState, useEffect } from 'react';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { Box, Button, IconButton, LinearProgress, Tooltip, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import type { Level, LevelUp } from '@/utils/levelUtils';
import { applyLevelUpToLevel, getSkillPointsForLevel, hasEducatedPerk, countPerkRanksTaken } from '@/utils/levelUtils';

import SkillSelector from '@/components/SkillSelector';
import SkillFineTuner from '@/components/SkillFineTuner';
import LevelRow from '@/components/LevelRow';

import { useCharacterStore } from '@/data/characterStore';

import specialStats, { MAX_SPECIAL_LEVEL, skillsBySpecial, specialIcons } from '@/utils/specialUtils';
import type { SpecialStat } from '@/utils/specialUtils';
import skills, { MAX_SKILL_LEVEL, type Skill, type SkillsSet, getSkillsSetTemplate, sumSkillSet } from '@/utils/skillUtils';
import perks, { INTENSE_TRAINING, TAG_PERK, getPerkDisplayName, type Perk } from '@/utils/perkUtils';

function meetsRequirements(level: Level, perk: Perk): boolean {
  const { special: specialReqs, skills: skillReqs } = perk.requirements ?? {};
  if (specialReqs) {
    for (const [stat, min] of Object.entries(specialReqs)) {
      if (level.special[stat as SpecialStat] < (min ?? 0)) return false;
    }
  }
  if (skillReqs) {
    for (const [skill, min] of Object.entries(skillReqs)) {
      if (level.skills[skill as Skill] < (min ?? 0)) return false;
    }
  }
  return true;
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
  const [specialIncrease, setSpecialIncrease] = useState<SpecialStat | undefined>(
    levelUp?.specialIncrease,
  );
  const [newTagSkill, setNewTagSkill] = useState<Skill | undefined>(levelUp?.tagSkill);

  const pointsAvailable = useMemo(
    () => getSkillPointsForLevel(level.special.Intelligence, hasEducatedPerk(level.perksTaken)),
    [level.special.Intelligence, level.perksTaken],
  );

  const pointsSpent = useMemo(
    () => skills.reduce((sum, skill) => sum + (skillUps[skill] ?? 0), 0),
    [skillUps],
  );

  const availablePerks = useMemo(
    () =>
      perks.filter(
        (perk) =>
          perk.level <= level.level + 1 &&
          countPerkRanksTaken(level.perksTaken, perk.name) < perk.ranks &&
          meetsRequirements(level, perk),
      ),
    [level],
  );

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
    }),
    [skillUps, selectedPerk, specialIncrease, newTagSkill],
  );

  const baseSkills = useMemo(() => sumSkillSet(level.skills, getSkillsSetTemplate()), [level]);

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
  };

  return (
    <>
      {/* padding for level column */}
      <div></div>
      {specialStats.map(
        (stat) =>
          skillsBySpecial[stat].length > 0 && (
            <div key={stat}>
              {skillsBySpecial[stat].map((skill) => (
                <Box key={`${level.level}-${skill}`} className={compact ? 'w-full sm:w-16' : 'w-full sm:w-16 lg:w-[6.5rem]'}>
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
          ),
      )}
      {/* padding for derived stat columns on xl */}
      <div className="hidden xl:block"></div>
      <div className="hidden xl:block"></div>
      <div className="hidden xl:block"></div>

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

      {/* Perk picker */}
      <div className="col-span-full w-full px-2 py-2">
        <Typography variant="caption" className="block pb-1 text-gray-400">
          Choose a perk (required)
        </Typography>
        <div className="flex max-h-48 flex-col gap-1 overflow-y-auto">
          {availablePerks.map((perk) => (
            <Button
              key={perk.name}
              variant={selectedPerk === perk.name ? 'contained' : 'outlined'}
              size="small"
              className="flex-col items-start normal-case"
              onClick={() => {
                setSelectedPerk(perk.name);
                if (perk.name !== INTENSE_TRAINING) setSpecialIncrease(undefined);
                if (perk.name !== TAG_PERK) setNewTagSkill(undefined);
              }}
            >
              <span className="text-xs font-bold">{getPerkDisplayName(perk.name, gender)}</span>
              <span className="text-left text-xs normal-case opacity-80">{perk.description}</span>
            </Button>
          ))}
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

      {/* Padding for modify level row */}
      <div className="xl:col-span-10">
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
          {selectedPerk ? ` · Perk: ${getPerkDisplayName(selectedPerk, gender)}` : ' · No perk selected'}
        </div>
      </div>
    </>
  );
}
