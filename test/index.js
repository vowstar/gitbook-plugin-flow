/*jshint esversion: 8 */

var path = require('path');
var tester = require('honkit-tester');
var assert = require('assert');

var pkg = require('../package.json');

describe('flow', function() {
    this.timeout(50000);
    it('should correctly replace by ```flow``` tag', function() {
        return tester.builder()
            .withContent("\n```flow\nst=>start: Start:>http://www.google.com[blank]\ne=>end:>http://www.google.com\nop1=>operation: My Operation\nsub1=>subroutine: My Subroutine\ncond=>condition: Yes\nor No?:>http://www.google.com\nio=>inputoutput: catch something...\n\nst->op1->cond\ncond(yes)->io->e\ncond(no)->sub1(right)->op1\n```")
            .withLocalPlugin(path.join(__dirname, '..'))
            .withBookJson({
                gitbook: pkg.engines.gitbook,
                plugins: ['flow']
            })
            .create()
            .then(function(result) {
                const isSvg = require('is-svg');
                const svg = result[0].content.match(/<svg[^]*<\/svg>/m).toString();

                assert.equal(isSvg(svg), true);
                assert.equal(svg.includes('http://www.google.com'), true);
                assert.equal(svg.includes('My Operation'), true);
                assert.equal(svg.includes('catch something...'), true);
                assert.equal(svg.includes('My Subroutine'), true);
            });
    });
    it('should correctly replace by ```flow { width = 600, foo = "bar" }``` tag', function() {
        return tester.builder()
            .withContent('\n```flow { width = 600, foo = "bar" }\nst=>start: Start:>http://www.google.com[blank]\ne=>end:>http://www.google.com\nop1=>operation: My Operation\nsub1=>subroutine: My Subroutine\ncond=>condition: Yes\nor No?:>http://www.google.com\nio=>inputoutput: catch something...\n\nst->op1->cond\ncond(yes)->io->e\ncond(no)->sub1(right)->op1\n```')
            .withLocalPlugin(path.join(__dirname, '..'))
            .withBookJson({
                gitbook: pkg.engines.gitbook,
                plugins: ['flow']
            })
            .create()
            .then(function(result) {
                const isSvg = require('is-svg');
                const svg = result[0].content.match(/<svg[^]*<\/svg>/m).toString();

                assert.equal(isSvg(svg), true);
                assert.equal(svg.includes('http://www.google.com'), true);
                assert.equal(svg.includes('My Operation'), true);
                assert.equal(svg.includes('catch something...'), true);
                assert.equal(svg.includes('My Subroutine'), true);
                assert.equal(svg.includes('width="600px"'), true);
            });
    });
    it('should correctly replace by {% flow %} and endflow {% endflow %} tag', function() {
        return tester.builder()
            .withContent('\n{% flow %}\nst=>start: Start:>http://www.google.com[blank]\ne=>end:>http://www.google.com\nop1=>operation: My Operation\nsub1=>subroutine: My Subroutine\ncond=>condition: Yes\nor No?:>http://www.google.com\nio=>inputoutput: catch something...\n\nst->op1->cond\ncond(yes)->io->e\ncond(no)->sub1(right)->op1\n{% endflow %}')
            .withLocalPlugin(path.join(__dirname, '..'))
            .withBookJson({
                gitbook: pkg.engines.gitbook,
                plugins: ['flow']
            })
            .create()
            .then(function(result) {
                const isSvg = require('is-svg');
                const svg = result[0].content.match(/<svg[^]*<\/svg>/m).toString();

                assert.equal(isSvg(svg), true);
                assert.equal(svg.includes('http://www.google.com'), true);
                assert.equal(svg.includes('My Operation'), true);
                assert.equal(svg.includes('catch something...'), true);
                assert.equal(svg.includes('My Subroutine'), true);
            });
    });
});
