import React from 'react';
import { Delete, Edit2, Lightbulb } from 'lucide-react';
import { cn } from '../utils/cn';

interface ControlsProps {
  onNumberPress: (num: number) => void;
  onClear: () => void;
  noteMode: boolean;
  onToggleNoteMode: () => void;
  numberCounts: Record<number, number>;
  showCounts: boolean;
  hintsLeft: number;
  onHint: () => void;
}

export function Controls({ onNumberPress, onClear, noteMode, onToggleNoteMode, numberCounts, showCounts, hintsLeft, onHint }: ControlsProps) {
  return (
    <div className="w-full max-w-[450px] mx-auto mt-6 flex gap-3 sm:gap-4 select-none" style={{ touchAction: 'manipulation' }}>
      <div className="grid grid-cols-3 gap-2 sm:gap-3 flex-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
          const count = numberCounts[num] || 0;
          const isComplete = count >= 9;
          
          return (
            <button
              key={num}
              onClick={() => onNumberPress(num)}
              disabled={isComplete}
              className={cn(
                "relative flex items-center justify-center p-3 sm:py-4 rounded-xl text-xl font-medium transition-all outline-none aspect-square sm:aspect-auto",
                isComplete 
                  ? "bg-slate-100/50 text-slate-300 border-transparent shadow-none" 
                  : "bg-white text-slate-700 border border-slate-200 shadow-sm active:bg-blue-50 active:scale-95"
              )}
            >
              {num}
              {showCounts && !isComplete && (
                <span className="absolute top-1 right-1.5 text-[10px] sm:text-xs text-slate-400 font-normal">
                  {count}/9
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 sm:gap-3 w-20 sm:w-28">
        <button
          onClick={onToggleNoteMode}
          className={cn(
            "flex-1 flex flex-col items-center justify-center gap-1 sm:gap-2 p-2 sm:py-4 rounded-xl font-medium transition-all active:scale-95",
            noteMode
              ? "bg-slate-700 text-white shadow-md"
              : "bg-white text-slate-700 border border-slate-200 shadow-sm"
          )}
        >
          <Edit2 className="w-5 h-5" />
          <span className="text-[10px] sm:text-sm">Notes {noteMode ? 'ON' : 'OFF'}</span>
        </button>
        
        {showCounts ? (
          <div className="flex gap-2 sm:gap-3 flex-1">
            <button
              onClick={onClear}
              className="flex-1 flex flex-col items-center justify-center gap-1 sm:gap-2 p-2 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium shadow-sm active:bg-red-50 active:text-red-600 active:scale-95 transition-all"
            >
              <Delete className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[10px] sm:text-xs">Erase</span>
            </button>
            <button
              onClick={onHint}
              disabled={hintsLeft <= 0}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 sm:gap-2 p-2 rounded-xl font-medium transition-all",
                hintsLeft > 0 
                  ? "bg-amber-50 text-amber-600 border border-amber-200 shadow-sm active:bg-amber-100 active:scale-95" 
                  : "bg-slate-50 text-slate-300 border border-slate-100 shadow-none cursor-not-allowed"
              )}
            >
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[10px] sm:text-xs">{hintsLeft} Hint{hintsLeft !== 1 ? 's' : ''}</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onClear}
            className="flex-1 flex flex-col items-center justify-center gap-1 sm:gap-2 p-2 sm:py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium shadow-sm active:bg-red-50 active:text-red-600 active:scale-95 transition-all"
          >
            <Delete className="w-5 h-5" />
            <span className="text-[10px] sm:text-sm">Erase</span>
          </button>
        )}
      </div>
    </div>
  );
}
