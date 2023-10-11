import * as fs from "fs";

const inputFile = "./2015-2/input";

const lines = fs.readFileSync(inputFile, "utf8").split(/\r?\n/);

// TYPES & INTERFACES
let requiredPaper = 0;
lines.forEach((line) => {
	const values = line.split("x").map((it) => Number(it));
	const shiftedValues: Array<number> = JSON.parse(JSON.stringify(values));
	shiftedValues.push(shiftedValues.shift()!!);
	const result = values.map((value, index) => value * shiftedValues[index]);
	requiredPaper += Math.min(...result) + result.reduce((a, b) => a + b) * 2;
});
console.log(requiredPaper);
