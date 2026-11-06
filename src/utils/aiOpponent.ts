import type {
  ActiveCombatState,
  Boss,
  Arena,
  PlayerLoadout,
  CounterAction,
} from '../types/game';
import {
  executePlayerSkill,
  executeCounterAction,
  resolveTurnCycle,
} from './combatEngine';

export interface OpponentTurnResult {
  combatState: ActiveCombatState;
  bossState: Boss;
  arena: Arena;
  sabotageLaunched: 'debris' | 'minion' | 'heat' | null;
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

  // 2. Play available skills from hand (up to 2 cards per turn if energy permits)
  let energyLeft = nextCombat.playerEnergy;
  const availableSkills = nextCombat.activeHand.filter((s) => s.energyCost <= energyLeft);

  // Sort by damage desc
  availableSkills.sort((a, b) => b.baseDamage - a.baseDamage);

  for (const skill of availableSkills.slice(0, 2)) {
    if (nextCombat.playerEnergy >= skill.energyCost && nextBoss.currentHp > 0) {
      const result = executePlayerSkill(skill.id, nextCombat, nextBoss, nextArena, loadout);
      nextCombat = result.combatState;
      nextBoss = result.bossState;
      nextArena = result.arena;
      logs.push(`[OPPONENT ${loadout.name}: Executed ${skill.name} for ${skill.baseDamage} DMG!]`);
      energyLeft = nextCombat.playerEnergy;
    }
  }

  // 3. Launch Sabotage against Player 1 if energy available
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

  // 4. Resolve turn cycle (energy replenish, draw cards, boss telegraph countdown)
  const turnResult = resolveTurnCycle(nextCombat, nextBoss, nextArena);
  nextCombat = turnResult.combatState;
  nextBoss = turnResult.bossState;
  nextArena = turnResult.arena;

  return {
    combatState: nextCombat,
    bossState: nextBoss,
    arena: nextArena,
    sabotageLaunched,
    logs,
  };
}

