# EJSQL

Embedded JavaScript templates for SQL

## Installation

```bash
$ npm install ejsql
```

## Features

  * Control flow with `<% %>`
  * Value output with `<%= %>`
  * Table name or column name output with `<%- %>`
  * Array value output with `<%~ %>`
  * Newline-trim mode ('newline slurping') with `-%>` ending tag
  * Whitespace-trim mode (slurp all whitespace) for control flow with `<%_ _%>`
  * Custom delimiters (e.g., use `<? ?>` instead of `<% %>`)
  * Includes
  * Static caching of intermediate JavaScript
  * Static caching of templates

## Example

```sql
SELECT * FROM user
<% if (user) { %>
  WHERE id = <%= user.id %>
<% } %>
```

## Usage

```javascript
let template = ejsql.compile(str, options);
template(data);
// => Rendered SQL string

ejsql.render(str, data, options);
// => Rendered SQL string

ejsql.renderFile(filename, data, options, function(err, str){
    // str => Rendered SQL string
});
```

It is also possible to use `ejsql.render(dataAndOptions);` where you pass
everything in a single object. In that case, you'll end up with local variables
for all the passed options. However, be aware that your code could break if we
add an option with the same name as one of your data object's properties.
Therefore, we do not recommend using this shortcut.

## Options

  - `cache`                 Compiled functions are cached, requires `filename`
  - `filename`              The name of the file being rendered. Not required if you
    are using `renderFile()`. Used by `cache` to key caches, and for includes.
  - `root`                  Set project root for includes with an absolute path (/file.ejs).
  - `context`               Function execution context
  - `compileDebug`          When `false` no debug instrumentation is compiled
  - `delimiter`             Character to use with angle brackets for open/close
  - `debug`                 Output generated function body
  - `strict`                When set to `true`, generated function is in strict mode
  - `_with`                 Whether or not to use `with() {}` constructs. If `false`
    then the locals will be stored in the `locals` object. Set to `false` in strict mode.
  - `localsName`            Name to use for the object storing local variables when not using
    `with` Defaults to `locals`
  - `rmWhitespace`          Remove all safe-to-remove whitespace, including leading
    and trailing whitespace. It also enables a safer version of `-%>` line
    slurping for all scriptlet tags (it does not strip new lines of tags in
    the middle of a line).
  - `async`                 When `true`, EJSQL will use an async function for rendering. (Depends
    on async/await support in the JS runtime.

This project uses [JSDoc](http://usejsdoc.org/). For the full public API
documentation, clone the repository and run `npm run doc`. This will run JSDoc
with the proper options and output the documentation to `out/`. If you want
the both the public & private API docs, run `npm run devdoc` instead.

## Tags

  - `<%`              'Scriptlet' tag, for control-flow, no output
  - `<%_`             'Whitespace Slurping' Scriptlet tag, strips all whitespace before it
  - `<%=`             Outputs the value into the template
  - `<%-`             Outputs the table name or column name into the template
  - `<%~`             Outputs the array value into the template
  - `<%#`             Comment tag, no execution, no output
  - `<%%`             Outputs a literal '<%'
  - `%%>`             Outputs a literal '%>'
  - `%>`              Plain ending tag
  - `-%>`             Trim-mode ('newline slurp') tag, trims following newline
  - `_%>`             'Whitespace Slurping' ending tag, removes all whitespace after it

For the full syntax documentation, please see [docs/syntax.md](https://github.com/motojouya/ejsql/blob/master/docs/syntax.md).

## Includes

Includes either have to be an absolute path, or, if not, are assumed as
relative to the template with the `include` call. For example if you are
including `./views/user/show.ejs` from `./views/users.ejs` you would
use `<%- include('user/show') %>`.

You must specify the `filename` option for the template with the `include`
call unless you are using `renderFile()`.

Includes are inserted at runtime, so you can use variables for the path in the
`include` call (for example `<%- include(somePath) %>`). Variables in your
top-level data object are available to all your includes, but local variables
need to be passed down.

NOTE: Include preprocessor directives (`<% include user/show %>`) are
still supported.

## Custom delimiters

Custom delimiters can be applied on a per-template basis, or globally:

```javascript
let ejsql = require('ejsql'),
    users = ['geddy', 'neil', 'alex'];

// Just one template
ejsql.render('<?= users.join(" | "); ?>', {users: users}, {delimiter: '?'});
// => 'geddy | neil | alex'

// Or globally
ejsql.delimiter = '$';
ejsql.render('<$= users.join(" | "); $>', {users: users});
// => 'geddy | neil | alex'
```

## Caching

EJSQL ships with a basic in-process cache for caching the intermediate JavaScript
functions used to render templates. It's easy to plug in LRU caching using
Node's `lru-cache` library:

```javascript
let ejsql = require('ejsql'),
    LRU = require('lru-cache');
ejsql.cache = LRU(100); // LRU cache with 100-item limit
```

If you want to clear the EJSQL cache, call `ejsql.clearCache`. If you're using the
LRU cache and need a different limit, simple reset `ejsql.cache` to a new instance
of the LRU.

## Custom file loader

The default file loader is `fs.readFileSync`, if you want to customize it, you can set ejsql.fileLoader.

```javascript
let ejsql = require('ejsql');
let myFileLoad = function (filePath) {
  return 'myFileLoad: ' + fs.readFileSync(filePath);
};

ejsql.fileLoader = myFileLoad;
```

With this feature, you can preprocess the template before reading it.

## Layouts

EJSQL does not specifically support blocks, but layouts can be implemented by
including headers and footers, like so:


```sql
<%- include('select') -%>
 WHERE user.id = <%= userid %>
<%- include('orderby') -%>
```

### Caveats

Most of EJSQL will work as expected; however, there are a few things to note:

1. Obviously, since you do not have access to the filesystem, `ejsql.renderFile()` won't work.
2. For the same reason, `include`s do not work unless you use an `include callback`.

## Related projects

There are a number of implementations of EJSQL:

 * The v2 of EJS that EJSQL is forked from: https://github.com/mde/ejs
 * TJ's implementation, the v1 of this library: https://github.com/tj/ejs
 * Jupiter Consulting's EJS: http://www.embeddedjs.com/
 * EJS Embedded JavaScript Framework on Google Code: https://code.google.com/p/embeddedjavascript/
 * Sam Stephenson's Ruby implementation: https://rubygems.org/gems/ejs
 * Erubis, an ERB implementation which also runs JavaScript: http://www.kuwata-lab.com/erubis/users-guide.04.html#lang-javascript
 * DigitalBrainstem EJS Language support: https://github.com/Digitalbrainstem/ejs-grammar

## License

Licensed under the Apache License, Version 2.0
(<http://www.apache.org/licenses/LICENSE-2.0>)

- - -
EJSQL Embedded JavaScript templates for SQL copyright 2018
motojouya.
