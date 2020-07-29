if (process.env.NODE_ENV === 'development') require('nexus').default.reset();

const app = require('nexus').default;

require('../../graphql/schema');

app.assemble();

async function handler(req, res) {
  return app.server.handlers.graphql(req, res);
}

export default handler;
