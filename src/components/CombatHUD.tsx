import React from 'react';
import {
  Shield,
  Zap,
  Flame,
  Swords,
  ChevronUp,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import type {
  Boss,
  ActiveCombatState,
  Skill,
  Arena,
  CounterAction,
  PlayerLoadout,
} from '../types/game';
import { audio } from '../utils/audioService';

interface Props {
  boss: Boss;
  combatState: ActiveCombatState;
  arena: Arena;
  loadout?: PlayerLoadout;
  children?: React.ReactNode;
  extraActions?: React.ReactNode;
  onPlaySkill: (skillId: string) => void;
  onCounterAction: (action: CounterAction) => void;
  onEndTurn: () => void;
  onTriggerProp: (propId: string) => void;
}

export const CombatHUD: React.FC<Props> = ({
  boss,
  combatState,
  arena,
  loadout,
  children,
  extraActions,
  onPlaySkill,
  onCounterAction,
  onEndTurn,
  onTriggerProp,
}) => {
  const hpPercent = Math.max(0, (boss.currentHp / boss.maxHp) * 100);
  const playerHpPercent = Math.max(0, (combatState.playerHp / combatState.maxPlayerHp) * 100);

  // Overheat Color
  const heat = combatState.probabilityHeat;
  const heatColor =
    heat > 80
      ? 'text-rose-400 bg-rose-500'
      : heat > 50
      ? 'text-cyan-400 bg-cyan-400'
      : 'text-emerald-400 bg-emerald-500';

  // Global Keyboard Action Controls
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toUpperCase();
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA') return;

      // Resume audio context on first keystroke
      audio.resume();

      if (e.key === '1') {
        const card = combatState.activeHand[0];
        if (card && combatState.playerEnergy >= card.energyCost) {
          onPlaySkill(card.id);
        }
      } else if (e.key === '2') {
        const card = combatState.activeHand[1];
        if (card && combatState.playerEnergy >= card.energyCost) {
          onPlaySkill(card.id);
        }
      } else if (e.key === '3') {
        const card = combatState.activeHand[2];
        if (card && combatState.playerEnergy >= card.energyCost) {
          onPlaySkill(card.id);
        }
      } else if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        if (boss.activeTelegraph) {
          onCounterAction('jump');
        }
      } else if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
        if (boss.activeTelegraph) {
          onCounterAction('crouch');
        }
      } else if (e.key === ' ' || e.code === 'Space') {
        if (boss.activeTelegraph) {
          e.preventDefault();
          onCounterAction('parry');
        }
      } else if (e.key === 'e' || e.key === 'E') {
        onEndTurn();
      } else if (e.key === '4' && arena.props[0] && !arena.props[0].isUsed) {
        onTriggerProp(arena.props[0].id);
      } else if (e.key === '5' && arena.props[1] && !arena.props[1].isUsed) {
        onTriggerProp(arena.props[1].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    boss.activeTelegraph,
    combatState.activeHand,
    combatState.playerEnergy,
    arena.props,
    onPlaySkill,
    onCounterAction,
    onEndTurn,
    onTriggerProp,
  ]);

  return (
    <div className="flex flex-col gap-2.5 w-full">
      {/* ========================================== */}
      {/* 1. TOP DUAL HEALTH BAR: YOU VS CALAMITY BOSS */}
      {/* ========================================== */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 shadow-xl backdrop-blur-md">
        <div className="grid grid-cols-12 gap-2 sm:gap-3 items-center">
          {/* LEFT: YOUR HEALTH BAR (PLAYER) */}
          <div className="col-span-5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="font-bold text-slate-100 text-xs sm:text-sm font-mono truncate">
                  {loadout?.name || 'YOU (CHALLENGER)'}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-bold hidden sm:inline">
                  {loadout?.avatarArchetype
                    ? loadout.avatarArchetype.replace('_', ' ').toUpperCase()
                    : 'FIGHTER'}
                </span>
              </div>
              <span className="text-emerald-400 font-bold font-mono text-xs sm:text-sm shrink-0">
                {combatState.playerHp} / {combatState.maxPlayerHp} HP
              </span>
            </div>

            {/* Glowing Player Health Bar */}
            <div className="relative w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
              <div
                className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 shadow-sm"
                style={{ width: `${playerHpPercent}%` }}
              />
            </div>

            {/* Sub-status: Energy Orbs, Shield, Overheat */}
            <div className="flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-1">
                <span className="text-slate-400 font-bold text-[10px]">ENERGY:</span>
                {[1, 2, 3].map((orb) => (
                  <Zap
                    key={orb}
                    className={`w-3.5 h-3.5 transition-all ${
                      combatState.playerEnergy >= orb
                        ? 'text-cyan-400 fill-cyan-400 drop-shadow-[0_0_6px_rgba(34,211,238,0.8)]'
                        : 'text-slate-700'
                    }`}
                  />
                ))}
                <span className="text-cyan-300 font-bold text-[10px] ml-0.5">
                  ({combatState.playerEnergy}/3)
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {combatState.shieldPoints > 0 && (
                  <span className="text-cyan-300 flex items-center gap-1 font-bold text-[10px]">
                    <Shield className="w-3 h-3 text-cyan-400" /> +{combatState.shieldPoints}
                  </span>
                )}
                <span className="flex items-center gap-1 font-bold text-[10px]">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span className="text-slate-400">HEAT:</span>
                  <span className={heatColor.split(' ')[0]}>{heat}%</span>
                </span>
              </div>
            </div>
          </div>

          {/* CENTER: VS BADGE & COMBO MULTIPLIER */}
          <div className="col-span-2 flex flex-col items-center justify-center border-x border-slate-800/80 px-1 text-center">
            {combatState.comboCount > 0 ? (
              <div className="flex flex-col items-center animate-pulse">
                <span className="text-[9px] font-mono font-black text-amber-400 uppercase tracking-widest leading-none">
                  COMBO
                </span>
                <span className="text-base sm:text-lg font-black text-amber-300 font-mono leading-tight">
                  x{combatState.comboCount}
                </span>
                <span className="text-[9px] font-mono text-amber-400 leading-none">
                  +{Math.min(60, combatState.comboCount * 15)}%
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-black font-mono text-cyan-400/90 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  VS
                </span>
                <span className="text-[9px] font-mono text-slate-500 mt-0.5">
                  TURN {combatState.turnCount || 1}
                </span>
              </div>
            )}
          </div>

          {/* RIGHT: BOSS HEALTH BAR */}
          <div className="col-span-5 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-rose-400 font-bold font-mono text-xs sm:text-sm shrink-0">
                {boss.currentHp} / {boss.maxHp} HP
              </span>
              <div className="flex items-center gap-1.5 truncate">
                {boss.enraged && (
                  <span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 px-1.5 py-0.2 rounded text-[9px] font-bold animate-pulse">
                    ENRAGED
                  </span>
                )}
                <span className="font-bold text-slate-100 text-xs sm:text-sm font-mono truncate">
                  {boss.name}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
              </div>
            </div>

            {/* Glowing Boss Health Bar */}
            <div className="relative w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  boss.enraged
                    ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 shadow-sm'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${hpPercent}%` }}
              />
            </div>

            {/* Boss Stun Bar */}
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-slate-400 font-bold text-[10px] flex items-center gap-1">
                <Shield className="w-3 h-3 text-amber-400" />
                STUN:
              </span>
              <span
                className={`font-bold ${
                  boss.isStaggered
                    ? 'text-amber-300 animate-pulse text-[10px]'
                    : 'text-slate-300 text-[10px]'
                }`}
              >
                {boss.isStaggered
                  ? `💥 STUNNED! (+50% DMG)`
                  : `${boss.staggerGauge} / 100`}
              </span>
              <div className="w-20 sm:w-28 bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800/80">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${boss.staggerGauge}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. DOKKAEBI FLASH BOUNTY (SLIM STRIP)      */}
      {/* ========================================== */}
      {combatState.activeBounty && (
        <div
          className={`px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all flex items-center justify-between gap-2 shadow-sm ${
            combatState.activeBounty.isCompleted
              ? 'bg-emerald-950/40 border-emerald-500/60'
              : 'bg-amber-950/30 border-amber-500/40'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            <span className="text-sm">
              {combatState.activeBounty.isCompleted ? '🎉' : '✨'}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
              BOUNTY
            </span>
            <span className="text-xs font-bold text-slate-100 font-mono truncate">
              {combatState.activeBounty.title}
            </span>
            <span className="text-[11px] text-slate-400 font-mono hidden md:inline truncate">
              — {combatState.activeBounty.description}
            </span>
          </div>

          <div className="shrink-0 flex items-center gap-2 font-mono text-xs">
            <span className="text-amber-400 font-bold font-mono text-xs">
              +{combatState.activeBounty.rewardSol} SOL
            </span>
            {combatState.activeBounty.isCompleted ? (
              <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[10px]">
                CLAIMED
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-500/30 font-bold text-[10px]">
                {combatState.activeBounty.turnsRemaining}T left
              </span>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 3. THE 2D ARENA CANVAS (CENTER STAGE)      */}
      {/* ========================================== */}
      {children}

      {/* ========================================== */}
      {/* 4. ACTIVE TELEGRAPH REACTION (THREAT POPUP)*/}
      {/* ========================================== */}
      {boss.activeTelegraph && (
        <div className="bg-rose-950/60 border-2 border-rose-500 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-xl shadow-rose-950/60 animate-pulse">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="text-xs font-mono font-black text-rose-200 uppercase tracking-wide">
              ⚠️ INCOMING ATTACK: {boss.activeTelegraph.name} ({boss.activeTelegraph.damage} DMG)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onCounterAction('jump')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                boss.activeTelegraph.counterAction === 'jump'
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/40 scale-105'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ChevronUp className="w-3.5 h-3.5" />
              JUMP (W)
            </button>
            <button
              onClick={() => onCounterAction('crouch')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                boss.activeTelegraph.counterAction === 'crouch'
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/40 scale-105'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ChevronDown className="w-3.5 h-3.5" />
              SLIDE (S)
            </button>
            <button
              onClick={() => onCounterAction('parry')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1 transition-all cursor-pointer ${
                boss.activeTelegraph.counterAction === 'parry'
                  ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-md shadow-cyan-400/40 scale-105'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              PARRY (Space)
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 4.5 INCOMING SABOTAGE / MINION THREATS     */}
      {/* ========================================== */}
      {combatState.incomingSabotage && (
        <div className="bg-amber-950/60 border border-amber-500 rounded-xl px-3 py-1.5 flex items-center justify-between shadow-lg animate-pulse font-mono text-xs">
          <span className="flex items-center gap-2 text-amber-300 font-bold">
            <span>🚀</span>
            <span>INCOMING SABOTAGE: {combatState.incomingSabotage.type.toUpperCase()}</span>
          </span>
          <span className="text-amber-400 font-bold">
            Detonates in {combatState.incomingSabotage.turnsUntilImpact} turn!
          </span>
        </div>
      )}

      {combatState.activeShieldMinionHp !== undefined && combatState.activeShieldMinionHp > 0 && (
        <div className="bg-purple-950/50 border border-purple-500/50 rounded-lg px-3 py-1 flex items-center justify-between text-xs font-mono text-purple-300 animate-pulse">
          <span className="flex items-center gap-1.5 font-bold">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            CALAMITY SHIELD MINION:
          </span>
          <span className="font-bold text-purple-200">
            {combatState.activeShieldMinionHp} HP (Deflecting hits from boss)
          </span>
        </div>
      )}

      {/* ========================================== */}
      {/* 5. ACTION DOCK: ATTACK CARDS & TURN CONTROLS */}
      {/* ========================================== */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 shadow-xl backdrop-blur-md flex flex-col gap-2.5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1 font-mono">
              <Swords className="w-3.5 h-3.5" />
              Active Hand (3 Attacks)
            </span>
            <span className="text-slate-500 text-[11px] font-mono">
              • Deck: {combatState.deckDrawPile.length} left
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Arena Props */}
            {arena.props.map((prop, pIdx) => (
              <button
                key={prop.id}
                disabled={prop.isUsed}
                onClick={() => onTriggerProp(prop.id)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold flex items-center gap-1 transition-all ${
                  prop.isUsed
                    ? 'bg-slate-950 text-slate-600 border border-slate-800 cursor-not-allowed opacity-40'
                    : 'bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 border border-slate-700 cursor-pointer shadow-sm'
                }`}
                title={prop.description}
              >
                <span className="text-[9px] px-1 py-0.2 rounded bg-slate-950 text-cyan-400 border border-cyan-500/30 font-bold">
                  [{pIdx + 4}]
                </span>
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span className="truncate max-w-[90px]">{prop.actionText}</span>
              </button>
            ))}

            {/* End Turn Button */}
            <button
              onClick={onEndTurn}
              className="px-3.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              END TURN (E)
            </button>
          </div>
        </div>

        {/* 3 Skill Cards in Hand (Compact & High Contrast) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
          {combatState.activeHand.map((skill: Skill, idx: number) => {
            const canAfford = combatState.playerEnergy >= skill.energyCost;
            const borderGlow = skill.isStigma
              ? 'border-amber-400 bg-amber-950/20 shadow-amber-500/20'
              : skill.category === 'melee'
              ? 'border-cyan-500/50 bg-cyan-950/20'
              : skill.category === 'elemental'
              ? 'border-purple-500/50 bg-purple-950/20'
              : 'border-emerald-500/50 bg-emerald-950/20';

            return (
              <div
                key={skill.id}
                onClick={() => canAfford && onPlaySkill(skill.id)}
                className={`p-2.5 rounded-xl border-2 flex flex-col justify-between transition-all cursor-pointer ${borderGlow} ${
                  canAfford
                    ? 'hover:scale-[1.02] shadow-lg opacity-100 bg-slate-900/90'
                    : 'opacity-40 cursor-not-allowed bg-slate-950/60'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                      [{idx + 1}]
                    </span>
                    <h4 className="text-xs font-black text-slate-100 truncate">{skill.name}</h4>
                  </div>
                  <span className="text-[11px] font-mono font-bold px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0">
                    {skill.energyCost}⚡
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 my-1 leading-snug line-clamp-1">
                  {skill.description}
                </p>

                <div className="border-t border-slate-800/80 pt-1 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-rose-400 font-bold">
                    {skill.baseDamage > 0 ? `💥 ${skill.baseDamage} DMG` : '🛡️ SHIELD / PARRY'}
                  </span>
                  <span className="text-amber-400 text-[10px]">+{skill.sabotageEnergyGain} Sab</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================== */}
      {/* 6. EXTRA ACTIONS (SABOTAGE CONSOLE)        */}
      {/* ========================================== */}
      {extraActions}
    </div>
  );
};
