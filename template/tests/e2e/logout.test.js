describe('Logout', () => {
  it('properly logs out a user', () => {
    const attrs = { password: 'superawesome' };

    cy.createUserAndLogin({ email: user.email, password: attrs.password }).then((user) => {
      cy.visit('/');
      cy.findByText(/logout/i).click();
      cy.location('pathname').should('equal', '/login');
    });
  });
});
