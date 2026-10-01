/* =========================================================
   JUNIOR ASTRONAUT MISSION TRAINER
   Main Game Logic
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


/* =========================================================
   CHARACTER DATA
========================================================= */

const characters = [

    {
        name: "Luna Bunny",
        emoji: "🐰",
        technical: 3,
        endurance: 5,
        suit: "Pink Suit"
    },

    {
        name: "Nova Cat",
        emoji: "🐱",
        technical: 5,
        endurance: 3,
        suit: "Purple Suit"
    },

    {
        name: "Orbit Panda",
        emoji: "🐼",
        technical: 3,
        endurance: 4,
        suit: "Lavender Suit"
    },

    {
        name: "Comet Fox",
        emoji: "🦊",
        technical: 4,
        endurance: 5,
        suit: "Light Blue Suit"
    },

    {
        name: "Cosmo Bear",
        emoji: "🐻",
        technical: 4,
        endurance: 3,
        suit: "Grey Suit"
    },

    {
        name: "Astro Pup",
        emoji: "🐶",
        technical: 5,
        endurance: 4,
        suit: "White Suit"
    }

];


/* =========================================================
   LEVEL DATA
========================================================= */

const levels = {

    1: {
        title: "Earth Workshop",
        icon: "🌍",
        description:
            "Train on Earth and learn the skills you will need during your space mission.",

        tasks: [

            {
                title: "Fix the Oxygen System",
                icon: "🫁",
                description:
                    "Keep the oxygen system safe and working.",
                subtasks: [
                    "🔌 Fix the Circuit",
                    "🔧 Repair the Pipe",
                    "🫁 Set Oxygen Level"
                ]
            },

            {
                title: "Build Radiation Shielding",
                icon: "☢️",
                description:
                    "Learn to protect yourself from dangerous radiation.",
                subtasks: [
                    "🧱 Choose the Material",
                    "🛡️ Place the Shields",
                    "☄️ Dodge the Asteroids"
                ]
            },

            {
                title: "Generate Power",
                icon: "⚡",
                description:
                    "Set up solar panels and produce enough electricity.",
                subtasks: [
                    "📍 Find the Spot",
                    "☀️ Place the Panel",
                    "🔋 Connect the Power"
                ]
            }

        ]
    },


    2: {
        title: "Moon Survival",
        icon: "🌕",
        description:
            "You have reached the Moon! Keep yourself and your crew alive.",

        tasks: [

            {
                title: "Maintain Life Support",
                icon: "🫁",
                description:
                    "Keep the Moon base life-support system running.",
                subtasks: [
                    "📊 Check the Oxygen",
                    "🔧 Fix the Leak",
                    "🎛️ Restart the System"
                ]
            },

            {
                title: "Grow Food",
                icon: "🌱",
                description:
                    "Grow enough food to keep the crew healthy.",
                subtasks: [
                    "🌱 Plant the Seeds",
                    "💧 Give Water",
                    "💡 Turn on the Lights"
                ]
            },

            {
                title: "Save Power",
                icon: "⚡",
                description:
                    "Manage limited electricity during a power shortage.",
                subtasks: [
                    "🔎 Find the Problem",
                    "🔌 Turn Off Systems",
                    "⚡ Balance the Power"
                ]
            }

        ]
    },


    3: {
        title: "Return to Earth",
        icon: "🚀",
        description:
            "Survive the final challenges and prepare your spacecraft for the journey home.",

        tasks: [

            {
                title: "Survive a Radiation Storm",
                icon: "☢️",
                description:
                    "Find the safest shelter before the radiation storm arrives.",
                subtasks: [
                    "📡 Detect the Storm",
                    "🛡️ Find the Safe Zone",
                    "🏃 Reach the Shelter"
                ]
            },

            {
                title: "Manage Food Supplies",
                icon: "🌱",
                description:
                    "Ration your remaining food until departure.",
                subtasks: [
                    "🔢 Count the Food",
                    "📦 Pack Supplies",
                    "🍎 Ration the Food"
                ]
            },

            {
                title: "Launch Back to Earth",
                icon: "🚀",
                description:
                    "Prepare the spacecraft and launch safely back to Earth.",
                subtasks: [
                    "🛰️ Check Systems",
                    "📦 Load Supplies",
                    "🚀 Launch Rocket"
                ]
            }

        ]
    }

};


/* =========================================================
   GAME STATE
========================================================= */

const game = {

    name: "",

    characterIndex: 0,

    mode: "basic",

    energy: 100,

    experience: 0,

    unlockedLevel: 1,

    completedTasks: {
        1: [],
        2: [],
        3: []
    },

    currentLevel: 1,

    currentTask: 0,

    currentSubtask: 0,

    timer: 60,

    timerInterval: null,

    taskEnergySpent: 0,

    temporaryData: {},

    taskCompleted: false

};


/* =========================================================
   DOM HELPERS
========================================================= */

function $(id) {

    return document.getElementById(id);

}


function safeText(id, value) {

    const element = $(id);

    if (element) {
        element.textContent = value;
    }

}


function safeBar(id, value) {

    const element = $(id);

    if (!element) {
        return;
    }

    element.style.width =
        `${Math.max(0, Math.min(100, value))}%`;

}


function showScreen(id) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {

            screen.classList.remove("active");

        });

    const screen = $(id);

    if (!screen) {
        return;
    }

    screen.classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   OLD UI CLEANUP
========================================================= */

function hideUnusedUI() {

    /*
       Immunity is completely removed from gameplay.
       If old immunity elements still exist in HTML,
       hide them.
    */

    const immunityIDs = [

        "levelImmunityBar",
        "levelImmunityText",

        "immunityBar",
        "immunityText",

        "gameImmunityBar",
        "gameImmunityText"

    ];

    immunityIDs.forEach(id => {

        const element = $(id);

        if (!element) {
            return;
        }

        const parent =
            element.closest(
                ".stat-card, .stat-item, .hud-stat, .bar-container"
            );

        if (parent) {
            parent.style.display = "none";
        } else {
            element.style.display = "none";
        }

    });


    /*
       Trainee ID is no longer required.
       Hide old ID fields if they are still in the HTML.
    */

    const traineeIDs = [

        "traineeId",
        "profileId",
        "hudId"

    ];

    traineeIDs.forEach(id => {

        const element = $(id);

        if (!element) {
            return;
        }

        const parent =
            element.closest(
                ".input-group, .profile-stat, .hud-stat"
            );

        if (parent) {
            parent.style.display = "none";
        } else {
            element.style.display = "none";
        }

    });

}


/* =========================================================
   SHOOTING STARS
========================================================= */

function createShootingStar() {

    const container =
        $("shootingStars");

    if (!container) {
        return;
    }

    const star =
        document.createElement("div");

    star.className =
        "shooting-star";

    if (Math.random() < 0.5) {

        star.style.right =
            `${Math.random() * 25 + 5}%`;

        star.style.top =
            `${Math.random() * 45 + 5}%`;

    } else {

        star.style.left =
            `${Math.random() * 25 + 5}%`;

        star.style.top =
            `${Math.random() * 45 + 5}%`;

        star.style.transform =
            "rotate(35deg)";

    }

    container.appendChild(star);

    setTimeout(() => {

        if (star.parentNode) {
            star.remove();
        }

    }, 2000);

}


setInterval(
    createShootingStar,
    10000
);


/* =========================================================
   START SCREEN
========================================================= */

const startButton =
    $("startButton");

if (startButton) {

    startButton.addEventListener(
        "click",
        startLaunchSequence
    );

}


function startLaunchSequence() {

    showScreen(
        "countdownScreen"
    );

    const rocket =
        $("countdownRocket");

    if (rocket) {

        rocket.style.transform =
            "translateY(0)";

    }

    let number = 3;

    safeText(
        "countdownNumber",
        number
    );

    safeText(
        "countdownCaption",
        "Prepare for launch!"
    );

    safeText(
        "countdownMessage",
        ""
    );

    const interval =
        setInterval(() => {

            number--;

            if (number > 0) {

                safeText(
                    "countdownNumber",
                    number
                );

                const numberElement =
                    $("countdownNumber");

                if (numberElement) {

                    numberElement.style.animation =
                        "none";

                    void numberElement.offsetWidth;

                    numberElement.style.animation =
                        "countdownPop 1s ease";

                }

            } else {

                clearInterval(interval);

                safeText(
                    "countdownNumber",
                    "🚀"
                );

                safeText(
                    "countdownCaption",
                    "Are you ready for the mission buddy?"
                );

                safeText(
                    "countdownMessage",
                    "Launching toward the Moon..."
                );

                if (rocket) {

                    rocket.style.transform =
                        "translateY(-300px)";

                }

                setTimeout(() => {

                    showScreen(
                        "creationScreen"
                    );

                }, 1800);

            }

        }, 1000);

}


/* =========================================================
   CHARACTER SELECTION
========================================================= */

document
    .querySelectorAll(".character-choice")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const index =
                    Number(button.dataset.index);

                if (
                    Number.isNaN(index) ||
                    !characters[index]
                ) {
                    return;
                }

                game.characterIndex =
                    index;

                document
                    .querySelectorAll(".character-choice")
                    .forEach(b => {

                        b.classList.remove(
                            "selected"
                        );

                    });

                button.classList.add(
                    "selected"
                );

                updateCharacterPreview();

            }
        );

    });


function updateCharacterPreview() {

    const character =
        characters[game.characterIndex];

    if (!character) {
        return;
    }

    safeText(
        "characterDisplay",
        character.emoji
    );

    safeText(
        "characterPreviewName",
        character.name
    );

    safeText(
        "previewTechnical",
        `${character.technical}/5`
    );

    safeText(
        "previewEndurance",
        `${character.endurance}/5`
    );

    safeText(
        "technicalStars",
        stars(character.technical)
    );

    safeText(
        "enduranceStars",
        stars(character.endurance)
    );

}


function stars(value) {

    return (
        "⭐".repeat(value) +
        "☆".repeat(5 - value)
    );

}


/* =========================================================
   GAME MODE
========================================================= */

document
    .querySelectorAll(".mode-card")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const selectedMode =
                    button.dataset.mode;

                if (
                    selectedMode !== "basic" &&
                    selectedMode !== "advanced"
                ) {
                    return;
                }

                game.mode =
                    selectedMode;

                document
                    .querySelectorAll(".mode-card")
                    .forEach(b => {

                        b.classList.remove(
                            "selected"
                        );

                    });

                button.classList.add(
                    "selected"
                );

            }
        );

    });


/* =========================================================
   CREATE ASTRONAUT
========================================================= */

const createAstronautButton =
    $("createAstronautButton");

if (createAstronautButton) {

    createAstronautButton.addEventListener(
        "click",
        createAstronaut
    );

}


function createAstronaut() {

    const nameInput =
        $("traineeName");

    const name =
        nameInput
            ? nameInput.value.trim()
            : "";

    /*
       No trainee ID is required.
    */

    if (!name) {

        alert(
            "Please enter your astronaut name! 👩‍🚀"
        );

        return;

    }

    game.name =
        name;

    game.energy =
        100;

    game.experience =
        0;

    game.unlockedLevel =
        1;

    game.completedTasks = {
        1: [],
        2: [],
        3: []
    };

    game.currentLevel =
        1;

    game.currentTask =
        0;

    game.currentSubtask =
        0;

    game.timer =
        60;

    game.taskCompleted =
        false;

    clearInterval(
        game.timerInterval
    );

    game.timerInterval =
        null;

    game.temporaryData =
        {};

    updateProfile();

    showScreen(
        "levelScreen"
    );

}


/* =========================================================
   PROFILE
========================================================= */

function updateProfile() {

    const character =
        characters[game.characterIndex];

    if (!character) {
        return;
    }

    safeText(
        "profileAvatar",
        character.emoji
    );

    safeText(
        "profileName",
        game.name
    );

    safeText(
        "profileMode",
        game.mode.toUpperCase()
    );

    updateLevelStats();

    updateLevelLocks();

}


function updateLevelStats() {

    safeBar(
        "levelEnergyBar",
        game.energy
    );

    safeBar(
        "levelExperienceBar",
        Math.min(
            game.experience,
            100
        )
    );

    safeText(
        "levelEnergyText",
        `${game.energy}/100`
    );

    safeText(
        "levelExperienceText",
        `${game.experience} XP`
    );

}


/* =========================================================
   LEVEL LOCKING
========================================================= */

function updateLevelLocks() {

    for (
        let level = 1;
        level <= 3;
        level++
    ) {

        const card =
            $(`levelCard${level}`);

        if (!card) {
            continue;
        }

        const label =
            card.querySelector(
                ".unlock-label"
            );

        if (
            level <= game.unlockedLevel
        ) {

            card.classList.remove(
                "locked"
            );

            card.classList.add(
                "unlocked"
            );

            if (label) {

                label.textContent =
                    "🔓 UNLOCKED";

            }

        } else {

            card.classList.remove(
                "unlocked"
            );

            card.classList.add(
                "locked"
            );

            if (label) {

                label.textContent =
                    "🔒 LOCKED";

            }

        }

    }

}


document
    .querySelectorAll(".level-card")
    .forEach(card => {

        card.addEventListener(
            "click",
            () => {

                const level =
                    Number(card.dataset.level);

                if (
                    !levels[level]
                ) {
                    return;
                }

                if (
                    level >
                    game.unlockedLevel
                ) {
                    return;
                }

                openLevel(level);

            }
        );

    });


/* =========================================================
   OPEN LEVEL
========================================================= */

function openLevel(level) {

    if (!levels[level]) {
        return;
    }

    game.currentLevel =
        level;

    game.currentTask =
        0;

    game.currentSubtask =
        0;

    game.taskCompleted =
        false;

    clearInterval(
        game.timerInterval
    );

    game.timerInterval =
        null;

    clearSubtaskEffects();

    safeText(
        "introIcon",
        levels[level].icon
    );

    safeText(
        "introLevel",
        `LEVEL ${level}`
    );

    safeText(
        "introTitle",
        levels[level].title
    );

    safeText(
        "introDescription",
        levels[level].description
    );

    const messages = {

        1:
            "Welcome to Earth Workshop, Cadet! I will teach you the skills you need for your mission.",

        2:
            "Welcome to the Moon! Stay calm, conserve your resources, and keep your crew safe.",

        3:
            "This is your final challenge! Complete the mission and bring everyone safely home."

    };

    safeText(
        "robotIntroText",
        messages[level]
    );

    showScreen(
        "levelIntroScreen"
    );

}


const beginLevelButton =
    $("beginLevelButton");

if (beginLevelButton) {

    beginLevelButton.addEventListener(
        "click",
        () => {

            /*
               Each level starts with full energy.
               There is no immunity system.
            */

            game.energy =
                100;

            game.currentTask =
                0;

            game.currentSubtask =
                0;

            updateProfile();

            renderTaskScreen();

            showScreen(
                "taskScreen"
            );

        }
    );

}


/* =========================================================
   TASK SCREEN
========================================================= */

function renderTaskScreen() {

    const level =
        levels[game.currentLevel];

    if (!level) {
        return;
    }

    safeText(
        "taskLevelBadge",
        `LEVEL ${game.currentLevel}`
    );

    safeText(
        "taskLevelTitle",
        level.title
    );

    const character =
        characters[game.characterIndex];

    if (character) {

        safeText(
            "hudAvatar",
            character.emoji
        );

    }

    safeText(
        "hudName",
        game.name
    );

    updateGameplayHUD();

    const grid =
        $("taskGrid");

    if (!grid) {
        return;
    }

    grid.innerHTML = "";

    level.tasks.forEach(
        (task, index) => {

            const unlocked =
                index === 0 ||
                game.completedTasks[
                    game.currentLevel
                ].includes(index - 1);

            const completed =
                game.completedTasks[
                    game.currentLevel
                ].includes(index);

            const card =
                document.createElement("button");

            card.className =
                `task-card ${
                    unlocked
                        ? "unlocked"
                        : "locked"
                }`;

            card.disabled =
                !unlocked;

            card.innerHTML = `

                <div class="task-icon">
                    ${task.icon}
                </div>

                <div class="task-number">
                    TASK ${index + 1}
                </div>

                <h3>
                    ${task.title}
                </h3>

                <p>
                    ${task.description}
                </p>

                <div class="task-subtasks">

                    ${task.subtasks
                        .map(
                            sub =>
                                `<div>${sub}</div>`
                        )
                        .join("")
                    }

                </div>

                <span class="task-start">

                    ${
                        completed
                            ? "✅ COMPLETED"
                            : unlocked
                                ? "▶ START"
                                : "🔒 LOCKED"
                    }

                </span>

            `;

            if (unlocked) {

                card.addEventListener(
                    "click",
                    () => {

                        startTask(index);

                    }
                );

            }

            grid.appendChild(
                card
            );

        }
    );

}


const taskBackButton =
    $("taskBackButton");

if (taskBackButton) {

    taskBackButton.addEventListener(
        "click",
        () => {

            clearInterval(
                game.timerInterval
            );

            clearSubtaskEffects();

            updateProfile();

            showScreen(
                "levelScreen"
            );

        }
    );

}


/* =========================================================
   START TASK
========================================================= */

function startTask(taskIndex) {

    const level =
        levels[game.currentLevel];

    if (
        !level ||
        !level.tasks[taskIndex]
    ) {
        return;
    }

    clearInterval(
        game.timerInterval
    );

    clearSubtaskEffects();

    game.currentTask =
        taskIndex;

    game.currentSubtask =
        0;

    game.timer =
        60;

    game.taskEnergySpent =
        0;

    game.taskCompleted =
        false;

    game.temporaryData =
        {};

    const task =
        level.tasks[taskIndex];

    safeText(
        "gameplayLevel",
        `LEVEL ${game.currentLevel}`
    );

    safeText(
        "gameplayTaskTitle",
        task.title
    );

    const character =
        characters[game.characterIndex];

    if (character) {

        safeText(
            "astronautPlayer",
            character.emoji
        );

    }

    updateGameplayHUD();

    showScreen(
        "gameplayScreen"
    );

    renderSubtask();

    updateTimerVisibility();

    /*
       Basic mode:
       No timer.

       Advanced mode:
       60-second timer.
    */

    if (
        game.mode === "advanced"
    ) {

        startTimer();

    }

}


/* =========================================================
   TIMER VISIBILITY
========================================================= */

function updateTimerVisibility() {

    const timerText =
        $("timerText");

    const timerContainer =
        $("timerContainer");

    const gameTimer =
        $("gameTimer");

    const taskTimer =
        $("taskTimer");

    const elements = [
        timerText,
        timerContainer,
        gameTimer,
        taskTimer
    ];

    elements.forEach(element => {

        if (!element) {
            return;
        }

        const parent =
            element.closest(
                ".timer-container, .timer-box, .game-timer, .task-timer"
            );

        if (
            game.mode === "basic"
        ) {

            if (parent) {

                parent.style.display =
                    "none";

            } else {

                element.style.display =
                    "none";

            }

        } else {

            if (parent) {

                parent.style.display =
                    "";

            } else {

                element.style.display =
                    "";

            }

        }

    });

}


/* =========================================================
   TIMER
========================================================= */

function startTimer() {

    clearInterval(
        game.timerInterval
    );

    if (
        game.mode !== "advanced"
    ) {

        return;

    }

    game.timer =
        60;

    safeText(
        "timerText",
        game.timer
    );

    game.timerInterval =
        setInterval(() => {

            if (
                game.mode !== "advanced" ||
                game.taskCompleted
            ) {

                clearInterval(
                    game.timerInterval
                );

                game.timerInterval =
                    null;

                return;

            }

            game.timer--;

            safeText(
                "timerText",
                game.timer
            );

            if (
                game.timer <= 0
            ) {

                clearInterval(
                    game.timerInterval
                );

                game.timerInterval =
                    null;

                failCurrentTask(
                    "Time is up! Restart the task and try again."
                );

            }

        }, 1000);

}


/* =========================================================
   HUD
========================================================= */

function updateGameplayHUD() {

    safeText(
        "energyText",
        game.energy
    );

    safeText(
        "experienceText",
        game.experience
    );

    safeText(
        "gameEnergyText",
        game.energy
    );

    safeText(
        "gameExperienceText",
        `${game.experience} XP`
    );

    safeBar(
        "energyBar",
        game.energy
    );

    safeBar(
        "gameEnergyBar",
        game.energy
    );

}


/* =========================================================
   ENERGY
========================================================= */

function changeEnergy(
    amount,
    allowFailure = true
) {

    if (
        game.taskCompleted &&
        allowFailure
    ) {

        return false;

    }

    const oldEnergy =
        game.energy;

    game.energy =
        Math.max(
            0,
            Math.min(
                100,
                game.energy + amount
            )
        );

    if (
        amount < 0
    ) {

        game.taskEnergySpent +=
            Math.min(
                Math.abs(amount),
                oldEnergy
            );

    }

    updateGameplayHUD();

    if (
        allowFailure &&
        game.energy <= 0 &&
        !game.taskCompleted
    ) {

        failCurrentTask(
            "You ran out of energy. Rest up and try again!"
        );

        return false;

    }

    return true;

}


/* =========================================================
   EXPERIENCE
========================================================= */

function gainExperience(amount) {

    game.experience +=
        amount;

    updateGameplayHUD();

}


/* =========================================================
   ROBOT MESSAGE
========================================================= */

function robotMessage(text) {

    safeText(
        "robotInstruction",
        text
    );

}


/* =========================================================
   SUBTASK SYSTEM
========================================================= */

function renderSubtask() {

    if (
        game.taskCompleted
    ) {
        return;
    }

    const level =
        game.currentLevel;

    const levelData =
        levels[level];

    if (!levelData) {
        return;
    }

    const task =
        levelData.tasks[
            game.currentTask
        ];

    if (!task) {
        return;
    }

    const subtask =
        game.currentSubtask;

    if (
        subtask < 0 ||
        subtask >= task.subtasks.length
    ) {
        return;
    }

    const miniGame =
        $("miniGame");

    if (!miniGame) {
        return;
    }

    clearSubtaskEffects();

    game.temporaryData =
        {};

    miniGame.innerHTML = "";

    const world =
        $("gameWorld");

    if (world) {

        world.dataset.level =
            level;

        world.dataset.task =
            game.currentTask;

        world.dataset.subtask =
            subtask;

        createWorldDecoration(
            level,
            game.currentTask,
            subtask
        );

    }

    robotMessage(
        getInstruction(
            level,
            game.currentTask,
            subtask
        )
    );

    const header =
        document.createElement("div");

    header.className =
        "subtask-header";

    header.innerHTML = `

        <h3>
            ${task.subtasks[subtask]}
        </h3>

        <span>
            STEP ${subtask + 1} / 3
        </span>

    `;

    miniGame.appendChild(
        header
    );

    createMiniGame(
        level,
        game.currentTask,
        subtask
    );

}


/* =========================================================
   ROBOT INSTRUCTIONS
========================================================= */

function getInstruction(
    level,
    task,
    subtask
) {

    const instructions = {

        "1-0-0":
            "First, connect each matching wire to repair the oxygen circuit.",

        "1-0-1":
            "Rotate the pipe pieces until the oxygen pipe forms a complete path.",

        "1-0-2":
            "Move the oxygen level into the green safe zone.",

        "1-1-0":
            "Choose the material that provides the strongest radiation protection.",

        "1-1-1":
            "Drag the shield into the protected area.",

        "1-1-2":
            "Move carefully and dodge the incoming asteroids!",

        "1-2-0":
            "Find the location receiving enough sunlight.",

        "1-2-1":
            "Drag the solar panel onto the correct location.",

        "1-2-2":
            "Connect the solar panel to the battery.",

        "2-0-0":
            "Adjust the oxygen level until it reaches the safe zone.",

        "2-0-1":
            "Find the leaking pipe and seal it.",

        "2-0-2":
            "Press the restart controls in the correct order.",

        "2-1-0":
            "Place the seeds into the glowing planting spots.",

        "2-1-1":
            "Give the plants the correct amount of water.",

        "2-1-2":
            "Set the greenhouse lights to the correct level.",

        "2-2-0":
            "Find which system is consuming too much electricity.",

        "2-2-1":
            "Turn off systems that are not essential.",

        "2-2-2":
            "Balance the electricity between the remaining systems.",

        "3-0-0":
            "A radiation storm is approaching. Detect the warning.",

        "3-0-1":
            "Choose the area with the strongest radiation shielding.",

        "3-0-2":
            "Reach the shelter while avoiding the dangerous radiation zones.",

        "3-1-0":
            "Count how many food supplies remain.",

        "3-1-1":
            "Choose enough food for the return journey.",

        "3-1-2":
            "Distribute food fairly among the crew.",

        "3-2-0":
            "Check every essential spacecraft system.",

        "3-2-1":
            "Load the required supplies into the spacecraft.",

        "3-2-2":
            "Complete the launch sequence in the correct order."

    };

    return (
        instructions[
            `${level}-${task}-${subtask}`
        ] ||
        "Complete the challenge carefully, Cadet!"
    );

}


/* =========================================================
   WORLD DECORATIONS
========================================================= */

function createWorldDecoration(
    level,
    task,
    subtask
) {

    const object =
        $("worldObject");

    if (!object) {
        return;
    }

    object.innerHTML = "";

    object.style.left =
        `${15 + Math.random() * 65}%`;

    object.style.bottom =
        `${70 + Math.random() * 70}px`;

    const decorations = {

        "1-0":
            ["🛰️", "🔧", "🫁"],

        "1-1":
            ["🛡️", "☄️", "🌕"],

        "1-2":
            ["☀️", "🔋", "🛰️"],

        "2-0":
            ["🫁", "🔧", "🎛️"],

        "2-1":
            ["🌱", "💧", "💡"],

        "2-2":
            ["⚡", "🔌", "🔋"],

        "3-0":
            ["☢️", "🛡️", "🏠"],

        "3-1":
            ["🍎", "📦", "🥫"],

        "3-2":
            ["🛰️", "📦", "🚀"]

    };

    const key =
        `${level}-${task}`;

    const decoration =
        decorations[key];

    if (
        decoration &&
        decoration[subtask]
    ) {

        object.textContent =
            decoration[subtask];

    } else {

        object.textContent =
            "✨";

    }

}


/* =========================================================
   MINI GAME FACTORY
========================================================= */

function createMiniGame(
    level,
    task,
    subtask
) {

    if (level === 1 && task === 0) {

        createOxygenGame(subtask);
        return;

    }

    if (level === 1 && task === 1) {

        createRadiationShieldGame(subtask);
        return;

    }

    if (level === 1 && task === 2) {

        createPowerGame(subtask);
        return;

    }

    if (level === 2 && task === 0) {

        createLifeSupportGame(subtask);
        return;

    }

    if (level === 2 && task === 1) {

        createFoodGrowingGame(subtask);
        return;

    }

    if (level === 2 && task === 2) {

        createSavePowerGame(subtask);
        return;

    }

    if (level === 3 && task === 0) {

        createRadiationStormGame(subtask);
        return;

    }

    if (level === 3 && task === 1) {

        createFoodSupplyGame(subtask);
        return;

    }

    if (level === 3 && task === 2) {

        createLaunchGame(subtask);
        return;

    }

}


/* =========================================================
   GENERIC SUBTASK COMPLETION
========================================================= */

function completeSubtask() {

    if (
        game.taskCompleted
    ) {
        return;
    }

    clearSubtaskEffects();

    const energyOK =
        changeEnergy(
            -7,
            true
        );

    if (
        !energyOK ||
        game.taskCompleted
    ) {
        return;
    }

    game.currentSubtask++;

    if (
        game.currentSubtask >= 3
    ) {

        completeCurrentTask();

        return;

    }

    renderSubtask();

}


/* =========================================================
   TASK 1 - OXYGEN SYSTEM
========================================================= */

function createOxygenGame(subtask) {

    if (subtask === 0) {

        const board =
            document.createElement("div");

        board.className =
            "wire-board";

        const colors =
            ["🔴", "🔵", "🟢", "🟡"];

        colors.forEach(color => {

            const button =
                document.createElement("button");

            button.className =
                "wire";

            button.textContent =
                color;

            button.addEventListener(
                "click",
                () => {

                    if (
                        game.taskCompleted
                    ) {
                        return;
                    }

                    if (
                        button.classList.contains(
                            "connected"
                        )
                    ) {
                        return;
                    }

                    button.classList.add(
                        "connected"
                    );

                    const energyOK =
                        changeEnergy(-1);

                    if (
                        !energyOK ||
                        game.taskCompleted
                    ) {
                        return;
                    }

                    const connected =
                        document.querySelectorAll(
                            ".wire.connected"
                        ).length;

                    if (
                        connected === 4
                    ) {

                        robotMessage(
                            "Excellent! The oxygen circuit is working."
                        );

                        completeSubtask();

                    }

                }
            );

            board.appendChild(
                button
            );

        });

        $("miniGame").appendChild(
            board
        );

        return;
    }


    if (subtask === 1) {

        const grid =
            document.createElement("div");

        grid.className =
            "pipe-grid";

        for (
            let i = 0;
            i < 8;
            i++
        ) {

            const pipe =
                document.createElement("button");

            pipe.className =
                "pipe";

            pipe.textContent =
                i % 2 === 0
                    ? "╋"
                    : "┗";

            pipe.addEventListener(
                "click",
                () => {

                    if (
                        game.taskCompleted
                    ) {
                        return;
                    }

                    if (
                        pipe.dataset.rotated === "true"
                    ) {
                        return;
                    }

                    pipe.dataset.rotated =
                        "true";

                    pipe.style.transform =
                        `rotate(${
                            Math.floor(
                                Math.random() * 4
                            ) * 90
                        }deg)`;

                    const energyOK =
                        changeEnergy(-1);

                    if (
                        !energyOK ||
                        game.taskCompleted
                    ) {
                        return;
                    }

                    const pipes =
                        [
                            ...grid.querySelectorAll(
                                ".pipe"
                            )
                        ];

                    if (
                        pipes.every(
                            p =>
                                p.dataset.rotated === "true"
                        )
                    ) {

                        completeSubtask();

                    }

                }
            );

            grid.appendChild(
                pipe
            );

        }

        $("miniGame").appendChild(
            grid
        );

        return;
    }


    if (subtask === 2) {

        const container =
            document.createElement("div");

        container.className =
            "oxygen-control";

        container.innerHTML = `

            <div class="gauge">

                <div class="gauge-safe"></div>

                <div
                    class="gauge-value"
                    id="oxygenValue"
                >
                    50%
                </div>

            </div>

            <input
                id="oxygenSlider"
                type="range"
                min="0"
                max="100"
                value="50"
            >

            <p class="instruction-text">
                Safe zone: 35% - 65%
            </p>

        `;

        $("miniGame").appendChild(
            container
        );

        const slider =
            $("oxygenSlider");

        if (!slider) {
            return;
        }

        slider.addEventListener(
            "input",
            () => {

                safeText(
                    "oxygenValue",
                    `${slider.value}%`
                );

            }
        );

        const button =
            createActionButton(
                "SET OXYGEN",
                () => {

                    const value =
                        Number(
                            slider.value
                        );

                    if (
                        value >= 35 &&
                        value <= 65
                    ) {

                        completeSubtask();

                    } else {

                        wrongAttempt(
                            "The oxygen level is outside the safe zone."
                        );

                    }

                }
            );

        container.appendChild(
            button
        );

    }

}


/* =========================================================
   TASK 2 - RADIATION SHIELDING
========================================================= */

function createRadiationShieldGame(subtask) {

    if (subtask === 0) {

        const grid =
            document.createElement("div");

        grid.className =
            "material-grid";

        const materials = [
            ["🧱", "Lead", true],
            ["📦", "Cardboard", false],
            ["🧻", "Paper", false]
        ];

        materials.forEach(material => {

            const button =
                document.createElement("button");

            button.className =
                "material";

            button.innerHTML =
                `${material[0]}<br>${material[1]}`;

            button.addEventListener(
                "click",
                () => {

                    if (
                        game.taskCompleted
                    ) {
                        return;
                    }

                    if (
                        material[2]
                    ) {

                        button.classList.add(
                            "correct"
                        );

                        completeSubtask();

                    } else {

                        wrongAttempt(
                            "That material is too weak for radiation protection."
                        );

                    }

                }
            );

            grid.appendChild(
                button
            );

        });

        $("miniGame").appendChild(
            grid
        );

        return;
    }


    if (subtask === 1) {

        const area =
            document.createElement("div");

        area.className =
            "shield-zone";

        area.innerHTML = `

            <div
                class="draggable-shield"
                draggable="true"
            >
                🛡️ SHIELD
            </div>

            <div
                class="drop-zone"
                id="shieldDrop"
            >
                DROP HERE
            </div>

        `;

        $("miniGame").appendChild(
            area
        );

        const shield =
            area.querySelector(
                ".draggable-shield"
            );

        const drop =
            $("shieldDrop");

        if (!shield || !drop) {
            return;
        }

        shield.addEventListener(
            "dragstart",
            event => {

                if (event.dataTransfer) {

                    event.dataTransfer.setData(
                        "text/plain",
                        "shield"
                    );

                }

            }
        );

        drop.addEventListener(
            "dragover",
            event => {

                event.preventDefault();

            }
        );

        drop.addEventListener(
            "drop",
            event => {

                event.preventDefault();

                if (
                    game.taskCompleted
                ) {
                    return;
                }

                drop.textContent =
                    "🛡️ SHIELD PLACED";

                drop.style.borderColor =
                    "#72e6a5";

                completeSubtask();

            }
        );

        return;
    }


    if (subtask === 2) {

        const zone =
            document.createElement("div");

        zone.className =
            "asteroid-zone";

        zone.innerHTML = `

            <button id="dodgeButton">
                🏃 DODGE
            </button>

        `;

        $("miniGame").appendChild(
            zone
        );

        const dodgeButton =
            $("dodgeButton");

        if (!dodgeButton) {
            return;
        }

        let dodged = 0;

        const spawn =
            setInterval(() => {

                if (
                    game.taskCompleted
                ) {
                    return;
                }

                const asteroid =
                    document.createElement("div");

                asteroid.className =
                    "asteroid";

                asteroid.textContent =
                    "☄️";

                asteroid.style.top =
                    `${Math.random() * 60}px`;

                asteroid.style.left =
                    "100%";

                zone.appendChild(
                    asteroid
                );

                setTimeout(() => {

                    if (
                        asteroid.parentNode
                    ) {
                        asteroid.remove();
                    }

                }, 2000);

            }, 800);

        game.temporaryData.interval =
            spawn;

        dodgeButton.addEventListener(
            "click",
            () => {

                if (
                    game.taskCompleted
                ) {
                    return;
                }

                dodged++;

                if (
                    dodged >= 8
                ) {

                    clearInterval(
                        spawn
                    );

                    game.temporaryData.interval =
                        null;

                    completeSubtask();

                }

            }
        );

    }

}


/* =========================================================
   TASK 3 - GENERATE POWER
========================================================= */

function createPowerGame(subtask) {

    if (subtask === 0) {

        const grid =
            document.createElement("div");

        grid.className =
            "location-grid";

        for (
            let i = 0;
            i < 8;
            i++
        ) {

            const button =
                document.createElement("button");

            button.className =
                "location";

            button.textContent =
                i === 5
                    ? "☀️"
                    : "🌑";

            button.addEventListener(
                "click",
                () => {

                    if (
                        game.taskCompleted
                    ) {
                        return;
                    }

                    if (
                        i === 5
                    ) {

                        button.classList.add(
                            "correct"
                        );

                        completeSubtask();

                    } else {

                        wrongAttempt(
                            "This location does not receive enough sunlight."
                        );

                    }

                }
            );

            grid.appendChild(
                button
            );

        }

        $("miniGame").appendChild(
            grid
        );

        return;
    }


    if (subtask === 1) {

        const area =
            document.createElement("div");

        area.className =
            "panel-area";

        area.innerHTML = `

            <div
                class="solar-panel"
                id="solarPanel"
                draggable="true"
                style="left:20px;top:30px;"
            >
                ☀️ SOLAR PANEL
            </div>

            <div
                class="drop-zone"
                id="panelDrop"
                style="position:absolute;right:30px;top:25px;"
            >
                PANEL ZONE
            </div>

        `;

        $("miniGame").appendChild(
            area
        );

        const panel =
            $("solarPanel");

        const drop =
            $("panelDrop");

        if (!panel || !drop) {
            return;
        }

        panel.addEventListener(
            "dragstart",
            event => {

                if (event.dataTransfer) {

                    event.dataTransfer.setData(
                        "text/plain",
                        "panel"
                    );

                }

            }
        );

        drop.addEventListener(
            "dragover",
            event => {

                event.preventDefault();

            }
        );

        drop.addEventListener(
            "drop",
            event => {

                event.preventDefault();

                if (
                    game.taskCompleted
                ) {
                    return;
                }

                drop.textContent =
                    "☀️ PANEL READY";

                completeSubtask();

            }
        );

        return;
    }


    if (subtask === 2) {

        const container =
            document.createElement("div");

        container.className =
            "power-connection";

        container.innerHTML = `

            <button class="power-node">
                ☀️
            </button>

            <span>
                ───── 🔌 ─────
            </span>

            <button class="power-node">
                🔋
            </button>

        `;

        $("miniGame").appendChild(
            container
        );

        const nodes =
            container.querySelectorAll(
                ".power-node"
            );

        nodes.forEach(node => {

            node.addEventListener(
                "click",
                () => {

                    if (
                        game.taskCompleted
                    ) {
                        return;
                    }

                    node.classList.add(
                        "connected"
                    );

                    if (
                        [...nodes].every(
                            n =>
                                n.classList.contains(
                                    "connected"
                                )
                        )
                    ) {

                        completeSubtask();

                    }

                }
            );

        });

    }

}


/* =========================================================
   LEVEL 2 - LIFE SUPPORT
========================================================= */

function createLifeSupportGame(subtask) {

    if (subtask === 0) {

        createOxygenGame(2);

        return;
    }


    if (subtask === 1) {

        const grid =
            document.createElement("div");

        grid.className =
            "location-grid";

        const leaks = [
            "🔧 Pipe A",
            "🔧 Pipe B",
            "💨 Pipe C",
            "🔧 Pipe D"
        ];

        leaks.forEach(
            (pipe, index) => {

                const button =
                    document.createElement("button");

                button.className =
                    "location";

                button.textContent =
                    pipe;

                button.addEventListener(
                    "click",
                    () => {

                        if (
                            game.taskCompleted
                        ) {
                            return;
                        }

                        if (
                            index === 2
                        ) {

                            button.classList.add(
                                "correct"
                            );

                            button.textContent =
                                "✅ SEALED";

                            completeSubtask();

                        } else {

                            wrongAttempt(
                                "No leak here. Keep looking!"
                            );

                        }

                    }
                );

                grid.appendChild(
                    button
                );

            }
        );

        $("miniGame").appendChild(
            grid
        );

        return;
    }


    if (subtask === 2) {

        const container =
            document.createElement("div");

        container.className =
            "life-support";

        const sequence =
            [2, 0, 1];

        game.temporaryData.sequence =
            [];

        const display =
            document.createElement("div");

        display.className =
            "sequence-display";

        display.textContent =
            "Restart sequence: 3 controls";

        container.appendChild(
            display
        );

        ["⚡", "🫁", "🔋"].forEach(
            (icon, index) => {

                const button =
                    document.createElement("button");

                button.className =
                    "control-button";

                button.textContent =
                    icon;

                button.addEventListener(
                    "click",
                    () => {

                        if (
                            game.taskCompleted
                        ) {
                            return;
                        }

                        const current =
                            game.temporaryData.sequence.length;

                        if (
                            index === sequence[current]
                        ) {

                            game.temporaryData.sequence.push(
                                index
                            );

                            button.style.borderColor =
                                "#72e6a5";

                            if (
                                game.temporaryData.sequence.length ===
                                sequence.length
                            ) {

                                completeSubtask();

                            }

                        } else {

                            game.temporaryData.sequence =
                                [];

                            wrongAttempt(
                                "Wrong control. The sequence reset!"
                            );

                        }

                    }
                );

                container.appendChild(
                    button
                );

            }
        );

        $("miniGame").appendChild(
            container
        );

    }

}


/* =========================================================
   LEVEL 2 - GROW FOOD
========================================================= */

function createFoodGrowingGame(subtask) {

    if (subtask === 0) {

        const grid =
            document.createElement("div");

        grid.className =
            "seed-grid";

        for (
            let i = 0;
            i < 8;
            i++
        ) {

            const button =
                document.createElement("button");

            button.className =
                "seed-slot";

            button.textContent =
                "🌱";

            button.addEventListener(
                "click",
                () => {

                    if (
                        game.taskCompleted ||
                        button.dataset.planted === "true"
                    ) {
                        return;
                    }

                    button.dataset.planted =
                        "true";

                    button.style.borderColor =
                        "#72e6a5";

                    const planted =
                        grid.querySelectorAll(
                            ".seed-slot[data-planted='true']"
                        ).length;

                    if (
                        planted >= 4
                    ) {

                        completeSubtask();

                    }

                }
            );

            grid.appendChild(
                button
            );

        }

        $("miniGame").appendChild(
            grid
        );

        return;
    }


    if (subtask === 1) {

        const controls =
            document.createElement("div");

        controls.className =
            "water-controls";

        [1, 2, 3, 4].forEach(
            amount => {

                const button =
                    document.createElement("button");

                button.className =
                    "water-button";

                button.textContent =
                    `💧 ${amount}`;

                button.addEventListener(
                    "click",
                    () => {

                        if (
                            game.taskCompleted
                        ) {
                            return;
                        }

                        if (
                            amount === 2
                        ) {

                            button.style.borderColor =
                                "#72e6a5";

                            completeSubtask();

                        } else {

                            wrongAttempt(
                                "That amount is not quite right."
                            );

                        }

                    }
                );

                controls.appendChild(
                    button
                );

            }
        );

        $("miniGame").appendChild(
            controls
        );

        return;
    }


    if (subtask === 2) {

        const slider =
            document.createElement("input");

        slider.type =
            "range";

        slider.min =
            "0";

        slider.max =
            "100";

        slider.value =
            "50";

        slider.style.width =
            "80%";

        const label =
            document.createElement("p");

        label.className =
            "instruction-text";

        label.textContent =
            "Greenhouse light: 50%";

        slider.addEventListener(
            "input",
            () => {

                label.textContent =
                    `Greenhouse light: ${slider.value}%`;

            }
        );

        $("miniGame").appendChild(
            label
        );

        $("miniGame").appendChild(
            slider
        );

        $("miniGame").appendChild(
            createActionButton(
                "SET LIGHTS",
                () => {

                    const value =
                        Number(slider.value);

                    if (
                        value >= 45 &&
                        value <= 55
                    ) {

                        completeSubtask();

                    } else {

                        wrongAttempt(
                            "The plants need a medium amount of light."
                        );

                    }

                }
            )
        );

    }

}


/* =========================================================
   LEVEL 2 - SAVE POWER
========================================================= */

function createSavePowerGame(subtask) {

    const systems = [

        "🌡️ Heater",
        "💡 Lights",
        "🛰️ Scanner",
        "🌱 Greenhouse",
        "📡 Radio",
        "🫁 Life Support"

    ];


    if (subtask === 0) {

        const grid =
            document.createElement("div");

        grid.className =
            "power-system";

        systems.forEach(
            (system, index) => {

                const button =
                    document.createElement("button");

                button.textContent =
                    system;

                button.addEventListener(
                    "click",
                    () => {

                        if (
                            game.taskCompleted
                        ) {
                            return;
                        }

                        if (
                            index === 2
                        ) {

                            button.style.borderColor =
                                "#72e6a5";

                            completeSubtask();

                        } else {

                            wrongAttempt(
                                "This system is not using too much power."
                            );

                        }

                    }
                );

                grid.appendChild(
                    button
                );

            }
        );

        $("miniGame").appendChild(
            grid
        );

        return;
    }


    if (subtask === 1) {

        const grid =
            document.createElement("div");

        grid.className =
            "power-system";

        systems.forEach(system => {

            const button =
                document.createElement("button");

            button.textContent =
                system;

            button.addEventListener(
                "click",
                () => {

                    if (
                        game.taskCompleted
                    ) {
                        return;
                    }

                    button.classList.toggle(
                        "off"
                    );

                }
            );

            grid.appendChild(
                button
            );

        });

        $("miniGame").appendChild(
            grid
        );

        $("miniGame").appendChild(
            createActionButton(
                "SAVE POWER",
                () => {

                    const off =
                        grid.querySelectorAll(
                            "button.off"
                        ).length;

                    if (
                        off >= 3
                    ) {

                        completeSubtask();

                    } else {

                        wrongAttempt(
                            "Turn off a few more non-essential systems."
                        );

                    }

                }
            )
        );

        return;
    }


    if (subtask === 2) {

        const systemsBox =
            document.createElement("div");

        systemsBox.className =
            "power-system";

        for (
            let i = 0;
            i < 3;
            i++
        ) {

            const button =
                document.createElement("button");

            button.textContent =
                `⚡ SYSTEM ${i + 1}`;

            button.addEventListener(
                "click",
                () => {

                    if (
                        game.taskCompleted
                    ) {
                        return;
                    }

                    button.classList.toggle(
                        "off"
                    );

                    const active =
                        systemsBox.querySelectorAll(
                            "button:not(.off)"
                        ).length;

                    if (
                        active === 2
                    ) {

                        completeSubtask();

                    }

                }
            );

            systemsBox.appendChild(
                button
            );

        }

        $("miniGame").appendChild(
            systemsBox
        );

    }

}


/* =========================================================
   LEVEL 3 - RADIATION STORM
========================================================= */

function createRadiationStormGame(subtask) {

    if (subtask === 0) {

        const button =
            createActionButton(
                "📡 SCAN FOR STORM",
                () => {

                    if (
                        game.taskCompleted
                    ) {
                        return;
                    }

                    button.textContent =
                        "☢️ STORM DETECTED!";

                    button.style.borderColor =
                        "#72e6a5";

                    completeSubtask();

                }
            );

        $("miniGame").appendChild(
            button
        );

        return;
    }


    if (subtask === 1) {

        const grid =
            document.createElement("div");

        grid.className =
            "safe-zone-grid";

        const zones = [

            ["Zone A", false],
            ["Zone B", true],
            ["Zone C", false]

        ];

        zones.forEach(zone => {

            const button =
                document.createElement("button");

            button.className =
                "safe-zone";

            button.textContent =
                `🛡️ ${zone[0]}`;

            button.addEventListener(
                "click",
                () => {

                    if (
                        game.taskCompleted
                    ) {
                        return;
                    }

                    if (
                        zone[1]
                    ) {

                        button.classList.add(
                            "safe"
                        );

                        completeSubtask();

                    } else {

                        wrongAttempt(
                            "The radiation level is too high here."
                        );

                    }

                }
            );

            grid.appendChild(
                button
            );

        });

        $("miniGame").appendChild(
            grid
        );

        return;
    }


    if (subtask === 2) {

        const button =
            createActionButton(
                "🏃 RUN TO SHELTER",
                () => {

                    if (
                        game.taskCompleted
                    ) {
                        return;
                    }

                    let progress =
                        Number(
                            button.dataset.progress || 0
                        );

                    progress += 25;

                    button.dataset.progress =
                        progress;

                    button.textContent =
                        `🏃 REACHING SHELTER ${progress}%`;

                    if (
                        progress >= 100
                    ) {

                        completeSubtask();

                    }

                }
            );

        $("miniGame").appendChild(
            button
        );

    }

}


/* =========================================================
   LEVEL 3 - FOOD SUPPLIES
========================================================= */

function createFoodSupplyGame(subtask) {

    if (subtask === 0) {

        const counter =
            document.createElement("div");

        counter.className =
            "food-counter";

        counter.innerHTML = `

            <div class="food-number">
                🍎 🍎 🍎 🍎 🍎
            </div>

            <p class="instruction-text">
                Count the remaining food supplies.
            </p>

        `;

        $("miniGame").appendChild(
            counter
        );

        $("miniGame").appendChild(
            createActionButton(
                "COUNT: 5",
                () => {

                    completeSubtask();

                }
            )
        );

        return;
    }


    if (subtask === 1) {

        const grid =
            document.createElement("div");

        grid.className =
            "food-options";

        const foods = [

            ["🍎", true],
            ["🥫", true],
            ["🍕", false],
            ["🍰", false]

        ];

        foods.forEach(food => {

            const button =
                document.createElement("button");

            button.className =
                "food-item";

            button.textContent =
                food[0];

            button.addEventListener(
                "click",
                () => {

                    if (
                        game.taskCompleted
                    ) {
                        return;
                    }

                    if (
                        food[1]
                    ) {

                        button.classList.toggle(
                            "selected"
                        );

                    } else {

                        wrongAttempt(
                            "That food is not suitable for the journey."
                        );

                    }

                }
            );

            grid.appendChild(
                button
            );

        });

        $("miniGame").appendChild(
            grid
        );

        $("miniGame").appendChild(
            createActionButton(
                "PACK FOOD",
                () => {

                    const selected =
                        grid.querySelectorAll(
                            ".food-item.selected"
                        ).length;

                    if (
                        selected === 2
                    ) {

                        completeSubtask();

                    } else {

                        wrongAttempt(
                            "Choose the two essential food supplies."
                        );

                    }

                }
            )
        );

        return;
    }


    if (subtask === 2) {

        const slider =
            document.createElement("input");

        slider.type =
            "range";

        slider.min =
            "0";

        slider.max =
            "100";

        slider.value =
            "50";

        slider.style.width =
            "80%";

        const label =
            document.createElement("p");

        label.className =
            "instruction-text";

        label.textContent =
            "Crew distribution: 50 / 50";

        slider.addEventListener(
            "input",
            () => {

                label.textContent =
                    `Crew distribution: ${slider.value} / ${
                        100 - Number(slider.value)
                    }`;

            }
        );

        $("miniGame").appendChild(
            label
        );

        $("miniGame").appendChild(
            slider
        );

        $("miniGame").appendChild(
            createActionButton(
                "RATION FOOD",
                () => {

                    const value =
                        Number(slider.value);

                    if (
                        value >= 45 &&
                        value <= 55
                    ) {

                        completeSubtask();

                    } else {

                        wrongAttempt(
                            "Try to keep the food distribution fair."
                        );

                    }

                }
            )
        );

    }

}


/* =========================================================
   LEVEL 3 - LAUNCH
========================================================= */

function createLaunchGame(subtask) {

    if (subtask === 0) {

        const systems = [

            "🛰️ Navigation",
            "⛽ Fuel",
            "🫁 Oxygen",
            "🔋 Battery"

        ];

        const grid =
            document.createElement("div");

        grid.className =
            "power-system";

        systems.forEach(system => {

            const button =
                document.createElement("button");

            button.textContent =
                system;

            button.addEventListener(
                "click",
                () => {

                    if (
                        game.taskCompleted
                    ) {
                        return;
                    }

                    button.classList.add(
                        "off"
                    );

                    const checked =
                        grid.querySelectorAll(
                            "button.off"
                        ).length;

                    if (
                        checked === 4
                    ) {

                        completeSubtask();

                    }

                }
            );

            grid.appendChild(
                button
            );

        });

        $("miniGame").appendChild(
            grid
        );

        return;
    }


    if (subtask === 1) {

        const grid =
            document.createElement("div");

        grid.className =
            "food-options";

        const supplies = [

            "🫁 Oxygen",
            "🍎 Food",
            "🔋 Battery",
            "💎 Toy",
            "🛠️ Tools",
            "💧 Water"

        ];

        supplies.forEach(supply => {

            const button =
                document.createElement("button");

            button.className =
                "food-item";

            button.textContent =
                supply;

            button.addEventListener(
                "click",
                () => {

                    if (
                        game.taskCompleted
                    ) {
                        return;
                    }

                    button.classList.toggle(
                        "selected"
                    );

                }
            );

            grid.appendChild(
                button
            );

        });

        $("miniGame").appendChild(
            grid
        );

        $("miniGame").appendChild(
            createActionButton(
                "LOAD SUPPLIES",
                () => {

                    const selected =
                        grid.querySelectorAll(
                            ".food-item.selected"
                        ).length;

                    if (
                        selected >= 4
                    ) {

                        completeSubtask();

                    } else {

                        wrongAttempt(
                            "The spacecraft needs more essential supplies."
                        );

                    }

                }
            )
        );

        return;
    }


    if (subtask === 2) {

        const container =
            document.createElement("div");

        container.className =
            "launch-sequence";

        const sequence =
            [0, 2, 1, 3];

        game.temporaryData.sequence =
            [];

        const icons = [
            "🔑",
            "⛽",
            "🔋",
            "🚀"
        ];

        icons.forEach(
            (icon, index) => {

                const button =
                    document.createElement("button");

                button.className =
                    "launch-step";

                button.textContent =
                    icon;

                button.addEventListener(
                    "click",
                    () => {

                        if (
                            game.taskCompleted
                        ) {
                            return;
                        }

                        const current =
                            game.temporaryData.sequence.length;

                        if (
                            index === sequence[current]
                        ) {

                            button.classList.add(
                                "completed"
                            );

                            game.temporaryData.sequence.push(
                                index
                            );

                            if (
                                game.temporaryData.sequence.length ===
                                sequence.length
                            ) {

                                completeSubtask();

                            }

                        } else {

                            game.temporaryData.sequence =
                                [];

                            container
                                .querySelectorAll(
                                    ".launch-step"
                                )
                                .forEach(
                                    b => {

                                        b.classList.remove(
                                            "completed"
                                        );

                                    }
                                );

                            wrongAttempt(
                                "Launch sequence reset. Try the correct order!"
                            );

                        }

                    }
                );

                container.appendChild(
                    button
                );

            }
        );

        $("miniGame").appendChild(
            container
        );

    }

}


/* =========================================================
   ACTION BUTTON
========================================================= */

function createActionButton(
    text,
    callback
) {

    const button =
        document.createElement("button");

    button.className =
        "primary-button";

    button.style.marginTop =
        "15px";

    button.textContent =
        text;

    button.addEventListener(
        "click",
        callback
    );

    return button;

}


/* =========================================================
   WRONG ATTEMPT
========================================================= */

function wrongAttempt(
    message
) {

    if (
        game.taskCompleted
    ) {
        return;
    }

    robotMessage(
        message
    );

    /*
       changeEnergy already records the energy spent.
       No second manual energy deduction here.
    */

    changeEnergy(
        -5
    );

}


/* =========================================================
   COMPLETE CURRENT TASK
========================================================= */

function completeCurrentTask() {

    if (
        game.taskCompleted
    ) {
        return;
    }

    game.taskCompleted =
        true;

    clearInterval(
        game.timerInterval
    );

    game.timerInterval =
        null;

    clearSubtaskEffects();

    const xpGain =
        25;

    gainExperience(
        xpGain
    );

    /*
       The final task cost should not trigger
       a failure after the task is already completed.
    */

    changeEnergy(
        -5,
        false
    );

    const taskList =
        game.completedTasks[
            game.currentLevel
        ];

    if (
        !taskList.includes(
            game.currentTask
        )
    ) {

        taskList.push(
            game.currentTask
        );

    }

    showCompletionMessage(
        xpGain
    );

}


/* =========================================================
   COMPLETION MESSAGE
========================================================= */

function showCompletionMessage(
    xpGain
) {

    const task =
        levels[
            game.currentLevel
        ].tasks[
            game.currentTask
        ];

    safeText(
        "modalIcon",
        task.icon
    );

    safeText(
        "modalTitle",
        "Great Job, Cadet! 🎉"
    );

    safeText(
        "modalText",
        getCompletionMessage(
            game.currentLevel,
            game.currentTask
        )
    );

    const modalStats =
        $("modalStats");

    if (modalStats) {

        modalStats.innerHTML = `

            <div>
                ⚡ Energy
                <strong>
                    -${game.taskEnergySpent}
                </strong>
            </div>

            <div>
                ⭐ Experience
                <strong>
                    +${xpGain} XP
                </strong>
            </div>

        `;

    }

    safeText(
        "modalButton",
        "CONTINUE 🚀"
    );

    const modal =
        $("messageModal");

    if (modal) {

        modal.classList.remove(
            "hidden"
        );

    }

}


function getCompletionMessage(
    level,
    task
) {

    const messages = {

        "1-0":
            "Amazing! Your oxygen system is safe and ready. You're learning fast!",

        "1-1":
            "Fantastic shielding work! You protected yourself from dangerous radiation.",

        "1-2":
            "Excellent! Your solar panels are producing power. Earth training complete!",

        "2-0":
            "Great work! The Moon base life-support system is running safely.",

        "2-1":
            "Wonderful! Your little Moon greenhouse is growing food for the crew.",

        "2-2":
            "Excellent power management! You saved enough electricity for the base.",

        "3-0":
            "You found shelter before the radiation storm. Great astronaut instincts!",

        "3-1":
            "Perfect rationing! The crew has enough food for the journey home.",

        "3-2":
            "All launch systems are ready. It's time to go home!"

    };

    return (
        messages[
            `${level}-${task}`
        ] ||
        "Mission task successfully completed!"
    );

}


/* =========================================================
   MODAL CONTINUE
========================================================= */

const modalButton =
    $("modalButton");

if (modalButton) {

    modalButton.addEventListener(
        "click",
        continueAfterCompletion
    );

}


function continueAfterCompletion() {

    const modal =
        $("messageModal");

    if (modal) {

        modal.classList.add(
            "hidden"
        );

    }

    if (
        game.currentLevel === 3 &&
        game.currentTask === 2
    ) {

        missionComplete();

        return;

    }

    const taskCount =
        levels[
            game.currentLevel
        ].tasks.length;

    if (
        game.currentTask <
        taskCount - 1
    ) {

        renderTaskScreen();

        showScreen(
            "taskScreen"
        );

        return;

    }

    finishLevel();

}


/* =========================================================
   FINISH LEVEL
========================================================= */

function finishLevel() {

    const levelXP =
        50;

    gainExperience(
        levelXP
    );

    if (
        game.currentLevel < 3
    ) {

        game.unlockedLevel =
            game.currentLevel + 1;

        game.energy =
            100;

        updateProfile();

        showLevelCompleteTransition();

    } else {

        missionComplete();

    }

}


/* =========================================================
   LEVEL TRANSITION
========================================================= */

function showLevelCompleteTransition() {

    safeText(
        "countdownNumber",
        "🚀"
    );

    safeText(
        "countdownCaption",
        "Level complete!"
    );

    safeText(
        "countdownMessage",
        game.currentLevel === 1
            ? "Launching toward the Moon..."
            : "Preparing the final mission..."
    );

    showScreen(
        "countdownScreen"
    );

    const rocket =
        $("countdownRocket");

    if (rocket) {

        rocket.style.transform =
            "translateY(0)";

        setTimeout(() => {

            rocket.style.transform =
                "translateY(-350px)";

        }, 500);

    }

    setTimeout(() => {

        openLevel(
            game.currentLevel + 1
        );

    }, 2200);

}


/* =========================================================
   FAILURE
========================================================= */

function failCurrentTask(
    reason
) {

    if (
        game.taskCompleted
    ) {
        return;
    }

    game.taskCompleted =
        true;

    clearInterval(
        game.timerInterval
    );

    game.timerInterval =
        null;

    clearSubtaskEffects();

    updateGameplayHUD();

    safeText(
        "failureText",
        reason ||
        "Your energy became too low. Restart the task and try again!"
    );

    safeText(
        "failureEnergy",
        game.energy
    );

    safeText(
        "failureXP",
        game.experience
    );

    const failureModal =
        $("failureModal");

    if (failureModal) {

        failureModal.classList.remove(
            "hidden"
        );

    }

}


/* =========================================================
   FAILURE RESTART
========================================================= */

const failureRestartButton =
    $("failureRestartButton");

if (failureRestartButton) {

    failureRestartButton.addEventListener(
        "click",
        () => {

            const modal =
                $("failureModal");

            if (modal) {

                modal.classList.add(
                    "hidden"
                );

            }

            restartCurrentTask();

        }
    );

}


/* =========================================================
   FAILURE EXIT
========================================================= */

const failureExitButton =
    $("failureExitButton");

if (failureExitButton) {

    failureExitButton.addEventListener(
        "click",
        () => {

            const modal =
                $("failureModal");

            if (modal) {

                modal.classList.add(
                    "hidden"
                );

            }

            clearInterval(
                game.timerInterval
            );

            clearSubtaskEffects();

            renderTaskScreen();

            showScreen(
                "taskScreen"
            );

        }
    );

}


/* =========================================================
   RESTART TASK
========================================================= */

const restartTaskButton =
    $("restartTaskButton");

if (restartTaskButton) {

    restartTaskButton.addEventListener(
        "click",
        restartCurrentTask
    );

}


function restartCurrentTask() {

    clearInterval(
        game.timerInterval
    );

    game.timerInterval =
        null;

    clearSubtaskEffects();

    /*
       Restarting costs 8 energy.
    */

    if (
        game.energy > 0
    ) {

        game.energy =
            Math.max(
                0,
                game.energy - 8
            );

    }

    game.currentSubtask =
        0;

    game.timer =
        60;

    game.taskCompleted =
        false;

    game.taskEnergySpent =
        0;

    game.temporaryData =
        {};

    updateGameplayHUD();

    /*
       If energy became zero while restarting,
       do not immediately create another task.
    */

    if (
        game.energy <= 0
    ) {

        failCurrentTask(
            "You do not have enough energy to restart this task."
        );

        return;

    }

    startTask(
        game.currentTask
    );

}


/* =========================================================
   EXIT TASK
========================================================= */

const quitTaskButton =
    $("quitTaskButton");

if (quitTaskButton) {

    quitTaskButton.addEventListener(
        "click",
        () => {

            clearInterval(
                game.timerInterval
            );

            game.timerInterval =
                null;

            clearSubtaskEffects();

            game.taskCompleted =
                false;

            renderTaskScreen();

            showScreen(
                "taskScreen"
            );

        }
    );

}


/* =========================================================
   CLEANUP
========================================================= */

function clearSubtaskEffects() {

    if (
        game.temporaryData &&
        game.temporaryData.interval
    ) {

        clearInterval(
            game.temporaryData.interval
        );

        game.temporaryData.interval =
            null;

    }

}


/* =========================================================
   MISSION COMPLETE
========================================================= */

function missionComplete() {

    clearInterval(
        game.timerInterval
    );

    game.timerInterval =
        null;

    clearSubtaskEffects();

    safeText(
        "finalXP",
        `${game.experience} XP`
    );

    safeText(
        "finalName",
        game.name
    );

    showScreen(
        "missionCompleteScreen"
    );

}


/* =========================================================
   PLAY AGAIN
========================================================= */

const playAgainButton =
    $("playAgainButton");

if (playAgainButton) {

    playAgainButton.addEventListener(
        "click",
        () => {

            clearInterval(
                game.timerInterval
            );

            game.timerInterval =
                null;

            clearSubtaskEffects();

            game.energy =
                100;

            game.experience =
                0;

            game.unlockedLevel =
                1;

            game.completedTasks = {
                1: [],
                2: [],
                3: []
            };

            game.currentLevel =
                1;

            game.currentTask =
                0;

            game.currentSubtask =
                0;

            game.timer =
                60;

            game.taskEnergySpent =
                0;

            game.taskCompleted =
                false;

            game.temporaryData =
                {};

            updateProfile();

            showScreen(
                "levelScreen"
            );

        }
    );

}


/* =========================================================
   INITIALIZATION
========================================================= */

hideUnusedUI();

updateCharacterPreview();

createShootingStar();


});