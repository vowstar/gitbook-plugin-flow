# gitbook-plugin-flow

[![Build Status](https://github.com/vowstar/gitbook-plugin-flow/actions/workflows/test.yml/badge.svg)](https://github.com/vowstar/gitbook-plugin-flow/actions)
[![Coverage Status](https://coveralls.io/repos/github/vowstar/gitbook-plugin-flow/badge.svg?branch=master)](https://coveralls.io/github/vowstar/gitbook-plugin-flow?branch=master)
[![NPM Version](https://img.shields.io/npm/v/gitbook-plugin-flow.svg?style=flat)](https://www.npmjs.org/package/gitbook-plugin-flow)
[![NPM Downloads](https://img.shields.io/npm/dm/gitbook-plugin-flow.svg?style=flat)](https://www.npmjs.org/package/gitbook-plugin-flow)

[flowchart.js](https://github.com/adrai/flowchart.js) plugin for [Honkit](https://github.com/honkit/honkit) ~~and [GitBook](https://github.com/GitbookIO/gitbook)~~.

## Installation

```bash
npm install gitbook-plugin-flow
```

Add this plugin into ``book.json``.

```json
{
  "plugins": ["flow"]
}
```

## Features

* Support HTML, PDF, EPUB output(make sure your gitbook support SVG)
* Support ```flow code block quote
* Multi code style support

## Configuration

book.json add the flowchart.js options

```json
"pluginsConfig": {
  "flow": {
    "line-color": "red"
  }
}
```

## Usage

To include a sequence diagram, just wrap your definition in a "flow" code block. For example:

<pre lang="no-highlight"><code>```flow
st=>start: Start|past:>http://www.google.com[blank]
e=>end: End:>http://www.google.com
| op1=>operation: My Operation    | past    |
| op2=>operation: Stuff           | current |
| sub1=>subroutine: My Subroutine | invalid |
cond=>condition: Yes
| or No?                              | approved:>http://www.google.com |
| c2=>condition: Good idea            | rejected                        |
| io=>inputoutput: catch something... | request                         |

st->op1(right)->cond
cond(yes, right)->c2
cond(no)->sub1(left)->op1
c2(yes)->io->e
c2(no)->op2->e

```
</code></pre>


Also you can put in your book block as

```bash
{% flow %}
st=>start: Start:>http://www.google.com[blank]
e=>end:>http://www.google.com
op1=>operation: My Operation
sub1=>subroutine: My Subroutine
cond=>condition: Yes
or No?:>http://www.google.com
io=>inputoutput: catch something...

st->op1->cond
cond(yes)->io->e
cond(no)->sub1(right)->op1
{% endflow %}
```

In addition you can use these code

```bash
{% flowchart %}
st=>start: Start:>http://www.google.com[blank]
e=>end:>http://www.google.com
op1=>operation: My Operation
sub1=>subroutine: My Subroutine
cond=>condition: Yes
or No?:>http://www.google.com
io=>inputoutput: catch something...

st->op1->cond
cond(yes)->io->e
cond(no)->sub1(right)->op1
{% endflowchart %}
```

### Extend the width

```bash
{% flow width=770 %}
```

## Thanks

This project learn from:

* [midnightSuyama/gitbook-plugin-flowchart](https://github.com/midnightSuyama/gitbook-plugin-flowchart).
* [nsdont/gitbook-plugin-new-flowchart](https://github.com/nsdont/gitbook-plugin-new-flowchart).
* [lyhcode/gitbook-plugin-plantuml](https://github.com/lyhcode/gitbook-plugin-plantuml).

## See also

These plugins are also available on honkit.

|                                    Plugin                                     |                      Description                       |
| ----------------------------------------------------------------------------- | ------------------------------------------------------ |
| [gitbook-plugin-uml](https://github.com/vowstar/gitbook-plugin-uml)           | A plug-in that use plantuml to draw beautiful pictures |
| [gitbook-plugin-wavedrom](https://github.com/vowstar/gitbook-plugin-wavedrom) | A plug-in that can draw waveforms and register tables  |
| [gitbook-plugin-sequence](https://github.com/vowstar/gitbook-plugin-sequence) | A plug-in that can draw sequence diagrams              |
| [gitbook-plugin-flow](https://github.com/vowstar/gitbook-plugin-flow)         | A plug-in that can draw flowchart.js diagrams          |
