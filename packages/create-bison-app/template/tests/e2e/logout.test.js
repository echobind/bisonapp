describe('Logout', () => {
  it('properly logs out a user', () => {
    cy.createUserAndLogin().then(() => {
      cy.visit('/');
      cy.findByText(/logout/i).click();
      cy.location('pathname').should('equal', '/login');
    });
  });
});
