import * as fs from "fs";

const inputFile = "./14/input";

const lines = fs.readFileSync(inputFile, "utf8").split(/\r?\n/);

// TYPES & INTERFACES

type Position = {
	x: number;
	y: number;
};

enum Content {
	AIR = " ",
	ROCK = "#",
	MOVING_SAND = "~",
	RESTING_SAND = "o",
}

type Tile = {
	position: Position;
	content: Content;
};

type Sand = {
	position: Position;
	isResting: boolean;
};

// PARSING

const structures: Array<Array<Position>> = [];

lines.forEach((line) => {
	structures.push(
		line.split(" -> ").map((it) => {
			const coords = it.split(",");
			return { x: Number(coords[0]), y: Number(coords[1]) };
		})
	);
});

structures.push([
	{ x: 310, y: 155 },
	{ x: 666, y: 155 },
]);

function findMaxMapSize(): Position {
	return {
		x: Math.max(
			...structures.flatMap((structure) => structure.map((pos) => pos.x))
		),
		y: Math.max(
			...structures.flatMap((structure) => structure.map((pos) => pos.y))
		),
	};
}
function findMinMapSize(): Position {
	return {
		x: Math.min(
			...structures.flatMap((structure) => structure.map((pos) => pos.x))
		),
		y: Math.min(
			...structures.flatMap((structure) => structure.map((pos) => pos.y))
		),
	};
}

const maxMapSize: Position = findMaxMapSize();
const minMapSize: Position = findMinMapSize();

const map: Array<Array<Tile>> = [];

for (let y = 0; y <= maxMapSize.y + 1; y++) {
	map[y] = [];
	for (let x = minMapSize.x; x <= maxMapSize.x + 1; x++) {
		map[y].push({ position: { x, y }, content: Content.AIR });
	}
}

function paintMap() {
	map.forEach((line) => {
		console.log(line.map((it) => it.content).join(""));
	});
}

function get(pos: Position): Tile {
	return map[pos.y][pos.x - minMapSize.x];
}

function paintStructures() {
	structures.forEach((structure) => paintStructure(structure));
}

function paintStructure(structure: Array<Position>) {
	structure.forEach((pos, index) => {
		if (index < structure.length - 1) {
			paintLine(pos, structure[index + 1]);
		}
	});
}

function paintLine(from: Position, to: Position) {
	if (from.x === to.x) {
		paintVertical(from, to);
	} else if (from.y === to.y) {
		paintHorizontal(from, to);
	} else console.log("there are diagonal structures");
}
function paintVertical(from: Position, to: Position) {
	if (from.y < to.y) {
		for (let i = from.y; i <= to.y; i++) {
			get({ x: from.x, y: i }).content = Content.ROCK;
		}
	} else {
		paintVertical(to, from);
	}
}

function paintHorizontal(from: Position, to: Position) {
	if (from.x < to.x) {
		for (let i = from.x; i <= to.x; i++) {
			get({ x: i, y: from.y }).content = Content.ROCK;
		}
	} else {
		paintHorizontal(to, from);
	}
}

paintStructures();

const sand: Array<Sand> = [];

function produceSand() {
	const generatigTile = get({ x: 500, y: 0 });
	if (generatigTile.content == Content.AIR) {
		sand.push({ position: { x: 500, y: 0 }, isResting: false });
		get({ x: 500, y: 0 }).content = Content.MOVING_SAND;
	} else if (generatigTile.content === Content.RESTING_SAND) {
		stopIt = true;
	}
}

function moveSand(sand: Sand) {
	if (sand.position.y === maxMapSize.y) {
		stopIt = true;
	}
	if (!isTileBlocked({ x: sand.position.x, y: sand.position.y + 1 })) {
		get(sand.position).content = Content.AIR;
		sand.position.y++;
		get(sand.position).content = Content.MOVING_SAND;
	} else if (
		!isTileBlocked({ x: sand.position.x - 1, y: sand.position.y + 1 })
	) {
		get(sand.position).content = Content.AIR;
		sand.position.y++;
		sand.position.x--;
		get(sand.position).content = Content.MOVING_SAND;
	} else if (
		!isTileBlocked({ x: sand.position.x + 1, y: sand.position.y + 1 })
	) {
		get(sand.position).content = Content.AIR;
		sand.position.y++;
		sand.position.x++;
		get(sand.position).content = Content.MOVING_SAND;
	} else {
		sand.isResting = true;
		get(sand.position).content = Content.RESTING_SAND;
	}
}

function isTileBlocked(pos: Position): boolean {
	// console.log(`checking tile ${pos.x},${pos.y}`);
	return get(pos).content !== Content.AIR;
}

function makeSandCycle() {
	sand
		.filter((it) => it.isResting === false)
		.forEach((it) => {
			moveSand(it);
		});
	produceSand();
}

let stopIt = false;
while (!stopIt) {
	makeSandCycle();
}
paintMap();
console.log(`result1: ${sand.filter((it) => it.isResting === true).length}`);
