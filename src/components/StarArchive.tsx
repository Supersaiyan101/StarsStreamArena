import React, { useState } from 'react';
import { Trophy, Coins, ExternalLink, X, Flame } from 'lucide-react';
import { getSolanaExplorerUrl } from '../utils/solanaService';

export interface StarArchiveEntry {
  id: string;
  rank: number;
  challengerName: string;
  arenaName: string;
  theme: 'metro' | 'flooded';
  clearTimeSeconds: number;
  styleScore: number;
  tipsEarnedSol: number;
  walletAddress: string;
  txHash: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTipRunner: (runnerAddress: string, amountSol: number) => Promise<void>;
}

export const SAMPLE_ARCHIVE_ENTRIES: StarArchiveEntry[] = [
  {
    id: '1',
    rank: 1,
    challengerName: 'Dokja_71',
    arenaName: 'Subterranean Metro (Line 3)',
    theme: 'metro',
    clearTimeSeconds: 42,
    styleScore: 18450,
    tipsEarnedSol: 0.048,
    walletAddress: '7xKt...89Jq',
    txHash: '5Kt8YVwzF7PqM18R4xGf57LhNkLpQ2q8z7R9YpVxK18p',
  },
  {
    id: '2',
    rank: 2,
    challengerName: 'StormWalker_Kai',
    arenaName: 'Flooded Metropolis (District 7)',
    theme: 'flooded',
    clearTimeSeconds: 49,
    styleScore: 16200,
    tipsEarnedSol: 0.035,
    walletAddress: '3mPx...72La',
    txHash: '4xGf57LhNkLpQ2q8z7R9YpVxK18p5Kt8YVwzF7PqM18R',
  },
  {
    id: '3',
    rank: 3,
    challengerName: 'Shadow_Ren',
    arenaName: 'Subterranean Metro (Line 3)',
    theme: 'metro',
    clearTimeSeconds: 58,
    styleScore: 13900,
    tipsEarnedSol: 0.022,
    walletAddress: '8qRt...12Lk',
    txHash: '9z7R9YpVxK18p5Kt8YVwzF7PqM18R4xGf57LhNkLpQ2q8',
  },
];

export const StarArchive: React.FC<Props> = ({
  isOpen,
  onClose,
  onTipRunner,
}) => {
  const [entries, setEntries] = useState<StarArchiveEntry[]>(SAMPLE_ARCHIVE_ENTRIES);
  const [filterTheme, setFilterTheme] = useState<'all' | 'metro' | 'flooded'>('all');

  if (!isOpen) return null;

  const filtered = entries.filter((e) => {
    if (filterTheme === 'all') return true;
    return e.theme === filterTheme;
  });

  const handleTip = async (entry: StarArchiveEntry) => {
    await onTipRunner(entry.walletAddress, 0.001);
    setEntries((prev) =>
      prev.map((e) =>
        e.id === entry.id
          ? { ...e, tipsEarnedSol: parseFloat((e.tipsEarnedSol + 0.001).toFixed(4)) }
          : e
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-6 max-w-2xl w-full shadow-2xl relative flex flex-col gap-4 max-h-[85vh] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
              STAR STREAM HALL OF FAME
            </span>
            <h3 className="text-lg font-black text-slate-100">Star Archive & Leaderboard</h3>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          {(
            [
              { id: 'all', label: 'All Scenarios' },
              { id: 'metro', label: '🚇 Metro Line 3' },
              { id: 'flooded', label: '🌊 Flooded Metropolis' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTheme(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                filterTheme === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Leaderboard Table / Cards */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono transition-all"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center text-sm ${
                    entry.rank === 1
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50'
                      : entry.rank === 2
                      ? 'bg-slate-300/20 text-slate-200 border border-slate-400/50'
                      : 'bg-amber-900/20 text-amber-600 border border-amber-700/50'
                  }`}
                >
                  #{entry.rank}
                </span>

                <div>
                  <h4 className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                    {entry.challengerName}
                    <span className="text-[10px] text-slate-500">({entry.walletAddress})</span>
                  </h4>
                  <span className="text-[11px] text-cyan-400 block mt-0.5">
                    {entry.arenaName} • Cleared in {entry.clearTimeSeconds}s
                  </span>
                </div>
              </div>

              {/* Stats & Tip Button */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-amber-400 font-bold block">
                    {entry.styleScore.toLocaleString()} PTS
                  </span>
                  <span className="text-emerald-400 text-[11px]">
                    +{entry.tipsEarnedSol.toFixed(3)} SOL Tipped
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleTip(entry)}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                    title="Tip strategy guide"
                  >
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    +0.001 SOL
                  </button>

                  <a
                    href={getSolanaExplorerUrl(entry.txHash)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="View on Solana Devnet Explorer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Top 10% clear scores receive weekly Devnet Bounty rewards!
          </span>
          <span className="text-emerald-400 font-bold">100% On-Chain Verifiable</span>
        </div>
      </div>
    </div>
  );
};

