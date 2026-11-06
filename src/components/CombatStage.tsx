import React, { useState } from 'react';
import type {
  Arena,
  Boss,
  ActiveCombatState,
  PlayerLoadout,
  CounterAction,
  SpectatorConstellation,
} from '../types/game';
import {
  initializeCombatState,
  executePlayerSkill,
  executeCounterAction,
  resolveTurnCycle,
  triggerInteractiveProp,
} from '../utils/combatEngine';
import { CombatCanvas } from './CombatCanvas';
import { CombatHUD } from './CombatHUD';
import { StreamChat } from './StreamChat';
import { Trophy, Skull, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  loadout: PlayerLoadout;
  arena: Arena;
  circuitTier: 'bronze' | 'silver' | 'gold';
  stakeAmountSol: number;
  mode: 'solo' | 'duel';
  constellation: SpectatorConstellation;
  onExit: () => void;
  onTipReceived: (amountSol: number) => void;
}

export const CombatStage: React.FC<Props> = ({
  loadout,
  arena: initialArena,
  circuitTier,
  stakeAmountSol,
  mode,
  constellation,
  onExit,
  onTipReceived,
}) => {
  const [arena, setArena] = useState<Arena>({ ...initialArena });
  const [boss, setBoss] = useState<Boss>({ ...initialArena.boss });
  const [combatState, setCombatState] = useState<ActiveCombatState>(
    initializeCombatState(loadout)
  );

  const [playerActionState, setPlayerActionState] = useState<
    'idle' | 'attacking' | 'jumping' | 'crouching' | 'parrying' | 'hurt'
  >('idle');
  const [screenShake, setScreenShake] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<
    { id: string; text: string; x: number; y: number; color: string; opacity: number }[]
  >([]);

  // Trigger floating damage text
  const addFloatingText = (text: string, color: string = '#38bdf8', isCrit = false) => {
    const id = Math.random().toString();
    const newText = {
      id,
      text,
      x: 550 + (Math.random() - 0.5) * 60,
      y: 200 + (Math.random() - 0.5) * 40,
      color: isCrit ? '#f43f5e' : color,
      opacity: 1.0,
    };
    setFloatingTexts((prev) => [...prev, newText]);

    // Animate fade
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((t) => t.id !== id));
    }, 1200);
  };

  // Play Skill Handler
  const handlePlaySkill = (skillId: string) => {
    setPlayerActionState('attacking');
    const result = executePlayerSkill(skillId, combatState, boss, arena, loadout);

    setCombatState(result.combatState);
    setBoss(result.bossState);
    setArena(result.arena);

    // Trigger visual hit effect
    const skill = combatState.activeHand.find((s) => s.id === skillId);
    if (skill && skill.baseDamage > 0) {
      addFloatingText(`-${skill.baseDamage} DMG`, '#f43f5e', skill.baseDamage > 40);
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 250);
    }

    setTimeout(() => setPlayerActionState('idle'), 350);

    // Check Victory
    if (result.bossState.currentHp <= 0) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  // Counter Action (Jump, Crouch, Parry)
  const handleCounter = (action: CounterAction) => {
    setPlayerActionState(action === 'jump' ? 'jumping' : action === 'crouch' ? 'crouching' : 'parrying');
    const result = executeCounterAction(action, combatState, boss);

    setCombatState(result.combatState);
    setBoss(result.bossState);

    if (result.success) {
      addFloatingText(action === 'parry' ? 'PARRIED! +500 PTS' : 'COUNTER EVADED!', '#10b981');
    } else {
      setPlayerActionState('hurt');
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 300);
    }

    setTimeout(() => setPlayerActionState('idle'), 450);
  };

  // End Turn Cycle
  const handleEndTurn = () => {
    const result = resolveTurnCycle(combatState, boss, arena);
    setCombatState(result.combatState);
    setBoss(result.bossState);
    setArena(result.arena);
  };

  // Trigger Prop
  const handleTriggerProp = (propId: string) => {
    const result = triggerInteractiveProp(propId, combatState, boss, arena);
    setCombatState(result.combatState);
    setBoss(result.bossState);
    setArena(result.arena);
    addFloatingText(result.message, '#00d2ff');
  };

  const isVictory = boss.currentHp <= 0;
  const isDefeat = combatState.playerHp <= 0;

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col p-4 md:p-6 lg:p-8">
      {/* Top Combat Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit Arena
          </button>
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
              {mode === 'duel' ? '⚔️ 1v1 Mirrored Duel' : '📜 Solo Scenario Trial'} • Circuit{' '}
              {circuitTier.toUpperCase()} ({stakeAmountSol} SOL)
            </span>
            <h2 className="text-lg font-black text-slate-100">{arena.name}</h2>
          </div>
        </div>

        {/* Style & Combo Indicator */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-slate-500">COMBO: </span>
            <span className="text-cyan-400 font-bold text-sm">{combatState.comboCount}x</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-slate-500">STYLE SCORE: </span>
            <span className="text-amber-400 font-bold text-sm">
              {combatState.styleRating.toLocaleString()} PTS
            </span>
          </div>
        </div>
      </div>

      {/* Main Battle Arena Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start flex-1">
        {/* Left 8 Cols: Canvas & HUD */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <CombatCanvas
            arena={arena}
            boss={boss}
            combatState={combatState}
            loadout={loadout}
            playerActionState={playerActionState}
            screenShake={screenShake}
            floatingTexts={floatingTexts}
            onTriggerProp={handleTriggerProp}
          />

          <CombatHUD
            boss={boss}
            combatState={combatState}
            arena={arena}
            onPlaySkill={handlePlaySkill}
            onCounterAction={handleCounter}
            onEndTurn={handleEndTurn}
            onTriggerProp={handleTriggerProp}
          />
        </div>

        {/* Right 4 Cols: Live Star Stream Feed & Spectator Tipping */}
        <div className="lg:col-span-4 flex flex-col gap-4 h-full">
          <StreamChat
            constellation={constellation}
            targetPlayerName={loadout.name}
            onSendTip={async (amountSol, msg) => {
              onTipReceived(amountSol);
              addFloatingText(`+${amountSol} SOL TIP!`, '#10b981');
              setCombatState((prev) => ({
                ...prev,
                combatLogs: [
                  ...prev.combatLogs,
                  `[LIVE SPONSORSHIP: ${constellation.customTitle} tipped +${amountSol} SOL: "${msg || 'Cheering!'}"!]`,
                ],
              }));
            }}
          />
        </div>
      </div>

      {/* Victory / Defeat Modal Overlays */}
      {(isVictory || isDefeat) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center flex flex-col items-center">
            {isVictory ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-500/30">
                  <Trophy className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-100 tracking-tight">
                  SCENARIO CLEARED!
                </h2>
                <p className="text-sm text-emerald-400 font-mono mt-1 font-bold">
                  Bounty Claimed: {(stakeAmountSol * 2).toFixed(4)} SOL
                </p>
                <div className="my-5 p-3.5 bg-slate-950 rounded-xl border border-slate-800 w-full text-left text-xs font-mono space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Challenger:</span>
                    <span className="text-slate-200">{loadout.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Final Style Score:</span>
                    <span className="text-amber-400 font-bold">
                      {combatState.styleRating.toLocaleString()} PTS
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Max Combo:</span>
                    <span className="text-cyan-400">{combatState.comboCount} Hits</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-500/30">
                  <Skull className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-100 tracking-tight">
                  CHALLENGER ELIMINATED
                </h2>
                <p className="text-sm text-rose-400 font-mono mt-1 font-bold">
                  The Star Stream has claimed your stake.
                </p>
              </>
            )}

            <button
              onClick={onExit}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-sm tracking-wide transition-all shadow-lg shadow-cyan-500/30 cursor-pointer"
            >
              Return to Armory Terminal
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

