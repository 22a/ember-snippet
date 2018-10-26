ember-snippet
==============================================================================

This addon allows us to generate text snippets, give them names, and render them in plain text by using `{{text-snippet name="my-snippet-file.js"}}`. This output could then be wrapped in [ember-prism](https://github.com/shipshapecode/ember-prism)'s `{{#code-block}}` to provide syntax highlighting if required.

This is a hard fork of [ef4/ember-code-snippet](https://github.com/ef4/ember-code-snippet) because, as an addon, e-c-s has kinda muddled concerns handling snippet generation **and** syntax highlighting via highlightjs in the same addon ([splitting these two concerns was mentioned by the addon's creator](https://github.com/ef4/ember-code-snippet/pull/56#issuecomment-430725393)). This fork drops all syntax highlighting code, tweaks a little of the snippet generation code, and wraps it in an ember@3.5 addon boilerplate (which allows us to run a dummy app locally for testing).

Installation
------------------------------------------------------------------------------

```
yarn add 22a/ember-snippet#0.4.0
```

Usage
------------------------------------------------------------------------------

There are two ways to store your code snippets. You can use either or
both together.

### With separate snippet files

Create a new "snippets" directory at the top level of your ember-cli
application or addon, and place the code snippets you'd like to render in their
own files inside it. They will be identified by filename. So if you
create the file `snippets/sample-template.hbs`, you can embed it in a
template with:

```hbs
{{text-snippet name="sample-template.hbs"}}
```

You can choose to load snippet files from different paths by passing
an option to `new EmberApp` in your `ember-cli-build.js`:

```js
var app = new EmberApp({
  snippetPaths: ['snippets']
});
```

If you want to use snippets located in an addon's dummy application,
add the dummy app path to `snippetPaths`:

```js
var app = new EmberAddon({
  snippetPaths: ['tests/dummy/app']
});
```

### From within your application source

In any file under your `app` tree, annotate the start and end of a
code snippet block by placing comments like this:

```js
// BEGIN-SNIPPET my-filename.js
function foo(){
  return 42;
};
// END-SNIPPET
```

The above is a Javascript example, but you can use any language's
comment format. We're just looking for lines that match
`/\bBEGIN-SNIPPET\s+(\S+)\b/` and `/\bEND-SNIPPET\b/`.

The opening comment must include a name. The component will identify
these snippets using the names you specified plus the file extension
of the file in which they appeared (which helps us detect languages
for better highlighting). So the above example could be included in a
template like this:

```hbs
{{text-snippet name="my-filename.js"}}
```

You can also define your own regex to find snippets. Just use the `snippetRegexes` option:

```js
var app = new EmberAddon({
 snippetRegexes: {
   begin: /{{#element-example\sname=\"(\S+)\"/,
   end: /{{\/element-example}}/,
 }
});
```

In the regex above everything in the `element-example` component block will be a snippet! Just make sure the first regex capture group is the name of the snippet.

By default, the component will try to unindent the code block by
removing whitespace characters from the start of each line until the
code bumps up against the edge. You can disable this with:

```hbs
{{text-snippet name="my-nice-example.js" unindent=false}}
```


You can choose which paths will be searched for inline snippets by
settings the snippetSearchPaths option when creating your application
in ember-cli-build.js:

```js
var app = new EmberApp({
  snippetSearchPaths: ['app', 'other']
});
```

By default, the file extension from the containing file will automatically be included in the snippet name. For instance, the example above has `BEGIN-SNIPPET my-nice-example` in the JS source, and is subsequently referenced as `"my-nice-example.js"`. To disable this behavior, use the `includeFileExtensionInSnippetNames` option:

```js
var app = new EmberApp({
  includeFileExtensionInSnippetNames: false
});
```

Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd ember-snippet`
* `yarn install`

### Linting

* `yarn lint:hbs`
* `yarn lint:js`
* `yarn lint:js --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
