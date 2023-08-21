const board = document.querySelector(".grid");
const startButton = document.getElementById("start-button");
const container = document.querySelector(".container");
const coverScreen = document.querySelector(".cover-screen");
const result = document.getElementById("result");
const overText = document.getElementById("cover-screen__over-text");

let matrix;
let score;
let rows = 4;
let columns = 4;

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
function possibleMovesCheck() {
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
    if (!possibleMovesCheck()) {
        coverScreen.classList.remove("hide");
        container.classList.add("hide");
        overText.classList.remove("hide");
        result.innerText = `Final score: ${score}`;
        startButton.innerText = "Restart Game";
    }
}
const generateRandomCell = () => {
    const generateRandomNumber = () => {
        return Math.random() < 0.5 ? 2 : 4;
    };

    if (hasEmptyBox()) {
        let randomRow = randomPosition(matrix);
        let randomCol = randomPosition(matrix[randomPosition(matrix)]);

        if (matrix[randomRow][randomCol] === 0) {
            const randomNumber = generateRandomNumber();
            matrix[randomRow][randomCol] = randomNumber;
            let element = document.querySelector(`[data-position = '${randomRow}_${randomCol}']`);
            element.innerHTML = randomNumber;
            element.classList.add(`box_value-${randomNumber}`);
        } else {
            generateRandomCell();
        }
    } else {
        gameOverCheck();
    }
};
const removeZero = (arr) => arr.filter((num) => num);
const checker = (arr, reverseArr = false) => {
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
};
const startGame = () => {
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
};
startButton.addEventListener("click", () => {
    startGame();
});
const slideDown = () => {
    for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
        let num = [];
        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            num.push(matrix[rowIndex][columnIndex]);
        }
        num = checker(num, true);
        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            matrix[rowIndex][columnIndex] = num[rowIndex];
            let element = document.querySelector(`[data-position='${rowIndex}_${columnIndex}']`);
            element.innerHTML = matrix[rowIndex][columnIndex] ? matrix[rowIndex][columnIndex] : "";
            element.classList.value = "";
            element.classList.add("box", `box_value-${matrix[rowIndex][columnIndex]}`);
        }
    }
    generateRandomCell();
};
const slideUp = () => {
    for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
        let num = [];
        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            num.push(matrix[rowIndex][columnIndex]);
        }
        num = checker(num);
        for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
            matrix[rowIndex][columnIndex] = num[rowIndex];
            const element = document.querySelector(`[data-position = '${rowIndex}_${columnIndex}']`);
            element.innerHTML = matrix[rowIndex][columnIndex] ? matrix[rowIndex][columnIndex] : "";
            element.classList.value = "";
            element.classList.add("box", `box_value-${matrix[rowIndex][columnIndex]}`);
        }
    }
    generateRandomCell();
};
const slideRight = () => {
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        let num = [];
        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
            num.push(matrix[rowIndex][columnIndex]);
        }
        num = checker(num, true);
        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
            matrix[rowIndex][columnIndex] = num[columnIndex];
            let element = document.querySelector(`[data-position = '${rowIndex}_${columnIndex}']`);
            element.innerHTML = matrix[rowIndex][columnIndex] ? matrix[rowIndex][columnIndex] : "";
            element.classList.value = "";
            element.classList.add("box", `box_value-${matrix[rowIndex][columnIndex]}`);
        }
    }
    generateRandomCell();
};
const slideLeft = () => {
    for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        let num = [];
        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
            num.push(matrix[rowIndex][columnIndex]);
        }
        num = checker(num);
        for (let columnIndex = 0; columnIndex < columns; columnIndex++) {
            matrix[rowIndex][columnIndex] = num[columnIndex];
            let element = document.querySelector(`[data-position = '${rowIndex}_${columnIndex}']`);
            element.innerHTML = matrix[rowIndex][columnIndex] ? matrix[rowIndex][columnIndex] : "";
            element.classList.value = "";
            element.classList.add("box", `box_value-${matrix[rowIndex][columnIndex]}`);
        }
    }
    generateRandomCell();
};
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