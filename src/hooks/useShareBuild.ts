'use client';

import { useCallback } from 'react';
import { useCharacterStore } from '@/data/characterStore';
import { encodeBuild, type BuildData } from '@/utils/buildCodec';

/**
 * Hook that provides a function to generate a shareable URL for the current build.
 */
export function useShareBuild() {
  const state = useCharacterStore();

  const getShareUrl = useCallback((): string => {
    const buildData: BuildData = {
      characterName: state.characterName ?? '',
      gender: state.gender,
      special: state.special,
      tagSkills: state.tagSkills,
      levelUps: state.levelUps,
    };

    const code = encodeBuild(buildData);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/b/${code}`;
  }, [state.characterName, state.gender, state.special, state.tagSkills, state.levelUps]);

  const copyShareUrl = useCallback(async (): Promise<boolean> => {
    try {
      const url = getShareUrl();
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      return false;
    }
  }, [getShareUrl]);

  return { getShareUrl, copyShareUrl };
}
