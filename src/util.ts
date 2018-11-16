'use strict';
import { TextEditor, Range, Position } from 'vscode';

export function *eachLine (editor: TextEditor) {
  const range = getBoundaryLines(editor);

  for (let index = range.start.line; index <= range.end.line; index++) {
    let range = editor.document.lineAt(index).range;
    let text = editor.document.getText(range);

    if (text.length) {
      yield { range, text };
    }
  }
}

export function getBoundaryLines (editor: TextEditor) {
    const startLine = Math.min(editor.selection.anchor.line, editor.selection.active.line);
    const endLine = Math.max(editor.selection.anchor.line, editor.selection.active.line);
    return new Range(
      new Position(startLine, 0),
      new Position(endLine, Number.MAX_SAFE_INTEGER)
    );
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

export function factTag (subject: string, relationship: string, object: string) {
  return `<relinst type="${ relationship }" subject="${ subject }" object="${ object }" cf="100" />`;
}
