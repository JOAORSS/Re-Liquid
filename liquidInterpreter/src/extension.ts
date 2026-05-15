import * as vscode from 'vscode';
import * as cp from 'child_process';

let outputChannel: vscode.OutputChannel | undefined;

function getOutput(): vscode.OutputChannel {
    if (!outputChannel) {
        outputChannel = vscode.window.createOutputChannel('Liquid Builder');
    }
    return outputChannel;
}

function run(label: string, args: string[]) {
    const cwd = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!cwd) {
        vscode.window.showErrorMessage('No workspace folder found.');
        return;
    }

    const out = getOutput();
    out.appendLine(`\n▶ ${label}`);

    vscode.window.withProgress(
        { location: vscode.ProgressLocation.Window, title: `Liquid: ${label}` },
        () => new Promise<void>((resolve) => {
            const proc = cp.spawn('npm', ['run', ...args], {
                cwd,
                shell: true,
                windowsHide: true,
            });

            proc.stdout.on('data', (d: Buffer) => out.append(d.toString()));
            proc.stderr.on('data', (d: Buffer) => out.append(d.toString()));

            proc.on('close', (code: number) => {
                if (code === 0) {
                    vscode.window.showInformationMessage(`✓ ${label}`);
                } else {
                    vscode.window.showErrorMessage(`✗ ${label} falhou — Output > Liquid Builder`);
                    out.show(true);
                }
                resolve();
            });
        })
    );
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('liquid-injector.buildCurrent', () => {
            const filePath = vscode.window.activeTextEditor?.document.uri.fsPath;
            if (!filePath) return;

            const match = filePath.match(/src[/\\]components[/\\]([^/\\]+)/);
            if (!match) {
                vscode.window.showWarningMessage('File não está em src/components/');
                return;
            }

            run(`Build ${match[1]}`, ['build', '--', match[1]]);
        }),

        vscode.commands.registerCommand('liquid-injector.buildTypes', () => {
            run('Build Types', ['build:types']);
        }),

        vscode.commands.registerCommand('liquid-injector.buildAll', () => {
            run('Build All', ['build']);
        })
    );
}

export function deactivate() {
    outputChannel?.dispose();
}
