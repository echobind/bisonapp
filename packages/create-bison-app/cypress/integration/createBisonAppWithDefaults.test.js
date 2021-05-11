/// <reference types="cypress" />

describe("Creating a new app", () => {
  it("properly renders the page", () => {
    cy.visit("/");
    cy.get("h2").contains(/home page/i);
  });

  it("properly renders the playground", () => {
    cy.visit("/api/graphql");
    cy.title().should("include", "Playground");
  });

  describe("prisma .env", () => {
    it("contains the proper database URL", () => {
      cy.task("getAppName").then((appName) => {
        cy.task("readProjectFile", ".env")
          .should("contain", `postgresql://postgres@localhost:5432`)
          .should("contain", `${appName}_dev`);
      });
    });
  });
});
