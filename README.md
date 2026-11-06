# 🌌 StarStream Arena (스타 스트림 아레나)

> **Esports-grade, spectator-driven battle arena on Solana.**  
> *Inspired by the cosmic stream of Omniscient Reader’s Viewpoint (ORV).*

[![Solana Devnet](https://img.shields.io/badge/Solana-Devnet-14F195?logo=solana&style=for-the-badge)](https://api.devnet.solana.com)
[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?logo=react&style=for-the-badge)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&style=for-the-badge)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.3.6-646CFF?logo=vite&style=for-the-badge)](https://vitejs.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.0-38B2AC?logo=tailwindcss&style=for-the-badge)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Target Hackathon:** MLH Solana Hackathon (Nov 6–8, 2026)  
**Official Repository:** [https://github.com/Supersaiyan101/StarsStreamArena](https://github.com/Supersaiyan101/StarsStreamArena)

---

## 📖 Executive Summary & Thesis

Traditional Web3 gaming suffers from two fatal flaws: **predatory pay-to-win economies** and **passive, boring spectator models**. Meanwhile, traditional esports streaming forces viewers onto third-party tipping overlays that are completely disconnected from the actual gameplay loop.

**StarStream Arena** solves this by transposing the narrative tension of *Omniscient Reader's Viewpoint* onto Solana's high-speed blockchain:

1. **Symmetrical Fair-Play (100% Anti-Pay-to-Win):** In 1v1 Duels, both combatants are deployed into identical, parallel instances of the exact same scenario with identical boss health pools, telegraph timings, and environmental modifiers. Stat budgets are strictly capped at **30 Attribute Points** with standardized circuit stakes (Bronze, Silver, Gold).
2. **Cross-Arena Sabotage:** Combatants build combo momentum to unleash real-time hazards on the opponent's screen (falling subway debris, minion shields, or Probability Heat overloads).
3. **The Constellation Spectator Economy:** Spectators aren't NPCs—they are real Web3 users who connect via Solana wallet, forge their own custom Constellation monikers (e.g. `[The Constellation 'Midnight Code Raider']`), choose celestial aura ranks, and send live micro-SOL tips directly to players during clutch moments with sub-second finality.

---

## 🕹️ System Architecture

```
                                  🌌 STAR STREAM ARENA
                                           │
         ┌─────────────────────────────────┴─────────────────────────────────┐
         │                                                                   │
 ⚔️ CHALLENGER (PLAYER 1)                                            👁️ SPECTATORS (CONSTELLATIONS)
   - 30-Pt Equalized Attribute Allocation                              - Solana Devnet Wallet Connect
   - 5-Card Deck (Dynamic 3-Card Draw)                                - Custom Moniker & Celestial Aura
   - Real-time Telegraph Counters (Jump/Slide/Parry)                   - Live Stream Chat & Micro-Tipping
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
Bosses announce deadly attacks with high-visibility color-coded telegraph zones:
* 🔴 **Red Telegraph (Seismic Ground Slam / River Surge):** Requires **JUMP** or *Way of the Wind*.
* 🔵 **Blue Telegraph (Pneumatic Bull Rush / Bio-Plasma Discharge):** Requires **PARRY** (*The Fourth Wall*). Reflects 50% damage back and shatters poise!
* 🟡 **Yellow Telegraph (Girder Sweep / Serpent Tail Cleave):** Requires **CROUCH / SLIDE** (*Shadow Camouflage*).

### 3. Dynamic 3-Card Skill Hand
To eliminate spamming single overpowered skills, players equip a **5-card Combat Deck** in the Armory. Every round, the Overseer draws **3 active cards** into the player's hand. High-tier moves consume Probability Heat and Energy, requiring careful rotation.

### 4. Cross-Arena Sabotage Launcher
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
| **The Star Stream (스타 스트림)** | **Star Stream Hub** | Universal cosmic streaming network connecting combat instances to live viewers. |
| **Constellations (성좌)** | **Live Viewers (Web3 Users)** | Real Solana wallet users who set custom monikers, pick celestial aura colors, and send SOL tips. |
| **Dokkaebi (도깨비 - Bihyung)** | **Channel Arbiter AI** | Autonomous host managing Channel #BI-7623, narrating combat, and enforcing scenarios. |
| **Coins (코인)** | **SOL (Devnet)** | Universal currency for circuit stakes, gear purchases, and live audience tips. |
| **Probability (개연성)** | **Probability Heat (0-100%)** | Narrative plausibility meter. Reaching 100% triggers a catastrophic cosmic lightning backlash. |
| **Dokkaebi Bag (도깨비 보따리)** | **Star Stream Armory** | Equipment terminal where fighters allocate 30 stat points and equip relics. |
| **Fables / Stories (설화)** | **Star Archive** | On-chain historical battle records and verified replay ledger. |

### The 5 Canonical Divine Stigmas (Ultimates):
1. **Stigma: Hellfire (지옥염화):** Bestowed by *Demon-like Judge of Fire* (Archangel Uriel). Purges all debuffs and scorches the boss with radiant holy flames of Eden.
2. **Stigma: Ruyi Jingu Bang (여의봉):** Bestowed by *Prisoner of the Golden Headband* (Sun Wukong). Golden pillar crashes down, obliterating enemy poise and guaranteeing a 2-turn boss stagger.
3. **Stigma: Black Flame Annihilation (흑염 멸살):** Bestowed by *Abyssal Black Flame Dragon*. Engulfs the arena in cursed dark fire, dealing 35% boss max HP over 4 turns.
4. **Stigma: Calculated Abyss (계산된 심연):** Bestowed by *Secretive Plotter*. Teleports through the dimensional seam for an unblockable 100% Critical execution strike.
5. **Stigma: Song of the Sword (칼의 노래):** Bestowed by *Maritime War God* (Admiral Yi Sun-sin). Sweeping naval sword aura granting +50% attack damage and knockback immunity when low on HP.

---

## 💎 Why Solana?

* **Sub-Second Finality (~400ms):** Combat in StarStream Arena runs at 60 FPS. Micro-tips and circuit settlements must register instantaneously without interrupting player combos.
* **Micro-Cent Transaction Fees (< $0.00025):** Tipping a fighter `0.001 SOL` (~$0.18) would be impossible on high-gas networks where gas fees exceed the tip. Solana enables true friction-free micro-patronage.
* **On-Chain Verifiability:** Every tip and circuit match settlement produces a valid Base58 transaction hash viewable on the official Solana Explorer.

---

## 🔊 Procedural Web Audio API Sound Engine

StarStream Arena features a zero-dependency, pure procedural Web Audio API synthesizer in `src/utils/audioService.ts`:
* **Blade Slashes:** Filtered high-speed frequency drops for sword arts.
* **The Fourth Wall Clang:** High-resonance multi-harmonic chime for perfect parries.
* **Way of the Wind Woosh:** Bandpass filtered noise sweeps for telegraph evasions.
* **Coin Tip Jingle:** Dual-tone high-frequency arpeggio (B5 -> E6) on spectator tips.
* **Warning Alarm Siren:** Pulsing emergency klaxon for boss enrage and Ghost Express hazards.
* **Stigma Cast:** Deep sub-bass boom followed by celestial triad resonance.
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
