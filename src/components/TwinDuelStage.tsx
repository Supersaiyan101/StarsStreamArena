import React, { useState } from 'react';
import type {
  Arena,
  Boss,
  ActiveCombatState,
  PlayerLoadout,
  CounterAction,
  SpectatorConstellation,
} from '../types/game';
import {
  initializeCombatState,
  executePlayerSkill,
  executeCounterAction,
  resolveTurnCycle,
  triggerInteractiveProp,
} from '../utils/combatEngine';
import { executeOpponentAITurn } from '../utils/aiOpponent';
import { SABOTAGE_ACTIONS } from '../data/sabotage';
import { solanaService, getSolanaExplorerUrl } from '../utils/solanaService';
import { audio } from '../utils/audioService';
import { CombatCanvas } from './CombatCanvas';
import { CombatHUD } from './CombatHUD';
import {
  Trophy,
  Skull,
  ArrowLeft,
  Coins,
  Radio,
  Swords,
  ScrollText,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  loadout: PlayerLoadout;
  arena: Arena;
  circuitTier: 'bronze' | 'silver' | 'gold';
  stakeAmountSol: number;
  constellation: SpectatorConstellation;
  onExit: () => void;
  onTipSent: (amountSol: number) => void;
}

export const TwinDuelStage: React.FC<Props> = ({
  loadout: player1Loadout,
  arena: baseArena,
  circuitTier,
  stakeAmountSol,
  constellation,
  onExit,
  onTipSent,
}) => {
  const [matchSettlementTx, setMatchSettlementTx] = useState<string | null>(null);
  // Opponent Loadout (Mirror Challenger)
  const opponentLoadout: PlayerLoadout = {
    name: 'Challenger Ren',
    avatarArchetype: 'shadow_rogue',
    attributes: { strength: 10, agility: 12, resonance: 8 },
    equippedSkills: [
      'plasma_cleave',
      'volt_arc',
      'phase_shift',
      'cyclone_shred',
      'secretive_strike',
    ],
    weapon: {
      name: 'White Pure Star Fluid Dagger',
      koreanLoreRef: 'Condensed Stellar Plasma Dagger',
      description: 'Blistering attack speed with double-hit chance.',
      bonusEffect: 'Rapid combo generation.',
    },
    sponsorContract: 'unsponsored',
  };

  // State Channel A (Player 1)
  const [arenaA, setArenaA] = useState<Arena>({ ...baseArena });
  const [bossA, setBossA] = useState<Boss>({ ...baseArena.boss });
  const [combatA, setCombatA] = useState<ActiveCombatState>(
    initializeCombatState(player1Loadout)
  );
  const [tipsA, setTipsA] = useState(0.008);

  // State Channel B (Opponent)
  const [arenaB, setArenaB] = useState<Arena>({ ...baseArena });
  const [bossB, setBossB] = useState<Boss>({ ...baseArena.boss });
  const [combatB, setCombatB] = useState<ActiveCombatState>(
    initializeCombatState(opponentLoadout)
  );
  const [tipsB, setTipsB] = useState(0.012);

  // Canvas visual feedback
  const [actionStateA, setActionStateA] = useState<
    'idle' | 'attacking' | 'jumping' | 'crouching' | 'parrying' | 'hurt'
  >('idle');
  const [actionStateB, setActionStateB] = useState<
    'idle' | 'attacking' | 'jumping' | 'crouching' | 'parrying' | 'hurt'
  >('idle');
  const [shakeA, setShakeA] = useState(false);
  const [shakeB, setShakeB] = useState(false);
  const [floatingTextsA, setFloatingTextsA] = useState<
    { id: string; text: string; x: number; y: number; color: string; opacity: number }[]
  >([]);
  const [floatingTextsB, setFloatingTextsB] = useState<
    { id: string; text: string; x: number; y: number; color: string; opacity: number }[]
  >([]);

  // Floating text helpers
  const addFloatingTextA = (text: string, color: string = '#38bdf8') => {
    const id = Math.random().toString();
    setFloatingTextsA((prev) => [...prev, { id, text, x: 380, y: 180, color, opacity: 1 }]);
    setTimeout(() => setFloatingTextsA((prev) => prev.filter((t) => t.id !== id)), 1000);
  };

  const addFloatingTextB = (text: string, color: string = '#a855f7') => {
    const id = Math.random().toString();
    setFloatingTextsB((prev) => [...prev, { id, text, x: 380, y: 180, color, opacity: 1 }]);
    setTimeout(() => setFloatingTextsB((prev) => prev.filter((t) => t.id !== id)), 1000);
  };

  // Check if Dokkaebi Flash Bounty was completed
  const prevBountyCompleted = React.useRef(false);
  React.useEffect(() => {
    if (combatA.activeBounty?.isCompleted && !prevBountyCompleted.current) {
      prevBountyCompleted.current = true;
      audio.playCoinJingle();
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      const reward = combatA.activeBounty.rewardSol;
      setTipsA((prev) => parseFloat((prev + reward).toFixed(4)));
      addFloatingTextA(`+${reward} SOL BOUNTY!`, '#fbbf24');
      onTipSent(reward);
    } else if (!combatA.activeBounty?.isCompleted) {
      prevBountyCompleted.current = false;
    }
  }, [combatA.activeBounty?.isCompleted, combatA.activeBounty?.id, onTipSent]);

  // Spectator Tipping Handlers
  const handleTipPlayer1 = async () => {
    const tipAmount = 0.001;
    audio.playCoinJingle();
    setTipsA((prev) => parseFloat((prev + tipAmount).toFixed(4)));
    addFloatingTextA('+0.001 SOL TIP!', '#10b981');
    onTipSent(tipAmount);

    const tx = await solanaService.sendTipTransaction(constellation.walletAddress, '7xKt...89Jq', tipAmount);

    setCombatA((prev) => ({
      ...prev,
      combatLogs: [
        ...prev.combatLogs,
        `[SOLANA DEVNET: ${constellation.customTitle} tipped +${tipAmount} SOL to Channel A!]`,
        `[EXPLORER CONFIRMED: ${tx.signature.slice(0, 16)}...]`,
      ],
    }));
  };

  const handleTipPlayer2 = async () => {
    const tipAmount = 0.001;
    audio.playCoinJingle();
    setTipsB((prev) => parseFloat((prev + tipAmount).toFixed(4)));
    addFloatingTextB('+0.001 SOL TIP!', '#10b981');
    onTipSent(tipAmount);

    const tx = await solanaService.sendTipTransaction(constellation.walletAddress, '3mPx...72La', tipAmount);

    setCombatB((prev) => ({
      ...prev,
      combatLogs: [
        ...prev.combatLogs,
        `[SOLANA DEVNET: ${constellation.customTitle} tipped +${tipAmount} SOL to Channel B!]`,
        `[EXPLORER CONFIRMED: ${tx.signature.slice(0, 16)}...]`,
      ],
    }));
  };

  // Player 1 launches Sabotage against Channel B
  const handleLaunchSabotage = (sabotageId: string) => {
    const sab = SABOTAGE_ACTIONS.find((s) => s.id === sabotageId);
    if (!sab) return;
    if (combatA.sabotageEnergy < sab.cost) return;

    audio.playAlarmSiren();

    // Deduct cost from Player 1
    setCombatA((prev) => ({
      ...prev,
      sabotageEnergy: prev.sabotageEnergy - sab.cost,
      combatLogs: [
        ...prev.combatLogs,
        `[SABOTAGE DEPLOYED: Sent ${sab.name.toUpperCase()} into Channel B's arena!]`,
      ],
    }));

    // Inflict on Channel B
    setCombatB((prev) => ({
      ...prev,
      incomingSabotage: { type: sab.effectType, turnsUntilImpact: 1 },
      combatLogs: [
        ...prev.combatLogs,
        `[⚠️ WARNING: Player 1 has targeted you with ${sab.name.toUpperCase()}!]`,
      ],
    }));

    setShakeB(true);
    setTimeout(() => setShakeB(false), 300);
  };

  // Player 1 Plays a Skill
  const handlePlaySkillA = (skillId: string) => {
    setActionStateA('attacking');
    const skill = combatA.activeHand.find((s) => s.id === skillId);
    if (skill) {
      if (skill.isStigma) {
        audio.playStigmaCast();
      } else if (skill.category === 'tactical') {
        if (skill.id === 'kinetic_deflector') audio.playParryClang();
        else audio.playDodgeWoosh();
      } else {
        audio.playBladeSlash();
      }
    }

    const result = executePlayerSkill(skillId, combatA, bossA, arenaA, player1Loadout);
    setCombatA(result.combatState);
    setBossA(result.bossState);
    setArenaA(result.arena);

    setShakeA(true);
    setTimeout(() => setShakeA(false), 200);
    setTimeout(() => setActionStateA('idle'), 350);

    // Opponent AI responds with a turn
    triggerOpponentTurn();
  };

  // Counter action for Player 1
  const handleCounterA = (action: CounterAction) => {
    setActionStateA(action === 'jump' ? 'jumping' : action === 'crouch' ? 'crouching' : 'parrying');
    const result = executeCounterAction(action, combatA, bossA);

    if (result.success) {
      if (action === 'parry') audio.playParryClang();
      else audio.playDodgeWoosh();
    } else {
      audio.playCosmicBacklash();
    }

    setCombatA(result.combatState);
    setBossA(result.bossState);

    setTimeout(() => setActionStateA('idle'), 400);
  };

  // Player 1 Ends Turn
  const handleEndTurnA = () => {
    const turnResultA = resolveTurnCycle(combatA, bossA, arenaA);
    if (turnResultA.bossState.activeTelegraph) {
      audio.playAlarmSiren();
    }
    if (turnResultA.combatState.probabilityHeat >= 100) {
      audio.playCosmicBacklash();
    }
    setCombatA(turnResultA.combatState);
    setBossA(turnResultA.bossState);
    setArenaA(turnResultA.arena);

    triggerOpponentTurn();
  };

  // Opponent AI execution tick
  const triggerOpponentTurn = () => {
    if (bossB.currentHp <= 0 || combatB.playerHp <= 0) return;

    setActionStateB('attacking');
    const oppResult = executeOpponentAITurn(combatB, bossB, arenaB, opponentLoadout);

    setCombatB(oppResult.combatState);
    setBossB(oppResult.bossState);
    setArenaB(oppResult.arena);

    // If opponent launched sabotage at Player 1
    if (oppResult.sabotageLaunched) {
      const type = oppResult.sabotageLaunched;
      setCombatA((prev) => ({
        ...prev,
        incomingSabotage: { type, turnsUntilImpact: 1 },
        combatLogs: [
          ...prev.combatLogs,
          `[⚠️ WARNING: Opponent fired a ${type.toUpperCase()} strike into your arena!]`,
        ],
      }));
      setShakeA(true);
      setTimeout(() => setShakeA(false), 250);
    }

    setTimeout(() => setActionStateB('idle'), 400);
  };

  // Trigger Prop in Channel A
  const handleTriggerPropA = (propId: string) => {
    const result = triggerInteractiveProp(propId, combatA, bossA, arenaA);
    setCombatA(result.combatState);
    setBossA(result.bossState);
    setArenaA(result.arena);
  };

  // Win Conditions
  const isPlayer1Win = bossA.currentHp <= 0 || combatB.playerHp <= 0;
  const isOpponentWin = bossB.currentHp <= 0 || combatA.playerHp <= 0;
  const isMatchOver = isPlayer1Win || isOpponentWin;

  React.useEffect(() => {
    if (isMatchOver) {
      setMatchSettlementTx(solanaService.generateTxSignature());
      if (isPlayer1Win) {
        audio.playVictoryFanfare();
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
      }
    }
  }, [isMatchOver, isPlayer1Win]);

  const matchPot = stakeAmountSol * 2;

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col p-3 md:p-5">
      {/* ========================================== */}
      {/* TOP BROADCAST BAR */}
      {/* ========================================== */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-3.5 mb-4 backdrop-blur-md shadow-2xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-400/40 flex items-center justify-center text-rose-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest uppercase bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                STAR STREAM TWIN DUEL #BI-7623
              </span>
              <span className="text-[10px] text-rose-400 font-mono font-bold animate-pulse">
                • LIVE PARALLEL STREAMS
              </span>
            </div>
            <h1 className="text-base font-black text-slate-100 flex items-center gap-2">
              Symmetrical Twin Scenarios: {baseArena.name}
            </h1>
          </div>
        </div>

        {/* Center: Match Stakes & Escrow Pot */}
        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2">
            <span className="text-slate-500">ESCROW POT:</span>
            <span className="text-amber-400 font-bold text-sm">{matchPot.toFixed(4)} SOL ◎</span>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-400">
            Circuit: <span className="text-cyan-300 font-bold uppercase">{circuitTier}</span> (
            {stakeAmountSol} SOL each)
          </div>
        </div>

        <button
          onClick={onExit}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Exit Duel
        </button>
      </div>

      {/* ========================================== */}
      {/* SPLIT-SCREEN CHANNELS: CHANNEL A vs CHANNEL B */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 items-start">
        {/* CHANNEL A: PLAYER 1 (YOU) */}
        <div className="bg-slate-900/80 border border-cyan-500/40 rounded-2xl p-4 flex flex-col gap-3 shadow-2xl">
          {/* Channel A Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-bold text-slate-100 text-sm">
                CHANNEL A: {player1Loadout.name} (You)
              </span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                ACTIVE
              </span>
            </div>
            {/* Live Tipping Jar */}
            <div className="flex items-center gap-2">
              <div className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                Tips: {tipsA.toFixed(4)} SOL
              </div>
              <button
                onClick={handleTipPlayer1}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all cursor-pointer"
                title="Audience Micro-Tip to Player 1"
              >
                +0.001 SOL Tip 👏
              </button>
            </div>
          </div>

          {/* Canvas A */}
          <CombatCanvas
            arena={arenaA}
            boss={bossA}
            combatState={combatA}
            loadout={player1Loadout}
            playerActionState={actionStateA}
            screenShake={shakeA}
            floatingTexts={floatingTextsA}
            onTriggerProp={handleTriggerPropA}
          />

          {/* Player 1 HUD & Actions */}
          <CombatHUD
            boss={bossA}
            combatState={combatA}
            arena={arenaA}
            onPlaySkill={handlePlaySkillA}
            onCounterAction={handleCounterA}
            onEndTurn={handleEndTurnA}
            onTriggerProp={handleTriggerPropA}
          />

          {/* Cross-Arena Sabotage Console (Player 1 sends to Channel B) */}
          <div className="bg-slate-950/90 border border-amber-500/40 rounded-xl p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-amber-400 font-bold uppercase flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5" />
                Cross-Arena Sabotage Launcher
              </span>
              <span className="text-slate-400">
                Available Energy: <span className="text-amber-400 font-bold">{combatA.sabotageEnergy} / 100</span>
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {SABOTAGE_ACTIONS.map((sab) => {
                const canAfford = combatA.sabotageEnergy >= sab.cost;
                return (
                  <button
                    key={sab.id}
                    disabled={!canAfford}
                    onClick={() => handleLaunchSabotage(sab.id)}
                    className={`p-2 rounded-lg border text-left font-mono text-xs transition-all flex flex-col justify-between ${
                      canAfford
                        ? 'bg-amber-950/30 border-amber-500/50 hover:bg-amber-900/40 text-amber-200 cursor-pointer shadow-md'
                        : 'bg-slate-900/40 border-slate-800 text-slate-600 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <span className="font-bold block truncate">{sab.name}</span>
                    <span className="text-[10px] text-amber-400 mt-1">{sab.cost} Sab Energy</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* CHANNEL B: OPPONENT (CHALLENGER REN) */}
        <div className="bg-slate-900/80 border border-purple-500/40 rounded-2xl p-4 flex flex-col gap-3 shadow-2xl">
          {/* Channel B Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
              <span className="font-bold text-slate-100 text-sm">
                CHANNEL B: {opponentLoadout.name}
              </span>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-500/30">
                MIRROR TWIN
              </span>
            </div>
            {/* Live Tipping Jar */}
            <div className="flex items-center gap-2">
              <div className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                Tips: {tipsB.toFixed(4)} SOL
              </div>
              <button
                onClick={handleTipPlayer2}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold transition-all cursor-pointer"
                title="Audience Micro-Tip to Player 2"
              >
                +0.001 SOL Tip 🔥
              </button>
            </div>
          </div>

          {/* Canvas B */}
          <CombatCanvas
            arena={arenaB}
            boss={bossB}
            combatState={combatB}
            loadout={opponentLoadout}
            playerActionState={actionStateB}
            screenShake={shakeB}
            floatingTexts={floatingTextsB}
            onTriggerProp={() => {}}
          />

          {/* Channel B Incoming Sabotage Indicator */}
          {combatB.incomingSabotage && (
            <div className="bg-purple-950/60 border border-purple-500/60 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono text-purple-300 animate-pulse">
              <span className="flex items-center gap-2">
                <span className="text-base">🚀</span>
                <span className="font-bold uppercase">
                  INCOMING SABOTAGE: {combatB.incomingSabotage.type}
                </span>
              </span>
              <span className="text-amber-400 font-bold">
                Impacts in {combatB.incomingSabotage.turnsUntilImpact} turn!
              </span>
            </div>
          )}

          {/* Opponent Status Display */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col gap-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Opponent HP:</span>
              <span className="text-emerald-400 font-bold">
                {combatB.playerHp} / {combatB.maxPlayerHp}
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-purple-500 h-full rounded-full transition-all"
                style={{ width: `${(combatB.playerHp / combatB.maxPlayerHp) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-slate-400">Opponent Boss HP:</span>
              <span className="text-rose-400 font-bold">
                {bossB.currentHp} / {bossB.maxHp}
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className="bg-rose-500 h-full rounded-full transition-all"
                style={{ width: `${(bossB.currentHp / bossB.maxHp) * 100}%` }}
              />
            </div>
          </div>

          {/* Opponent Broadcast Logs */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 flex flex-col h-[280px]">
            <span className="text-xs font-mono font-bold text-purple-400 flex items-center gap-1.5 uppercase border-b border-slate-800 pb-1.5 mb-2">
              <ScrollText className="w-3.5 h-3.5" />
              Channel B Combat Telemetry
            </span>
            <div className="flex-1 overflow-y-auto space-y-1.5 font-mono text-xs pr-1">
              {combatB.combatLogs.map((log, i) => (
                <div key={i} className="text-slate-400 text-[11px] leading-relaxed">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* FINAL DUAL SETTLEMENT MODAL */}
      {/* ========================================== */}
      {isMatchOver && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-7 max-w-lg w-full shadow-2xl text-center flex flex-col items-center">
            {isPlayer1Win ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-500/30">
                  <Trophy className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-100">VICTORY IN CHANNEL A!</h2>
                <p className="text-sm text-emerald-400 font-mono mt-1 font-bold">
                  You conquered the Mirrored Twin Scenario!
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-400 mb-3 shadow-lg shadow-rose-500/30">
                  <Skull className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-100">MATCH DEFEAT</h2>
                <p className="text-sm text-rose-400 font-mono mt-1 font-bold">
                  Channel B cleared the scenario first.
                </p>
              </>
            )}

            {/* Complete Dual Settlement Breakdown */}
            <div className="my-5 p-4 bg-slate-950 rounded-xl border border-slate-800 w-full text-left text-xs font-mono space-y-2">
              <div className="text-[11px] font-bold text-cyan-400 border-b border-slate-800 pb-1 uppercase flex items-center justify-between">
                <span>Solana Smart Escrow Settlement</span>
                <span className="text-emerald-400">0.4s Finality</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Match Prize Pot ({circuitTier.toUpperCase()}):</span>
                <span className="text-amber-400 font-bold">{matchPot.toFixed(4)} SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Claimed by Winner:</span>
                <span className="text-slate-100 font-bold">
                  {isPlayer1Win ? player1Loadout.name : opponentLoadout.name}
                </span>
              </div>
              <div className="border-t border-slate-800/80 pt-2 flex justify-between">
                <span className="text-slate-400">Player 1 Crowd Tips Kept:</span>
                <span className="text-emerald-400 font-bold">+{tipsA.toFixed(4)} SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Player 2 Crowd Tips Kept:</span>
                <span className="text-emerald-400 font-bold">+{tipsB.toFixed(4)} SOL</span>
              </div>

              <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Escrow Payout Tx:</span>
                <a
                  href={getSolanaExplorerUrl(matchSettlementTx || '5Kt8YVwzF7PqM18R4xGf57LhNkLpQ2q8z7R9YpVxK18p')}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 underline flex items-center gap-1 hover:text-cyan-300"
                >
                  View on Solana Explorer <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <button
              onClick={onExit}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-sm tracking-wide transition-all shadow-lg shadow-cyan-500/30 cursor-pointer"
            >
              RETURN TO MAIN LOBBY
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
