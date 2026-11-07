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
} from '../types/game';

interface Props {
  boss: Boss;
  combatState: ActiveCombatState;
  arena: Arena;
  onPlaySkill: (skillId: string) => void;
  onCounterAction: (action: CounterAction) => void;
  onEndTurn: () => void;
  onTriggerProp: (propId: string) => void;
}

export const CombatHUD: React.FC<Props> = ({
  boss,
  combatState,
  arena,
  onPlaySkill,
  onCounterAction,
  onEndTurn,
  onTriggerProp,
}) => {
  const hpPercent = Math.max(0, (boss.currentHp / boss.maxHp) * 100);
  const playerHpPercent = Math.max(0, (combatState.playerHp / combatState.maxPlayerHp) * 100);

  // Overheat Color
  const heat = combatState.probabilityHeat;
  const heatColor = heat > 80 ? 'text-rose-400 bg-rose-500' : heat > 50 ? 'text-cyan-400 bg-cyan-400' : 'text-emerald-400 bg-emerald-500';

  // Global Keyboard Action Controls
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const targetTag = (e.target as HTMLElement)?.tagName?.toUpperCase();
      if (targetTag === 'INPUT' || targetTag === 'TEXTAREA') return;

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
  }, [boss.activeTelegraph, combatState.activeHand, combatState.playerEnergy, arena.props, onPlaySkill, onCounterAction, onEndTurn, onTriggerProp]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ========================================== */}
      {/* 1. TOP BAR: BOSS HP & STUN BAR             */}
      {/* ========================================== */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 backdrop-blur-md shadow-xl flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="font-bold text-slate-100 text-sm">{boss.name}</span>
            <span className="text-slate-500">({boss.subtitle})</span>
            {boss.enraged && (
              <span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2 py-0.5 rounded text-[10px] font-bold animate-pulse">
                ENRAGED PHASE 2
              </span>
            )}
          </div>
          <span className="text-rose-400 font-bold font-mono">
            {boss.currentHp} / {boss.maxHp} HP ({Math.round(hpPercent)}%)
          </span>
        </div>

        {/* Boss HP Bar */}
        <div className="relative w-full bg-slate-950 rounded-full h-3.5 overflow-hidden border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              boss.enraged ? 'bg-gradient-to-r from-rose-600 to-amber-500' : 'bg-rose-500'
            }`}
            style={{ width: `${hpPercent}%` }}
          />
          {/* Phase 2 threshold marker at 50% */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10 opacity-70"
            style={{ left: '50%' }}
            title="Phase 2 Enrage Threshold"
          />
        </div>

        {/* Boss Stun Bar (Clean & Universal) */}
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400 flex items-center gap-1 font-bold">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            STUN BAR:
          </span>
          <span
            className={`font-bold ${
              boss.isStaggered ? 'text-amber-300 animate-pulse text-xs' : 'text-slate-300'
            }`}
          >
            {boss.isStaggered
              ? `💥 STUNNED! (+50% DMG FOR ${boss.staggerTurnsRemaining} TURNS)`
              : `${boss.staggerGauge} / 100`}
          </span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800/80">
          <div
            className="bg-amber-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${boss.staggerGauge}%` }}
          />
        </div>
      </div>

      {/* ========================================== */}
      {/* 1.5 DOKKAEBI FLASH BOUNTY BANNER           */}
      {/* ========================================== */}
      {combatState.activeBounty && (
        <div
          className={`p-3 rounded-xl border backdrop-blur-md transition-all flex flex-wrap items-center justify-between gap-3 shadow-lg ${
            combatState.activeBounty.isCompleted
              ? 'bg-emerald-950/40 border-emerald-500/60 shadow-emerald-950/40'
              : 'bg-amber-950/30 border-amber-500/40 shadow-amber-950/30'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="text-xl">
              {combatState.activeBounty.isCompleted ? '🎉' : '✨'}
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                  DOKKAEBI FLASH BOUNTY
                </span>
                <span className="text-xs font-bold text-slate-100 font-mono">
                  {combatState.activeBounty.title}
                </span>
                <span className="text-amber-400 font-bold font-mono text-xs">
                  (+{combatState.activeBounty.rewardSol} SOL)
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 font-mono">
                {combatState.activeBounty.description}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2 font-mono text-xs">
            {combatState.activeBounty.isCompleted ? (
              <span className="px-3 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold flex items-center gap-1 shadow-md shadow-emerald-500/30 animate-bounce">
                ✅ CLAIMED! (+{combatState.activeBounty.rewardSol} SOL)
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 border border-amber-500/30 font-bold">
                ⏳ {combatState.activeBounty.turnsRemaining} turns left
              </span>
            )}
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 2. PLAYER STATUS METRICS (HP, HEAT, SABOTAGE) */}
      {/* ========================================== */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Player Health */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-slate-400">YOUR HP</span>
            <span className="text-emerald-400 font-bold">
              {combatState.playerHp} / {combatState.maxPlayerHp}
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${playerHpPercent}%` }}
            />
          </div>
        </div>

        {/* Energy Orbs */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-xs font-mono text-slate-400 block mb-1">ENERGY</span>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((orb) => (
              <div
                key={orb}
                className={`w-7 h-7 rounded-lg border flex items-center justify-center font-mono font-bold text-xs transition-all ${
                  combatState.playerEnergy >= orb
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-500/30'
                    : 'bg-slate-950 text-slate-700 border-slate-800'
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
              </div>
            ))}
            <span className="text-xs font-mono text-cyan-400 ml-1">
              {combatState.playerEnergy}/3 ⚡
            </span>
          </div>
        </div>

        {/* Overheat Gauge */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-slate-400">OVERHEAT</span>
            <span className={`font-bold font-mono ${heatColor.split(' ')[0]}`}>{heat}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-300 ${heatColor.split(' ')[1]}`}
              style={{ width: `${heat}%` }}
            />
          </div>
        </div>

        {/* Sabotage Energy */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono mb-1">
            <span className="text-slate-400">SABOTAGE</span>
            <span className="text-amber-400 font-bold font-mono">
              {combatState.sabotageEnergy} / 100
            </span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${combatState.sabotageEnergy}%` }}
            />
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 3. ACTIVE TELEGRAPH REACTION BAR           */}
      {/* ========================================== */}
      {boss.activeTelegraph && (
        <div className="bg-rose-950/50 border-2 border-rose-500 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xl shadow-rose-950/60 animate-pulse">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <span className="text-xs font-mono font-black text-rose-200 block uppercase tracking-wide">
                ⚠️ INCOMING ATTACK: {boss.activeTelegraph.name} ({boss.activeTelegraph.damage} DMG)
              </span>
              <span className="text-[11px] text-slate-300 font-mono">
                Counter: <strong className="text-amber-300 font-bold">{boss.activeTelegraph.counterAction.toUpperCase()}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onCounterAction('jump')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                boss.activeTelegraph.counterAction === 'jump'
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/40 scale-105'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ChevronUp className="w-4 h-4" />
              [ ⬆️ JUMP (W) ]
            </button>
            <button
              onClick={() => onCounterAction('crouch')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                boss.activeTelegraph.counterAction === 'crouch'
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-md shadow-amber-500/40 scale-105'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ChevronDown className="w-4 h-4" />
              [ ⬇️ SLIDE (S) ]
            </button>
            <button
              onClick={() => onCounterAction('parry')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                boss.activeTelegraph.counterAction === 'parry'
                  ? 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-md shadow-cyan-400/40 scale-105'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Shield className="w-4 h-4" />
              [ 🛡️ PARRY (Space) ]
            </button>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 4. DYNAMIC 3-CARD SKILL HAND BAR           */}
      {/* ========================================== */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 backdrop-blur-md shadow-xl flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <Swords className="w-4 h-4" />
              Active Hand (3 Cards)
            </span>
            <span className="text-slate-500 text-xs font-mono">
              • Deck: {combatState.deckDrawPile.length} cards remaining
            </span>
            {combatState.comboCount > 0 && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/50 text-amber-300 font-mono text-[11px] font-bold animate-pulse">
                <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                COMBO x{combatState.comboCount} (+{Math.min(60, combatState.comboCount * 15)}% DMG)
              </span>
            )}
          </div>
          <button
            onClick={onEndTurn}
            className="px-4 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            END TURN & DRAW (E)
          </button>
        </div>

        {/* Calamity Minion Interception Banner if present */}
        {combatState.activeShieldMinionHp !== undefined && combatState.activeShieldMinionHp > 0 && (
          <div className="bg-purple-950/40 border border-purple-500/50 rounded-lg px-3 py-1.5 flex items-center justify-between text-xs font-mono text-purple-300 animate-pulse">
            <span className="flex items-center gap-1.5 font-bold">
              <Shield className="w-4 h-4 text-purple-400" />
              CALAMITY SHIELD MINION ACTIVE:
            </span>
            <span className="font-bold text-purple-200">
              {combatState.activeShieldMinionHp} HP (Deflecting Attacks from Boss)
            </span>
          </div>
        )}

        {/* 3 Skill Cards in Hand */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                className={`p-3.5 rounded-xl border-2 flex flex-col justify-between transition-all cursor-pointer ${borderGlow} ${
                  canAfford
                    ? 'hover:scale-[1.02] shadow-lg opacity-100'
                    : 'opacity-40 cursor-not-allowed'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
                        {skill.category}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-bold">
                        [{idx + 1}]
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-100 mt-0.5">{skill.name}</h4>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {skill.energyCost}⚡
                  </span>
                </div>

                {/* Punchy Clean Description */}
                <p className="text-xs text-slate-200 my-2 leading-snug">{skill.description}</p>

                <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-xs font-mono">
                  <span className="text-rose-400 font-bold">
                    {skill.baseDamage > 0 ? `${skill.baseDamage} DMG` : 'SHIELD / PARRY'}
                  </span>
                  <span className="text-amber-400">+{skill.sabotageEnergyGain} Sab</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================== */}
      {/* 5. INTERACTIVE ARENA PROPS BAR             */}
      {/* ========================================== */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <span className="text-slate-400 font-mono text-xs flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Interactive Props:
        </span>
        <div className="flex items-center gap-2">
          {arena.props.map((prop, pIdx) => (
            <button
              key={prop.id}
              disabled={prop.isUsed}
              onClick={() => onTriggerProp(prop.id)}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold flex items-center gap-1.5 transition-all ${
                prop.isUsed
                  ? 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'
                  : 'bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 border border-slate-700 cursor-pointer shadow-sm'
              }`}
            >
              <span className="text-[10px] px-1 py-0.2 rounded bg-slate-950 text-cyan-400 border border-cyan-500/30 font-bold">
                [{pIdx + 4}]
              </span>
              <Flame className="w-3 h-3 text-cyan-400" />
              {prop.actionText}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
