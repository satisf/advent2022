import * as fs from "fs";

const inputFile = "./1/input";

const lines = fs.readFileSync(inputFile, "utf8").split(/\r?\n/);

const elves: Array<number> = [];
let food = 0;

lines.forEach((line) => {
	if (line === "") {
		elves.push(food);
		food = 0;
	} else {
		food += Number(line);
	}
});
const result1 = Math.max(...elves);
console.log(`result part 1: ${result1}`);

const sortedElves = elves.sort((a, b) => b - a);

const result2 = sortedElves[0] + sortedElves[1] + sortedElves[2];

console.log(`result part 2: ${result2}`);
