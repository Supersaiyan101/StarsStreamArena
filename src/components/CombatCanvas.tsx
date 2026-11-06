import React, { useEffect, useRef } from 'react';
import type { Arena, Boss, ActiveCombatState, PlayerLoadout } from '../types/game';

interface Props {
  arena: Arena;
  boss: Boss;
  combatState: ActiveCombatState;
  loadout: PlayerLoadout;
  playerActionState: 'idle' | 'attacking' | 'jumping' | 'crouching' | 'parrying' | 'hurt';
  screenShake: boolean;
  floatingTexts: { id: string; text: string; x: number; y: number; color: string; opacity: number }[];
  onTriggerProp: (propId: string) => void;
}

export const CombatCanvas: React.FC<Props> = ({
  arena,
  boss,
  combatState,
  loadout,
  playerActionState,
  screenShake,
  floatingTexts,
  onTriggerProp,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      timeRef.current += 0.03;
      const t = timeRef.current;
      const width = canvas.width;
      const height = canvas.height;

      ctx.save();

      // Screen Shake offset
      if (screenShake) {
        const shakeX = (Math.random() - 0.5) * 8;
        const shakeY = (Math.random() - 0.5) * 8;
        ctx.translate(shakeX, shakeY);
      }

      ctx.clearRect(0, 0, width, height);

      // ==========================================
      // 1. BACKGROUND ENVIRONMENT
      // ==========================================
      if (arena.theme === 'metro') {
        // Dark Subterranean Metro Station
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#090a12');
        grad.addColorStop(0.65, '#121420');
        grad.addColorStop(1, '#08080c');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Ceiling Steel Girders
        ctx.strokeStyle = '#1e2238';
        ctx.lineWidth = 3;
        for (let i = 0; i < width; i += 70) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i + 25, 90);
          ctx.stroke();
        }

        // Concrete Platform Floor
        const groundY = height - 80;
        ctx.fillStyle = '#181a26';
        ctx.fillRect(0, groundY, width, 80);

        // Third Rail (Center Electrified Track)
        ctx.fillStyle = '#2a2d3d';
        ctx.fillRect(0, groundY + 30, width, 18);
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.setLineDash([15, 10]);
        ctx.beginPath();
        ctx.moveTo(0, groundY + 39);
        ctx.lineTo(width, groundY + 39);
        ctx.stroke();
        ctx.setLineDash([]);

        // Flickering Station Lamps
        const flicker = Math.sin(t * 12) > 0.8 ? 0.3 : 1;
        ctx.fillStyle = `rgba(255, 215, 0, ${0.12 * flicker})`;
        ctx.beginPath();
        ctx.arc(150, 40, 70, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(width - 150, 40, 70, 0, Math.PI * 2);
        ctx.fill();

        // Concrete Pillars (Props)
        const pillar1 = arena.props.find((p) => p.id === 'concrete_pillar_1');
        if (pillar1) {
          ctx.fillStyle = pillar1.isUsed ? '#2b2226' : '#2d334d';
          ctx.fillRect(width * 0.42, 60, 36, groundY - 60);
          ctx.fillStyle = '#475569';
          ctx.fillRect(width * 0.42 - 4, groundY - 10, 44, 10);

          // In-world label
          ctx.font = '10px monospace';
          ctx.fillStyle = pillar1.isUsed ? '#64748b' : '#38bdf8';
          ctx.fillText(pillar1.isUsed ? 'SHATTERED' : 'PILLAR (COVER)', width * 0.42 - 12, 50);
        }

        // Steam Pipe on left wall
        const steamProp = arena.props.find((p) => p.id === 'steam_valve_1');
        if (steamProp) {
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.moveTo(15, 70);
          ctx.lineTo(15, groundY);
          ctx.stroke();

          // Steam puff animation
          if (!steamProp.isUsed) {
            ctx.fillStyle = `rgba(226, 232, 240, ${0.25 + Math.sin(t * 4) * 0.15})`;
            ctx.beginPath();
            ctx.arc(22 + Math.cos(t * 3) * 6, 85 + Math.sin(t * 2) * 5, 14, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else {
        // Flooded Cyberpunk Metropolis
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#040b17');
        grad.addColorStop(0.65, '#0b1d38');
        grad.addColorStop(1, '#061326');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Distant Sunken Skyscrapers
        ctx.fillStyle = '#08172c';
        ctx.fillRect(40, 50, 90, height - 120);
        ctx.fillRect(160, 90, 80, height - 160);
        ctx.fillRect(width - 240, 40, 110, height - 110);
        ctx.fillRect(width - 100, 80, 80, height - 150);

        // Torrential Rain lines
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 40; i++) {
          const rx = ((i * 37 + t * 450) % width);
          const ry = ((i * 53 + t * 700) % (height - 70));
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 8, ry + 22);
          ctx.stroke();
        }

        // Water Floor & Reflections
        const groundY = height - 80;
        ctx.fillStyle = '#05182e';
        ctx.fillRect(0, groundY, width, 80);

        // Water ripple highlights
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1.5;
        for (let r = 0; r < 4; r++) {
          const ripY = groundY + 15 + r * 15;
          const shift = Math.sin(t * 3 + r) * 15;
          ctx.beginPath();
          ctx.moveTo(50 + shift, ripY);
          ctx.lineTo(width - 50 + shift, ripY);
          ctx.stroke();
        }

        // Floating Cargo Platform
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(width * 0.38, groundY - 14, 90, 18);
        ctx.strokeStyle = '#0284c7';
        ctx.strokeRect(width * 0.38, groundY - 14, 90, 18);
        ctx.font = '10px monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('DRY PLATFORM', width * 0.38 + 6, groundY - 20);
      }

      // ==========================================
      // 2. BOSS TELEGRAPH INDICATOR (ACTIVE THREAT)
      // ==========================================
      if (boss.activeTelegraph) {
        const tele = boss.activeTelegraph;
        const groundY = height - 80;

        if (tele.telegraphType === 'ground_red') {
          // Red Ground Shockwave zone
          ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
          ctx.fillRect(80, groundY - 20, width - 200, 30);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.strokeRect(80, groundY - 20, width - 200, 30);

          ctx.font = 'bold 12px monospace';
          ctx.fillStyle = '#f87171';
          ctx.fillText(`⚠️ [SEISMIC WAVE INCOMING: JUMP OR PHASE SHIFT!]`, width * 0.25, groundY - 32);
        } else if (tele.telegraphType === 'slash_yellow') {
          // Yellow High Slash cone
          ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
          ctx.beginPath();
          ctx.moveTo(width * 0.65, groundY - 60);
          ctx.lineTo(120, groundY - 80);
          ctx.lineTo(120, groundY - 30);
          ctx.closePath();
          ctx.fill();

          ctx.font = 'bold 12px monospace';
          ctx.fillStyle = '#fbbf24';
          ctx.fillText(`⚠️ [HIGH SLASH INCOMING: SLIDE OR CROUCH LOW!]`, width * 0.25, groundY - 95);
        } else if (tele.telegraphType === 'pierce_blue') {
          // Blue Piercing line
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
          ctx.lineWidth = 4;
          ctx.setLineDash([10, 8]);
          ctx.beginPath();
          ctx.moveTo(width * 0.68, groundY - 45);
          ctx.lineTo(130, groundY - 45);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.font = 'bold 12px monospace';
          ctx.fillStyle = '#38bdf8';
          ctx.fillText(`⚠️ [PIERCING THRUST: TIME PARRY FOR COUNTER! 🛡️]`, width * 0.25, groundY - 60);
        }
      }

      // ==========================================
      // 3. CHALLENGER SPRITE (PLAYER)
      // ==========================================
      const groundY = height - 80;
      let playerX = 140;
      let playerY = groundY - 55;

      // Animation offsets
      if (playerActionState === 'jumping') {
        playerY -= 45;
      } else if (playerActionState === 'crouching') {
        playerY += 15;
      } else if (playerActionState === 'attacking') {
        playerX += 35;
      } else if (playerActionState === 'hurt') {
        playerX -= 20;
      } else {
        // Idle breathing
        playerY += Math.sin(t * 4) * 2;
      }

      // Probability Sparks around player (ORV Lore)
      const heat = combatState.probabilityHeat;
      if (heat > 0) {
        const sparkCount = Math.floor(heat / 15);
        const sparkColor = heat > 80 ? '#ef4444' : heat > 50 ? '#00d2ff' : '#10b981';
        ctx.fillStyle = sparkColor;
        for (let s = 0; s < sparkCount; s++) {
          const sx = playerX + (Math.sin(t * 8 + s) * 25);
          const sy = playerY + (Math.cos(t * 7 + s) * 35);
          ctx.fillRect(sx, sy, 3, 3);
        }
      }

      // Player Body Silhouette & Robe
      ctx.fillStyle = loadout.avatarArchetype === 'shadow_rogue' ? '#7e22ce' : '#0284c7';
      ctx.beginPath();
      ctx.arc(playerX, playerY - 12, 10, 0, Math.PI * 2); // Head
      ctx.fill();

      // Body & Cloak
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(playerX - 9, playerY - 2, 18, 34);

      // Energy Blade (Weapon)
      const bladeAngle = playerActionState === 'attacking' ? 0.3 : -0.7 + Math.sin(t * 4) * 0.1;
      ctx.save();
      ctx.translate(playerX + 8, playerY + 12);
      ctx.rotate(bladeAngle);
      ctx.fillStyle = '#00d2ff';
      ctx.fillRect(0, -3, 38, 5);
      // Blade glow trail
      ctx.strokeStyle = 'rgba(0, 210, 255, 0.4)';
      ctx.lineWidth = 6;
      ctx.strokeRect(0, -3, 38, 5);
      ctx.restore();

      // Player Label
      ctx.font = '11px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(loadout.name, playerX - 25, playerY - 30);

      // ==========================================
      // 4. BOSS SPRITE (CALAMITY BEAST)
      // ==========================================
      const bossX = width - 170;
      let bossY = groundY - 75;

      if (boss.isStaggered) {
        // Staggered posture
        bossY += 15;
        ctx.fillStyle = 'rgba(250, 204, 21, 0.8)';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('💫 STAGGERED!', bossX - 20, bossY - 30);
      } else {
        bossY += Math.sin(t * 3) * 3;
      }

      if (arena.theme === 'metro') {
        // Gorgon Brute (Minotaur Automaton)
        ctx.fillStyle = boss.enraged ? '#7f1d1d' : '#334155';
        ctx.fillRect(bossX - 25, bossY - 20, 50, 75); // Torso

        // Mechanical Horns
        ctx.fillStyle = '#94a3b8';
        ctx.beginPath();
        ctx.moveTo(bossX - 15, bossY - 20);
        ctx.lineTo(bossX - 35, bossY - 45);
        ctx.lineTo(bossX - 10, bossY - 30);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(bossX + 15, bossY - 20);
        ctx.lineTo(bossX + 35, bossY - 45);
        ctx.lineTo(bossX + 10, bossY - 30);
        ctx.fill();

        // Crimson Glowing Visor
        ctx.fillStyle = boss.enraged ? '#f43f5e' : '#ef4444';
        ctx.fillRect(bossX - 12, bossY - 10, 24, 6);

        // Pneumatic Pile-Driver Arm
        const armPump = Math.sin(t * 6) * 8;
        ctx.fillStyle = '#64748b';
        ctx.fillRect(bossX - 42 - armPump, bossY + 10, 20, 18);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(bossX - 55 - armPump, bossY + 12, 14, 14);
      } else {
        // Leviathan Automaton (Serpentine Dragon)
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 16;
        ctx.beginPath();
        ctx.moveTo(bossX + 30, bossY);
        for (let i = 0; i < 60; i += 10) {
          const sy = bossY + Math.sin(t * 4 + i * 0.1) * 14;
          ctx.lineTo(bossX - i, sy);
        }
        ctx.stroke();

        // Biomechanical Dragon Head
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(bossX - 50, bossY - 18, 35, 24);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(bossX - 45, bossY - 8, 8, 6); // Plasma Eye
      }

      // Boss Label
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = boss.enraged ? '#f43f5e' : '#f87171';
      ctx.fillText(boss.name, bossX - 40, bossY - 40);

      // ==========================================
      // 5. FLOATING COMBAT TEXT & DAMAGE NUMBERS
      // ==========================================
      floatingTexts.forEach((item) => {
        ctx.font = 'bold 14px monospace';
        ctx.fillStyle = item.color;
        ctx.globalAlpha = item.opacity;
        ctx.fillText(item.text, item.x, item.y);
        ctx.globalAlpha = 1.0;
      });

      ctx.restore();

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [arena, boss, combatState, loadout, playerActionState, screenShake, floatingTexts]);

  // Click on canvas to interact with props
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;

    // Check click near concrete pillar in Metro
    if (arena.theme === 'metro') {
      if (x > canvas.width * 0.38 && x < canvas.width * 0.48) {
        onTriggerProp('concrete_pillar_1');
      } else if (x < 60) {
        onTriggerProp('steam_valve_1');
      }
    } else {
      if (x > canvas.width * 0.35 && x < canvas.width * 0.5) {
        onTriggerProp('cargo_platform_1');
      }
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl bg-slate-950">
      <canvas
        ref={canvasRef}
        width={860}
        height={400}
        onClick={handleCanvasClick}
        className="w-full h-auto cursor-crosshair block"
      />
      <div className="absolute top-3 left-3 bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1 font-mono text-[11px] text-slate-400 flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span>CANVAS ENGINE: 60 FPS</span>
      </div>
    </div>
  );
};

