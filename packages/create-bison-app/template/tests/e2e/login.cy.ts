describe('Login', () => {
  describe('with an email that doesnt exist', () => {
    it('shows an error', () => {
      const email = 'nowayshouldIexist@wee.net';
      const password = 'test1234';
      cy.intercept('/api/auth/session', { fixture: 'session_error.json' }).as('session');
      cy.intercept('/api/auth/callback/credentials?', { fixture: 'credentials_error.json' }).as(
        'credentials'
      );

      cy.visit('/');
      cy.findByText(/login/i).click();

      cy.location('pathname').should('equal', '/login');
      cy.findByLabelText(/email/i).type(email);
      cy.get('input[name=password]').type(password);
      cy.findAllByRole('button', { name: /sign in/i }).click();

      cy.wait('@session');
      cy.wait('@credentials');

      cy.findByText(/No User Found/i).should('exist');
    });
  });

  describe('with valid credentials', () => {
    it('logs in', () => {
      const attrs = {
        password: 'superawesome',
        profile: { create: { firstName: 'Peter', lastName: 'Parker' } },
      };

      // note: async/await breaks cypress 😭
      cy.task<PrismaUser>('factory', { name: 'User', attrs }).then((user) => {
        cy.task<NextAuthSession>('mockValidSession', { user }).then((session) => {
          const welcomeMsg = `Welcome, ${session.user.profile?.firstName}!`;
          cy.intercept('/api/auth/session', { body: session, statusCode: 200 }).as('session');
          cy.intercept('/api/auth/callback/credentials?', {
            fixture: 'credentials_success.json',
          }).as('credentials');

          cy.visit('/');
          cy.findByText(/login/i).click();

          cy.location('pathname').should('equal', '/login');
          cy.findByLabelText(/email/i).type(user.email);
          cy.get('input[name=password]').type('superawesome');
          cy.findAllByRole('button', { name: /sign in/i }).click();

          cy.wait('@session');
          cy.wait('@credentials');

          cy.contains(welcomeMsg);
          cy.findByText(/logout/i).should('exist');
          cy.findByText(/logout/i).click();

          cy.location('pathname').should('equal', '/');

          const guestMsg = 'Welcome, Guest!';
          cy.contains(guestMsg);
        });
      });
    });
  });
});
