import * as assert from 'assert';
import { guessDelimiter, factStringFromTable } from '../create-facts-from-table';

suite('Command :: Create facts from table', function () {
  test('guess correct delimiter', function () {
    const csvs = [
      [ 'a,b,c\n,d,e,f', ',' ],
      [ '","a","\t","b\nd\te', '\t' ]
    ];

    for (const [csv, expectedDelimiter] of csvs) {
      assert.equal(guessDelimiter(csv), expectedDelimiter);
    }
    assert.throws(() => guessDelimiter('abc'));
  });

  test('fact string from table', function () {
    assert.equal(
      factStringFromTable('a,b,c\nfoo,f,g\ngef,h,d\ngef,a,').trim(),
      '<relinst type="b" subject="foo" object="f" cf="100" />\n<relinst type="c" subject="foo" object="g" cf="100" />\n<relinst type="b" subject="gef" object="h" cf="100" />\n<relinst type="c" subject="gef" object="d" cf="100" />\n<relinst type="b" subject="gef" object="a" cf="100" />'
    );
  });
});
