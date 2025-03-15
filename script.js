// Game State
let gameState = "start";
let playerName = "";
let inventory = [];
let hotbar = new Array(10).fill(null);
let mobs = [];
let petals = [];
let playerPetals = []; // Player's active petals

// Start Screen Elements
const startScreen = document.getElementById("startScreen");
const startButton = document.getElementById("startButton");
const playerNameInput = document.getElementById("playerName");

// Game Screen Elements
const gameScreen = document.getElementById("gameScreen");
const gameCanvas = document.getElementById("gameCanvas");
const chatbox = document.getElementById("chatbox");
const chatInput = document.getElementById("chatInput");
const inventoryItemsDiv = document.getElementById("inventoryItems");
const hotbarDiv = document.getElementById("hotbar");
const ctx = gameCanvas.getContext("2d");

// Game Constants
const MOB_RARITIES = ["common", "uncommon", "rare", "epic", "legendary", "mythic", "supreme"];
const PETAL_TYPES = ["rose", "stinger", "rice", "basic"];
const MOB_SIZE = 30;
const PETAL_SIZE = 10;
const PLAYER_SIZE = 20;
let playerX = gameCanvas.width / 2;
let playerY = gameCanvas.height / 2;

// Petal Stats
const PETAL_STATS = {
    basic: { health: 10, damage: 2 },
    rose: { health: 15, damage: 3 },
    stinger: { health: 8, damage: 5 },
    rice: { health: 20, damage: 1 },
};

// Event Listeners
startButton.addEventListener("click", startGame);
chatInput.addEventListener("keypress", handleChatInput);
gameCanvas.addEventListener("click", playerAttack);

// Functions
function startGame() {
    playerName = playerNameInput.value;
    if (playerName) {
        startScreen.style.display = "none";
        gameScreen.style.display = "block";
        gameState = "game";
        initializeGame();
    } else {
        alert("Please enter a name.");
    }
}

function handleChatInput(event) {
    if (event.key === "Enter") {
        const message = `${playerName}: ${chatInput.value}`;
        chatbox.innerHTML += `<p>${message}</p>`;
        chatInput.value = "";
        chatbox.scrollTop = chatbox.scrollHeight;
    }
}

function initializeGame() {
    for (let i = 0; i < 10; i++) {
        const slot = document.createElement("div");
        slot.classList.add("hotbar-slot");
        slot.dataset.slotIndex = i;
        slot.addEventListener("click", () => useHotbarItem(i));
        hotbarDiv.appendChild(slot);
    }
    for (let i = 0; i < 10; i++) {
        hotbar[i] = { name: "basic", rarity: "common" };
    }
    spawnMob();
    gameLoop();
}

function spawnMob() {
    setInterval(() => {
        const rarity = MOB_RARITIES[Math.floor(Math.random() * MOB_RARITIES.length)];
        mobs.push({
            x: Math.random() * gameCanvas.width,
            y: Math.random() * gameCanvas.height,
            rarity: rarity,
            type: "mob",
            health: getMobHealth(rarity),
        });
    }, 2000);
}

function getMobHealth(rarity) {
    switch (rarity) {
        case "common": return 10;
        case "uncommon": return 15;
        case "rare": return 20;
        case "epic": return 30;
        case "legendary": return 40;
        case "mythic": return 50;
        case "supreme": return 60;
        default: return 10;
    }
}

function dropPetal(mob) {
    const petalType = PETAL_TYPES[Math.floor(Math.random() * PETAL_TYPES.length)];
    petals.push({
        x: mob.x,
        y: mob.y,
        type: petalType,
        rarity: mob.rarity,
    });
}

function updateInventoryDisplay() {
    inventoryItemsDiv.innerHTML = "";
    inventory.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.textContent = `<span class="math-inline">\{item\.name\} \(</span>{item.rarity})`;
        itemDiv.addEventListener("click", () => addToHotbar(index));
        inventoryItemsDiv.appendChild(itemDiv);
    });
}

function addToHotbar(inventoryIndex) {
    const item = inventory[inventoryIndex];
    const emptySlot = hotbar.findIndex(slot => slot === null);
    if (emptySlot !== -1) {
        hotbar[emptySlot] = item;
        inventory.splice(inventoryIndex, 1);
        updateInventoryDisplay();
    }
}

function useHotbarItem(slotIndex) {
    const item = hotbar[slotIndex];
    if (item) {
        console.log(`Used ${item.name} from slot ${slotIndex}`);
        hotbar[slotIndex] = null;
    }
}

function gameLoop() {
    update();
    render();
    requestAnimationFrame(gameLoop);
}

function update() {
    mobs.forEach((mob, mobIndex) => {
        // Simple mob movement
        if (mob.x < playerX) mob.x += 1;
        if (mob.x > playerX) mob.x -= 1;
        if (mob.y < playerY) mob.y += 1;
        if (mob.y > playerY) mob.y -= 1;

        // Petal collision with mob
        playerPetals.forEach((petal, petalIndex) => {
            if (
                petal.x < mob.x + MOB_SIZE &&
                petal.x + PETAL_SIZE > mob.x &&
                petal.y < mob.y + MOB_SIZE &&
                petal.y + PETAL_SIZE > mob.y
