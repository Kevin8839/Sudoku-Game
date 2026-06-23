export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface GameSettings {
  difficulty: Difficulty;
  showLives: boolean;
  showHints: boolean;
}

export interface CellData {
  index: number;
  value: number; // 0 means empty
  solutionValue: number;
  isGiven: boolean;
  notes: number[]; // Set of candidate numbers, unique values 1-9
  isError: boolean;
}

export type GameState = 'home' | 'playing' | 'paused' | 'victory' | 'gameover';
