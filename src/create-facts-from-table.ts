import { window } from 'vscode';
import { getBoundaryLines, factTag } from './util';
import * as parse from 'csv-parse/lib/sync';

export async function createFactsFromTable () {
  let editor = window.activeTextEditor;
  if (!editor) {
    return;
  }

  const range = getBoundaryLines(editor);
  let text = editor.document.getText(range);

  const delimiter = guessDelimiter(text);
  if (typeof delimiter === 'undefined') {
    await window.showErrorMessage('Could not detect delimiter in CSV');
    return;
  }

  const [ headers, ...records ] = parse(text, { delimiter });

  let facts = '';

  for (const [ subject, ...objects ] of records) {
    for (let i = 0; i < objects.length; i++) {
      const object = objects[i];
      const relationship = headers[i + 1];
      facts += factTag(subject, relationship, object) + '\n';
    }
  }

  editor.edit(edit => {
    // edit.delete(range);
    edit.replace(range, facts.trim());
  });
}

export function guessDelimiter (csv: string) {
  const text = csv.split('\n')[0];
  const itemCount: { [x: string]: number } = {};

  [',', ';', '\t', '|'].forEach(delimiter => {
    itemCount[delimiter] = 0;
  });

  let ignoreString = false;
  let maxValue = 0;
  let maxChar;
  let currValue;
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '"') {
      ignoreString = !ignoreString;
    } else if (!ignoreString && text[i] in itemCount) {
      currValue = ++itemCount[text[i]];
      if (currValue > maxValue) {
        maxValue = currValue;
        maxChar = text[i];
      }
    }
  }
  return maxChar;
}
