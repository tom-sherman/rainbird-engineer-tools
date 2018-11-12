import * as assert from 'assert';
import { getMinIndent, parseFacts } from '../create-facts';

suite('Command :: Create facts', function () {
  test('gets correct min indent', function () {
    let indentDict = {
      '0 indent\n    4 spaces\n  2 spaces': '',
      ' 1 space\n0 space\n    4 spaces': '',
      '    4 spaces\n      6 spaces': '    ',
      '\t1 tab\n0 tabs': '',
      '\t\t2 tabs\n\t1 tab\n0 tabs': '',
      '\t1 tab\n\t\t2 tabs\n\t\t2 tabs': '\t'
    };

    for (const [ str, indent ] of Object.entries(indentDict)) {
      const minIndent = getMinIndent(str);
      assert.equal(minIndent, indent);
    }
  });

  test('parses facts', function () {
    const facts1 = parseFacts('tom\n'
                            + '  english\n'
                            + '  spanish\n'
                            + 'dave\n'
                            + '  welsh');
    const facts2 = parseFacts('  tom\n'
                            + '    english\n'
                            + '    spanish\n'
                            + '  dave\n'
                            + '    welsh');
    assert.equal(facts1.size, 2);
    assert.equal(facts2.size, 2);
    assert.equal(facts1.get('tom')!.join(' '), 'english spanish');
    assert.equal(facts2.get('tom')!.join(' '), 'english spanish');
    assert.equal(facts1.get('dave')!.join(' '), 'welsh');
    assert.equal(facts2.get('dave')!.join(' '), 'welsh');

    const facts3 = parseFacts('tom\n'
                            + '  english');
    assert.equal(facts3.size, 1);
    assert.equal(facts3.get('tom')!.length, 1);
    assert.equal(facts3.get('tom')![0], 'english');
  });
});
