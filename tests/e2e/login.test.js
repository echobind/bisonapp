describe('Login', () => {
  describe('with an email that doesnt exist', () => {
    it('shows an error', () => {
      const email = 'nowayshouldIexist@wee.net';
      const password = 'test1234';

      cy.visit('/');
      cy.findByText(/login/i).click();

      cy.findByLabelText(/email/i).type(email);
      cy.findByLabelText(/password/i).type(password);
      cy.findAllByRole('button', { name: /login/i }).click();

      cy.findByText(/is invalid/i).should('exist');
    });
  });

  describe('with valid credentials', () => {
    it('logs in', () => {
      const attrs = { password: 'superawesome' };

      // note: async/await breaks cypress 😭
      cy.task('factory', { name: 'User', attrs }).then((user) => {
        cy.visit('/');
        cy.findByText(/login/i).click();

        cy.location('pathname').should('equal', '/login');
        cy.findByLabelText(/email/i).type(user.email);
        cy.findByLabelText(/password/i).type(attrs.password);
        cy.findAllByRole('button', { name: /login/i }).click();

        cy.findByText(/logout/i).should('exist');
        cy.location('pathname').should('equal', '/');
      });
    });
  });
});
