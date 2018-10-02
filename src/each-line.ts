'use strict';
import { TextEditor } from "vscode";

export function *eachLine (editor: TextEditor) {
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
