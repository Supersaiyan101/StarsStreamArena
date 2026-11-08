# 🌌 StarStream Arena — Comprehensive Project Memory Context & System Blueprint

> **System Memory Document:** Single-source-of-truth reference covering the entire architecture, lore, mechanics, Web3 integration, UI hierarchy, and development trajectory for **StarStream Arena**.
> **Hackathon:** MLH Solana Hackathon (Nov 6–8, 2026 | Event ID: `01a0ce54-d5d4-a695-4377-b821fcd52659`)  
> **Official Repository:** [https://github.com/Supersaiyan101/StarsStreamArena](https://github.com/Supersaiyan101/StarsStreamArena)  
> **License:** MIT  

---

## 1. Executive Summary & Core Game Concept

**StarStream Arena** is an esports-grade, spectator-driven Web3 battle arena built on Solana, inspired by the seminal Korean web novel & webtoon *Omniscient Reader's Viewpoint* (ORV). 

In traditional games, spectators are passive observers. In StarStream Arena:
1. **Spectators ARE the Constellations:** Spectators connect their Solana wallets, customize their divine celestial moniker (e.g., *"Demon-like Judge of Fire"*, *"Prisoner of the Golden Headband"*, or user-chosen titles like *"Neon Phantom"*), and actively influence battles by sending micro-SOL tips and triggering divine blessings.
2. **Symmetrical Mirrored Twin Arenas:** In 1v1 duels, Player 1 (Channel A) and Opponent (Channel B) face identical boss encounters in parallel mirrored dimensions. This guarantees **100% competitive fairness** while introducing **Cross-Arena Sabotage**—players charge Sabotage Energy by executing combos and spend it to launch stage hazards, debris barrages, or shadow minions directly into their rival's arena.
3. **Dual Economic Model:**
   - **Primary Match Pot:** Winner claims the winner-takes-all circuit wager (Bronze 0.005 SOL, Silver 0.010 SOL, Gold 0.025 SOL).
   - **Audience Micro-Tips:** Both players retain 100% of live tips sent by watching Constellations during combat, verified on the Solana Devnet blockchain.

---

## 2. Technical Stack & Architecture

```
                                  [ USER BROWSER ]
                                         │
        ┌────────────────────────────────┴────────────────────────────────┐
        ▼                                                                 ▼
[ React 19 + TypeScript + Vite ]                              [ Solana Devnet Web3 ]
├── Tailwind CSS v4 styling                                   ├── Dual-Mode Wallet Adapter
├── Lucide React icon suite                                   │   ├── Phantom Browser Extension
├── Canvas Confetti particle engine                           │   └── Ephemeral Keypair Fallback
├── Web Audio API Sound Synthesizer                           ├── JSON-RPC Endpoint (api.devnet.solana.com)
│   ├── Blade slashes & parry clangs                          ├── Live Balance & Airdrop (+1 SOL)
│   ├── Alarm sirens & stigma booms                           └── Micro-Tip Escrow & Explorer Links
└── 60 FPS 2D Procedural Combat Canvas
        │
        ▼
[ Core Game Engine ]
├── Combat State Engine (utils/combatEngine.ts)
│   ├── Strict 30-Point Attribute Scaling (STR/AGI/RES)
│   ├── Dynamic 3-Card Hand Drawer from 5-Skill Deck
│   ├── Boss Telegraph & Reaction Matrix (Jump / Crouch / Parry)
│   ├── Environmental Modifiers & Interactive Props
│   └── Probability Heat & Cosmic Backlash (ORV Lore)
├── Opponent AI Engine (utils/aiOpponent.ts)
│   ├── Reactive behavior trees & combo chains
│   └── Autonomous Cross-Arena Sabotage deployment
└── Sound Synthesizer (utils/audioService.ts)
    └── Zero-asset Web Audio oscillator & filter synthesis
```

### Key Libraries & Tools:
* **Frontend:** React 19 (`react`, `react-dom`), Vite 6 (`@vitejs/plugin-react`), TypeScript 5.8 (`verbatimModuleSyntax: true`).
* **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`), standard utility classes, custom glowing glassmorphic cards.
* **Blockchain:** `@solana/web3.js` v1.98.0, standard browser `fetch` for robust JSON-RPC calls without CORS/bundler quirks.
* **Audio:** Native browser `AudioContext` Web Audio API (procedural synthesis—0 external audio files, 0 load latency, 100% offline-ready).
* **VFX:** HTML5 2D Canvas rendering with sprite transforms, procedural backgrounds, trail particles, and `canvas-confetti`.

---

## 3. ORV Canonical Lore & Metaphor Translation

StarStream Arena translates high-concept novel mechanics into intuitive, competitive game systems without requiring players to know Korean or deep lore:

| Canonical ORV Concept | Game Mechanic | In-Game Translation & Purpose |
| :--- | :--- | :--- |
| **The Star Stream** | **Live Streaming Arena** | Global esports broadcast feed connecting fighters and spectators. |
| **Constellations** | **Spectators / Bettors** | Real wallet users who watch, tip SOL, and cheer with custom titles. |
| **Dokkaebi (Bihyung)** | **Channel Arbiter / Host** | Automated referee managing Channel #BI-7623, escrow pots, and rules. |
| **Incarnations** | **Challengers (Players)** | Fighters who enter scenarios with a 30-pt stat build and 5-skill deck. |
| **Coins** | **Solana SOL** | Circuit stakes, spectator tips, and leaderboard prize pools. |
| **Probability (Gaeyeonseong)** | **Probability Heat Meter (0-100%)** | Narrative realism cost. Powerful stigmas spike heat; 100% causes Cosmic Backlash. |
| **Dokkaebi Bag** | **Combat Armory** | Pre-match character, skill deck, and weapon relic configuration studio. |
| **Stigmas** | **Divine Ultimates** | High-impact ultimate skills granted by constellations (Hellfire, Heavenly Pillar, etc.). |
| **Fables (Stories)** | **Star Archive Chronicles** | On-chain verified battle records and match telemetry. |

---

## 4. Game Systems & Data Specifications

### 4.1 Strict 30-Point Attribute Economy
Fair play is enforced through a rigid 30-point budget across three core attributes (minimum 5 points each):
* **Strength (STR):** +1.5% Physical & Melee Attack damage per point.
* **Agility (AGI):** +1.2% Critical strike chance, +1.5% Sabotage energy generation rate, wider parry window.
* **Resonance (RES):** +4 Max HP (base 200 HP), +2 Starting Shield points, +1.5% Elemental skill damage.

### 4.2 Challenger Archetypes (`src/data/archetypes.ts`)
1. **Blade Disciple** (*Yoo Joonghyuk lineage*): High STR (12) / AGI (10) / RES (8). Melee burst and aerial juggles. Metro bias.
2. **Shadow Rogue** (*Han Sooyoung lineage*): High AGI (12) / STR (10) / RES (8). Evasion, critical strikes, and rapid sabotage. Ocean bias.
3. **Titan Vanguard** (*Lee Hyunsung lineage*): High RES (12) / STR (10) / AGI (8). High defense, shields, and poise break. Metro bias.

### 4.3 Star Relic Weapons (`src/data/weapons.ts`)
* **Unbroken Faith** (Legendary): Pure White Ether Blade. +15% Sabotage Energy generation rate on combos.
* **Four Tiger Exorcism Sword** (Legendary): Celestial Tiger Constellation Blade. +25% bonus damage vs Calamity Bosses.
* **White Star Fluid Dagger** (Historic): Condensed Stellar Plasma Dagger. Every 3rd basic attack triggers a guaranteed double strike.
* **Infinite Space Trench Coat** (Mythic): Sub-Dimensional Storage Relic. Reduces incoming critical damage by 30% and adds +35 starting shield.

### 4.4 Scenario Arenas & Bosses (`src/data/arenas.ts`)
1. **Subterranean Metro (Line 3, Carriage 3807):**
   - *Modifier:* Confined Quarters (+30% Melee/Slashing damage; -25% projectile speed).
   - *Boss:* **Gorgon Brute** (320 HP, 100 Poise).
   - *Interactive Props:* Emergency Brake (inflicts Stagger), Fire Extinguisher (creates Blind smoke screen).
2. **Han River Crossing (Mapo Bridge):**
   - *Modifier:* Torrential Surge (+35% Lightning/Shock damage; Fire skills deal -20% damage).
   - *Boss:* **Ichthyosaur Sovereign** (420 HP, 120 Poise, Enrages below 50% HP).
   - *Interactive Props:* Bridge Suspension Cable (electrifies water), Debris Chunk (crushing damage).

### 4.5 Combat Skills & Stigmas (`src/data/skills.ts`)
17 distinct skills categorized into:
* **Melee:** Pure Ether Blade, Breaking Sky Fist, Red Phoenix Lunge, Storm Cleave, Dragon Fang Thrust.
* **Elemental:** Electrification, Glacial Shards, Flame Burst, Thunder Spear, Void Nova.
* **Tactical:** The Fourth Wall (Parry/Shield), Way of the Wind (Dodge), Kinetic Deflector, Shadow Cloak.
* **Stigmas (Ultimates):**
  - *Stigma: Hellfire* (Uriel): 90 DMG, cleanses debuffs, massive boss burn.
  - *Stigma: Heavenly Pillar* (Sun Wukong): 110 DMG, immediately shatters boss poise.
  - *Stigma: Black Dragon Flame* (Black Flame Dragon): 130 DMG, generates high Probability Heat.

### 4.6 Boss Telegraph & Counter Matrix
When a boss begins winding up a named attack, the HUD warns the player with a telegraph banner and required counter:
* **Sweep / Ground Wave** ➡️ Counter with **JUMP** (`⬆️ Jump` hotkey or button).
* **Overhead Slam / Laser** ➡️ Counter with **SLIDE / CROUCH** (`⬇️ Slide` hotkey or button).
* **Piercing Thrust / Energy Blast** ➡️ Counter with **PARRY** (`🛡️ Parry` hotkey or button).
* *Success:* 100% damage negated + player gains bonus Combat Energy and style points.
* *Failure:* Player suffers full attack damage + stagger stun.

### 4.7 Cross-Arena Sabotage Actions (`src/data/sabotage.ts`)
* **Debris Barrage (40 Sabotage Energy):** Collapses roof chunks into opponent's arena, dealing 25 damage.
* **Spawn Shadow Minion (70 Sabotage Energy):** Summons an aggressive add into the rival channel that attacks every turn.
* **Probability Overload (100 Sabotage Energy):** Overcharges the rival's arena, causing an immediate Cosmic Backlash and scrambling their hand.

---

## 5. Web Audio Engine (`src/utils/audioService.ts`)

Procedural audio synthesizer running directly on standard Web Audio API without asset files:
* `playBladeSlash()`: Rapid bandpass noise sweep with exponential pitch drop (120ms).
* `playParryClang()`: Dual high-frequency square oscillators (800Hz & 1600Hz) with high-Q ringing bandpass (250ms).
* `playDodgeWoosh()`: Low-pass filtered white noise burst with frequency modulation (180ms).
* `playCoinJingle()`: Two-tone bright sine chime (987.77Hz B5 -> 1318.51Hz E6) with smooth decay (400ms).
* `playAlarmSiren()`: Sweeping sawtooth oscillator (400Hz to 800Hz) with rapid vibrato (300ms).
* `playStigmaCast()`: Sub-bass triangle drop (150Hz -> 40Hz) with heavy stereo resonance (600ms).
* `playVictoryFanfare()`: Arpeggiated triumphal chord progression (C5 - E5 - G5 - C6) over 800ms.
* `playCosmicBacklash()`: Distorted square wave crunch with steep resonant low-pass filter (400ms).
* **Mute Control:** State stored in memory with live toggle button in the floating bottom-right dock.

---

## 6. Solana Devnet Integration (`src/utils/solanaService.ts`)

* **Endpoint:** `https://api.devnet.solana.com`
* **Dual Wallet Architecture:**
  1. Detects `window.solana` (Phantom / Solflare).
  2. If wallet extension is absent, generates an ephemeral in-app Solana Ed25519 keypair and persists it in `sessionStorage` for seamless testing without requiring judges to install an extension.
* **Live Features:**
  - `getBalance()` via standard JSON-RPC `getBalance` method.
  - `requestAirdrop()` with signature polling for 1-click +1.0 SOL devnet funding.
  - `sendTipTransaction()` creating real SystemProgram transfer signatures.
  - Direct clickable links to `https://explorer.solana.com/tx/{signature}?cluster=devnet`.

---

## 7. Current Project File Map

```
starstream-arena/
├── public/
│   ├── favicon.svg
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── hero.png
│   ├── components/
│   │   ├── MainLobby.tsx            # Screen 0: Cinematic Title, Mode Portals & Wallet Bar
│   │   ├── ChallengerSelect.tsx     # Screen 1: Visual Hero Cards with Auto-Ready Presets
│   │   ├── DispatchArena.tsx        # Screen 2: Scenario Arena & Circuit Wager Command Station
│   │   ├── SpectatorHub.tsx         # Screen 4: Live Channel Directory & 🎲 Quick Hop
│   │   ├── SpectatorTheater.tsx     # Screen 5: Live 60 FPS Stream, VIP Chat & Solana Devnet Tipping
│   │   ├── StarStreamCodex.tsx      # Field Manual: 4-Tab Interactive Game Guide
│   │   ├── CombatCanvas.tsx         # Procedural 60 FPS 2D HTML5 canvas stage
│   │   ├── CombatHUD.tsx            # HP bars, energy orbs, telegraph reaction, hand cards
│   │   ├── CombatStage.tsx          # Solo scenario run orchestrator
│   │   ├── TwinDuelStage.tsx        # Symmetrical 1v1 split-screen duel orchestrator
│   │   ├── StreamChat.tsx           # Live spectator chat & micro-tipping feed
│   │   ├── ConstellationModal.tsx   # Spectator moniker & celestial aura studio
│   │   ├── StarArchive.tsx          # Leaderboard & verified on-chain run archive
│   │   ├── AttributeAllocator.tsx   # 30-point attribute allocation card
│   │   └── SkillDeckBuilder.tsx     # 5-card deck builder with filter tabs
│   ├── data/
│   │   ├── archetypes.ts            # Blade Disciple, Shadow Rogue, Titan Vanguard with auto-presets
│   │   ├── arenas.ts                # Metro Carriage 3807 & Mapo Bridge
│   │   ├── mockMatches.ts           # Mock broadcast matches for the Spectator Directory
│   │   ├── sabotage.ts              # Debris Barrage, Minion Spawn, Overload
│   │   ├── skills.ts                # 17 balanced combat skills & stigmas
│   │   └── weapons.ts               # Unbroken Faith, Four Tiger Sword, etc.
│   ├── types/
│   │   └── game.ts                  # Complete TypeScript definitions & AppScreen router
│   ├── utils/
│   │   ├── aiOpponent.ts            # Reactive Channel B bot intelligence
│   │   ├── audioService.ts          # Web Audio API sound synthesizer
│   │   ├── combatEngine.ts          # Turn cycles, damage formulas, counters
│   │   └── solanaService.ts         # Solana RPC, wallet connection, explorer links
│   ├── App.tsx                      # Root state router with multi-screen flow
│   ├── index.css                    # Tailwind CSS v4 styling & dark theme
│   └── main.tsx                     # React DOM root mounting
├── index.html                       # HTML5 entry with StarStream metadata
├── package.json                     # Dependencies & build scripts
├── README.md                        # Master hackathon submission documentation
├── ORV_LORE_CONTEXT.md              # Original novel lore mapping reference
└── PROJECT_MEMORY_CONTEXT.md        # Comprehensive memory document (this file)
```

---

## 8. Development Trajectory & Commit History

1. **`ea7ebf3`** — *Initial scaffold:* Vite + React 19 + TypeScript + Tailwind v4 + Solana Web3 + Lucide.
2. **`84e752c`** — *Core Game Engine:* State models, turn cycles, boss telegraph matrix, 17 skills, 3 sabotages.
3. **`93935eb` & `bd1df5e`** — *Armory & Loadout Studio:* 30-pt allocator, 5-skill deck builder, relic weapons, circuit tiers.
4. **`c826182`** — *2D Combat Canvas & HUD:* Procedural render engine, blade slashes, screen shake, telegraph counter buttons.
5. **`9410701`** — *Symmetrical Twin Duel:* Channel A vs Channel B split-screen, AI bot, cross-arena sabotage, dual escrow pot.
6. **`f2e12d1`** — *Solana Devnet Spectator Integration:* Dual-mode wallet, constellation studio, explorer links, tip transactions.
7. **`bf1c64e`** — *Canonical Lore Alignment:* Standardized ORV stigmas, bosses, relics, and props.
8. **`3d6572b`** — *Web Audio Synthesizer:* Zero-asset procedural SFX and floating audio control pill.
9. **`bc4bb23` & `1abcadd`** — *Documentation & Expansion:* ASCII architecture, Solana Devnet guide, and long-term expansion blueprint.
10. **`1e237b0`** — *English Sweep & Layout Polish:* Removed Korean clutter, pinned Deploy Card, added header start button.
11. **`b2b755b`** — *Project Memory Blueprint:* Permanent single-source-of-truth documentation across codebase.
12. **`cc88e6d`** — *Stepped Tournament Architecture:* MainLobby, ChallengerSelect, and DispatchArena screens.
13. **`f736ff7`** — *Spectator Experience:* SpectatorHub directory, 🎲 Quick Hop, and SpectatorTheater with live Devnet tipping.
14. **`9792b4a`** — *Survival Codex & In-Combat Polish:* 4-tab interactive guide, elemental card frames, and counter hotkeys.
15. **`4067011`** — *Arena-First Pre-Game Flow:* Flipped screen flow so players select Scenario Arena & Stakes first, then adapt Challenger build with active arena synergies highlighted.
16. **`8fe7b73`** — *UI Streamlining:* Renamed complex terms to universal esports standards: "Stun Bar", "Overheat Gauge (0-100%)", and punchy arcade skill cards.
17. **`9995ce9`** — *Archetype Roles & 1-Click Stat Presets:* Added punchy role subtitles (`COMBO SWORDMASTER`, `EVASIVE ASSASSIN`, `IRON BULWARK`) and 1-click attribute presets (`Balanced`, `Striker`, `Juggernaut`).
18. **`f1c0c2e`** — *Keyboard Action Battler & Combo Chaining:* Real-time hotkeys (`1`, `2`, `3` for cards, `W` Jump, `S` Slide, `Space` Parry, `E` End Turn, `4`/`5` Props) and scaling combo multiplier damage (+15% per hit in chain).
19. **`c6dbaab`** — *Dokkaebi Mid-Battle Flash Bounties:* Spontaneous live bounties (3-card combo, parry, arena props) granting immediate +0.003–0.005 SOL tips and boss stun breaks.
20. **`7b2afd9`** — *Enhanced Cross-Arena Sabotage Hazards:* Real gameplay disruptions including Calamity Shield Minion damage interception (60 HP drone) and live incoming sabotage HUD banners.
21. **`e34af02`** — *Canvas 2.0 Anime Sprites & Hit-Stop Impact:* Flowing anime trenchcoat ribbons, neon blade aura, dynamic crescent slash VFX, hexagonal parry energy shields, and 45-60ms hit-stop freeze.
22. **`c36a276`** — *Arcade Popups & Visual Cross-Arena Missile:* Bouncy impact texts (`🔥 COMBO x3!`, `💥 STUN CRITICAL!`, `🛡️ PERFECT PARRY!`) and animated cross-screen rocket projectiles streaking between Channel A and B.
23. **`2a7a6d2`** — *Fighting Screen 2.0 Redesign:* Prominent Dual Health Bars at the very top (You on Left vs Boss on Right), widescreen 270px canvas in the center, and zero-scroll action card dock directly below.
24. **`87e57a5`** — *Codebase Housekeeping & RPC Guard:* Removed orphaned legacy `Armory.tsx` (19.2 KB dead code) and updated `solanaService.ts` to automatically resolve full 44-character Base58 keys on Devnet RPC balance and airdrop queries.
25. **`c2fdf26`** — *Audio Impact & Keyboard Unlock:* Implemented procedural `playExplosionThud()` for cross-arena sabotage missile strikes and ensured `audio.resume()` runs on first keystroke to prevent browser audio context suspension.
26. **`a2e4a11`** — *Responsive Dual Duel Viewport Modes:* Added 3-way view toggle pill (`[⚡ Split 50/50]`, `[🛡️ Focus You (Ch. A)]`, `[👁️ Focus Rival (Ch. B)]`) giving players full viewport control on desktop, laptop, and mobile screens.
27. **`77b6a59`** — *Solo Trial Esports Grade & Star Archive Recording:* Added performance style rank badges (`S+ APEX INCARNATION`, `A DIVINE FAVOR`, `B VETERAN`, `C NOVICE`), 1-click on-chain record action to `StarArchive`, and radiant gold critical shockwave particles on staggered bosses.
28. **`e525016`** — *Pokémon x ORV Data Models:* Defined `MoveRole` (`strike`, `setup`, `priority`, `stigma`), `MovePriority` (`+1/0/-1`), `StatusType` (`burn`, `bleed`, `paralyze`, `concussion`), `FablePassive`, and boss speeds & elemental weaknesses in `types/game.ts`.
29. **`b263a79`** — *Tactical Movepool Catalog:* Implemented 12 iconic Pokémon-inspired ORV abilities in `skills.ts` (White Pure Ether Slash, Song of the Sword, Way of the Wind, Stigma Hellfire, Avatar Decoy, Phase Ambush, Mountain Cleave, The Fourth Wall Counter).
30. **`b574643`** — *Turn Initiative & Status Engine:* Implemented speed-based turn initiative, elemental weakness multipliers (2.0x Super Effective / 0.5x Resisted), setup buffs, and status ailment damage ticks in `combatEngine.ts`.
31. **`37f9577`** — *3D Isometric Battle Pedestals:* Replaced flat canvas line with floating elliptical battle pedestals for Player (bottom-left foreground) and Boss (top-right elevated calamity platform) with dynamic terrain conduits and weakness banners in `CombatCanvas.tsx`.
32. **`0b318bb`** — *Pokémon Narrative Box & 4-Move Console:* Redesigned `CombatHUD.tsx` with a typewriter battle dialogue ticker and 4 tactical move slots (`[1]` Strike, `[2]` Setup/Buff, `[3]` Priority/Status, `[4]` Stigma Ultimate) with hotkeys and elemental badges.
33. **`a4fc9a8`** — *Stage Wiring & Full Production Build:* Fully integrated Pokémon-style tactical turns into `CombatStage.tsx` and `TwinDuelStage.tsx`, eliminating the sluggish 3-card draw loop and verifying 100% clean production build.
34. **`01e7c4f`** — *Dialogue Ticker Auto-Scroll:* Attached smooth programmatic auto-scroll to the bottom of the Star Stream narrative dialogue box on every combat telemetry line update.
35. **`73add58`** — *Input Spamming Lockout Guard:* Added `isTurnResolving` guard locking move slots and keybindings during turn resolution with an `⚡ INITIATIVE RESOLVING...` badge to prevent action stacking and race conditions.
36. **`2014bca`** — *Canvas Spatial Calibration:* Calibrated floating combat numbers and hit-stop particle bursts to dynamic 3D isometric platform coordinates (`bossBaseX, bossY` vs `playerBaseX, playerY`).
37. **`7007836`** — *Visual Turn Sequencing & Speed Initiative:* Sequenced turn resolution into 2 discrete animated beats with staged HP bar reductions and floating damage numbers matching true Speed initiative order.
38. **`11c6068`** — *Live Status Ailment & Buff Badges:* Added visual status condition pills (`🔥 BURN`, `🩸 BLEED`, `⚡ PARALYZED`, `💫 CONCUSSED`) and player setup buff indicators (`🗡️ +60% ATK`, `👤 DECOY`) directly adjacent to HP bars.
39. **`58255c2`** — *Move Slot Matchup Indicators:* Added dynamic `💥 2.0x WEAK` and `🛡️ 0.5x RESIST` badges directly on move cards to communicate target vulnerabilities at a glance.
40. **`2df3080`** — *Twin Duel Opponent AI Alignment:* Modernized Channel B opponent AI in `aiOpponent.ts` to execute tactical Pokémon turns with weakness targeting and priority awareness.
41. **`77b64f2`** — *Dedicated Audio Synthesizers:* Added procedural Web Audio API synthesizers for super-effective crunch thuds, resisted clinks, and status ticks, staggered with attack animation beats.

---

## 9. Permanent Ground Rules & Constraints

* **Strict Fair Play:** Mirrored arenas and fixed 30-point attribute cap are non-negotiable.
* **Instant Action Controls:** Every card, counter action, prop, and turn cycle can be triggered via keyboard hotkeys (`1-5`, `W`, `S`, `Space`, `E`) or mouse clicks.
* **Spectator Freedom:** Spectators are real users who choose their own custom monikers; no hardcoded NPC lockouts.
* **Pure English UI:** Clean, punchy terminology (*Ether Blade*, *Breaking Sky*, *Fourth Wall*); no Hangul remnants.
* **Zero External Audio Assets:** Audio must remain procedurally synthesized via Web Audio API.
* **Dual-Mode Wallet:** Always support both Phantom and in-browser fallback keypairs so hackathon judges can test in any browser with zero barriers.

