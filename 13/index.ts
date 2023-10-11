import * as fs from "fs";

const inputFile = "./13/input";

const lines = fs.readFileSync(inputFile, "utf8").split(/\r?\n/);

// TYPES & INTERFACES

type SignalPart = number | Array<SignalPart>;
type Signal = Array<SignalPart>;
interface SignalPair {
	first: Signal;
	second: Signal;
}

enum Result {
	IN_ORDER,
	UNDECIDED,
	NOT_IN_ORDER,
}

// PARSING

const signals: Array<SignalPair> = [];

lines
	.filter((it) => it !== "")
	.forEach((line, index, array) => {
		if (index % 2 === 0) {
			signals.push({
				first: JSON.parse(line) as Signal,
				second: JSON.parse(array[index + 1]) as Signal,
			});
		}
	});

// PART 1

function compare(left: SignalPart, right: SignalPart): Result {
	if (Array.isArray(left) && Array.isArray(right)) {
		for (let i = 0; i < Math.min(left.length, right.length); i++) {
			let res = compare(left[i], right[i]);
			if (res !== Result.UNDECIDED) {
				return res;
			}
		}
		if (left.length === right.length) {
			return Result.UNDECIDED;
		}
		return left.length < right.length ? Result.IN_ORDER : Result.NOT_IN_ORDER;
	} else if (Array.isArray(left) && !Array.isArray(right)) {
		return compare(left, [right]);
	} else if (!Array.isArray(left) && Array.isArray(right)) {
		return compare([left], right);
	}

	if (left === right) {
		return Result.UNDECIDED;
	}
	return left < right ? Result.IN_ORDER : Result.NOT_IN_ORDER;
}

let result1 = 0;
signals.forEach((signal, index) => {
	let res = compare(signal.first, signal.second);
	if (res !== Result.NOT_IN_ORDER) {
		result1 += 1 + index;
	}
});

console.log(result1);

// PART 2

const divider1 = [[2]] as SignalPart;
const divider2 = [[6]] as SignalPart;
const signalsToSort: Array<SignalPart> = lines
	.filter((it) => it !== "")
	.map((line) => JSON.parse(line));

signalsToSort.push(divider1);
signalsToSort.push(divider2);

function compareSignals(left: SignalPart, right: SignalPart): number {
	if (Array.isArray(left) && Array.isArray(right)) {
		for (let i = 0; i < Math.min(left.length, right.length); i++) {
			let res = compareSignals(left[i], right[i]);
			if (res !== 0) {
				return res;
			}
		}
		return left.length - right.length;
	} else if (Array.isArray(left) && !Array.isArray(right)) {
		return compareSignals(left, [right]);
	} else if (!Array.isArray(left) && Array.isArray(right)) {
		return compareSignals([left], right);
	}

	return (left as number) - (right as number);
}

const sortedSignals = signalsToSort.sort(compareSignals);
const result2 =
	(sortedSignals.findIndex((it) => it === divider1) + 1) *
	(sortedSignals.findIndex((it) => it === divider2) + 1);
console.log(result2);
