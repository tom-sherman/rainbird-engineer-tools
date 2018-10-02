'use strict';
import { commands, window, ExtensionContext } from "vscode";
import { createConcinsts } from "./create-concinsts";

export function activate (context: ExtensionContext) {
    context.subscriptions.push(commands.registerCommand('extension.rbTools', async () => {
        const options: { [key: string]: (context: ExtensionContext) => Promise<void> } = {
            createConcinsts
        };

        const quickPick = window.createQuickPick();
        quickPick.items = Object.keys(options).map(label => ({ label }));

        quickPick.onDidChangeSelection(selection => {
            if (selection[0]) {
                options[selection[0].label](context)
                    .catch(console.error);
            }
        });

        quickPick.onDidHide(() => quickPick.dispose());

        quickPick.show();
    }));
}

// this method is called when your extension is deactivated
export function deactivate () {
}
