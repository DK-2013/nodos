const _ = require('lodash');
// const jest = require('jest');
const repl = require('repl');
const columnify = require('columnify');
// const log = require('./logger.js');

// const testCommand = ({ container }) => ({
//   command: 'test [file]',
//   describe: 'run tests',
//   builder: {},
//   handler: (argv) => {
//     // FIXME: not working
//     process.env.NODOS_ENV = 'test';
//     // const rest = argv._.slice(1);
//     const options = [];
//     if (argv.file) {
//       options.push('-f', argv.file);
//     } else {
//       options.push('--testPathPattern', '/tests/');
//     }
//     const jestItem = _.get(container, 'jest', jest);
//     log(options);
//     jestItem.run(options);
//   },
// });

const buildConsoleCommand = ({ app, container }) => ({
  command: 'console',
  describe: 'run console',
  builder: {},
  handler: async () => {
    const actualRepl = _.get(container, 'repl', repl);
    const replServer = actualRepl.start({
      prompt: '> ',
    });
    replServer.context.app = app;
  },
});

const buildServerCommand = ({ app }) => ({
  command: 'server',
  describe: 'run server',
  aliases: ['s'],
  builder: (yargs) => yargs
    .default('h', process.env.NODOS_HOST || '127.0.0.1')
    .alias('h', 'host')
    .default('p', Number(process.env.NODOS_PORT) || app.config.port)
    .alias('p', 'port'),
  handler: async (argv) => {
    await app.listen(argv.port, argv.host);
  },
});

const buildRoutesCommand = ({ app, container }) => ({
  command: 'routes',
  describe: 'display routes',
  handler: async () => {
    const print = _.get(container, 'print', console.log);
    const { routes } = app.router;
    if (_.isEmpty(routes)) {
      print(
        'You don\'t have any routes defined!\n\n'
        + 'Please add some routes in config/routes.yml.',
      );
    } else {
      const formattedRoutes = columnify(
        routes,
        {
          columns: ['name', 'method', 'template', 'pipeline', 'controllerAction'],
          config: {
            name: {
              headingTransform: () => 'Name',
            },
            method: {
              headingTransform: () => 'Verb',
              dataTransform: _.toUpper,
            },
            template: {
              headingTransform: () => 'URI Pattern',
            },
            pipeline: {
              headingTransform: () => 'Pipeline',
              // dataTransform: (scope) => ,
            },
            controllerAction: {
              headingTransform: () => 'Controller#Action',
            },
          },
        },
      );
      print(formattedRoutes);
    }
  },
});

const buildGeneratorsCommand = ({ app }) => ({
  command: 'generate <type> <name> [params...]',
  describe: 'Creates folders and files for the <type> you specify',
  builder: (command) => {
    command.positional('type', {
      describe: 'what you need to create [controller model resource resources]',
    });
    command.positional('name', {
      describe: 'name of entity',
    });
    command.positional('params', {
      describe: 'list of params that you want apply to your generator',
    });
  },
  handler: async ({ type, name, params }) => {
    const { handler } = app.generators.find((generator) => generator.type === type);
    handler({
      app,
      type,
      name,
      params,
    });
  },
});

const buildDestroyersCommand = ({ app }) => ({
  command: 'destroy <type> <name>',
  describe: 'Deletes files and folders created by the generate command for the <type> you specify',
  builder: (command) => {
    command.positional('type', {
      describe: 'what you need to destroy [controller model resource resources]',
    });
    command.positional('name', {
      describe: 'name of entity',
    });
  },
  handler: async ({ type, name }) => {
    const { handler } = app.destroyers.find((destroyer) => destroyer.type === type);
    handler({
      name,
      type,
    });
  },
});

module.exports = {
  buildConsoleCommand, buildServerCommand, buildRoutesCommand, buildGeneratorsCommand, buildDestroyersCommand,
};
