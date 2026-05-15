"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");
const cp = require("child_process");
let outputChannel;
function getOutput() {
    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel('Liquid Builder');
    }
    return outputChannel;
}
function run(label, args) {
    const cwd = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!cwd) {
        vscode.window.showErrorMessage('No workspace folder found.');
        return;
    }
    const out = getOutput();
    out.appendLine(`\n▶ ${label}`);
    vscode.window.withProgress({ location: vscode.ProgressLocation.Window, title: `Liquid: ${label}` }, () => new Promise((resolve) => {
        const proc = cp.spawn('npm', ['run', ...args], {
            cwd,
            shell: true,
            windowsHide: true,
        });
        proc.stdout.on('data', (d) => out.append(d.toString()));
        proc.stderr.on('data', (d) => out.append(d.toString()));
        proc.on('close', (code) => {
            if (code === 0) {
                vscode.window.showInformationMessage(`✓ ${label}`);
            }
            else {
                vscode.window.showErrorMessage(`✗ ${label} falhou — Output > Liquid Builder`);
                out.show(true);
            }
            resolve();
        });
    }));
}
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('liquid-injector.buildCurrent', () => {
        const filePath = vscode.window.activeTextEditor?.document.uri.fsPath;
        if (!filePath)
            return;
        const match = filePath.match(/src[/\\]components[/\\]([^/\\]+)/);
        if (!match) {
            vscode.window.showWarningMessage('File não está em src/components/');
            return;
        }
        run(`Build ${match[1]}`, ['build', '--', match[1]]);
    }), vscode.commands.registerCommand('liquid-injector.buildTypes', () => {
        run('Build Types', ['build:types']);
    }), vscode.commands.registerCommand('liquid-injector.buildAll', () => {
        run('Build All', ['build']);
    }));
}
function deactivate() {
    outputChannel?.dispose();
}
//# sourceMappingURL=extension.js.map