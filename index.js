'use strict';

const fs = require('fs');
const mergeTrees = require('broccoli-merge-trees');
const flatiron = require('broccoli-flatiron');
const snippetFinder = require('./lib/snippet-finder');
const { findHost } = require('./lib/host-finder');

module.exports = {
  name: require('./package').name,

  snippetPaths: function() {
    const app = findHost(this);
    return app.options.snippetPaths || ['snippets'];
  },

  snippetSearchPaths: function() {
    const app = findHost(this);
    return app.options.snippetSearchPaths || ['app'];
  },

  snippetRegexes: function() {
    const app = findHost(this);
    return [
      {
        begin: /\bBEGIN-SNIPPET\s+(\S+)\b/,
        end: /\bEND-SNIPPET\b/,
      },
    ].concat(app.options.snippetRegexes || []);
  },

  includeExtensions: function() {
    const app = findHost(this);
    return app.options.includeFileExtensionInSnippetNames !== false;
  },

  treeForApp: function(tree) {
    const snippetPaths = this.snippetPaths().filter(path => {
      return fs.existsSync(path);
    });
    console.log(snippetPaths);
    const snippetsFromSnippetsPaths = mergeTrees(snippetPaths);

    const snippetOptions = {
      snippetRegexes: this.snippetRegexes(),
      includeExtensions: this.includeExtensions(),
    };

    const snippetsFromSearchPaths = this.snippetSearchPaths().map(path => {
      return snippetFinder(path, snippetOptions);
    });

    let snippets = mergeTrees(snippetsFromSearchPaths.concat(snippetsFromSnippetsPaths));

    snippets = flatiron(snippets, {
      outputFile: 'generated-snippets.js',
    });

    return mergeTrees([tree, snippets]);
  },
};
