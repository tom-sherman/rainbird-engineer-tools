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

  let relationship = await window.showInputBox({
      placeHolder: 'Relationship name'
  });

  let facts = '';
  for (const [ subject, objects ] of parseFacts(editor.document.getText(range)).entries()) {
    objects.forEach(object => {
      facts = `${ facts }\n<relinst subject="${ subject }" object="${ object.trim() }" rel="${ relationship }" />`;
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
function parseFacts (text: string) {
  const factMap: Map<string, string[]> = new Map();
  let currentSubject: string = '';
  const reObject = /(?:\t| {2})\w+/;

  for (const line of text.split('\n')) {
    if (line.match(reObject) && currentSubject.length) {
      const currentObjects = factMap.get(currentSubject);

      if (factMap.has(currentSubject) && typeof currentObjects !== 'undefined') {
        currentObjects.push(line);
      } else {
        factMap.set(currentSubject, [ line ]);
      }
    } else {
      currentSubject = line;
    }
  }
  return factMap;
}
