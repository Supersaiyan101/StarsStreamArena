import React, { useState } from 'react';
import { Send, Coins, ExternalLink, MessageSquare } from 'lucide-react';
import type { StarStreamChatMessage, SpectatorConstellation } from '../types/game';
import { solanaService } from '../utils/solanaService';

interface Props {
  constellation: SpectatorConstellation;
  onSendTip: (amountSol: number, customMessage?: string) => Promise<void>;
  targetPlayerName: string;
}

export const StreamChat: React.FC<Props> = ({
  constellation,
  onSendTip,
  targetPlayerName,
}) => {
  const [messages, setMessages] = useState<StarStreamChatMessage[]>([
    {
      id: '1',
      senderTitle: "Constellation 'Dragon Slayer'",
      message: 'Channel A is putting on a masterclass in dodging!',
      tipAmountSol: 0.001,
      timestamp: '00:05',
      type: 'tip',
    },
    {
      id: '2',
      senderTitle: "The Overseer",
      message: 'Channel #BI-7623 has reached 142 live Constellation spectators.',
      timestamp: '00:08',
      type: 'overseer',
    },
    {
      id: '3',
      senderTitle: "Constellation 'Iron Sovereign'",
      message: 'Wait till the train spawns in Phase 2, that will test their reflexes!',
      timestamp: '00:12',
      type: 'chat',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [selectedTipAmount, setSelectedTipAmount] = useState<number>(0.001);
  const [recentTxUrl, setRecentTxUrl] = useState<string | null>(null);

  const handleSend = async () => {
    if (!inputMessage.trim() && selectedTipAmount <= 0) return;

    const tipAmount = selectedTipAmount;
    const msgText = inputMessage.trim() || `Cheering for ${targetPlayerName}!`;

    // Process on-chain transaction via Solana service
    const tx = await solanaService.sendTipTransaction(
      constellation.walletAddress,
      '7xKt...89Jq',
      tipAmount
    );

    setRecentTxUrl(tx.explorerUrl);

    // Append to live feed
    const newMsg: StarStreamChatMessage = {
      id: Math.random().toString(),
      senderTitle: constellation.customTitle,
      message: msgText,
      tipAmountSol: tipAmount > 0 ? tipAmount : undefined,
      timestamp: 'Live',
      type: tipAmount > 0 ? 'tip' : 'chat',
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Trigger parent tip
    if (tipAmount > 0) {
      await onSendTip(tipAmount, msgText);
    }
  };

  const handleQuickTip = async (amount: number, cheerText: string) => {
    setSelectedTipAmount(amount);
    const tx = await solanaService.sendTipTransaction(
      constellation.walletAddress,
      '7xKt...89Jq',
      amount
    );
    setRecentTxUrl(tx.explorerUrl);

    const newMsg: StarStreamChatMessage = {
      id: Math.random().toString(),
      senderTitle: constellation.customTitle,
      message: cheerText,
      tipAmountSol: amount,
      timestamp: 'Live',
      type: 'tip',
    };

    setMessages((prev) => [...prev, newMsg]);
    await onSendTip(amount, cheerText);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 backdrop-blur-md shadow-xl flex flex-col h-full justify-between">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-slate-100 uppercase">
            Live Spectator Feed
          </span>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
          Target: {targetPlayerName}
        </span>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[160px] max-h-[220px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg text-xs font-mono leading-relaxed border ${
              msg.type === 'tip'
                ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                : msg.type === 'overseer'
                ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-300'
                : 'bg-slate-950/60 border-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
              <span className="font-bold text-cyan-300 truncate">{msg.senderTitle}</span>
              {msg.tipAmountSol && (
                <span className="text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/30">
                  +{msg.tipAmountSol} SOL ◎
                </span>
              )}
            </div>
            <p className="text-slate-200 text-xs">{msg.message}</p>
          </div>
        ))}
      </div>

      {/* Explorer Link Toast */}
      {recentTxUrl && (
        <a
          href={recentTxUrl}
          target="_blank"
          rel="noreferrer"
          className="my-2 bg-emerald-950/60 border border-emerald-500/40 rounded-lg p-2 flex items-center justify-between text-[11px] font-mono text-emerald-300 hover:bg-emerald-900/40 transition-colors"
        >
          <span className="flex items-center gap-1.5 truncate">
            <Coins className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Tx Confirmed on Solana Devnet!</span>
          </span>
          <span className="flex items-center gap-1 text-cyan-400 underline shrink-0">
            Explorer <ExternalLink className="w-3 h-3" />
          </span>
        </a>
      )}

      {/* Quick Reaction Tipping Buttons */}
      <div className="grid grid-cols-3 gap-1.5 my-2">
        <button
          onClick={() => handleQuickTip(0.001, '👏 Insane Combo!')}
          className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-[10px] font-mono text-amber-300 transition-all flex flex-col items-center cursor-pointer"
        >
          <span>👏 Combo!</span>
          <span className="text-emerald-400 font-bold mt-0.5">+0.001 SOL</span>
        </button>
        <button
          onClick={() => handleQuickTip(0.002, '🛡️ Clutch Parry!')}
          className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-[10px] font-mono text-amber-300 transition-all flex flex-col items-center cursor-pointer"
        >
          <span>🛡️ Parry!</span>
          <span className="text-emerald-400 font-bold mt-0.5">+0.002 SOL</span>
        </button>
        <button
          onClick={() => handleQuickTip(0.005, '🔥 Absolute Cinema!')}
          className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-[10px] font-mono text-amber-300 transition-all flex flex-col items-center cursor-pointer"
        >
          <span>🔥 Cinema!</span>
          <span className="text-emerald-400 font-bold mt-0.5">+0.005 SOL</span>
        </button>
      </div>

      {/* Custom Message & Tip Input Bar */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Cheer on stream..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-400 font-mono"
        />
        <button
          onClick={handleSend}
          className="p-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
          title="Send cheer & tip"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
