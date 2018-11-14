import { window } from 'vscode';
import { getBoundaryLines, factTag } from './util';
import * as parse from 'csv-parse/lib/sync';

export async function createFactsFromTable () {
  let editor = window.activeTextEditor;
  if (!editor) {
    return;
  }

  const range = getBoundaryLines(editor);
  let facts: string;
  try {
    facts = factStringFromTable(editor.document.getText(range));
  } catch (error) {
    window.showErrorMessage(error.message);
    return;
  }

  editor.edit(edit => {
    edit.replace(range, facts.trim());
  });
}

export function factStringFromTable (csv: string) {
  const delimiter = guessDelimiter(csv);
  const [ headers, ...records ] = parse(csv, { delimiter });

  let facts = '';

  for (const [ subject, ...objects ] of records) {
    for (let i = 0; i < objects.length; i++) {
      const object = objects[i];
      const relationship = headers[i + 1];
      facts += factTag(subject, relationship, object) + '\n';
    }
  }

  return facts;
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
  if (typeof maxChar === 'undefined') {
    throw new Error('Could not detect delimiter in CSV');
  }
  return maxChar;
}
