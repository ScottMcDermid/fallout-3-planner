'use client';

import React, { useMemo } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Drawer,
  IconButton,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import DeleteIcon from '@mui/icons-material/Delete';

import type { Gender } from '@/utils/genderUtils';
import type { Skill } from '@/utils/skillUtils';
import type { SpecialStat } from '@/utils/specialUtils';

import { Panel, PanelHeader } from '@/components/Panel';
import ToggleButtons from '@/components/ToggleButtons';
import SkillIcon from '@/components/SkillIcon';
import SpecialSelector from '@/components/SpecialSelector';

import { useCharacterStore } from '@/data/characterStore';

import genders from '@/utils/genderUtils';
import { NUM_TAG_SKILLS, shorthandBySkill } from '@/utils/skillUtils';
import specialStats, {
  EXTRA_SPECIAL_POINTS,
  baseSpecial,
  shorthandBySpecial,
  skillsBySpecial,
} from '@/utils/specialUtils';

export const CHARACTER_DRAWER_WIDTH = 420;

function CharacterContent({ onClose, isDrawer }: { onClose?: () => void; isDrawer?: boolean }) {
  const {
    characterName,
    gender,
    special,
    tagSkills,
    actions: { setCharacterData },
  } = useCharacterStore();

  const specialPointsAllocated = useMemo(
    () => specialStats.reduce((sum, stat) => sum + (special[stat] - baseSpecial[stat]), 0),
    [special],
  );

  const specialPointsRemaining = EXTRA_SPECIAL_POINTS - specialPointsAllocated;

  const tagSkillsRemaining = NUM_TAG_SKILLS - tagSkills.length;

  const handleIncrementSpecial = (stat: SpecialStat) => {
    setCharacterData({ special: { ...special, [stat]: special[stat] + 1 } });
  };

  const handleDecrementSpecial = (stat: SpecialStat) => {
    setCharacterData({ special: { ...special, [stat]: special[stat] - 1 } });
  };

  const handleToggleTagSkill = (skill: Skill) => {
    const newTagSkills = [...tagSkills];
    const idx = newTagSkills.indexOf(skill);
    if (idx === -1) newTagSkills.push(skill);
    else newTagSkills.splice(idx, 1);
    setCharacterData({ tagSkills: newTagSkills });
  };

  return (
    <>
      {/* Character panel */}
      <Panel>
        <PanelHeader
          label={characterName || 'Character'}
          action={
            isDrawer && onClose ? (
              <IconButton size="small" aria-label="close" onClick={onClose}>
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
            ) : undefined
          }
        />
        <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <TextField
            label="Name"
            placeholder="e.g. Lone Wanderer"
            value={characterName ?? ''}
            onChange={(e) => setCharacterData({ characterName: e.target.value.slice(0, 255) })}
            variant="outlined"
            size="small"
            fullWidth
            slotProps={{ htmlInput: { maxLength: 255 } }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem', pl: 0.5 }}>
              Gender
            </Typography>
            <ToggleButtons
              name="Gender"
              value={gender}
              options={genders}
              onChangeHandler={(gender) => setCharacterData({ gender: gender as Gender })}
            />
          </Box>
        </Box>
      </Panel>

      {/* S.P.E.C.I.A.L. panel */}
      <Panel>
        <PanelHeader label="S.P.E.C.I.A.L." />
        <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography
            variant="caption"
            sx={{ color: specialPointsRemaining > 0 ? 'error.main' : 'text.secondary' }}
          >
            {specialPointsRemaining > 0
              ? `Distribute ${specialPointsRemaining} more point${specialPointsRemaining === 1 ? '' : 's'} among your S.P.E.C.I.A.L. stats`
              : 'All extra S.P.E.C.I.A.L. points distributed'}
          </Typography>
          <div className="grid grid-cols-1 gap-y-1 sm:grid-cols-2">
            {specialStats.map((stat) => (
              <SpecialSelector
                key={stat}
                stat={stat}
                value={special[stat]}
                canIncrement={specialPointsAllocated < EXTRA_SPECIAL_POINTS}
                incrementHandler={() => handleIncrementSpecial(stat)}
                decrementHandler={() => handleDecrementSpecial(stat)}
              />
            ))}
          </div>
        </Box>
      </Panel>

      {/* Tag Skills panel */}
      <Panel>
        <PanelHeader label="Tag Skills" />
        <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography
            variant="caption"
            sx={{ color: tagSkillsRemaining > 0 ? 'error.main' : 'text.secondary' }}
          >
            {tagSkillsRemaining > 0
              ? `Choose ${tagSkillsRemaining} more tag skill${tagSkillsRemaining === 1 ? '' : 's'} (each gets +15)`
              : 'All tag skills chosen'}
          </Typography>
          <div className="grid grid-cols-[3.5rem_1fr] place-items-center gap-x-2 gap-y-0.5">
            {specialStats.map(
              (stat) =>
                skillsBySpecial[stat].length > 0 && (
                  <React.Fragment key={stat}>
                    <Box
                      title={stat}
                      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, width: '100%' }}
                    >
                      <Typography variant="caption" sx={{ color: 'text.primary', fontSize: '0.7rem', lineHeight: 1 }}>
                        {shorthandBySpecial[stat]}
                      </Typography>
                    </Box>
                    <ToggleButtonGroup
                      value={tagSkills}
                      sx={{ flexWrap: 'wrap', width: '100%', justifyContent: 'flex-start' }}
                    >
                      {skillsBySpecial[stat].map((skill) => (
                        <ToggleButton
                          key={skill}
                          value={skill}
                          disabled={tagSkillsRemaining <= 0 && !tagSkills.includes(skill)}
                          onChange={() => handleToggleTagSkill(skill)}
                          sx={{ flex: '0 0 5.5rem', width: '5.5rem', py: 0.5, fontSize: '0.7rem' }}
                        >
                          <SkillIcon skill={skill} size={12} style={{ marginRight: 3 }} />
                          {shorthandBySkill[skill]}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  </React.Fragment>
                ),
            )}
          </div>
        </Box>
      </Panel>
    </>
  );
}

export default function CharacterDialog(props: {
  open: boolean;
  levelsExist: boolean;
  handleClose: () => void;
  onReset: () => void;
}) {
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');

  const footer = (
    <Box sx={{ borderTop: '1px solid', borderColor: 'divider', px: 1.5, py: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
      {props.levelsExist && (
        <Button
          size="small"
          color="error"
          variant="outlined"
          startIcon={<DeleteIcon />}
          onClick={props.onReset}
          fullWidth
        >
          Reset levels
        </Button>
      )}
    </Box>
  );

  if (isLargeScreen) {
    return (
      <Drawer
        variant="persistent"
        anchor="right"
        open={props.open}
        sx={{
          width: props.open ? CHARACTER_DRAWER_WIDTH : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: CHARACTER_DRAWER_WIDTH,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            height: '100%',
          },
        }}
      >
        <Box className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto" sx={{ p: 1.5 }}>
          <CharacterContent onClose={props.handleClose} isDrawer />
        </Box>
        {footer}
      </Drawer>
    );
  }

  return (
    <Dialog onClose={props.handleClose} open={props.open} fullWidth maxWidth="xs">
      <IconButton
        aria-label="close"
        onClick={props.handleClose}
        sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent sx={{ pt: 5, pb: 0, px: 1.5 }}>
        <CharacterContent />
      </DialogContent>
      <DialogActions sx={{ flexDirection: 'column', alignItems: 'stretch', p: 0 }}>
        {footer}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1.5, pb: 1 }}>
          <Button onClick={props.handleClose}>Done</Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
