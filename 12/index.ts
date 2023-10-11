import * as fs from "fs";

const inputFile = "./12/input";

const lines = fs.readFileSync(inputFile, "utf8").split(/\r?\n/);

// TYPES & INTERFACES

interface Node {
	x: number;
	y: number;
	elevation: number;
	distance: number;
}

// PARSING

function toElevation(str: string): number {
	switch (str) {
		case "S":
			return 0;
		case "E":
			return 24;
		default:
			return str.charCodeAt(0) - 97;
	}
}
const field: Array<Array<Node>> = [];
lines.forEach((line, yIndex) => {
	field.push(
		Array.from(line).map((it, xIndex) => {
			return {
				x: xIndex,
				y: yIndex,
				elevation: toElevation(it),
				distance: Number.MAX_SAFE_INTEGER,
			};
		})
	);
});

function findSpecialField(str: string): Node {
	let specialField = field[0][0];
	lines.forEach((line, yIndex) => {
		Array.from(line).map((it, xIndex) => {
			if (it === str) {
				specialField = field[yIndex][xIndex];
			}
		});
	});
	return specialField;
}

let start: Node = findSpecialField("S");
start.distance = 0;
const end: Node = findSpecialField("E");

// PART 1

function findSurroundingNodes(node: Node): Array<Node> {
	const nodes = [];
	if (
		isInField(node.x + 1, node.y) &&
		canMove(node, field[node.y][node.x + 1])
	) {
		nodes.push(field[node.y][node.x + 1]);
	}
	if (
		isInField(node.x - 1, node.y) &&
		canMove(node, field[node.y][node.x - 1])
	) {
		nodes.push(field[node.y][node.x - 1]);
	}
	if (
		isInField(node.x, node.y + 1) &&
		canMove(node, field[node.y + 1][node.x])
	) {
		nodes.push(field[node.y + 1][node.x]);
	}
	if (
		isInField(node.x, node.y - 1) &&
		canMove(node, field[node.y - 1][node.x])
	) {
		nodes.push(field[node.y - 1][node.x]);
	}
	return nodes;
}

function isInField(x: number, y: number): boolean {
	return x >= 0 && x < field[0].length && y >= 0 && y < field.length;
}

function canMove(from: Node, to: Node): boolean {
	return from.elevation >= to.elevation || to.elevation - from.elevation === 1;
}

function findWayRec(current: Node, previous?: Node) {
	if (current === start && !previous) {
		findSurroundingNodes(current).forEach((node) => findWayRec(node, current));
	} else if (previous && previous.distance + 1 < current.distance) {
		current.distance = previous.distance + 1;
		if (current === end) {
			return;
		}
		findSurroundingNodes(current)
			.filter((it) => it !== previous)
			.forEach((node) => findWayRec(node, current));
	}
}

findWayRec(start);
console.log(end.distance);

// PART 2

function cleanUp() {
	field.forEach((line) =>
		line.forEach((it) => {
			it.distance = Number.MAX_SAFE_INTEGER;
		})
	);
}

function findWayRecWithStart(newStart: Node): number {
	cleanUp();
	start = newStart;
	start.distance = 0;
	findWayRec(newStart);
	return end.distance;
}

const result2: Array<number> = [];
field
	.flatMap((it) => it.filter((node) => node.elevation === 0))
	.forEach((it) => result2.push(findWayRecWithStart(it)));

console.log(Math.min(...result2));
