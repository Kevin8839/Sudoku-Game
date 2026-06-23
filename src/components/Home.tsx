import React, { useState } from 'react';
import { Settings, Play } from 'lucide-react';
import { Difficulty, GameSettings } from '../types';
import { cn } from '../utils/cn';

interface HomeProps {
  onStart: (settings: GameSettings) => void;
}

export function Home({ onStart }: HomeProps) {
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [showLives, setShowLives] = useState(true);
  const [showHints, setShowHints] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-slate-50 text-slate-800 p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Sudoku</h1>
          <p className="text-slate-500">Train your brain, one grid at a time.</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Difficulty</label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={cn(
                    "py-3 px-4 rounded-xl font-medium transition-all duration-200 capitalize",
                    difficulty === level
                      ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Settings</label>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-100 cursor-pointer" onClick={() => setShowLives(!showLives)}>
                <span className="font-medium text-slate-700 select-none">Show Lives (Mistakes)</span>
                <div className={cn(
                  "w-11 h-6 rounded-full transition-colors flex items-center px-1",
                  showLives ? "bg-blue-600" : "bg-slate-300"
                )}>
                  <div className={cn(
                    "w-4 h-4 rounded-full bg-white transition-transform duration-200",
                    showLives ? "translate-x-5" : "translate-x-0"
                  )} />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-100 cursor-pointer" onClick={() => setShowHints(!showHints)}>
                <span className="font-medium text-slate-700 select-none">Show Hints Option</span>
                <div className={cn(
                  "w-11 h-6 rounded-full transition-colors flex items-center px-1",
                  showHints ? "bg-blue-600" : "bg-slate-300"
                )}>
                  <div className={cn(
                    "w-4 h-4 rounded-full bg-white transition-transform duration-200",
                    showHints ? "translate-x-5" : "translate-x-0"
                  )} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => onStart({ difficulty, showLives, showHints })}
          className="w-full py-4 rounded-xl bg-slate-900 text-white font-semibold text-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-lg active:scale-[0.98]"
        >
          <Play className="w-5 h-5 fill-current" />
          Start Game
        </button>
      </div>
    </div>
  );
}
