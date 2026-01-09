const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const tileSize = 16;
const mazeWidth = 28; // Standard Pac-Man maze width
const mazeHeight = 31; // Standard Pac-Man maze height
const pacSpeed = 2; // Matches classic Pac-Man speed
const ghostSpeed = 1.5; // Slightly faster than original for simplicity
const powerPelletDuration = 5000; // 5 seconds of power-up

// Maze layout (1 = wall, 0 = path/dot, 2 = Pac-Man start, 3 = ghost start, 4 = power pellet)
const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
    [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
    [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,3,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Game objects
let pacman = { x: 13 * tileSize, y: 23 * tileSize, dx: 0, dy: 0, angle: Math.PI / 2, mouthOpen: 0.2, poweredUp: false, lastDirection: 'right' };
let ghosts = [];
let dots = [];
let powerPellets = [];
let lives = 3;
let score = 0;
const ghostColors = ['red', 'pink', 'cyan', 'orange']; // Blinky, Pinky, Inky, Clyde
let gameState = 'playing'; // 'playing', 'win', 'lose'
let powerUpTimer = null;

// Ghost modes (classic Pac-Man behavior)
const ghostModes = ['scatter', 'chase'];
let currentMode = 'scatter';
let modeTimer = 0;
const modeDuration = 7000; // 7 seconds per mode (scatter/chase)

// Initialize game
function init() {
    pacman.x = 13 * tileSize; // Classic start position (center bottom)
    pacman.y = 23 * tileSize;
    pacman.dx = 0;
    pacman.dy = 0;
    pacman.poweredUp = false;
    pacman.mouthOpen = 0.2;
    pacman.lastDirection = 'right';
    ghosts = [];
    dots = [];
    powerPellets = [];
    lives = 3;
    score = 0;
    gameState = 'playing';
    currentMode = 'scatter';
    modeTimer = 0;

    for (let y = 0; y < mazeHeight; y++) {
        for (let x = 0; x < mazeWidth; x++) {
            if (maze[y][x] === 2) {
                pacman.x = x * tileSize + tileSize / 2; // Center in tile
                pacman.y = y * tileSize + tileSize / 2;
            } else if (maze[y][x] === 3) {
                ghosts.push({ 
                    x: x * tileSize + tileSize / 2, // Center in tile
                    y: y * tileSize + tileSize / 2,
                    dx: 0, 
                    dy: 0, 
                    color: ghostColors[Math.min(ghosts.length, ghostColors.length - 1)],
                    mode: 'scatter', // Individual ghost mode
                    target: { x: 0, y: 0 }, // Target for movement
                    frightened: false,
                    frightenedTime: 0
                });
            } else if (maze[y][x] === 0) {
                dots.push({ x: x * tileSize + tileSize / 2, y: y * tileSize + tileSize / 2 });
            } else if (maze[y][x] === 4) {
                powerPellets.push({ x: x * tileSize + tileSize / 2, y: y * tileSize + tileSize / 2 });
            }
        }
    }
    setGhostTargets(); // Set initial ghost targets
}

// Keyboard controls
let keys = {};
document.addEventListener('keydown', (e) => keys[e.key] = true);
document.addEventListener('keyup', (e) => keys[e.key] = false);

function handleInput() {
    let newDx = pacman.dx;
    let newDy = pacman.dy;

    if (keys['ArrowUp']) { newDx = 0; newDy = -pacSpeed; pacman.angle = Math.PI; pacman.lastDirection = 'up'; }
    if (keys['ArrowDown']) { newDx = 0; newDy = pacSpeed; pacman.angle = 0; pacman.lastDirection = 'down'; }
    if (keys['ArrowLeft']) { newDx = -pacSpeed; newDy = 0; pacman.angle = Math.PI * 1.5; pacman.lastDirection = 'left'; }
    if (keys['ArrowRight']) { newDx = pacSpeed; newDy = 0; pacman.angle = Math.PI / 2; pacman.lastDirection = 'right'; }

    // Try to move in the new direction if possible, ensuring alignment
    let nextX = pacman.x + newDx;
    let nextY = pacman.y + newDy;
    let centerX = nextX;
    let centerY = nextY;

    if (!isWall(centerX, centerY)) {
        pacman.dx = newDx;
        pacman.dy = newDy;
    } else {
        // Allow sliding along walls or stop if no valid path
        let tileX = Math.floor(centerX / tileSize);
        let tileY = Math.floor(centerY / tileSize);
        if (tileX >= 0 && tileX < mazeWidth && tileY >= 0 && tileY < mazeHeight) {
            if (maze[tileY][tileX] !== 1) {
                pacman.dx = newDx;
                pacman.dy = newDy;
            } else {
                if (newDx !== 0 && !isWall(centerX + newDx, centerY)) {
                    pacman.dx = newDx;
                    pacman.dy = 0;
                } else if (newDy !== 0 && !isWall(centerX, centerY + newDy)) {
                    pacman.dx = 0;
                    pacman.dy = newDy;
                } else {
                    pacman.dx = 0;
                    pacman.dy = 0;
                }
            }
        } else {
            pacman.dx = 0;
            pacman.dy = 0;
        }
    }

    // Ensure Pac-Man stays centered in the tile
    pacman.x = Math.round(pacman.x / tileSize) * tileSize;
    pacman.y = Math.round(pacman.y / tileSize) * tileSize;
}

// Collision detection (check tile boundaries)
function isWall(x, y) {
    let tileX = Math.floor(x / tileSize);
    let tileY = Math.floor(y / tileSize);
    if (tileX < 0 || tileX >= mazeWidth || tileY < 0 || tileY >= mazeHeight) {
        return true; // Treat out-of-bounds as walls
    }
    return maze[tileY] && maze[tileY][tileX] === 1;
}

// Set ghost targets based on mode and position
function setGhostTargets() {
    ghosts.forEach((ghost, index) => {
        if (ghost.frightened) {
            ghost.target = { x: Math.random() * canvas.width, y: Math.random() * canvas.height }; // Random flee
        } else if (currentMode === 'scatter') {
            // Scatter to corners (simplified for each ghost)
            switch (index) {
                case 0: ghost.target = { x: 0, y: 0 }; break; // Blinky (top-left)
                case 1: ghost.target = { x: mazeWidth * tileSize, y: 0 }; break; // Pinky (top-right)
                case 2: ghost.target = { x: 0, y: mazeHeight * tileSize }; break; // Inky (bottom-left)
                case 3: ghost.target = { x: mazeWidth * tileSize, y: mazeHeight * tileSize }; break; // Clyde (bottom-right)
            }
        } else if (currentMode === 'chase') {
            // Chase Pac-Man (simplified, classic patterns)
            switch (index) {
                case 0: // Blinky (chases directly)
                    ghost.target = { x: pacman.x, y: pacman.y };
                    break;
                case 1: // Pinky (in front of Pac-Man, 4 tiles ahead)
                    ghost.target = getAheadTarget(pacman, 4);
                    break;
                case 2: // Inky (complex, based on Blinky and Pac-Man)
                    let blinky = ghosts[0];
                    let pacmanVector = getAheadTarget(pacman, 2);
                    ghost.target = {
                        x: pacmanVector.x + (pacmanVector.x - blinky.x),
                        y: pacmanVector.y + (pacmanVector.y - blinky.y)
                    };
                    break;
                case 3: // Clyde (chases if far, scatters if close)
                    let dist = Math.hypot(ghost.x - pacman.x, ghost.y - pacman.y);
                    if (dist > 8 * tileSize) {
                        ghost.target = { x: pacman.x, y: pacman.y };
                    } else {
                        ghost.target = { x: mazeWidth * tileSize, y: mazeHeight * tileSize };
                    }
                    break;
            }
        }
    });
}

// Helper to get target position ahead of Pac-Man
function getAheadTarget(pacmanObj, tilesAhead) {
    let targetX = pacman.x;
    let targetY = pacman.y;
    switch (pacmanObj.lastDirection) {
        case 'up': targetY -= tilesAhead * tileSize; break;
        case 'down': targetY += tilesAhead * tileSize; break;
        case 'left': targetX -= tilesAhead * tileSize; break;
        case 'right': targetX += tilesAhead * tileSize; break;
    }
    return { x: targetX, y: targetY };
}

// Move entity toward target, ensuring grid alignment
function moveToward(target, entity, speed) {
    let dx = target.x - entity.x;
    let dy = target.y - entity.y;
    let distance = Math.hypot(dx, dy);
    if (distance > speed) {
        entity.dx = (dx / distance) * speed;
        entity.dy = (dy / distance) * speed;
    } else {
        entity.dx = 0;
        entity.dy = 0;
    }
    // Ensure movement doesn’t hit walls and stays aligned
    let nextX = entity.x + entity.dx;
    let nextY = entity.y + entity.dy;
    if (!isWall(nextX + tileSize / 2, nextY + tileSize / 2)) {
        entity.x = nextX;
        entity.y = nextY;
    } else {
        entity.dx = 0;
        entity.dy = 0;
    }
    // Snap to grid for alignment
    entity.x = Math.round(entity.x / tileSize) * tileSize;
    entity.y = Math.round(entity.y / tileSize) * tileSize;
}

// Update game state
function update() {
    if (gameState !== 'playing') return;

    // Move Pac-Man, ensuring alignment
    let nextX = pacman.x + pacman.dx;
    let nextY = pacman.y + pacman.dy;
    let centerX = nextX;
    let centerY = nextY;

    if (!isWall(centerX, centerY)) {
        pacman.x = nextX;
        pacman.y = nextY;
    } else {
        // Allow sliding or stop if no valid path
        if (pacman.dx !== 0) {
            let slideX = pacman.x + pacman.dx;
            if (!isWall(slideX, pacman.y)) {
                pacman.x = slideX;
                pacman.dx = 0;
                pacman.dy = 0;
            } else {
                pacman.dx = 0;
            }
        }
        if (pacman.dy !== 0) {
            let slideY = pacman.y + pacman.dy;
            if (!isWall(pacman.x, slideY)) {
                pacman.y = slideY;
                pacman.dx = 0;
                pacman.dy = 0;
            } else {
                pacman.dy = 0;
            }
        }
    }
    pacman.x = Math.round(pacman.x / tileSize) * tileSize; // Snap to grid
    pacman.y = Math.round(pacman.y / tileSize) * tileSize;

    // Animate Pac-Man's mouth
    pacman.mouthOpen = pacman.mouthOpen === 0.2 ? 0.7 : 0.2;

    // Update ghost modes
    modeTimer += 16; // Approx 60 FPS
    if (modeTimer >= modeDuration) {
        currentMode = currentMode === 'scatter' ? 'chase' : 'scatter';
        modeTimer = 0;
        setGhostTargets();
    }

    // Move and update ghosts, ensuring alignment
    ghosts.forEach(ghost => {
        if (ghost.frightened) {
            ghost.frightenedTime += 16;
            if (ghost.frightenedTime >= powerPelletDuration) {
                ghost.frightened = false;
                ghost.frightenedTime = 0;
            }
            moveToward(ghost.target, ghost, ghostSpeed);
        } else if (pacman.poweredUp) {
            ghost.frightened = true;
            ghost.target = { x: Math.random() * canvas.width, y: Math.random() * canvas.height }; // Random flee
            moveToward(ghost.target, ghost, ghostSpeed);
        } else {
            setGhostTargets(); // Update targets based on mode
            moveToward(ghost.target, ghost, ghostSpeed);
        }

        // Check collision with Pac-Man
        let distToPacman = Math.hypot(ghost.x - pacman.x, ghost.y - pacman.y);
        if (distToPacman < tileSize) {
            if (ghost.frightened) {
                // Eat ghost (remove it temporarily, reset later)
                ghosts = ghosts.filter(g => g !== ghost);
                score += 200;
                setTimeout(() => {
                    ghost.x = 26 * tileSize + tileSize / 2; // Reset to ghost house center
                    ghost.y = 14 * tileSize + tileSize / 2;
                    ghost.dx = 0;
                    ghost.dy = 0;
                    ghost.frightened = false;
                    ghosts.push(ghost);
                }, 1000);
            } else if (!pacman.poweredUp) {
                lives--;
                if (lives <= 0) {
                    gameState = 'lose';
                    alert("Game Over! Score: " + score);
                    init();
                } else {
                    pacman.x = 13 * tileSize + tileSize / 2;
                    pacman.y = 23 * tileSize + tileSize / 2;
                    pacman.dx = 0;
                    pacman.dy = 0;
                }
            }
        }
    });

    // Check dot collection, ensuring alignment
    dots = dots.filter(dot => {
        let dist = Math.hypot(pacman.x - dot.x, pacman.y - dot.y);
        if (dist < tileSize / 2) {
            score += 10;
            return false;
        }
        return true;
    });

    // Check power pellet collection, ensuring alignment
    powerPellets = powerPellets.filter(pellet => {
        let dist = Math.hypot(pacman.x - pellet.x, pacman.y - pellet.y);
        if (dist < tileSize / 2) {
            score += 50;
            pacman.poweredUp = true;
            if (powerUpTimer) clearTimeout(powerUpTimer);
            powerUpTimer = setTimeout(() => pacman.poweredUp = false, powerPelletDuration);
            ghosts.forEach(g => g.frightened = true);
            return false;
        }
        return true;
    });

    // Check win condition (all dots and power pellets eaten)
    if (dots.length === 0 && powerPellets.length === 0) {
        gameState = 'win';
        alert("You Win! Score: " + score);
        init();
    }
}

// Render game, ensuring perfect alignment
function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw maze
    ctx.fillStyle = '#0000FF';
    for (let y = 0; y < mazeHeight; y++) {
        for (let x = 0; x < mazeWidth; x++) {
            if (maze[y][x] === 1) {
                ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
            }
        }
    }

    // Draw dots, centered in tiles
    ctx.fillStyle = 'white';
    dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 2, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw power pellets, centered in tiles
    ctx.fillStyle = 'white';
    powerPellets.forEach(pellet => {
        ctx.beginPath();
        ctx.arc(pellet.x, pellet.y, 4, 0, Math.PI * 2); // Larger than dots
        ctx.fill();
    });

    // Draw Pac-Man, centered in tile
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman.x, pacman.y, tileSize / 2, 
            pacman.angle + pacman.mouthOpen, pacman.angle + (2 * Math.PI - pacman.mouthOpen));
    ctx.lineTo(pacman.x, pacman.y);
    ctx.fill();

    // Draw ghosts, centered in tiles
    ghosts.forEach(ghost => {
        ctx.fillStyle = ghost.frightened ? (Math.floor(Date.now() / 250) % 2 ? 'blue' : 'white') : ghost.color;
        ctx.beginPath();
        ctx.arc(ghost.x, ghost.y, tileSize / 2, 0, Math.PI);
        ctx.fillRect(ghost.x - tileSize / 2, ghost.y, tileSize, tileSize / 2);
        ctx.fill();
    });

    // Draw score, lives, and state, aligned at top-left
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score} | Lives: ${lives} | State: ${gameState}`, 10, 30); // Adjusted y-position for better alignment
}

// Game loop
function gameLoop() {
    handleInput();
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
init();
gameLoop();