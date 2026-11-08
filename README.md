# 🌌 StarStream Arena

> **Esports-grade, spectator-driven battle arena on Solana.**  
> *Inspired by The Manhwa Omniscient Reader’s Viewpoint (ORV).*

[![Solana Devnet](https://img.shields.io/badge/Solana-Devnet-14F195?logo=solana&style=for-the-badge)](https://api.devnet.solana.com)
[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&style=for-the-badge)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&style=for-the-badge)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.3.6-646CFF?logo=vite&style=for-the-badge)](https://vitejs.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0-38B2AC?logo=tailwindcss&style=for-the-badge)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Target Hackathon:** MLH Solana Hackathon (Nov 6–8, 2026)  
**Official Repository:** [https://github.com/Supersaiyan101/StarsStreamArena](https://github.com/Supersaiyan101/StarsStreamArena)

---

## 💡 The Origin And Motivation: Why I Built StarStream Arena

> *"There are three ways to survive in a ruined world. Now, I have forgotten a few, but one thing is certain: the fact that you who are reading this will survive."*  
> — **Omniscient Reader’s Viewpoint**

### 🗡️ 1. The Narrative Spark: Bringing ORV to Life
For years, reading *Omniscient Reader’s Viewpoint* (ORV) captured my imagination like nothing else. The premise is unforgettable: everyday reality is suddenly hijacked by the **Star Stream**, an apocalyptic cosmic livestream broadcast across dimensions by eccentric Dokkaebi arbiters. Humans become **"Incarnations"** thrust into life or death scenarios, while omnipotent celestial deities **"The Constellations"** gaze down from the heavens, bickering in live chat, demanding high stakes drama, and sponsoring their favorite fighters with Coins.

Yet in traditional gaming and Web3, this spectator performer dynamic has remained completely untapped. Viewers are relegated to static third party chat overlays, while games themselves are bogged down by cynical pay to win economics. 

I set out to build the game I always wished existed: an arena where the lore isn't decorative fluff, but the actual heartbeat of the game. Where **spectators are genuine on chain Constellations**, where **Probability Heat** punishes over reliance on divine intervention, and where every player competes under strict, uncompromised fair play rules.

### 🎮 2. The Mechanical Soul: Nostalgia for Classic Handheld Pokémon Battles
Growing up playing classic Game Boy Advance and Nintendo DS Pokémon games (*Emerald*, *FireRed*, *Platinum*, *HeartGold*), I fell in love with the pure psychological tension of turn based tactical combat:
* **The 4 Move Tactical Kit:** You don't have endless hotbars. You get exactly 4 moves. Success requires balance: a reliable **STRIKE**, a calculated **SETUP / BUFF**, an emergency **PRIORITY / INTERRUPT**, and a fight ending **STIGMA ULTIMATE**.
* **Speed Initiative:** Turn order isn't arbitrary. Your Agility stat dictates who strikes first, meaning a fragile assassin can execute a boss before taking lethal damage, provided they build enough speed.
* **Elemental Counters & Matchups:** Landing a **Super Effective (2.0x)** counter against a boss's elemental affinity turns an impossible battle winnable, while hitting into a **0.5x Resistance** will cost you the match.
* **Status Ailments & Attrition:** Inflicting Burn, Bleed, Paralysis speed debuffs, or Concussion flinches forces players to think several turns ahead.

**The Hybrid Evolution:** In StarStream Arena, I took that nostalgic turn based chess match and fused it with **real time time attack reaction mechanics**. When a boss prepares a devastating strike, time doesn't freeze: a **1.8 second reaction fuse** burns down in real time! Players must recognize the color coded telegraph and instantly hit `W` to Jump, `S` to Slide, or `Space` to summon *The Fourth Wall* for a precision parry. If the fuse expires, you take the full brunt of the calamity.

### ⚡ 3. The Superpower: Why Solana Made This Possible
A high stakes, spectator driven arena requires a blockchain that can keep up with the adrenaline of live esports. High gas fees and slow confirmations would completely destroy this vision:
* **Sub Second Finality (~400ms):** When a player executes a miraculous clutch parry at 5% HP and a live spectator in the chat tips `0.002 SOL`, that tip confirms on chain before the next turn even begins!
* **Sub Cent Micro Transactions (< $0.00025):** Tipping a few cents or micro SOL is economically impossible on Ethereum or L2s where gas exceeds the tip itself. Solana makes micro patronage instantaneous, frictionless, and fun.
* **Provable Fair Play Escrow:** In 1v1 Twin Duels, both players lock matching circuit stakes into a decentralized Solana escrow vault. The instant the Dokkaebi arbiter declares a victor, the smart settlement releases the 2x pot to the winner with verifiable on chain transparency.

Solana isn't an afterthought or an add on badge here: **Solana IS the real world Star Stream.**

---

## 📖 Executive Summary & Thesis

Traditional Web3 gaming suffers from two fatal flaws: **predatory pay to win economies** and **passive, boring spectator models**. Meanwhile, traditional esports streaming forces viewers onto third party tipping overlays that are completely disconnected from the actual gameplay loop.

**StarStream Arena** solves this by transposing the narrative tension of *Omniscient Reader's Viewpoint* and classic turn based tactics onto Solana's high speed blockchain:

1. **Symmetrical Fair Play (100% Anti Pay to Win):** In 1v1 Duels, both combatants are deployed into identical, parallel instances of the exact same scenario with identical boss health pools, telegraph timings, and environmental modifiers. Stat budgets are strictly capped at **30 Attribute Points** with standardized circuit stakes (Bronze, Silver, Gold).
2. **Cross Arena Sabotage:** Combatants build combo momentum to unleash real time hazards on the opponent's screen (falling subway debris, minion shields, or Probability Heat overloads).
3. **The Constellation Spectator Economy:** Spectators aren't NPCs, they are real Web3 users who connect via Solana wallet, forge their own custom Constellation monikers (e.g. `[The Constellation 'Midnight Code Raider']`), choose celestial aura ranks, and send live micro SOL tips directly to players during clutch moments with sub second finality.

---

## 🕹️ System Architecture

```
                                  🌌 STAR STREAM ARENA
                                           │
         ┌─────────────────────────────────┴─────────────────────────────────┐
         │                                                                   │
 ⚔️ CHALLENGER (PLAYER 1)                                            👁️ SPECTATORS (CONSTELLATIONS)
   - 30-Pt Equalized Attribute Allocation                              - Solana Devnet Wallet Connect
   - 4-Move Tactical Console (Strike, Setup, Priority, Stigma)         - Custom Moniker & Celestial Aura
   - Speed Initiative & Real-time Telegraph Counters                   - Live Stream Chat & Micro-Tipping
         │                                                                   │
         │  Combos, Dodges & Stagger                                         │  0.001 - 0.005 SOL Tips
         ▼                                                                   ▼
┌─────────────────────────────────┐                                ┌─────────────────────────────────┐
│     PARALLEL SCENARIO ENGINE     │ ◄───── Cross-Arena Sabotage ──── │      SOLANA DEVNET ESCROW       │
│  - Channel A: Player 1 Arena    │      (Debris, Minions, Heat)   │  - Circuit Stake Vault (2x Pot) │
│  - Channel B: Mirrored Opponent │                                │  - Instant Settlement Pipeline  │
│  - 60 FPS HTML5 Canvas + SFX    │ ───── Live Broadcast Feed ────► │  - Micro-Tip Direct Routing     │
└─────────────────────────────────┘                                └─────────────────────────────────┘
```

---

## ⚡ Core Game Mechanics

### 1. Mirrored Parallel Twin Arenas
* **Channel A (You) vs Channel B (Opponent):** Both players face identical copies of the scenario calamity.
* **Two Modes:**
  * **Solo Scenario Trial:** Race against the clock, chain combos, trigger interactive props, and climb the Star Archive leaderboard while spectators tip your run.
  * **1v1 Symmetrical Duel:** First player to defeat the boss OR last player standing wins the escrow match pot! Both players keep 100% of audience tips earned during combat.

### 2. Boss Telegraph & Counter System
Bosses announce deadly attacks with high-visibility color coded telegraph zones:
* 🔴 **Red Telegraph (Seismic Ground Slam / River Surge):** Requires **JUMP** or *Way of the Wind*.
* 🔵 **Blue Telegraph (Pneumatic Bull Rush / Bio-Plasma Discharge):** Requires **PARRY** (*The Fourth Wall*). Reflects 50% damage back and shatters poise!
* 🟡 **Yellow Telegraph (Girder Sweep / Serpent Tail Cleave):** Requires **CROUCH / SLIDE** (*Shadow Camouflage*).

### 3. Pokémon Inspired 4 Move Tactical Console & Speed Initiative
Every combatant wields a 4 move tactical loadout with distinct roles:
* **[1] STRIKE:** Primary damage attack with high critical hit rates.
* **[2] SETUP / BUFF:** Tactical preparation (e.g. *Song of the Sword* +60% ATK, *Pure Steel* +80 Shield, or *Avatar Decoy* clone).
* **[3] PRIORITY / DISRUPT:** `⚡ +1 Priority` strikes that outspeed opponents, or `-1 Priority` reactive counters (*The Fourth Wall* reflecting 150% damage back).
* **[4] STIGMA ULTIMATE:** Calamity tier divine fable unlocked at 100% Stigma meter (*Stigma: Hellfire*, *Black Dragon Flame*).
* **Type Effectiveness & Status Ailments:** Hitting boss elemental weaknesses deals **2.0x Super Effective** damage (0.5x if resisted). Inflicts status ailments like Burn, Bleed, Paralyze, and Concussion flinches.
* **Speed Initiative:** Priority brackets resolve first; equal priority compares Challenger Agility vs. Boss Speed.

### 4. Cross Arena Sabotage Launcher
Performing combos and parries fills your **Sabotage Bar (0–100 Energy)**:
1. **Debris Barrage (40 Energy):** Triggers a ceiling cave-in or lightning strike across 2 lanes on the opponent's screen.
2. **Spawn Calamity Minion (70 Energy):** Summons an aggressive elite minion that intercepts attacks and shields the opponent's boss.
3. **Probability Overload (100 Energy):** Spikes the opponent's Probability Heat Meter by **+35%**, accelerating them toward a cosmic backlash!

### 5. Probability Heat & Cosmic Backlash
Every skill and divine miracle consumes narrative plausibility. If your Heat Meter hits **100%**, a **Cosmic Backlash** strikes the arena, raining down true lightning damage on all entities.

---

## 📜 Canonical ORV Lore to Mechanics Matrix

| Canonical ORV Concept | StarStream Arena Equivalent | In-Game Mechanics & Role |
| :--- | :--- | :--- |
| **The Star Stream** | **Star Stream Hub** | Universal cosmic streaming network connecting combat instances to live viewers. |
| **Constellations** | **Live Viewers (Web3 Users)** | Real Solana wallet users who set custom monikers, pick celestial aura colors, and send SOL tips. |
| **Dokkaebi (Bihyung)** | **Channel Arbiter AI** | Autonomous host managing Channel #BI-7623, narrating combat, and enforcing scenarios. |
| **Coins** | **SOL (Devnet)** | Universal currency for circuit stakes, gear purchases, and live audience tips. |
| **Probability** | **Probability Heat (0-100%)** | Narrative plausibility meter. Reaching 100% triggers a catastrophic cosmic lightning backlash. |
| **Dokkaebi Bag** | **Star Stream Armory** | Equipment terminal where fighters allocate 30 stat points and equip relics. |
| **Fables / Stories** | **Star Archive** | On-chain historical battle records and verified replay ledger. |

### The 5 Canonical Divine Stigmas (Ultimates):
1. **Stigma: Hellfire:** Bestowed by *Demon-like Judge of Fire* (Archangel Uriel). Purges all debuffs and scorches the boss with radiant holy flames of Eden.
2. **Stigma: Heavenly Pillar:** Bestowed by *Prisoner of the Golden Headband* (Sun Wukong). Golden pillar crashes down, obliterating enemy poise and guaranteeing a 2-turn boss stagger.
3. **Stigma: Black Dragon Flame:** Bestowed by *Abyssal Black Flame Dragon*. Engulfs the arena in cursed dark fire, dealing 35% boss max HP over 4 turns.
4. **Stigma: Calculated Abyss:** Bestowed by *Secretive Plotter*. Teleports through the dimensional seam for an unblockable 100% Critical execution strike.
5. **Stigma: Song of the Sword:** Bestowed by *Maritime War God* (Admiral Yi Sun-sin). Sweeping naval sword aura granting +50% attack damage and knockback immunity when low on HP.

---

## 💎 Why Solana? (The Technological Backbone)

StarStream Arena was engineered from the ground up to take full advantage of Solana's unique architectural strengths:

* **⚡ Sub Second Finality (~400ms):** Combat in StarStream Arena is high octane and fast paced. When spectators react to a buzzer beater survival parry, micro tips and circuit settlements register and confirm on chain before the next battle turn resolves.
* **🪙 Sub Cent Micro Transactions (< $0.00025):** Micro patronage is the core economic engine of the Star Stream. Sponsoring an Incarnation with `0.001 SOL` (~$0.18) is completely unfeasible on high gas networks where gas fees dwarf the tip. Solana enables true friction free micro donations.
* **🔐 Zero Friction Web3 Onboarding:** The game integrates `@solana/web3.js` with dual mode wallet support:
  * Connect seamlessly with browser extension wallets (**Phantom**, **Solflare**).
  * Instant automatic in-memory Devnet keypair generation for instant guest onboarding with zero barrier to entry.
  * Built-in **+1 SOL Devnet Faucet** inside the Constellation Studio to fund tipping immediately.
* **🔍 100% On-Chain Verifiability:** Every spectator tip and 1v1 circuit match escrow settlement produces a valid cryptographic Base58 transaction signature, with clickable deep links straight to the official [Solana Devnet Explorer](https://explorer.solana.com/?cluster=devnet).

---

## 🔊 Procedural Web Audio API Sound Engine

StarStream Arena features a zero dependency, pure procedural Web Audio API synthesizer in `src/utils/audioService.ts`:
* **Blade Slashes:** Filtered high speed frequency drops for sword arts.
* **The Fourth Wall Clang:** High resonance multi harmonic chime for perfect parries.
* **Way of the Wind Woosh:** Bandpass filtered noise sweeps for telegraph evasions.
* **Coin Tip Jingle:** Dual tone high frequency arpeggio (B5 -> E6) on spectator tips.
* **Warning Alarm Siren:** Pulsing emergency klaxon for boss enrage and Ghost Express hazards.
* **Stigma Cast:** Deep sub bass boom followed by celestial triad resonance.
* **Audio Controller:** Floating toggle pill (`SFX ACTIVE` / `SFX MUTED`) in the UI.

---

## 🚀 Quickstart & Local Installation

### Prerequisites
* Node.js v18+ installed
* Modern Web Browser (Chrome / Brave / Edge / Firefox)
* Optional: Phantom or Solflare wallet browser extension (app includes automatic Devnet keypair fallback)

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/Supersaiyan101/StarsStreamArena.git
cd StarsStreamArena

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Visit `http://localhost:5173` to enter the Star Stream!

### Testing the Experience (Judge Evaluation Guide)
1. **Armory & Customization:**
   * Allocate your 30 Attribute Points (STR, AGI, RES) and watch real-time damage and speed stats update.
   * Pick your Avatar Archetype (*Blade Disciple*, *Shadow Rogue*, *Titan Vanguard*).
   * Customize your 5-Skill Deck with canonical ORV arts and Stigmas.
   * Equip Star Relics (*Unbroken Faith*, *Four Tiger Sword*, *Space Coat*).
2. **Constellation Studio:**
   * Click **"Constellation Profile"** in the top navigation bar.
   * Enter your custom Moniker (e.g. `[The Constellation 'Midnight Sovereign']`) and select your Celestial Aura rank.
   * Click **"+1 SOL Airdrop (Devnet Faucet)"** to fund your wallet.
3. **Solo Scenario Trial:**
   * Deploy into **Subterranean Metro (Line 3)** or **Han River Crossing (Mapo Bridge)**.
   * React to boss telegraphs with Jump, Crouch, and The Fourth Wall Parry.
   * Interact with props (Overheated Steam Valves, Electrified Rails, Cargo Platforms).
4. **1v1 Symmetrical Twin Duel:**
   * Stake your circuit entry (Bronze, Silver, or Gold).
   * Watch parallel Channel A vs Channel B side-by-side.
   * Fill your Sabotage Bar and launch **Debris Barrage**, **Spawn Minion**, or **Probability Overload** into Channel B!
   * Use the **Stream Chat** to quick-tip fighters (`+0.001 SOL`, `+0.002 SOL`, `+0.005 SOL`) and click the transaction hash to inspect on the Solana Devnet Explorer!
   * Finish the match to trigger instant escrow pot settlement and celebratory victory confetti.

---

## 🗺️ The Expansion Blueprint: From Hackathon Foundation to a Living Universe

> *"Right now, I have forged the unbreakable iron frame. But upon this frame, a whole kingdom will be built."*

### 👑 The Builder’s Pledge & Hackathon Reality
Building a game that bridges **high speed on chain mechanics**, **classic Pokémon turn based tactical chess**, and the **cosmic lore of Omniscient Reader’s Viewpoint** in a short hackathon was an intense, high wire sprint. 

I know the game currently lacks certain luxuries: animated multi frame sprites for every single attack, full voice acting, and expansive multi chapter campaigns. But what exists today is **not a concept mockup or a faked video demo, it is a live, working, production grade battle engine**:
* 4 move tactical console with Speed initiative and real time elemental calculations.
* Real time 1.8s time attack boss reaction fuse with QTE parrying and evasion.
* Symmetrical twin duels with live cross arena sabotage hazards.
* Zero friction `@solana/web3.js` wallet connectivity and instant micro SOL tipping on Devnet.

The foundation is rock solid. With the core mechanics locked in, here is my roadmap for turning StarStream Arena into a full scale gaming universe:

---

### 🗡️ 1. Iconic New Characters & Bespoke Character Design
* **Bespoke Character Rosters:** Expanding beyond initial archetypes into deeply characterized Incarnations inspired by the webnovel's iconic heroes, each with unique signature stances, pixel art attack animations, and custom audio cues:
  * **The Regressor (*Yoo Joonghyuk*):** High risk, high damage duelist wielding *Breaking the Sky Swordsmanship* and life leech parries.
  * **The Puppeteer (*Han Sooyoung*):** Tactical trickster who summons autonomous Avatar clones, feints attacks, and wields *Abyssal Black Flame*.
  * **The Weaver of Fates (*Yoo Sangah*):** Agility focused controller weaving Olympus *Hermes Threads* to bind enemy speed and alter turn initiative.
  * **The Pure Steel Bastion (*Lee Hyunsung*):** Impenetrable tank with *Great Mountain Push* and physical reflection shields.
* **Character Progression & Skill Trees:** Allocate attribute points and unlock branching move variants to customize each character's combat identity.

---

### 📖 2. Deep Offline Story Campaign (Scenario Mode)
* **Faithful Narrative Adaptation:** A fully fleshed out single player offline campaign starting from **Subway Car 3807**, escaping through the **Mapo Bridge Sea Serpent Crossing**, and surviving the **Chungmuro Station Green Zone Crisis**.
* **Visual Novel Dialogue & Dokkaebi Decisions:** Rich narrative cutscenes with Bihyung and Constellations where your dialogue choices, moral dilemmas, and combat performance dictate which Constellation offers you a sponsor contract.
* **Zero Barrier to Entry:** Playable 100% offline with zero wallet or internet requirement, saving progress to local storage with seamless on chain synchronization whenever the player chooses to take their Incarnation to the online arena.

---

### ⚔️ 3. Deepening & Refining Combat Mechanics
* **Elemental Reaction Synergies:** Taking inspiration from Pokémon and classic tactical RPGs to introduce multi element interactions:
  * *Flame + Wind:* Spawns a raging firestorm dealing area of effect damage over time.
  * *Psychic + Stealth:* Creates a phantom mind feint that completely inverts the boss's telegraph colors.
  * *Physical + Paralyze:* Guarantees a critical poise break, staggering bosses for an extra turn.
* **Dynamic Weather & Environmental Calamities:** Arenas with changing conditions—rising water levels that amplify electric attacks, toxic spore clouds that inflict ticking poison, and falling debris fields that alter lane mobility.
* **Expanded Reaction Hotkeys & Counter-Attacks:** Adding directional dash counters, aerial juggles, and multi beat QTE sequences for climactic multi phase boss moves.

---

### 🏟️ 4. Expanding the Scenario Catalog (Canonical Arenas & Bosses)
* **🚇 Scenario #03 — Chungmuro Station ("Green Zone Survival"):** Expanding toxic fog forces players into shrinking green sanctuary zones while fending off the *Grade 6 Underground King*.
* **🏰 Scenario #08 — Dark Castle ("Ascension Tower"):** Multi floor vertical boss gauntlet racing against the clock.
* **⚡ Scenario #10+ — Gigantomachia ("Olympus Titan Raid"):** Epic multi limb raid against colossal mythical titans requiring limb breaking and coordinated Stigma strikes.
* **🏭 The 73rd Demon Realm ("Industrial Complex"):** Moving conveyor belts, molten slag hazards, and partisan guerrilla skirmishes.

---

### 🌐 5. Multiplayer Evolution: 3v3 Squad Duels & Nebula Guilds
* **3v3 Parallel Tri-Duels:** Symmetrical 3 lane parallel arenas (Vanguard, Striker, and Support) where teammates can channel energy across channels or coordinate a 3 man synchronized Stigma barrage.
* **Nebula Guilds (Spectator DAOs):** Constellations band together into mythic Nebulae (*Eden*, *Olympus*, *Underworld*, *Vedas*), pooling SOL to sponsor competitive teams and earn yields from circuit championship pots.

---

### 🎨 6. Community Scenario Builder & Solana Compressed NFTs (cNFTs)
* **UGC Scenario Specification:** Community level designers can author custom bosses, telegraph sequences, and hazard parameters using verified JSON schemas, earning automated Solana creator royalties whenever their scenarios run in tournament circuits.
* **Dynamic Fable cNFTs:** Clear a scenario with an SS-Rank style rating to mint an on chain Chronicle Receipt via Solana compressed NFTs (cNFTs), capturing your match history, perfect parries, and spectator tip logs forever on the blockchain.

---

### 📱 7. Solana Mobile Stack (SMS) & Chapter 2 Native App
* **Touch Optimized Combat:** Natural swipe gestures (Swipe Up = Jump, Double Tap = Parry, Swipe Down = Slide) tailored for mobile esports on Solana Mobile Chapter 2 devices with integrated Solana Seed Vault security.

---

## 🛠️ Tech Stack & Dependencies

* **Frontend:** React 19, TypeScript, HTML5 Canvas 2D, Tailwind CSS v4, Lucide React, Canvas Confetti.
* **Web3 & Blockchain:** `@solana/web3.js` (Solana Devnet JSON-RPC, Keypairs, SystemProgram, Lamport Transfers, Explorer URL generation).
* **Audio:** Native Web Audio API procedural synthesis.
* **Build System:** Vite 8.

---

## 📜 License & Credits

* **License:** MIT License
* **Concept:** Inspired by sing N song's *Omniscient Reader's Viewpoint* (ORV).
* **Built for:** MLH Solana Hackathon (Nov 6–8, 2026).
