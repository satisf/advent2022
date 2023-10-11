import * as fs from "fs";

const inputFile = "./4/input";

const lines = fs.readFileSync(inputFile, "utf8").split(/\r?\n/);

type CleanupRange = {
	begin: number;
	end: number;
};

function rangeIncludes(a: CleanupRange, b: CleanupRange): boolean {
	return a.begin <= b.begin && a.end >= b.end;
}

function rangeOverlaps(a: CleanupRange, b: CleanupRange): boolean {
	return (
		(a.begin <= b.end && a.begin >= b.begin) ||
		(a.end >= b.begin && a.end <= b.end)
	);
}

function stringToRange(str: string): CleanupRange {
	let values = str.split("-");
	return { begin: Number(values[0]), end: Number(values[1]) };
}

let result1 = 0;
let result2 = 0;

lines.forEach((line) => {
	let elves = line.split(",");
	let elf1 = stringToRange(elves[0]);
	let elf2 = stringToRange(elves[1]);

	if (rangeIncludes(elf1, elf2) || rangeIncludes(elf2, elf1)) result1++;
	if (rangeOverlaps(elf1, elf2) || rangeOverlaps(elf2, elf1)) result2++;
});

console.log(`result1: ${result1}`);
console.log(`result2: ${result2}`);
