import React from 'react';
import {
  Swords,
  Globe2,
  Trophy,
  User,
  BookOpen,
  Sparkles,
  Zap,
  Eye,
  Radio,
  Coins,
  Shield,
  PlusCircle,
} from 'lucide-react';
import type { SpectatorConstellation } from '../types/game';

interface Props {
  walletAddress: string;
  walletBalanceSol: number;
  constellation: SpectatorConstellation;
  onEnterChallenger: () => void;
  onEnterSpectator: () => void;
  onOpenCodex: () => void;
  onOpenConstellationModal: () => void;
  onOpenArchive: () => void;
  onAirdrop: () => Promise<void>;
}

export const MainLobby: React.FC<Props> = ({
  walletAddress,
  walletBalanceSol,
  constellation,
  onEnterChallenger,
  onEnterSpectator,
  onOpenCodex,
  onOpenConstellationModal,
  onOpenArchive,
  onAirdrop,
}) => {
  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col p-4 md:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Cosmic Glow Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* ============================================================ */}
      {/* TOP HEADER: BRANDING, WALLET, CODEX & MODAL BUTTONS          */}
      {/* ============================================================ */}
      <header className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4 md:p-5 mb-8 backdrop-blur-md shadow-2xl flex flex-wrap items-center justify-between gap-4 relative z-10">
        {/* Left: Star Stream Broadcast Channel */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Globe2 className="w-5 h-5 animate-spin" style={{ animationDuration: '20s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest uppercase bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                STAR STREAM CHANNEL #BI-7623
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                BROADCAST ONLINE
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2 mt-0.5">
              StarStream Arena
            </h1>
          </div>
        </div>

        {/* Right: Controls & Wallet */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Survival Codex / Guide */}
          <button
            onClick={onOpenCodex}
            className="bg-slate-950/90 border border-cyan-500/40 hover:border-cyan-400 rounded-xl px-3.5 py-2 flex items-center gap-2 font-mono text-xs text-cyan-300 transition-all cursor-pointer shadow-md hover:bg-cyan-950/40"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="font-bold">Survival Codex</span>
          </button>

          {/* Constellation Studio Button */}
          <button
            onClick={onOpenConstellationModal}
            className="bg-slate-950/90 border border-slate-800 hover:border-purple-400 rounded-xl px-3 py-2 flex items-center gap-2 font-mono text-xs text-purple-300 transition-all cursor-pointer"
            title="Edit your Constellation Moniker"
          >
            <User className="w-3.5 h-3.5 text-purple-400" />
            <span className="truncate max-w-[130px]">{constellation.customTitle}</span>
          </button>

          {/* Star Archive / Leaderboard */}
          <button
            onClick={onOpenArchive}
            className="bg-slate-950/90 border border-slate-800 hover:border-amber-400 rounded-xl px-3 py-2 flex items-center gap-1.5 font-mono text-xs text-amber-300 transition-all cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Star Archive</span>
          </button>

          {/* Connected Solana Wallet Badge */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-400">{walletAddress}</span>
            <span className="text-emerald-400 font-bold">{walletBalanceSol.toFixed(4)} SOL</span>
            <button
              onClick={onAirdrop}
              title="Request +1.0 SOL Devnet Airdrop"
              className="ml-1 text-[10px] text-cyan-400 hover:text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/30 px-1.5 py-0.5 rounded transition-all flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3 h-3" />
              +1 SOL
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================ */}
      {/* HERO TITLE & LORE INTRO                                      */}
      {/* ============================================================ */}
      <div className="text-center max-w-3xl mx-auto mb-10 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          The Web3 Omniscient Battle Arena on Solana
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-100 tracking-tight leading-tight">
          Enter The Star Stream
        </h2>
        <p className="text-sm md:text-base text-slate-400 mt-3 leading-relaxed">
          Will you enter the brutal scenarios as a mortal <span className="text-cyan-400 font-semibold">Challenger</span> fighting for survival, or sit in the celestial heavens as a <span className="text-purple-400 font-semibold">Constellation</span> watching live duels and tipping SOL?
        </p>
      </div>

      {/* ============================================================ */}
      {/* TWO PRIMARY PATHWAYS (HEROIC PORTAL CARDS)                   */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full flex-1 items-stretch relative z-10 mb-8">
        {/* PORTAL 1: ENTER AS CHALLENGER (FIGHTER) */}
        <div
          onClick={onEnterChallenger}
          className="group relative bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border-2 border-cyan-500/40 hover:border-cyan-400 rounded-3xl p-6 md:p-8 shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-widest bg-cyan-950 px-2.5 py-1 rounded-full border border-cyan-500/40">
                FIGHTER ARENA • 100% FAIR PLAY
              </span>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
                <Swords className="w-6 h-6" />
              </div>
            </div>

            <h3 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight group-hover:text-cyan-300 transition-colors">
              Enter As Challenger
            </h3>
            <p className="text-xs md:text-sm text-slate-400 mt-2.5 leading-relaxed">
              Step onto the arena floor. Choose your combat archetype, wield legendary star relics, and battle in 1v1 mirrored duels or solo trials.
            </p>

            {/* Feature Bullet Points */}
            <div className="space-y-2 mt-5 text-xs text-slate-300 font-mono">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Strict 30-Point Fair Play Cap (Zero Pay-to-Win)</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Symmetrical Twin Duels with Cross-Arena Sabotage</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Winner takes match pot + keeps 100% of audience tips</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={onEnterChallenger}
              className="w-full py-4 rounded-2xl font-bold font-mono text-sm tracking-wide bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer group-hover:shadow-cyan-400/40"
            >
              <Swords className="w-4 h-4" />
              SELECT SCENARIO & ENTER ➔
            </button>
          </div>
        </div>

        {/* PORTAL 2: WATCH AS CONSTELLATION (SPECTATOR) */}
        <div
          onClick={onEnterSpectator}
          className="group relative bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 border-2 border-purple-500/40 hover:border-purple-400 rounded-3xl p-6 md:p-8 shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono text-purple-400 font-bold uppercase tracking-widest bg-purple-950 px-2.5 py-1 rounded-full border border-purple-500/40">
                SPECTATOR LOUNGE • DEVNET TIPPING
              </span>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
                <Eye className="w-6 h-6" />
              </div>
            </div>

            <h3 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight group-hover:text-purple-300 transition-colors">
              Watch As Constellation
            </h3>
            <p className="text-xs md:text-sm text-slate-400 mt-2.5 leading-relaxed">
              Sit in the VIP celestial broadcast box. Browse live Dokkaebi channels, Quick Hop into random online matches, and sponsor fighters with real Devnet SOL tips.
            </p>

            {/* Feature Bullet Points */}
            <div className="space-y-2 mt-5 text-xs text-slate-300 font-mono">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Live 60 FPS Procedural Battle Stream & VIP Chat</span>
              </div>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Micro-Tip Fighters in Real-Time (+0.001 to +0.005 SOL)</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                <span>🎲 1-Click "Quick Hop" into Random Active Arenas</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={onEnterSpectator}
              className="w-full py-4 rounded-2xl font-bold font-mono text-sm tracking-wide bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-slate-100 shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer group-hover:shadow-purple-400/40"
            >
              <Eye className="w-4 h-4" />
              ENTER SPECTATOR THEATER ➔
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* BOTTOM FOOTER TELEMETRY                                      */}
      {/* ============================================================ */}
      <footer className="mt-auto pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 gap-2 relative z-10">
        <div className="flex items-center gap-4">
          <span>CLUSTER: <strong className="text-slate-400">Solana Devnet</strong></span>
          <span>CHAIN ID: <strong className="text-slate-400">103</strong></span>
          <span>COMMISSION: <strong className="text-emerald-400">0% Protocol Fee</strong></span>
        </div>
        <div>
          <span>MLH SOLANA HACKATHON 2026 • STAR STREAM ARENA</span>
        </div>
      </footer>
    </div>
  );
};

