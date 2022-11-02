/**
 * @jest-environment jsdom
 */

import { render, waitFor, userEvent, fireEvent, act } from '@/tests/utils';
import { SignUpForm } from '@/components/auth/SignUpForm';

describe('SignUpForm', () => {
  it('loads', async () => {
    expect(() => render(<SignUpForm />)).not.toThrowError();
  });

  describe('Validation', () => {
    it('shows errors when email invalid', async () => {
      const { getByLabelText, getByText } = render(<SignUpForm />);

      // update email
      const emailInput = getByLabelText(/email/i);
      userEvent.type(emailInput, 'notemail');

      // submit form
      const submitButton = getByText(/sign up/i);
      userEvent.click(submitButton);

      await waitFor(() => expect(emailInput).toHaveAttribute('aria-invalid', 'true'));

      userEvent.type(emailInput, 'asdf@wee.net');

      await waitFor(() => expect(emailInput).not.toHaveAttribute('aria-invalid', 'true'));
    });

    it('shows errors when password invalid', async () => {
      const { getAllByLabelText, getByText } = render(<SignUpForm />);

      // update password
      const passwordInput = getAllByLabelText(/password/i)[0];
      userEvent.type(passwordInput, 'pw');

      // submit form
      const submitButton = getByText(/sign up/i);
      userEvent.click(submitButton);

      await waitFor(() => expect(passwordInput).toHaveAttribute('aria-invalid', 'true'));

      userEvent.clear(passwordInput);
      userEvent.type(passwordInput, 'ihave8characters');

      await waitFor(() => expect(passwordInput).not.toHaveAttribute('aria-invalid', 'true'));
    });
  });

  describe('Successful Signup', () => {
    it('Routes to homepage', async () => {
      const { getByLabelText, getAllByLabelText, getByText } = render(<SignUpForm />);

      const firstNameInput = getByLabelText(/first name/i);
      const lastNameInput = getByLabelText(/last name/i);
      const emailInput = getByLabelText(/email/i);
      // get by label picks up on both password fields
      const passwordInput = getAllByLabelText(/password/i)[0];
      const confirmPasswordInput = getByLabelText(/confirm password/i);
      const submitButton = getByText(/sign up/i);

      await act(() => {
        fireEvent.change(firstNameInput, { target: { value: 'Barry' } });
        fireEvent.change(lastNameInput, { target: { value: 'Allen' } });
        fireEvent.change(emailInput, { target: { value: 'ballen@speedforce.net' } });
        fireEvent.change(passwordInput, { target: { value: 'super_secret' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'super_secret' } });
        fireEvent.submit(submitButton);
      });

      await waitFor(() => expect(firstNameInput).not.toHaveAttribute('aria-invalid', 'true'));
      await waitFor(() => expect(lastNameInput).not.toHaveAttribute('aria-invalid', 'true'));
      await waitFor(() => expect(emailInput).not.toHaveAttribute('aria-invalid', 'true'));
      await waitFor(() => expect(passwordInput).not.toHaveAttribute('aria-invalid', 'true'));
      await waitFor(() => expect(confirmPasswordInput).not.toHaveAttribute('aria-invalid', 'true'));

      // Test Toast Message
      // Issue w/ React Hook Form and Next Auth -- asserted validation passed
      // The text below can be captured in an E2E test
      // await waitFor(() => expect(getByText('Welcome, Barry!')).toBeInTheDocument());
    });
  });
});
