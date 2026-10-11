'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';

import type { Gender } from '@/utils/genderUtils';
import type { Skill } from '@/utils/skillUtils';
import type { SpecialSet } from '@/utils/specialUtils';

import specialStats, { shorthandBySpecial, skillsBySpecial } from '@/utils/specialUtils';
import { getPerkDisplayName } from '@/utils/perkUtils';
import SkillIcon from '@/components/SkillIcon';
import PerkIcon from '@/components/PerkIcon';
import { Panel, PanelHeader } from '@/components/Panel';

interface CharacterSummaryProps {
  characterName?: string;
  gender: Gender;
  special: SpecialSet;
  tagSkills: Skill[];
  perksTaken: string[];
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
      <Typography variant="caption">{value}</Typography>
    </Box>
  );
}

export default function CharacterSummary({
  characterName,
  gender,
  special,
  tagSkills,
  perksTaken,
}: CharacterSummaryProps) {
  return (
    <div>
      {/* Character panel */}
      <Panel>
        <PanelHeader label={characterName || 'Character'} />
        <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <InfoRow label="Gender" value={gender} />
        </Box>
      </Panel>

      {/* S.P.E.C.I.A.L. panel */}
      <Panel>
        <PanelHeader label="S.P.E.C.I.A.L." />
        <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {specialStats.map((stat) => (
            <InfoRow key={stat} label={`${stat} (${shorthandBySpecial[stat]})`} value={`${special[stat]}`} />
          ))}
        </Box>
      </Panel>

      {/* Skills panel */}
      <Panel>
        <PanelHeader label="Tag Skills" />
        <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {specialStats.map((stat) => {
            const tagged = skillsBySpecial[stat].filter((skill) => tagSkills.includes(skill));
            if (tagged.length === 0) return null;
            return (
              <Box key={stat} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', width: '2rem', flexShrink: 0, fontSize: '0.7rem' }}>
                  {shorthandBySpecial[stat]}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {tagged.map((skill) => (
                    <Chip
                      key={skill}
                      icon={<SkillIcon skill={skill} size={14} />}
                      label={skill}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Panel>

      {/* Perks panel */}
      {perksTaken.length > 0 && (
        <Panel>
          <PanelHeader label="Perks" />
          <Box sx={{ p: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {perksTaken.map((perk, i) => (
              <Chip
                key={`${perk}-${i}`}
                icon={<PerkIcon perk={perk} size={14} />}
                label={getPerkDisplayName(perk, gender)}
                size="small"
                variant="outlined"
              />
            ))}
          </Box>
        </Panel>
      )}
    </div>
  );
}
