import { useState } from 'react';
import type { PlayerLoadout, Arena } from './types/game';
import { Armory } from './components/Armory';

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

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col">
      {!activeDeployment ? (
        <Armory
          onDeploy={handleDeploy}
          walletBalanceSol={walletBalanceSol}
          walletAddress={walletAddress}
        />
      ) : (
        <div className="min-h-screen p-6 flex flex-col items-center justify-center text-center">
          <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-8 max-w-lg shadow-2xl backdrop-blur-md">
            <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase bg-cyan-950/80 px-3 py-1 rounded border border-cyan-500/30">
              STAR STREAM CHANNEL #BI-7623
            </span>
            <h2 className="text-2xl font-black text-slate-100 mt-3">
              Deployment Initialized!
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              {activeDeployment.mode === 'duel' ? '1v1 Mirrored Twin Duel' : 'Solo Scenario Trial'} in{' '}
              <span className="text-cyan-400 font-semibold">{activeDeployment.arena.name}</span>
            </p>

            <div className="my-6 p-4 bg-slate-950 rounded-xl border border-slate-800 text-left text-xs font-mono space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Challenger:</span>
                <span className="text-slate-200 font-bold">{activeDeployment.loadout.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Weapon Relic:</span>
                <span className="text-amber-400">{activeDeployment.loadout.weapon.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Circuit Stake:</span>
                <span className="text-emerald-400 font-bold">{activeDeployment.stakeAmountSol} SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Boss:</span>
                <span className="text-rose-400 font-bold">{activeDeployment.arena.boss.name}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveDeployment(null)}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold transition-all cursor-pointer"
            >
              ← Return to Armory Loadout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
