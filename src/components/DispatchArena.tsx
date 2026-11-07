import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Swords,
  Shield,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import type { Arena } from '../types/game';
import { ARENAS } from '../data/arenas';

interface Props {
  walletBalanceSol: number;
  onBackToLobby: () => void;
  onProceedToChallenger: (config: {
    arena: Arena;
    circuitTier: 'bronze' | 'silver' | 'gold';
    stakeAmountSol: number;
    mode: 'solo' | 'duel';
  }) => void;
}

export const DispatchArena: React.FC<Props> = ({
  walletBalanceSol,
  onBackToLobby,
  onProceedToChallenger,
}) => {
  const [selectedArena, setSelectedArena] = useState<Arena>(ARENAS[0]);
  const [mode, setMode] = useState<'solo' | 'duel'>('duel');
  const [circuitTier, setCircuitTier] = useState<'bronze' | 'silver' | 'gold'>('silver');

  const tierStakes = {
    bronze: 0.005,
    silver: 0.01,
    gold: 0.025,
  };
  const currentStake = tierStakes[circuitTier];
  const potMultiplier = mode === 'duel' ? 2 : 2.5;
  const potentialBounty = currentStake * potMultiplier;

  const canAfford = walletBalanceSol >= currentStake;

  const handleNext = () => {
    if (!canAfford) return;
    onProceedToChallenger({
      arena: selectedArena,
      circuitTier,
      stakeAmountSol: currentStake,
      mode,
    });
  };

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col p-4 md:p-6 lg:p-8">
      {/* ============================================================ */}
      {/* HEADER & BREADCRUMB (STEP 1 OF 2)                            */}
      {/* ============================================================ */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 mb-6 backdrop-blur-md shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLobby}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Lobby</span>
          </button>
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest uppercase bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
              STEP 1 OF 2 • SCENARIO SELECTION
            </span>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 mt-0.5">
              Target Arena & Circuit Stakes
            </h1>
          </div>
        </div>

        {/* Next Button in Header */}
        <button
          disabled={!canAfford}
          onClick={handleNext}
          className="py-2.5 px-5 rounded-xl font-bold font-mono text-xs tracking-wide bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 shadow-lg shadow-cyan-500/30 flex items-center gap-2 transition-all cursor-pointer"
        >
          <span>NEXT: ASSEMBLE CHALLENGER</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ============================================================ */}
      {/* MAIN 2-COLUMN LAYOUT: ARENA (LEFT) & WAGER COMMAND (RIGHT)   */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        {/* LEFT COLUMN: MODE SELECTION & ARENA CARDS (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Mode Switcher */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-md shadow-xl">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-3">
              SELECT COMBAT PROTOCOL
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => setMode('duel')}
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  mode === 'duel'
                    ? 'bg-cyan-500/10 border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0">
                  <Swords className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-100 text-sm">1v1 Mirrored Duel</h3>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      FEATURED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Symmetrical parallel channels. Race against rival Challenger Ren with Cross-Arena
                    Sabotage hazards!
                  </p>
                </div>
              </button>

              <button
                onClick={() => setMode('solo')}
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  mode === 'solo'
                    ? 'bg-cyan-500/10 border-cyan-400 shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">Solo Scenario Run</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Test your tactical skill deck and master boss telegraph counters against the
                    Calamity in single player.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Arena Destination Cards */}
          <div className="space-y-4">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
              CHOOSE TARGET SCENARIO ARENA
            </span>

            <div className="grid grid-cols-1 gap-4">
              {ARENAS.map((arena) => {
                const isSelected = selectedArena.id === arena.id;
                return (
                  <div
                    key={arena.id}
                    onClick={() => setSelectedArena(arena)}
                    className={`rounded-2xl p-5 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border-cyan-400 shadow-2xl shadow-cyan-500/20 scale-[1.01]'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{arena.theme === 'metro' ? '🚇' : '🌊'}</span>
                          <h4 className="text-base font-black text-slate-100">{arena.name}</h4>
                          <span className="text-[10px] font-mono text-slate-400">
                            ({arena.subtitle})
                          </span>
                        </div>
                        {isSelected && (
                          <div className="text-cyan-400 flex items-center gap-1 font-mono text-xs font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                            <CheckCircle2 className="w-4 h-4" />
                            DEPLOY TARGET
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed mb-3">
                        {arena.description}
                      </p>

                      {/* Environmental Modifier & Boss Preview */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                        <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30">
                          <span className="font-bold text-emerald-400 block">
                            {arena.environmentalModifier.name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {arena.environmentalModifier.description}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/30">
                          <span className="font-bold text-rose-400 flex items-center justify-between">
                            <span>BOSS: {arena.boss.name}</span>
                            <span className="text-amber-400">{arena.boss.maxHp} HP</span>
                          </span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            Poise: {arena.boss.staggerGauge} • {arena.boss.subtitle}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CIRCUIT STAKES & COMMAND STATION (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Circuit Stakes Selector */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-md shadow-xl flex flex-col gap-4">
            <div>
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider block">
                CIRCUIT WAGER TIER
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                Funded via connected Solana Devnet wallet.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 font-mono">
              {(
                [
                  { tier: 'bronze', label: 'Bronze', sol: 0.005 },
                  { tier: 'silver', label: 'Silver', sol: 0.01 },
                  { tier: 'gold', label: 'Gold', sol: 0.025 },
                ] as const
              ).map((t) => {
                const isSelected = circuitTier === t.tier;
                return (
                  <button
                    key={t.tier}
                    onClick={() => setCircuitTier(t.tier)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md shadow-amber-500/20'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs font-bold block">{t.label}</span>
                    <span className="text-xs text-amber-400 mt-1 block">{t.sol} SOL</span>
                  </button>
                );
              })}
            </div>

            {/* Escrow Pot Breakdown */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>YOUR ENTRY STAKE:</span>
                <span className="text-slate-200 font-bold">{currentStake} SOL ◎</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>RIVAL ENTRY STAKE:</span>
                <span className="text-slate-200 font-bold">{currentStake} SOL ◎</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-sm">
                <span className="text-amber-400 font-bold">TOTAL WINNER BOUNTY:</span>
                <span className="text-amber-300 font-black text-base">
                  {potentialBounty.toFixed(3)} SOL ◎
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 leading-relaxed">
              💡 <strong>Spectator Micro-Tips:</strong> You keep 100% of all audience tips received
              during combat regardless of match outcome.
            </div>
          </div>

          {/* Launch Station Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/50 border-2 border-cyan-500/60 rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">YOUR WALLET BALANCE:</span>
              <span className="text-emerald-400 font-bold">{walletBalanceSol.toFixed(4)} SOL</span>
            </div>

            {!canAfford && (
              <div className="flex items-center gap-2 text-rose-400 text-xs bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Insufficient SOL on Devnet. Request an airdrop from the top bar!</span>
              </div>
            )}

            <button
              disabled={!canAfford}
              onClick={handleNext}
              className="w-full py-4 rounded-xl font-bold font-mono text-sm tracking-wide bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>NEXT: CHOOSE CHALLENGER ({currentStake} SOL)</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
