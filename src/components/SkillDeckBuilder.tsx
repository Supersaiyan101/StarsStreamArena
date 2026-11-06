import React, { useState } from 'react';
import { Swords, Zap, Shield, Sparkles, Check, Plus, X } from 'lucide-react';
import type { Skill, SkillCategory } from '../types/game';
import { SKILL_CATALOG } from '../data/skills';

interface Props {
  equippedSkillIds: string[];
  onToggleSkill: (skillId: string) => void;
  selectedArenaTheme: 'metro' | 'flooded';
}

export const SkillDeckBuilder: React.FC<Props> = ({
  equippedSkillIds,
  onToggleSkill,
  selectedArenaTheme,
}) => {
  const [activeTab, setActiveTab] = useState<SkillCategory | 'all'>('all');

  const filteredSkills = SKILL_CATALOG.filter((skill) => {
    if (activeTab === 'all') return true;
    return skill.category === activeTab;
  });

  const equippedSkills = equippedSkillIds
    .map((id) => SKILL_CATALOG.find((s) => s.id === id))
    .filter((s): s is Skill => s !== undefined);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 backdrop-blur-md shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Combat Deck (5 Skills)
          </h3>
          <p className="text-xs text-slate-400">
            {equippedSkillIds.length}/5 Skills Equipped • 3 Drawn Randomly Per Turn
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wide border ${
            equippedSkillIds.length === 5
              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
              : 'bg-amber-950/60 text-amber-400 border-amber-500/40'
          }`}
        >
          {equippedSkillIds.length === 5 ? 'DECK READY' : `${5 - equippedSkillIds.length} SLOTS OPEN`}
        </span>
      </div>

      {/* Equipped 5-Card Tray */}
      <div className="grid grid-cols-5 gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
        {[0, 1, 2, 3, 4].map((index) => {
          const skill = equippedSkills[index];
          if (!skill) {
            return (
              <div
                key={index}
                className="h-24 border border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center text-slate-600 text-xs p-1 text-center"
              >
                <Plus className="w-4 h-4 mb-1 text-slate-700" />
                <span>Slot {index + 1}</span>
              </div>
            );
          }

          const hasSynergy =
            (selectedArenaTheme === 'metro' && skill.category === 'melee') ||
            (selectedArenaTheme === 'flooded' && skill.element === 'lightning');

          return (
            <div
              key={skill.id}
              className={`relative h-24 rounded-lg p-2 flex flex-col justify-between border transition-all text-left group overflow-hidden ${
                skill.isStigma
                  ? 'bg-amber-950/20 border-amber-500/50 hover:border-amber-400'
                  : 'bg-slate-900 border-slate-700 hover:border-cyan-400'
              }`}
            >
              <button
                onClick={() => onToggleSkill(skill.id)}
                className="absolute top-1 right-1 w-5 h-5 bg-slate-800 hover:bg-rose-600 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-colors"
                title="Unequip skill"
              >
                <X className="w-3 h-3" />
              </button>

              <div>
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block truncate pr-5">
                  {skill.category}
                </span>
                <span className="text-xs font-bold text-slate-100 block truncate leading-tight mt-0.5">
                  {skill.name}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono mt-1">
                <span className="text-amber-400">{skill.energyCost}⚡</span>
                <span className="text-rose-400 font-bold">{skill.baseDamage} DMG</span>
              </div>

              {hasSynergy && (
                <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-400 animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2">
        {(
          [
            { id: 'all', label: 'All (16)', icon: Sparkles },
            { id: 'melee', label: 'Melee', icon: Swords },
            { id: 'elemental', label: 'Elemental', icon: Zap },
            { id: 'tactical', label: 'Tactical', icon: Shield },
            { id: 'stigma', label: 'Stigma', icon: Sparkles },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Available Skill Catalog Grid */}
      <div className="grid grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
        {filteredSkills.map((skill) => {
          const isEquipped = equippedSkillIds.includes(skill.id);
          const hasSynergy =
            (selectedArenaTheme === 'metro' && skill.category === 'melee') ||
            (selectedArenaTheme === 'flooded' && skill.element === 'lightning');

          return (
            <div
              key={skill.id}
              onClick={() => onToggleSkill(skill.id)}
              className={`relative rounded-xl p-3 border cursor-pointer transition-all flex flex-col justify-between ${
                isEquipped
                  ? 'bg-cyan-950/30 border-cyan-500/60 shadow-lg shadow-cyan-950/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {/* Top Row: Category & Badges */}
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">
                      {skill.element} • {skill.category}
                    </span>
                    {hasSynergy && (
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">
                        ARENA SYNERGY
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-100 mt-0.5">
                    {skill.name}
                  </h4>
                  {skill.koreanLoreRef && (
                    <span className="text-[10px] text-cyan-400/70 font-mono block truncate">
                      {skill.koreanLoreRef}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                    {skill.energyCost}⚡
                  </span>
                  {isEquipped ? (
                    <div className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center">
                      <Plus className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-300 leading-relaxed mb-2 line-clamp-2">
                {skill.description}
              </p>

              {/* Bottom Metrics & Synergy */}
              <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-[11px] font-mono">
                <span className="text-rose-400 font-bold">
                  {skill.baseDamage > 0 ? `${skill.baseDamage} DMG` : 'TACTICAL'}
                </span>
                <span className="text-amber-400">+{skill.sabotageEnergyGain} Sabotage</span>
                <span className="text-purple-400">+{skill.heatGenerated}% Heat</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

