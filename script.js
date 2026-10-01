/**
 * JUNIOR ASTRONAUT MISSION TRAINER
 * Full Interactive Frontend Game Engine
 */

// 1. CHARACTER DATABASE
const CHARACTER_DB = [
  { id: 'pink_bear', name: 'Pink Bear', avatar: '🐻', suit: 'Pink', endurance: 4, tech: 3 },
  { id: 'purple_cat', name: 'Purple Cat', avatar: '🐱', suit: 'Purple', endurance: 3, tech: 5 },
  { id: 'lavender_bunny', name: 'Lavender Bunny', avatar: '🐰', suit: 'Lavender', endurance: 5, tech: 2 },
  { id: 'blue_pup', name: 'Blue Pup', avatar: '🐶', suit: 'Light Blue', endurance: 3, tech: 4 },
  { id: 'grey_panda', name: 'Grey Panda', avatar: '🐼', suit: 'Grey', endurance: 4, tech: 4 },
  { id: 'classic_astro', name: 'Classic Cadet', avatar: '👨‍🚀', suit: 'White', endurance: 3, tech: 3 }
];

// 2. GAME STATE
const gameState = {
  player: {
    name: "Cadet Nova",
    character: CHARACTER_DB[0],
    mode: "basic", // 'basic' | 'advanced'
    energy: 100,
    immunity: 100,
    xp: 0
  },
  unlockedLevel: 1,
  currentLevel: 1,
  currentTask: 1,
  soundActive: true
};

// 3. SOUND SYNTHESIZER (Web Audio API)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playAudioTone(type) {
  if (!gameState.soundActive) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(640, audioCtx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.18);
    }
  } catch (e) {}
}

// 4. INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  generateStarfield();
  bindUIEvents();
  renderCharacterOptions();
  updateHUD();
});

function generateStarfield() {
  const container = document.getElementById("stars-layer");
  for (let i = 0; i < 65; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    const sz = Math.random() * 3 + 1;
    star.style.width = `${sz}px`;
    star.style.height = `${sz}px`;
    star.style.setProperty("--dur", `${Math.random() * 3 + 1.5}s`);
    container.appendChild(star);
  }
}

// 5. EVENT BINDING
function bindUIEvents() {
  // Opening Launch Sequence
  document.getElementById("btn-start-launch").addEventListener("click", () => {
    playAudioTone('click');
    executeLaunchSequence();
  });

  // Difficulty Mode Selector
  document.querySelectorAll(".mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      playAudioTone('click');
      document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      gameState.player.mode = btn.dataset.mode;
      updateHUD();
    });
  });

  // Confirm Character Selection
  document.getElementById("btn-confirm-character").addEventListener("click", () => {
    playAudioTone('click');
    const inputVal = document.getElementById("player-name-input").value.trim();
    if (inputVal) gameState.player.name = inputVal;
    updateHUD();
    switchScreen("screen-level-select");
  });

  // Level Card Selection
  document.querySelectorAll(".level-card").forEach(card => {
    card.addEventListener("click", () => {
      const lvl = parseInt(card.dataset.level);
      if (lvl <= gameState.unlockedLevel) {
        playAudioTone('click');
        launchTask(lvl, 1);
      } else {
        playAudioTone('error');
      }
    });
  });

  // Exit Task to Level Select
  document.getElementById("btn-exit-task").addEventListener("click", () => {
    playAudioTone('click');
    switchScreen("screen-level-select");
  });

  // Sound Toggle Button
  document.getElementById("btn-sound-toggle").addEventListener("click", () => {
    gameState.soundActive = !gameState.soundActive;
    document.getElementById("btn-sound-toggle").textContent = gameState.soundActive ? "🔊" : "🔇";
  });

  // Replay Game
  document.getElementById("btn-replay").addEventListener("click", () => {
    playAudioTone('click');
    gameState.player.energy = 100;
    gameState.player.immunity = 100;
    gameState.player.xp = 0;
    gameState.unlockedLevel = 1;
    updateHUD();
    refreshLevelCardsUI();
    switchScreen("screen-level-select");
  });
}

function switchScreen(screenId) {
  document.querySelectorAll(".game-screen").forEach(s => s.classList.add("hidden"));
  document.getElementById(screenId).classList.remove("hidden");

  const hud = document.getElementById("game-hud");
  if (screenId === "screen-opening" || screenId === "screen-victory") {
    hud.classList.add("hidden");
  } else {
    hud.classList.remove("hidden");
  }
}

// 6. LAUNCH ANIMATION
function executeLaunchSequence() {
  const btn = document.getElementById("btn-start-launch");
  const modal = document.getElementById("countdown-modal");
  const numDisplay = document.getElementById("countdown-num");
  const rocket = document.getElementById("launch-pad-rocket");

  btn.classList.add("hidden");
  modal.classList.remove("hidden");

  let count = 3;
  numDisplay.textContent = count;

  const timer = setInterval(() => {
    count--;
    if (count > 0) {
      numDisplay.textContent = count;
      playAudioTone('click');
    } else {
      clearInterval(timer);
      numDisplay.textContent = "🚀 IGNITION!";
      playAudioTone('success');
      rocket.classList.add("launching");

      setTimeout(() => {
        rocket.classList.remove("launching");
        switchScreen("screen-creation");
      }, 2400);
    }
  }, 1000);
}

// 7. CHARACTER CREATION UI
function renderCharacterOptions() {
  const grid = document.getElementById("character-grid");
  grid.innerHTML = "";

  CHARACTER_DB.forEach((char, idx) => {
    const card = document.createElement("div");
    card.className = `char-card-item ${idx === 0 ? 'selected' : ''}`;
    card.innerHTML = `
      <div class="avatar">${char.avatar}</div>
      <strong>${char.name}</strong>
      <div class="suit">${char.suit} Suit</div>
    `;

    card.addEventListener("click", () => {
      playAudioTone('click');
      document.querySelectorAll(".char-card-item").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      gameState.player.character = char;
      updateCharacterPreview();
    });

    grid.appendChild(card);
  });

  updateCharacterPreview();
}

function updateCharacterPreview() {
  const char = gameState.player.character;
  document.getElementById("char-preview-avatar").textContent = char.avatar;
  document.getElementById("char-preview-name").textContent = `${char.name} (${char.suit} Suit)`;
  document.getElementById("stat-endurance-stars").textContent = "⭐".repeat(char.endurance) + "☆".repeat(5 - char.endurance);
  document.getElementById("stat-tech-stars").textContent = "⭐".repeat(char.tech) + "☆".repeat(5 - char.tech);
  updateHUD();
}

// 8. HUD & PROGRESSION
function updateHUD() {
  document.getElementById("hud-avatar-icon").textContent = gameState.player.character.avatar;
  document.getElementById("hud-player-name").textContent = gameState.player.name;
  document.getElementById("hud-mode-tag").textContent = gameState.player.mode === 'basic' ? "BASIC MODE" : "ADVANCED MODE";

  document.getElementById("bar-energy").style.width = `${Math.max(0, gameState.player.energy)}%`;
  document.getElementById("bar-immunity").style.width = `${Math.max(0, gameState.player.immunity)}%`;
  document.getElementById("bar-xp").style.width = `${Math.min(100, gameState.player.xp)}%`;
}

function refreshLevelCardsUI() {
  document.querySelectorAll(".level-card").forEach(card => {
    const lvl = parseInt(card.dataset.level);
    if (lvl <= gameState.unlockedLevel) {
      card.classList.remove("locked");
      card.classList.add("unlocked");
      card.querySelector(".status-pill").textContent = "UNLOCKED";
    } else {
      card.classList.remove("unlocked");
      card.classList.add("locked");
      card.querySelector(".status-pill").textContent = "🔒 LOCKED";
    }
  });
}

function adjustImmunity(amount) {
  if (gameState.player.mode === 'basic') {
    gameState.player.immunity = Math.max(20, gameState.player.immunity - Math.floor(amount / 2));
  } else {
    gameState.player.immunity = Math.max(0, gameState.player.immunity - amount);
  }
  updateHUD();

  if (gameState.player.immunity <= 0) {
    playAudioTone('error');
    setRobotSpeech("⚠️ Immunity depleted! Recovering costs energy!");
    gameState.player.immunity = 60;
    adjustEnergy(20);
    setTimeout(() => launchTask(gameState.currentLevel, gameState.currentTask), 1800);
  }
}

function adjustEnergy(amount) {
  gameState.player.energy = Math.max(0, gameState.player.energy - amount);
  updateHUD();
  if (gameState.player.energy <= 0) {
    playAudioTone('error');
    setRobotSpeech("⚠️ Out of energy! Restarting task with restored energy.");
    gameState.player.energy = 80;
    setTimeout(() => launchTask(gameState.currentLevel, gameState.currentTask), 1800);
  }
}

function setRobotSpeech(msg) {
  document.getElementById("guide-speech-text").textContent = msg;
}

// 9. TASK ROUTING & LEVEL MANAGEMENT
function launchTask(level, task) {
  gameState.currentLevel = level;
  gameState.currentTask = task;
  switchScreen("screen-gameplay");

  document.getElementById("level-badge-text").textContent = `LEVEL ${level} - TASK ${task}`;
  const stage = document.getElementById("interactive-stage");
  stage.innerHTML = "";

  if (level === 1) {
    if (task === 1) buildL1T1(stage);
    else if (task === 2) buildL1T2(stage);
    else if (task === 3) buildL1T3(stage);
  } else if (level === 2) {
    if (task === 1) buildL2T1(stage);
    else if (task === 2) buildL2T2(stage);
    else if (task === 3) buildL2T3(stage);
  } else if (level === 3) {
    if (task === 1) buildL3T1(stage);
    else if (task === 2) buildL3T2(stage);
    else if (task === 3) buildL3T3(stage);
  }
}

function finishTask(xpAward = 25) {
  playAudioTone('success');
  adjustEnergy(15);
  gameState.player.xp += xpAward;
  updateHUD();

  if (gameState.currentTask < 3) {
    setRobotSpeech("🎉 Excellent work Cadet! Unlocking the next task!");
    setTimeout(() => launchTask(gameState.currentLevel, gameState.currentTask + 1), 1800);
  } else {
    // Level Complete
    if (gameState.currentLevel < 3) {
      gameState.unlockedLevel = Math.max(gameState.unlockedLevel, gameState.currentLevel + 1);
      refreshLevelCardsUI();
      gameState.player.energy = 100;
      setRobotSpeech(`🏆 LEVEL ${gameState.currentLevel} COMPLETED! Unlocking next mission level!`);
      setTimeout(() => switchScreen("screen-level-select"), 2000);
    } else {
      // Game Finish
      document.getElementById("victory-avatar-display").textContent = gameState.player.character.avatar;
      switchScreen("screen-victory");
    }
  }
}

/* ==========================================================================
   GAME MECHANICS - ALL 9 TASKS
   ========================================================================== */

// --- LEVEL 1 TASK 1: BUILD & POWER SPACECRAFT ---
function buildL1T1(stage) {
  document.getElementById("task-title-text").textContent = "Build & Power Spacecraft";
  setRobotSpeech("Place each spacecraft module into its slot on the blueprint!");

  const required = ['Habitat', 'Power', 'Life Support'];
  let placed = [];

  stage.innerHTML = `
    <div class="task-workspace">
      <div class="drag-items-pool">
        ${required.map(m => `<button class="draggable-module" data-mod="${m}">📦 ${m} Module</button>`).join('')}
      </div>
      <div class="blueprint-drop-zone">
        ${required.map(m => `<div class="drop-slot" data-slot="${m}">Empty ${m} Slot</div>`).join('')}
      </div>
    </div>
  `;

  stage.querySelectorAll('.draggable-module').forEach(btn => {
    btn.addEventListener('click', () => {
      const mod = btn.dataset.mod;
      if (!placed.includes(mod)) {
        placed.push(mod);
        playAudioTone('click');
        const slot = stage.querySelector(`[data-slot="${mod}"]`);
        slot.classList.add('filled');
        slot.textContent = `✅ ${mod} Attached`;
        btn.style.opacity = '0.3';

        if (placed.length === required.length) {
          setTimeout(() => buildL1T1_Phase2(stage), 800);
        }
      }
    });
  });
}

function buildL1T1_Phase2(stage) {
  setRobotSpeech("Spacecraft assembled! Now activate all 4 main control systems!");

  stage.innerHTML = `
    <div class="task-workspace">
      <div class="grid-dashboard">
        <div class="dash-item" data-sys="O2"><span>🫁 Oxygen System</span> <div class="status-light"></div></div>
        <div class="dash-item" data-sys="Bat"><span>⚡ Battery Power</span> <div class="status-light"></div></div>
        <div class="dash-item" data-sys="Comm"><span>📡 Communications</span> <div class="status-light"></div></div>
        <div class="dash-item" data-sys="Nav"><span>🧭 Navigation</span> <div class="status-light"></div></div>
      </div>
    </div>
  `;

  let fixed = 0;
  stage.querySelectorAll('.dash-item').forEach(item => {
    item.addEventListener('click', () => {
      const light = item.querySelector('.status-light');
      if (!light.classList.contains('ok')) {
        playAudioTone('click');
        light.classList.add('ok');
        fixed++;
        if (fixed === 4) finishTask();
      }
    });
  });
}

// --- LEVEL 1 TASK 2: ASTRONAUT SUIT & ZERO-G ---
function buildL1T2(stage) {
  document.getElementById("task-title-text").textContent = "Suit Up & Microgravity Course";
  setRobotSpeech("Put on your suit gear in order: Helmet 🪖 -> Oxygen 🎒 -> Boots 🥾!");

  const suitGear = ['Helmet 🪖', 'Oxygen Pack 🎒', 'Boots 🥾'];
  let step = 0;

  stage.innerHTML = `
    <div class="task-workspace">
      <div style="font-size:4rem;">${gameState.player.character.avatar}</div>
      <div class="drag-items-pool">
        ${suitGear.map((item, i) => `<button class="btn-primary" id="gear-${i}">${item}</button>`).join('')}
      </div>
    </div>
  `;

  suitGear.forEach((_, i) => {
    document.getElementById(`gear-${i}`).onclick = () => {
      if (i === step) {
        playAudioTone('click');
        document.getElementById(`gear-${i}`).disabled = true;
        document.getElementById(`gear-${i}`).style.opacity = '0.3';
        step++;
        if (step === suitGear.length) buildL1T2_ZeroG(stage);
      } else {
        adjustImmunity(10);
        setRobotSpeech("Incorrect sequence! Attach Helmet first, then Oxygen, then Boots.");
      }
    };
  });
}

function buildL1T2_ZeroG(stage) {
  setRobotSpeech("Suit ready! Drifting in Zero-G: Collect the floating wrench 🔧 and reach the airlock 🚪!");

  stage.innerHTML = `
    <div class="task-workspace">
      <canvas id="zerog-canvas" class="arcade-canvas" width="520" height="230"></canvas>
      <div>
        <button id="z-up" class="btn-secondary">⬆️ Up</button>
        <button id="z-down" class="btn-secondary">⬇️ Down</button>
        <button id="z-fwd" class="btn-primary">➡️ Thrust Forward</button>
      </div>
    </div>
  `;

  const cvs = document.getElementById("zerog-canvas");
  const ctx = cvs.getContext("2d");
  let px = 30, py = 100, collected = false;

  function render() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    if (!collected) {
      ctx.font = "24px sans-serif";
      ctx.fillText("🔧", 240, 110);
    }
    ctx.font = "32px sans-serif";
    ctx.fillText("🚪", 460, 110);

    ctx.font = "28px sans-serif";
    ctx.fillText(gameState.player.character.avatar, px, py);
  }
  render();

  document.getElementById("z-up").onclick = () => { py = Math.max(30, py - 30); render(); check(); };
  document.getElementById("z-down").onclick = () => { py = Math.min(200, py + 30); render(); check(); };
  document.getElementById("z-fwd").onclick = () => { px += 35; render(); check(); };

  function check() {
    playAudioTone('click');
    if (!collected && Math.abs(px - 240) < 30 && Math.abs(py - 110) < 30) {
      collected = true;
      playAudioTone('success');
      setRobotSpeech("Wrench retrieved! Move into the glowing airlock door!");
    }
    if (collected && px >= 440) finishTask();
  }
}

// --- LEVEL 1 TASK 3: ROBOTIC ARM RESCUE ---
function buildL1T3(stage) {
  document.getElementById("task-title-text").textContent = "Robot Arm Retrieval";
  setRobotSpeech("Use controls to align the Robotic Arm 🦾 over the sample container 🧪 and GRAB it!");

  let armX = 60;

  stage.innerHTML = `
    <div class="task-workspace">
      <div style="position:relative; width:100%; height:180px; background:#070415; border-radius:16px; overflow:hidden;">
        <div id="arm-element" style="position:absolute; left:${armX}px; top:20px; font-size:3.2rem; transition: left 0.15s;">🦾</div>
        <div style="position:absolute; left:320px; top:105px; font-size:2.5rem;">🧪</div>
      </div>
      <div>
        <button id="arm-left" class="btn-secondary">⬅ Left</button>
        <button id="arm-right" class="btn-secondary">➡️️ Right</button>
        <button id="arm-grab" class="btn-primary">🗜️ GRAB SAMPLE</button>
      </div>
    </div>
  `;

  const arm = document.getElementById("arm-element");
  document.getElementById("arm-left").onclick = () => { armX = Math.max(20, armX - 35); arm.style.left = `${armX}px`; playAudioTone('click'); };
  document.getElementById("arm-right").onclick = () => { armX = Math.min(430, armX + 35); arm.style.left = `${armX}px`; playAudioTone('click'); };
  document.getElementById("arm-grab").onclick = () => {
    if (Math.abs(armX - 310) < 30) {
      arm.textContent = "🦾🧪";
      setRobotSpeech("Sample container retrieved! Level 1 Complete!");
      finishTask();
    } else {
      adjustImmunity(12);
      setRobotSpeech("Missed! Align the claw directly over the sample container.");
    }
  };
}

// --- LEVEL 2 TASK 1: LUNAR EXPLORER MAP ---
function buildL2T1(stage) {
  document.getElementById("task-title-text").textContent = "Lunar Terrain Exploration";
  setRobotSpeech("Study the Lunar Map & select Research Site Alpha to gather rock samples!");

  stage.innerHTML = `
    <div class="task-workspace">
      <div style="display:flex; gap:15px; flex-wrap:wrap; justify-content:center;">
        <button class="btn-secondary" id="site-c">🌋 Volcanic Crater</button>
        <button class="btn-primary" id="site-a">📍 Research Site Alpha</button>
        <button class="btn-secondary" id="site-b">🪨 Dust Ridge</button>
      </div>
    </div>
  `;

  document.getElementById("site-a").onclick = () => finishTask();
  document.getElementById("site-c").onclick = () => { adjustImmunity(10); setRobotSpeech("Unsafe crater! Select Research Site Alpha."); };
  document.getElementById("site-b").onclick = () => { adjustImmunity(10); setRobotSpeech("Too rocky! Navigate to Research Site Alpha."); };
}

// --- LEVEL 2 TASK 2: MOON ROVER MISSION ---
function buildL2T2(stage) {
  document.getElementById("task-title-text").textContent = "Moon Rover Expedition";
  setRobotSpeech("Drive the Rover to collect 3 moon samples before battery runs low!");

  let battery = 100, samples = 0;

  stage.innerHTML = `
    <div class="task-workspace">
      <div>🔋 Battery: <strong id="bat-val">100%</strong> | 💎 Samples: <strong id="samp-val">0/3</strong></div>
      <div style="font-size:4rem; margin:15px 0;">🏎️️ 🪨 💎</div>
      <button id="btn-drive-rover" class="btn-primary">🏎️ Drive Forward & Collect (-20% Battery)</button>
    </div>
  `;

  document.getElementById("btn-drive-rover").onclick = () => {
    playAudioTone('click');
    battery -= 20;
    samples++;
    document.getElementById("bat-val").textContent = `${battery}%`;
    document.getElementById("samp-val").textContent = `${samples}/3`;

    if (samples >= 3) finishTask();
  };
}

// --- LEVEL 2 TASK 3: BUILD MOON BASE ---
function buildL2T3(stage) {
  document.getElementById("task-title-text").textContent = "Construct Moon Outpost";
  setRobotSpeech("Assemble base infrastructure: Habitat -> Solar Panels -> Comm Antenna!");

  let step = 0;
  const modules = ['Habitat Dome 🛖', 'Solar Panels ☀️', 'Comm Antenna 📡'];

  stage.innerHTML = `
    <div class="task-workspace">
      <div id="base-render" style="font-size:3.5rem; height:80px;">🌕</div>
      <button id="btn-build-base" class="btn-primary">Build ${modules[0]}</button>
    </div>
  `;

  document.getElementById("btn-build-base").onclick = () => {
    playAudioTone('success');
    step++;
    if (step === 1) {
      document.getElementById("base-render").textContent = "🌕 🛖";
      document.getElementById("btn-build-base").textContent = `Build ${modules[1]}`;
    } else if (step === 2) {
      document.getElementById("base-render").textContent = "🌕 🛖 ☀️";
      document.getElementById("btn-build-base").textContent = `Build ${modules[2]}`;
    } else if (step === 3) {
      document.getElementById("base-render").textContent = "🌕 🛖 ☀️ 📡";
      setRobotSpeech("Lunar Base is fully powered & online! Great work Cadet!");
      finishTask();
    }
  };
}

// --- LEVEL 3 TASK 1: HANDLE EMERGENCY ---
function buildL3T1(stage) {
  document.getElementById("task-title-text").textContent = "Moon Base Emergency!";
  setRobotSpeech("🚨 ALERT: Pressure line leak! Tap the emergency seal to repair oxygen flow!");

  stage.innerHTML = `
    <div class="task-workspace">
      <div style="font-size:4rem; color:var(--red-alert); animation: btnGlow 0.8s infinite alternate;">🚨 💨</div>
      <button id="btn-seal-leak" class="btn-primary" style="background:var(--red-alert);">🔧 SEAL OXYGEN LEAK</button>
    </div>
  `;

  document.getElementById("btn-seal-leak").onclick = () => finishTask();
}

// --- LEVEL 3 TASK 2: PREPARE RETURN CARGO ---
function buildL3T2(stage) {
  document.getElementById("task-title-text").textContent = "Cargo Packing & Supply Balance";
  setRobotSpeech("Select 3 essential supply crates to load into the return module!");

  let packed = 0;

  stage.innerHTML = `
    <div class="task-workspace">
      <div class="drag-items-pool">
        <button class="btn-secondary pack-item">📦 Water Rations</button>
        <button class="btn-secondary pack-item">📦 Oxygen Tanks</button>
        <button class="btn-secondary pack-item">📦 Scientific Rock Samples</button>
      </div>
    </div>
  `;

  stage.querySelectorAll('.pack-item').forEach(btn => {
    btn.onclick = () => {
      playAudioTone('click');
      btn.disabled = true;
      btn.style.opacity = '0.3';
      packed++;
      if (packed === 3) finishTask();
    };
  });
}

// --- LEVEL 3 TASK 3: RETURN TO EARTH ---
function buildL3T3(stage) {
  document.getElementById("task-title-text").textContent = "Earth Atmospheric Re-entry";
  setRobotSpeech("Time touchdown! Tap land when the spacecraft 🚀 aligns in the green zone!");

  let pos = 10, dir = 1;

  stage.innerHTML = `
    <div class="task-workspace">
      <div style="width:80%; height:44px; background:linear-gradient(90deg, #ff4766, #00ff88 40%, #00ff88 60%, #ff4766); border-radius:22px; position:relative;">
        <div id="reentry-ship" style="position:absolute; left:10%; top:-8px; font-size:2.2rem;">🚀</div>
      </div>
      <button id="btn-touchdown" class="btn-primary glow" style="margin-top:30px;">🛬 TOUCHDOWN ON EARTH</button>
    </div>
  `;

  const ship = document.getElementById("reentry-ship");
  const loop = setInterval(() => {
    pos += dir * 3.5;
    if (pos >= 88 || pos <= 5) dir *= -1;
    ship.style.left = `${pos}%`;
  }, 45);

  document.getElementById("btn-touchdown").onclick = () => {
    clearInterval(loop);
    if (pos >= 35 && pos <= 65) {
      finishTask(50);
    } else {
      adjustImmunity(20);
      setRobotSpeech("Too steep! Aim inside the center green zone for a safe landing.");
      setTimeout(() => buildL3T3(stage), 1600);
    }
  };
}