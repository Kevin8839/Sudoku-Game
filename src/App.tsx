/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { Home } from './components/Home';
import { Game } from './components/Game';
import { GameState, GameSettings } from './types';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('home');
  const [settings, setSettings] = useState<GameSettings>({ difficulty: 'easy', showLives: true });

  const handleStart = (newSettings: GameSettings) => {
    setSettings(newSettings);
    setGameState('playing');
  };

  return (
    <div className="min-h-[100dvh] bg-slate-50 antialiased selection:bg-blue-100">
      {gameState === 'home' && <Home onStart={handleStart} />}
      {(gameState === 'playing' || gameState === 'paused' || gameState === 'victory') && (
        <Game settings={settings} onGoHome={() => setGameState('home')} />
      )}
    </div>
  );
}
