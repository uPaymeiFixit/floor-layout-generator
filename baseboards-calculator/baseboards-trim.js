const BOARD_LENGTH = 16 * 12; // 192 inches
// Austin Hardwoods
// trim: 58¢/ft@16ft = $9.28 each board
// baseboards: 47¢/ft@16ft = $7.52 each board

// Gonahl Lumber
// trim: $8.23 each board
// baseboards: 10.16 each board

// door trim - 6@16ft
// const CUTS = [97, 124.5, 83.5, 83.5, 33.5, 83.5, 83.5, 33.5, 84, 84, 33.5, 84, 84, 33.5];
// baseboard - 6@16ft
const CUTS = [1.5, 216, 36.5, 275, 44, 6, 116.5, 16, 43.5, 24, 26.5, 14.5, 31.5, 132, 35.5, 21, 9.5, 17, 32, 23.5, 23.5, 55, 23.5, 23.5, 59.5, 62, 5, 43, 66.5, 160];
// quarter round - 2@16ft
// const CUTS = [21.5, 19, 26.5, 27.5, 0.5, 6.5, 28, 53, 3, 1.5, 20.5, 68.5, 20.5, 68];

const MAXIMUM_NUMBER_OF_PERMUTATIONS_TO_GENERATE = 100000;
const MAXIMUM_NUMBER_OF_OUTPUTS_PER_BOARD_NUMBER = 10;

Array.prototype.randomSplice = function () {
    const random_index = Math.floor(Math.random() * this.length);
    return this.splice(random_index, 1)[0];
}

Array.prototype.sum = function () {
    return this.length === 0 ? 0 : this.reduce((a, b) => {
        return a + b;
    });
}

Array.prototype.printBoards = async function () {
    console.log('\nBest Set (\x1b[33m%s boards\x1b[0m):', this.length);
    await this.forEach(board => {
        let measurements = '';
        for (let i = 0; i < board.length - 1; i++) {
            measurements += (board[i] + '\" ').padEnd(8);
        }
        console.log('\x1b[31m%s\x1b[36m%s\x1b[0m', (board[board.length - 1] + '\"').padEnd(8), measurements);
    });
}

async function init () {
    const minimum_boards = Math.ceil(CUTS.sum() / BOARD_LENGTH);
    const minimum_waste = minimum_boards * BOARD_LENGTH - CUTS.sum();
    console.log(`Minimum boards: ${minimum_boards}\nMinimum waste: ${minimum_waste} inches`);

    // Split up cuts larger than board length
    for (let i in CUTS) {
        if (CUTS[i] > BOARD_LENGTH) {
            CUTS.push(CUTS[i] - BOARD_LENGTH);
            CUTS[i] = BOARD_LENGTH;
        }
    }

    let best_set_length = 0;
    let current_set_count;
    // Randomly place cuts on boards n times and pick the one with the fewest boards
    for (let n = 0; n < MAXIMUM_NUMBER_OF_PERMUTATIONS_TO_GENERATE; n++) {
        let cuts_copy = CUTS.slice();
        let boards = [[]];
        while (cuts_copy.length > 0) {
            let r = cuts_copy.randomSplice();
            if (boards[boards.length - 1].sum() + r > BOARD_LENGTH) {
                // Attach the leftover at the end
                boards[boards.length - 1].push(BOARD_LENGTH - boards[boards.length - 1].sum());
                boards.push([r]);
            } else {
                boards[boards.length - 1].push(r);
            }
        }
            
        if (boards.length === best_set_length) {
            // Don't print more sets than we want to, and if we've printed as many as we want to
            // and we've already found the best possible solution, stop running.
            current_set_count++;
            if (current_set_count < MAXIMUM_NUMBER_OF_OUTPUTS_PER_BOARD_NUMBER) {
                await boards.printBoards();
            } else if (best_set_length === minimum_boards) {
                break;
            }
        } else if (boards.length < best_set_length || best_set_length === 0) {
            best_set_length = boards.length;
            current_set_count = 1;
            await boards.printBoards();
        }
    }

    console.log(`\nMinimum boards: ${minimum_boards}\nMinimum waste: ${minimum_waste} inches`);
}
init();
