class FSNode {
    constructor(name, isDirectory = false) {
        this.name = name;
        this.isDirectory = isDirectory;
        this.content = isDirectory ? null : "";
        this.children = isDirectory ? {} : null;
    }
}

class VirtualFileSystem {
    constructor() {
        this.root = new FSNode("~", true);
        this.currentPath = [this.root]
        
    }

    get currentDirectory() {
        return this.currentPath[this.currentPath.length - 1]
    }

    pwd() {
        if (this.currentPath.length === 1) return "~";
        return this.currentPath.map(node => node.name).join("/").replace("//", "/");
    }

    ls() {
        const keys = Object.keys(this.currentDirectory.children);
        if (keys.length === 0) {
            return '';
        }
        return keys.map(name => {
            const node = this.currentDirectory.children[name];
            return `${name}`;
        }).join('<br>');
    }

    mkdir(name) {
        if (this.currentDirectory.children[name]) {
            return `Error: '${name}' already exists.`;
        }
        this.currentDirectory.children[name] = new FSNode(name, true);
        return undefined;
    }

    touch(name, content = "") {
        if (this.currentDirectory.children[name]) {
            return `Error: '${name}' already exists.`;
        }
        const newFile = new FSNode(name, false);
        newFile.content = content;
        this.currentDirectory.children[name] = newFile;
        return undefined;
    }

    cd(path) {
        if (path === "/") {
            this.currentPath = [this.root];
            return undefined;
        }

        if (path === "..") {
            if (this.currentPath.length > 1) {
                this.currentPath.pop();
            }
            return undefined;
        }

        const targetNode = this.currentDirectory.children[path];

        if (!targetNode) {
            return `Error: Directory '${path}' not found.`;
        }

        if (!targetNode.isDirectory) {
            return `Error: '${path}' is a file, not a directory.`;
        }

        this.currentPath.push(targetNode);
        return undefined;
    }

    cat(fileName) {
        const node = this.currentDirectory.children[fileName];
        if (!node) {
            return `Error: File '${fileName}' not found.`;
        }
        if (node.isDirectory) {
            return `Error: '${fileName}' is a directory.`;
        }
        return node.content;
    }
}