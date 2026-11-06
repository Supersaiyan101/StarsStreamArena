import { useState, useEffect } from 'react';
import type { PlayerLoadout, Arena, SpectatorConstellation } from './types/game';
import { Armory } from './components/Armory';
import { CombatStage } from './components/CombatStage';
import { TwinDuelStage } from './components/TwinDuelStage';
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

export function App() {
  const [activeDeployment, setActiveDeployment] = useState<ActiveDeploymentConfig | null>(null);
  const [walletBalanceSol, setWalletBalanceSol] = useState(2.45);
  const [walletAddress, setWalletAddress] = useState('7xKt...89Jq');

  // Custom Constellation Spectator Profile
  const [constellation, setConstellation] = useState<SpectatorConstellation>({
    walletAddress: '7xKt...89Jq',
    customTitle: "Constellation 'Neon Phantom'",
    avatarColor: 'cyan',
    totalTippedSol: 0.008,
  });

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
      setWalletAddress(w.publicKey.slice(0, 4) + '...' + w.publicKey.slice(-4));
      setWalletBalanceSol(w.balanceSol);
      setConstellation((prev) => ({
        ...prev,
        walletAddress: w.publicKey.slice(0, 4) + '...' + w.publicKey.slice(-4),
      }));
    });
  }, []);

  const handleAirdrop = async () => {
    await solanaService.requestAirdrop(walletAddress);
    setWalletBalanceSol((prev) => parseFloat((prev + 1.0).toFixed(4)));
  };

  const handleDeploy = (config: ActiveDeploymentConfig) => {
    setActiveDeployment(config);
    setWalletBalanceSol((prev) => Math.max(0, parseFloat((prev - config.stakeAmountSol).toFixed(4))));
  };

  const handleExitCombat = () => {
    setActiveDeployment(null);
  };

  const handleTipSent = (amountSol: number) => {
    setWalletBalanceSol((prev) => Math.max(0, parseFloat((prev - amountSol).toFixed(4))));
    setConstellation((prev) => ({
      ...prev,
      totalTippedSol: parseFloat((prev.totalTippedSol + amountSol).toFixed(4)),
    }));
  };

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col">
      {!activeDeployment ? (
        <Armory
          onDeploy={handleDeploy}
          walletBalanceSol={walletBalanceSol}
          walletAddress={walletAddress}
          constellation={constellation}
          onUpdateConstellation={setConstellation}
          onAirdrop={handleAirdrop}
        />
      ) : activeDeployment.mode === 'duel' ? (
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
      )}

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
