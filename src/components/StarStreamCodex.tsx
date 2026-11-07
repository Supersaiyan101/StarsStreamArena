import React, { useState } from 'react';
import {
  BookOpen,
  X,
  Swords,
  Shield,
  Zap,
  Flame,
  Globe2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Award,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const StarStreamCodex: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'counters' | 'sabotage' | 'web3'>('rules');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl shadow-cyan-950/50 overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-md">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest uppercase bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                  DOKKAEBI FIELD MANUAL
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">v2.4 OFFICIAL</span>
              </div>
              <h2 className="text-lg md:text-xl font-black text-slate-100 mt-0.5">
                Star Stream Survival Codex
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950/40 text-xs font-mono">
          {(
            [
              { id: 'rules', label: '1. Core Rules', icon: Swords },
              { id: 'counters', label: '2. Boss Counters', icon: Shield },
              { id: 'sabotage', label: '3. Duel & Sabotage', icon: Flame },
              { id: 'web3', label: '4. Constellations & SOL', icon: Globe2 },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer border-b-2 text-center ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-500/10 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0 hidden sm:inline" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-5 text-sm text-slate-300 leading-relaxed flex-1">
          {/* TAB 1: CORE RULES */}
          {activeTab === 'rules' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-cyan-400" />
                  Strict 30-Point Fair Play Cap
                </h3>
                <p className="text-xs text-slate-300">
                  Every Challenger enters scenarios with a strict, non-negotiable budget of 30
                  attribute points distributed across three core pillars:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-3 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30">
                    <span className="font-bold text-rose-400 block">STRENGTH (STR)</span>
                    <span className="text-[11px] text-slate-400">+1.5% Physical & Melee damage</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                    <span className="font-bold text-cyan-400 block">AGILITY (AGI)</span>
                    <span className="text-[11px] text-slate-400">+1.2% Critical rate & Sabotage gain</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <span className="font-bold text-amber-400 block">RESONANCE (RES)</span>
                    <span className="text-[11px] text-slate-400">+4 Max HP & +2 Shield per point</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Dynamic 3-Card Hand & Energy
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  You equip 5 skills into your Combat Deck. Each turn, 3 skills are randomly drawn
                  into your active hand. You have 3 Combat Energy (⚡) each turn to spend on attacks,
                  parries, and elemental arts. Unused cards cycle back into your deck upon ending the
                  turn.
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-purple-400" />
                  Probability Heat (Cosmic Plausibility)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  In the Star Stream, miraculous feats require narrative Probability. High-tier skills
                  and divine Stigmas increase your Probability Heat gauge (0-100%). If Heat reaches
                  100%, the scenario overseer imposes a <strong>Cosmic Backlash</strong>, dealing 20
                  recoil damage and scrambling your active hand!
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: BOSS COUNTERS */}
          {activeTab === 'counters' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Calamity bosses prepare deadly named attacks telegraphed in the emergency warning
                banner. You must react with the exact counter action to nullify 100% of damage and
                gain bonus combat momentum:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                    <ChevronUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-300 text-xs font-mono">
                      [ ⬆️ JUMP / AIR DODGE ] — Hotkey: W or Up
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Counters <strong>Ground Sweeps, Tail Whips, and Quakes</strong>. Leaps completely over low sweep attacks.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 font-bold shrink-0">
                    <ChevronDown className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-300 text-xs font-mono">
                      [ ⬇️ SLIDE / CROUCH ] — Hotkey: S or Down
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Counters <strong>Overhead Slams, Crushing Bludgeons, and High Energy Beams</strong>. Duck beneath horizontal blasts.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/40 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 font-bold shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-cyan-300 text-xs font-mono">
                      [ 🛡️ PARRY / DEFLECT ] — Hotkey: Spacebar
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Counters <strong>Piercing Thrusts, Plasma Lasers, and Acid Projectiles</strong>. Reflects kinetic force back to shatter boss Poise.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-xl text-xs font-mono text-amber-300">
                ⚡ <strong>Pro Tip:</strong> Depleting the boss's Stagger Shield (100 Poise) causes an
                ARMOR BREAK, stunning the boss for 2 full turns where all player skills deal +50% bonus
                damage!
              </div>
            </div>
          )}

          {/* TAB 3: SABOTAGE & TWIN DUELS */}
          {activeTab === 'sabotage' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-2">
                  <Swords className="w-4 h-4 text-cyan-400" />
                  The Symmetrical Mirrored Arena
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  In 1v1 Mirrored Duels, both Channel A and Channel B face an identical Calamity Boss
                  in parallel dimensions. This removes RNG disparity. The first challenger to defeat
                  their boss (or the last one standing) claims the winner-takes-all circuit wager pot!
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  Cross-Arena Sabotage Launcher
                </h3>
                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  Executing successful attack combos charges your <strong>Sabotage Energy (0-100)</strong>.
                  Spend it to fire hazards directly across the dimensional rift into your rival's arena:
                </p>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-amber-300">DEBRIS BARRAGE (40 Sab)</span>
                      <span className="text-[11px] text-slate-400 block">Collapses ceiling wreckage for 25 instant damage.</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-purple-300">SPAWN SHADOW MINION (70 Sab)</span>
                      <span className="text-[11px] text-slate-400 block">Summons an aggressive minion that attacks every turn.</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-rose-300">PROBABILITY OVERLOAD (100 Sab)</span>
                      <span className="text-[11px] text-slate-400 block">Triggers instant Cosmic Backlash & scrambles their hand.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONSTELLATIONS & WEB3 */}
          {activeTab === 'web3' && (
            <div className="space-y-4">
              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-2">
                  <Globe2 className="w-4 h-4 text-cyan-400" />
                  Solana Devnet Esports Tipping
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Spectators connected with Solana wallets act as <strong>Constellations</strong>.
                  While watching a fight, spectators can send micro-SOL tips (0.001 - 0.005 SOL) to
                  their favorite challenger. Both fighters keep 100% of all tips received regardless of
                  match outcome!
                </p>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  On-Chain Explorer Verification
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every tip transaction is signed on the Solana Devnet blockchain. Click any
                  transaction badge or explorer link in the chat to view the real-time block
                  confirmation, sender address, and transferred lamports on the official Solana Explorer.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-xs font-mono flex items-center justify-between">
                <span>Network: Solana Devnet (Cluster api.devnet.solana.com)</span>
                <span className="text-emerald-400 font-bold">1-Click Faucet Active</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400">
            Channel Arbiter Bihyung • Dokkaebi Stream Rules
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-mono text-xs transition-colors cursor-pointer"
          >
            I UNDERSTAND • CLOSE CODEX
          </button>
        </div>
      </div>
    </div>
  );
};
