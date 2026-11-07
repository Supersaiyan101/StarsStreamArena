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
  executeCounterAction,
  resolveTurnCycle,
  triggerInteractiveProp,
  executePokemonStyleTurn,
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
  const [viewportMode, setViewportMode] = useState<'split' | 'channelA' | 'channelB'>('split');
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

  // Cross-Arena Sabotage Projectile Animation State
  const [activeMissile, setActiveMissile] = useState<{
    from: 'channelA' | 'channelB';
    to: 'channelA' | 'channelB';
    type: string;
    progress: number;
  } | null>(null);

  const launchSabotageMissile = (from: 'channelA' | 'channelB', to: 'channelA' | 'channelB', type: string) => {
    setActiveMissile({ from, to, type, progress: 0 });
    let prog = 0;
    const interval = setInterval(() => {
      prog += 10;
      if (prog >= 100) {
        clearInterval(interval);
        setActiveMissile(null);
        audio.playExplosionThud();
        if (to === 'channelB') {
          setShakeB(true);
          setTimeout(() => setShakeB(false), 300);
          addFloatingTextB(`💥 INCOMING ${type.toUpperCase()}!`, '#f43f5e');
        } else {
          setShakeA(true);
          setTimeout(() => setShakeA(false), 300);
          addFloatingTextA(`💥 INCOMING ${type.toUpperCase()}!`, '#f43f5e');
        }
      } else {
        setActiveMissile({ from, to, type, progress: prog });
      }
    }, 45);
  };

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
    launchSabotageMissile('channelA', 'channelB', sab.effectType);

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
  };

  // Player 1 Plays a Skill (Pokémon-Style Turn Initiative & Elemental Calculation)
  const handlePlaySkillA = (skillId: string) => {
    setActionStateA('attacking');
    const skill = combatA.activeHand.find((s) => s.id === skillId);
    if (skill) {
      if (skill.isStigma) {
        audio.playStigmaCast();
      } else if (skill.category === 'tactical' || skill.moveRole === 'priority') {
        if (skill.id === 'kinetic_deflector') audio.playParryClang();
        else audio.playDodgeWoosh();
      } else {
        audio.playBladeSlash();
      }
    }

    const turnResult = executePokemonStyleTurn(skillId, combatA, bossA, arenaA, player1Loadout);

    if (turnResult.isSuperEffective) {
      audio.playParryClang();
      addFloatingTextA('💥 SUPER EFFECTIVE! (2.0x)', '#fbbf24');
    } else if (turnResult.isResisted) {
      addFloatingTextA('🛡️ RESISTED (0.5x)', '#94a3b8');
    }

    if (turnResult.damageDealtByPlayer > 0) {
      addFloatingTextA(`-${turnResult.damageDealtByPlayer} DMG`, '#f43f5e');
      setShakeA(true);
      setTimeout(() => setShakeA(false), 200);
    }

    if (turnResult.damageDealtByBoss > 0) {
      setTimeout(() => {
        addFloatingTextA(`-${turnResult.damageDealtByBoss} HP`, '#ef4444');
        setActionStateA('hurt');
        setTimeout(() => setActionStateA('idle'), 300);
      }, 400);
    }

    setCombatA(turnResult.combatState);
    setBossA(turnResult.bossState);
    setArenaA(turnResult.arena);

    setTimeout(() => setActionStateA('idle'), 350);

    // Opponent AI responds with a turn
    triggerOpponentTurn();
  };

  // Counter action for Player 1
  const handleCounterA = (action: CounterAction) => {
    setActionStateA(action === 'jump' ? 'jumping' : action === 'crouch' ? 'crouching' : 'parrying');
    const result = executeCounterAction(action, combatA, bossA);

    if (result.success) {
      if (action === 'parry') {
        audio.playParryClang();
        addFloatingTextA('🛡️ PERFECT PARRY!', '#10b981');
      } else if (action === 'jump') {
        audio.playDodgeWoosh();
        addFloatingTextA('⬆️ CLEAN LEAP!', '#38bdf8');
      } else {
        audio.playDodgeWoosh();
        addFloatingTextA('⬇️ SLIDE EVASION!', '#38bdf8');
      }
    } else {
      audio.playCosmicBacklash();
      addFloatingTextA('❌ COUNTER FAILED!', '#ef4444');
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
      launchSabotageMissile('channelB', 'channelA', type);
      setCombatA((prev) => ({
        ...prev,
        incomingSabotage: { type, turnsUntilImpact: 1 },
        combatLogs: [
          ...prev.combatLogs,
          `[⚠️ WARNING: Opponent fired a ${type.toUpperCase()} strike into your arena!]`,
        ],
      }));
    }

    setTimeout(() => setActionStateB('idle'), 400);
  };

  // Trigger Prop in Channel A
  const handleTriggerPropA = (propId: string) => {
    addFloatingTextA('⚡ PROP DISCHARGED!', '#38bdf8');
    audio.playExplosionThud();
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
          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 hidden sm:block">
            Circuit: <span className="text-cyan-300 font-bold uppercase">{circuitTier}</span> (
            {stakeAmountSol} SOL each)
          </div>
        </div>

        {/* Viewport Focus Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setViewportMode('split')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              viewportMode === 'split'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚡ Split 50/50
          </button>
          <button
            onClick={() => setViewportMode('channelA')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              viewportMode === 'channelA'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🛡️ Focus You
          </button>
          <button
            onClick={() => setViewportMode('channelB')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              viewportMode === 'channelB'
                ? 'bg-purple-500 text-slate-950 font-bold shadow-md shadow-purple-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            👁️ Focus Rival
          </button>
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
      <div className={`grid gap-4 flex-1 items-start ${
        viewportMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
      }`}>
        {/* CHANNEL A: PLAYER 1 (YOU) */}
        <div className={`bg-slate-900/80 border border-cyan-500/40 rounded-2xl p-4 flex-col gap-3 shadow-2xl ${
          viewportMode === 'channelB' ? 'hidden' : 'flex'
        }`}>
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

          {/* Player 1 HUD Wrapping Canvas A and Sabotage Console */}
          <CombatHUD
            boss={bossA}
            combatState={combatA}
            arena={arenaA}
            loadout={player1Loadout}
            onPlaySkill={handlePlaySkillA}
            onCounterAction={handleCounterA}
            onEndTurn={handleEndTurnA}
            onTriggerProp={handleTriggerPropA}
            extraActions={
              <div className="bg-slate-950/90 border border-amber-500/40 rounded-xl p-2.5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-amber-400 font-bold uppercase flex items-center gap-1.5 text-[11px]">
                    <Swords className="w-3.5 h-3.5" />
                    Cross-Arena Sabotage Console
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    Energy: <span className="text-amber-400 font-bold">{combatA.sabotageEnergy} / 100</span>
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {SABOTAGE_ACTIONS.map((sab) => {
                    const canAfford = combatA.sabotageEnergy >= sab.cost;
                    return (
                      <button
                        key={sab.id}
                        disabled={!canAfford}
                        onClick={() => handleLaunchSabotage(sab.id)}
                        className={`p-1.5 rounded-lg border text-left font-mono text-xs transition-all flex flex-col justify-between ${
                          canAfford
                            ? 'bg-amber-950/30 border-amber-500/50 hover:bg-amber-900/40 text-amber-200 cursor-pointer shadow-md'
                            : 'bg-slate-900/40 border-slate-800 text-slate-600 opacity-40 cursor-not-allowed'
                        }`}
                      >
                        <span className="font-bold block truncate text-[11px]">{sab.name}</span>
                        <span className="text-[9px] text-amber-400 mt-0.5">{sab.cost}⚡ Energy</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            }
          >
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
          </CombatHUD>
        </div>

        {/* CHANNEL B: OPPONENT (CHALLENGER REN) */}
        <div className={`bg-slate-900/80 border border-purple-500/40 rounded-2xl p-3 sm:p-4 flex-col gap-2.5 shadow-2xl ${
          viewportMode === 'channelA' ? 'hidden' : 'flex'
        }`}>
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

          {/* Symmetrical Dual Health Bar for Channel B */}
          <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-3 shadow-xl backdrop-blur-md">
            <div className="grid grid-cols-12 gap-2 sm:gap-3 items-center">
              {/* Opponent HP */}
              <div className="col-span-5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse shrink-0" />
                    <span className="font-bold text-slate-100 text-xs sm:text-sm font-mono truncate">
                      {opponentLoadout.name}
                    </span>
                  </div>
                  <span className="text-purple-400 font-bold font-mono text-xs sm:text-sm shrink-0">
                    {combatB.playerHp} / {combatB.maxPlayerHp} HP
                  </span>
                </div>
                <div className="relative w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 shadow-sm"
                    style={{ width: `${(combatB.playerHp / combatB.maxPlayerHp) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>ENERGY: 3/3 ⚡</span>
                  <span>HEAT: {combatB.probabilityHeat}%</span>
                </div>
              </div>

              {/* VS */}
              <div className="col-span-2 flex flex-col items-center justify-center border-x border-slate-800/80 px-1 text-center">
                <span className="text-[11px] font-black font-mono text-purple-400/90 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  VS
                </span>
                <span className="text-[9px] font-mono text-slate-500 mt-0.5">MIRROR</span>
              </div>

              {/* Boss B HP */}
              <div className="col-span-5 flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-rose-400 font-bold font-mono text-xs sm:text-sm shrink-0">
                    {bossB.currentHp} / {bossB.maxHp} HP
                  </span>
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="font-bold text-slate-100 text-xs sm:text-sm font-mono truncate">
                      {bossB.name}
                    </span>
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                  </div>
                </div>
                <div className="relative w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-300 bg-rose-500 shadow-sm"
                    style={{ width: `${(bossB.currentHp / bossB.maxHp) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400 text-[10px]">STUN:</span>
                  <span className="text-slate-300 text-[10px] font-bold">{bossB.staggerGauge} / 100</span>
                  <div className="w-20 sm:w-28 bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800/80">
                    <div
                      className="bg-amber-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${bossB.staggerGauge}%` }}
                    />
                  </div>
                </div>
              </div>
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

          {/* Opponent Broadcast Logs */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3 flex flex-col h-[185px]">
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

      {/* Animated Cross-Arena Sabotage Missile / Laser Projectile */}
      {activeMissile && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          <div
            className="absolute transition-all duration-75 flex items-center gap-2"
            style={{
              left:
                activeMissile.from === 'channelA'
                  ? `${20 + activeMissile.progress * 0.6}%`
                  : `${80 - activeMissile.progress * 0.6}%`,
              top: '42%',
              transform: `translate(-50%, -50%) ${
                activeMissile.from === 'channelA' ? 'rotate(12deg)' : 'rotate(-168deg)'
              }`,
            }}
          >
            {/* Trailing smoke / laser plume */}
            <div
              className={`h-4 rounded-full blur-xs ${
                activeMissile.from === 'channelA'
                  ? 'bg-gradient-to-l from-amber-400 via-orange-500 to-transparent w-28'
                  : 'bg-gradient-to-r from-purple-500 via-pink-500 to-transparent w-28'
              }`}
            />
            {/* Warhead */}
            <div className="text-3xl filter drop-shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-pulse">
              🚀
            </div>
            <span className="font-mono text-xs font-black uppercase text-amber-300 bg-slate-950/90 px-2 py-0.5 rounded border border-amber-400/60 shadow-lg">
              {activeMissile.type} SABOTAGE
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
