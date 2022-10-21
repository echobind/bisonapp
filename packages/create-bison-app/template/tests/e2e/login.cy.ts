import { User } from '@prisma/client';

describe('Login', () => {
  describe('with an email that doesnt exist', () => {
    it('shows an error', () => {
      const email = 'nowayshouldIexist@wee.net';
      const password = 'test1234';

      cy.intercept({ method: 'POST', hostname: 'localhost', url: '/api/trpc/user.login**' }).as(
        'loginMutation'
      );

      cy.visit('/');
      cy.findByText(/login/i).click();

      cy.location('pathname').should('equal', '/login');
      cy.findByLabelText(/email/i).type(email);
      cy.findByLabelText(/password/i).type(password);
      cy.findAllByRole('button', { name: /login/i }).click();
      cy.wait('@loginMutation');

      cy.findByText(/No user found/i).should('exist');
    });
  });

  describe('with valid credentials', () => {
    it('logs in', () => {
      const attrs = { password: 'superawesome' };

      // note: async/await breaks cypress 😭
      cy.task<User>('factory', { name: 'User', attrs }).then((user) => {
        cy.intercept({ method: 'POST', hostname: 'localhost', url: '/api/trpc/user.login**' }).as(
          'loginMutation'
        );

        cy.visit('/');
        cy.findByText(/login/i).click();

        cy.location('pathname').should('equal', '/login');
        cy.findByLabelText(/email/i).type(user.email);
        cy.findByLabelText(/password/i).type(attrs.password);
        cy.findAllByRole('button', { name: /login/i }).click();
        cy.wait('@loginMutation');

        cy.findByText(/logout/i).should('exist');
        cy.location('pathname').should('equal', '/');
      });
    });
  });
});
