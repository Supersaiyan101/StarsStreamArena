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

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
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
  const particlesRef = useRef<Particle[]>([]);
  const lastActionRef = useRef<string>('idle');
  const hitStopUntilRef = useRef<number>(0);

  // Spawn action-specific particles
  useEffect(() => {
    if (playerActionState !== lastActionRef.current) {
      const now = performance.now();
      if (playerActionState === 'attacking') {
        // Hit-stop micro-freeze (45ms)
        hitStopUntilRef.current = now + 45;
        // Blade slash sparks
        for (let i = 0; i < 16; i++) {
          particlesRef.current.push({
            x: 200 + Math.random() * 80,
            y: 260 + (Math.random() - 0.5) * 60,
            vx: 3 + Math.random() * 8,
            vy: (Math.random() - 0.5) * 6,
            color: Math.random() > 0.4 ? '#00e5ff' : '#ffffff',
            size: 2 + Math.random() * 3,
            alpha: 1.0,
            decay: 0.04 + Math.random() * 0.03,
          });
        }

        // Stagger Critical Shockwave Burst
        if (boss.isStaggered) {
          hitStopUntilRef.current = now + 70;
          for (let i = 0; i < 22; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 3 + Math.random() * 7;
            particlesRef.current.push({
              x: 360 + (Math.random() - 0.5) * 40,
              y: 230 + (Math.random() - 0.5) * 40,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              color: Math.random() > 0.3 ? '#fbbf24' : '#f59e0b',
              size: 3 + Math.random() * 3.5,
              alpha: 1.0,
              decay: 0.03 + Math.random() * 0.02,
            });
          }
        }
      } else if (playerActionState === 'parrying') {
        hitStopUntilRef.current = now + 60;
        // Hexagonal shield deflection sparks
        for (let i = 0; i < 14; i++) {
          particlesRef.current.push({
            x: 180 + Math.random() * 20,
            y: 260 + (Math.random() - 0.5) * 50,
            vx: -2 - Math.random() * 5,
            vy: (Math.random() - 0.5) * 7,
            color: '#38bdf8',
            size: 2.5 + Math.random() * 2.5,
            alpha: 1.0,
            decay: 0.03 + Math.random() * 0.02,
          });
        }
      } else if (playerActionState === 'jumping') {
        // Dust puffs at ground
        for (let i = 0; i < 8; i++) {
          particlesRef.current.push({
            x: 140 + (Math.random() - 0.5) * 25,
            y: 320,
            vx: (Math.random() - 0.5) * 3,
            vy: -1 - Math.random() * 2,
            color: '#64748b',
            size: 3 + Math.random() * 3,
            alpha: 0.7,
            decay: 0.03,
          });
        }
      }
      lastActionRef.current = playerActionState;
    }
  }, [playerActionState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const now = performance.now();
      // Check Hit-Stop freeze
      const isFrozen = now < hitStopUntilRef.current;

      if (!isFrozen) {
        timeRef.current += 0.03;
      }
      const t = timeRef.current;
      const width = canvas.width;
      const height = canvas.height;

      ctx.save();

      // Screen Shake offset
      if (screenShake) {
        const shakeX = (Math.random() - 0.5) * 10;
        const shakeY = (Math.random() - 0.5) * 10;
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
          ctx.lineTo(i + 20, 60);
          ctx.stroke();
        }

        // Concrete Platform Floor
        const groundY = height - 50;
        ctx.fillStyle = '#181a26';
        ctx.fillRect(0, groundY, width, 50);

        // Third Rail (Center Electrified Track)
        ctx.fillStyle = '#2a2d3d';
        ctx.fillRect(0, groundY + 18, width, 14);
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 2;
        ctx.setLineDash([15, 10]);
        ctx.beginPath();
        ctx.moveTo(0, groundY + 25);
        ctx.lineTo(width, groundY + 25);
        ctx.stroke();
        ctx.setLineDash([]);

        // Flickering Station Lamps
        const flicker = Math.sin(t * 12) > 0.8 ? 0.3 : 1;
        ctx.fillStyle = `rgba(255, 215, 0, ${0.12 * flicker})`;
        ctx.beginPath();
        ctx.arc(150, 30, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(width - 150, 30, 50, 0, Math.PI * 2);
        ctx.fill();

        // Concrete Pillars (Props)
        const pillar1 = arena.props.find((p) => p.id === 'concrete_pillar_1');
        if (pillar1) {
          ctx.fillStyle = pillar1.isUsed ? '#2b2226' : '#2d334d';
          ctx.fillRect(width * 0.42, 40, 32, groundY - 40);
          ctx.fillStyle = '#475569';
          ctx.fillRect(width * 0.42 - 4, groundY - 8, 40, 8);

          ctx.font = '10px monospace';
          ctx.fillStyle = pillar1.isUsed ? '#64748b' : '#38bdf8';
          ctx.fillText(pillar1.isUsed ? 'SHATTERED' : 'PILLAR [4]', width * 0.42 - 8, 32);
        }

        // Steam Pipe on left wall
        const steamProp = arena.props.find((p) => p.id === 'steam_valve_1');
        if (steamProp) {
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 7;
          ctx.beginPath();
          ctx.moveTo(15, 45);
          ctx.lineTo(15, groundY);
          ctx.stroke();

          // Steam puff animation
          if (!steamProp.isUsed) {
            ctx.fillStyle = `rgba(226, 232, 240, ${0.25 + Math.sin(t * 4) * 0.15})`;
            ctx.beginPath();
            ctx.arc(22 + Math.cos(t * 3) * 5, 60 + Math.sin(t * 2) * 4, 11, 0, Math.PI * 2);
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
        ctx.fillRect(40, 30, 80, height - 80);
        ctx.fillRect(150, 60, 70, height - 110);
        ctx.fillRect(width - 220, 25, 95, height - 75);
        ctx.fillRect(width - 90, 50, 70, height - 100);

        // Torrential Rain lines
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 35; i++) {
          const rx = ((i * 37 + t * 450) % width);
          const ry = ((i * 53 + t * 700) % (height - 45));
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx - 8, ry + 18);
          ctx.stroke();
        }

        // Water Floor & Reflections
        const groundY = height - 50;
        ctx.fillStyle = '#05182e';
        ctx.fillRect(0, groundY, width, 50);

        // Water ripple highlights
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.lineWidth = 1.5;
        for (let r = 0; r < 3; r++) {
          const ripY = groundY + 12 + r * 12;
          const shift = Math.sin(t * 3 + r) * 15;
          ctx.beginPath();
          ctx.moveTo(50 + shift, ripY);
          ctx.lineTo(width - 50 + shift, ripY);
          ctx.stroke();
        }

        // Floating Cargo Platform
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(width * 0.38, groundY - 12, 85, 16);
        ctx.strokeStyle = '#0284c7';
        ctx.strokeRect(width * 0.38, groundY - 12, 85, 16);
        ctx.font = '10px monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('DRY PLATFORM [4]', width * 0.38 + 2, groundY - 16);
      }

      // ==========================================
      // 2. BOSS TELEGRAPH INDICATOR (ACTIVE THREAT)
      // ==========================================
      if (boss.activeTelegraph) {
        const tele = boss.activeTelegraph;
        const groundY = height - 50;

        if (tele.telegraphType === 'ground_red') {
          // Red Ground Shockwave zone
          ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
          ctx.fillRect(80, groundY - 20, width - 200, 30);
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.strokeRect(80, groundY - 20, width - 200, 30);

          ctx.font = 'bold 12px monospace';
          ctx.fillStyle = '#f87171';
          ctx.fillText(`⚠️ INCOMING SWEEP ➔ JUMP (W)!`, width * 0.25, groundY - 32);
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
          ctx.fillText(`⚠️ INCOMING SLAM ➔ SLIDE (S)!`, width * 0.25, groundY - 95);
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
          ctx.fillText(`⚠️ INCOMING THRUST ➔ PARRY (SPACE)!`, width * 0.25, groundY - 60);
        }
      }

      // ==========================================
      // 3. CHALLENGER SPRITE (ANIME SILHOUETTE)
      // ==========================================
      const groundY = height - 50;
      let playerX = 140;
      let playerY = groundY - 48;

      // Dynamic animation offset calculations
      if (playerActionState === 'jumping') {
        playerY -= 50;
      } else if (playerActionState === 'crouching') {
        playerY += 15;
        playerX += 18;
      } else if (playerActionState === 'attacking') {
        playerX += 45;
      } else if (playerActionState === 'hurt') {
        playerX -= 22;
      } else {
        // Idle breathing oscillation
        playerY += Math.sin(t * 4) * 2;
      }

      // Ground shadow under challenger (scales with jump height)
      const shadowScale = playerActionState === 'jumping' ? 0.55 : 1.0;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(playerX, groundY - 5, 20 * shadowScale, 5 * shadowScale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Flowing Anime Trenchcoat / Cape Ribbons
      const capeWave = Math.sin(t * 8) * 8;
      const capeTilt = playerActionState === 'attacking' ? -22 : playerActionState === 'jumping' ? 15 : 0;
      ctx.save();
      ctx.fillStyle = loadout.avatarArchetype === 'shadow_rogue' ? '#3b0764' : '#0c4a6e';
      ctx.strokeStyle = loadout.avatarArchetype === 'shadow_rogue' ? '#a855f7' : '#00e5ff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(playerX - 6, playerY + 8);
      ctx.lineTo(playerX - 28 + capeTilt, playerY + 32 + capeWave);
      ctx.lineTo(playerX - 22 + capeTilt, playerY + 36 + capeWave);
      ctx.lineTo(playerX + 2, playerY + 22);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Challenger Body Silhouette
      ctx.fillStyle = '#0f172a';
      // Legs
      ctx.fillRect(playerX - 8, playerY + 20, 6, 18);
      ctx.fillRect(playerX + 2, playerY + 20, 6, 18);
      // Torso & Trenchcoat
      ctx.fillRect(playerX - 10, playerY - 2, 20, 24);

      // Challenger Head & Glowing Eye Visor
      ctx.fillStyle = loadout.avatarArchetype === 'shadow_rogue' ? '#7e22ce' : '#0284c7';
      ctx.beginPath();
      ctx.arc(playerX, playerY - 12, 10, 0, Math.PI * 2);
      ctx.fill();
      // Glowing Anime Eye Visor
      ctx.fillStyle = '#00e5ff';
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 8;
      ctx.fillRect(playerX + 2, playerY - 15, 6, 3);
      ctx.shadowBlur = 0;

      // Energy Blade Weapon
      const bladeAngle = playerActionState === 'attacking' ? 0.35 : -0.7 + Math.sin(t * 4) * 0.12;
      ctx.save();
      ctx.translate(playerX + 8, playerY + 10);
      ctx.rotate(bladeAngle);
      // Blade handle
      ctx.fillStyle = '#475569';
      ctx.fillRect(-6, -2, 6, 4);
      // Glowing Energy Blade Edge
      ctx.fillStyle = '#00e5ff';
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 12;
      ctx.fillRect(0, -2.5, 42, 5);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, -1, 40, 2);
      ctx.restore();

      // ==========================================
      // 3.1 DYNAMIC ANIME SLASH VFX (ON ATTACK)
      // ==========================================
      if (playerActionState === 'attacking') {
        ctx.save();
        // Outer neon aura arc
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 10;
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 24;
        ctx.beginPath();
        ctx.arc(playerX + 42, playerY + 8, 62, -Math.PI * 0.45, Math.PI * 0.35);
        ctx.stroke();

        // Inner white-hot cutting core
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(playerX + 42, playerY + 8, 62, -Math.PI * 0.38, Math.PI * 0.28);
        ctx.stroke();

        // High-speed slash slash lines
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(playerX + 15, playerY - 30);
        ctx.lineTo(playerX + 110, playerY + 40);
        ctx.moveTo(playerX + 25, playerY - 15);
        ctx.lineTo(playerX + 120, playerY + 30);
        ctx.stroke();
        ctx.restore();
      }

      // ==========================================
      // 3.2 HEXAGONAL PARRY ENERGY SHIELD (ON PARRY)
      // ==========================================
      if (playerActionState === 'parrying') {
        ctx.save();
        const hx = playerX + 32;
        const hy = playerY;
        const hSize = 38;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3.5;
        ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 20;

        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const px = hx + hSize * Math.cos(angle);
          const py = hy + hSize * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Inner pulse circle
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(hx, hy, 16 + Math.sin(t * 15) * 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Player Label
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(loadout.name, playerX - 25, playerY - 30);

      // ==========================================
      // 4. BOSS SPRITE (CALAMITY BEAST)
      // ==========================================
      const bossX = width - 170;
      let bossY = groundY - 60;

      if (boss.isStaggered) {
        bossY += 12;
      } else {
        bossY += Math.sin(t * 3) * 3;
      }

      // Shadow under Boss
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.beginPath();
      ctx.ellipse(bossX, groundY - 5, 40, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Boss Wind-up Telegraph Aura
      if (boss.activeTelegraph) {
        ctx.save();
        ctx.strokeStyle = boss.enraged ? '#f43f5e' : '#f59e0b';
        ctx.lineWidth = 3;
        ctx.shadowColor = boss.enraged ? '#f43f5e' : '#f59e0b';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(bossX, bossY + 15, 68 + Math.sin(t * 10) * 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Stagger Dizzy Swirl & Broken Sparks
      if (boss.isStaggered) {
        ctx.save();
        ctx.font = 'bold 13px monospace';
        ctx.fillStyle = '#fde047';
        ctx.fillText('💥 STUNNED (+50% DMG)', bossX - 55, bossY - 45);
        // Orbiting stars
        for (let s = 0; s < 3; s++) {
          const starAngle = t * 6 + (s * Math.PI * 2) / 3;
          const sx = bossX + Math.cos(starAngle) * 32;
          const sy = bossY - 35 + Math.sin(starAngle) * 10;
          ctx.fillText('⭐', sx - 6, sy);
        }
        ctx.restore();
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

        // Pulsing Crimson Visor
        ctx.save();
        ctx.fillStyle = boss.enraged ? '#f43f5e' : '#ef4444';
        ctx.shadowColor = boss.enraged ? '#f43f5e' : '#ef4444';
        ctx.shadowBlur = 14;
        ctx.fillRect(bossX - 14, bossY - 10, 28, 6);
        ctx.restore();

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
        ctx.save();
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.fillRect(bossX - 45, bossY - 8, 8, 6); // Plasma Eye
        ctx.restore();
      }

      // Boss Label
      ctx.font = 'bold 12px monospace';
      ctx.fillStyle = boss.enraged ? '#f43f5e' : '#f87171';
      ctx.fillText(boss.name, bossX - 40, bossY - 40);

      // ==========================================
      // 5. PROCEDURAL PARTICLE SYSTEM
      // ==========================================
      if (!isFrozen) {
        particlesRef.current.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;
        });
        particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0);
      }

      particlesRef.current.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // ==========================================
      // 6. FLOATING ARCADE IMPACT COMBAT TEXTS
      // ==========================================
      floatingTexts.forEach((item) => {
        ctx.save();
        ctx.font = '900 15px monospace';
        ctx.textAlign = 'center';
        ctx.globalAlpha = item.opacity;
        // Heavy dark drop outline
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 4;
        ctx.strokeText(item.text, item.x, item.y);
        ctx.fillStyle = item.color;
        ctx.fillText(item.text, item.x, item.y);
        ctx.restore();
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
        height={270}
        onClick={handleCanvasClick}
        className="w-full h-auto cursor-crosshair block"
      />
      <div className="absolute top-2.5 left-2.5 bg-slate-950/80 border border-slate-800 rounded-lg px-2 py-0.5 font-mono text-[10px] text-slate-400 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span>CANVAS: 60 FPS</span>
      </div>
    </div>
  );
};
