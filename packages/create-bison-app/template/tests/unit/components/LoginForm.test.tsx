/**
 * @jest-environment jsdom
 */

import { render, waitFor, userEvent } from '@/tests/utils';
import { LoginForm } from '@/components/auth/LoginForm';

describe('LoginForm', () => {
  describe('with no inputs', () => {
    it('shows errors', async () => {
      const { getByLabelText, getByText, getAllByLabelText } = render(<LoginForm />);

      const submitButton = getByText(/sign in/i);
      userEvent.click(submitButton);

      const emailInput = getByLabelText(/email/i);
      const passwordInput = getAllByLabelText(/password/i)[0];

      await waitFor(() => expect(emailInput).toHaveAttribute('aria-invalid', 'true'));
      await waitFor(() => expect(passwordInput).toHaveAttribute('aria-invalid', 'true'));
    });
  });

  describe('email validation', () => {
    it('shows errors when invalid', async () => {
      const { getByLabelText, getByText } = render(<LoginForm />);

      // update email
      const emailInput = getByLabelText(/email/i);
      userEvent.type(emailInput, 'notemail');

      // submit form
      const submitButton = getByText(/sign in/i);
      userEvent.click(submitButton);

      await waitFor(() => expect(emailInput).toHaveAttribute('aria-invalid', 'true'));

      userEvent.type(emailInput, 'asdf@wee.net');

      await waitFor(() => expect(emailInput).not.toHaveAttribute('aria-invalid', 'true'));
    });
  });
});
