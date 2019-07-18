/**
 * @author Josh Gibbs (uPaymeiFixit@gmail.com)
 */

// Size of room in inches
const room = {
  width: 183.25,
  height: 297
};
const stairs_width = 46.625;
const plank_height = 8.625;
const plank_width = 47 + 9 / 16;

// This is the length of the first plank in each row in inches
const offsets = [
  plank_width,
  14.875,
  26.5,
  7.25,
  40,
  stairs_width + 21.75,
  stairs_width + 7.5,
  stairs_width + 34,
  stairs_width + 13.375,
  stairs_width + 26.5,
  stairs_width + 8.875,
  stairs_width + 34,
  stairs_width + 19.75,
  stairs_width + 28.25,
  stairs_width + 14.125,
  stairs_width + 47.75,
  stairs_width + 25.25,
  stairs_width + 41.375,
  stairs_width + 14.375,
  stairs_width + 16 + 15.125 - plank_width, // full plank in closet, 15.125 in hallway
  stairs_width + 16 + 37.25 - 2 * plank_width, // 32.75 in closet, 37.25 in hallway
  stairs_width + 16 + 30.25 - plank_width, // 44.5 in closet, 30.25 in hallway
  stairs_width + 16 + 20.375 - plank_width, // 34.375 in closet, 20.375 in hallway, 18.25 in bathroom
  6.25,
  24.875,
  plank_width,
  31.25,
  20.625,
  40.875,
  10.75,
  plank_width,
  plank_width,
  23.25,
  plank_width
];

const planks = [
  ["B1", "D1", "C1", "A2"],
  ["D1", "C2", "A1", "B1", "D1"],
  ["B1", "D2", "C2", "A1", "B1"],
  ["A2", "C1", "B2", "D1", "C2"],
  ["B2", "A2", "C1", "B1"],
  ["D1", "B1", "A2", "D1"],
  ["A2", "C2", "D1", "B2"],
  ["B1", "A1", "C1", "D2"],
  ["D2", "C1", "B2", "A2"],
  ["B2", "D1", "C2", "D1"],
  ["A2", "C2", "B1", "A1"],
  ["B1", "A2", "C1", "B2"],
  ["A2", "D2", "B1", "A1"],
  ["D1", "C1", "D2", "B1"],
  ["B2", "A2", "B2", "C2"],
  ["D2", "C1", "A2"],
  ["A1", "B1", "D2", "B2"],
  ["D1", "A2", "C1"],
  ["C1", "B2", "D1", "A2"],
  ["B2", "A1", "C2"],
  ["", "C1", "D2 / D1", "B1"],
  ["A1", "B1", "A2"],
  ["D1", "C2", "D2", "A1"],
  ["A2", "B1", "A1", "C1", "B1"],
  ["C2", "D2", "B2", "A2", "D1"],
  ["A1", "C1", "D1", "C2"],
  ["B1", "D1", "A2", "B1", "D1"],
  ["A2", "C2 / B1", "C1", "D2", "C1"],
  ["D1", "B2", "C2", "A1"],
  ["B1", "C1", "", "B1", "C1"],
  ["D2"],
  ["C2"],
  ["A2", "D2"],
  ["B2"]
  // ["", "", "", ""],
];

const completed_rows = offsets.length;
let ctx;
// Setup function
window.onload = () => {
  ctx = document.getElementsByTagName("canvas")[0].getContext("2d");
  ctx.canvas.ondblclick = ctx.canvas.webkitRequestFullScreen;
  window.onresize();
};

window.onresize = () => {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  ctx.font = "12px Arial";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  draw();
};

// Input: inches
// Output: pixels (calculated so that width of the room takes up 100% of canvas width or height)
function scale(inches) {
  const scale_width = ctx.canvas.width / room.width;
  const scale_height = ctx.canvas.height / room.height;
  const scale = scale_width < scale_height ? scale_width : scale_height;
  const pixels = inches * scale;
  return pixels;
}

// Input: pixels
// Output: inches
function reverseScale(pixels) {
  const scale_width = ctx.canvas.width / room.width;
  const scale_height = ctx.canvas.height / room.height;
  const scale = scale_width < scale_height ? scale_width : scale_height;
  const inches = pixels / scale;
  return inches;
}

// These are a bunch of small utilities to make it easier to trace with the pen
let pen = {
  x: 0,
  y: 0
};

function line(x, y) {
  pen.x = x;
  pen.y = y;
  return ctx.lineTo(scale(x), scale(y));
}

function move(x, y) {
  pen.x = x;
  pen.y = y;
  return ctx.moveTo(scale(x), scale(y));
}

function up(y) {
  pen.y -= y;
  return line(pen.x, pen.y);
}

function down(y) {
  pen.y += y;
  return line(pen.x, pen.y);
}

function left(x) {
  pen.x -= x;
  return line(pen.x, pen.y);
}

function right(x) {
  pen.x += x;
  return line(pen.x, pen.y);
}

function drawWalls() {
  // Draw outline around the room to fill
  ctx.beginPath();
  move(0, 0);
  ctx.lineTo(ctx.canvas.width, 0);
  ctx.lineTo(ctx.canvas.width, ctx.canvas.height);
  ctx.lineTo(0, ctx.canvas.height);
  ctx.lineTo(0, 0);

  // Begin tracing the walls
  down(43);
  right(stairs_width);
  down(116.5);
  right(16);
  down(44.875);
  left(4.625);
  up(26.375);
  left(26.125);
  up(14.25);
  left(31.25);
  left(0.625); // This lines up the left walls
  down(130.5);
  right(35.375);
  up(20.375);
  left(10);
  up(15.75);
  right(31.875);
  up(26);
  right(4.5);
  down(5.125);
  right(54.25);
  up(4.875);
  right(5);
  down(25.75);
  right(59.75);
  up(64.25);
  left(59.375);
  down(10.375);
  left(4.625);
  up(44.25);
  right(66.25);
  up(159.75);
  left(room.width);

  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
}

// Draws horizontal and vertical lines that make up the planks
function drawFloor() {
  // Draw row lines
  const rows = scale(room.height) / scale(plank_height);
  for (let i = 0; i < rows; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * scale(plank_height));
    ctx.lineTo(scale(room.width), i * scale(plank_height));
    ctx.stroke();
    ctx.closePath();

    if (i < offsets.length) {
      drawColumnLines(i);
    }
  }
}

function drawColumnLines(i) {
  const columns = 1 + scale(room.width / scale(plank_width));
  for (let j = 0; j <= columns; j++) {
    ctx.beginPath();
    move(offsets[i] + j * plank_width, i * plank_height);
    down(plank_height);
    ctx.stroke();
    ctx.closePath();

    if (planks[i] !== undefined && planks[i][j] !== undefined) {
      drawPlankLabels(i, j);
    }
  }
}

function drawPlankLabels(i, j) {
  ctx.fillStyle = "#000000";
  // If we're on a row that is to the very left and we're on the first plank
  if ((i < 5 || i > 18) && j === 0) {
    // Center the text on that small plank
    ctx.fillText(
      planks[i][j],
      scale(offsets[i] / 2.5),
      scale(i * plank_height + plank_height / 1.75)
    );
  } else if (i > 4 && i < 19 && j === 0) {
    // If we're on a row that isn't on the very left
    ctx.fillText(
      planks[i][j],
      scale((offsets[i] - stairs_width) / 2.5 + stairs_width),
      scale(i * plank_height + plank_height / 1.75)
    );
  } else if (j === planks[i].length - 1) {
    // Left align the last label
    ctx.fillText(
      planks[i][j],
      scale(offsets[i] + j * plank_width - plank_width + 1),
      scale(i * plank_height + plank_height / 1.75)
    );
  } else {
    ctx.fillText(
      planks[i][j],
      scale(offsets[i] + j * plank_width - plank_width / 1.75),
      scale(i * plank_height + plank_height / 1.75)
    );
  }
}

// Note offset to the side
function drawOffsets() {
  const rows = scale(room.height) / scale(plank_height);
  ctx.fillStyle = "#000000";
  let bias_offset = 0;
  let number_of_columns = 3;
  for (let i = 0; i < rows; i++) {
    if (i >= completed_rows) {
      ctx.fillStyle = "#FF0000";
    }
    if (i > 4 && i < 19) {
      number_of_columns = 2;
      bias_offset = stairs_width;
    }
    if (i > 18) {
      number_of_columns = 3;
      bias_offset = 0;
    }
    if (i < offsets.length && offsets[i] !== undefined) {
      ctx.fillText(
        `${offsets[i] - bias_offset}, ${room.width -
          offsets[i] -
          number_of_columns * plank_width} (rem: ${(number_of_columns + 1) *
          plank_width -
          room.width +
          offsets[i]})`,
        scale(room.width + 1),
        scale(i * plank_height + plank_height / 1.5)
      );
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawFloor();
  drawWalls();
  drawOffsets();

  // Draw single plank to cut out
  ctx.strokeRect(scale(5), scale(60), scale(plank_height), scale(plank_width));
  // Draw legend
  ctx.fillStyle = "#000000";
  ctx.fillText("A1 - White", scale(plank_height + 10), scale(64));
  ctx.fillText("A2 - Black", scale(plank_height + 10), scale(68));
  ctx.fillText("B1 - Purple", scale(plank_height + 10), scale(74));
  ctx.fillText("B2 - Orange Square", scale(plank_height + 10), scale(78));
  ctx.fillText("C1 - Green", scale(plank_height + 10), scale(84));
  ctx.fillText("C2 - Fuchsia", scale(plank_height + 10), scale(88));
  ctx.fillText("D1 - Orange Circle", scale(plank_height + 10), scale(94));
  ctx.fillText("D2 - Yellow", scale(plank_height + 10), scale(98));
}

// If the mouse is clicked, set the offset of the row the mouse is over to the
// mouse's X position
window.onmousemove = e => {
  if (e.buttons === 1) {
    const x = e.pageX;
    const y = e.pageY;
    // This calculates the row we're over
    const row = Math.floor(y / scale(plank_height));
    // Only allow new rows to be modified
    if (row >= completed_rows) {
      offsets[row] = Math.floor(reverseScale(x) * 8) / 8;
      draw();
    }
  }
};
