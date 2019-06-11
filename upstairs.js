/**
 * @author Josh Gibbs (uPaymeiFixit@gmail.com)
 */

const room = {
  width: 183.25,
  height: 297
};

let ctx;

// Setup function
window.onload = () => {
  ctx = document.getElementsByTagName("canvas")[0].getContext("2d");

  window.onresize = resize;
  ctx.canvas.ondblclick = ctx.canvas.webkitRequestFullScreen;

  resize();
};

function resize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  ctx.font = "12px Arial";
  ctx.strokeStyle = "#000000";
  ctx.fillStyle = "#FFFFFF";
  ctx.lineWidth = 2;
  draw();
}

// Input: inches
// Output: pixels (calculated so that width of the room takes up 100% of canvas width or height)
function scale(inches) {
  const scale_width = ctx.canvas.width / room.width;
  const scale_height = ctx.canvas.height / room.height;
  const scale = scale_width < scale_height ? scale_width : scale_height;
  const pixels = inches * scale;
  return pixels;
}

function reverseScale(pixels) {
  const scale_width = ctx.canvas.width / room.width;
  const scale_height = ctx.canvas.height / room.height;
  const scale = scale_width < scale_height ? scale_width : scale_height;
  const inches = pixels / scale;
  return inches;
}

// ctx.lineTo with inputs as inches, not pixels
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

  down(43.5);
  right(46.25);
  down(116.5);
  right(16);
  down(45);
  left(5);
  up(26);
  left(26.25);
  up(14);
  left(31.25);
  down(130);
  right(35.25);
  up(20.5);
  left(9.5);
  up(15.75);
  right(32);
  up(26);
  right(5);
  down(5);
  right(53.75);
  up(5);
  right(5);
  down(25);
  right(59.5);
  up(66);
  left(60);
  down(10.5);
  left(5);
  up(44.25);
  right(66.5);
  up(159.5);
  left(182.5);

  ctx.stroke();
  ctx.fill();
  ctx.closePath();
}

/* Pre-cut offsets (beginning):
28 1/8  D1
19 5/8  A2
14 7/8  A1
14 7/8  C2
13 3/4  B2

Pre-cut end pieces
21 1/8  B2
 7 1/2  B2
 3 1/2  D1

 Number of whole planks left:
 A1: 4
 A2: 11
 B1: 9
 B2: 6
 C1: 11
 C2: 5
 D1: 6
 D2: 9

 Total planks needed: ~66
*/

const offsets = [
  0,
  14.875,
  26.5,
  7.25,
  40,
  46.25 + 21.75,
  46.25 + 7.5,
  46.25 + 34,
  46.25 + 13.375,
  46.25 + 26.5,
  46.25 + 8.875
];
const completed_rows = offsets.length;
const plank_height = 8.625;
const plank_width = 47 + 9 / 16;

function drawFloor() {
  const rows = scale(room.height) / scale(plank_height);
  const columns = scale(room.width / scale(plank_width));
  for (let i = 0; i < rows; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * scale(plank_height));
    ctx.lineTo(scale(room.width), i * scale(plank_height));
    ctx.stroke();
    ctx.closePath();

    if (i < offsets.length) {
      for (let j = 0; j < columns; j++) {
        ctx.beginPath();
        move(offsets[i] + j * plank_width, i * plank_height);
        down(plank_height);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
}

// Note offset to the side
function drawOffsets() {
  const rows = scale(room.height) / scale(plank_height);
  ctx.fillStyle = "#000000";
  let bias = 0;
  for (let i = 0; i < rows; i++) {
    if (i >= completed_rows) {
      ctx.fillStyle = "#FF0000";
    }
    if (i > 4 && i < 19) {
      bias = 46.25;
    }
    if (i < offsets.length && offsets[i] !== undefined) {
      ctx.fillText(
        `${offsets[i] - bias}, ${182.5 - offsets[i] - 3 * plank_width + bias}`,
        scale(184),
        scale(i * plank_height + plank_height / 1.5)
      );
    }
  }
  ctx.fillStyle = "#FFFFFF";
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
  ctx.fillStyle = "#FFFFFF";
}

onmousemove = function(e) {
  if (e.buttons === 1) {
    const x = e.pageX;
    const y = e.pageY;
    const row = Math.floor(y / scale(plank_height));
    if (row >= completed_rows) {
      offsets[row] = Math.floor(reverseScale(x) * 8) / 8;
      draw();
    }
  }
};
