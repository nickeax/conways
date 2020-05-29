const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

const sizeX = window.innerWidth;
const sizeY = window.innerHeight;
const scale = 8;
const resolutionX = sizeX / scale;
const resolutionY = sizeY / scale;
const opacity = 0.01;

// DATA
let cells

setup();
randomCells();
displayScreen("seagreen");
setInterval(step, 5);

function setup() {
  ctx.fillStyle = "rgba(100, 30, 30, 1)";
  ctx.fillRect(0, 0, resolutionX, resolutionY);
  canvas.width = sizeX;
  canvas.height = sizeY;
  ctx.scale(scale, scale);
  cells = createCells();
}

function createCells() {
  let display = [];
  for (let y = 0; y < resolutionY; y++) {
    let row = [];
    for(let x = 0; x < resolutionX; x++) {
      row.push(0);
    }
    display.push(row);
  }
  return display;
}

function randomCells() {
  for(let y = 0; y < resolutionY; y++) {
    for(let c = 0; c < resolutionX; c++) {
      if(Math.random() < 0.1) {
        cells[y][c] = true;
      }
    }
  }
}

function displayScreen(col) {
  clearScreen();
  ctx.fillStyle = col;
  for(let rows = 0; rows < resolutionY; rows++) {
    for(let cols = 0; cols < resolutionX; cols++) {
      if(cells[rows][cols] === true) {
        ctx.fillRect(cols, rows, 1, 1);
      }
    }
  }
}

function step() {
  let newCells = createCells()
  for(let y = 0; y < resolutionY; y++) {
    for(let c = 0; c < resolutionX; c++) {
      const neighbours = getNeighbourCount(c, y);
      if(cells[c][y] && neighbours >= 2 && neighbours <= 3) {
        newCells[c][y] = true;
      } else if(!cells[c][y] && neighbours === 3){
        newCells[c][y] = true;
      }
    }
  }
  if(cells === newCells) {
    setup();
  }
  cells = newCells;
  displayScreen("firebrick");
}

function getNeighbourCount(x,y) {
  let count = 0;

  for(let row = -1; row < 2; row++) {
    for(let col = -1; col < 2; col++) {
      if(col === 0 && row === 0) continue; // The cell itself
      if(col + x < 0 || col + x > resolution - 1) continue; // Check for out of bounds left then right
      if(row + y < 0 || row + y > resolution - 1) continue; // Check for out of bounds top then bottom

      if(cells[col + x][row + y]) count++;
    }
  }
  return count;
}

function clearScreen() {
  ctx.fillStyle = `rgba(100, 30, 30, ${opacity})`;
  ctx.fillRect(0, 0, resolutionX, resolutionY);
}