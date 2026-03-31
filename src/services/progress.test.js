import { describe, expect, it } from 'vitest';
import { isLevelUnlocked } from './progress';

describe('level locking logic', () => {
  it('always unlocks level 1', () => {
    expect(isLevelUnlocked('1', [])).toBe(true);
  });

  it('locks higher levels until previous level is beaten', () => {
    expect(isLevelUnlocked('2', [])).toBe(false);
    expect(isLevelUnlocked('3', ['1'])).toBe(false);
  });

  it('unlocks next level when previous level is beaten', () => {
    expect(isLevelUnlocked('2', ['1'])).toBe(true);
    expect(isLevelUnlocked('5', ['1', '2', '3', '4'])).toBe(true);
  });
});
