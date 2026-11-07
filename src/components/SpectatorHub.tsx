import React from 'react';
import {
  ArrowLeft,
  Eye,
  Shuffle,
  Users,
} from 'lucide-react';
import type { LiveBroadcastMatch } from '../types/game';
import { MOCK_BROADCAST_MATCHES } from '../data/mockMatches';

interface Props {
  onBackToLobby: () => void;
  onSelectMatch: (match: LiveBroadcastMatch) => void;
  onQuickHop: () => void;
}

export const SpectatorHub: React.FC<Props> = ({
  onBackToLobby,
  onSelectMatch,
  onQuickHop,
}) => {
  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col p-4 md:p-6 lg:p-8">
      {/* ============================================================ */}
      {/* HEADER & QUICK HOP BUTTON                                    */}
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
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-purple-400 font-bold tracking-widest uppercase bg-purple-950 px-2 py-0.5 rounded border border-purple-500/30">
                SPECTATOR NETWORK
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold animate-pulse">
                • 4 ACTIVE CHANNELS
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 mt-0.5">
              Live Star Stream Directory
            </h1>
          </div>
        </div>

        {/* Quick Hop Button */}
        <button
          onClick={onQuickHop}
          className="py-3 px-5 rounded-xl font-bold font-mono text-xs tracking-wide bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-slate-100 shadow-xl shadow-purple-500/30 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Shuffle className="w-4 h-4" />
          <span>🎲 QUICK HOP: SPECTATE RANDOM MATCH</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* LIVE CHANNELS GRID                                           */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 items-start">
        {MOCK_BROADCAST_MATCHES.map((match) => {
          return (
            <div
              key={match.channelId}
              onClick={() => onSelectMatch(match)}
              className="group bg-slate-900/80 border-2 border-slate-800 hover:border-purple-500/60 rounded-2xl p-5 backdrop-blur-md shadow-xl hover:shadow-2xl hover:shadow-purple-950/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Top Channel Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="font-bold text-slate-100 text-sm font-mono">
                      {match.channelName}
                    </span>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-500/30">
                      {match.mode === 'duel' ? '1V1 MIRRORED DUEL' : 'SOLO CALAMITY'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                    <Users className="w-3.5 h-3.5 text-purple-400" />
                    <span>{match.viewerCount} Viewers</span>
                  </div>
                </div>

                {/* Scenario & Boss Info */}
                <div className="mb-4">
                  <span className="text-xs text-slate-400 block font-mono">
                    {match.scenarioName}
                  </span>
                  <div className="text-xs text-rose-400 font-mono mt-0.5 flex items-center gap-2">
                    <span>Boss: {match.bossName}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-amber-400 font-bold">{match.potSol} SOL Pot</span>
                  </div>
                </div>

                {/* Matchup Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-xs font-mono">
                  {/* Channel A Fighter */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-cyan-400 font-bold uppercase block">
                      Channel A (Runner)
                    </span>
                    <span className="font-bold text-slate-200 block text-sm">
                      {match.fighterA.name}
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      {match.fighterA.archetype} • {match.fighterA.relic}
                    </span>
                  </div>

                  {/* Channel B Rival (if duel) */}
                  {match.fighterB ? (
                    <div className="space-y-1 sm:border-l sm:border-slate-800 sm:pl-3">
                      <span className="text-[10px] text-purple-400 font-bold uppercase block">
                        Channel B (Rival)
                      </span>
                      <span className="font-bold text-slate-200 block text-sm">
                        {match.fighterB.name}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        {match.fighterB.archetype} • {match.fighterB.relic}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1 sm:border-l sm:border-slate-800 sm:pl-3 flex flex-col justify-center">
                      <span className="text-[10px] text-slate-500 uppercase block">Solo Trial</span>
                      <span className="text-emerald-400 font-bold">100% Calamity Raid</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Enter Button */}
              <div className="mt-5">
                <button
                  onClick={() => onSelectMatch(match)}
                  className="w-full py-2.5 rounded-xl font-bold font-mono text-xs tracking-wide bg-slate-800 group-hover:bg-purple-600 text-slate-200 group-hover:text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>TUNE IN TO BROADCAST ➔</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
