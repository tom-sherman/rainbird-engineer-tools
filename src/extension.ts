'use strict';
import { commands, window, ExtensionContext } from 'vscode';
import { createConcinsts } from './create-concinsts';
import { createFacts } from './create-facts';
import { createFactsFromTable } from './create-facts-from-table';

export function activate (context: ExtensionContext) {
  context.subscriptions.push(commands.registerCommand('extension.rbTools', async () => {
    const options: { [key: string]: (context: ExtensionContext) => Promise<void> } = {
      createConcinsts,
      createFacts,
      createFactsFromTable
    };

    const quickPick = window.createQuickPick();
    quickPick.items = Object.keys(options).map(label => ({ label }));

    quickPick.onDidChangeSelection(async selection => {
      if (selection[0]) {
        try {
          await options[selection[0].label](context);
          quickPick.hide();
        } catch (error) {
          console.error(error);
        }
      }
    });

    quickPick.onDidHide(() => quickPick.dispose());

    quickPick.show();
  }));
}

// this method is called when your extension is deactivated
export function deactivate () {
  return;
}
