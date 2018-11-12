'use strict';
import { window } from 'vscode';
import { eachLine } from './util';

export async function createConcinsts () {
  let editor = window.activeTextEditor;
  if (!editor) {
    return;
  }

  let conceptType = await window.showInputBox({
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
}
