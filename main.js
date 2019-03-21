/**
 * @author Josh Gibbs (uPaymeiFixit@gmail.com)
 */

// In my case, it just so happens that two patterns are flips
// So index 0 and 1 are flips of eachother, as are 2 and 3, 4 and 5, 6 and 7
// let pattern = ['#4286f4', '#0046b7', '#30b700', '#8ae26a', '#e27369', '#c11707', '#9befe7', '#06877a'];
// let pattern = ['#EEEEEE', '#666666', '#c586e8', '#e8c986', '#56ff30', '#ff3097', '#ffbd30', '#f8ff30'];
let pattern = ['#efe9d0', '#e5e0c7', '#e8e3ce', '#f2efe1', '#f4efd9', '#e2dfce', '#d3d1c6', '#edebe1'];
// Offsets measure the length of the first plank in inches
let offsets = [0, 24.5, 10, 35, 16, 26, 47.5, 12 + 3/4, 36, 19 + 3/8, 44 + 1/8, 32 + 1/2, 5.125, 21];
// Pattern index of each plank (00 = no data 000 = no plank)
let planks = [  [000, 000, 000, 000, 000, 000, 000, 000, 000],
                [000, 000, 000, 000, 000, 000, 000, 000, 000],
                [000, 000, 000, 000, 000, 000, 000, 000, 000],
                [000, 000, 000, 000, 000, 000, 000, 000, 000],
                [000, 000, 000, 000, 000, 000, 000, 000, 000],
                [000, 000, 000, 000, 000, 000, 000, 000, 000],
                [000, 000, 000, 000, 000, 000, 000, 000, 000],
                [4, 1, 2, 6, 5, 7, 4, 3, 1],
                [2, 7, 5, 1, 3, 2, 0, 4, 0],
                [0, 4, 3, 7, 4, 0, 5, 6, 2],
                [6, 1, 4, 0, 6, 4, 2, 5],
                [3, 5, 6, 2, 5, 3, 1, 7, 3],
                [000, 000, 000, 000, 000, 000, 000, 000, 000],
                [000, 000, 000, 000, 000, 000, 000, 000, 000],
              ];
let obsticles = [
                  {
                    description: 'pantry',
                    x: 216,
                    y: 0,
                    width: 19,
                    height: 21
                  },
                  {
                    description: 'stove side cabinets',
                    x: 272,
                    y: 0,
                    width: 104,
                    height: 21
                  },
                  {
                    description: 'refrigerator side wall',
                    x: 272 - 11/16,
                    y: 0,
                    width: 11/16,
                    height: 27.25
                  },
                  {
                    description: 'sink cabinet',
                    x: 376 - 21,
                    y: 21,
                    width: 21,
                    height: 53.25
                  },
                  {
                    description: 'dishwasher side wall',
                    x: 376 - 24,
                    y: 98 + 7/16,
                    width: 24,
                    height: 1 + 7/16
                  },
                  {
                    description: 'waterfall countertop edge',
                    x: 376 - (25 + 1/8),
                    y: 99 + 7/8,
                    width: 25 + 1/8,
                    height: 1 + 5/8
                  },
                  {
                    description: 'island',
                    x: 234.25,
                    y: 66,
                    width: 68,
                    height: 20.25
                  },
                  {
                    description: 'stair stringer 1',
                    x: 275.5,
                    y: 140 + 3/8,
                    width: 7.5,
                    height: 3.5
                  },
                  {
                    description: 'stair stringer 2',
                    x: 275.5,
                    y: 179.5,
                    width: 7.5,
                    height: 3.75 + 0.5 // 0.5 just for rounding error
                  },
                  {
                    description: 'hvac closet',
                    x: 376 - 32.5,
                    y: 183.25 - 39.75,
                    width: 32.5 + 0.5, // 0.5 just for rounding error
                    height: 39.75 + 0.5 // 0.5 just for rounding error
                  },
                  {
                    description: 'closet wall',
                    x: 376 - (58 + 5/8),
                    y: 183.25 - 39.75,
                    width: 26 + 1/8,
                    height: 4.25 + 0.5 // 0.5 just for rounding error
                  },
                  {
                    description: 'closet door frame 1',
                    x: 376 - (58 + 5/8),
                    y: 183.25 - 39.75 + 4.25,
                    width: 4.5,
                    height: 3.5
                  },
                  {
                    description: 'closet door frame 2',
                    x: 376 - (58 + 5/8),
                    y: 183.25 - 5.5,
                    width: 4.5,
                    height: 5.5 + 0.5 // 0.5 just for rounding error
                  }
                ];
const room = {
  width: 376,
  height: 183.25
}

let ctx;
const scale = 300;
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
  const rows = Math.ceil(room.height / (47 + 5 / 8) * scale / height);
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
      } while (!testPattern(new_pattern, j, new_plank));
      new_plank.push(new_pattern);
    }
    planks.push(new_plank);
  }
}

function testOffset (offset) {
  offset /= width; // Normalize offset to compare it to width = 1
  // If plank is less than 8"
  if (offset < 0.11) {
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

  // Hilight the area we've completed
  ctx.fillStyle = `rgba(255, 128, 128, 0.20)`;
  ctx.fillRect(0, 0, ctx.canvas.width, completed * height);

  // Draw obsticles
  ctx.fillStyle = '#222222',
  obsticles.forEach(obsticle => {
    ctx.fillRect(Math.floor(obsticle.x / (47 + 5 / 8) * scale), Math.floor(obsticle.y / (47 + 5 / 8) * scale), Math.floor(obsticle.width / (47 + 5 / 8) * scale), Math.floor(obsticle.height / (47 + 5 / 8) * scale));
  })


  // This is a temporary and bad solution to only display the room
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, Math.floor(room.height / (47 + 5 / 8) * scale), ctx.canvas.width, ctx.canvas.height - Math.floor(room.height / (47 + 5 / 8) * scale));
  ctx.fillRect(Math.floor(room.width / (47 + 5 / 8) * scale), 0, ctx.canvas.width - Math.floor(room.width / (47 + 5 / 8) * scale), Math.floor(room.height / (47 + 5 / 8) * scale));
}