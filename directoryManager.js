class Directory {
    constructor(name) {
        this.name = name;
        this.children = {};
        this.parent = null;
    }
}

class DirectoryManager {
    constructor() {
        this.root = new Directory("");
    }

    createDirectory(path) {
        const directories = path.split("/");
        let currentDirectory = this.root;

        for (const directory of directories) {
            if (!directory) continue;

            if (!currentDirectory.children[directory]) {
                const newDirectory = new Directory(directory);
                newDirectory.parent = currentDirectory;
                currentDirectory.children[directory] = newDirectory;
            }

            currentDirectory = currentDirectory.children[directory];
        }
    }

    moveDirectory(sourcePath, destinationPath) {
        const sourceDirectories = sourcePath.split("/");
        const destinationDirectories = destinationPath.split("/");

        let currentDirectory = this.root;

        for (const directory of sourceDirectories) {
            if (!directory) continue;

            if (!currentDirectory.children[directory]) {
                console.log(`Cannot move ${sourcePath} - ${directory} does not exist`);
                return;
            }

            currentDirectory = currentDirectory.children[directory];
        }

        let destinationDirectory = this.root;

        for (const directory of destinationDirectories) {
            if (!directory) continue;

            if (!destinationDirectory.children[directory]) {
                const newDirectory = new Directory(directory);
                newDirectory.parent = destinationDirectory;
                destinationDirectory.children[directory] = newDirectory;
            }

            destinationDirectory = destinationDirectory.children[directory];
        }

        delete currentDirectory.parent.children[currentDirectory.name];
        destinationDirectory.children[currentDirectory.name] = currentDirectory;
        currentDirectory.parent = destinationDirectory;
    }

deleteDirectory(path) {
    const directories = path.split("/");
    let currentDirectory = this.root;


    for (const directory of directories.slice(0, -1)) {
        if (!directory) continue;

        if (!currentDirectory.children[directory]) {
            console.log(`Cannot delete ${path} - ${directory} does not exist`);
            return;
        }

        currentDirectory = currentDirectory.children[directory];
    }


    const targetDirectory = directories[directories.length - 1];
    if (!currentDirectory.children[targetDirectory]) {
        console.log(`Cannot delete ${path} - ${targetDirectory} does not exist`);
        return;
    }


    delete currentDirectory.children[targetDirectory];
}


    listDirectories() {
        this._listDirectoriesHelper(this.root, 0);
    }

_listDirectoriesHelper(directory, depth) {
    const sortedChildren = Object.values(directory.children).sort((a, b) => a.name.localeCompare(b.name));
    
    console.log(" ".repeat(depth * 2) + directory.name);
    for (const child of sortedChildren) {
        this._listDirectoriesHelper(child, depth + 1);
    }
}

    processCommands(commands) {
    for (const command of commands) {
        console.log(command);
        const [action, ...args] = command.split(" ");
        switch (action) {
            case "CREATE":
                this.createDirectory(args.join(" "));
                break;
            case "MOVE":
                this.moveDirectory(args[0], args[1]);
                break;
            case "DELETE":
                this.deleteDirectory(args[0]);
                break;
            case "LIST":
                this.listDirectories();
                break;
            default:
                console.log("Invalid command:", action);
        }
    }
}

}

// Sample input commands
const inputCommands = [
    "CREATE fruits",
    "CREATE vegetables",
    "CREATE grains",
    "CREATE fruits/apples",
    "CREATE fruits/apples/fuji",
    "LIST",
    "CREATE grains/squash",
    "MOVE grains/squash vegetables",
    "CREATE foods",
    "MOVE grains foods",
    "MOVE fruits foods",
    "MOVE vegetables foods",
    "LIST",
    "DELETE fruits/apples",
    "DELETE foods/fruits/apples",
    "LIST"
];

// Initialize DirectoryManager to process the sample input commands.
const directoryManager = new DirectoryManager();
directoryManager.processCommands(inputCommands);