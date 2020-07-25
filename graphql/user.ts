import { schema } from "nexus";

schema.objectType({
  name: "User",
  description: "A User",
  definition(t) {
    t.model.id();
    t.model.createdAt();
    t.model.updatedAt();
    t.model.email();
  },
});

schema.objectType({
  name: "AuthPayload",
  description: "Payload returned if login or signup is successful",
  definition(t) {
    t.string("token", {
      description: "The current JWT token. Use in Authentication header",
    });
    t.field("user", { type: "User", description: "The logged in user" });
  },
});

schema.queryType({
  definition: (t) => {
    // Me Query
    t.field("me", {
      type: "User",
      description: "Returns the currently logged in user",
      nullable: true,
      resolve: (_root, _args, ctx) => ctx.user,
    });
  },
});
