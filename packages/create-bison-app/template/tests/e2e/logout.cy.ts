describe('Logout', () => {
  it('properly logs out a user', () => {
    cy.createUserAndLogin().then((session) => {
      const welcomeMsg = `Welcome, ${session.user.profile?.firstName}!`;
      cy.visit('/');
      // Verify signed in as User
      cy.contains(welcomeMsg);

      cy.wait('@session').then(() => {
        cy.findByText(/logout/i).click();
        // No way to intercept once for logout, kill the previous session from login
        // This is hacky but all other specs will assume a user is logged in -- or no session at all.
        // Also we are not spending forever here -- looking at you Playwright...
        cy.intercept('/api/auth/session', { fixture: 'session_error.json', statusCode: 401 }).as(
          'voidSession'
        );

        const guestMsg = 'Welcome, Guest!';
        cy.contains(guestMsg);
        cy.contains(/login/i);
      });
    });
  });
});
