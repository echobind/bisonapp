describe('Login', () => {
  describe('with an email that doesnt exist', () => {
    it('Shows an error', () => {
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
    it('Shows an error', () => {
      const attrs = { password: 'superawesome' };

      cy.task('factory', { name: 'User', attrs }).then((user) => {
        cy.visit('/');
        cy.findByText(/login/i).click();

        cy.location('pathname').should('equal', '/login');
        cy.findByLabelText(/email/i).type(user.email);
        cy.findByLabelText(/password/i).type(attrs.password);
        cy.findAllByRole('button', { name: /login/i }).click();

        // TODO: WHY NOT GOING TO NEW PAGE
        cy.findByText(/home page/i);
        cy.location('pathname').should('equal', '/');
        cy.findByText(/home page/i).should('exist');
      });
    });
  });
});
