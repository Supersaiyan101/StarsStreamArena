import { useState, useEffect } from 'react';
import type {
  PlayerLoadout,
  Arena,
  SpectatorConstellation,
  AppScreen,
  LiveBroadcastMatch,
} from './types/game';
import { ARENAS } from './data/arenas';
import { MainLobby } from './components/MainLobby';
import { ChallengerSelect } from './components/ChallengerSelect';
import { DispatchArena } from './components/DispatchArena';
import { SpectatorHub } from './components/SpectatorHub';
import { SpectatorTheater } from './components/SpectatorTheater';
import { CombatStage } from './components/CombatStage';
import { TwinDuelStage } from './components/TwinDuelStage';
import { ConstellationModal } from './components/ConstellationModal';
import { StarArchive } from './components/StarArchive';
import { StarStreamCodex } from './components/StarStreamCodex';
import { MOCK_BROADCAST_MATCHES } from './data/mockMatches';
import { solanaService } from './utils/solanaService';
import { audio } from './utils/audioService';
import { Volume2, VolumeX } from 'lucide-react';

export interface ActiveDeploymentConfig {
  loadout: PlayerLoadout;
  arena: Arena;
  circuitTier: 'bronze' | 'silver' | 'gold';
  stakeAmountSol: number;
  mode: 'solo' | 'duel';
}

export interface ActiveDispatchConfig {
  arena: Arena;
  circuitTier: 'bronze' | 'silver' | 'gold';
  stakeAmountSol: number;
  mode: 'solo' | 'duel';
}

export function App() {
  // Screen Router State
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('lobby');

  // Modals
  const [isCodexOpen, setIsCodexOpen] = useState(false);
  const [isConstellationModalOpen, setIsConstellationModalOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  // Active Pre-Combat Configuration (Flipped Order: Step 1 Arena -> Step 2 Challenger)
  const [activeDispatchConfig, setActiveDispatchConfig] = useState<ActiveDispatchConfig>({
    arena: ARENAS[0],
    circuitTier: 'silver',
    stakeAmountSol: 0.01,
    mode: 'duel',
  });
  const [activeDeployment, setActiveDeployment] = useState<ActiveDeploymentConfig | null>(null);

  // Active Spectator Broadcast Match
  const [activeSpectateMatch, setActiveSpectateMatch] = useState<LiveBroadcastMatch>(
    MOCK_BROADCAST_MATCHES[0]
  );

  // Solana Wallet & Constellation State
  const [walletBalanceSol, setWalletBalanceSol] = useState(2.45);
  const [walletAddress, setWalletAddress] = useState('7xKt...89Jq');
  const [constellation, setConstellation] = useState<SpectatorConstellation>({
    walletAddress: '7xKt...89Jq',
    customTitle: "Constellation 'Neon Phantom'",
    avatarColor: 'cyan',
    totalTippedSol: 0.008,
  });

  // Audio mute controller
  const [isMuted, setIsMuted] = useState(audio.isMuted());

  const toggleAudio = () => {
    const newMuted = audio.toggleMute();
    setIsMuted(newMuted);
    if (!newMuted) {
      audio.playCoinJingle();
    }
  };

  // Connect wallet on launch
  useEffect(() => {
    solanaService.connectWallet().then((w) => {
      const shortAddr = w.publicKey.slice(0, 4) + '...' + w.publicKey.slice(-4);
      setWalletAddress(shortAddr);
      setWalletBalanceSol(w.balanceSol);
      setConstellation((prev) => ({
        ...prev,
        walletAddress: shortAddr,
      }));
    });
  }, []);

  const handleAirdrop = async () => {
    audio.playCoinJingle();
    await solanaService.requestAirdrop(walletAddress);
    setWalletBalanceSol((prev) => parseFloat((prev + 1.0).toFixed(4)));
  };

  // Step 1 -> Step 2 transition
  const handleProceedToChallenger = (config: ActiveDispatchConfig) => {
    setActiveDispatchConfig(config);
    setCurrentScreen('challenger_select');
  };

  // Step 2 -> Launch Combat
  const handleDeploy = (config: ActiveDeploymentConfig) => {
    setActiveDeployment(config);
    setWalletBalanceSol((prev) => Math.max(0, parseFloat((prev - config.stakeAmountSol).toFixed(4))));
    setCurrentScreen('combat_player');
  };

  const handleExitCombat = () => {
    setActiveDeployment(null);
    setCurrentScreen('lobby');
  };

  const handleTipSent = (amountSol: number) => {
    setWalletBalanceSol((prev) => Math.max(0, parseFloat((prev - amountSol).toFixed(4))));
    setConstellation((prev) => ({
      ...prev,
      totalTippedSol: parseFloat((prev.totalTippedSol + amountSol).toFixed(4)),
    }));
  };

  // Spectator Quick Hop
  const handleQuickHop = () => {
    const currentIndex = MOCK_BROADCAST_MATCHES.findIndex(
      (m) => m.channelId === activeSpectateMatch.channelId
    );
    const nextIndex = (currentIndex + 1) % MOCK_BROADCAST_MATCHES.length;
    setActiveSpectateMatch(MOCK_BROADCAST_MATCHES[nextIndex]);
    setCurrentScreen('spectator_theater');
  };

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* ============================================================ */}
      {/* SCREEN ROUTER DISPATCH                                       */}
      {/* ============================================================ */}

      {/* SCREEN 0: MAIN LOBBY */}
      {currentScreen === 'lobby' && (
        <MainLobby
          walletAddress={walletAddress}
          walletBalanceSol={walletBalanceSol}
          constellation={constellation}
          onEnterChallenger={() => setCurrentScreen('dispatch_arena')}
          onEnterSpectator={() => setCurrentScreen('spectator_hub')}
          onOpenCodex={() => setIsCodexOpen(true)}
          onOpenConstellationModal={() => setIsConstellationModalOpen(true)}
          onOpenArchive={() => setIsArchiveOpen(true)}
          onAirdrop={handleAirdrop}
        />
      )}

      {/* STEP 1 OF 2: SCENARIO ARENA & STAKES DISPATCH */}
      {currentScreen === 'dispatch_arena' && (
        <DispatchArena
          walletBalanceSol={walletBalanceSol}
          onBackToLobby={() => setCurrentScreen('lobby')}
          onProceedToChallenger={handleProceedToChallenger}
        />
      )}

      {/* STEP 2 OF 2: CHALLENGER ASSEMBLY (ADAPTING TO ARENA) */}
      {currentScreen === 'challenger_select' && (
        <ChallengerSelect
          arena={activeDispatchConfig.arena}
          circuitTier={activeDispatchConfig.circuitTier}
          stakeAmountSol={activeDispatchConfig.stakeAmountSol}
          mode={activeDispatchConfig.mode}
          onBackToDispatch={() => setCurrentScreen('dispatch_arena')}
          onDeploy={(loadout) =>
            handleDeploy({
              loadout,
              arena: activeDispatchConfig.arena,
              circuitTier: activeDispatchConfig.circuitTier,
              stakeAmountSol: activeDispatchConfig.stakeAmountSol,
              mode: activeDispatchConfig.mode,
            })
          }
        />
      )}

      {/* SCREEN 3: COMBAT (DUEL OR SOLO) */}
      {currentScreen === 'combat_player' && activeDeployment && (
        activeDeployment.mode === 'duel' ? (
          <TwinDuelStage
            loadout={activeDeployment.loadout}
            arena={activeDeployment.arena}
            circuitTier={activeDeployment.circuitTier}
            stakeAmountSol={activeDeployment.stakeAmountSol}
            constellation={constellation}
            onExit={handleExitCombat}
            onTipSent={handleTipSent}
          />
        ) : (
          <CombatStage
            loadout={activeDeployment.loadout}
            arena={activeDeployment.arena}
            circuitTier={activeDeployment.circuitTier}
            stakeAmountSol={activeDeployment.stakeAmountSol}
            mode={activeDeployment.mode}
            constellation={constellation}
            onExit={handleExitCombat}
            onTipReceived={handleTipSent}
          />
        )
      )}

      {/* SCREEN 4: SPECTATOR DIRECTORY */}
      {currentScreen === 'spectator_hub' && (
        <SpectatorHub
          onBackToLobby={() => setCurrentScreen('lobby')}
          onSelectMatch={(match) => {
            setActiveSpectateMatch(match);
            setCurrentScreen('spectator_theater');
          }}
          onQuickHop={handleQuickHop}
        />
      )}

      {/* SCREEN 5: SPECTATOR THEATER */}
      {currentScreen === 'spectator_theater' && (
        <SpectatorTheater
          match={activeSpectateMatch}
          constellation={constellation}
          walletBalanceSol={walletBalanceSol}
          onExit={() => setCurrentScreen('spectator_hub')}
          onHopNext={handleQuickHop}
          onTipSent={handleTipSent}
        />
      )}

      {/* ============================================================ */}
      {/* GLOBAL MODALS & AUDIO DOCK                                   */}
      {/* ============================================================ */}

      {/* Star Stream Survival Codex (Field Manual) */}
      <StarStreamCodex
        isOpen={isCodexOpen}
        onClose={() => setIsCodexOpen(false)}
      />

      {/* Constellation Studio Modal */}
      <ConstellationModal
        isOpen={isConstellationModalOpen}
        onClose={() => setIsConstellationModalOpen(false)}
        constellation={constellation}
        onSave={setConstellation}
        onAirdrop={handleAirdrop}
        walletBalanceSol={walletBalanceSol}
      />

      {/* Star Archive Leaderboard Modal */}
      <StarArchive
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
        onTipRunner={async (runnerAddress, amount) => {
          await solanaService.sendTipTransaction(walletAddress, runnerAddress, amount);
        }}
      />

      {/* Floating Audio Controller */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleAudio}
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 text-xs font-mono text-cyan-400 shadow-xl backdrop-blur transition-all cursor-pointer"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-rose-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-400" />
          )}
          <span className="hidden sm:inline">{isMuted ? 'SFX MUTED' : 'SFX ACTIVE'}</span>
        </button>
      </div>
    </div>
  );
}

export default App;
