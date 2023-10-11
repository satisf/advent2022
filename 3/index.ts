import * as fs from "fs";

const inputFile = "./3/input";

const lines = fs.readFileSync(inputFile, "utf8").split(/\r?\n/);

const alphabetLowerCase = Array.from(Array(26))
	.map((e, i) => i + 97)
	.map((x) => String.fromCharCode(x));

function isUpperCase(str: string): boolean {
	return str === str.toUpperCase();
}

function calculatePriority(item: string): number {
	let priority = 0;
	if (isUpperCase(item)) {
		priority += 26;
	}
	priority += alphabetLowerCase.indexOf(item.toLowerCase()) + 1;
	return priority;
}

function findEqualItems(a: string, b: string): Array<string> {
	let result = Array.from(
		new Set(Array.from(a).filter((item) => b.includes(item)))
	);
	return result;
}

function findEqualItemsIn3(a: string, b: string, c: string): Array<string> {
	let result = Array.from(
		new Set(
			Array.from(a).filter((item) => b.includes(item) && c.includes(item))
		)
	);
	return result;
}

let result1 = 0;
let result2 = 0;

lines.forEach((line) => {
	const compartment1 = line.substring(0, line.length / 2);
	const compartment2 = line.substring(line.length / 2);

	result1 += findEqualItems(compartment1, compartment2)
		.map((item) => calculatePriority(item))
		.reduce((prev, cur) => prev + cur);
});

for (let i = 0; i < lines.length; i += 3) {
	result2 += findEqualItemsIn3(lines[i], lines[i + 1], lines[i + 2])
		.map((item) => calculatePriority(item))
		.reduce((prev, cur) => prev + cur);
}

console.log(`part 1: ${result1}`);
console.log(`part 2: ${result2}`);
