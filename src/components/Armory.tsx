import React, { useState } from 'react';
import {
  Swords,
  Shield,
  Zap,
  Globe2,
  Sparkles,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Play,
  Trophy,
  User,
} from 'lucide-react';
import type { PlayerAttributes, PlayerLoadout, Arena, SpectatorConstellation } from '../types/game';
import { AVATAR_ARCHETYPES, type AvatarArchetype } from '../data/archetypes';
import { WEAPON_RELICS, type WeaponRelic } from '../data/weapons';
import { ARENAS } from '../data/arenas';
import { AttributeAllocator } from './AttributeAllocator';
import { SkillDeckBuilder } from './SkillDeckBuilder';
import { ConstellationModal } from './ConstellationModal';
import { StarArchive } from './StarArchive';
import { solanaService } from '../utils/solanaService';

interface Props {
  onDeploy: (config: {
    loadout: PlayerLoadout;
    arena: Arena;
    circuitTier: 'bronze' | 'silver' | 'gold';
    stakeAmountSol: number;
    mode: 'solo' | 'duel';
  }) => void;
  walletBalanceSol: number;
  walletAddress: string;
  constellation: SpectatorConstellation;
  onUpdateConstellation: (c: SpectatorConstellation) => void;
  onAirdrop: () => Promise<void>;
}

export const Armory: React.FC<Props> = ({
  onDeploy,
  walletBalanceSol,
  walletAddress,
  constellation,
  onUpdateConstellation,
  onAirdrop,
}) => {
  const [isConstellationModalOpen, setIsConstellationModalOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  // Mode selection
  const [mode, setMode] = useState<'solo' | 'duel'>('duel');

  // Circuit Tier
  const [circuitTier, setCircuitTier] = useState<'bronze' | 'silver' | 'gold'>('silver');

  // Character selection
  const [selectedArchetype, setSelectedArchetype] = useState<AvatarArchetype>(AVATAR_ARCHETYPES[0]);
  const [playerName, setPlayerName] = useState('Challenger Kai');

  // 30-Point Attributes
  const [attributes, setAttributes] = useState<PlayerAttributes>(selectedArchetype.defaultAttributes);

  // Equipped 5 Skills
  const [equippedSkills, setEquippedSkills] = useState<string[]>([
    'plasma_cleave',
    'kinetic_breaker',
    'volt_arc',
    'phase_shift',
    'heavens_retribution',
  ]);

  // Selected Weapon Relic
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponRelic>(WEAPON_RELICS[0]);

  // Selected Arena
  const [selectedArena, setSelectedArena] = useState<Arena>(ARENAS[0]);

  // Handle archetype change
  const handleSelectArchetype = (arch: AvatarArchetype) => {
    setSelectedArchetype(arch);
    setAttributes(arch.defaultAttributes);
  };

  // Handle skill toggle
  const handleToggleSkill = (skillId: string) => {
    if (equippedSkills.includes(skillId)) {
      setEquippedSkills(equippedSkills.filter((id) => id !== skillId));
    } else {
      if (equippedSkills.length >= 5) return;
      setEquippedSkills([...equippedSkills, skillId]);
    }
  };

  // Stake amount based on tier
  const tierStakes = {
    bronze: 0.005,
    silver: 0.01,
    gold: 0.025,
  };
  const currentStake = tierStakes[circuitTier];

  // Validation
  const totalPoints = attributes.strength + attributes.agility + attributes.resonance;
  const isAttributesValid = totalPoints === 30;
  const isSkillsValid = equippedSkills.length === 5;
  const isReady = isAttributesValid && isSkillsValid;

  const handleDeploy = () => {
    if (!isReady) return;

    const loadout: PlayerLoadout = {
      name: playerName,
      avatarArchetype: selectedArchetype.id,
      attributes,
      equippedSkills,
      weapon: {
        name: selectedWeapon.name,
        koreanLoreRef: selectedWeapon.koreanLoreRef,
        description: selectedWeapon.description,
        bonusEffect: selectedWeapon.bonusEffect,
      },
      sponsorContract: 'unsponsored',
    };

    onDeploy({
      loadout,
      arena: selectedArena,
      circuitTier,
      stakeAmountSol: currentStake,
      mode,
    });
  };

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col p-4 md:p-6 lg:p-8">
      {/* Top Banner: The Star Stream Channel Header */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-4 md:p-5 mb-6 backdrop-blur-md shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/20">
            <Globe2 className="w-5 h-5 animate-spin" style={{ animationDuration: '18s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-widest uppercase bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                STAR STREAM CHANNEL #BI-7623
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                BROADCAST ONLINE
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2 mt-0.5">
              Dokkaebi Combat Armory
            </h1>
          </div>
        </div>

        {/* Mode Selector & Wallet Badge */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Tabs */}
          <div className="bg-slate-950 border border-slate-800 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setMode('duel')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === 'duel'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Swords className="w-3.5 h-3.5" />
              1v1 Mirrored Duel
            </button>
            <button
              onClick={() => setMode('solo')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === 'solo'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Solo Scenario Run
            </button>
          </div>

          {/* Circuit Tier Caps */}
          <div className="bg-slate-950 border border-slate-800 p-1 rounded-xl flex items-center gap-1">
            {(
              [
                { tier: 'bronze', label: 'Bronze', sol: '0.005 ◎' },
                { tier: 'silver', label: 'Silver', sol: '0.010 ◎' },
                { tier: 'gold', label: 'Gold', sol: '0.025 ◎' },
              ] as const
            ).map((t) => (
              <button
                key={t.tier}
                onClick={() => setCircuitTier(t.tier)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                  circuitTier === t.tier
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t.label} ({t.sol})
              </button>
            ))}
          </div>

          {/* Constellation Studio & Hall of Fame Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsConstellationModalOpen(true)}
              className="bg-slate-950/90 border border-slate-800 hover:border-cyan-400 rounded-xl px-3 py-1.5 flex items-center gap-2 font-mono text-xs text-cyan-300 transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>{constellation.customTitle}</span>
            </button>
            <button
              onClick={() => setIsArchiveOpen(true)}
              className="bg-slate-950/90 border border-slate-800 hover:border-amber-400 rounded-xl px-3 py-1.5 flex items-center gap-1.5 font-mono text-xs text-amber-300 transition-all cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Star Archive</span>
            </button>
          </div>

          {/* Connected Solana Wallet Badge */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2 font-mono text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-slate-400">{walletAddress}</span>
            <span className="text-emerald-400 font-bold font-mono">{walletBalanceSol.toFixed(4)} SOL</span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        {/* Column 1: Avatar Archetype & 30-Point Attribute Allocator (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Archetype Selector Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-md shadow-xl">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Challenger Archetype
            </h3>

            {/* Challenger Name input */}
            <div className="mb-3.5">
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                CODENAME IN STAR STREAM
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {AVATAR_ARCHETYPES.map((arch) => {
                const isSelected = selectedArchetype.id === arch.id;
                return (
                  <button
                    key={arch.id}
                    onClick={() => handleSelectArchetype(arch)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-400 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 block truncate">
                        {arch.title}
                      </span>
                      <h4 className="text-xs font-bold text-slate-100 mt-0.5">{arch.name}</h4>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-2 font-mono">
                      {arch.preferredArena === 'metro' ? '🚇 Metro Bias' : '🌊 Ocean Bias'}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              {selectedArchetype.description}
            </p>
          </div>

          {/* 30-Point Attribute Allocator */}
          <AttributeAllocator attributes={attributes} onChange={setAttributes} maxBudget={30} />
        </div>

        {/* Column 2: 5-Skill Combat Deck Builder (5 cols) */}
        <div className="lg:col-span-5">
          <SkillDeckBuilder
            equippedSkillIds={equippedSkills}
            onToggleSkill={handleToggleSkill}
            selectedArenaTheme={selectedArena.theme}
          />
        </div>

        {/* Column 3: Weapon Relic, Arena Target & Launch Deployment (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          {/* Star Relic Weapon */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-md shadow-xl">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-2 mb-3">
              <Flame className="w-4 h-4 text-cyan-400" />
              Equipped Star Relic
            </h3>
            <div className="space-y-2">
              {WEAPON_RELICS.map((weapon) => {
                const isSelected = selectedWeapon.id === weapon.id;
                return (
                  <div
                    key={weapon.id}
                    onClick={() => setSelectedWeapon(weapon)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-100">{weapon.name}</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {weapon.tier}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                      {weapon.koreanLoreRef}
                    </span>
                    <p className="text-[11px] text-slate-300 mt-1.5 leading-snug">
                      {weapon.bonusEffect}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Arena Destination Selector */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-md shadow-xl">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-cyan-400" />
              Target Scenario Arena
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {ARENAS.map((arena) => {
                const isSelected = selectedArena.id === arena.id;
                return (
                  <div
                    key={arena.id}
                    onClick={() => setSelectedArena(arena)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-950/60'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                        {arena.theme === 'metro' ? '🚇' : '🌊'} {arena.name}
                      </h4>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-emerald-400 font-mono mt-1 font-semibold">
                      {arena.environmentalModifier.name}: {arena.environmentalModifier.description}
                    </p>
                    <div className="mt-2 text-[10px] font-mono text-slate-400 border-t border-slate-800/80 pt-1.5 flex items-center justify-between">
                      <span>Boss: {arena.boss.name}</span>
                      <span className="text-amber-400">{arena.boss.maxHp} HP</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Launch Deployment Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/50 border border-cyan-500/40 rounded-xl p-5 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-slate-400">CIRCUIT STAKE</span>
              <span className="text-emerald-400 font-bold font-mono">{currentStake} SOL</span>
            </div>
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-slate-400">POTENTIAL BOUNTY</span>
              <span className="text-amber-400 font-bold font-mono">
                {mode === 'duel' ? `${currentStake * 2} SOL` : `${currentStake * 2.5} SOL`}
              </span>
            </div>

            {!isReady && (
              <div className="flex items-center gap-2 text-rose-400 text-xs bg-rose-500/10 border border-rose-500/30 p-2.5 rounded-lg">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  {!isAttributesValid
                    ? 'Allocate all 30 attribute points.'
                    : 'Equip exactly 5 skills to proceed.'}
                </span>
              </div>
            )}

            <button
              disabled={!isReady}
              onClick={handleDeploy}
              className="w-full py-3.5 rounded-xl font-bold font-mono text-sm tracking-wide bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 shadow-lg shadow-cyan-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              DEPLOY TO ARENA ({currentStake} SOL)
            </button>
          </div>
        </div>
      </div>
      {/* Constellation Studio Modal */}
      <ConstellationModal
        isOpen={isConstellationModalOpen}
        onClose={() => setIsConstellationModalOpen(false)}
        constellation={constellation}
        onSave={onUpdateConstellation}
        onAirdrop={onAirdrop}
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
    </div>
  );
};
