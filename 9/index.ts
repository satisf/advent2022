import * as fs from "fs";

const inputFile = "./9/input";

const lines = fs.readFileSync(inputFile, "utf8").split(/\r?\n/);

// TYPES & INTERFACES

type Position = {
	x: number;
	y: number;
};

type Direction = "U" | "D" | "L" | "R" | "UR" | "DR" | "UL" | "DL";

type Move = {
	direction: Direction;
	steps: number;
};

// FUNCTIONS

function parseLineToMove(line: string): Move {
	const tokens = line.split(" ");
	return { direction: tokens[0] as Direction, steps: Number(tokens[1]) };
}

function makeMove(move: Move) {
	for (let i = 0; i < move.steps; i++) {
		moveHeadOneStep(move.direction);
	}
}

function moveHeadOneStep(direction: Direction) {
	switch (direction) {
		case "U":
			knots[0].y++;
			break;
		case "D":
			knots[0].y--;
			break;
		case "L":
			knots[0].x--;
			break;
		case "R":
			knots[0].x++;
			break;
	}
	console.log(`move head ${direction}`);
	moveKnot(direction, 1);
}

function moveKnot(previousKnotDirection: Direction, currentKnot: number) {
	if (touchesPreviousKnot(currentKnot)) {
		return;
	}
	let currentDirection: Direction = previousKnotDirection;
	switch (previousKnotDirection) {
		case "U":
			knots[currentKnot].y++;
			if (knots[currentKnot].x === knots[currentKnot - 1].x) {
				currentDirection = "U";
			} else if (knots[currentKnot].x > knots[currentKnot - 1].x) {
				currentDirection = "UL";
			} else {
				currentDirection = "UR";
			}
			knots[currentKnot].x = knots[currentKnot - 1].x;
			break;
		case "D":
			knots[currentKnot].y--;
			if (knots[currentKnot].x === knots[currentKnot - 1].x) {
				currentDirection = "D";
			} else if (knots[currentKnot].x > knots[currentKnot - 1].x) {
				currentDirection = "DL";
			} else {
				currentDirection = "DR";
			}
			knots[currentKnot].x = knots[currentKnot - 1].x;
			break;
		case "L":
			knots[currentKnot].x--;
			if (knots[currentKnot].y === knots[currentKnot - 1].y) {
				currentDirection = "L";
			} else if (knots[currentKnot].y > knots[currentKnot - 1].y) {
				currentDirection = "DL";
			} else {
				currentDirection = "UL";
			}
			knots[currentKnot].y = knots[currentKnot - 1].y;
			break;
		case "R":
			knots[currentKnot].x++;
			if (knots[currentKnot].y === knots[currentKnot - 1].y) {
				currentDirection = "R";
			} else if (knots[currentKnot].y > knots[currentKnot - 1].y) {
				currentDirection = "DR";
			} else {
				currentDirection = "UR";
			}
			knots[currentKnot].y = knots[currentKnot - 1].y;
			break;
		case "UR": {
			knots[currentKnot].x++;
			knots[currentKnot].y++;
			break;
		}
		case "DR": {
			knots[currentKnot].x++;
			knots[currentKnot].y--;
			break;
		}
		case "UL": {
			knots[currentKnot].x--;
			knots[currentKnot].y++;
			break;
		}
		case "DL": {
			knots[currentKnot].x--;
			knots[currentKnot].y--;
			break;
		}
	}
	// console.log(`move ${currentKnot} ${currentDirection}`);
	if (currentKnot === 9) {
		console.log(`tail moved ${currentDirection}`);
		saveTailPosition();
	} else {
		moveKnot(currentDirection, currentKnot + 1);
	}
}

function touchesPreviousKnot(currentKnot: number): boolean {
	// console.log(
	// 	`touching ${currentKnot}? (${knots[currentKnot - 1].x},${
	// 		knots[currentKnot - 1].y
	// 	})(${knots[currentKnot].x},${knots[currentKnot].y})`
	// );
	const absX = Math.abs(knots[currentKnot - 1].x - knots[currentKnot].x);
	const absY = Math.abs(knots[currentKnot - 1].y - knots[currentKnot].y);
	return absX <= 1 && absY <= 1;
}

function saveTailPosition() {
	console.log(`tail moved ${JSON.stringify(knots[9])}`);
	tailPositions.push(JSON.stringify(knots[9]));
}

// PARSING

const knots: Array<Position> = [
	{ x: 0, y: 0 },
	{ x: 0, y: 0 },
	{ x: 0, y: 0 },
	{ x: 0, y: 0 },
	{ x: 0, y: 0 },
	{ x: 0, y: 0 },
	{ x: 0, y: 0 },
	{ x: 0, y: 0 },
	{ x: 0, y: 0 },
	{ x: 0, y: 0 },
];
const tailPositions: Array<string> = [];
saveTailPosition();

lines.forEach((line, yIndex) => {
	makeMove(parseLineToMove(line));
});

console.log(`result: ${new Set(tailPositions).size}`);
