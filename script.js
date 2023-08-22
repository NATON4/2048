const board = document.querySelector(".grid");
const startButton = document.getElementById("start-button");
const container = document.querySelector(".container");
const coverScreen = document.querySelector(".cover-screen");
const result = document.getElementById("result");
const overText = document.getElementById("cover-screen__over-text");
const rows = 4;
const columns = 4;

let matrix;
let score;

function createGrid() {

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
            const boxDiv = document.createElement("div");
            boxDiv.classList.add("box");
            boxDiv.setAttribute("data-position", `${rowIndex}_${columnIndex}`);
            board.appendChild(boxDiv);
        }
    }
}

function adjacentCheck(matrix) {
    const rows = matrix.length;
    const columns = matrix[0].length;

    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        for (let columnIndex = 0; columnIndex < columns - 1; columnIndex++) {
            if (matrix[rowIndex][columnIndex] === matrix[rowIndex][columnIndex + 1]) {
                return true;
            }
        }
    }

    for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
        for (let rowIndex = 0; rowIndex < rows - 1; rowIndex++) {
            if (matrix[rowIndex][columnIndex] === matrix[rowIndex + 1][columnIndex]) {
                return true;
            }
        }
    }

    return false;
}

function isPossibleMovesCheck() {
    for (let rowIndex in matrix) {
        if (adjacentCheck(matrix[rowIndex])) {
            return true;
        }
    }

    return false;
}

function randomPosition(arr) {
    return Math.floor(Math.random() * arr.length);
}

function hasEmptyBox(){

    for (let rowIndex in matrix) {
        for (let columnIndex in matrix[rowIndex]) {
            if (matrix[rowIndex][columnIndex] === 0) {
                return true;
            }
        }
    }

    return false;
}

function gameOverCheck() {
    if (!isPossibleMovesCheck()) {
        coverScreen.classList.remove("hide");
        container.classList.add("hide");
        overText.classList.remove("hide");
        result.innerText = `Final score: ${score}`;
        startButton.innerText = "Restart Game";
    }
}

function generateRandomNumber() {
    return Math.random() < 0.5 ? 2 : 4;
}

function generateRandomCell() {

    if (hasEmptyBox()) {
        let randomRow = randomPosition(matrix);
        let randomCol = randomPosition(matrix[randomPosition(matrix)]);

        if (matrix[randomRow][randomCol] === 0) {
            const randomNumber = generateRandomNumber();
            const currentCell = document.querySelector(`[data-position = '${randomRow}_${randomCol}']`);
            matrix[randomRow][randomCol] = randomNumber;
            currentCell.innerHTML = randomNumber;
            currentCell.classList.add(`box_value-${randomNumber}`);
        } else {
            generateRandomCell();
        }
    } else {
        gameOverCheck();
    }
}

function removeZero(arr) {
    return arr.filter(function(num) {
        return num;
    });
}

function sumAndFillCells(arr, reverseArr = false) {
    arr = reverseArr ? removeZero(arr).reverse() : removeZero(arr);

    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === arr[i + 1]) {
            arr[i] += arr[i + 1];
            arr[i + 1] = 0;
            score += arr[i];
        }
    }

    arr = reverseArr ? removeZero(arr).reverse() : removeZero(arr);

    let missingCount = 4 - arr.length;
    while (missingCount > 0) {
        if (reverseArr) {
            arr.unshift(0);
        } else {
            arr.push(0);
        }
        missingCount -= 1;
    }
    
    return arr;
}

/*function fillMatrix(matrix, value, rows, columns) {
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
            matrix[rowIndex][columnIndex] = value;
        }
    }
    
    return matrix;
}*/

function startGame() {
    score = 0;
    document.getElementById("score").innerText = score;
    board.innerHTML = "";
    matrix = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
    container.classList.remove("hide");
    coverScreen.classList.add("hide");
    createGrid();
    generateRandomCell();
    generateRandomCell();
}

startButton.addEventListener("click", () => {
    startGame();
});

function slideDown() {
    for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
        let num = [];

        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            let indices = matrix[rowIndex][columnIndex];
            num.push(indices);
        }
        
        num = sumAndFillCells(num, true);
        
        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            matrix[rowIndex][columnIndex] = num[rowIndex];
            const element = document.querySelector(`[data-position='${rowIndex}_${columnIndex}']`);
            element.innerHTML = matrix[rowIndex][columnIndex] ? matrix[rowIndex][columnIndex] : "";
            element.classList.value = "";
            element.classList.add("box", `box_value-${matrix[rowIndex][columnIndex]}`);
        }
    }
    generateRandomCell();
}

function slideUp() {
    for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
        let num = [];
        
        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            let indices = matrix[rowIndex][columnIndex];
            num.push(indices);
        }
        
        num = sumAndFillCells(num);
        
        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            matrix[rowIndex][columnIndex] = num[rowIndex];
            const element = document.querySelector(`[data-position = '${rowIndex}_${columnIndex}']`);
            element.innerHTML = matrix[rowIndex][columnIndex] ? matrix[rowIndex][columnIndex] : "";
            element.classList.value = "";
            element.classList.add("box", `box_value-${matrix[rowIndex][columnIndex]}`);
        }
    }
    generateRandomCell();
}

function slideRight() {
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        let num = [];
        
        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
            let indices = matrix[rowIndex][columnIndex];
            num.push(indices);
        }
        
        num = sumAndFillCells(num, true);
        
        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
            matrix[rowIndex][columnIndex] = num[columnIndex];
            let element = document.querySelector(`[data-position = '${rowIndex}_${columnIndex}']`);
            element.innerHTML = matrix[rowIndex][columnIndex] ? matrix[rowIndex][columnIndex] : "";
            element.classList.value = "";
            element.classList.add("box", `box_value-${matrix[rowIndex][columnIndex]}`);
        }
    }
    generateRandomCell();
}

function slideLeft() {
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        let num = [];
        
        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
            let indices = matrix[rowIndex][columnIndex];
            num.push(indices);
        }
        
        num = sumAndFillCells(num);
        
        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
            matrix[rowIndex][columnIndex] = num[columnIndex];
            let element = document.querySelector(`[data-position = '${rowIndex}_${columnIndex}']`);
            element.innerHTML = matrix[rowIndex][columnIndex] ? matrix[rowIndex][columnIndex] : "";
            element.classList.value = "";
            element.classList.add("box", `box_value-${matrix[rowIndex][columnIndex]}`);
        }
    }
    generateRandomCell();
}

document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowLeft") {
        slideLeft();
    } else if (e.code === "ArrowRight") {
        slideRight();
    } else if (e.code === "ArrowUp") {
        slideUp();
    } else if (e.code === "ArrowDown") {
        slideDown();
    }
    document.getElementById("score").innerText = score;
});

function continuouslyChangeBackgroundColors() {
    const colorMap = {
        'box_value-2': '#eee4da',
        'box_value-4': '#eee1c9',
        'box_value-8': '#f3b27a',
        'box_value-16': '#f69664',
        'box_value-32': '#f77c5f',
        'box_value-64': '#f75f3b',
        'box_value-128': '#edd073',
        'box_value-256': '#edcc63',
        'box_value-512': '#edc651',
        'box_value-1024': '#eec744',
        'box_value-2048': '#ecc230'
    };

    setInterval(() => {
        for (const className in colorMap) {
            const elements = document.getElementsByClassName(className);
            const color = colorMap[className];

            for (const element of elements) {
                element.style.backgroundColor = color;
            }
        }
    }, 5);
}

continuouslyChangeBackgroundColors();