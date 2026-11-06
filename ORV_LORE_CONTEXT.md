# 🌌 StarStream Arena — Game Lore & System Reference Guide

> **Purpose:** This reference document maps canonical concepts from *Omniscient Reader's Viewpoint* (ORV) directly into game mechanics, combat state, and Web3 architecture for **StarStream Arena**.

---

## 1. Core Lore & Metaphor Mapping

| Canonical Lore Concept | StarStream Arena Equivalent | In-Game Mechanics & Role |
| :--- | :--- | :--- |
| **The Star Stream** | **The Star Stream** | The universal cosmic streaming broadcast network. Connects player combat instances to the global spectator lobby. |
| **Constellations** | **Constellations (Spectators / Users)** | Connected Solana wallet users watching matches from the heavens. They place circuit wagers, tip fighters with micro-SOL, and bestow Stigmas. |
| **Dokkaebi (Bihyung)** | **The Overseer / Channel Arbiter** | Autonomous AI host managing Channel #BI-7623. Enforces scenarios, handles the escrow vault, triggers flash polls, and narrates combat. |
| **Incarnations** | **Challengers / Fighters** | The mortal combatants entering the arena scenarios. Players who allocate 30 stat points and equip custom 5-skill decks. |
| **Coins** | **SOL (Devnet)** | The universal currency of the Star Stream. Used to pay circuit stakes, purchase gear in the Dokkaebi Bag, and send live tips. |
| **Probability** | **Probability Heat Meter (0-100%)** | Narrative plausibility meter. Big attacks and divine interventions spike Probability Heat; hitting 100% causes a Cosmic Backlash. |
| **Dokkaebi Bag** | **The Supply Vault / Dokkaebi Bag** | The pre-game armory shop where fighters equip star relics, skills, and consumable ampoules before entering the scenario. |
| **Stigmas** | **Divine Stigmas (Ultimates)** | Miraculous signature powers granted by sponsor constellations (Hellfire, Heavenly Pillar, Black Flame, etc.). |
| **Fables / Stories** | **Chronicles (Fables)** | On-chain metadata records minted as transaction receipts when a scenario is cleared with high style. |

---

## 2. The Constellations: Personalities, Stigmas & Chat Messages

In the live Star Stream chat, the following Constellations react dynamically to combat events:

### 1. **Demon-like Judge of Fire** (Archangel Uriel / Eden Nebula)
* **Personality:** Loves justice, camaraderie, and emotional drama. Hates underhanded tricks and poison.
* **Signature Stigma:** **"Hellfire"** — Cleanses all poison/burn debuffs from the user and engulfs the boss in holy flame.
* **Chat Messages:**
  * `[The Constellation 'Demon-like Judge of Fire' is clutching her cheeks with excitement!]`
  * `[The Constellation 'Demon-like Judge of Fire' sheds tears at your unbreakable resolve!]`
  * `[The Constellation 'Demon-like Judge of Fire' sponsored you 0.002 SOL!]`

### 2. **Prisoner of the Golden Headband** (Sun Wukong / Great Sage Equal to Heaven)
* **Personality:** Impulsive, fierce, loves rapid combos, aggressive pressure, and staff combat. Gets bored by passive turtles.
* **Signature Stigma:** **"Heavenly Pillar" (Ruyi Jingu Bang)** — A colossal golden staff crushes down from the clouds, shattering the boss's stagger shield for 2 turns.
* **Chat Messages:**
  * `[The Constellation 'Prisoner of the Golden Headband' is picking his ear in amusement.]`
  * `[The Constellation 'Prisoner of the Golden Headband' leaps with joy at your 6-hit combo!]`
  * `[The Constellation 'Prisoner of the Golden Headband' sponsored you 0.005 SOL!]`

### 3. **Abyssal Black Flame Dragon** (Black Cloud Nebula)
* **Personality:** Chuunibyou, edgy, loves destructive violence, dark elements, and reckless high-risk plays.
* **Signature Stigma:** **"Black Dragon Flame"** — Engulfs the arena in cursed dark dragonfire, dealing 35% boss HP over 4 turns, but drains 5% of user's HP per turn.
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

### 5. **Maritime War God** (Admiral Yi Sun-sin / Naval Grade)
* **Personality:** Stoic, honorable, unyielding defender. Gives buffs when the user fights at low health against overwhelming odds.
* **Signature Stigma:** **"Song of the Sword"** — When HP is below 30%, gain +50% Attack Damage and immunity to knockback for 2 turns.
* **Chat Messages:**
  * `[The Constellation 'Maritime War God' stands tall at your refusal to surrender.]`
  * `[The Constellation 'Maritime War God' remembers the battles of the past and bestows his blessing.]`

---

## 3. Weapons & Star Relics

Fighters in the Armory equip weapons inspired by famous star relics:

1. **Unbroken Faith:**
   * *Lore:* The pristine white blade capable of channeling Ether into razor-sharp energy waves.
   * *In-Game Perk:* Channels **Ether Blade**; converts 20% of physical damage into energy damage and increases Sabotage Energy gain rate by +15%.
2. **Four Tiger Exorcism Sword:**
   * *Lore:* The legendary constellation exorcism sword inscribed with celestial tiger runes.
   * *In-Game Perk:* Deals +25% bonus damage against Calamity Bosses; high critical strike multiplier.
3. **White Star Fluid Dagger:**
   * *Lore:* Concentrated starlight forged into a dagger. Blistering strike velocity.
   * *In-Game Perk:* Every 3rd basic attack strikes twice.
4. **Infinite Space Trench Coat:**
   * *Lore:* The iconic black trench coat of the Star Stream. Its inner lining connects to pocket dimensions.
   * *In-Game Perk:* Reduces incoming critical damage by 30% and adds +35 starting shield HP.

---

## 4. Iconic Combat Skills & Arts

* **The Fourth Wall [Tactical]:**
  * Deadens psychological recoil and physical shock. Perfectly counters blue piercing attacks.
* **Electrification [Elemental]:**
  * Surrounds the challenger in blue high-frequency lightning sparks. Attack speed +40%, attacks inflict Shock.
* **Way of the Wind [Tactical]:**
  * Ancient wind traversal technique. Player phases through reality, evading red/ground telegraph attacks.
* **Ether Blade Cleave [Melee]:**
  * Extends weapon reach with a glowing energy aura. Rapid combo slashes.
* **Red Phoenix Lunge [Melee]:**
  * High-speed piercing lunge that ignores 50% of the target's armor.

---

## 5. UI Banners & Blue Window Notification Strings

All UI prompts, banners, and Overseer notices emulate the iconic blue holo-window notifications:

* **Channel Entry:**
  * `[You have entered Star Stream Channel #BI-7623.]`
  * `[The scenario has commenced. Please survive the calamity.]`
* **Constellation Reactions:**
  * `[The Constellations are holding their breath at your evasion!]`
  * `[A constellation who enjoys high-stakes duels has entered the stream.]`
* **Dokkaebi Overseer Alerts:**
  * `[The Overseer laughs at the rising chaos in Channel A.]`
  * `[The Overseer has activated the Ghost Express hazard!]`
* **100% Heat (Cosmic Backlash):**
  * `[WARNING: PROBABILITY AFTERSHOCK TRIGGERED!]`
  * `[The sky splits, and a cosmic lightning strike hits the arena dealing heavy true damage to all units.]`
