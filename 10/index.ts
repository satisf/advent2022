import * as fs from "fs";

const inputFile = "./10/input";

const lines = fs.readFileSync(inputFile, "utf8").split(/\r?\n/);

// TYPES & INTERFACES

let cycle = 0;
let x = 1;
let line = 0;
const interestingSignals: Array<number> = [];
const signal: Array<Array<string>> = [[], [], [], [], [], []];

function increaseCycle() {
	if ((cycle + 1 + 20) % 40 === 0) {
		interestingSignals.push((cycle + 1) * x);
	}
	if (cycle % 40 === 0) {
		line = Math.floor(cycle / 40);
	}
	drawCycle();

	cycle++;
}

function drawCycle() {
	signal[line].push(matchesSprite() ? "#" : ".");
}

function matchesSprite(): boolean {
	return Math.abs((cycle % 40) - x) <= 1;
}

lines.forEach((line) => {
	const splitLine = line.split(" ");
	switch (splitLine[0]) {
		case "noop": {
			increaseCycle();
			break;
		}
		case "addx": {
			increaseCycle();
			increaseCycle();
			x += Number(splitLine[1]);
		}
	}
});

console.log(`result1: ${interestingSignals.reduce((a, b) => a + b)}`);
console.log();
console.log(signal[0].join(""));
console.log(signal[1].join(""));
console.log(signal[2].join(""));
console.log(signal[3].join(""));
console.log(signal[4].join(""));
console.log(signal[5].join(""));
