/// <reference types="cypress" />

describe("Creating a new app", () => {
  it("properly renders the page", () => {
    cy.visit("/");
    cy.get("h2").contains(/home page/i);
  });

  describe("prisma", () => {
    it("sets DATABASE_URL", () => {
      expect(process.env.DATABASE_URL).toBe(
        "postgresql://postgres@localhost:5432/foo_dev?schema=public"
      );
    });
  });
});
