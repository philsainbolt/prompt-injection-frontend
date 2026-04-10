// Level 1 is always unlocked; subsequent levels require the previous level to be beaten
export function isLevelUnlocked(levelId, beatenLevels) {
  if (String(levelId) === '1') return true;
  const previousId = String(Number(levelId) - 1);
  return beatenLevels.map(String).includes(previousId);
}
