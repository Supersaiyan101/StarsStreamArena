import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Coins,
  Shuffle,
  MessageSquare,
  ExternalLink,
  Send,
} from 'lucide-react';
import type { LiveBroadcastMatch, SpectatorConstellation, Arena, Boss, ActiveCombatState, PlayerLoadout } from '../types/game';
import { ARENAS } from '../data/arenas';
import { CombatCanvas } from './CombatCanvas';
import { audio } from '../utils/audioService';
import { solanaService, getSolanaExplorerUrl } from '../utils/solanaService';
import confetti from 'canvas-confetti';

interface Props {
  match: LiveBroadcastMatch;
  constellation: SpectatorConstellation;
  walletBalanceSol: number;
  onExit: () => void;
  onHopNext: () => void;
  onTipSent: (amountSol: number) => void;
}

export const SpectatorTheater: React.FC<Props> = ({
  match,
  constellation,
  onExit,
  onHopNext,
  onTipSent,
}) => {
  const arena: Arena = ARENAS.find((a) => a.id === match.arenaId) || ARENAS[0];

  // Channel A State
  const [bossHpA, setBossHpA] = useState(match.mode === 'duel' ? 240 : 380);
  const playerHpA = match.fighterA.hp;
  const [tipsA, setTipsA] = useState(0.012);
  const [actionA, setActionA] = useState<'idle' | 'attacking' | 'jumping' | 'crouching' | 'parrying' | 'hurt'>('idle');
  const [floatingTextsA, setFloatingTextsA] = useState<
    { id: string; text: string; x: number; y: number; color: string; opacity: number }[]
  >([]);

  // Channel B State
  const [bossHpB, setBossHpB] = useState(260);
  const playerHpB = match.fighterB ? match.fighterB.hp : 200;
  const [tipsB, setTipsB] = useState(0.009);
  const [actionB, setActionB] = useState<'idle' | 'attacking' | 'jumping' | 'crouching' | 'parrying' | 'hurt'>('idle');
  const [floatingTextsB, setFloatingTextsB] = useState<
    { id: string; text: string; x: number; y: number; color: string; opacity: number }[]
  >([]);

  // Chat Feed
  const [chatMessages, setChatMessages] = useState<
    { id: string; sender: string; text: string; isTip?: boolean; tx?: string }[]
  >([
    {
      id: '1',
      sender: "Constellation 'Demon-like Judge of Fire'",
      text: 'What a magnificent clash of wills in Carriage 3807!',
    },
    {
      id: '2',
      sender: "Constellation 'Prisoner of the Golden Headband'",
      text: 'Stop hesitating! Break the Calamity armor!',
    },
    {
      id: '3',
      sender: "Dokkaebi Arbiter Bihyung",
      text: `Channel #${match.channelId} is surging with narrative Probability!`,
    },
  ]);
  const [userChatInput, setUserChatInput] = useState('');

  // Add floating text helper
  const addFloatingA = (text: string, color = '#38bdf8') => {
    const id = Math.random().toString();
    setFloatingTextsA((prev) => [...prev, { id, text, x: 380, y: 170, color, opacity: 1 }]);
    setTimeout(() => setFloatingTextsA((prev) => prev.filter((t) => t.id !== id)), 1000);
  };

  const addFloatingB = (text: string, color = '#a855f7') => {
    const id = Math.random().toString();
    setFloatingTextsB((prev) => [...prev, { id, text, x: 380, y: 170, color, opacity: 1 }]);
    setTimeout(() => setFloatingTextsB((prev) => prev.filter((t) => t.id !== id)), 1000);
  };

  // Automated Spectator Combat Simulation Tick
  useEffect(() => {
    const interval = setInterval(() => {
      // Channel A attack
      const dmgA = Math.floor(Math.random() * 25) + 15;
      setActionA('attacking');
      audio.playBladeSlash();
      setBossHpA((prev) => Math.max(0, prev - dmgA));
      addFloatingA(`-${dmgA} DMG`, '#38bdf8');
      setTimeout(() => setActionA('idle'), 400);

      // Channel B attack (if duel)
      if (match.mode === 'duel') {
        setTimeout(() => {
          const dmgB = Math.floor(Math.random() * 22) + 12;
          setActionB('attacking');
          setBossHpB((prev) => Math.max(0, prev - dmgB));
          addFloatingB(`-${dmgB} DMG`, '#a855f7');
          setTimeout(() => setActionB('idle'), 400);
        }, 1200);
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [match.mode]);

  // Handle Tip from Spectator
  const handleTip = async (channel: 'A' | 'B', amountSol: number) => {
    audio.playCoinJingle();
    onTipSent(amountSol);

    if (channel === 'A') {
      setTipsA((prev) => parseFloat((prev + amountSol).toFixed(4)));
      addFloatingA(`+${amountSol} SOL TIP! 👏`, '#10b981');
    } else {
      setTipsB((prev) => parseFloat((prev + amountSol).toFixed(4)));
      addFloatingB(`+${amountSol} SOL TIP! 👏`, '#10b981');
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
    });

    const targetAddress = channel === 'A' ? '7xKt...89Jq' : '3mPx...72La';
    const tx = await solanaService.sendTipTransaction(constellation.walletAddress, targetAddress, amountSol);

    setChatMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: constellation.customTitle,
        text: `sponsored +${amountSol} SOL to ${channel === 'A' ? match.fighterA.name : match.fighterB?.name}!`,
        isTip: true,
        tx: tx.signature,
      },
    ]);
  };

  // Handle Send Chat
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;

    setChatMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: constellation.customTitle,
        text: userChatInput.trim(),
      },
    ]);
    setUserChatInput('');
  };

  // Mock Combat states for Canvas rendering
  const dummyBossA: Boss = {
    ...arena.boss,
    currentHp: bossHpA,
  };
  const dummyCombatA: ActiveCombatState = {
    playerHp: playerHpA,
    maxPlayerHp: match.fighterA.maxHp,
    playerEnergy: 3,
    maxPlayerEnergy: 3,
    probabilityHeat: 42,
    sabotageEnergy: 55,
    stigmaMeter: 50,
    deckDrawPile: [],
    deckDiscardPile: [],
    activeHand: [],
    comboCount: 3,
    styleRating: 1400,
    isAirborne: false,
    shieldPoints: 20,
    isStunned: false,
    combatLogs: [],
    incomingSabotage: null,
  };
  const dummyLoadoutA: PlayerLoadout = {
    name: match.fighterA.name,
    avatarArchetype: 'blade_disciple',
    attributes: { strength: 12, agility: 10, resonance: 8 },
    equippedSkills: [],
    weapon: { name: match.fighterA.relic, koreanLoreRef: '', description: '', bonusEffect: '' },
    sponsorContract: 'unsponsored',
  };

  const dummyBossB: Boss = {
    ...arena.boss,
    currentHp: bossHpB,
  };
  const dummyCombatB: ActiveCombatState = {
    playerHp: playerHpB,
    maxPlayerHp: match.fighterB?.maxHp || 200,
    playerEnergy: 3,
    maxPlayerEnergy: 3,
    probabilityHeat: 38,
    sabotageEnergy: 40,
    stigmaMeter: 45,
    deckDrawPile: [],
    deckDiscardPile: [],
    activeHand: [],
    comboCount: 2,
    styleRating: 1200,
    isAirborne: false,
    shieldPoints: 15,
    isStunned: false,
    combatLogs: [],
    incomingSabotage: null,
  };
  const dummyLoadoutB: PlayerLoadout = {
    name: match.fighterB?.name || 'Rival',
    avatarArchetype: 'shadow_rogue',
    attributes: { strength: 8, agility: 14, resonance: 8 },
    equippedSkills: [],
    weapon: { name: match.fighterB?.relic || 'Dagger', koreanLoreRef: '', description: '', bonusEffect: '' },
    sponsorContract: 'unsponsored',
  };

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col p-4 md:p-6 lg:p-8">
      {/* ============================================================ */}
      {/* BROADCAST HEADER & ACTION BAR                                */}
      {/* ============================================================ */}
      <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-4 md:p-5 mb-5 backdrop-blur-md shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Directory</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-purple-400 font-bold tracking-widest uppercase bg-purple-950 px-2 py-0.5 rounded border border-purple-500/30">
                {match.channelName}
              </span>
              <span className="text-[10px] text-rose-400 font-mono font-bold animate-pulse">
                • 🔴 LIVE BROADCAST
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                ({match.viewerCount} Constellations Watching)
              </span>
            </div>
            <h1 className="text-base md:text-lg font-black text-slate-100 mt-0.5">
              {match.scenarioName}
            </h1>
          </div>
        </div>

        {/* Center: Pot & Quick Hop */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <span className="text-slate-500">CIRCUIT POT:</span>
            <span className="text-amber-400 font-bold">{match.potSol} SOL ◎</span>
          </div>

          <button
            onClick={onHopNext}
            className="py-2 px-3.5 rounded-xl font-bold font-mono text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            title="Jump to another random active match"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Hop Next Match</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MAIN STAGE: COMBAT BROADCAST (LEFT) & VIP CHAT (RIGHT)       */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
        {/* COMBAT VIEW (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className={`grid grid-cols-1 ${match.mode === 'duel' ? 'md:grid-cols-2' : ''} gap-4`}>
            {/* CHANNEL A */}
            <div className="bg-slate-900/80 border-2 border-cyan-500/40 rounded-2xl p-4 flex flex-col gap-3 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span className="font-bold text-slate-100 text-sm">{match.fighterA.name}</span>
                  <span className="text-[10px] font-mono text-cyan-400">({match.fighterA.archetype})</span>
                </div>
                <div className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  Tips: {tipsA.toFixed(3)} SOL
                </div>
              </div>

              {/* Canvas A */}
              <CombatCanvas
                arena={arena}
                boss={dummyBossA}
                combatState={dummyCombatA}
                loadout={dummyLoadoutA}
                playerActionState={actionA}
                screenShake={false}
                floatingTexts={floatingTextsA}
                onTriggerProp={() => {}}
              />

              {/* Boss HP Bar */}
              <div className="space-y-1 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Boss: {match.bossName}</span>
                  <span className="text-rose-400 font-bold">{bossHpA} / {arena.boss.maxHp} HP</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-rose-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(bossHpA / arena.boss.maxHp) * 100}%` }}
                  />
                </div>
              </div>

              {/* Spectator Tipping Station A */}
              <div className="bg-slate-950/90 border border-cyan-500/30 rounded-xl p-3 flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-cyan-300 font-bold">Sponsor {match.fighterA.name}:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTip('A', 0.001)}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
                  >
                    +0.001 SOL 👏
                  </button>
                  <button
                    onClick={() => handleTip('A', 0.005)}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
                  >
                    +0.005 SOL 🔥
                  </button>
                </div>
              </div>
            </div>

            {/* CHANNEL B (IF DUEL) */}
            {match.mode === 'duel' && match.fighterB && (
              <div className="bg-slate-900/80 border-2 border-purple-500/40 rounded-2xl p-4 flex flex-col gap-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                    <span className="font-bold text-slate-100 text-sm">{match.fighterB.name}</span>
                    <span className="text-[10px] font-mono text-purple-400">({match.fighterB.archetype})</span>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    Tips: {tipsB.toFixed(3)} SOL
                  </div>
                </div>

                {/* Canvas B */}
                <CombatCanvas
                  arena={arena}
                  boss={dummyBossB}
                  combatState={dummyCombatB}
                  loadout={dummyLoadoutB}
                  playerActionState={actionB}
                  screenShake={false}
                  floatingTexts={floatingTextsB}
                  onTriggerProp={() => {}}
                />

                {/* Boss HP Bar */}
                <div className="space-y-1 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Boss: {match.bossName}</span>
                    <span className="text-rose-400 font-bold">{bossHpB} / {arena.boss.maxHp} HP</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(bossHpB / arena.boss.maxHp) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Spectator Tipping Station B */}
                <div className="bg-slate-950/90 border border-purple-500/30 rounded-xl p-3 flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-purple-300 font-bold">Sponsor {match.fighterB.name}:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTip('B', 0.001)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
                    >
                      +0.001 SOL 👏
                    </button>
                    <button
                      onClick={() => handleTip('B', 0.005)}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
                    >
                      +0.005 SOL 🔥
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CONSTELLATION VIP CHAT & TIPPING FEED (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col h-[580px] shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <h3 className="font-bold text-slate-100 text-xs font-mono">CONSTELLATION VIP FEED</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">Solana Devnet Live</span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-xs font-mono">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2.5 rounded-xl border ${
                  msg.isTip
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                    : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[11px] text-cyan-300">{msg.sender}</span>
                </div>
                <p className="mt-1 leading-snug">{msg.text}</p>
                {msg.tx && (
                  <a
                    href={getSolanaExplorerUrl(msg.tx)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 underline mt-1.5 font-mono"
                  >
                    <span>View Devnet Tx</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={handleSendChat} className="mt-3 pt-3 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={userChatInput}
              onChange={(e) => setUserChatInput(e.target.value)}
              placeholder="Send message as Constellation..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-400"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
