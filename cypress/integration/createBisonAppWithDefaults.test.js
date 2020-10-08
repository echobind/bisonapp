/// <reference types="cypress" />

describe("Creating a new app", () => {
  it("properly renders the page", () => {
    cy.visit("/");
    cy.get("h2").contains(/home page/i);
  });

  describe("prisma .env", () => {
    it("sets DATABASE_URL", async () => {
      const appPath = process.env.APP_PATH;

      cy.readFile(`${appPath}/prisma/.env`).should.contain(
        "postgresql://postgres@localhost:5432/foo_dev?schema=public"
      );
    });
  });
});

// const path = await getTmpDir();

//   require("dotenv").config({
//     path: `${path}/foo/prisma/.env`,
//   });
// });

// describe("Prisma", () => {
//   describe("Environment Variables", () => {
//     it("correctly defines a DATABASE_URL env var", () => {
//       expect(process.env.DATABASE_URL).toBe(
//         "postgresql://postgres@localhost:5432/foo_dev?schema=public"
//       );
//     });
