'use strict';
import { TextEditor } from 'vscode';

export function *eachLine (editor: TextEditor) {
  const { startLine, endLine } = getBoundaryLines(editor);

  for (let index = startLine; index <= endLine; index++) {
    let range = editor.document.lineAt(index).range;
    let text = editor.document.getText(range);

    if (text.length) {
      yield { range, text };
    }
  }
}

export function getBoundaryLines (editor: TextEditor) {
  return {
    startLine: Math.min(editor.selection.anchor.line, editor.selection.active.line),
    endLine: Math.max(editor.selection.anchor.line, editor.selection.active.line)
  };
}

export function getMinIndent (text: string) {
  let tabIndents: boolean = true;

  const nonEmptyLines = text.split('\n').filter(line => line.trim().length > 0);

  const lineIndents = nonEmptyLines.map(line => {
    const matches = line.match(/^(?:(\t)|( +))[\w\s]+$/);

    if (matches && matches[1]) {
      tabIndents = true;
      return matches[1].length;
    } else if (matches && matches[2]) {
      tabIndents = false;
      return matches[2].length;
    } else {
      return 0;
    }
  });

  return (tabIndents ? '\t' : ' ').repeat(Math.min(...lineIndents));
}
