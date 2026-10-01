/* =========================================================
   JUNIOR ASTRONAUT MISSION TRAINER
   Main Game Logic
========================================================= */


/* =========================================================
   CHARACTER DATA
========================================================= */

const characters = [

    {
        name: "Luna Bunny",
        emoji: "🐰",
        immunity: 4,
        technical: 3,
        endurance: 5,
        suit: "Pink Suit"
    },

    {
        name: "Nova Cat",
        emoji: "🐱",
        immunity: 3,
        technical: 5,
        endurance: 3,
        suit: "Purple Suit"
    },

    {
        name: "Orbit Panda",
        emoji: "🐼",
        immunity: 5,
        technical: 3,
        endurance: 4,
        suit: "Lavender Suit"
    },

    {
        name: "Comet Fox",
        emoji: "🦊",
        immunity: 3,
        technical: 4,
        endurance: 5,
        suit: "Light Blue Suit"
    },

    {
        name: "Cosmo Bear",
        emoji: "🐻",
        immunity: 5,
        technical: 4,
        endurance: 3,
        suit: "Grey Suit"
    },

    {
        name: "Astro Pup",
        emoji: "🐶",
        immunity: 4,
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

    traineeId: "",
    name: "",

    characterIndex: 0,

    mode: "basic",

    energy: 100,
    immunity: 100,
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


function showScreen(id) {

    document
        .querySelectorAll(".screen")
        .forEach(screen => {
            screen.classList.remove("active");
        });

    $(id).classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   SHOOTING STARS
========================================================= */

function createShootingStar() {

    const star =
        document.createElement("div");

    star.className = "shooting-star";

    const side =
        Math.random();

    if (side < 0.5) {

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

    $("shootingStars").appendChild(star);

    setTimeout(() => {
        star.remove();
    }, 2000);
}


setInterval(
    createShootingStar,
    10000
);


/* =========================================================
   START SCREEN
========================================================= */

$("startButton").addEventListener(
    "click",
    startLaunchSequence
);


function startLaunchSequence() {

    showScreen("countdownScreen");

    const rocket =
        $("countdownRocket");

    rocket.style.transform =
        "translateY(0)";

    let number = 3;

    $("countdownNumber").textContent =
        number;

    $("countdownCaption").textContent =
        "Prepare for launch!";

    const interval =
        setInterval(() => {

            number--;

            if (number > 0) {

                $("countdownNumber").textContent =
                    number;

                $("countdownNumber").style.animation =
                    "none";

                void $("countdownNumber").offsetWidth;

                $("countdownNumber").style.animation =
                    "countdownPop 1s ease";

            } else {

                clearInterval(interval);

                $("countdownNumber").textContent =
                    "🚀";

                $("countdownCaption").textContent =
                    "Are you ready for the mission buddy?";

                $("countdownMessage").textContent =
                    "Launching toward the Moon...";

                rocket.style.transform =
                    "translateY(-300px)";

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

                game.characterIndex =
                    index;

                document
                    .querySelectorAll(".character-choice")
                    .forEach(b =>
                        b.classList.remove("selected")
                    );

                button.classList.add("selected");

                updateCharacterPreview();

            }
        );

    });


function updateCharacterPreview() {

    const character =
        characters[game.characterIndex];

    $("characterDisplay").textContent =
        character.emoji;

    $("characterPreviewName").textContent =
        character.name;

    $("previewImmunity").textContent =
        `${character.immunity}/5`;

    $("previewTechnical").textContent =
        `${character.technical}/5`;

    $("previewEndurance").textContent =
        `${character.endurance}/5`;

    $("immunityStars").textContent =
        stars(character.immunity);

    $("technicalStars").textContent =
        stars(character.technical);

    $("enduranceStars").textContent =
        stars(character.endurance);
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

                game.mode =
                    button.dataset.mode;

                document
                    .querySelectorAll(".mode-card")
                    .forEach(b =>
                        b.classList.remove("selected")
                    );

                button.classList.add("selected");

            }
        );

    });


/* =========================================================
   CREATE ASTRONAUT
========================================================= */

$("createAstronautButton")
    .addEventListener(
        "click",
        createAstronaut
    );


function createAstronaut() {

    const id =
        $("traineeId").value.trim();

    const name =
        $("traineeName").value.trim();

    if (!id) {

        alert(
            "Please create your Trainee ID first! 🪪"
        );

        return;
    }

    if (!name) {

        alert(
            "Please enter your astronaut name! 👩‍🚀"
        );

        return;
    }

    game.traineeId = id;
    game.name = name;

    game.energy = 100;
    game.immunity = 100;
    game.experience = 0;

    game.unlockedLevel = 1;

    game.completedTasks = {
        1: [],
        2: [],
        3: []
    };

    updateProfile();

    showScreen("levelScreen");
}


/* =========================================================
   PROFILE
========================================================= */

function updateProfile() {

    const character =
        characters[game.characterIndex];

    $("profileAvatar").textContent =
        character.emoji;

    $("profileName").textContent =
        game.name;

    $("profileId").textContent =
        game.traineeId;

    $("profileMode").textContent =
        game.mode.toUpperCase();

    updateLevelStats();

    updateLevelLocks();
}


function updateLevelStats() {

    setBar(
        "levelEnergyBar",
        game.energy
    );

    setBar(
        "levelImmunityBar",
        game.immunity
    );

    setBar(
        "levelExperienceBar",
        Math.min(game.experience, 100)
    );

    $("levelEnergyText").textContent =
        `${game.energy}/100`;

    $("levelImmunityText").textContent =
        `${game.immunity}/100`;

    $("levelExperienceText").textContent =
        `${game.experience} XP`;
}


function setBar(id, value) {

    $(id).style.width =
        `${Math.max(0, Math.min(100, value))}%`;
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

        const label =
            card.querySelector(".unlock-label");

        if (level <= game.unlockedLevel) {

            card.classList.remove("locked");
            card.classList.add("unlocked");

            label.textContent =
                "🔓 UNLOCKED";

        } else {

            card.classList.remove("unlocked");
            card.classList.add("locked");

            label.textContent =
                "🔒 LOCKED";
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

    game.currentLevel =
        level;

    $("introIcon").textContent =
        levels[level].icon;

    $("introLevel").textContent =
        `LEVEL ${level}`;

    $("introTitle").textContent =
        levels[level].title;

    $("introDescription").textContent =
        levels[level].description;

    const messages = {

        1:
            "Welcome to Earth Workshop, Cadet! I will teach you the skills you need for your mission.",

        2:
            "Welcome to the Moon! Stay calm, conserve your resources, and keep your crew safe.",

        3:
            "This is your final challenge! Complete the mission and bring everyone safely home."

    };

    $("robotIntroText").textContent =
        messages[level];

    showScreen("levelIntroScreen");
}


$("beginLevelButton")
    .addEventListener(
        "click",
        () => {

            /*
                Every new level restores energy.
                Experience remains permanent.
            */

            game.energy = 100;

            game.immunity = 100;

            updateProfile();

            renderTaskScreen();

            showScreen("taskScreen");

        }
    );


/* =========================================================
   TASK SCREEN
========================================================= */

function renderTaskScreen() {

    const level =
        levels[game.currentLevel];

    $("taskLevelBadge").textContent =
        `LEVEL ${game.currentLevel}`;

    $("taskLevelTitle").textContent =
        level.title;

    $("hudAvatar").textContent =
        characters[game.characterIndex].emoji;

    $("hudName").textContent =
        game.name;

    $("hudId").textContent =
        game.traineeId;

    updateGameplayHUD();

    const grid =
        $("taskGrid");

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
                    () =>
                        startTask(index)
                );

            }

            grid.appendChild(card);

        }
    );
}


$("taskBackButton")
    .addEventListener(
        "click",
        () => {

            updateProfile();

            showScreen("levelScreen");

        }
    );


/* =========================================================
   START TASK
========================================================= */

function startTask(taskIndex) {

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

    clearInterval(
        game.timerInterval
    );

    const task =
        levels[
            game.currentLevel
        ].tasks[taskIndex];

    $("gameplayLevel").textContent =
        `LEVEL ${game.currentLevel}`;

    $("gameplayTaskTitle").textContent =
        task.title;

    $("astronautPlayer").textContent =
        characters[
            game.characterIndex
        ].emoji;

    updateGameplayHUD();

    showScreen("gameplayScreen");

    renderSubtask();

    startTimer();

}


/* =========================================================
   TIMER
========================================================= */

function startTimer() {

    clearInterval(
        game.timerInterval
    );

    game.timer =
        60;

    $("timerText").textContent =
        game.timer;

    game.timerInterval =
        setInterval(() => {

            game.timer--;

            $("timerText").textContent =
                game.timer;

            /*
                Random gameplay effects.
            */

            randomImmunityEvent();

            if (game.timer <= 0) {

                clearInterval(
                    game.timerInterval
                );

                failCurrentTask(
                    "Time is up! Every astronaut learns by trying again."
                );

            }

        }, 1000);
}


function randomImmunityEvent() {

    /*
        Basic:
        Immunity cannot reach zero.

        Advanced:
        Immunity can reach zero.
    */

    if (
        Math.random() < 0.07
    ) {

        changeImmunity(
            -3,
            "A small unexpected space hazard affected your immunity."
        );

    }
}


/* =========================================================
   HUD
========================================================= */

function updateGameplayHUD() {

    $("energyText").textContent =
        game.energy;

    $("immunityText").textContent =
        game.immunity;

    $("experienceText").textContent =
        game.experience;

    $("gameEnergyText").textContent =
        game.energy;

    $("gameImmunityText").textContent =
        game.immunity;

    $("gameExperienceText").textContent =
        `${game.experience} XP`;

    setBar(
        "energyBar",
        game.energy
    );

    setBar(
        "immunityBar",
        game.immunity
    );

    setBar(
        "gameEnergyBar",
        game.energy
    );

    setBar(
        "gameImmunityBar",
        game.immunity
    );
}


/* =========================================================
   ENERGY
========================================================= */

function changeEnergy(amount) {

    game.energy =
        Math.max(
            0,
            Math.min(
                100,
                game.energy + amount
            )
        );

    game.taskEnergySpent +=
        Math.abs(amount);

    updateGameplayHUD();

    if (game.energy <= 0) {

        failCurrentTask(
            "You ran out of energy. Rest up and try again!"
        );

    }
}


/* =========================================================
   IMMUNITY
========================================================= */

function changeImmunity(
    amount,
    reason = ""
) {

    let minimum =
        game.mode === "basic"
            ? 15
            : 0;

    game.immunity =
        Math.max(
            minimum,
            Math.min(
                100,
                game.immunity + amount
            )
        );

    updateGameplayHUD();

    if (
        game.mode === "advanced" &&
        game.immunity <= 0
    ) {

        failCurrentTask(
            reason ||
            "Your immunity reached zero."
        );

    }
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

    $("robotInstruction").textContent =
        text;
}


/* =========================================================
   SUBTASK SYSTEM
========================================================= */

function renderSubtask() {

    const level =
        game.currentLevel;

    const task =
        levels[level].tasks[
            game.currentTask
        ];

    const subtask =
        game.currentSubtask;

    $("miniGame").innerHTML = "";

    const world =
        $("gameWorld");

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

    $("miniGame").appendChild(
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

    object.textContent =
        decorations[key][subtask] ||
        "✨";
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
   GENERIC SUBTASK BUTTON
========================================================= */

function completeSubtask() {

    clearSubtaskEffects();

    changeEnergy(
        -7
    );

    changeImmunity(
        -2
    );

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

        colors.forEach(
            (color, index) => {

                const button =
                    document.createElement("button");

                button.className =
                    "wire";

                button.textContent =
                    color;

                button.addEventListener(
                    "click",
                    () => {

                        button.classList.toggle(
                            "connected"
                        );

                        changeEnergy(-1);

                        const connected =
                            document.querySelectorAll(
                                ".wire.connected"
                            ).length;

                        if (connected === 4) {

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

            }
        );

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

                    pipe.style.transform =
                        `rotate(${
                            Math.floor(
                                Math.random() * 4
                            ) * 90
                        }deg)`;

                    changeEnergy(-1);

                    if (
                        [...document.querySelectorAll(".pipe")]
                            .every(
                                p =>
                                    p.style.transform
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

        slider.addEventListener(
            "input",
            () => {

                $("oxygenValue").textContent =
                    `${slider.value}%`;

            }
        );

        const button =
            createActionButton(
                "SET OXYGEN",
                () => {

                    const value =
                        Number(slider.value);

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

        materials.forEach(
            material => {

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

            }
        );

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

        shield.addEventListener(
            "dragstart",
            event => {

                event.dataTransfer.setData(
                    "text/plain",
                    "shield"
                );

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

        let dodged = 0;

        const spawn =
            setInterval(() => {

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

                setTimeout(
                    () => asteroid.remove(),
                    2000
                );

            }, 800);

        game.temporaryData.interval =
            spawn;

        $("dodgeButton")
            .addEventListener(
                "click",
                () => {

                    dodged++;

                    changeImmunity(-2);

                    if (
                        dodged >= 8
                    ) {

                        clearInterval(
                            spawn
                        );

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

                    if (i === 5) {

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

        panel.addEventListener(
            "dragstart",
            event => {

                event.dataTransfer.setData(
                    "panel",
                    "yes"
                );

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

        nodes.forEach(
            node => {

                node.addEventListener(
                    "click",
                    () => {

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

            }
        );

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

                        if (index === 2) {

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

                    button.textContent =
                        "🌱";

                    button.style.borderColor =
                        "#72e6a5";

                    const planted =
                        document.querySelectorAll(
                            ".seed-slot[style*='border-color']"
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
            0;

        slider.max =
            100;

        slider.value =
            50;

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

                        if (index === 2) {

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

        systems.forEach(
            system => {

                const button =
                    document.createElement("button");

                button.textContent =
                    system;

                button.addEventListener(
                    "click",
                    () => {

                        button.classList.toggle(
                            "off"
                        );

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

        $("miniGame").appendChild(
            createActionButton(
                "SAVE POWER",
                () => {

                    const off =
                        document.querySelectorAll(
                            ".power-system button.off"
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

                    button.classList.toggle(
                        "off"
                    );

                    const active =
                        document.querySelectorAll(
                            ".power-system button:not(.off)"
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

        zones.forEach(
            zone => {

                const button =
                    document.createElement("button");

                button.className =
                    "safe-zone";

                button.textContent =
                    `🛡️ ${zone[0]}`;

                button.addEventListener(
                    "click",
                    () => {

                        if (zone[1]) {

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

            }
        );

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

                    let progress =
                        Number(
                            button.dataset.progress ||
                            0
                        );

                    progress += 25;

                    button.dataset.progress =
                        progress;

                    button.textContent =
                        `🏃 REACHING SHELTER ${progress}%`;

                    changeImmunity(-3);

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

        foods.forEach(
            food => {

                const button =
                    document.createElement("button");

                button.className =
                    "food-item";

                button.textContent =
                    food[0];

                button.addEventListener(
                    "click",
                    () => {

                        if (food[1]) {

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

            }
        );

        $("miniGame").appendChild(
            grid
        );

        $("miniGame").appendChild(
            createActionButton(
                "PACK FOOD",
                () => {

                    const selected =
                        document.querySelectorAll(
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
            0;

        slider.max =
            100;

        slider.value =
            50;

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

        systems.forEach(
            system => {

                const button =
                    document.createElement("button");

                button.textContent =
                    system;

                button.addEventListener(
                    "click",
                    () => {

                        button.classList.add(
                            "off"
                        );

                        if (
                            document.querySelectorAll(
                                ".power-system button.off"
                            ).length === 4
                        ) {

                            completeSubtask();

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
            "food-options";

        const supplies = [
            "🫁 Oxygen",
            "🍎 Food",
            "🔋 Battery",
            "💎 Toy",
            "🛠️ Tools",
            "💧 Water"
        ];

        supplies.forEach(
            (supply, index) => {

                const button =
                    document.createElement("button");

                button.className =
                    "food-item";

                button.textContent =
                    supply;

                button.addEventListener(
                    "click",
                    () => {

                        button.classList.toggle(
                            "selected"
                        );

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

        $("miniGame").appendChild(
            createActionButton(
                "LOAD SUPPLIES",
                () => {

                    const selected =
                        document.querySelectorAll(
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

        ["🔑", "⛽", "🔋", "🚀"].forEach(
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

                            document
                                .querySelectorAll(
                                    ".launch-step"
                                )
                                .forEach(
                                    b =>
                                        b.classList.remove(
                                            "completed"
                                        )
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

    robotMessage(
        message
    );

    changeEnergy(
        -5
    );

    changeImmunity(
        -5
    );

    /*
        The player gains learning experience
        from trying, but not completion XP.
    */

    game.taskEnergySpent += 5;
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

    /*
        Completion rewards.
    */

    const xpGain =
        25;

    gainExperience(
        xpGain
    );

    changeEnergy(
        -5
    );

    changeImmunity(
        -3
    );

    game.completedTasks[
        game.currentLevel
    ].push(
        game.currentTask
    );

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

    $("modalIcon").textContent =
        task.icon;

    $("modalTitle").textContent =
        "Great Job, Cadet! 🎉";

    $("modalText").textContent =
        getCompletionMessage(
            game.currentLevel,
            game.currentTask
        );

    $("modalStats").innerHTML = `

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

    $("modalButton").textContent =
        "CONTINUE 🚀";

    $("messageModal").classList.remove(
        "hidden"
    );

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

$("modalButton")
    .addEventListener(
        "click",
        continueAfterCompletion
    );


function continueAfterCompletion() {

    $("messageModal")
        .classList.add("hidden");

    /*
        Level 3 final task
    */

    if (
        game.currentLevel === 3 &&
        game.currentTask === 2
    ) {

        missionComplete();

        return;
    }


    /*
        More tasks remain in this level.
    */

    const taskCount =
        levels[
            game.currentLevel
        ].tasks.length;

    if (
        game.currentTask <
        taskCount - 1
    ) {

        renderTaskScreen();

        showScreen("taskScreen");

        return;
    }


    /*
        Entire level completed.
    */

    finishLevel();

}


/* =========================================================
   FINISH LEVEL
========================================================= */

function finishLevel() {

    /*
        Permanent experience reward
    */

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

        /*
            New level starts with full energy.
        */

        game.energy =
            100;

        game.immunity =
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

    $("countdownNumber").textContent =
        "🚀";

    $("countdownCaption").textContent =
        "Level complete!";

    $("countdownMessage").textContent =
        game.currentLevel === 1
            ? "Launching toward the Moon..."
            : "Preparing the final mission...";

    showScreen(
        "countdownScreen"
    );

    const rocket =
        $("countdownRocket");

    rocket.style.transform =
        "translateY(0)";

    setTimeout(() => {

        rocket.style.transform =
            "translateY(-350px)";

    }, 500);

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

    /*
        Advanced can hit zero.
        Basic keeps a minimum immunity.
    */

    if (
        game.mode === "advanced"
    ) {

        game.immunity =
            0;

    } else {

        game.immunity =
            15;

    }

    changeEnergy(
        -10
    );

    updateGameplayHUD();

    $("failureText").textContent =
        reason ||
        "Your immunity became too low. Restart the task and try again!";

    $("failureEnergy").textContent =
        game.energy;

    $("failureXP").textContent =
        game.experience;

    $("failureModal")
        .classList.remove(
            "hidden"
        );

}


$("failureRestartButton")
    .addEventListener(
        "click",
        () => {

            $("failureModal")
                .classList.add(
                    "hidden"
                );

            restartCurrentTask();

        }
    );


$("failureExitButton")
    .addEventListener(
        "click",
        () => {

            $("failureModal")
                .classList.add(
                    "hidden"
                );

            renderTaskScreen();

            showScreen(
                "taskScreen"
            );

        }
    );


/* =========================================================
   RESTART TASK
========================================================= */

$("restartTaskButton")
    .addEventListener(
        "click",
        restartCurrentTask
    );


function restartCurrentTask() {

    clearSubtaskEffects();

    game.currentSubtask =
        0;

    game.timer =
        60;

    game.taskCompleted =
        false;

    game.temporaryData =
        {};

    /*
        Recovering immunity costs energy.
    */

    if (
        game.immunity < 100
    ) {

        changeEnergy(
            -8
        );

        game.immunity =
            Math.min(
                100,
                game.immunity + 30
            );

    }

    startTask(
        game.currentTask
    );
}


/* =========================================================
   EXIT TASK
========================================================= */

$("quitTaskButton")
    .addEventListener(
        "click",
        () => {

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


/* =========================================================
   CLEANUP
========================================================= */

function clearSubtaskEffects() {

    if (
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

    clearSubtaskEffects();

    $("finalXP").textContent =
        `${game.experience} XP`;

    $("finalName").textContent =
        game.name;

    showScreen(
        "missionCompleteScreen"
    );

}


/* =========================================================
   PLAY AGAIN
========================================================= */

$("playAgainButton")
    .addEventListener(
        "click",
        () => {

            game.energy = 100;

            game.immunity = 100;

            game.experience = 0;

            game.unlockedLevel = 1;

            game.completedTasks = {
                1: [],
                2: [],
                3: []
            };

            game.currentLevel = 1;

            game.currentTask = 0;

            game.currentSubtask = 0;

            clearInterval(
                game.timerInterval
            );

            showScreen(
                "levelScreen"
            );

            updateProfile();

        }
    );


/* =========================================================
   INITIALIZATION
========================================================= */

updateCharacterPreview();

createShootingStar();
