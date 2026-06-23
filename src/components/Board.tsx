import React from 'react';
import { CellData } from '../types';
import { cn } from '../utils/cn';

interface BoardProps {
  cells: CellData[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

export function Board({ cells, selectedIndex, onSelect }: BoardProps) {
  const getCellClasses = (index: number, cell: CellData) => {
    let classes = "w-full aspect-square flex items-center justify-center text-xl sm:text-2xl cursor-pointer border-r border-b border-slate-200 relative transition-colors duration-150 select-none ";
    
    // Thicker borders for 3x3 blocks
    if (index % 3 === 0) classes += "border-l-2 border-l-slate-400 ";
    if (index % 9 === 8) classes += "border-r-2 border-r-slate-400 ";
    if (Math.floor(index / 9) % 3 === 0) classes += "border-t-2 border-t-slate-400 ";
    if (Math.floor(index / 9) === 8) classes += "border-b-2 border-b-slate-400 ";

    // Font family & weight
    classes += cell.isGiven ? "font-semibold text-slate-800 " : "font-medium text-blue-600 ";
    if (cell.isError && cell.value !== 0) classes += "text-red-500 font-bold ";

    // Highlights
    let bgClass = "bg-white ";
    
    if (selectedIndex !== null) {
      if (selectedIndex === index) {
        bgClass = "bg-blue-200 ";
      } else {
        const selRow = Math.floor(selectedIndex / 9);
        const selCol = selectedIndex % 9;
        const row = Math.floor(index / 9);
        const col = index % 9;
        const selBox = Math.floor(selRow / 3) * 3 + Math.floor(selCol / 3);
        const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
        
        const isRelated = row === selRow || col === selCol || box === selBox;
        
        // Highlight matching numbers
        const selectedCell = cells[selectedIndex];
        const isSameValue = selectedCell.value !== 0 && selectedCell.value === cell.value;
        const isGivenSameValue = selectedCell.isGiven && selectedCell.value === cell.value;

        if (isSameValue || isGivenSameValue) {
          bgClass = "bg-blue-300/60 ";
        } else if (isRelated) {
          bgClass = "bg-blue-50/80 ";
        }
      }
    }

    if (cell.isError && cell.value !== 0 && index === selectedIndex) {
      bgClass = "bg-red-200 ";
    } else if (cell.isError && cell.value !== 0) {
      bgClass = "bg-red-50 ";
    }

    return cn(classes, bgClass);
  };

  return (
    <div className="w-full max-w-[450px] mx-auto grid grid-cols-9 shadow-sm rounded-sm bg-slate-400 border-2 border-slate-400 overflow-hidden" style={{ touchAction: 'manipulation' }}>
      {cells.map((cell, index) => (
        <div
          key={index}
          className={getCellClasses(index, cell)}
          onClick={() => onSelect(index)}
        >
          {cell.value !== 0 ? (
            <span className="animate-in fade-in zoom-in-75 duration-150">{cell.value}</span>
          ) : (
            <div className="grid grid-cols-3 grid-rows-3 w-full h-full p-0.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <div key={num} className="flex items-center justify-center">
                  {cell.notes.includes(num) && (
                    <span className="text-[10px] sm:text-xs text-slate-500 leading-none">{num}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
