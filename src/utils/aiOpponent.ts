import type {
  ActiveCombatState,
  Boss,
  Arena,
  PlayerLoadout,
  CounterAction,
  Skill,
} from '../types/game';
import {
  executePokemonStyleTurn,
  executeCounterAction,
} from './combatEngine';

export interface OpponentTurnResult {
  combatState: ActiveCombatState;
  bossState: Boss;
  arena: Arena;
  sabotageLaunched: 'debris' | 'minion' | 'heat' | null;
  damageDealtByOpponent: number;
  damageDealtByBoss: number;
  isSuperEffective: boolean;
  logs: string[];
}

export function executeOpponentAITurn(
  combatState: ActiveCombatState,
  bossState: Boss,
  arena: Arena,
  loadout: PlayerLoadout
): OpponentTurnResult {
  let nextCombat = { ...combatState };
  let nextBoss = { ...bossState };
  let nextArena = { ...arena };
  let sabotageLaunched: 'debris' | 'minion' | 'heat' | null = null;
  const logs: string[] = [];

  // 1. Counter boss telegraph if active (80% intelligent counter rate)
  if (nextBoss.activeTelegraph) {
    const tele = nextBoss.activeTelegraph;
    const willCounter = Math.random() < 0.8;
    const chosenCounter: CounterAction = willCounter ? tele.counterAction : 'none';

    if (chosenCounter !== 'none') {
      const counterResult = executeCounterAction(chosenCounter, nextCombat, nextBoss);
      nextCombat = counterResult.combatState;
      nextBoss = counterResult.bossState;
      logs.push(`[OPPONENT ${loadout.name}: Countered ${tele.name} cleanly with ${chosenCounter.toUpperCase()}!]`);
    }
  }

  // 2. Intelligent Move Selection from 4 Tactical Moves
  const moves = nextCombat.activeHand.slice(0, 4);
  let chosenMove: Skill = moves[0] || {
    id: 'basic_strike',
    name: 'Strike',
    category: 'strike',
    moveRole: 'strike',
    element: 'physical',
    priority: 0,
    energyCost: 1,
    cooldown: 0,
    baseDamage: 30,
    staggerDamage: 10,
    sabotageEnergyGain: 15,
    heatGenerated: 5,
    description: 'Basic strike',
    synergyText: '',
  };

  // Rule A: Stigma Ultimate if ready
  const stigmaMove = moves.find((m) => m.isStigma);
  if (stigmaMove && nextCombat.stigmaMeter >= 100 && Math.random() < 0.75) {
    chosenMove = stigmaMove;
  } else {
    // Rule B: Target Elemental Weakness (Super Effective 2.0x)
    const weakMove = moves.find((m) => !m.isStigma && nextBoss.weaknesses?.includes(m.element));
    if (weakMove && Math.random() < 0.7) {
      chosenMove = weakMove;
    } else {
      // Rule C: Setup Buff if not active
      const setupMove = moves.find((m) => m.moveRole === 'setup');
      if (setupMove && !nextCombat.setupBuff && Math.random() < 0.45) {
        chosenMove = setupMove;
      } else {
        // Rule D: Outspeed check with priority
        const priorityMove = moves.find((m) => m.priority === 1);
        if (priorityMove && (nextBoss.speed ?? 10) > (loadout.attributes.agility ?? 10) && Math.random() < 0.6) {
          chosenMove = priorityMove;
        } else {
          // Rule E: Primary high-impact strike
          const strikeMove = moves.find((m) => m.moveRole === 'strike');
          if (strikeMove) chosenMove = strikeMove;
        }
      }
    }
  }

  // 3. Execute Turn via Pokémon-Style Tactical Engine
  const turnResult = executePokemonStyleTurn(chosenMove.id, nextCombat, nextBoss, nextArena, loadout);
  nextCombat = turnResult.combatState;
  nextBoss = turnResult.bossState;
  nextArena = turnResult.arena;
  logs.push(...turnResult.narrativeLogs);

  // 4. Launch Sabotage against Player 1 if energy available
  if (nextCombat.sabotageEnergy >= 100) {
    sabotageLaunched = 'heat';
    nextCombat.sabotageEnergy -= 100;
    logs.push(`[OPPONENT ATTACK: ${loadout.name} unleashed a PROBABILITY OVERLOAD at your screen!]`);
  } else if (nextCombat.sabotageEnergy >= 70 && Math.random() < 0.5) {
    sabotageLaunched = 'minion';
    nextCombat.sabotageEnergy -= 70;
    logs.push(`[OPPONENT ATTACK: ${loadout.name} spawned a CALAMITY MINION in your lane!]`);
  } else if (nextCombat.sabotageEnergy >= 40 && Math.random() < 0.6) {
    sabotageLaunched = 'debris';
    nextCombat.sabotageEnergy -= 40;
    logs.push(`[OPPONENT ATTACK: ${loadout.name} fired a DEBRIS BARRAGE into your arena!]`);
  }

  return {
    combatState: nextCombat,
    bossState: nextBoss,
    arena: nextArena,
    sabotageLaunched,
    damageDealtByOpponent: turnResult.damageDealtByPlayer,
    damageDealtByBoss: turnResult.damageDealtByBoss,
    isSuperEffective: turnResult.isSuperEffective,
    logs,
  };
}

