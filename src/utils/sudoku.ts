function isValid(board: number[], idx: number, value: number): boolean {
  const row = Math.floor(idx / 9);
  const col = idx % 9;
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 9; i++) {
    if (board[row * 9 + i] === value) return false;
    if (board[i * 9 + col] === value) return false;
    const r = boxRow + Math.floor(i / 3);
    const c = boxCol + i % 3;
    if (board[r * 9 + c] === value) return false;
  }
  return true;
}

function countSolutions(board: number[], limit: number = 2): number {
  let count = 0;
  function solve(idx: number) {
    if (idx === 81) {
      count++;
      return;
    }
    if (count >= limit) return;
    if (board[idx] !== 0) {
      solve(idx + 1);
      return;
    }
    for (let v = 1; v <= 9; v++) {
      if (isValid(board, idx, v)) {
        board[idx] = v;
        solve(idx + 1);
        board[idx] = 0;
      }
    }
  }
  solve(0);
  return count;
}

function fillBoard(board: number[]): boolean {
  for (let i = 0; i < 81; i++) {
    if (board[i] === 0) {
      const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      for (let j = numbers.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [numbers[j], numbers[k]] = [numbers[k], numbers[j]];
      }
      for (const v of numbers) {
        if (isValid(board, i, v)) {
          board[i] = v;
          if (fillBoard(board)) return true;
          board[i] = 0;
        }
      }
      return false;
    }
  }
  return true;
}

export function generateSudoku(difficulty: 'easy' | 'medium' | 'hard' | 'expert') {
  const solution = new Array(81).fill(0);
  fillBoard(solution);
  const puzzle = [...solution];
  
  const cluesMap = { easy: 40, medium: 36, hard: 30, expert: 25 };
  const targetClues = cluesMap[difficulty];
  
  const indices = Array.from({ length: 81 }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
     const j = Math.floor(Math.random() * (i + 1));
     [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  
  let currentClues = 81;
  for (const idx of indices) {
    if (currentClues <= targetClues) break;
    const backup = puzzle[idx];
    puzzle[idx] = 0;
    const solutions = countSolutions([...puzzle], 2);
    if (solutions === 1) {
      currentClues--;
    } else {
      puzzle[idx] = backup;
    }
  }
  
  return { puzzle, solution };
}
