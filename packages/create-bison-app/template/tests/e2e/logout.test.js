describe('Logout', () => {
  it('properly logs out a user', () => {
    const attrs = { password: 'superawesome' };

    cy.createUserAndLogin({ password: attrs.password }).then(() => {
      cy.visit('/');
      cy.findByText(/logout/i).click();
      cy.location('pathname').should('equal', '/login');
    });
  });
});
