import * as fs from "fs";

const inputFile = "./2015-1/input";

const lines = fs.readFileSync(inputFile, "utf8").split(/\r?\n/);

// TYPES & INTERFACES

const line = lines[0];
// console.log(lines[0]);

// console.log(Array.from(lines[0]));
let count = 0;
let pos = 0;

for (let i = 0; i < line.length; i++) {
	if (line.charAt(i) === "(") {
		count++;
	} else {
		count--;
	}
	if (count === -1) {
		pos = i + 1;
		break;
	}
}

console.log(pos);
