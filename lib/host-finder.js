/**
 * Finds the host given an addon's context by climbing up the parent/app
 * hierarchy.
 * See: https://github.com/ember-engines/ember-asset-loader/blob/master/lib/utils/find-host.js
 *
 * @param {EmberAddon|EmberApp} context
 * @return {EmberApp} app
 */
const findHost = context => {
  let current = context;
  let app;

  // Keep iterating upward until we don't have a grandparent.
  // Has to do this grandparent check because at some point we hit the project.
  do {
    app = current.app || app;
  } while (current.parent && current.parent.parent && (current = current.parent));

  return app;
};

module.exports = {
  findHost,
};
