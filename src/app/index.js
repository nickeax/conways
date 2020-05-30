const canvas = document.querySelector('#canvas');
const status = document.querySelector('#status');
const ctx = canvas.getContext('2d');

let sizeX = window.innerWidth;
let sizeY = window.innerHeight;
let scale = 1;
const scaleCTX = 4;
let resolutionX = sizeX / scale;
let resolutionY = sizeY / scale;
let opacity = 1;
let printStatus = 0;
let generations = 0;
let lastCellCount = 0;
let upwardTrend = 0;
let downwardTrend = 0;
// let speed = 1;

// DATA
let cells;

window.addEventListener('resize', _ => {
  sizeX = window.innerWidth;
  sizeY = window.innerHeight;
  resolutionX = sizeX / scale;
  resolutionY = sizeY / scale;
  reset();
});

function doStatus() {
  let readOut = "";
  let alive = countAlive();
  let trailingFog = 10 - Math.floor(opacity * 10);
  let direction = alive > lastCellCount ? "&UpArrow;" : "&ShortDownArrow;";
  readOut += `<span class="controlItem">CELL SIZE: ${scale}</span>`;
  readOut += `<span class="controlItem">TRAILING FOG: ${trailingFog}</span>`;
  readOut += `<span class="controlItem">GENERATIONS: ${generations}</span>`;
  readOut += `<span class="controlItem">LIVING CELLS: ${alive} (${direction} ${Math.abs(alive - lastCellCount)})</span>`;
  lastCellCount = alive;
  status.innerHTML = readOut;
}

window.addEventListener('keyup', ev => {
  let kc = ev.keyCode;
  //console.log(kc);
  switch (kc) {
    case 81:
      scale += 1;
      if(scale > 3) scale = 3;
      step();
      break;
    case 65:
      scale -= 1;
      if (scale <= 1) scale = 1;
      step();
      break;
    case 83:
      opacity += 0.02;
      if (opacity >= 1) opacity = 1.0;
      break;
    case 87:
      opacity -= 0.02;
      if (opacity < 0) opacity = 0.0;
      break;
    case 82:
      reset();
      break;
  }
});

function reset() {
  setup();
  randomCells();
  requestAnimationFrame(step);
}

function setup() {
  generations = 0;
  ctx.fillStyle = "rgba(100, 30, 30, 1)";
  ctx.fillRect(0, 0, resolutionX, resolutionY);
  canvas.width = sizeX;
  canvas.height = sizeY;
  ctx.scale(scaleCTX, scaleCTX);
  cells = createCells();
  doStatus();
  window.requestAnimationFrame(step);
}

function createCells() {
  let display = [];
  for (let y = 0; y < resolutionY; y++) {
    let row = [];
    for (let x = 0; x < resolutionX; x++) {
      row.push(0);
    }
    display.push(row);
  }
  return display;
}

function randomCells() {
  for (let y = 0; y < resolutionY; y++) {
    for (let c = 0; c < resolutionX; c++) {
      if (Math.random() < 0.1) {
        cells[y][c] = true;
      }
    }
  }
}

function displayScreen(col) {
  clearScreen();
  ctx.fillStyle = col;
  for (let rows = 0; rows < resolutionY; rows++) {
    for (let cols = 0; cols < resolutionX; cols++) {
      if (cells[rows][cols] === true) {        
        ctx.fillRect(cols, rows, scale, scale);
      }
    }
  }
}

function countAlive() {
  let cnt = 0;
  cells.forEach(x => {
    x.forEach(y => {
      if (y === true) cnt++;
    })
  })
  return cnt;
}

function step() {
  generations++;
  printStatus++;

  let prevCells = cells;
  let newCells = createCells()
  for (let y = 0; y < resolutionY; y++) {
    for (let c = 0; c < resolutionX; c++) {
      const neighbours = getNeighbourCount(c, y);
      if (cells[y][c] && neighbours >= 2 && neighbours <= 3) {
        newCells[y][c] = true;
      } else if (!cells[y][c] && neighbours === 3) {
        newCells[y][c] = true;
      }
    }
  }
  if (printStatus > 3) {
    doStatus();
    printStatus = 0;
  }
  if (prevCells.equals(newCells)) reset();
  cells = newCells;
  displayScreen("firebrick");
  window.requestAnimationFrame(step);
}

function getNeighbourCount(x, y) {
  let count = 0;
  for (let row = -1; row < 2; row++) {
    for (let col = -1; col < 2; col++) {
      if (col === 0 && row === 0) continue; // The cell itself
      if (col + x < 0 || col + x > resolutionX - 1) continue; // Check for out of bounds left then right
      if (row + y < 0 || row + y > resolutionY - 1) continue; // Check for out of bounds top then bottom
      if (cells[row + y][col + x]) count++;
    }
  }
  return count;
}

function clearScreen() {
  ctx.fillStyle = `rgba(100, 30, 30, ${opacity})`;
  ctx.fillRect(0, 0, resolutionX, resolutionY);
}

Array.prototype.equals = function (array) {
  // if the other array is a falsy value, return
  if (!array)
    return false;
  // compare lengths - can save a lot of time 
  if (this.length != array.length)
    return false;
  for (var i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i]))
        return false;
    }
    else if (this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", { enumerable: false });