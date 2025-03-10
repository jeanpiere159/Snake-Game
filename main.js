const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let foodX, foodY;
let gameOver = false;
let snakeX = 5,
  snakeY = 10;
let snakeBody = [[5, 10]];
let velocityX = 0,
  velocityY = 0;
let setIntervalId;
let score = 0;
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const changeFoodPosition = () => {
  foodX = Math.floor(Math.random() * 29) + 1;
  foodY = Math.floor(Math.random() * 29) + 1;
};

const handleGameOver = () => {
  clearInterval(setIntervalId);
  alert("¡Perdiste! Presiona OK para reiniciar.");
  location.reload();
};

const changeDirection = (e) => {
  if (e.key === "ArrowUp" && velocityY !== 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY !== -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX !== 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX !== -1) {
    velocityX = 1;
    velocityY = 0;
  }
};

controls.forEach((key) => {
  key.addEventListener("click", () =>
    changeDirection({ key: key.dataset.key })
  );
});

const initGame = () => {
  if (gameOver) return handleGameOver();

  let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;


  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = [...snakeBody[i - 1]];
  }

  snakeX += velocityX;
  snakeY += velocityY;
  snakeBody[0] = [snakeX, snakeY];


  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    gameOver = true;
  }


  for (let i = 1; i < snakeBody.length; i++) {
    if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
      gameOver = true;
    }
  }
  snakeBody.forEach(([x, y], index) => {
    htmlMarkup += `<div class="${
      index === 0 ? "head" : "body"
    }" style="grid-area: ${y} / ${x}"></div>`;
  });
  if (snakeX === foodX && snakeY === foodY) {
    changeFoodPosition();
    snakeBody.push([...snakeBody[snakeBody.length - 1]]);
    score++;
    highScore = score >= highScore ? score : highScore;
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score: ${score}`;
  }
  playBoard.innerHTML = htmlMarkup;
};

changeFoodPosition();
setIntervalId = setInterval(initGame, 150);
document.addEventListener("keydown", changeDirection);
