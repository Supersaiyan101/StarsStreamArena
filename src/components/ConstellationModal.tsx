import React, { useState } from 'react';
import { Sparkles, X, Check, Droplets, Wallet, Shield } from 'lucide-react';
import type { SpectatorConstellation } from '../types/game';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  constellation: SpectatorConstellation;
  onSave: (updated: SpectatorConstellation) => void;
  onAirdrop: () => Promise<void>;
  walletBalanceSol: number;
}

export const AURA_PRESETS = [
  { id: 'cyan', name: 'Cyan Lightning', color: 'text-cyan-400 border-cyan-400/50 bg-cyan-950/40', glow: 'shadow-cyan-500/30' },
  { id: 'gold', name: 'Radiant Gold', color: 'text-amber-400 border-amber-400/50 bg-amber-950/40', glow: 'shadow-amber-500/30' },
  { id: 'violet', name: 'Void Violet', color: 'text-purple-400 border-purple-400/50 bg-purple-950/40', glow: 'shadow-purple-500/30' },
  { id: 'emerald', name: 'Emerald Star', color: 'text-emerald-400 border-emerald-400/50 bg-emerald-950/40', glow: 'shadow-emerald-500/30' },
];

export const ConstellationModal: React.FC<Props> = ({
  isOpen,
  onClose,
  constellation,
  onSave,
  onAirdrop,
  walletBalanceSol,
}) => {
  const [title, setTitle] = useState(constellation.customTitle);
  const [selectedAura, setSelectedAura] = useState(constellation.avatarColor || 'cyan');
  const [airdropping, setAirdropping] = useState(false);

  if (!isOpen) return null;

  // Determine Rank from tipped total
  const tips = constellation.totalTippedSol;
  const rank = tips >= 0.015 ? 'Myth Grade' : tips >= 0.005 ? 'Narrative Grade' : 'Historical Grade';

  const handleSave = () => {
    onSave({
      ...constellation,
      customTitle: title.trim() || "Constellation 'Silent Watcher'",
      avatarColor: selectedAura,
    });
    onClose();
  };

  const handleFaucet = async () => {
    setAirdropping(true);
    await onAirdrop();
    setAirdropping(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl relative flex flex-col gap-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              STAR STREAM SPECTATOR PROFILE
            </span>
            <h3 className="text-lg font-black text-slate-100">Constellation Studio</h3>
          </div>
        </div>

        {/* Wallet & Balance Banner */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">CONNECTED DEVNET WALLET</span>
              <span className="text-slate-200 font-bold">{constellation.walletAddress}</span>
            </div>
          </div>
          <div className="text-right flex items-center gap-2">
            <div>
              <span className="text-slate-400 block text-[10px]">BALANCE</span>
              <span className="text-emerald-400 font-bold">{walletBalanceSol.toFixed(4)} SOL</span>
            </div>
            <button
              disabled={airdropping}
              onClick={handleFaucet}
              className="p-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs flex items-center gap-1 transition-all cursor-pointer disabled:opacity-40"
              title="Request 1 SOL from Devnet Faucet"
            >
              <Droplets className="w-3.5 h-3.5" />
              {airdropping ? '...' : '+1 SOL'}
            </button>
          </div>
        </div>

        {/* Custom Moniker Input */}
        <div>
          <label className="text-xs font-mono text-slate-400 block mb-1.5 font-semibold">
            YOUR CONSTELLATION MONIKER
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Constellation 'Neon Phantom'"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-400 font-mono shadow-inner"
          />
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            This title will appear in the live Star Stream chat when you cheer and tip fighters!
          </span>
        </div>

        {/* Divine Celestial Aura Presets */}
        <div>
          <label className="text-xs font-mono text-slate-400 block mb-2 font-semibold">
            DIVINE CELESTIAL AURA
          </label>
          <div className="grid grid-cols-2 gap-2">
            {AURA_PRESETS.map((aura) => {
              const isSelected = selectedAura === aura.id;
              return (
                <button
                  key={aura.id}
                  onClick={() => setSelectedAura(aura.id)}
                  className={`p-2.5 rounded-xl border text-left font-mono text-xs font-bold transition-all flex items-center justify-between ${
                    aura.color
                  } ${isSelected ? 'ring-2 ring-cyan-400 shadow-md ' + aura.glow : 'opacity-70 hover:opacity-100'}`}
                >
                  <span>{aura.name}</span>
                  {isSelected && <Check className="w-4 h-4" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Constellation Rank Progression */}
        <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-slate-400 text-[10px] block">CURRENT PRESTIGE RANK</span>
              <span className="text-amber-400 font-bold text-xs">{rank}</span>
            </div>
          </div>
          <span className="text-slate-500 text-[11px]">
            Total Tipped: {constellation.totalTippedSol.toFixed(4)} SOL
          </span>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-sm tracking-wide transition-all shadow-lg shadow-cyan-500/30 cursor-pointer mt-1"
        >
          SAVE IDENTITY & ENTER STREAM
        </button>
      </div>
    </div>
  );
};

