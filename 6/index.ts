import * as fs from "fs";

const inputFile = "./6/input";

const lines = fs.readFileSync(inputFile, "utf8").split(/\r?\n/);

function findDistinctSequence(msg: string, length: number): number {
	return (
		Array.from(msg).findIndex(
			(_: string, index: number, message: Array<string>) => {
				if (new Set(message.slice(index, index + length)).size === length) {
					return true;
				}
			}
		) + length
	);
}

const result1 = findDistinctSequence(lines[0], 4);
const result2 = findDistinctSequence(lines[0], 14);

console.log(`result 1: ${result1}`);
console.log(`result 2: ${result2}`);
