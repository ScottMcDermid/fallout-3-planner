import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Gender } from '@/utils/genderUtils';
import type { Skill } from '@/utils/skillUtils';
import type { SpecialSet } from '@/utils/specialUtils';
import { levelTemplate, levelUpTemplate, type Level, type LevelUp } from '@/utils/levelUtils';

import genders from '@/utils/genderUtils';
import skills, { NUM_TAG_SKILLS } from '@/utils/skillUtils';
import { baseSpecial } from '@/utils/specialUtils';

type State = {
  characterName: string;
  gender: Gender;
  special: SpecialSet;
  tagSkills: Skill[];
  isFirstVisit: boolean;
  currentLevel: Level;
  currentLevelUp: LevelUp;
  levels: Level[];
  levelUps: LevelUp[];
  version: number;
};

type Action = {
  setCharacterData: (state: Partial<State>) => void;
  setLevels: (levels: Level[]) => void;
  setLevelUp: (levelUp: LevelUp, level?: number) => void;
  removeLevel: (level: number) => void;
  resetLevels: () => void;
};

type CharacterStore = State & { actions: Action };

const useCharacterStore = create<CharacterStore>()(
  persist(
    (set) => {
      return {
        characterName: '',
        gender: genders[0],
        special: { ...baseSpecial },
        tagSkills: skills.slice(0, NUM_TAG_SKILLS),
        isFirstVisit: true,
        currentLevel: levelTemplate,
        currentLevelUp: levelUpTemplate,
        levels: [],
        levelUps: [],
        version: 1,
        actions: {
          setCharacterData: (state: Partial<State>) => set(() => ({ ...state })),
          setLevels: (levels) =>
            set(() => ({
              currentLevel: levels.length > 0 ? levels[levels.length - 1] : levelTemplate,
              levels,
            })),
          setLevelUp: (levelUp, level) => {
            set((state) => {
              const levelIndex = level === undefined ? state.levelUps.length : level - 2;
              const newLevelUps = state.levelUps.slice(0);
              newLevelUps[levelIndex] = levelUp;
              return { levelUps: newLevelUps };
            });
          },
          removeLevel: (level) =>
            set((state) => {
              const newLevelUps = state.levelUps.slice(0);
              newLevelUps.splice(level - 2, 1);
              return { levelUps: newLevelUps };
            }),
          resetLevels: () =>
            set(() => ({
              currentLevel: levelTemplate,
              currentLevelUp: levelUpTemplate,
              levels: [],
              levelUps: [],
            })),
        },
      };
    },
    {
      name: 'fallout-3-planner',
      version: 1,
      storage: createJSONStorage(
        () => (typeof window !== 'undefined' ? localStorage : ({} as Storage)), // Fallback for SSR; you might implement a noop Storage if needed
      ),
      partialize: (state) => ({
        characterName: state.characterName,
        gender: state.gender,
        special: state.special,
        tagSkills: state.tagSkills,
        isFirstVisit: state.isFirstVisit,
        currentLevel: state.currentLevel,
        currentLevelUp: state.currentLevelUp,
        levels: state.levels,
        levelUps: state.levelUps,
        version: state.version,
      }),
      migrate: (persistedState, version) => {
        // This is a fresh, incompatible schema (Fallout 3 replacing Oblivion).
        // Rather than attempt to map old Oblivion-shaped data onto the new
        // S.P.E.C.I.A.L./skills/perks model, just reset to a fresh default state.
        if (version < 1) {
          console.log('Incompatible save data detected, resetting to default Fallout 3 state...');
          const freshState: State = {
            characterName: '',
            gender: genders[0],
            special: { ...baseSpecial },
            tagSkills: skills.slice(0, NUM_TAG_SKILLS),
            isFirstVisit: true,
            currentLevel: levelTemplate,
            currentLevelUp: levelUpTemplate,
            levels: [],
            levelUps: [],
            version: 1,
          };
          return freshState;
        }

        return persistedState as State;
      },
    },
  ),
);

export { useCharacterStore };
