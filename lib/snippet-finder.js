const BroccoliPlugin = require('broccoli-plugin');
const _Promise = require('es6-promise').Promise;
const glob = require('glob');
const fs = require('fs');
const path = require('path');

function findFiles(srcDir) {
  return new _Promise(function(resolve, reject) {
    glob(
      path.join(srcDir, '**/*.+(js|ts|coffee|html|hbs|md|css|sass|scss|less|emblem|yaml)'),
      function(err, files) {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      },
    );
  });
}

function extractSnippets(fileContent, regexes) {
  const stack = [];
  const output = {};
  fileContent.split('\n').forEach(function(line) {
    const top = stack[stack.length - 1];
    if (top && top.regex.end.test(line)) {
      output[top.name] = top.content.join('\n');
      stack.pop();
    }

    stack.forEach(function(snippet) {
      snippet.content.push(line);
    });

    let match;
    const regex = regexes.find(function(regex) {
      return (match = regex.begin.exec(line));
    });

    if (match) {
      stack.push({
        regex: regex,
        name: match[1],
        content: [],
      });
    }
  });
  return output;
}

function writeSnippets(files, outputPath, options) {
  console.log({ outputPath });
  const regexes = options.snippetRegexes;
  files.forEach(filename => {
    const snippets = extractSnippets(fs.readFileSync(filename, 'utf-8'), regexes);
    for (const name in snippets) {
      let destFile = path.join(outputPath, name);
      const includeExtensions = options.includeExtensions;
      if (includeExtensions) {
        destFile += path.extname(filename);
      }
      fs.writeFileSync(destFile, snippets[name]);
    }
  });
}

function SnippetFinder(inputNode, options) {
  if (!(this instanceof SnippetFinder)) {
    return new SnippetFinder(inputNode, options);
  }

  BroccoliPlugin.call(this, [inputNode], {
    name: 'SnippetFinder',
    annotation: `SnippetFinder output: ${options.outputFile}`,
    persistentOutput: options.persistentOutput,
    needCache: options.needCache,
  });

  this.options = options;
}

SnippetFinder.prototype = Object.create(BroccoliPlugin.prototype);
SnippetFinder.prototype.constructor = SnippetFinder;

SnippetFinder.prototype.build = function() {
  return findFiles(this.inputPaths[0]).then(files => {
    writeSnippets(files, this.outputPath, this.options);
  });
};

module.exports = SnippetFinder;
