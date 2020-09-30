/// <reference types="cypress" />

describe("Creating a new app", () => {
  describe("using all defaults", () => {
    it("works", () => {
      cy.visit("/");
      cy.get("h2").contains(/home page/i);
    });
  });
});
