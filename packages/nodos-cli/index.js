// const importFrom = require('import-from');
const semver = require('semver');
const runCurrent = require('./lib/current/index.js');
const runNew = require('./lib/new/index.js');
const log = require('./lib/logger.js');

module.exports = {
  runNew,
  runCurrent,
  async run(dir, options = {}) {
    if (semver.lt(process.versions.node, '14.0.0')) {
      throw new Error('You need at least Node v14 to work with nodos');
    }
    let core;
    try {
      // eslint-disable-next-line global-require
      core = require('@nodosjs/core');
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') {
        throw e;
      }
    }
    log('workingDir', dir);
    log('@nodosjs/core', core);

    if (core) {
      try {
        const app = await core.nodos(dir);
        await runCurrent(app, options);
      } catch (e) {
        console.error('Nodos installed, but there is no application.js file\n');
        console.error(e.message);
      }
    } else {
      runNew(dir, options);
    }
  },
};
