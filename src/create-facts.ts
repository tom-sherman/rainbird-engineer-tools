'use strict';

import { getBoundaryLines } from './util';
import { Position, Range, window } from 'vscode';

export async function createFacts () {
  let editor = window.activeTextEditor;
  if (!editor) {
    return;
  }

  const { startLine, endLine } = getBoundaryLines(editor);
  const range = new Range(
    new Position(startLine, 0),
    new Position(endLine, Number.MAX_SAFE_INTEGER)
  );

  const relationship = await window.showInputBox({
    placeHolder: 'Relationship name'
  });

  if (!relationship) {
    return;
  }
  const text = editor.document.getText(range);
  const minIndent = getMinIndent(text);
  let facts = minIndent;

  for (const [ subject, objects ] of parseFacts(text).entries()) {
    objects.forEach(object => {
      facts = `${ facts }${ minIndent }<relinst subject="${ subject }" object="${ object }" type="${ relationship }" cf="100" />\n`;
    });
  }

  editor.edit(edit => {
    edit.replace(range, facts);
  });
}

/**
 * Takes a list of subjects with their objects nested inside like so:
 * David
 *     Spanish
 *     English
 * Tom
 *     English
 *
 * This will create 3 facts in a Map of Map<subject, object[]>
 */
export function parseFacts (text: string) {
  const minIndent = getMinIndent(text);
  text = text.split('\n')
    .map(line => line.replace(minIndent, ''))
    .join('\n');

  const factMap: Map<string, string[]> = new Map();
  let currentSubject: string = '';
  const reObject = /(?:\t+|(?: {2}))\w+/;

  text.split('\n').forEach(line => {
    if (line.match(reObject) && currentSubject.length) {
      const currentObjects = factMap.get(currentSubject);

      if (factMap.has(currentSubject) && typeof currentObjects !== 'undefined') {
        currentObjects.push(line.trim());
      } else {
        factMap.set(currentSubject, [ line.trim() ]);
      }
    } else {
      currentSubject = line.trim();
    }
  });

  return factMap;
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
