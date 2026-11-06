# 🌌 StarStream Arena — Deep Content Design & Specification

> **Official Repository:** [https://github.com/Supersaiyan101/StarsStreamArena](https://github.com/Supersaiyan101/StarsStreamArena)  
> **Target Event:** Solana Hackathon (MLH League)

---

## 1. Deep Arena & Boss Architecture

### 🚇 Arena 1: "The Subterranean Metro (Line 3)"
* **Aesthetic:** Abandoned underground metro terminal, flickering yellow warning lights, sparking conduit boxes, graffiti-covered train cars, and puddles of machine oil.
* **Environmental Modifier:** **Confined Quarters**
  * Melee & Slashing moves gain **+30% Attack Damage**.
  * Projectile/ranged travel speed is reduced by **25%**.
* **Interactive Obstacles & Cover:**
  1. **Reinforced Concrete Pillars (x2):** Players can take cover behind pillars to absorb boss projectiles. However, heavy boss charges shatter the pillars, scattering sharp stone fragments.
  2. **High-Voltage Breaker Boxes (x2):** Hitting a wall breaker box discharges a localized arc of electricity, stunning any unit within 2 meters for 1 turn.
* **Phase 2 Environmental Hazard (Boss at 50% HP — "The Ghost Express"):**
  * A klaxon horn blares: `[WARNING: EXPRESS CAR 308 INBOUND]`.
  * Every 4 turns, a runaway ghost subway car hurtles through the central rail tracks. Standing on the tracks deals massive damage (35% max HP).
* **The Boss:** **"Gorgon Brute — Ironclad Calamity"**
  * *Visual:* A 9-foot biomechanical minotaur in rusted hydraulic plate armor, with a pneumatic pile-driver right arm and glowing crimson visor.
  * *Unique Mechanic — Stagger Gauge:* The boss has an Ironclad Shield (100 pts). Landing parries or heavy kinetic attacks depletes the gauge. Breaking the gauge causes **Armor Break**, staggering the boss for 2 turns (+50% incoming damage).
  * *Telegraphed Moveset:*
    * **Seismic Slam:** Raises pile-driver arm for 1.5s (glowing red telegraph). Slams the ground, launching a shockwave across the arena. Must **Dodge / Phase Shift** over the wave.
    * **Pneumatic Bull Rush:** Charges across the floor at high speed. If dodged into a concrete pillar, the boss crashes and stuns himself!
    * **Ceiling Ripping:** Tears a chunk of the subway ceiling and hurls 3 boulders into the player's zone.
  * *Phase 2 Enrage:* Steam vents erupt from his back. Attack speed +30%, eyes glow violet, and every charge leaves a trail of burning oil.

---

### 🌊 Arena 2: "The Flooded Metropolis (District 7)"
* **Aesthetic:** Half-submerged cyberpunk city square under a midnight thunderstorm. Holographic billboards flicker across dark reflective waters, rain lashes down, and floating cargo crates drift.
* **Environmental Modifier:** **Conductive Deluge**
  * Lightning and Ice skills gain **+40% Critical Strike Chance**.
  * Water surface conducts area-of-effect electric shocks.
  * Fire status effects have their duration reduced by 50%.
* **Interactive Obstacles & Cover:**
  1. **Floating Modular Cargo Platforms (x3):** Wading in deep water slows player movement by 15%. Jumping onto platforms provides dry footing and critical height advantage.
  2. **Submerged Neon Signs (Capacitors):** Shooting any lightning attack at a submerged sign electrocutes the entire connecting water pool, stunning all enemies in the water for 1 turn.
* **Phase 2 Environmental Hazard (Boss at 50% HP — "Lightning Tempest"):**
  * The sky darkens to pitch black. Rainstorm turns torrential.
  * Random water tiles are targeted by cloudburst lightning strikes every 3 turns (indicated by glowing blue surface ripples 1 turn prior).
* **The Boss:** **"Leviathan Automaton — Abyssal Seraph"**
  * *Visual:* A colossal serpentine dragon clad in chrome and sea-glass plating, hovering above the floodwaters with blue plasma thruster fins.
  * *Unique Mechanic — Stance Switching:*
    * **Aegis Stance:** Takes 50% reduced damage, hovers high, and launches homing electric orbs.
    * **Assault Stance:** Lowers into the water, vulnerable to normal damage, but unleashes aggressive melee tail sweeps and high-pressure laser beams.
  * *Telegraphed Moveset:*
    * **Plasma Discharge:** Launches 4 homing electrical spheres. Can be deflected back with *Kinetic Deflector* to deal massive posture damage to the boss!
    * **Abyssal Maelstrom:** Whirlpools the water, pulling the player toward the boss before delivering a tail slam.
    * **Hydro-Beam:** Charges a concentrated plasma laser sweep from left to right across the arena.
  * *Phase 2 Enrage:* Surrounds itself with an electrified water shield and summons 2 storm eel drones.

---

## 2. Expanded 16-Skill Catalog & Elemental Synergies

Each player equips **5 skills** into their Combat Deck. The Overseer draws **3 random active skill cards** each round:

### A. Melee & Physical Arts
1. **Plasma Cleave:** Fast 2-hit horizontal slash. Builds combo multiplier. *(Bonus damage in Metro)*
2. **Kinetic Breaker:** Heavy overhead bludgeon. Deals massive Stagger damage; builds +25 Sabotage Energy.
3. **Phantom Lunge:** Piercing dash strike that ignores 50% of the target's armor.
4. **Cyclone Shred:** 360-degree whirlwind spin. Destroys small projectiles and shreds nearby sabotage minions.

### B. Elemental Magic & Tech Arts
5. **Volt Arc:** Bouncing lightning bolt. Jumps between boss and minions. *(+40% Crit in Flooded City)*
6. **Glacial Aegis:** Summons an ice barrier absorbing damage equal to 25% max HP and freezing adjacent water.
7. **Infernal Ignition:** Launches a jet of incendiary plasma, inflicting a 3-turn burn.
8. **Tempest Surge:** Calls down an electric strike. If the target is standing in water, causes **Electrocution Stun**.

### C. Tactical & Defensive Maneuvers
9. **Phase Shift (Dodge):** Brief invulnerability dash. Perfectly dodging a telegraphed boss move triggers **"Bullet Time"** (boss slows down for 1 turn).
10. **Kinetic Deflector (Parry):** Raises a reflective buckler. Parrying within 0.3s of an incoming strike reflects 50% damage back to the attacker!
11. **Smoke Veil:** Drops a flash-smoke canister. Breaks boss target tracking and grants +50% Crit Chance on the next hit.
12. **Grapple Tether:** Fires a high-tension cable. Pulls player instantly to a platform/pillar to escape ground hazards, or pulls sabotage minions into danger.

### D. Divine Stigmas (Ultimate Moves — Requires 100% Stigma Meter)
13. **Heaven's Retribution (Archangel of Justice):** A colossal holy greatsword impales the boss from the clouds, clearing all arena debuffs.
14. **Ruyi Jingu Bang (Monkey King):** A giant golden staff crashes down from the heavens, crushing all minions and staggering the boss for 3 turns.
15. **Black Flame Annihilation (Abyssal Dragon):** Ignites the arena in cursed black fire, dealing 35% boss HP over 4 turns (disables player healing).
16. **Secretive Strike (Secret Watcher):** Teleports silently behind the boss's weak spot, delivering guaranteed critical execution damage.

---

## 3. Elemental Reaction Matrix

* **Wet (Flooded City) + Lightning (Volt Arc / Tempest Surge):** Triggers **Superconductive Shock** (+50% bonus AoE damage + 1 turn paralysis).
* **Wet (Flooded City) + Ice (Glacial Aegis):** Triggers **Deep Freeze** (locks boss in ice for 1 turn).
* **Parry (Kinetic Deflector) + Heavy Strike (Kinetic Breaker):** Triggers **Armor Shatter** (empties 50% of the boss's stagger bar).

---

## 4. The 3 Sabotage Hazards (Option B)

During 1v1 Duels, players spend their Sabotage Bar (filled by combos, dodges, and parries) to disrupt their opponent's mirror arena:

1. **Debris Barrage (40 Sabotage Energy):** Triggers a ceiling cave-in or lightning strike across 2 lanes in the opponent's arena, forcing an emergency evade.
2. **Spawn Shadow Minion (70 Sabotage Energy):** Summons an aggressive elite minion on the opponent's screen that intercepts attacks and shields the boss.
3. **Probability Overload (100 Sabotage Energy):** Spikes the opponent's Probability Heat Meter by **+35%**, accelerating them toward a cosmic backlash!

