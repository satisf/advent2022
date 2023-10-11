import * as fs from "fs";

const inputFile = "./5/input";

const lines = fs.readFileSync(inputFile, "utf8").split(/\r?\n/);

interface Stacks {
	[index: string]: Array<string>;
}

function parseStacks(lines: Array<string>): Stacks {
	const stacks: Stacks = {};
	const stackPosLineIndex = lines.findIndex(
		(line) => line === " 1   2   3   4   5   6   7   8   9 "
	);
	const stackPosLine = lines[stackPosLineIndex];
	Array.from(stackPosLine).forEach((currentPosition, index) => {
		if (currentPosition !== " ") {
			stacks[currentPosition] = [];
			for (let i = stackPosLineIndex - 1; i != -1; i -= 1) {
				let currentCargo = Array.from(lines[i])[index];
				if (currentCargo !== " ") {
					stacks[currentPosition].push(currentCargo);
				}
			}
		}
	});
	return stacks;
}

function moveCargo(times: number, from: string, to: string) {
	const prevStacks = JSON.parse(JSON.stringify(stacks));
	for (let i = 0; i < times; i++) {
		moveCargoOnce(from, to);
	}
	if (prevStacks[from].length != stacks[from].length + times) {
		console.log(`from does not match`);
	}

	if (prevStacks[to].length != stacks[to].length - times) {
		console.log(`to does not match`);
	}
}

function moveCargoV9001(times: number, from: string, to: string) {
	const prevStacks = JSON.parse(JSON.stringify(stacks));
	const cargo = stacks[from].slice(stacks[from].length - times);
	stacks[from] = stacks[from].slice(0, stacks[from].length - times);
	stacks[to].push(...cargo);

	if (prevStacks[from].length != stacks[from].length + times) {
		console.log(`from does not match`);
	}

	if (prevStacks[to].length != stacks[to].length - times) {
		console.log(`to does not match`);
	}
}

function moveCargoOnce(from: string, to: string) {
	const cargo = stacks[from].pop();
	stacks[to].push(cargo!!);
}

function printResult() {
	console.log(
		`${stacks[1][stacks[1].length - 1]}${stacks[2][stacks[2].length - 1]}${
			stacks[3][stacks[3].length - 1]
		}${stacks[4][stacks[4].length - 1]}${stacks[5][stacks[5].length - 1]}${
			stacks[6][stacks[6].length - 1]
		}${stacks[7][stacks[7].length - 1]}${stacks[8][stacks[8].length - 1]}${
			stacks[9][stacks[9].length - 1]
		}`
	);
}

const stacks = parseStacks(lines);

lines.forEach((line) => {
	if (line.startsWith("move")) {
		const numbers = line.match(/\d+/g);
		if (numbers && numbers.length == 3) {
			let times = Number(numbers[0]);
			let from = numbers[1];
			let to = numbers[2];
			moveCargoV9001(times, from, to);
		}
	}
});
printResult();
