/**
 * @author Josh Gibbs (uPaymeiFixit@gmail.com)
 */

// In my case, it just so happens that two patterns are flips
// So index 0 and 1 are flips of eachother, as are 2 and 3, 4 and 5, 6 and 7
let pattern = ['#4286f4', '#0046b7', '#30b700', '#8ae26a', '#e27369', '#c11707', '#9befe7', '#06877a'];
// Offsets measure the length of the first plank in inches
let offsets = [12 + 3/4, 36, 19 + 3/8, 44 + 1/8, 32 + 1/2];
// Pattern index of each plank
let planks = [
                [4, 1, 2, 6, 5, 7],
                [2, 7, 5, 1, 3, 2],
                [0, 4, 3, 7, 4, 1],
                [6, 1, 4, 0, 6],
                [3, 5, 6, 2, 5]
              ];

let ctx;
const scale = 600;
const height = Math.floor((8 + 5 / 8) / (47 + 5 / 8) * scale); // This in the ratio of height to width so that width = 1
const width = scale;
const completed = offsets.length;

// Setup function
window.onload = () => {
  ctx = document.getElementsByTagName('canvas')[0].getContext('2d');

  window.onresize = resize;
  ctx.canvas.ondblclick = ctx.canvas.webkitRequestFullScreen;

  if (planks.length != offsets.length) {
    throw 'Planks and Offsets need to be the same size!';
  }

  // Normalize offsets
  offsets = offsets.map(element => Math.floor(element / (47 + 5 / 8) * scale));
  generatePlanks();
  resize();
}

function resize () {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  ctx.font = '16px Arial';
  ctx.strokeStyle = '#222222';
  ctx.lineWidth = 2;
  draw();
}

function generatePlanks () {
  const rows = Math.ceil(window.innerHeight / height);
  for (let i = 0; i < rows; i++) {
    // Generate new random offset
    let new_offset;
    do {
      new_offset = Math.floor(Math.random() * width);
    } while (!testOffset(new_offset));
    offsets.push(new_offset);
    
    // Generate random pattern planks
    const columns = Math.ceil(window.innerWidth / width) + 1;
    let new_plank = [];
    for (let j = 0; j < columns; j++) {
      let new_pattern;
      do {
        new_pattern = Math.floor(Math.random() * pattern.length);
        console.log(`row: ${planks.length}\t column: ${j}`);
      } while (!testPattern(new_pattern, j, new_plank));
      new_plank.push(new_pattern);
    }
    planks.push(new_plank);
  }
}

function testOffset (offset) {
  offset /= width; // Normalize offset to compare it to width = 1
  // If plank is less than 8"
  if (offset < 0.17) {
    return false;
  }

  // If plank is within 8" of previous offset
  if (offsets.length > 0) {
    const previous_offset = offsets[offsets.length - 1] / width;
    if (Math.abs(previous_offset - offset) < 0.17) {
      return false;
    }
  }

  // If plank is within 4" of second previous offset
  if (offsets.length > 1) {
    const previous_offset_2 = offsets[offsets.length - 2] / width;
    if (Math.abs(previous_offset_2 - offset) < 0.09) {
      return false;
    }
  }

  return true;
}

function testPattern (pattern, column, current_row) {
  const odd = pattern % 2 == 1;

  // Make sure the one next to it is not a flip or identicle
  if (current_row.length > 0) {
    const previous_in_row = current_row[current_row.length - 1];
    if (odd && pattern - 1 == previous_in_row) return false;
    if (!odd && pattern + 1 == previous_in_row) return false;
    if (pattern == previous_in_row) return false;
  }

  // Make sure the one two down is not identicle
  if (current_row.length > 1) {
    const previous_in_row_2 = current_row[current_row.length - 2];
    if (pattern == previous_in_row_2) return false;
  }

  // Make sure the ones directly above it is not identicle or a flip
  const previous_row = planks[planks.length - 1];
  const pattern_in_column = previous_row[column];
  if (odd && pattern - 1 == pattern_in_column) return false;
  if (!odd && pattern + 1 == pattern_in_column) return false;
  if (pattern == pattern_in_column) return false;

  if (offsets.length > 1) {
    const current_offset = offsets[offsets.length - 1];
    const previous_offset = offsets[offsets.length - 2];

    // Make sure the bordering column above to the right is not idencticle or a flip
    if (current_offset > previous_offset) {
      if (previous_row.length >= column) {
        const pattern_up_right = previous_row[column + 1];
        if (odd && pattern - 1 == pattern_up_right) return false;
        if (!odd && pattern + 1 == pattern_up_right) return false;
        if (pattern == pattern_up_right) return false;
      }
    } 
    // Make sure the bordering column above to the left is not idencticle or a flip
    else {
      if (column > 0 ) {
        const pattern_up_left = previous_row[column - 1];
        if (odd && pattern - 1 == pattern_up_left) return false;
        if (!odd && pattern + 1 == pattern_up_left) return false;
        if (pattern == pattern_up_left) return false;
      }
    }
  }

  // Without the ability to go back and change our previous plank pattern,
  // this will sometimes result in an impossible puzzle in an endless loop.

  // // Make sure the ones two above it is not identicle
  // if (planks.length > 1) {
  //   const previous_row_2 = planks[planks.length - 2];
  //   const pattern_in_column = previous_row_2[column];
  //   if (pattern == pattern_in_column) return false;

  //   if (offsets.length > 2) {
  //     const current_offset = offsets[offsets.length - 1];
  //     const previous_offset_2 = offsets[offsets.length - 3];

  //     // Make sure the column two above to the right is not idencticle
  //     if (current_offset > previous_offset_2) {
  //       if (previous_row_2.length >= column) {
  //         const pattern_up_right = previous_row_2[column + 1];
  //         if (pattern == pattern_up_right) return false;
  //       }
  //     } 
  //     // Make sure the column two above to the left is not idencticle
  //     else {
  //       if (column > 0 ) {
  //         const pattern_up_left = previous_row_2[column - 1];
  //         if (pattern == pattern_up_left) return false;
  //       }
  //     }
  //   }
  // }

  return true;
}

function draw () {
  for (let row = 0; row < planks.length; row++) {
    for (let column = 0; column < planks[row].length; column++) {
      ctx.fillStyle = pattern[planks[row][column]];
      ctx.fillRect(offsets[row] + (column - 1) * width, row * height, width, height);
      ctx.rect(offsets[row] + (column - 1) * width, row * height, width, height);
      ctx.stroke();
    }
    ctx.fillStyle = '#FFFFFF'
    ctx.fillText(offsets[row] * (47 + 5 / 8) / scale, 7, row * height + 0.12 * scale);
  }
  ctx.fillStyle = `rgba(255, 255, 255, 0.50)`;
  ctx.fillRect(0, 0, ctx.canvas.width, completed * height);
}