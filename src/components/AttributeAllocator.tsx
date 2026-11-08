import React from 'react';
import { Shield, Zap, Swords, RotateCcw, AlertCircle } from 'lucide-react';
import type { PlayerAttributes } from '../types/game';

interface Props {
  attributes: PlayerAttributes;
  onChange: (attrs: PlayerAttributes) => void;
  maxBudget?: number;
}

export const AttributeAllocator: React.FC<Props> = ({
  attributes,
  onChange,
  maxBudget = 30,
}) => {
  const currentTotal = attributes.strength + attributes.agility + attributes.resonance;
  const remainingPoints = maxBudget - currentTotal;

  const handleAdjust = (attr: keyof PlayerAttributes, delta: number) => {
    if (delta > 0 && remainingPoints <= 0) return;
    if (delta < 0 && attributes[attr] <= 5) return; // minimum 5 per stat

    onChange({
      ...attributes,
      [attr]: attributes[attr] + delta,
    });
  };

  const handleReset = () => {
    onChange({ strength: 10, agility: 10, resonance: 10 });
  };

  // Computed Derived Stats
  const maxHp = 200 + attributes.resonance * 4;
  const meleeBonusPercent = Math.round(attributes.strength * 1.5);
  const critChancePercent = Math.round(5 + attributes.agility * 1.2);
  const sabotageGainBonus = Math.round(attributes.agility * 1.5);
  const shieldPoints = Math.round(20 + attributes.resonance * 2);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-md shadow-xl flex flex-col gap-4">
      {/* Header with Remaining Points */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            Attribute Distribution
          </h3>
          <p className="text-xs text-slate-400">Strict 30-Point Standard Budget</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wide border ${
              remainingPoints === 0
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                : 'bg-amber-950/60 text-amber-400 border-amber-500/40 animate-pulse'
            }`}
          >
            {remainingPoints} PTS LEFT
          </span>
          <button
            onClick={handleReset}
            title="Reset to 10/10/10"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Quick 1-Click Stat Presets */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs border-b border-slate-800 pb-3">
        <span className="text-slate-500 text-[11px] font-bold">PRESETS:</span>
        <button
          onClick={() => onChange({ strength: 10, agility: 10, resonance: 10 })}
          className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all cursor-pointer ${
            attributes.strength === 10 && attributes.agility === 10 && attributes.resonance === 10
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 font-bold'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          Balanced (10/10/10)
        </button>
        <button
          onClick={() => onChange({ strength: 15, agility: 10, resonance: 5 })}
          className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all cursor-pointer ${
            attributes.strength === 15 && attributes.agility === 10 && attributes.resonance === 5
              ? 'bg-rose-500/20 text-rose-300 border-rose-400 font-bold'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          Striker (15/10/5)
        </button>
        <button
          onClick={() => onChange({ strength: 8, agility: 8, resonance: 14 })}
          className={`px-2.5 py-1 rounded-lg border text-[11px] transition-all cursor-pointer ${
            attributes.strength === 8 && attributes.agility === 8 && attributes.resonance === 14
              ? 'bg-amber-500/20 text-amber-300 border-amber-400 font-bold'
              : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
          }`}
        >
          Juggernaut (8/8/14)
        </button>
      </div>

      {/* Attribute Sliders / Steppers */}
      <div className="space-y-3.5">
        {/* Strength */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Swords className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-200">Strength</span>
                <span className="text-[11px] text-slate-400 block">Physical & Melee Attack</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={attributes.strength <= 5}
                onClick={() => handleAdjust('strength', -1)}
                className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-slate-200 flex items-center justify-center transition-all"
              >
                -
              </button>
              <span className="w-8 text-center font-mono font-bold text-base text-rose-400">
                {attributes.strength}
              </span>
              <button
                disabled={remainingPoints <= 0}
                onClick={() => handleAdjust('strength', 1)}
                className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-slate-200 flex items-center justify-center transition-all"
              >
                +
              </button>
            </div>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-rose-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(attributes.strength / 20) * 100}%` }}
            />
          </div>
        </div>

        {/* Agility */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-200">Agility</span>
                <span className="text-[11px] text-slate-400 block">Speed Initiative (Move First) & Crit</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={attributes.agility <= 5}
                onClick={() => handleAdjust('agility', -1)}
                className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-slate-200 flex items-center justify-center transition-all"
              >
                -
              </button>
              <span className="w-8 text-center font-mono font-bold text-base text-cyan-400">
                {attributes.agility}
              </span>
              <button
                disabled={remainingPoints <= 0}
                onClick={() => handleAdjust('agility', 1)}
                className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-slate-200 flex items-center justify-center transition-all"
              >
                +
              </button>
            </div>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-cyan-400 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(attributes.agility / 20) * 100}%` }}
            />
          </div>
        </div>

        {/* Resonance */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 hover:border-cyan-500/30 transition-all">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-200">Resonance</span>
                <span className="text-[11px] text-slate-400 block">Max HP, Shield & Elementals</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={attributes.resonance <= 5}
                onClick={() => handleAdjust('resonance', -1)}
                className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-slate-200 flex items-center justify-center transition-all"
              >
                -
              </button>
              <span className="w-8 text-center font-mono font-bold text-base text-purple-400">
                {attributes.resonance}
              </span>
              <button
                disabled={remainingPoints <= 0}
                onClick={() => handleAdjust('resonance', 1)}
                className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed font-bold text-slate-200 flex items-center justify-center transition-all"
              >
                +
              </button>
            </div>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${(attributes.resonance / 20) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Derived Combat Metrics Preview */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3.5 text-xs grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-slate-300 font-mono">
        <div>
          <span className="text-slate-500 block">MAX HEALTH</span>
          <span className="font-bold text-emerald-400">{maxHp} HP</span>
        </div>
        <div>
          <span className="text-slate-500 block">BASE SHIELD</span>
          <span className="font-bold text-purple-400">{shieldPoints} HP</span>
        </div>
        <div>
          <span className="text-slate-500 block">MELEE SCALING</span>
          <span className="font-bold text-rose-400">+{meleeBonusPercent}% DMG</span>
        </div>
        <div>
          <span className="text-slate-500 block">CRIT CHANCE</span>
          <span className="font-bold text-cyan-400">{critChancePercent}%</span>
        </div>
        <div>
          <span className="text-slate-500 block">SABOTAGE RATE</span>
          <span className="font-bold text-amber-400">+{sabotageGainBonus}%</span>
        </div>
        <div>
          <span className="text-slate-500 block">SPEED INITIATIVE</span>
          <span className="font-bold text-cyan-300">{attributes.agility} SPEED</span>
        </div>
      </div>

      {remainingPoints > 0 && (
        <div className="flex items-center gap-1.5 text-amber-400/90 text-xs bg-amber-500/10 border border-amber-500/20 p-2 rounded">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Allocate remaining {remainingPoints} points before entering arena.</span>
        </div>
      )}
    </div>
  );
};
