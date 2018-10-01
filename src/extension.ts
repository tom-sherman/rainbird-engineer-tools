'use strict';
import * as vscode from 'vscode';

export function activate (context: vscode.ExtensionContext) {
    let concInsts = vscode.commands.registerCommand('extension.concInsts', async () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let conceptType = await vscode.window.showInputBox({
            placeHolder: 'Concept type'
        });

        editor.edit(edit => {
            if (!editor) {
                return;
            }
            for (const line of eachLine(editor)) {
                const name = line.text;
                edit.replace(line.range, `<concinst name="${ name }" type="${ conceptType }" />`);
            }
        });
    });

    context.subscriptions.push(concInsts);
}

function *eachLine (editor: vscode.TextEditor) {
    const startLine = Math.min(editor.selection.anchor.line, editor.selection.active.line);
    const endLine = Math.max(editor.selection.anchor.line, editor.selection.active.line);

    for (let index = startLine; index <= endLine; index++) {
        let range = editor.document.lineAt(index).range;
        let text = editor.document.getText(range);
        if (text.length) {
            yield { range, text };
        }
    }
}

// this method is called when your extension is deactivated
export function deactivate () {
}
