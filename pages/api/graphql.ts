if (process.env.NODE_ENV === "development") require("nexus").default.reset();

const app = require("nexus").default;

require("../../graphql/schema");

app.assemble();

// Render either the playground or the API depending on the request type
async function handler(req, res) {
  const shouldRenderPlayground = req.method === "GET";

  return shouldRenderPlayground
    ? app.server.handlers.playground(req, res)
    : app.server.handlers.graphql(req, res);
}

export default handler;
