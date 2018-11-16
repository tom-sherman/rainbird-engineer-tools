'use strict';
import { window } from 'vscode';
import { eachLine, getBoundaryLines, getMinIndent } from './util';

export async function createConcinsts () {
  let editor = window.activeTextEditor;
  if (!editor) {
    return;
  }

  const conceptType = await window.showInputBox({
    placeHolder: 'Concept type'
  });

  if (typeof conceptType !== 'string' || conceptType === '') {
    window.showErrorMessage('Please enter a Concept name.');
    return;
  }

  const minIndent = getMinIndent(editor.document.getText(getBoundaryLines(editor)));

  editor.edit(edit => {
    if (!editor) {
      return;
    }

    for (const { range, text } of eachLine(editor)) {
      edit.replace(range, `${ minIndent }<concinst name="${ text.trim() }" type="${ conceptType.trim() }" />`);
    }
  });
}
