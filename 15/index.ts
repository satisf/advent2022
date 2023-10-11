import * as fs from "fs";

const inputFile = "./15/input";

const lines = fs.readFileSync(inputFile, "utf8").split(/\r?\n/);

// TYPES & INTERFACES

type Position = {
	x: number;
	y: number;
};

type Sensor = {
	position: Position;
	beacon: Position;
};

type Range = {
	from: number;
	to: number;
	applicable: boolean;
};

// PARSING

function parsePositionFromString(str: string): Position {
	const numbers = str.match(/\d+/g);
	return {
		x: Number(numbers!![0]),
		y: Number(numbers!![1]),
	};
}

const sensors: Array<Sensor> = [];

lines.forEach((line) => {
	const splitLine = line.split(":");
	sensors.push({
		position: parsePositionFromString(splitLine[0]),
		beacon: parsePositionFromString(splitLine[1]),
	});
});

// PART 1

function calculateManhattanDistance(a: Position, b: Position): number {
	return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

function blockedPositionsBySensorInLine(
	sensor: Sensor,
	line: number
): Array<number> {
	const manhattanDistance = calculateManhattanDistance(
		sensor.position,
		sensor.beacon
	);
	const distanceToLine = Math.abs(sensor.position.y - line);
	const xRange = manhattanDistance - distanceToLine;
	const amountOfBlockedPositions = xRange * 2 + 1;
	const result =
		xRange >= 0
			? Array(amountOfBlockedPositions)
					.fill(0)
					.map((_, index) => {
						return sensor.position.x - xRange + index;
					})
			: [];
	return result;
}

function sensorsAndBeaconsInLine(
	sensors: Array<Sensor>,
	line: number
): Set<number> {
	return new Set(
		sensors.flatMap((sensor) => {
			const result = [];
			if (sensor.position.y === line) result.push(sensor.position.x);
			if (sensor.beacon.y === line) result.push(sensor.beacon.x);
			return result;
		})
	);
}

function removeFromSet(set: Set<number>, remove: Set<number>): Set<number> {
	return new Set(Array.from(set).filter((it) => !remove.has(it)));
}

const rowRes1 = 2000000;
const blockedPositions: Set<number> = new Set(
	sensors.flatMap((sensor) => blockedPositionsBySensorInLine(sensor, rowRes1))
);
const blockedWithoutSensorsAndBeacons = removeFromSet(
	blockedPositions,
	sensorsAndBeaconsInLine(sensors, rowRes1)
);

console.log(blockedWithoutSensorsAndBeacons.size);

// PART 2

function applyBoundary(num: number): number {
	if (num < 0) return 0;
	if (num > 4000000) return 4000000;
	return num;
}

function blockedRangeBySensorInLine(sensor: Sensor, line: number): Range {
	const manhattanDistance = calculateManhattanDistance(
		sensor.position,
		sensor.beacon
	);
	const distanceToLine = Math.abs(sensor.position.y - line);
	const xRange = manhattanDistance - distanceToLine;
	const result =
		xRange >= 0
			? {
					from: applyBoundary(sensor.position.x - xRange),
					to: applyBoundary(sensor.position.x + xRange),
					applicable: true,
			  }
			: { from: 0, to: 0, applicable: false };
	return result;
}

function rangesDoOverlap(ranges: Array<Range>): boolean {
	let start = ranges[0].from;
	let end = ranges[0].to;
	ranges.forEach((range) => {
		if (range.from < start) {
			start = range.from;
		}
		if (range.from <= end && range.to > end) {
			end = range.to;
		}
	});
	const result = start === 0 && end === 4000000;
	if (!result) {
		// console.log(ranges);
		console.log(`zusammengefasst: von ${start} bis ${end}`);
	}
	return result;
}

for (let y = 0; y <= 4000000; y++) {
	const xRanges = sensors
		.map((sensor) => blockedRangeBySensorInLine(sensor, y))
		.sort((a, b) => a.from - b.from);
	const blocked = xRanges
		.filter((it) => it.applicable)
		.sort((a, b) => a.from - b.from);
	const rangesOverlap = rangesDoOverlap(blocked);

	if (!rangesOverlap) {
		console.log(xRanges);
		console.log(`now in line ${y}`);
	}

	// if (result2 > -1) {
	// 	console.log(blocked);
	// 	console.log(result2);
	// 	console.log(y);
	// 	console.log(`${result2 * 4000000 + y}`);
	// }
}
