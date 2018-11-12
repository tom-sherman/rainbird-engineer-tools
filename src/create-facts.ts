'use strict';

import { getBoundaryLines, getMinIndent, factTag } from './util';
import { Position, Range, window } from 'vscode';

export async function createFacts () {
  let editor = window.activeTextEditor;
  if (!editor) {
    return;
  }

  const range = getBoundaryLines(editor);

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
      facts = `${ facts }${ minIndent }${ factTag(subject, relationship, object) }\n`;
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
