import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Swords,
  Shield,
  Zap,
  CheckCircle2,
  Sliders,
  User,
} from 'lucide-react';
import type { PlayerAttributes, PlayerLoadout } from '../types/game';
import { AVATAR_ARCHETYPES, type AvatarArchetype } from '../data/archetypes';
import { WEAPON_RELICS, type WeaponRelic } from '../data/weapons';
import { AttributeAllocator } from './AttributeAllocator';
import { SkillDeckBuilder } from './SkillDeckBuilder';

interface Props {
  onBackToLobby: () => void;
  onProceedToDispatch: (loadout: PlayerLoadout) => void;
}

export const ChallengerSelect: React.FC<Props> = ({
  onBackToLobby,
  onProceedToDispatch,
}) => {
  // Selected Archetype
  const [selectedArchetype, setSelectedArchetype] = useState<AvatarArchetype>(AVATAR_ARCHETYPES[0]);
  const [playerName, setPlayerName] = useState('Challenger Kai');

  // Loadout state initialized from chosen Archetype
  const [attributes, setAttributes] = useState<PlayerAttributes>(selectedArchetype.defaultAttributes);
  const [equippedSkills, setEquippedSkills] = useState<string[]>(selectedArchetype.defaultSkillIds);
  const [selectedWeapon, setSelectedWeapon] = useState<WeaponRelic>(
    WEAPON_RELICS.find((w) => w.id === selectedArchetype.defaultWeaponId) || WEAPON_RELICS[0]
  );

  // Advanced Customizer Drawer toggle
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // When switching archetype, auto-load its balanced defaults
  const handleSelectArchetype = (arch: AvatarArchetype) => {
    setSelectedArchetype(arch);
    setAttributes(arch.defaultAttributes);
    setEquippedSkills(arch.defaultSkillIds);
    const weapon = WEAPON_RELICS.find((w) => w.id === arch.defaultWeaponId) || WEAPON_RELICS[0];
    setSelectedWeapon(weapon);
  };

  // Toggle skills in customizer
  const handleToggleSkill = (skillId: string) => {
    if (equippedSkills.includes(skillId)) {
      setEquippedSkills(equippedSkills.filter((id) => id !== skillId));
    } else {
      if (equippedSkills.length >= 5) return;
      setEquippedSkills([...equippedSkills, skillId]);
    }
  };

  // Validation
  const totalPoints = attributes.strength + attributes.agility + attributes.resonance;
  const isReady = totalPoints === 30 && equippedSkills.length === 5;

  const handleProceed = () => {
    if (!isReady) return;

    const loadout: PlayerLoadout = {
      name: playerName.trim() || selectedArchetype.name,
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

    onProceedToDispatch(loadout);
  };

  return (
    <div className="min-h-screen bg-[#060814] text-slate-100 flex flex-col p-4 md:p-6 lg:p-8">
      {/* ============================================================ */}
      {/* HEADER & STEP BREADCRUMB                                     */}
      {/* ============================================================ */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 md:p-5 mb-6 backdrop-blur-md shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLobby}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-mono"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Lobby</span>
          </button>
          <div>
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
              STEP 1 OF 2
            </span>
            <h1 className="text-xl md:text-2xl font-black text-slate-100 mt-0.5">
              Choose Your Challenger
            </h1>
          </div>
        </div>

        {/* Codename Input & Next Button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter Codename..."
              className="bg-transparent text-xs font-mono text-slate-200 focus:outline-none w-36"
            />
          </div>

          <button
            disabled={!isReady}
            onClick={handleProceed}
            className="py-2.5 px-5 rounded-xl font-bold font-mono text-xs tracking-wide bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 shadow-lg shadow-cyan-500/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>NEXT: TARGET ARENA</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3 HERO SHOWCASE CARDS (HORIZONTAL CAROUSEL / GRID)           */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {AVATAR_ARCHETYPES.map((arch) => {
          const isSelected = selectedArchetype.id === arch.id;
          const relic = WEAPON_RELICS.find((w) => w.id === arch.defaultWeaponId);

          return (
            <div
              key={arch.id}
              onClick={() => handleSelectArchetype(arch)}
              className={`rounded-2xl p-6 border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-cyan-950/40 border-cyan-400 shadow-2xl shadow-cyan-500/20 scale-[1.02]'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 text-cyan-400 flex items-center gap-1 font-mono text-xs font-bold bg-cyan-950/90 px-2.5 py-1 rounded-full border border-cyan-500/40">
                  <CheckCircle2 className="w-4 h-4" />
                  SELECTED
                </div>
              )}

              <div>
                {/* Title & Name */}
                <div className="mb-4">
                  <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                    {arch.title}
                  </span>
                  <h3 className="text-2xl font-black text-slate-100 mt-1">{arch.name}</h3>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed min-h-[48px]">
                  {arch.description}
                </p>

                {/* 30-Point Stat Allocation Bars */}
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 my-4 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-rose-400">
                      <Swords className="w-3.5 h-3.5" /> STR (Attack)
                    </span>
                    <span className="font-bold">{arch.defaultAttributes.strength}</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5">
                    <div
                      className="bg-rose-500 h-1.5 rounded-full"
                      style={{ width: `${(arch.defaultAttributes.strength / 20) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-slate-300 pt-1">
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <Zap className="w-3.5 h-3.5" /> AGI (Speed/Crit)
                    </span>
                    <span className="font-bold">{arch.defaultAttributes.agility}</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5">
                    <div
                      className="bg-cyan-400 h-1.5 rounded-full"
                      style={{ width: `${(arch.defaultAttributes.agility / 20) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-slate-300 pt-1">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <Shield className="w-3.5 h-3.5" /> RES (HP/Shield)
                    </span>
                    <span className="font-bold">{arch.defaultAttributes.resonance}</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-1.5">
                    <div
                      className="bg-amber-400 h-1.5 rounded-full"
                      style={{ width: `${(arch.defaultAttributes.resonance / 20) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Signature Relic & Arena Bias */}
                <div className="space-y-1.5 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>Signature Relic:</span>
                    <span className="text-amber-300 font-bold">{relic?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Arena Synergy:</span>
                    <span className="text-emerald-400">
                      {arch.preferredArena === 'metro' ? '🚇 Metro Bias' : '🌊 Ocean Bias'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ready to Deploy Button */}
              <button
                onClick={() => handleSelectArchetype(arch)}
                className={`w-full mt-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {isSelected ? '✓ ACTIVE PRESET' : 'SELECT ARCHETYPE'}
              </button>
            </div>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* OPTIONAL: FINE-TUNE WORKBENCH (COLLAPSIBLE DRAWER)           */}
      {/* ============================================================ */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-slate-200 font-mono">
              ADVANCED LOADOUT WORKBENCH
            </h4>
            <span className="text-xs text-slate-500">
              (Optional: Fine-tune 30 points or swap skills)
            </span>
          </div>
          <button
            onClick={() => setIsCustomizerOpen(!isCustomizerOpen)}
            className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors cursor-pointer"
          >
            {isCustomizerOpen ? 'Hide Workbench ▲' : 'Open Workbench ▼'}
          </button>
        </div>

        {/* Workbench Content */}
        {isCustomizerOpen && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 pt-4 border-t border-slate-800 animate-in fade-in duration-200">
            {/* Attribute Allocator (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <AttributeAllocator
                attributes={attributes}
                onChange={setAttributes}
                maxBudget={30}
              />

              {/* Weapon Relic Picker */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-2">
                  Select Star Relic:
                </span>
                <div className="space-y-1.5">
                  {WEAPON_RELICS.map((weapon) => (
                    <button
                      key={weapon.id}
                      onClick={() => setSelectedWeapon(weapon)}
                      className={`w-full p-2 rounded-lg text-left text-xs font-mono flex items-center justify-between border transition-all ${
                        selectedWeapon.id === weapon.id
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-200'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="font-bold">{weapon.name}</span>
                      <span className="text-[10px] text-amber-400/80">{weapon.tier}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Skill Deck Builder (7 cols) */}
            <div className="lg:col-span-7">
              <SkillDeckBuilder
                equippedSkillIds={equippedSkills}
                onToggleSkill={handleToggleSkill}
                selectedArenaTheme={selectedArchetype.preferredArena}
              />
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* BOTTOM ACTION BAR                                            */}
      {/* ============================================================ */}
      <div className="mt-auto pt-4 border-t border-slate-800 flex items-center justify-between">
        <button
          onClick={onBackToLobby}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Lobby
        </button>

        <button
          disabled={!isReady}
          onClick={handleProceed}
          className="py-3 px-8 rounded-xl font-bold font-mono text-sm tracking-wide bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 shadow-xl shadow-cyan-500/30 flex items-center gap-2 transition-all cursor-pointer"
        >
          <span>PROCEED TO ARENA & STAKES</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
