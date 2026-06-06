const vfs = new VirtualFileSystem();
const inputField = document.getElementById('input');
const outputArea = document.getElementById('output');
const commandHistory = [];
let historyIndex = -1;

document.querySelector('.terminal').addEventListener('click', function() {
    const standardTextSelection = window.getSelection().toString();
    if (!standardTextSelection) {
        inputField.focus();
    }
});

inputField.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        const command = inputField.value;
        if (command) {
            commandHistory.push(command);
        }
        historyIndex = commandHistory.length;
        outputArea.innerHTML += `<div>simTerm@Your-Computer ${vfs.pwd()} % ${command}</div>`;
        processCommand(command);
        inputField.value = '';
        outputArea.scrollTop = outputArea.scrollHeight;
    }
});

inputField.addEventListener('keydown', function (e) {
    if (commandHistory.length === 0) return;

    if (e.key === 'ArrowUp') {
        e.preventDefault(); 
        
        if (historyIndex > 0) {
            historyIndex--;
        } else if (historyIndex === -1) {
            historyIndex = commandHistory.length - 1;
        }
        
        inputField.value = commandHistory[historyIndex];
    }
    if (e.key === 'ArrowDown') {
        e.preventDefault();

        
        if (historyIndex < commandHistory.length - 1 && historyIndex !== -1) {
            historyIndex++;
            inputField.value = commandHistory[historyIndex];
        } else {
            
            historyIndex = commandHistory.length;
            inputField.value = '';
        }
    }
});

function processCommand(command) {
    const parsedCommand = parser(command);
    let response;
    
    switch (parsedCommand[0]) {
        case '-h':
            response = 'Available commands: -h, -a, clear, ls, pwd, cd, mkdir, touch, cat, echo';
            break;
        case 'clear':
            outputArea.innerHTML = '';
            return;
        case '-a':
            response = 'This is a simulated terminal built with HTML and JavaScript.';
            break;
        case 'echo':
            response = commandParam(parsedCommand);
            break;
        case 'ls':
            response = vfs.ls();
            break;
        case 'pwd':
            response = vfs.pwd();
            break;
        case 'cd':
            response = vfs.cd(commandParam(parsedCommand));
            updatePrompt();
            break;
        case 'mkdir':
            response = vfs.mkdir(commandParam(parsedCommand));
            break;
        case 'touch':
            response = vfs.touch(parsedCommand[1], parsedCommand.slice(2).join(' '));
            break;
        case 'cat':
            response = vfs.cat(commandParam(parsedCommand));
            break;
        default:
            response = `command not found: ${parsedCommand[0]}`;
    }

    if (response !== null && response !== undefined && response !== '') {
        outputArea.innerHTML += `<div>${response}</div>`;
    }
}

// Helper Functions
function commandParam(command) {
    return command.slice(1).join(' ');
}

function parser(command) {
    return command.split(" ");
}

function updatePrompt() {
    document.getElementById('prompt').textContent = `simTerm@Your-Computer ${vfs.pwd()} % `;
}