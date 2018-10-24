// BEGIN-SNIPPET example-snippet.js
import Component from '@ember/component';
import { computed } from '@ember/object';
import Snippets from '../generated-snippets';

export default Component.extend({
  tagName: 'pre',
  unindent: true,

  _unindent: function(src) {
    if (!this.get('unindent')) {
      return src;
    }
    let match, min;
    const lines = src.split('\n').filter(l => l !== '');

    for (let i = 0; i < lines.length; i++) {
      match = /^[ \t]*/.exec(lines[i]);
      if (match && (typeof min === 'undefined' || min > match[0].length)) {
        min = match[0].length;
      }
    }
    if (typeof min !== 'undefined' && min > 0) {
      src = src.replace(new RegExp('^[ \t]{' + min + '}', 'gm'), '');
    }
    return src;
  },

  source: computed('name', function() {
    const snippet = this.get('name')
      .split('/')
      .reduce((dir, name) => dir && dir[name], Snippets);

    return this._unindent((snippet || '').replace(/^(\s*\n)*/, '').replace(/\s*$/, ''));
  }),

  language: computed('name', function() {
    const m = /\.(\w+)$/i.exec(this.get('name'));
    if (m) {
      switch (m[1].toLowerCase()) {
        case 'js':
          return 'javascript';
        case 'coffee':
          return 'coffeescript';
        case 'hbs':
          return 'handlebars';
        case 'css':
          return 'css';
        case 'scss':
          return 'scss';
        case 'less':
          return 'less';
        case 'emblem':
          return 'emblem';
        case 'ts':
          return 'typescript';
      }
    }
  }),
});
// END-SNIPPET
