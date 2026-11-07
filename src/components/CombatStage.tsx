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
import { audio } from '../utils/audioService';
import { CombatCanvas } from './CombatCanvas';
import { CombatHUD } from './CombatHUD';
import { StreamChat } from './StreamChat';
import { saveArchiveEntry } from './StarArchive';
import { solanaService, getSolanaExplorerUrl } from '../utils/solanaService';
import { Trophy, Skull, ArrowLeft, Award, ExternalLink, BookmarkCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  loadout: PlayerLoadout;
  arena: Arena;
  circuitTier: 'bronze' | 'silver' | 'gold';
  stakeAmountSol: number;
  mode: 'solo' | 'duel';
  constellation: SpectatorConstellation;
  onExit: () => void;
  onTipReceived: (amountSol: number) => void;
}

export const CombatStage: React.FC<Props> = ({
  loadout,
  arena: initialArena,
  circuitTier,
  stakeAmountSol,
  mode,
  constellation,
  onExit,
  onTipReceived,
}) => {
  const [arena, setArena] = useState<Arena>({ ...initialArena });
  const [boss, setBoss] = useState<Boss>({ ...initialArena.boss });
  const [combatState, setCombatState] = useState<ActiveCombatState>(
    initializeCombatState(loadout)
  );

  const [playerActionState, setPlayerActionState] = useState<
    'idle' | 'attacking' | 'jumping' | 'crouching' | 'parrying' | 'hurt'
  >('idle');
  const [screenShake, setScreenShake] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState<
    { id: string; text: string; x: number; y: number; color: string; opacity: number }[]
  >([]);
  const [isRecorded, setIsRecorded] = useState(false);
  const [recordedTx, setRecordedTx] = useState<string | null>(null);

  const getStyleRank = (score: number) => {
    if (score >= 12000) return { rank: 'S+', title: 'APEX INCARNATION', badgeClass: 'bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 shadow-amber-400/50' };
    if (score >= 8000) return { rank: 'A', title: 'DIVINE FAVOR', badgeClass: 'bg-gradient-to-r from-cyan-400 to-blue-400 text-slate-950 shadow-cyan-400/50' };
    if (score >= 4000) return { rank: 'B', title: 'VETERAN FIGHTER', badgeClass: 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-emerald-400/50' };
    return { rank: 'C', title: 'NOVICE SURVIVOR', badgeClass: 'bg-slate-700 text-slate-200 shadow-slate-700/50' };
  };

  const handleRecordToArchive = () => {
    if (isRecorded) return;
    const tx = solanaService.generateTxSignature();
    saveArchiveEntry({
      id: `run_${Date.now()}`,
      challengerName: loadout.name,
      arenaName: arena.name,
      theme: arena.theme,
      clearTimeSeconds: Math.max(24, (combatState.turnCount || 1) * 7),
      styleScore: combatState.styleRating,
      tipsEarnedSol: parseFloat((stakeAmountSol * 2).toFixed(4)),
      walletAddress: constellation.walletAddress,
      txHash: tx,
    });
    setIsRecorded(true);
    setRecordedTx(tx);
    audio.playCoinJingle();
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.6 } });
  };

  // Trigger floating damage text
  const addFloatingText = (text: string, color: string = '#38bdf8', isCrit = false) => {
    const id = Math.random().toString();
    const newText = {
      id,
      text,
      x: 550 + (Math.random() - 0.5) * 60,
      y: 200 + (Math.random() - 0.5) * 40,
      color: isCrit ? '#f43f5e' : color,
      opacity: 1.0,
    };
    setFloatingTexts((prev) => [...prev, newText]);

    // Animate fade
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((t) => t.id !== id));
    }, 1200);
  };

  // Check if Dokkaebi Flash Bounty was completed
  const prevBountyCompleted = React.useRef(false);
  React.useEffect(() => {
    if (combatState.activeBounty?.isCompleted && !prevBountyCompleted.current) {
      prevBountyCompleted.current = true;
      audio.playCoinJingle();
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
      const reward = combatState.activeBounty.rewardSol;
      addFloatingText(`+${reward} SOL BOUNTY!`, '#fbbf24', true);
      onTipReceived(reward);
    } else if (!combatState.activeBounty?.isCompleted) {
      prevBountyCompleted.current = false;
    }
  }, [combatState.activeBounty?.isCompleted, combatState.activeBounty?.id, onTipReceived]);

  // Play Skill Handler (Pokémon-Style Turn Initiative & Elemental Calculation)
  const handlePlaySkill = (skillId: string) => {
    setPlayerActionState('attacking');
    const skill = combatState.activeHand.find((s) => s.id === skillId);
    if (skill) {
      if (skill.isStigma) {
        audio.playStigmaCast();
      } else if (skill.category === 'tactical' || skill.moveRole === 'priority') {
        if (skill.id === 'kinetic_deflector') {
          audio.playParryClang();
        } else {
          audio.playDodgeWoosh();
        }
      } else {
        audio.playBladeSlash();
      }
    }

    const turnResult = executePokemonStyleTurn(skillId, combatState, boss, arena, loadout);

    if (turnResult.isSuperEffective) {
      audio.playParryClang();
      addFloatingText('💥 SUPER EFFECTIVE! (2.0x)', '#fbbf24', true);
    } else if (turnResult.isResisted) {
      addFloatingText('🛡️ RESISTED (0.5x)', '#94a3b8');
    }

    if (turnResult.damageDealtByPlayer > 0) {
      addFloatingText(`-${turnResult.damageDealtByPlayer} DMG`, '#f43f5e', turnResult.damageDealtByPlayer > 50);
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 250);
    }

    if (turnResult.damageDealtByBoss > 0) {
      setTimeout(() => {
        addFloatingText(`-${turnResult.damageDealtByBoss} HP`, '#ef4444', true);
        setPlayerActionState('hurt');
        setTimeout(() => setPlayerActionState('idle'), 300);
      }, 400);
    }

    setCombatState(turnResult.combatState);
    setBoss(turnResult.bossState);
    setArena(turnResult.arena);

    setTimeout(() => setPlayerActionState('idle'), 350);

    // Check Victory
    if (turnResult.bossState.currentHp <= 0) {
      audio.playVictoryFanfare();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  };

  // Counter Action (Jump, Crouch, Parry)
  const handleCounter = (action: CounterAction) => {
    setPlayerActionState(action === 'jump' ? 'jumping' : action === 'crouch' ? 'crouching' : 'parrying');
    const result = executeCounterAction(action, combatState, boss);

    setCombatState(result.combatState);
    setBoss(result.bossState);

    if (result.success) {
      if (action === 'parry') {
        audio.playParryClang();
        addFloatingText('🛡️ PERFECT PARRY!', '#10b981', true);
      } else if (action === 'jump') {
        audio.playDodgeWoosh();
        addFloatingText('⬆️ CLEAN LEAP!', '#38bdf8');
      } else {
        audio.playDodgeWoosh();
        addFloatingText('⬇️ SLIDE EVASION!', '#38bdf8');
      }
    } else {
      audio.playCosmicBacklash();
      addFloatingText('❌ COUNTER FAILED!', '#ef4444');
      setPlayerActionState('hurt');
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 300);
    }

    setTimeout(() => setPlayerActionState('idle'), 450);
  };

  // End Turn Cycle
  const handleEndTurn = () => {
    const result = resolveTurnCycle(combatState, boss, arena);
    if (result.bossState.activeTelegraph) {
      audio.playAlarmSiren();
    }
    if (result.combatState.probabilityHeat >= 100) {
      audio.playCosmicBacklash();
    }
    setCombatState(result.combatState);
    setBoss(result.bossState);
    setArena(result.arena);
  };

  // Trigger Prop
  const handleTriggerProp = (propId: string) => {
    const result = triggerInteractiveProp(propId, combatState, boss, arena);
    if (result.success) {
      audio.playExplosionThud();
    }
    setCombatState(result.combatState);
    setBoss(result.bossState);
    setArena(result.arena);
    addFloatingText(result.message, '#00d2ff');
  };

  const isVictory = boss.currentHp <= 0;
  const isDefeat = combatState.playerHp <= 0;

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col p-4 md:p-6 lg:p-8">
      {/* Top Combat Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            Exit Arena
          </button>
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
              {mode === 'duel' ? '⚔️ 1v1 Mirrored Duel' : '📜 Solo Scenario Trial'} • Circuit{' '}
              {circuitTier.toUpperCase()} ({stakeAmountSol} SOL)
            </span>
            <h2 className="text-lg font-black text-slate-100">{arena.name}</h2>
          </div>
        </div>

        {/* Style & Combo Indicator */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-slate-500">COMBO: </span>
            <span className="text-cyan-400 font-bold text-sm">{combatState.comboCount}x</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <span className="text-slate-500">STYLE SCORE: </span>
            <span className="text-amber-400 font-bold text-sm">
              {combatState.styleRating.toLocaleString()} PTS
            </span>
          </div>
        </div>
      </div>

      {/* Main Battle Arena Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start flex-1">
        {/* Left 8 Cols: Canvas & Integrated HUD Dock */}
        <div className="lg:col-span-8 flex flex-col gap-3">
          <CombatHUD
            boss={boss}
            combatState={combatState}
            arena={arena}
            loadout={loadout}
            onPlaySkill={handlePlaySkill}
            onCounterAction={handleCounter}
            onEndTurn={handleEndTurn}
            onTriggerProp={handleTriggerProp}
          >
            <CombatCanvas
              arena={arena}
              boss={boss}
              combatState={combatState}
              loadout={loadout}
              playerActionState={playerActionState}
              screenShake={screenShake}
              floatingTexts={floatingTexts}
              onTriggerProp={handleTriggerProp}
            />
          </CombatHUD>
        </div>

        {/* Right 4 Cols: Live Star Stream Feed & Spectator Tipping */}
        <div className="lg:col-span-4 flex flex-col gap-3 h-full">
          <StreamChat
            constellation={constellation}
            targetPlayerName={loadout.name}
            onSendTip={async (amountSol, msg) => {
              onTipReceived(amountSol);
              addFloatingText(`+${amountSol} SOL TIP!`, '#10b981');
              setCombatState((prev) => ({
                ...prev,
                combatLogs: [
                  ...prev.combatLogs,
                  `[LIVE SPONSORSHIP: ${constellation.customTitle} tipped +${amountSol} SOL: "${msg || 'Cheering!'}"!]`,
                ],
              }));
            }}
          />
        </div>
      </div>

      {/* Victory / Defeat Modal Overlays */}
      {(isVictory || isDefeat) && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center flex flex-col items-center">
            {isVictory ? (
              <>
                <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 mb-3 shadow-lg shadow-amber-500/30">
                  <Trophy className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-100 tracking-tight">
                  SCENARIO CLEARED!
                </h2>
                <p className="text-sm text-emerald-400 font-mono mt-0.5 font-bold">
                  Bounty Claimed: {(stakeAmountSol * 2).toFixed(4)} SOL
                </p>

                {/* Esports Style Rank Badge */}
                {(() => {
                  const styleRank = getStyleRank(combatState.styleRating);
                  return (
                    <div className="my-3 px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between w-full">
                      <span className="text-xs font-mono text-slate-400 font-bold uppercase">
                        PERFORMANCE RANK:
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black shadow-lg ${styleRank.badgeClass}`}>
                          {styleRank.rank}
                        </span>
                        <span className="text-[11px] font-mono text-slate-300 font-bold">
                          {styleRank.title}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Run Telemetry Summary */}
                <div className="mb-4 p-3.5 bg-slate-950 rounded-xl border border-slate-800 w-full text-left text-xs font-mono space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Challenger:</span>
                    <span className="text-slate-200">{loadout.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Arena:</span>
                    <span className="text-slate-200">{arena.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Final Style Score:</span>
                    <span className="text-amber-400 font-bold">
                      {combatState.styleRating.toLocaleString()} PTS
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Max Combo:</span>
                    <span className="text-cyan-400">{combatState.comboCount} Hits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Combat Duration:</span>
                    <span className="text-slate-300">{combatState.turnCount || 1} Turns</span>
                  </div>
                </div>

                {/* Record Run to Star Archive Leaderboard */}
                <div className="w-full mb-3">
                  {isRecorded ? (
                    <div className="w-full py-2.5 px-3 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 font-mono text-xs flex flex-col gap-1 items-center">
                      <div className="flex items-center gap-1.5 font-bold">
                        <BookmarkCheck className="w-4 h-4 text-emerald-400" />
                        <span>IMMORTALIZED IN STAR ARCHIVE!</span>
                      </div>
                      {recordedTx && (
                        <a
                          href={getSolanaExplorerUrl(recordedTx)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-cyan-400 underline hover:text-cyan-300 flex items-center gap-1"
                        >
                          View Solana Explorer Tx <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={handleRecordToArchive}
                      className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-amber-500/10"
                    >
                      <Award className="w-4 h-4 text-amber-400" />
                      RECORD RUN TO STAR ARCHIVE
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-500/30">
                  <Skull className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-100 tracking-tight">
                  CHALLENGER ELIMINATED
                </h2>
                <p className="text-sm text-rose-400 font-mono mt-1 font-bold">
                  The Star Stream has claimed your stake.
                </p>
              </>
            )}

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

