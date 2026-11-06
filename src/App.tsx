import { useState, useEffect } from 'react';
import type { PlayerLoadout, Arena, SpectatorConstellation } from './types/game';
import { Armory } from './components/Armory';
import { CombatStage } from './components/CombatStage';
import { TwinDuelStage } from './components/TwinDuelStage';
import { solanaService } from './utils/solanaService';

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
    </div>
  );
}

export default App;
