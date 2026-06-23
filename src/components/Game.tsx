import React, { useState, useEffect } from 'react';
import { Heart, Pause, Play, RotateCcw, Home as HomeIcon } from 'lucide-react';
import { GameSettings, CellData } from '../types';
import { generateSudoku } from '../utils/sudoku';
import { Board } from './Board';
import { Controls } from './Controls';
import { cn } from '../utils/cn';

interface GameProps {
  settings: GameSettings;
  onGoHome: () => void;
}

export function Game({ settings, onGoHome }: GameProps) {
  const [cells, setCells] = useState<CellData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [noteMode, setNoteMode] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVictory, setIsVictory] = useState(false);
  const [hintsLeft, setHintsLeft] = useState(3);
  
  const maxMistakes = 3;

  useEffect(() => {
    initGame();
  }, [settings.difficulty]);

  useEffect(() => {
    let timer: number;
    if (!isPaused && !isVictory && cells.length > 0) {
      timer = window.setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPaused, isVictory, cells.length]);

  const initGame = () => {
    setTimeout(() => {
      const { puzzle, solution } = generateSudoku(settings.difficulty);
      const initialCells: CellData[] = puzzle.map((val, idx) => ({
        index: idx,
        value: val,
        solutionValue: solution[idx],
        isGiven: val !== 0,
        notes: [],
        isError: false,
      }));
      setCells(initialCells);
      setSelectedIndex(null);
      setMistakes(0);
      setTime(0);
      setIsPaused(false);
      setIsVictory(false);
      setHintsLeft(3);
    }, 10);
  };

  const handleNumberInput = (num: number) => {
    if (selectedIndex === null || isPaused || isVictory) return;
    
    const cell = cells[selectedIndex];
    if (cell.isGiven || (cell.value !== 0 && !cell.isError)) return;

    const newCells = [...cells];
    const targetCell = { ...newCells[selectedIndex] };

    if (noteMode) {
      if (targetCell.value !== 0) return;
      const noteIdx = targetCell.notes.indexOf(num);
      if (noteIdx >= 0) {
        targetCell.notes.splice(noteIdx, 1);
      } else {
        targetCell.notes.push(num);
        targetCell.notes.sort((a, b) => a - b);
      }
      newCells[selectedIndex] = targetCell;
      setCells(newCells);
    } else {
      targetCell.value = num;
      if (num !== targetCell.solutionValue) {
        targetCell.isError = true;
        setMistakes((m) => m + 1);
      } else {
        targetCell.isError = false;
        clearNotesOnCorrect(newCells, selectedIndex, num);
      }
      newCells[selectedIndex] = targetCell;
      setCells(newCells);
      checkVictory(newCells);
    }
  };

  const handleHint = () => {
    if (isPaused || isVictory || hintsLeft <= 0) return;

    let targetIdx = selectedIndex;

    if (targetIdx === null || cells[targetIdx].isGiven || (cells[targetIdx].value !== 0 && !cells[targetIdx].isError)) {
      const emptyOrError = cells.filter(c => !c.isGiven && (c.value === 0 || c.isError));
      if (emptyOrError.length === 0) return;

      const noNotes = emptyOrError.filter(c => c.notes.length === 0);
      const pool = noNotes.length > 0 ? noNotes : emptyOrError;
      
      const randomCell = pool[Math.floor(Math.random() * pool.length)];
      targetIdx = randomCell.index;
    }

    if (targetIdx !== null) {
      const newCells = [...cells];
      const cell = newCells[targetIdx];
      const correctValue = cell.solutionValue;
      
      newCells[targetIdx] = { 
        ...cell, 
        value: correctValue, 
        isError: false, 
        notes: [] 
      };
      
      clearNotesOnCorrect(newCells, targetIdx, correctValue);
      setCells(newCells);
      setHintsLeft(prev => prev - 1);
      setSelectedIndex(targetIdx);
      checkVictory(newCells);
    }
  };

  const clearNotesOnCorrect = (currentCells: CellData[], idx: number, num: number) => {
    const row = Math.floor(idx / 9);
    const col = idx % 9;
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 81; i++) {
      const r = Math.floor(i / 9);
      const c = i % 9;
      const boxR = Math.floor(r / 3) * 3;
      const boxC = Math.floor(c / 3) * 3;
      
      if ((r === row || c === col || (boxR === boxRow && boxC === boxCol)) && currentCells[i].notes.includes(num)) {
         currentCells[i].notes = currentCells[i].notes.filter(n => n !== num);
      }
    }
  };

  const checkVictory = (currentCells: CellData[]) => {
    const complete = currentCells.every(c => c.value !== 0 && !c.isError);
    if (complete) {
      setIsVictory(true);
    }
  };

  const handleClear = () => {
    if (selectedIndex === null || isPaused || isVictory) return;
    const cell = cells[selectedIndex];
    if (cell.isGiven) return;
    
    const newCells = [...cells];
    newCells[selectedIndex] = { ...cell, value: 0, isError: false, notes: [] };
    setCells(newCells);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (!isVictory) setIsPaused(prev => !prev);
        return;
      }

      if (isPaused || isVictory) return;

      if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(parseInt(e.key));
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        handleClear();
      } else if (e.key === 'Shift') {
        setNoteMode(prev => !prev);
      } else if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        setSelectedIndex(prev => {
          if (prev === null) return 40;
          let newIdx = prev;
          if (e.key === 'ArrowUp' && newIdx >= 9) newIdx -= 9;
          if (e.key === 'ArrowDown' && newIdx < 72) newIdx += 9;
          if (e.key === 'ArrowLeft' && newIdx % 9 !== 0) newIdx -= 1;
          if (e.key === 'ArrowRight' && newIdx % 9 !== 8) newIdx += 1;
          return newIdx;
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, isPaused, isVictory, noteMode, cells, hintsLeft]);

  const numberCounts = cells.reduce((acc, cell) => {
    if (cell.value !== 0 && !cell.isError) {
      acc[cell.value] = (acc[cell.value] || 0) + 1;
    }
    return acc;
  }, {} as Record<number, number>);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const renderOverlay = () => {
    if (!isPaused && !isVictory) return null;
    
    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm animate-in fade-in rounded-sm">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">
          {isVictory ? 'Puzzle Solved!' : 'Paused'}
        </h2>
        {isVictory && (
           <p className="text-slate-500 mb-8 max-w-[250px] text-center text-sm">
             Outstanding! You completed the {settings.difficulty} difficulty in {formatTime(time)}
             {settings.showHints 
               ? (hintsLeft === 3 ? " without any hint." : ` with ${3 - hintsLeft} hint${3 - hintsLeft > 1 ? 's' : ''} used.`) 
               : "."}
           </p>
        )}
        <div className="space-y-4 w-48">
          {isPaused && !isVictory && (
            <button 
              onClick={() => setIsPaused(false)}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 flex justify-center items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current"/> Resume
            </button>
          )}
          <button 
            onClick={initGame}
            className="w-full py-3 rounded-xl bg-slate-200 text-slate-800 font-medium hover:bg-slate-300 flex justify-center items-center gap-2"
          >
            <RotateCcw className="w-4 h-4"/> Restart
          </button>
          <button 
            onClick={onGoHome}
            className="w-full py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-medium hover:bg-slate-50 flex justify-center items-center gap-2"
          >
            <HomeIcon className="w-4 h-4"/> Home
          </button>
        </div>
      </div>
    );
  };

  if (cells.length === 0) {
    return <div className="min-h-[100dvh] flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
    </div>;
  }

  return (
    <div className="min-h-[100dvh] flex flex-col bg-slate-50 text-slate-800 overflow-hidden" style={{ touchAction: 'manipulation' }}>
      {/* Header */}
      <header className="px-4 py-4 sm:px-6 sm:py-6 flex justify-between items-center max-w-2xl w-full mx-auto">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{settings.difficulty}</span>
          <span className="text-lg font-bold font-mono tracking-tight text-slate-700">{formatTime(time)}</span>
        </div>
        
        <div className="flex items-center gap-4 sm:gap-6">
          {settings.showLives && (
            <div className="flex items-center gap-1.5">
              {Array.from({ length: maxMistakes }).map((_, i) => (
                <Heart 
                  key={i} 
                  className={cn(
                    "w-5 h-5 transition-colors duration-300",
                    i < maxMistakes - mistakes ? "fill-red-500 text-red-500" : "fill-slate-200 text-slate-200"
                  )} 
                />
              ))}
            </div>
          )}
          
          <button 
            onClick={() => setIsPaused(true)}
            className="p-2 -mr-2 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <Pause className="w-6 h-6 fill-current"/>
          </button>
        </div>
      </header>

      {/* Main Board Area */}
      <main className="flex-1 w-full px-2 pb-6 max-w-2xl mx-auto flex flex-col justify-center">
        <div className="relative">
          <Board 
            cells={cells} 
            selectedIndex={selectedIndex} 
            onSelect={(idx) => !isPaused && !isVictory && setSelectedIndex(idx)} 
          />
          {renderOverlay()}
        </div>
        
        <Controls 
          onNumberPress={handleNumberInput}
          onClear={handleClear}
          noteMode={noteMode}
          onToggleNoteMode={() => setNoteMode(!noteMode)}
          numberCounts={numberCounts}
          showCounts={settings.showHints}
          hintsLeft={hintsLeft}
          onHint={handleHint}
        />
      </main>
    </div>
  );
}
