import { useState } from 'react';
import type { PlayerLoadout, Arena } from './types/game';
import { Armory } from './components/Armory';
import { CombatStage } from './components/CombatStage';
import { TwinDuelStage } from './components/TwinDuelStage';

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
  const [walletAddress] = useState('7xKt...89Jq');

  const handleDeploy = (config: ActiveDeploymentConfig) => {
    setActiveDeployment(config);
    setWalletBalanceSol((prev) => Math.max(0, parseFloat((prev - config.stakeAmountSol).toFixed(4))));
  };

  const handleExitCombat = () => {
    setActiveDeployment(null);
  };

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col">
      {!activeDeployment ? (
        <Armory
          onDeploy={handleDeploy}
          walletBalanceSol={walletBalanceSol}
          walletAddress={walletAddress}
        />
      ) : activeDeployment.mode === 'duel' ? (
        <TwinDuelStage
          loadout={activeDeployment.loadout}
          arena={activeDeployment.arena}
          circuitTier={activeDeployment.circuitTier}
          stakeAmountSol={activeDeployment.stakeAmountSol}
          onExit={handleExitCombat}
        />
      ) : (
        <CombatStage
          loadout={activeDeployment.loadout}
          arena={activeDeployment.arena}
          circuitTier={activeDeployment.circuitTier}
          stakeAmountSol={activeDeployment.stakeAmountSol}
          mode={activeDeployment.mode}
          onExit={handleExitCombat}
        />
      )}
    </div>
  );
}

export default App;
