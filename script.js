/* =========================================================
   JUNIOR ASTRONAUT MISSION TRAINER
   Main Game Controller
========================================================= */

"use strict";


/* =========================================================
   HELPERS
========================================================= */

const $ = (id) => document.getElementById(id);

function showScreen(id) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.add("hidden");
        screen.classList.remove("active");
    });

    const screen = $(id);

    if (screen) {
        screen.classList.remove("hidden");
        screen.classList.add("active");
    }
}

function setText(id, text) {
    const element = $(id);

    if (element) {
        element.textContent = text;
    }
}

function onClick(id, handler) {
    const element = $(id);

    if (element) {
        element.addEventListener("click", handler);
    }
}


/* =========================================================
   CHARACTER DATA
========================================================= */

const characters = {

    panda: {
        name: "Panda",
        emoji: "🐼",
        suit: "White",
        immunity: 5,
        technical: 4,
        endurance: 4
    },

    bunny: {
        name: "Bunny",
        emoji: "🐰",
        suit: "Pink",
        immunity: 4,
        technical: 3,
        endurance: 5
    },

    fox: {
        name: "Fox",
        emoji: "🦊",
        suit: "Purple",
        immunity: 4,
        technical: 5,
        endurance: 3
    },

    bear: {
        name: "Bear",
        emoji: "🐻",
        suit: "Grey",
        immunity: 5,
        technical: 3,
        endurance: 5
    },

    cat: {
        name: "Cat",
        emoji: "🐱",
        suit: "Lavender",
        immunity: 3,
        technical: 5,
        endurance: 4
    },

    dog: {
        name: "Dog",
        emoji: "🐶",
        suit: "Light Blue",
        immunity: 4,
        technical: 4,
        endurance: 5
    }

};


/* =========================================================
   GAME STATE
========================================================= */

const game = {

    astronautName: "Junior Astronaut",

    character: "panda",

    mode: "basic",

    energy: 100,

    immunity: 100,

    experience: 0,

    currentLevel: 0,

    currentTask: 0,

    currentSubtask: 0,

    completedTasks: [],

    unlockedLevels: [true, false, false],

    taskProgress: {},

    timer: 60,

    timerInterval: null,

    taskCompleted: false,

    taskEnergySpent: 0,

    temporaryData: {}

};


/* =========================================================
   LEVEL DATA
========================================================= */

const levels = [

    {
        number: 1,

        icon: "🌍",

        title: "EARTH TRAINING",

        subtitle: "Workshop / Astronaut Training",

        location: "Earth Workshop",

        description:
            "Prepare yourself for the journey to the Moon by learning spacecraft systems, astronaut movement and robotics.",

        tasks: [

            {
                title: "Build & Power the Spacecraft",

                icon: "🛰️",

                reward: 25,

                message:
                    "Excellent work, Astronaut! You built and powered your spacecraft!",

                subtasks: [
                    "Connect the Spacecraft Modules",
                    "Connect & Power the Systems",
                    "Perform the Final Systems Check"
                ]
            },

            {
                title: "Astronaut Training Course",

                icon: "🧑‍🚀",

                reward: 25,

                message:
                    "Amazing! You moved like a real astronaut!",

                subtasks: [
                    "Suit Up",
                    "Zero-Gravity Training",
                    "Emergency Return"
                ]
            },

            {
                title: "Robot Arm Rescue",

                icon: "🦾",

                reward: 25,

                message:
                    "Robotic arm mission successful! You're ready for the Moon!",

                subtasks: [
                    "Find the Target",
                    "Control the Robotic Arm",
                    "Grab & Place the Object"
                ]
            }

        ]
    },


    {
        number: 2,

        icon: "🌕",

        title: "LUNAR SURVIVAL",

        subtitle: "Moon Survival & Exploration",

        location: "Moon",

        description:
            "Explore the lunar surface, operate a rover and build the infrastructure needed for life on the Moon.",

        tasks: [

            {
                title: "Lunar Explorer",

                icon: "🧭",

                reward: 30,

                message:
                    "Great exploration, Astronaut! You found the lunar research site!",

                subtasks: [
                    "Read the Lunar Map",
                    "Cross the Moon",
                    "Find the Research Site"
                ]
            },

            {
                title: "Moon Rover Mission",

                icon: "🚙",

                reward: 30,

                message:
                    "Rover mission complete! You explored farther than ever!",

                subtasks: [
                    "Prepare the Rover",
                    "Drive Across the Moon",
                    "Return Before Battery Runs Out"
                ]
            },

            {
                title: "Build the Moon Base",

                icon: "🏠",

                reward: 30,

                message:
                    "We have a Moon base! You built a home on another world!",

                subtasks: [
                    "Place the Habitat",
                    "Build the Power System",
                    "Activate Life Support & Communication"
                ]
            }

        ]
    },


    {
        number: 3,

        icon: "🚨",

        title: "RETURN TO EARTH",

        subtitle: "Mission Emergency & Safe Return",

        location: "Lunar Base",

        description:
            "Handle an emergency, prepare the spacecraft and complete the final journey home.",

        tasks: [

            {
                title: "Handle the Moon Base Emergency",

                icon: "🚨",

                reward: 35,

                message:
                    "Emergency handled! You kept the Moon base safe!",

                subtasks: [
                    "Find the Problem",
                    "Repair the System",
                    "Reach the Safe Area"
                ]
            },

            {
                title: "Prepare for Departure",

                icon: "🔋",

                reward: 35,

                message:
                    "Everything is ready! Earth, here we come!",

                subtasks: [
                    "Pack the Essentials",
                    "Balance the Supplies",
                    "Final Spacecraft Check"
                ]
            },

            {
                title: "Return to Earth",

                icon: "🌍",

                reward: 50,

                message:
                    "YOU DID IT, ASTRONAUT! You travelled to the Moon, completed your mission, and safely returned home!",

                subtasks: [
                    "Launch the Spacecraft",
                    "Navigate Home",
                    "Complete the Landing"
                ]
            }

        ]
    }

];


/* =========================================================
   INITIALIZATION
========================================================= */

function initGame() {

    bindStartButton();

    bindCharacterChoices();

    bindModeChoices();

    bindCreationButton();

    bindLevelCards();

    bindBeginLevelButton();

    bindModalButton();

    bindRetryButton();

    bindPlayAgainButton();

    hideUnusedElements();

    updateCharacterPreview();

    updateGlobalHUD();

    createShootingStar();

    setInterval(createShootingStar, 30000);
}


/* =========================================================
   START BUTTON
========================================================= */

function bindStartButton() {

    onClick("startButton", () => {

        showScreen("launchScreen");

        startLaunchSequence();

    });

}


/* =========================================================
   LAUNCH SEQUENCE
========================================================= */

function startLaunchSequence() {

    const rocket = $("launchRocket");

    const caption = $("launchCaption");

    const countdown = $("countdownNumber");

    const subtext = $("launchSubtext");

    if (!rocket || !caption || !countdown) {
        showScreen("creationScreen");
        return;
    }

    rocket.classList.remove("launching");

    caption.textContent =
        "Are you ready for the mission buddy?";

    subtext.textContent =
        "Preparing your spacecraft for launch...";

    const numbers = ["3", "2", "1"];

    let index = 0;

    countdown.textContent = numbers[index];

    const interval = setInterval(() => {

        index++;

        if (index < numbers.length) {

            countdown.textContent =
                numbers[index];

            countdown.style.animation = "none";

            void countdown.offsetWidth;

            countdown.style.animation =
                "countdownPop 0.8s ease";

        } else {

            clearInterval(interval);

            caption.textContent =
                "LAUNCH! 🚀";

            subtext.textContent =
                "Travelling toward the Moon...";

            rocket.classList.add("launching");

            setTimeout(() => {

                showScreen("creationScreen");

            }, 3000);
        }

    }, 1000);
}


/* =========================================================
   CHARACTER SELECTION
========================================================= */

function bindCharacterChoices() {

    document
        .querySelectorAll(".character-choice")
        .forEach(button => {

            button.addEventListener("click", () => {

                document
                    .querySelectorAll(".character-choice")
                    .forEach(item => {
                        item.classList.remove("selected");
                    });

                button.classList.add("selected");

                game.character =
                    button.dataset.character;

                updateCharacterPreview();

            });

        });

}


function updateCharacterPreview() {

    const character =
        characters[game.character];

    if (!character) {
        return;
    }

    setText(
        "characterPreview",
        character.emoji
    );

    setText(
        "previewTechnical",
        stars(character.technical)
    );

    setText(
        "previewEndurance",
        stars(character.endurance)
    );

    setText(
        "previewImmunity",
        stars(character.immunity)
    );

    const nameInput =
        $("astronautName");

    if (nameInput) {

        setText(
            "previewName",
            nameInput.value.trim() ||
            "Junior Astronaut"
        );

    }

}


/* =========================================================
   NAME INPUT
========================================================= */

function bindCreationButton() {

    const input = $("astronautName");

    if (input) {

        input.addEventListener(
            "input",
            updateCharacterPreview
        );

    }

    onClick(
        "createAstronautButton",
        createAstronaut
    );

}


function createAstronaut() {

    const input =
        $("astronautName");

    game.astronautName =
        input?.value.trim() ||
        "Junior Astronaut";

    game.energy = 100;

    game.immunity = 100;

    game.experience = 0;

    game.currentLevel = 0;

    game.currentTask = 0;

    game.currentSubtask = 0;

    game.completedTasks = [];

    game.unlockedLevels =
        [true, false, false];

    game.taskProgress = {};

    updateGlobalHUD();

    updateLevelSelection();

    showScreen("levelSelectionScreen");

}


/* =========================================================
   MODE SELECTION
========================================================= */

function bindModeChoices() {

    document
        .querySelectorAll(".mode-card")
        .forEach(button => {

            button.addEventListener("click", () => {

                document
                    .querySelectorAll(".mode-card")
                    .forEach(item => {
                        item.classList.remove("selected");
                    });

                button.classList.add("selected");

                game.mode =
                    button.dataset.mode;

            });

        });

}


/* =========================================================
   LEVEL SELECTION
========================================================= */

function bindLevelCards() {

    document
        .querySelectorAll(".level-card")
        .forEach(card => {

            card.addEventListener("click", () => {

                const level =
                    Number(card.dataset.level);

                if (!game.unlockedLevels[level]) {
                    return;
                }

                openLevel(level);

            });

        });

}


function updateLevelSelection() {

    document
        .querySelectorAll(".level-card")
        .forEach(card => {

            const level =
                Number(card.dataset.level);

            const unlocked =
                game.unlockedLevels[level];

            card.classList.toggle(
                "unlocked",
                unlocked
            );

            card.classList.toggle(
                "locked",
                !unlocked
            );

            const status =
                card.querySelector(".level-status");

            if (status) {
                status.textContent =
                    unlocked ? "🔓" : "🔒";
            }

        });

    setText(
        "levelAvatar",
        characters[game.character].emoji
    );

    setText(
        "levelAstronautName",
        game.astronautName
    );

    setText(
        "levelXP",
        `${game.experience} XP`
    );

}


/* =========================================================
   OPEN LEVEL
========================================================= */

function openLevel(level) {

    if (!levels[level]) {
        return;
    }

    game.currentLevel = level;

    game.currentTask = 0;

    game.currentSubtask = 0;

    game.energy = 100;

    game.immunity = 100;

    updateGlobalHUD();

    showLevelIntro(level);

}


/* =========================================================
   LEVEL INTRO
========================================================= */

function showLevelIntro(level) {

    const data =
        levels[level];

    setText(
        "levelIntroIcon",
        data.icon
    );

    setText(
        "levelIntroLabel",
        `LEVEL ${data.number}`
    );

    setText(
        "levelIntroTitle",
        data.title
    );

    setText(
        "levelIntroSubtitle",
        data.subtitle
    );

    setText(
        "levelIntroDescription",
        data.description
    );

    setText(
        "robotIntroMessage",
        getLevelRobotMessage(level)
    );

    showScreen("levelIntroScreen");

}


function getLevelRobotMessage(level) {

    if (level === 0) {
        return "I'll train you for your first lunar mission!";
    }

    if (level === 1) {
        return "Welcome to the Moon, Astronaut!";
    }

    return "Something unexpected has happened. Stay calm and follow my instructions!";
}


/* =========================================================
   BEGIN LEVEL
========================================================= */

function bindBeginLevelButton() {

    onClick(
        "beginLevelButton",
        () => {

            startTask();

        }
    );

}


/* =========================================================
   START TASK
========================================================= */

function startTask() {

    clearTimer();

    clearSubtaskEffects();

    game.currentSubtask = 0;

    game.taskCompleted = false;

    game.taskEnergySpent = 0;

    game.temporaryData = {};

    game.timer = 60;

    updateGlobalHUD();

    updateGameplayHUD();

    renderCurrentSubtask();

    updateTimerVisibility();

    if (game.mode === "advanced") {
        startTimer();
    }

    showScreen("gameScreen");

}


/* =========================================================
   GAMEPLAY HUD
========================================================= */

function updateGameplayHUD() {

    const level =
        levels[game.currentLevel];

    if (!level) {
        return;
    }

    const task =
        level.tasks[game.currentTask];

    if (!task) {
        return;
    }

    setText(
        "locationIcon",
        level.icon
    );

    setText(
        "locationName",
        level.location
    );

    setText(
        "currentLevelLabel",
        `LEVEL ${level.number}`
    );

    setText(
        "gameLevelLabel",
        `LEVEL ${level.number} — ${level.title}`
    );

    setText(
        "gameTaskTitle",
        task.title
    );

    setText(
        "taskCounter",
        `TASK ${game.currentTask + 1} / 3`
    );

    renderTaskList();

}


/* =========================================================
   TASK LIST
========================================================= */

function renderTaskList() {

    const container =
        $("taskList");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const level =
        levels[game.currentLevel];

    level.tasks.forEach((task, index) => {

        const button =
            document.createElement("button");

        button.className =
            "task-item";

        const completed =
            game.completedTasks.includes(
                `${game.currentLevel}-${index}`
            );

        const unlocked =
            index <= game.currentTask;

        if (index === game.currentTask) {
            button.classList.add("current");
        }

        if (completed) {
            button.classList.add("completed");
        }

        if (!unlocked) {
            button.classList.add("locked");
        }

        button.innerHTML = `
            <span class="task-icon">
                ${completed ? "✅" : unlocked ? task.icon : "🔒"}
            </span>

            <span>
                <small>TASK ${index + 1}</small>
                <strong>${task.title}</strong>
            </span>
        `;

        if (unlocked) {

            button.addEventListener(
                "click",
                () => {

                    if (
                        index === game.currentTask &&
                        !game.taskCompleted
                    ) {
                        startTask();
                    }

                }
            );

        }

        container.appendChild(button);

    });

}


/* =========================================================
   RENDER SUBTASK
========================================================= */

function renderCurrentSubtask() {

    const level =
        levels[game.currentLevel];

    const task =
        level?.tasks[game.currentTask];

    if (!task) {
        return;
    }

    const title =
        task.subtasks[game.currentSubtask];

    setText(
        "instructionText",
        getInstruction(
            game.currentLevel,
            game.currentTask,
            game.currentSubtask
        )
    );

    setText(
        "robotMessage",
        getRobotMessage(
            game.currentLevel,
            game.currentTask,
            game.currentSubtask
        )
    );

    const scene =
        $("gameScene");

    if (!scene) {
        return;
    }

    scene.innerHTML = "";

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "mini-game";

    wrapper.innerHTML = `
        <div class="mini-title">
            <h3>
                ${task.icon} ${title}
            </h3>

            <p>
                Stage ${game.currentSubtask + 1} of 3
            </p>
        </div>
    `;

    scene.appendChild(wrapper);

    createMiniGame(
        wrapper,
        game.currentLevel,
        game.currentTask,
        game.currentSubtask
    );

}


/* =========================================================
   ROBOT MESSAGES
========================================================= */

function getRobotMessage(level, task, subtask) {

    const messages = {

        "0-0-0":
            "Astronaut! Our spacecraft is not assembled yet. Let's build it step by step.",

        "0-0-1":
            "The spacecraft is assembled, but its systems need power. Let's connect them!",

        "0-0-2":
            "The spacecraft is almost ready! Let's make sure everything is working.",

        "0-1-0":
            "Astronauts need special equipment to survive in space. Let's prepare your spacesuit!",

        "0-1-1":
            "Space has almost no gravity. Practice moving carefully!",

        "0-1-2":
            "Training emergency! Return to the airlock!",

        "0-2-0":
            "Find the correct target for our robotic arm.",

        "0-2-1":
            "Move the robotic arm carefully toward the target.",

        "0-2-2":
            "Grab the object and bring it safely back to the spacecraft.",

        "1-0-0":
            "Your destination is Research Site Alpha. Follow the map!",

        "1-0-1":
            "Careful! Lunar craters and rocks are ahead.",

        "1-0-2":
            "Use your scanner to find Research Site Alpha.",

        "1-1-0":
            "Before driving, we need to check the rover.",

        "1-1-1":
            "Drive carefully and collect the lunar samples.",

        "1-1-2":
            "Battery is running low. Return to the base!",

        "1-2-0":
            "Every Moon base needs a safe place for astronauts to live.",

        "1-2-1":
            "The habitat needs electricity. Let's build the power system.",

        "1-2-2":
            "Now activate oxygen and communication.",

        "2-0-0":
            "Something is wrong with the base. Inspect the systems.",

        "2-0-1":
            "The faulty system needs to be repaired.",

        "2-0-2":
            "Emergency! Follow the route to the shelter!",

        "2-1-0":
            "We have limited storage space. Pack the most important supplies.",

        "2-1-1":
            "We need enough supplies for the whole journey.",

        "2-1-2":
            "Everything is packed. Let's complete the final spacecraft check.",

        "2-2-0":
            "Astronaut! Your final mission begins now. Start the launch sequence.",

        "2-2-1":
            "Earth is ahead. Stay on the correct flight path.",

        "2-2-2":
            "Control the descent and reach the safe landing zone."

    };

    return messages[
        `${level}-${task}-${subtask}`
    ] || "Follow the instructions, Astronaut!";
}


function getInstruction(level, task, subtask) {

    const instructions = {

        "0-0-0":
            "Select each spacecraft module and place it into its matching position.",

        "0-0-1":
            "Connect the battery to Life Support, Communication and Navigation.",

        "0-0-2":
            "Repair every red system until all spacecraft indicators become green.",

        "0-1-0":
            "Select the correct equipment and place every item on the astronaut.",

        "0-1-1":
            "Use the movement controls to collect the floating wrench.",

        "0-1-2":
            "Reach the glowing airlock while avoiding obstacles.",

        "0-2-0":
            "Find and select the blue sample container.",

        "0-2-1":
            "Move the robotic arm until the gripper reaches the target.",

        "0-2-2":
            "Grab the object, move it back and release it in the storage area.",

        "1-0-0":
            "Choose the route leading from your astronaut to Research Site Alpha.",

        "1-0-1":
            "Move across the lunar surface without hitting the hazards.",

        "1-0-2":
            "Scan the objects and select Research Site Alpha.",

        "1-1-0":
            "Inspect the rover and repair the damaged system.",

        "1-1-1":
            "Drive the rover, avoid craters and collect the samples.",

        "1-1-2":
            "Choose the short route and return to the lunar base.",

        "1-2-0":
            "Place the habitat on the highlighted foundation.",

        "1-2-1":
            "Connect Solar Panels → Battery → Habitat.",

        "1-2-2":
            "Connect oxygen and communication, then activate the base.",

        "2-0-0":
            "Inspect the four systems and identify the abnormal reading.",

        "2-0-1":
            "Connect the repair pieces in the correct order.",

        "2-0-2":
            "Navigate through the emergency area and reach the shelter.",

        "2-1-0":
            "Select the essential equipment needed for the return journey.",

        "2-1-1":
            "Balance oxygen, water, food and power supplies.",

        "2-1-2":
            "Check every spacecraft system and repair anything marked red.",

        "2-2-0":
            "Activate Power, Navigation, Communication and Engine.",

        "2-2-1":
            "Use left and right controls to stay on the flight path.",

        "2-2-2":
            "Keep the spacecraft inside the green landing zone."

    };

    return instructions[
        `${level}-${task}-${subtask}`
    ] || "Complete the activity.";
}


/* =========================================================
   MINI GAME ROUTER
========================================================= */

function createMiniGame(wrapper, level, task, subtask) {

    const key =
        `${level}-${task}-${subtask}`;

    switch (key) {

        case "0-0-0":
            spacecraftModulesGame(wrapper);
            break;

        case "0-0-1":
            powerSystemsGame(wrapper);
            break;

        case "0-0-2":
            systemsCheckGame(wrapper);
            break;

        case "0-1-0":
            suitUpGame(wrapper);
            break;

        case "0-1-1":
            zeroGravityGame(wrapper);
            break;

        case "0-1-2":
            emergencyAirlockGame(wrapper);
            break;

        case "0-2-0":
            targetSelectionGame(wrapper);
            break;

        case "0-2-1":
            roboticArmControlGame(wrapper);
            break;

        case "0-2-2":
            roboticArmGrabGame(wrapper);
            break;

        case "1-0-0":
            lunarMapGame(wrapper);
            break;

        case "1-0-1":
            lunarMovementGame(wrapper);
            break;

        case "1-0-2":
            researchSiteGame(wrapper);
            break;

        case "1-1-0":
            roverPreparationGame(wrapper);
            break;

        case "1-1-1":
            roverDrivingGame(wrapper);
            break;

        case "1-1-2":
            roverReturnGame(wrapper);
            break;

        case "1-2-0":
            habitatGame(wrapper);
            break;

        case "1-2-1":
            moonPowerGame(wrapper);
            break;

        case "1-2-2":
            moonBaseSystemsGame(wrapper);
            break;

        case "2-0-0":
            emergencyDiagnosisGame(wrapper);
            break;

        case "2-0-1":
            emergencyRepairGame(wrapper);
            break;

        case "2-0-2":
            shelterGame(wrapper);
            break;

        case "2-1-0":
            suppliesGame(wrapper);
            break;

        case "2-1-1":
            balanceSuppliesGame(wrapper);
            break;

        case "2-1-2":
            finalCheckGame(wrapper);
            break;

        case "2-2-0":
            launchSystemsGame(wrapper);
            break;

        case "2-2-1":
            navigationGame(wrapper);
            break;

        case "2-2-2":
            landingGame(wrapper);
            break;

        default:
            createSimpleCompletionGame(wrapper);
    }

}


/* =========================================================
   LEVEL 1 — TASK 1
========================================================= */

function spacecraftModulesGame(wrapper) {

    const modules = [
        ["🏠", "Habitat", "habitat"],
        ["🔋", "Power", "power"],
        ["🫧", "Life Support", "life"],
        ["📡", "Communication", "communication"]
    ];

    wrapper.innerHTML += `
        <div class="action-grid" id="moduleGrid"></div>
        <button class="mini-action" id="moduleContinue">
            CONNECT MODULES
        </button>
    `;

    const grid = wrapper.querySelector("#moduleGrid");

    modules.forEach(item => {

        const button =
            document.createElement("button");

        button.className =
            "action-card";

        button.innerHTML = `
            <span class="emoji">${item[0]}</span>
            <strong>${item[1]}</strong>
            <small>Click to place</small>
        `;

        button.addEventListener("click", () => {

            if (button.classList.contains("correct")) {
                return;
            }

            button.classList.add("correct");

            changeImmunity(
                -getMistakePenalty()
            );

        });

        grid.appendChild(button);

    });

    wrapper
        .querySelector("#moduleContinue")
        .addEventListener("click", () => {

            const connected =
                grid.querySelectorAll(".correct").length;

            if (connected === modules.length) {

                completeSubtask();

            } else {

                wrongAttempt(
                    "Place all four spacecraft modules first."
                );

            }

        });

}


/* =========================================================
   LEVEL 1 — POWER SYSTEMS
========================================================= */

function powerSystemsGame(wrapper) {

    const systems = [
        ["🫧", "Life Support"],
        ["📡", "Communication"],
        ["🧭", "Navigation"]
    ];

    wrapper.innerHTML += `
        <div class="circuit" id="powerCircuit"></div>

        <button class="mini-action" id="powerContinue">
            ACTIVATE SYSTEMS
        </button>
    `;

    const circuit =
        wrapper.querySelector("#powerCircuit");

    systems.forEach((system, index) => {

        if (index > 0) {

            const arrow =
                document.createElement("div");

            arrow.className =
                "circuit-arrow";

            arrow.textContent = "→";

            circuit.appendChild(arrow);

        }

        const node =
            document.createElement("button");

        node.className =
            "circuit-node";

        node.innerHTML =
            `${system[0]}<br>${system[1]}`;

        node.addEventListener("click", () => {

            node.classList.toggle("connected");

        });

        circuit.appendChild(node);

    });

    wrapper
        .querySelector("#powerContinue")
        .addEventListener("click", () => {

            const connected =
                circuit.querySelectorAll(".connected");

            if (connected.length === systems.length) {

                completeSubtask();

            } else {

                wrongAttempt(
                    "Connect all essential spacecraft systems."
                );

            }

        });

}


/* =========================================================
   SYSTEM CHECK
========================================================= */

function systemsCheckGame(wrapper) {

    const systems = [
        ["🫧", "Oxygen"],
        ["🔋", "Battery"],
        ["📡", "Communication"],
        ["🧭", "Navigation"],
        ["🌡️", "Temperature"]
    ];

    wrapper.innerHTML += `
        <div class="system-panel" id="systemPanel"></div>
    `;

    const panel =
        wrapper.querySelector("#systemPanel");

    systems.forEach((system, index) => {

        const item =
            document.createElement("button");

        item.className =
            "system-item";

        item.innerHTML = `
            <div class="system-icon">${system[0]}</div>
            <small>${system[1]}</small>
            <div class="system-status">
                ${index < 2 ? "🔴 CHECK" : "🟢 READY"}
            </div>
        `;

        if (index >= 2) {
            item.classList.add("ready");
        }

        item.addEventListener("click", () => {

            item.classList.add("ready");

            const status =
                item.querySelector(".system-status");

            if (status) {
                status.textContent =
                    "🟢 READY";
            }

        });

        panel.appendChild(item);

    });

    setTimeout(() => {

        const button =
            document.createElement("button");

        button.className =
            "mini-action";

        button.textContent =
            "COMPLETE SYSTEM CHECK";

        button.addEventListener(
            "click",
            () => {

                const ready =
                    panel.querySelectorAll(".ready").length;

                if (ready === systems.length) {
                    completeSubtask();
                } else {
                    wrongAttempt(
                        "Check and repair every red system."
                    );
                }

            }
        );

        wrapper.appendChild(button);

    }, 100);

}


/* =========================================================
   LEVEL 1 — TASK 2
========================================================= */

function suitUpGame(wrapper) {

    const equipment = [
        ["🪖", "Helmet"],
        ["🧤", "Gloves"],
        ["🥾", "Boots"],
        ["🎒", "Oxygen Pack"],
        ["📻", "Communication"]
    ];

    wrapper.innerHTML += `
        <div class="action-grid" id="suitGrid"></div>

        <button class="mini-action" id="suitButton">
            CHECK SUIT
        </button>
    `;

    const grid =
        wrapper.querySelector("#suitGrid");

    equipment.forEach(item => {

        const button =
            document.createElement("button");

        button.className =
            "action-card";

        button.innerHTML = `
            <span class="emoji">${item[0]}</span>
            <strong>${item[1]}</strong>
            <small>Attach to astronaut</small>
        `;

        button.addEventListener("click", () => {

            button.classList.toggle("correct");

        });

        grid.appendChild(button);

    });

    wrapper
        .querySelector("#suitButton")
        .addEventListener("click", () => {

            if (
                grid.querySelectorAll(".correct").length ===
                equipment.length
            ) {
                completeSubtask();
            } else {
                wrongAttempt(
                    "Attach every piece of astronaut equipment."
                );
            }

        });

}


function zeroGravityGame(wrapper) {

    wrapper.innerHTML += `

        <div class="space-map" id="zeroGravityMap">

            <div
                class="map-object"
                style="left:20%;top:35%;"
            >
                🧑‍🚀
            </div>

            <button
                class="map-object"
                id="wrenchTarget"
                style="left:75%;top:55%;"
            >
                🔧
            </button>

            <div
                class="map-object"
                style="left:45%;top:25%;"
            >
                🪨
            </div>

            <div
                class="map-object"
                style="left:65%;top:78%;"
            >
                🛰️
            </div>

        </div>

        <div class="direction-controls">

            <button data-dir="up">↑</button>
            <button data-dir="left">←</button>
            <button data-dir="center">●</button>
            <button data-dir="right">→</button>
            <button data-dir="down">↓</button>

        </div>

        <button class="mini-action" id="collectWrench">
            COLLECT WRENCH 🔧
        </button>
    `;

    let moves = 0;

    wrapper
        .querySelectorAll(
            ".direction-controls button"
        )
        .forEach(button => {

            button.addEventListener("click", () => {

                if (
                    button.dataset.dir !==
                    "center"
                ) {
                    moves++;
                }

            });

        });

    wrapper
        .querySelector("#collectWrench")
        .addEventListener("click", () => {

            if (moves >= 2) {

                completeSubtask();

            } else {

                wrongAttempt(
                    "Move through the zero-gravity area before collecting the wrench."
                );

            }

        });

}


function emergencyAirlockGame(wrapper) {

    wrapper.innerHTML += `

        <div class="space-map">

            <div
                class="map-object"
                style="left:15%;top:50%;"
            >
                🧑‍🚀
            </div>

            <div
                class="map-object"
                style="left:35%;top:30%;"
            >
                🪨
            </div>

            <div
                class="map-object"
                style="left:55%;top:70%;"
            >
                ☄️
            </div>

            <button
                class="map-object target"
                id="airlock"
                style="left:82%;top:45%;"
            >
                🚪
            </button>

        </div>

        <button class="mini-action" id="reachAirlock">
            REACH AIRLOCK 🚪
        </button>
    `;

    wrapper
        .querySelector("#reachAirlock")
        .addEventListener("click", () => {

            completeSubtask();

        });

}


/* =========================================================
   LEVEL 1 — TASK 3
========================================================= */

function targetSelectionGame(wrapper) {

    const targets = [
        ["🧰", "Tool Box"],
        ["🔵", "Blue Sample Container"],
        ["🪨", "Moon Rock"],
        ["📦", "Equipment Box"]
    ];

    wrapper.innerHTML += `
        <div class="action-grid" id="targetGrid"></div>
    `;

    const grid =
        wrapper.querySelector("#targetGrid");

    targets.forEach(target => {

        const button =
            document.createElement("button");

        button.className =
            "action-card";

        button.innerHTML = `
            <span class="emoji">${target[0]}</span>
            <strong>${target[1]}</strong>
        `;

        button.addEventListener("click", () => {

            if (target[1] === "Blue Sample Container") {

                button.classList.add("correct");

                setTimeout(
                    completeSubtask,
                    500
                );

            } else {

                button.classList.add("wrong");

                changeImmunity(
                    -getMistakePenalty()
                );

            }

        });

        grid.appendChild(button);

    });

}


function roboticArmControlGame(wrapper) {

    wrapper.innerHTML += `

        <div class="robot-arm">

            <div class="arm-base"></div>

            <div
                id="armPart"
                class="arm-part"
            ></div>

            <div
                id="armGripper"
                class="arm-gripper"
            >
                🦾
            </div>

        </div>

        <div class="direction-controls">

            <button data-arm="up">↑</button>
            <button data-arm="left">←</button>
            <button data-arm="center">●</button>
            <button data-arm="right">→</button>
            <button data-arm="down">↓</button>

        </div>

        <button
            id="alignArm"
            class="mini-action"
        >
            ALIGN GRIPPER
        </button>
    `;

    let moves = 0;

    wrapper
        .querySelectorAll(
            "[data-arm]"
        )
        .forEach(button => {

            button.addEventListener("click", () => {

                if (
                    button.dataset.arm !==
                    "center"
                ) {
                    moves++;
                }

            });

        });

    wrapper
        .querySelector("#alignArm")
        .addEventListener("click", () => {

            if (moves >= 2) {
                completeSubtask();
            } else {
                wrongAttempt(
                    "Move the arm closer to the target."
                );
            }

        });

}


function roboticArmGrabGame(wrapper) {

    wrapper.innerHTML += `

        <div class="big-spacecraft">
            🛰️
        </div>

        <div class="action-grid">

            <button
                id="grabButton"
                class="action-card"
            >
                <span class="emoji">🦾</span>
                <strong>GRAB</strong>
                <small>Grab the sample</small>
            </button>

            <button
                id="releaseButton"
                class="action-card"
            >
                <span class="emoji">📦</span>
                <strong>RELEASE</strong>
                <small>Place in storage</small>
            </button>

        </div>
    `;

    let grabbed = false;

    wrapper
        .querySelector("#grabButton")
        .addEventListener("click", () => {

            grabbed = true;

            wrapper
                .querySelector("#grabButton")
                .classList.add("correct");

        });

    wrapper
        .querySelector("#releaseButton")
        .addEventListener("click", () => {

            if (grabbed) {
                completeSubtask();
            } else {
                wrongAttempt(
                    "Grab the sample before releasing it."
                );
            }

        });

}


/* =========================================================
   LEVEL 2 — TASK 1
========================================================= */

function lunarMapGame(wrapper) {

    wrapper.innerHTML += `

        <div class="space-map" id="lunarMap">

            <div
                class="map-object"
                style="left:15%;top:70%;"
            >
                🧑‍🚀
            </div>

            <div
                class="map-object"
                style="left:35%;top:35%;"
            >
                🕳️
            </div>

            <div
                class="map-object"
                style="left:55%;top:65%;"
            >
                🪨
            </div>

            <button
                class="map-object target"
                id="researchSite"
                style="left:82%;top:30%;"
            >
                🔬
            </button>

        </div>

        <button
            id="selectRoute"
            class="mini-action"
        >
            SELECT ROUTE TO ALPHA
        </button>
    `;

    wrapper
        .querySelector("#selectRoute")
        .addEventListener("click", () => {

            completeSubtask();

        });

}


function lunarMovementGame(wrapper) {

    wrapper.innerHTML += `

        <div class="space-map">

            <div
                class="map-object"
                style="left:15%;top:75%;"
            >
                🧑‍🚀
            </div>

            <div
                class="map-object"
                style="left:35%;top:30%;"
            >
                🕳️
            </div>

            <div
                class="map-object"
                style="left:55%;top:70%;"
            >
                🪨
            </div>

            <div
                class="map-object target"
                style="left:85%;top:35%;"
            >
                🔬
            </div>

        </div>

        <div class="direction-controls">

            <button>↑</button>
            <button>←</button>
            <button>●</button>
            <button>→</button>
            <button>↓</button>

        </div>

        <button
            id="crossMoon"
            class="mini-action"
        >
            REACH RESEARCH AREA
        </button>
    `;

    let movement = 0;

    wrapper
        .querySelectorAll(
            ".direction-controls button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => movement++
            );

        });

    wrapper
        .querySelector("#crossMoon")
        .addEventListener("click", () => {

            if (movement >= 2) {
                completeSubtask();
            } else {
                wrongAttempt(
                    "Move across the lunar terrain first."
                );
            }

        });

}


function researchSiteGame(wrapper) {

    const objects = [
        ["🪨", "Rock"],
        ["🕳️", "Crater"],
        ["📦", "Equipment"],
        ["🔬", "Research Site Alpha"]
    ];

    wrapper.innerHTML += `
        <div class="action-grid" id="researchGrid"></div>
    `;

    const grid =
        wrapper.querySelector("#researchGrid");

    objects.forEach(object => {

        const button =
            document.createElement("button");

        button.className =
            "action-card";

        button.innerHTML = `
            <span class="emoji">${object[0]}</span>
            <strong>${object[1]}</strong>
        `;

        button.addEventListener("click", () => {

            if (
                object[1] ===
                "Research Site Alpha"
            ) {

                button.classList.add("correct");

                setTimeout(
                    completeSubtask,
                    500
                );

            } else {

                button.classList.add("wrong");

                changeImmunity(
                    -getMistakePenalty()
                );

            }

        });

        grid.appendChild(button);

    });

}


/* =========================================================
   LEVEL 2 — TASK 2
========================================================= */

function roverPreparationGame(wrapper) {

    const systems = [
        ["🔋", "Battery"],
        ["🛞", "Wheels"],
        ["📡", "Communication"],
        ["🧭", "Navigation"]
    ];

    wrapper.innerHTML += `
        <div class="system-panel" id="roverSystems"></div>

        <button
            id="startRover"
            class="mini-action"
        >
            START ROVER
        </button>
    `;

    const panel =
        wrapper.querySelector("#roverSystems");

    systems.forEach((system, index) => {

        const button =
            document.createElement("button");

        button.className =
            "system-item";

        button.innerHTML = `
            <div class="system-icon">
                ${system[0]}
            </div>

            <small>${system[1]}</small>

            <div class="system-status">
                ${index === 1 ? "🔴 DAMAGED" : "🟢 READY"}
            </div>
        `;

        if (index !== 1) {
            button.classList.add("ready");
        }

        button.addEventListener("click", () => {

            button.classList.add("ready");

            const status =
                button.querySelector(
                    ".system-status"
                );

            if (status) {
                status.textContent =
                    "🟢 READY";
            }

        });

        panel.appendChild(button);

    });

    wrapper
        .querySelector("#startRover")
        .addEventListener("click", () => {

            const ready =
                panel.querySelectorAll(
                    ".ready"
                ).length;

            if (ready === systems.length) {
                completeSubtask();
            } else {
                wrongAttempt(
                    "Repair the damaged rover system."
                );
            }

        });

}


function roverDrivingGame(wrapper) {

    wrapper.innerHTML += `

        <div class="rover">
            🚙
        </div>

        <div class="resource-grid">

            <div class="resource">
                <span>🔋</span>
                <strong>Battery</strong>
                <div class="resource-bar">
                    <div id="roverBattery"></div>
                </div>
            </div>

            <div class="resource">
                <span>🔬</span>
                <strong>Sample A</strong>
                <small>Waiting</small>
            </div>

            <div class="resource">
                <span>🔬</span>
                <strong>Sample B</strong>
                <small>Waiting</small>
            </div>

            <div class="resource">
                <span>🧭</span>
                <strong>Route</strong>
                <small>Active</small>
            </div>

        </div>

        <div class="rover-controls">

            <button>←</button>
            <button>↑</button>
            <button>→</button>

        </div>

        <button
            id="driveRover"
            class="mini-action"
        >
            COLLECT SAMPLES
        </button>
    `;

    let moves = 0;

    wrapper
        .querySelectorAll(
            ".rover-controls button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    moves++;

                    const battery =
                        wrapper.querySelector(
                            "#roverBattery"
                        );

                    if (battery) {

                        const width =
                            Math.max(
                                20,
                                100 - moves * 8
                            );

                        battery.style.width =
                            `${width}%`;

                    }

                }
            );

        });

    wrapper
        .querySelector("#driveRover")
        .addEventListener("click", () => {

            if (moves >= 3) {
                completeSubtask();
            } else {
                wrongAttempt(
                    "Drive farther and collect the required samples."
                );
            }

        });

}


function roverReturnGame(wrapper) {

    wrapper.innerHTML += `

        <div class="action-grid">

            <button
                id="shortRoute"
                class="action-card"
            >
                <span class="emoji">🛣️</span>
                <strong>SHORT ROUTE</strong>
                <small>Lower battery use</small>
            </button>

            <button
                id="longRoute"
                class="action-card"
            >
                <span class="emoji">🌑</span>
                <strong>LONG ROUTE</strong>
                <small>More samples</small>
            </button>

        </div>
    `;

    wrapper
        .querySelector("#shortRoute")
        .addEventListener(
            "click",
            completeSubtask
        );

    wrapper
        .querySelector("#longRoute")
        .addEventListener(
            "click",
            () => {

                changeEnergy(-8);

                wrongAttempt(
                    "The long route used too much battery. Choose the short route."
                );

            }
        );

}


/* =========================================================
   LEVEL 2 — TASK 3
========================================================= */

function habitatGame(wrapper) {

    wrapper.innerHTML += `

        <div class="big-spacecraft">
            🏠
        </div>

        <button
            id="placeHabitat"
            class="mini-action"
        >
            PLACE HABITAT
        </button>
    `;

    wrapper
        .querySelector("#placeHabitat")
        .addEventListener(
            "click",
            completeSubtask
        );

}


function moonPowerGame(wrapper) {

    wrapper.innerHTML += `

        <div class="circuit">

            <button
                class="circuit-node"
                id="solar"
            >
                ☀️<br>
                Solar Panels
            </button>

            <div class="circuit-arrow">→</div>

            <button
                class="circuit-node"
                id="battery"
            >
                🔋<br>
                Battery
            </button>

            <div class="circuit-arrow">→</div>

            <button
                class="circuit-node"
                id="habitatPower"
            >
                🏠<br>
                Habitat
            </button>

        </div>

        <button
            id="activatePower"
            class="mini-action"
        >
            ACTIVATE POWER
        </button>
    `;

    const nodes =
        wrapper.querySelectorAll(
            ".circuit-node"
        );

    nodes.forEach(node => {

        node.addEventListener(
            "click",
            () => node.classList.add("connected")
        );

    });

    wrapper
        .querySelector("#activatePower")
        .addEventListener("click", () => {

            if (
                wrapper.querySelectorAll(
                    ".connected"
                ).length === 3
            ) {

                completeSubtask();

            } else {

                wrongAttempt(
                    "Connect Solar Panels → Battery → Habitat."
                );

            }

        });

}


function moonBaseSystemsGame(wrapper) {

    wrapper.innerHTML += `

        <div class="system-panel">

            <button class="system-item">
                <div class="system-icon">🫧</div>
                <small>Oxygen</small>
                <div class="system-status">🔴 OFF</div>
            </button>

            <button class="system-item">
                <div class="system-icon">📡</div>
                <small>Communication</small>
                <div class="system-status">🔴 OFF</div>
            </button>

            <button class="system-item">
                <div class="system-icon">🔋</div>
                <small>Power</small>
                <div class="system-status">🟢 READY</div>
            </button>

        </div>

        <button
            id="activateBase"
            class="mini-action"
        >
            ACTIVATE MOON BASE
        </button>
    `;

    const systems =
        wrapper.querySelectorAll(
            ".system-item"
        );

    systems.forEach((system, index) => {

        if (index < 2) {

            system.addEventListener(
                "click",
                () => {

                    system.classList.add("ready");

                    const status =
                        system.querySelector(
                            ".system-status"
                        );

                    status.textContent =
                        "🟢 READY";

                }
            );

        }

    });

    wrapper
        .querySelector("#activateBase")
        .addEventListener("click", () => {

            if (
                wrapper.querySelectorAll(
                    ".ready"
                ).length >= 2
            ) {

                completeSubtask();

            } else {

                wrongAttempt(
                    "Activate both oxygen and communication."
                );

            }

        });

}


/* =========================================================
   LEVEL 3 — TASK 1
========================================================= */

function emergencyDiagnosisGame(wrapper) {

    const systems = [
        ["🫧", "Oxygen", true],
        ["🔋", "Power", false],
        ["🌡️", "Temperature", false],
        ["📡", "Communication", false]
    ];

    wrapper.innerHTML += `
        <div class="system-panel" id="emergencySystems"></div>
    `;

    const panel =
        wrapper.querySelector(
            "#emergencySystems"
        );

    systems.forEach(system => {

        const button =
            document.createElement("button");

        button.className =
            "system-item";

        button.innerHTML = `
            <div class="system-icon">
                ${system[0]}
            </div>

            <small>${system[1]}</small>

            <div class="system-status">
                ${system[2] ? "🔴 LOW" : "🟢 NORMAL"}
            </div>
        `;

        button.addEventListener("click", () => {

            if (system[2]) {

                button.classList.add("correct");

                setTimeout(
                    completeSubtask,
                    500
                );

            } else {

                button.classList.add("wrong");

                changeImmunity(
                    -getMistakePenalty()
                );

            }

        });

        panel.appendChild(button);

    });

}


function emergencyRepairGame(wrapper) {

    wrapper.innerHTML += `

        <div class="circuit">

            <button class="circuit-node">
                🫧<br>
                Oxygen Tank
            </button>

            <div class="circuit-arrow">→</div>

            <button class="circuit-node">
                🔧<br>
                Repair Valve
            </button>

            <div class="circuit-arrow">→</div>

            <button class="circuit-node">
                🏠<br>
                Habitat
            </button>

        </div>

        <button
            id="repairOxygen"
            class="mini-action"
        >
            RESTORE OXYGEN
        </button>
    `;

    const nodes =
        wrapper.querySelectorAll(
            ".circuit-node"
        );

    nodes.forEach(node => {

        node.addEventListener(
            "click",
            () => node.classList.add("connected")
        );

    });

    wrapper
        .querySelector("#repairOxygen")
        .addEventListener("click", () => {

            if (
                wrapper.querySelectorAll(
                    ".connected"
                ).length === 3
            ) {

                completeSubtask();

            } else {

                wrongAttempt(
                    "Connect the repair system correctly."
                );

            }

        });

}


function shelterGame(wrapper) {

    wrapper.innerHTML += `

        <div class="space-map">

            <div
                class="map-object"
                style="left:15%;top:50%;"
            >
                🧑‍🚀
            </div>

            <div
                class="map-object"
                style="left:35%;top:30%;"
            >
                ⚡
            </div>

            <div
                class="map-object"
                style="left:60%;top:65%;"
            >
                🚨
            </div>

            <button
                id="shelter"
                class="map-object target"
                style="left:85%;top:40%;"
            >
                🛡️
            </button>

        </div>

        <button
            id="reachShelter"
            class="mini-action"
        >
            REACH SHELTER
        </button>
    `;

    wrapper
        .querySelector("#reachShelter")
        .addEventListener(
            "click",
            completeSubtask
        );

}


/* =========================================================
   LEVEL 3 — TASK 2
========================================================= */

function suppliesGame(wrapper) {

    const supplies = [
        ["🫧", "Oxygen Tank", true],
        ["🔧", "Repair Kit", true],
        ["🍱", "Food", true],
        ["💧", "Water", true],
        ["🔬", "Science Equipment", true],
        ["🎮", "Extra Equipment", false]
    ];

    wrapper.innerHTML += `
        <div class="action-grid" id="supplyGrid"></div>

        <button
            id="loadSupplies"
            class="mini-action"
        >
            LOAD SUPPLIES
        </button>
    `;

    const grid =
        wrapper.querySelector("#supplyGrid");

    supplies.forEach(supply => {

        const button =
            document.createElement("button");

        button.className =
            "action-card";

        button.innerHTML = `
            <span class="emoji">${supply[0]}</span>
            <strong>${supply[1]}</strong>
        `;

        button.dataset.essential =
            supply[2];

        button.addEventListener(
            "click",
            () => button.classList.toggle("selected")
        );

        grid.appendChild(button);

    });

    wrapper
        .querySelector("#loadSupplies")
        .addEventListener("click", () => {

            const selected =
                [...grid.querySelectorAll(
                    ".selected"
                )];

            const correct =
                selected.length === 5 &&
                selected.every(
                    button =>
                        button.dataset.essential ===
                        "true"
                );

            if (correct) {
                completeSubtask();
            } else {
                wrongAttempt(
                    "Pack the essential equipment only."
                );
            }

        });

}


function balanceSuppliesGame(wrapper) {

    wrapper.innerHTML += `

        <div class="resource-grid">

            <div class="resource">
                <span>🫧</span>
                <strong>Oxygen</strong>
                <div class="resource-bar">
                    <div></div>
                </div>
            </div>

            <div class="resource">
                <span>💧</span>
                <strong>Water</strong>
                <div class="resource-bar">
                    <div></div>
                </div>
            </div>

            <div class="resource">
                <span>🍱</span>
                <strong>Food</strong>
                <div class="resource-bar">
                    <div></div>
                </div>
            </div>

            <div class="resource">
                <span>🔋</span>
                <strong>Power</strong>
                <div class="resource-bar">
                    <div></div>
                </div>
            </div>

        </div>

        <button
            id="balanceButton"
            class="mini-action"
        >
            BALANCE SUPPLIES
        </button>
    `;

    wrapper
        .querySelector("#balanceButton")
        .addEventListener(
            "click",
            completeSubtask
        );

}


function finalCheckGame(wrapper) {

    const systems = [
        ["🫧", "Oxygen"],
        ["⛽", "Fuel"],
        ["📡", "Communication"],
        ["🧭", "Navigation"],
        ["🔥", "Engine"],
        ["🛬", "Landing System"]
    ];

    wrapper.innerHTML += `
        <div
            class="system-panel"
            id="finalSystems"
        ></div>

        <button
            id="readyForLaunch"
            class="mini-action"
        >
            CONFIRM LAUNCH READINESS
        </button>
    `;

    const panel =
        wrapper.querySelector(
            "#finalSystems"
        );

    systems.forEach((system, index) => {

        const button =
            document.createElement("button");

        button.className =
            "system-item";

        button.innerHTML = `
            <div class="system-icon">
                ${system[0]}
            </div>

            <small>${system[1]}</small>

            <div class="system-status">
                ${index === 2 ? "🔴 CHECK" : "🟢 READY"}
            </div>
        `;

        if (index !== 2) {
            button.classList.add("ready");
        }

        button.addEventListener("click", () => {

            button.classList.add("ready");

            button.querySelector(
                ".system-status"
            ).textContent =
                "🟢 READY";

        });

        panel.appendChild(button);

    });

    wrapper
        .querySelector("#readyForLaunch")
        .addEventListener("click", () => {

            if (
                panel.querySelectorAll(
                    ".ready"
                ).length === systems.length
            ) {

                completeSubtask();

            } else {

                wrongAttempt(
                    "Complete every spacecraft system check."
                );

            }

        });

}


/* =========================================================
   LEVEL 3 — TASK 3
========================================================= */

function launchSystemsGame(wrapper) {

    const systems = [
        ["⚡", "Power"],
        ["🧭", "Navigation"],
        ["📡", "Communication"],
        ["🔥", "Engine"]
    ];

    wrapper.innerHTML += `
        <div
            class="action-grid"
            id="launchSystems"
        ></div>

        <button
            id="launchButton"
            class="mini-action"
        >
            START COUNTDOWN
        </button>
    `;

    const grid =
        wrapper.querySelector(
            "#launchSystems"
        );

    systems.forEach(system => {

        const button =
            document.createElement("button");

        button.className =
            "action-card";

        button.innerHTML = `
            <span class="emoji">
                ${system[0]}
            </span>

            <strong>${system[1]}</strong>

            <small>Activate</small>
        `;

        button.addEventListener(
            "click",
            () => button.classList.add("correct")
        );

        grid.appendChild(button);

    });

    wrapper
        .querySelector("#launchButton")
        .addEventListener("click", () => {

            if (
                grid.querySelectorAll(
                    ".correct"
                ).length === systems.length
            ) {

                completeSubtask();

            } else {

                wrongAttempt(
                    "Activate Power, Navigation, Communication and Engine."
                );

            }

        });

}


function navigationGame(wrapper) {

    wrapper.innerHTML += `

        <div class="space-map">

            <div
                class="map-object"
                style="left:12%;top:50%;"
            >
                🚀
            </div>

            <div
                class="map-object target"
                style="left:85%;top:50%;"
            >
                🌍
            </div>

            <div
                class="map-object"
                style="left:45%;top:25%;"
            >
                ☄️
            </div>

            <div
                class="map-object"
                style="left:62%;top:75%;"
            >
                🛰️
            </div>

        </div>

        <div class="direction-controls">

            <button>↑</button>
            <button>←</button>
            <button>●</button>
            <button>→</button>
            <button>↓</button>

        </div>

        <button
            id="navigateEarth"
            class="mini-action"
        >
            APPROACH EARTH
        </button>
    `;

    let adjustments = 0;

    wrapper
        .querySelectorAll(
            ".direction-controls button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => adjustments++
            );

        });

    wrapper
        .querySelector("#navigateEarth")
        .addEventListener("click", () => {

            if (adjustments >= 3) {
                completeSubtask();
            } else {
                wrongAttempt(
                    "Stay on the flight path and make more navigation adjustments."
                );
            }

        });

}


function landingGame(wrapper) {

    wrapper.innerHTML += `

        <div class="landing-zone">

            <div class="earth-horizon"></div>

            <div class="safe-zone"></div>

            <div
                id="landingRocket"
                class="landing-rocket"
            >
                🚀
            </div>

        </div>

        <button
            id="landButton"
            class="mini-action"
        >
            LAND IN GREEN ZONE
        </button>
    `;

    let descent = 0;

    const rocket =
        wrapper.querySelector(
            "#landingRocket"
        );

    const interval =
        setInterval(() => {

            descent++;

            if (rocket) {

                rocket.style.top =
                    `${20 + descent * 8}px`;

            }

            if (descent >= 6) {

                clearInterval(interval);

            }

        }, 300);

    game.temporaryData.interval =
        interval;

    wrapper
        .querySelector("#landButton")
        .addEventListener("click", () => {

            if (descent >= 4) {

                completeSubtask();

            } else {

                wrongAttempt(
                    "Keep controlling the descent until the spacecraft reaches the landing zone."
                );

            }

        });

}


/* =========================================================
   FALLBACK MINI GAME
========================================================= */

function createSimpleCompletionGame(wrapper) {

    wrapper.innerHTML += `
        <button
            id="completeActivity"
            class="mini-action"
        >
            COMPLETE ACTIVITY
        </button>
    `;

    wrapper
        .querySelector("#completeActivity")
        .addEventListener(
            "click",
            completeSubtask
        );

}


/* =========================================================
   SUBTASK COMPLETION
========================================================= */

function completeSubtask() {

    if (game.taskCompleted) {
        return;
    }

    clearSubtaskEffects();

    changeEnergy(-5, false);

    game.currentSubtask++;

    if (game.currentSubtask >= 3) {

        completeCurrentTask();

        return;

    }

    updateGlobalHUD();

    renderCurrentSubtask();

}


/* =========================================================
   TASK COMPLETION
========================================================= */

function completeCurrentTask() {

    if (game.taskCompleted) {
        return;
    }

    clearTimer();

    clearSubtaskEffects();

    const level =
        levels[game.currentLevel];

    const task =
        level.tasks[game.currentTask];

    game.taskCompleted = true;

    gainExperience(task.reward);

    changeEnergy(-8, false);

    game.completedTasks.push(
        `${game.currentLevel}-${game.currentTask}`
    );

    updateGlobalHUD();

    showSuccessModal(
        task.title,
        task.message,
        `+${task.reward} XP`
    );

}


/* =========================================================
   NEXT TASK / LEVEL
========================================================= */

function continueAfterSuccess() {

    closeModal("messageModal");

    game.taskCompleted = false;

    const level =
        levels[game.currentLevel];

    if (game.currentTask < 2) {

        game.currentTask++;

        game.currentSubtask = 0;

        startTask();

        return;
    }

    /* Entire level complete */

    if (
        game.currentLevel <
        levels.length - 1
    ) {

        game.unlockedLevels[
            game.currentLevel + 1
        ] = true;

        game.currentLevel++;

        game.currentTask = 0;

        game.currentSubtask = 0;

        game.energy = 100;

        game.immunity = 100;

        updateLevelSelection();

        showLevelTransition();

    } else {

        missionComplete();

    }

}


/* =========================================================
   LEVEL TRANSITION
========================================================= */

function showLevelTransition() {

    const nextLevel =
        levels[game.currentLevel];

    setText(
        "levelIntroIcon",
        nextLevel.icon
    );

    setText(
        "levelIntroLabel",
        `LEVEL ${nextLevel.number}`
    );

    setText(
        "levelIntroTitle",
        nextLevel.title
    );

    setText(
        "levelIntroSubtitle",
        nextLevel.subtitle
    );

    setText(
        "levelIntroDescription",
        nextLevel.description
    );

    setText(
        "robotIntroMessage",
        game.currentLevel === 1
            ? "We have reached the Moon! Your real exploration begins now."
            : "The Moon mission is complete. But an emergency has changed everything!"
    );

    showScreen("levelIntroScreen");

}


/* =========================================================
   MISSION COMPLETE
========================================================= */

function missionComplete() {

    clearTimer();

    clearSubtaskEffects();

    setText(
        "finalCharacter",
        characters[
            game.character
        ].emoji
    );

    setText(
        "finalXP",
        `${game.experience} XP`
    );

    showScreen(
        "missionCompleteScreen"
    );

}


/* =========================================================
   ENERGY
========================================================= */

function changeEnergy(
    amount,
    canFail = true
) {

    if (
        game.taskCompleted &&
        amount < 0
    ) {
        return;
    }

    game.energy =
        Math.max(
            0,
            Math.min(
                100,
                game.energy + amount
            )
        );

    if (amount < 0) {

        game.taskEnergySpent +=
            Math.abs(amount);

    }

    updateGlobalHUD();

    if (
        game.energy <= 0 &&
        canFail
    ) {

        failCurrentTask(
            "Your energy ran out during the mission."
        );

    }

}


/* =========================================================
   IMMUNITY
========================================================= */

function changeImmunity(amount) {

    let newValue =
        game.immunity + amount;

    /*
       BASIC MODE:
       Immunity is affected by mistakes,
       but it can never reach zero.
    */

    if (game.mode === "basic") {

        newValue =
            Math.max(
                25,
                newValue
            );

    } else {

        newValue =
            Math.max(
                0,
                newValue
            );

    }

    game.immunity =
        Math.min(
            100,
            newValue
        );

    updateGlobalHUD();

    if (
        game.mode === "advanced" &&
        game.immunity <= 0
    ) {

        failCurrentTask(
            "Your immunity dropped too low. Restart the task to recover."
        );

    }

}


/* =========================================================
   MISTAKE PENALTY
========================================================= */

function getMistakePenalty() {

    const character =
        characters[game.character];

    let penalty = 7;

    if (
        character &&
        character.technical >= 5
    ) {
        penalty -= 1;
    }

    if (
        game.mode === "advanced"
    ) {
        penalty += 4;
    }

    return penalty;

}


/* =========================================================
   WRONG ATTEMPT
========================================================= */

function wrongAttempt(message) {

    changeEnergy(-5);

    changeImmunity(
        -getMistakePenalty()
    );

    setText(
        "robotMessage",
        message
    );

}


/* =========================================================
   EXPERIENCE
========================================================= */

function gainExperience(amount) {

    game.experience += amount;

    updateGlobalHUD();

}


/* =========================================================
   TIMER
========================================================= */

function startTimer() {

    clearTimer();

    if (game.mode !== "advanced") {
        return;
    }

    game.timer = 60;

    updateTimer();

    game.timerInterval =
        setInterval(() => {

            game.timer--;

            updateTimer();

            if (game.timer <= 0) {

                clearTimer();

                failCurrentTask(
                    "Time's up! Take a breath and try the task again."
                );

            }

        }, 1000);

}


function updateTimer() {

    setText(
        "timerText",
        game.timer
    );

    const timer =
        $("timerText");

    if (!timer) {
        return;
    }

    timer.style.color =
        game.timer <= 15
            ? "#ff6f91"
            : "#ffd86b";

}


function clearTimer() {

    if (game.timerInterval) {

        clearInterval(
            game.timerInterval
        );

        game.timerInterval = null;

    }

}


function updateTimerVisibility() {

    const timerCard =
        $("timerCard");

    if (!timerCard) {
        return;
    }

    if (game.mode === "basic") {

        timerCard.classList.add("hidden");

    } else {

        timerCard.classList.remove("hidden");

        updateTimer();

    }

}


/* =========================================================
   FAILURE
========================================================= */

function failCurrentTask(reason) {

    if (game.taskCompleted) {
        return;
    }

    clearTimer();

    clearSubtaskEffects();

    game.immunity = 0;

    changeEnergy(-10, false);

    updateGlobalHUD();

    setText(
        "failureMessage",
        reason
    );

    setText(
        "failureEnergy",
        game.energy
    );

    setText(
        "failureImmunity",
        game.immunity
    );

    $("failureModal")?.classList.remove(
        "hidden"
    );

}


/* =========================================================
   RETRY
========================================================= */

function bindRetryButton() {

    onClick(
        "retryButton",
        () => {

            closeModal(
                "failureModal"
            );

            /*
                Restarting recovers immunity.
                Energy is restored partially.
            */

            game.immunity = 100;

            game.energy =
                Math.min(
                    100,
                    game.energy + 20
                );

            startTask();

        }
    );

}


/* =========================================================
   SUCCESS MODAL
========================================================= */

function showSuccessModal(
    title,
    message,
    reward
) {

    setText(
        "modalTitle",
        title
    );

    setText(
        "modalMessage",
        message
    );

    setText(
        "modalReward",
        reward
    );

    setText(
        "modalIcon",
        "🎉"
    );

    $("messageModal")?.classList.remove(
        "hidden"
    );

}


function bindModalButton() {

    onClick(
        "modalButton",
        continueAfterSuccess
    );

}


/* =========================================================
   PLAY AGAIN
========================================================= */

function bindPlayAgainButton() {

    onClick(
        "playAgainButton",
        () => {

            clearTimer();

            game.energy = 100;

            game.immunity = 100;

            game.experience = 0;

            game.currentLevel = 0;

            game.currentTask = 0;

            game.currentSubtask = 0;

            game.completedTasks = [];

            game.unlockedLevels =
                [true, false, false];

            game.taskCompleted = false;

            game.temporaryData = {};

            updateGlobalHUD();

            updateLevelSelection();

            showScreen(
                "levelSelectionScreen"
            );

        }
    );

}


/* =========================================================
   GLOBAL HUD
========================================================= */

function updateGlobalHUD() {

    const header =
        $("gameHeader");

    const gameplayVisible =
        !$("gameScreen")?.classList.contains(
            "hidden"
        );

    if (
        gameplayVisible ||
        game.currentLevel >= 0
    ) {

        if (header) {
            header.classList.remove(
                "hidden"
            );
        }

    }

    const energyBar =
        $("energyBar");

    const immunityBar =
        $("immunityBar");

    const experienceBar =
        $("experienceBar");

    if (energyBar) {
        energyBar.style.width =
            `${game.energy}%`;
    }

    if (immunityBar) {
        immunityBar.style.width =
            `${game.immunity}%`;
    }

    if (experienceBar) {

        const xpProgress =
            Math.min(
                100,
                game.experience % 100
            );

        experienceBar.style.width =
            `${xpProgress}%`;

    }

    setText(
        "energyText",
        `${game.energy} / 100`
    );

    setText(
        "immunityText",
        `${game.immunity} / 100`
    );

    setText(
        "experienceText",
        `${game.experience} XP`
    );

}


/* =========================================================
   CLEAR SUBTASK EFFECTS
========================================================= */

function clearSubtaskEffects() {

    if (
        game.temporaryData &&
        game.temporaryData.interval
    ) {

        clearInterval(
            game.temporaryData.interval
        );

    }

    game.temporaryData = {};

}


/* =========================================================
   MODAL CLOSE
========================================================= */

function closeModal(id) {

    const modal = $(id);

    if (modal) {
        modal.classList.add(
            "hidden"
        );
    }

}


/* =========================================================
   STARS
========================================================= */

function stars(value) {

    const filled =
        "⭐".repeat(value);

    const empty =
        "☆".repeat(5 - value);

    return filled + empty;

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

    const directions = [
        {
            left: "-5%",
            top: "15%",
            rotation: "-35deg"
        },
        {
            left: "30%",
            top: "-5%",
            rotation: "25deg"
        },
        {
            left: "75%",
            top: "5%",
            rotation: "-40deg"
        },
        {
            left: "105%",
            top: "35%",
            rotation: "150deg"
        },
        {
            left: "-5%",
            top: "70%",
            rotation: "-25deg"
        }
    ];

    const direction =
        directions[
            Math.floor(
                Math.random() *
                directions.length
            )
        ];

    star.style.left =
        direction.left;

    star.style.top =
        direction.top;

    star.style.transform =
        `rotate(${direction.rotation})`;

    container.appendChild(star);

    setTimeout(() => {

        star.remove();

    }, 3000);

}


/* =========================================================
   HIDE OLD / UNUSED ELEMENTS
========================================================= */

function hideUnusedElements() {

    /*
        Compatibility protection in case an older
        HTML version still contains these elements.
    */

    [
        "traineeId",
        "profileId",
        "hudId"
    ].forEach(id => {

        const element = $(id);

        if (element) {
            element.style.display =
                "none";
        }

    });

}


/* =========================================================
   DOM READY
========================================================= */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initGame
    );

} else {

    initGame();

}