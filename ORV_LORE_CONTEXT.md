# 🌌 ORV Lore & System Reference Guide (StarStream Arena)

> **Purpose:** This reference document maps canonical concepts from *Omniscient Reader's Viewpoint* (ORV) directly into our game mechanics, combat state, and Web3 architecture for **StarStream Arena**.

---

## 1. Core Lore & Metaphor Mapping

| ORV Canonical Concept | StarStream Arena Equivalent | In-Game Mechanics & Role |
| :--- | :--- | :--- |
| **The Star Stream (스타 스트림)** | **The Star Stream** | The universal cosmic streaming broadcast network. Connects player combat instances to the global spectator lobby. |
| **Constellations (성좌)** | **Constellations (Spectators / Users)** | Connected Solana wallet users watching matches from the heavens. They place circuit wagers, tip fighters with micro-SOL, and bestow Stigmas. |
| **Dokkaebi (도깨비 - Bihyung)** | **The Overseer / Channel Arbiter** | Autonomous AI host managing Channel #BI-7623. Enforces scenarios, handles the escrow vault, triggers flash polls, and narrates combat. |
| **Incarnations (화신)** | **Challengers / Fighters** | The mortal combatants entering the arena scenarios. Players who allocate 30 stat points and equip custom 5-skill decks. |
| **Coins (코인)** | **SOL (Devnet)** | The universal currency of the Star Stream. Used to pay circuit stakes, purchase gear in the Dokkaebi Bag, and send live tips. |
| **Probability (개연성)** | **Probability Heat Meter (0-100%)** | Narrative plausibility meter. Big attacks and divine interventions spike Probability Heat; hitting 100% causes a Cosmic Backlash. |
| **Dokkaebi Bag (도깨비 보따리)** | **The Supply Vault / Dokkaebi Bag** | The pre-game armory shop where fighters equip star relics, skills, and consumable ampoules before entering the scenario. |
| **Stigmas (성흔)** | **Divine Stigmas (Ultimates)** | Miraculous signature powers granted by sponsor constellations (Hellfire, Somersault Cloud, Black Flame, etc.). |
| **Fables / Stories (설화)** | **Chronicles (Fables)** | On-chain metadata records minted as transaction receipts when a scenario is cleared with high style. |

---

## 2. The Constellations: Personalities, Stigmas & Chat Messages

In the live Star Stream chat, the following Constellations react dynamically to combat events:

### 1. **Demon-like Judge of Fire** (Archangel Uriel / Eden Nebula)
* **Personality:** Loves justice, camaraderie, and emotional drama. Hates underhanded tricks and poison.
* **Signature Stigma:** **"Hellfire" (지옥염화)** — Cleanses all poison/burn debuffs from the user and engulfs the boss in holy flame.
* **Chat Messages:**
  * `[The Constellation 'Demon-like Judge of Fire' is clutching her cheeks with excitement!]`
  * `[The Constellation 'Demon-like Judge of Fire' sheds tears at your unbreakable resolve!]`
  * `[The Constellation 'Demon-like Judge of Fire' sponsored you 0.002 SOL!]`

### 2. **Prisoner of the Golden Headband** (Sun Wukong / Great Sage Equal to Heaven)
* **Personality:** Impulsive, fierce, loves rapid combos, aggressive pressure, and staff combat. Gets bored by passive turtles.
* **Signature Stigma:** **"Ruyi Jingu Bang" (여의봉)** — A colossal golden staff crushes down from the clouds, shattering the boss's stagger shield for 3 turns.
* **Chat Messages:**
  * `[The Constellation 'Prisoner of the Golden Headband' is picking his ear in amusement.]`
  * `[The Constellation 'Prisoner of the Golden Headband' leaps with joy at your 6-hit combo!]`
  * `[The Constellation 'Prisoner of the Golden Headband' sponsored you 0.005 SOL!]`

### 3. **Abyssal Black Flame Dragon** (Black Cloud Nebula)
* **Personality:** Chuunibyou, edgy, loves destructive violence, dark elements, and reckless high-risk plays.
* **Signature Stigma:** **"Black Flame Annihilation" (흑염 멸살)** — Engulfs the arena in cursed dark dragonfire, dealing 35% boss HP over 4 turns, but drains 5% of user's HP per turn.
* **Chat Messages:**
  * `[The Constellation 'Abyssal Black Flame Dragon' lets out a wicked chuckle.]`
  * `[The Constellation 'Abyssal Black Flame Dragon' is satisfied by your chaotic aggression.]`
  * `[The Constellation 'Abyssal Black Flame Dragon' demands you unleash your darkest strike!]`

### 4. **Secretive Plotter** (The Unknown Observer)
* **Personality:** Cold, calculating, quiet. Watches from the deepest shadows. Appreciates strategic parries and calculated counter-strikes.
* **Signature Stigma:** **"Calculated Abyss"** — Instantly teleports behind the enemy's weak spot, guaranteeing 100% Critical execution damage.
* **Chat Messages:**
  * `[The Constellation 'Secretive Plotter' narrows his eyes at your tactical positioning.]`
  * `[The Constellation 'Secretive Plotter' nods silently at your calculated parry.]`
  * `[The Constellation 'Secretive Plotter' is quietly analyzing your probability balance.]`

### 5. **Maritime War God** (Admiral Yi Sun-sin / Korean Historical Grade)
* **Personality:** Stoic, honorable, unyielding defender. Gives buffs when the user fights at low health against overwhelming odds.
* **Signature Stigma:** **"Song of the Sword" (칼의 노래)** — When HP is below 30%, gain +50% Attack Damage and immunity to knockback for 2 turns.
* **Chat Messages:**
  * `[The Constellation 'Maritime War God' stands tall at your refusal to surrender.]`
  * `[The Constellation 'Maritime War God' remembers the battles of the past and bestows his blessing.]`

---

## 3. Weapons & Star Relics (Adapted from ORV)

Fighters in the Armory equip weapons inspired by the novel's famous star relics:

1. **Unbroken Faith (하얗게 깨지지 않는 믿음):**
   * *Lore:* Kim Dokja’s iconic sword. A pristine white blade capable of channeling Ether.
   * *In-Game Perk:* Channels **Ether Blade**; converts 20% of physical damage into energy damage and increases Sabotage Energy gain rate by +15%.
2. **Four Tiger Evil-Cutting Sword (사인참사검):**
   * *Lore:* The legendary Joseon constellation exorcism sword.
   * *In-Game Perk:* Deals +35% bonus damage against Demonic & Calamity bosses; high critical strike multiplier.
3. **White Pure Star Fluid Dagger (백청강기):**
   * *Lore:* Concentrated starlight forged into a dagger.
   * *In-Game Perk:* Blinding attack speed. Every 3rd basic attack strikes twice.
4. **Infinite Dimension Space Coat (무한 차원의 외투):**
   * *Lore:* The iconic black trench coat worn by Kim Dokja and Yoo Joonghyuk.
   * *In-Game Perk:* Expands active skill hand by +1 card during phase 2 of boss fights.

---

## 4. Iconic Combat Skills & Arts (Canonical Translations)

* **The Fourth Wall (제4의 벽) [Passive]:**
  * Deadens psychological trauma and physical recoil. Reduces maximum damage taken from single boss attacks to a cap of 25% max HP.
* **Electrification (전인화) [Skill]:**
  * The legendary lightning technique of Kyrgios Rodgraim. Surrounds the challenger in blue high-frequency lightning sparks. Attack speed +40%, attacks inflict Shock.
* **Way of the Wind (바람의 길) [Skill]:**
  * Ancient wind traversal technique. Player dashes forward leaving a wind vortex, evading all incoming attacks this turn and positioning behind the target.
* **Blade Force (검기) [Skill]:**
  * Extends weapon reach with a glowing energy aura. Basic attacks now hit both the boss and nearby sabotage minions.
* **Red Phoenix Shunpo (적봉순보) [Skill]:**
  * Flash-step teleport. Evades incoming telegraphs and triggers **"Bullet Time"** (staggers boss for 1 turn).

---

## 5. The System Window Style Guide

All UI prompts, banners, and Overseer notices should emulate the iconic ORV blue glowing system windows:

```
┌────────────────────────────────────────────────────────────────────────┐
│ [SYSTEM: Channel #BI-7623 Hosted by Dokkaebi Bihyung]                  │
│                                                                        │
│ [The 1st Scenario — 'Proof of Value' has commenced.]                   │
│ [Category: Subterranean Metro (Line 3)]                                │
│ [Difficulty: Grade 7 Calamity]                                         │
│ [Clear Condition: Slay the Gorgon Brute within the time limit.]        │
│ [Compensation: 5,000 Coins & Star Fable]                               │
│ [Failure: Elimination from the Star Stream]                            │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Probability (개연성) Spark FX Rules

* **0% - 49% Heat (Green / Stable):** Normal combat. Small sparks appear occasionally.
* **50% - 84% Heat (Yellow / Warning):** Blue probability sparks crackle around the player's weapon. The Overseer issues an audio warning.
* **85% - 99% Heat (Crimson / Critical):** Violent violet and red lightning sparks rip through the arena floor.
* **100% Heat (Cosmic Backlash):**
  * `[WARNING: PROBABILITY AFTERSHOCK TRIGGERED!]`
  * The sky splits, and a cosmic lightning strike hits the arena dealing heavy true damage to all units.

