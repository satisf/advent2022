import * as fs from "fs";

const inputFile = "./7/input";

const lines = fs.readFileSync(inputFile, "utf8").split(/\r?\n/);

// INTERFACES AND TYPES

interface Files {
	[index: string]: number;
}
interface Directory {
	name: string;
	files: Files;
	subDirs: Array<Directory>;
	parent?: Directory;
	size: number;
	level: number;
}

// FUNCTIONS

function changeCurrentDirectory(target: string) {
	switch (target) {
		case "..": {
			currentDir = currentDir.parent!!;
			break;
		}
		case "/": {
			currentDir = root;
			break;
		}
		default: {
			currentDir = createDirectory(target, currentDir);
		}
	}
}

function createDirectory(name: string, parent: Directory): Directory {
	let newDir = currentDir.subDirs.find((dir) => dir.name === name);
	if (newDir === undefined) {
		newDir = {
			name,
			files: {},
			subDirs: [],
			parent,
			size: 0,
			level: parent.level + 1,
		};
		parent.subDirs.push(newDir);
		allDirs.push(newDir);
	}
	return newDir;
}

function createFile(name: string, size: number) {
	currentDir.files[name] = size;
}

function calculateSizeByLvl(dir: Directory) {
	dir.size =
		Object.values(dir.files).reduce((a, b) => a + b, 0) + // FILES
		dir.subDirs.map((subdir) => subdir.size).reduce((a, b) => a + b, 0); // SUB DIRECTORIES
}

// PARSING

const root: Directory = {
	name: "/",
	files: {},
	subDirs: [],
	parent: undefined,
	size: 0,
	level: 0,
};

const allDirs = [root];
let currentDir: Directory = root;

lines.forEach((line) => {
	let splitLine = line.split(" ");
	switch (splitLine[0]) {
		case "$": {
			if (splitLine[1] === "cd") changeCurrentDirectory(splitLine[2]);
			break;
		}
		case "dir": {
			createDirectory(splitLine[1], currentDir);
			break;
		}
		default: {
			createFile(splitLine[1], Number(splitLine[0]));
		}
	}
});

// CALCULATE SIZE

const maxLevel = Math.max(...allDirs.map((dir) => dir.level));

for (let currentLvl = maxLevel; currentLvl >= 0; currentLvl--) {
	allDirs
		.filter((dir) => dir.level === currentLvl)
		.forEach((dir) => {
			calculateSizeByLvl(dir);
		});
}

// RESULT 1

const result1 = allDirs
	.filter((dir) => dir.size <= 100000)
	.map((dir) => dir.size)
	.reduce((a, b) => a + b);

console.log(`result 1: ${result1}`);

// RESULT 2

const totalSpace = 70000000;
const requiredSpace = 30000000;
const freeSpace = totalSpace - root.size;
const result2 =
	Math.min(
		...allDirs
			.map((dir) => dir.size - requiredSpace + freeSpace)
			.filter((size) => size >= 0)
	) +
	requiredSpace -
	freeSpace;

console.log(`result 2: ${result2}`);
