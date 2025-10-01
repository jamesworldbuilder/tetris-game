import express from 'express';
const app = express();

app.get('/', (req, res) => {
    const gameContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://tetris-leaderboard.onrender.com; img-src 'self' data:;">
        <title>Tetris Game by James</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                overflow: hidden;
            }
            html, body {
                width: 100%;
                height: 100%;
                background-color: #000000;
                overflow: hidden;
                font-family: 'Press Start 2P', cursive;
            }
            .game-container {
                height: 100%;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
                padding: 1em;
                overflow: hidden;
            }
            canvas {
                border: 3px solid #663399;
                background-color: #000000;
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                image-rendering: pixelated;
                image-rendering: -moz-crisp-edges;
                image-rendering: crisp-edges;
                overflow: hidden;
            }
            #loadingSpinner {
                position: absolute;
                top: 20%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 48px;
                height: 48px;
                border: 5px solid #333; /* Light grey track */
                border-top: 5px solid #9933ff; /* Purple spinner color */
                border-radius: 50%;
                animation: spin 1s linear infinite;
                z-index: 15;
            }
            @keyframes spin {
                0% { transform: translate(-50%, -50%) rotate(0deg); }
                100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
            #startButton {
                position: absolute;
                top: 30%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 15px 30px;
                font-size: 24px;
                z-index: 10;
                display: none; /* Hidden by default, shown by JS */
            }
            #startScreenLeaderboard {
                position: absolute;
                top: 45%;
                left: 50%;
                transform: translateX(-50%);
                color: #e0e0e0;
                font-size: 0.7em;
                text-align: center;
                z-index: 5;
                display: none; /* Hidden by default, shown by JS */
            }
            #startScreenLeaderboard h3 {
                color: #663399; 
                margin-bottom: 10px;
            }
            #startScreenLeaderboard ol {
                list-style-type: none;
                padding: 0;
            }
            #startScreenLeaderboard li {
                margin-bottom: 5px;
                white-space: pre;
                font-size: 0.8em;
                color: #cccccc;
            }
            #gameOverScreen {
                position: absolute;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: none;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: #e0e0e0;
                font-size: 1.5em; 
                z-index: 20;
                font-family: 'Press Start 2P', cursive;
                padding: 1em;
                text-align: center;
                gap: 15px; 
            }
            #gameOverScreen > div:first-child {
                color: #663399; /* Purple color for "Game Over" text */
            }
            #finalScore {
                font-size: 0.8em;
                margin-top: 10px;
                margin-bottom: 20px;
                color: #e0e0e0; /* Reverted from gold */
            }
            #leaderboardContainer {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
                max-width: 400px;
                gap: 20px;
            }
            #leaderboardDisplay {
                font-size: 0.4em;
                text-align: center;
                width: 100%;
            }
            #leaderboardDisplay h3 {
                color: #663399; 
                margin-bottom: 10px;
            }
            #leaderboardDisplay ol {
                text-align: left;
                display: inline-block;
            }
            #leaderboardDisplay li {
                margin-bottom: 5px;
                white-space: pre;
            }
            #submissionArea {
                font-size: 0.5em;
                width: 100%;
            }
            #leaderboardForm label {
                display: block;
                margin-bottom: 10px;
            }
            #leaderboardForm input {
                font-family: 'Press Start 2P', cursive;
                background: #333;
                color: #fff;
                border: 2px solid #663399;
                padding: 10px;
                width: 100px;
                text-align: center;
                text-transform: uppercase;
                margin-bottom: 10px;
            }
            .button {
                padding: 10px 20px;
                margin-top: 10px;
                background-color: #000000;
                color: #e0e0e0;
                border: 2px solid #663399;
                cursor: pointer;
                font-family: 'Press Start 2P', cursive;
                display: block;
                width: 100%;
                max-width: 200px;
                margin-left: auto;
                margin-right: auto;
            }
            .button:hover {
                background-color: #9933ff;
            }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    </head>
    <body>
        <div class="game-container" id="gameContainer">
            <canvas id="gameCanvas"></canvas>
            
            <div id="loadingSpinner"></div>
            <button id="startButton" class="button">Start Game</button>

            <div id="startScreenLeaderboard">
                <h3>High Scores</h3>
                <ol id="startScoreList"></ol>
            </div>

            <div id="gameOverScreen">
                <div>Game Over</div>
                <div id="finalScore"></div>
                
                <div id="leaderboardContainer">
                    <div id="leaderboardDisplay">
                        <h3>High Scores</h3>
                        <ol id="scoreList"></ol>
                    </div>
                    <div id="submissionArea">
                        <form id="leaderboardForm">
                            <label for="playerName">Enter Initials:</label>
                            <input type="text" id="playerName" name="playerName" maxlength="3" required>
                            <button type="submit" class="button">Submit Score</button>
                        </form>
                    </div>
                </div>

                <button id="retryButton" class="button">Play Again</button>
            </div>
        </div>
        <script>
        (function () {
            const LEADERBOARD_API_URL = 'https://tetris-leaderboard.onrender.com';

            const gameContainer = document.getElementById('gameContainer');
            const canvas = document.getElementById('gameCanvas');
            const ctx = canvas.getContext('2d');
            const startButton = document.getElementById('startButton');
            const gameOverScreen = document.getElementById('gameOverScreen');
            const retryButton = document.getElementById('retryButton');
            const finalScoreElement = document.getElementById('finalScore');
            
            const leaderboardForm = document.getElementById('leaderboardForm');
            const playerNameInput = document.getElementById('playerName');
            const scoreList = document.getElementById('scoreList');
            const startScoreList = document.getElementById('startScoreList');
            const startScreenLeaderboard = document.getElementById('startScreenLeaderboard');
            const loadingGif = document.getElementById('loadingSpinner');

            // Communication with parent window 
            const isEmbedded = (window.self !== window.top);
            const parentOrigin = 'https://jamesworldbuilder.github.io'; 
            const postParent = (message) => {
                if (isEmbedded) {
                    // Send messages only to the specified origin for security
                    window.parent.postMessage(message, parentOrigin);
                }
            };

            const cols = 10;
            const rows = 20;
            let blockSize = 30;

            let board = Array.from({ length: rows }, () => Array(cols).fill(0));
            let score = 0;
            let gameOver = false;
            let currentPiece = null;
            let offset = { x: 0, y: 0 };
            let dropCounter = 0;
            let dropInterval = 1000; 
            const initialDropInterval = 1000;
            const minDropInterval = 100;
            let lastTime = 0;
            let animationFrameId;
            let pressedKeys = new Set();
            
            let isAnimatingLineClear = false;
            let lineClearStartTime = 0;
            let linesToClear = [];
            const shimmerDuration = 300;
            const popDuration = 300;
            const lineClearDuration = shimmerDuration + popDuration;
            
            let isFlashingScore = false;
            let scoreFlashStartTime = 0;
            const scoreFlashDuration = 500;

            const colors = ['#6ed2d8', '#5a6dc8', '#d89b4b', '#e0e050', '#6ac26a', '#b351d1', '#d15a5a'];
            const pieces = {
                I: { shape: [[1, 1, 1, 1]], color: colors[0] },
                J: { shape: [[1, 0, 0], [1, 1, 1]], color: colors[1] },
                L: { shape: [[0, 0, 1], [1, 1, 1]], color: colors[2] },
                O: { shape: [[1, 1], [1, 1]], color: colors[3] },
                S: { shape: [[0, 1, 1], [1, 1, 0]], color: colors[4] },
                T: { shape: [[0, 1, 0], [1, 1, 1]], color: colors[5] },
                Z: { shape: [[1, 1, 0], [0, 1, 1]], color: colors[6] }
            };
            const pieceTypes = Object.keys(pieces);

            function createPiece() { 
                const type = pieceTypes[Math.floor(Math.random() * pieceTypes.length)]; 
                currentPiece = pieces[type]; 
                offset = { 
                    x: Math.floor((cols - currentPiece.shape[0].length) / 2), 
                    y: 0 
                }; 
                if (collide()) { gameOver = true; } 
            }

            function findCompletedLines() {
                let completedLines = [];
                for (let y = rows - 1; y >= 0; y--) {
                    if (board[y].every(value => value !== 0)) {
                        completedLines.push(y);
                    }
                }
                return completedLines;
            }

            function merge() { 
                const { shape } = currentPiece; 
                shape.forEach((row, y) => { 
                    row.forEach((value, x) => { 
                        if (value !== 0) { 
                            if (offset.y + y < 0) { 
                                gameOver = true; 
                            } else { 
                                board[offset.y + y][offset.x + x] = currentPiece.color; 
                            } 
                        } 
                    }); 
                }); 
            }

            function collide(shape = currentPiece.shape, pos = offset) { 
                for (let y = 0; y < shape.length; y++) { 
                    for (let x = 0; x < shape[y].length; x++) { 
                        if (shape[y][x] !== 0) { 
                            const newY = y + pos.y; 
                            const newX = x + pos.x; 
                            if (newX < 0 || newX >= cols || newY >= rows || (board[newY] && board[newY][newX] !== 0)) { 
                                return true; 
                            } 
                        } 
                    } 
                } return false; 
            }

            function rotate() { 
                const shape = currentPiece.shape; 
                const newShape = shape[0].map((_, i) => shape.map(row => row[i]).reverse()); 
                let originalX = offset.x; 
                let kick = 1; 
                while (collide(newShape, offset)) { 
                    offset.x += kick; 
                    kick = -(kick + (kick > 0 ? 1 : -1)); 
                    if (kick > newShape[0].length) { 
                        offset.x = originalX; 
                        return; 
                    } 
                } 
                currentPiece.shape = newShape; 
            }

            function drop() { 
                offset.y++; 
                if (collide()) { 
                    offset.y--; 
                    merge();
                    currentPiece = null;
                    linesToClear = findCompletedLines();
                    if (linesToClear.length > 0) {
                        isAnimatingLineClear = true;
                        lineClearStartTime = performance.now();
                    } else {
                        createPiece();
                    }
                } 
                dropCounter = 0; 
            }
            
            function hardDrop() {
                while (!collide()) {
                    offset.y++;
                }
                offset.y--;
                merge();
                currentPiece = null;
                linesToClear = findCompletedLines();
                if (linesToClear.length > 0) {
                    isAnimatingLineClear = true;
                    lineClearStartTime = performance.now();
                } else {
                    createPiece();
                }
                dropCounter = 0;
            }
            
            function setupCanvas() { 
                const containerWidth = gameContainer.offsetWidth; 
                const containerHeight = gameContainer.offsetHeight; 
                const blockSizeW = containerWidth / cols; 
                const blockSizeH = containerHeight / rows; 
                blockSize = Math.floor(Math.min(blockSizeW, blockSizeH)); 
                canvas.width = cols * blockSize; 
                canvas.height = rows * blockSize; 
                ctx.mozImageSmoothingEnabled = false; 
                ctx.webkitImageSmoothingEnabled = false; 
                ctx.msImageSmoothingEnabled = false; 
                ctx.imageSmoothingEnabled = false; 
                if (animationFrameId) { draw(); } 
            }

            function drawBlock(x, y, color) { 
                ctx.fillStyle = color; 
                ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize); 
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'; 
                ctx.fillRect(x * blockSize, y * blockSize, blockSize, 2); 
                ctx.fillRect(x * blockSize, y * blockSize + 2, 2, blockSize - 2); 
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; 
                ctx.fillRect(x * blockSize + blockSize - 2, y * blockSize + 2, 2, blockSize - 2); 
                ctx.fillRect(x * blockSize + 2, y * blockSize + blockSize - 2, blockSize - 2, 2); 
            }

            function drawKey(x, y, width, height, text, isPressed) {
                const cornerRadius = height * 0.2;
                const bevelOffset = height * 0.08;

                if (isPressed) {
                    ctx.fillStyle = '#222';
                    ctx.beginPath();
                    ctx.roundRect(x, y, width, height, cornerRadius);
                    ctx.fill();

                    ctx.fillStyle = 'rgba(153, 51, 255, 0.7)';
                    ctx.beginPath();
                    ctx.roundRect(x, y - bevelOffset, width, height, cornerRadius);
                    ctx.fill();

                    ctx.strokeStyle = '#663399';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.roundRect(x, y - bevelOffset, width, height, cornerRadius);
                    ctx.stroke();
                    
                    ctx.fillStyle = '#e0e0e0';
                } else {
                    ctx.fillStyle = 'rgba(34, 34, 34, 0.5)';
                    ctx.beginPath();
                    ctx.roundRect(x, y, width, height, cornerRadius);
                    ctx.fill();

                    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                    ctx.beginPath();
                    ctx.roundRect(x, y - bevelOffset, width, height, cornerRadius);
                    ctx.fill();

                    ctx.strokeStyle = 'rgba(102, 51, 153, 0.5)';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.roundRect(x, y - bevelOffset, width, height, cornerRadius);
                    ctx.stroke();
                    
                    ctx.fillStyle = 'rgba(224, 224, 224, 0.5)';
                }
                
                const fontSize = height * 0.5;
                ctx.font = 'bold ' + fontSize + 'px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, x + width / 2, y - bevelOffset + height / 2);
            }

            function draw() { 
                ctx.clearRect(0, 0, canvas.width, canvas.height); 

                const scoreBoxHeight = (blockSize * 0.7) + 20;
                const keySize = blockSize;
                const keyPadding = blockSize * 0.2;
                const topY = scoreBoxHeight + keySize;
                const centerX = canvas.width / 2;
                const totalArrowKeysWidth = (keySize * 4) + (keyPadding * 3);
                const startX = centerX - totalArrowKeysWidth / 2;

                drawKey(startX, topY, keySize, keySize, '↑', pressedKeys.has('ArrowUp') || pressedKeys.has('KeyW'));
                drawKey(startX + keySize + keyPadding, topY, keySize, keySize, '←', pressedKeys.has('ArrowLeft') || pressedKeys.has('KeyA'));
                drawKey(startX + (keySize + keyPadding) * 2, topY, keySize, keySize, '↓', pressedKeys.has('ArrowDown') || pressedKeys.has('KeyS'));
                drawKey(startX + (keySize + keyPadding) * 3, topY, keySize, keySize, '→', pressedKeys.has('ArrowRight') || pressedKeys.has('KeyD'));

                const spacebarY = topY + keySize + keyPadding;
                const spacebarWidth = totalArrowKeysWidth;
                const spacebarHeight = keySize * 0.7;
                const spacebarX = centerX - spacebarWidth / 2;
                drawKey(spacebarX, spacebarY, spacebarWidth, spacebarHeight, 'spacebar', pressedKeys.has('Space'));

                board.forEach((row, y) => { 
                    if (isAnimatingLineClear && linesToClear.includes(y)) {
                        const elapsedTime = performance.now() - lineClearStartTime;
                        
                        if (elapsedTime < shimmerDuration) {
                            const shimmerProgress = elapsedTime / shimmerDuration;
                            const shimmer = Math.abs(Math.sin(shimmerProgress * Math.PI * 2));
                            const r = 255;
                            const g = 215 + Math.floor(shimmer * 40);
                            const b = 0;
                            const color = 'rgb(' + r + ', ' + g + ', ' + b + ')';
                            for (let x = 0; x < cols; x++) {
                                drawBlock(x, y, color);
                            }
                        } else {
                            const popProgress = (elapsedTime - shimmerDuration) / popDuration;
                            const disappearUntilColumn = Math.floor(popProgress * cols);
                            for (let x = disappearUntilColumn; x < cols; x++) {
                                drawBlock(x, y, board[y][x]);
                            }
                        }
                    } else {
                        row.forEach((color, x) => { 
                            if (color !== 0) { 
                                drawBlock(x, y, color); 
                            } 
                        });
                    }
                }); 
                if (currentPiece) { 
                    const { shape, color } = currentPiece; 
                    shape.forEach((row, y) => { 
                        row.forEach((value, x) => { 
                            if (value !== 0) { 
                                drawBlock(offset.x + x, offset.y + y, color); 
                            } 
                        }); 
                    }); 
                }

                const scoreFontSize = blockSize * 0.7; 
                ctx.font = 'bold ' + scoreFontSize + 'px "Press Start 2P", cursive'; 
                const scoreText = 'Score: ' + score;
                const scoreBoxWidth = canvas.width; 
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(0, 0, scoreBoxWidth, scoreBoxHeight);
                
                if (isFlashingScore) {
                    const flashElapsedTime = performance.now() - scoreFlashStartTime;
                    if (flashElapsedTime < scoreFlashDuration) {
                        const flashProgress = flashElapsedTime / scoreFlashDuration;
                        const flash = Math.abs(Math.sin(flashProgress * Math.PI * 4));
                        if (flash > 0.5) {
                            ctx.fillStyle = '#FFD700';
                        } else {
                            ctx.fillStyle = "#e0e0e0";
                        }
                    } else {
                        isFlashingScore = false;
                        ctx.fillStyle = "#e0e0e0";
                    }
                } else {
                    ctx.fillStyle = "#e0e0e0"; 
                }

                ctx.textAlign = "center"; 
                ctx.textBaseline = "top"; 
                ctx.fillText(scoreText, canvas.width / 2, 10); 

                const watermarkText = 'Tetris ® & © 1985~2025 Tetris Holding. Licensed to The Tetris Company. Tetris Game Design by Alexey Pajitnov. All Rights Reserved.'; 
                const watermarkFontSize = blockSize * 0.25; 
                ctx.font = watermarkFontSize + 'px "Press Start 2P", cursive'; 
                ctx.fillStyle = 'rgba(255, 255, 255, 0.17)'; 
                ctx.textAlign = 'center'; 
                ctx.textBaseline = 'bottom'; 
                const maxWidth = canvas.width - 20; 
                const lineHeight = watermarkFontSize * 1.2; 
                let lines = []; 
                let currentLine = ''; 
                let words = watermarkText.split(' '); 
                for (let i = 0; i < words.length; i++) { 
                    let testLine = currentLine + words[i] + ' '; 
                    let metrics = ctx.measureText(testLine); 
                    let testWidth = metrics.width; 
                    if (testWidth > maxWidth && i > 0) { 
                        lines.push(currentLine.trim()); 
                        currentLine = words[i] + ' '; 
                    } else { 
                        currentLine = testLine; 
                    } 
                } 
                lines.push(currentLine.trim()); 
                let startY = canvas.height - 5; 
                for (let i = lines.length - 1; i >= 0; i--) { 
                    ctx.fillText(lines[i], canvas.width / 2, startY); 
                        startY -= lineHeight; 
                } 
            }
            
            function update(time = 0) {
                if (gameOver) {
                    endGame();
                    return;
                }

                if (isAnimatingLineClear) {
                    const elapsedTime = performance.now() - lineClearStartTime;
                    if (elapsedTime >= lineClearDuration) {
                        isAnimatingLineClear = false;
                        let linesRemoved = 0;
                        linesToClear.sort((a, b) => a - b).forEach(y => {
                            board.splice(y - linesRemoved, 1);
                            linesRemoved++;
                        });
                        for (let i = 0; i < linesToClear.length; i++) {
                            board.unshift(Array(cols).fill(0));
                        }
                        
                        score += linesToClear.length * 10;
                        isFlashingScore = true;
                        scoreFlashStartTime = performance.now();

                        dropInterval -= linesToClear.length * 20;
                        if (dropInterval < minDropInterval) {
                            dropInterval = minDropInterval;
                        }
                        linesToClear = [];
                        createPiece();
                    }
                } else {
                    const deltaTime = time - lastTime;
                    lastTime = time;
                    dropCounter += deltaTime;
                    if (dropCounter > dropInterval) {
                        drop();
                    }
                }

                draw();
                animationFrameId = requestAnimationFrame(update);
            }

            function endGame() {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
                finalScoreElement.textContent = 'Final Score: ' + score;
                gameOverScreen.style.display = 'flex';
                displayLeaderboard();
                postParent('gameEnded'); // Signal that the game has ended
            }

            function resetGame() {
                board.forEach(row => row.fill(0));
                score = 0;
                gameOver = false;
                dropInterval = initialDropInterval;
                gameOverScreen.style.display = 'none';
                leaderboardForm.style.display = 'block';
                createPiece();
                if (!animationFrameId) {
                    update();
                }
            }
            
            async function displayLeaderboard() {
                scoreList.innerHTML = '<li>Loading...</li>';
                try {
                    // Use a POST request to fetch live data
                    const response = await fetch(LEADERBOARD_API_URL + '/get-tetris-scores.php', { method: 'POST' });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const scores = await response.json();
                    scoreList.innerHTML = '';
                    if (scores.length === 0) {
                        scoreList.innerHTML = '<li>Be the first!</li>';
                    } else {
                        scores.forEach((entry, index) => {
                            const li = document.createElement('li');
                            const rank = (index + 1) + '.';
                            const name = entry.player.padEnd(4);
                            const scoreText = entry.score.toString().padStart(6, ' ');
                            li.textContent = rank.padEnd(3) + name + scoreText;
                            if (index === 0) {
                                li.style.color = '#FFD700';
                            }
                            scoreList.appendChild(li);
                        });
                    }
                } catch (error) {
                    console.error('Failed to fetch leaderboard:', error);
                    scoreList.innerHTML = '<li>Error loading scores</li>';
                }
            }
            
            async function displayStartScreenLeaderboard() {
                try {
                    await document.fonts.ready;
                    const response = await fetch(LEADERBOARD_API_URL + '/get-tetris-scores.php', { method: 'POST' });
                     if (!response.ok) throw new Error('Network response was not ok');
                    const scores = await response.json();
                    startScoreList.innerHTML = ''; 
                    if (scores.length === 0) {
                        startScoreList.innerHTML = '<li>Be the first!</li>';
                    } else {
                        scores.forEach((entry, index) => {
                            const li = document.createElement('li');
                            const rank = (index + 1) + '.';
                            const name = entry.player.padEnd(4);
                            const scoreText = entry.score.toString().padStart(6, ' ');
                            li.textContent = rank.padEnd(3) + name + scoreText;
                            if (index === 0) {
                                li.style.color = '#FFD700';
                            }
                            startScoreList.appendChild(li);
                        });
                    }
                } catch (error) {
                    console.error('Failed to fetch start screen leaderboard:', error);
                    startScoreList.innerHTML = '<li>--:--</li>';
                } finally {
                    loadingGif.style.display = 'none';
                    startButton.style.display = 'block';
                    startScreenLeaderboard.style.display = 'block';
                }
            }

            async function submitScore(playerName, playerScore) {
                const formData = new FormData();
                formData.append('player', playerName);
                formData.append('score', playerScore);
                try {
                    const response = await fetch(LEADERBOARD_API_URL + '/update-tetris-scores.php', {
                        method: 'POST',
                        body: formData
                    });
                    if (!response.ok) {
                        throw new Error('Failed to submit score');
                    }
                    leaderboardForm.style.display = 'none';
                    await displayLeaderboard();
                } catch (error) {
                    console.error('Error submitting score:', error);
                    alert('Could not submit score. Please try again.');
                }
            }

            document.addEventListener("keydown", (e) => {
                if (isAnimatingLineClear) return;
                pressedKeys.add(e.code);
                if (gameOver) return;
                
                // Using e.code, which matches the synthetic event from the on-screen controls
                switch(e.code) {
                    case 'ArrowLeft':
                    case 'KeyA':
                        offset.x--;
                        if (collide()) offset.x++;
                        break;
                    case 'ArrowRight':
                    case 'KeyD':
                        offset.x++;
                        if (collide()) offset.x--;
                        break;
                    case 'ArrowDown':
                    case 'KeyS':
                        drop();
                        break;
                    case 'ArrowUp':
                    case 'KeyW':
                        rotate();
                        break;
                    case 'Space':
                        e.preventDefault();
                        hardDrop();
                        break;
                }
            });

            document.addEventListener("keyup", (e) => {
                pressedKeys.delete(e.code);
            });

            startButton.addEventListener("click", () => {
                startButton.style.display = "none";
                startScreenLeaderboard.style.display = "none";
                setupCanvas();
                resetGame();
                postParent('gameStarted'); // Signal that the game has started
            });

            retryButton.addEventListener("click", () => {
                resetGame();
                postParent('gameStarted'); // Signal that a new game has started on retry
            });

            leaderboardForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const playerName = playerNameInput.value.trim().toUpperCase();
                if (playerName.length === 3) {
                    submitScore(playerName, score);
                } else {
                    alert('Please enter exactly 3 characters.');
                }
            });

            playerNameInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
            });

            window.addEventListener('resize', setupCanvas);
            setupCanvas();
            displayStartScreenLeaderboard();

            // Listen for messages from parent (for on-screen controls) 
            window.addEventListener('message', (event) => {
                // Security check to only accept messages from the origin
                if (event.origin !== parentOrigin) {
                    return;
                }

                if (event.data && event.data.type && event.data.code) {
                    // 'keydown' or 'keyup'
                    const eventType = event.data.type; 
                    const code = event.data.code;

                    // Create and dispatch a synthetic keyboard event
                    const keyboardEvent = new KeyboardEvent(eventType, {
                        code: code,
                        bubbles: true
                    });
                    document.dispatchEvent(keyboardEvent);
                }
            });
        })();
        </script>
    </body>
    </html>
    `;

    res.send(gameContent);
});

const port = parseInt(process.env.PORT) || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log(`Tetris Game: listening on port ${port}`);
});
