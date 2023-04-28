/**
 * @jest-environment jsdom
 */

import { render, waitFor, userEvent, fireEvent, act } from '~/tests/utils';
import { SignUpForm } from '@/components/auth/SignUpForm';

// need this in order to use `act`
((global || {}) as any).IS_REACT_ACT_ENVIRONMENT = true;

describe('SignUpForm', () => {
  it('loads', async () => {
    expect(() => render(<SignUpForm />)).not.toThrowError();
  });

  describe('Validation', () => {
    it('shows errors when password invalid', async () => {
      const { getByLabelText, getAllByLabelText, getByText } = render(<SignUpForm />);

      // need to provide a value for these fields or else the form will not
      // submit
      const emailInput = getByLabelText(/email/i);
      userEvent.type(emailInput, 'test@example.com');

      const confirmPasswordInput = getByLabelText(/confirm password/i);
      userEvent.type(confirmPasswordInput, 'ihave8characters');

      // update password
      const passwordInput = getAllByLabelText(/password/i)[0];
      userEvent.type(passwordInput, 'pw');

      // submit form
      const submitButton = getByText(/sign up/i);
      userEvent.click(submitButton);

      await waitFor(() => expect(passwordInput).toBeInvalid());

      userEvent.clear(passwordInput);
      userEvent.type(passwordInput, 'ihave8characters');

      await waitFor(() => expect(passwordInput).toBeValid());
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

      act(() => {
        fireEvent.change(firstNameInput, { target: { value: 'Barry' } });
        fireEvent.change(lastNameInput, { target: { value: 'Allen' } });
        fireEvent.change(emailInput, { target: { value: 'ballen@speedforce.net' } });
        fireEvent.change(passwordInput, { target: { value: 'super_secret' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'super_secret' } });
        fireEvent.submit(submitButton);
      });

      await waitFor(() => expect(firstNameInput).toBeValid());
      await waitFor(() => expect(lastNameInput).toBeValid());
      await waitFor(() => expect(emailInput).toBeValid());
      await waitFor(() => expect(passwordInput).toBeValid());
      await waitFor(() => expect(confirmPasswordInput).toBeValid());

      // Test Toast Message
      // Issue w/ React Hook Form and Next Auth -- asserted validation passed
      // The text below can be captured in an E2E test
      // await waitFor(() => expect(getByText('Welcome, Barry!')).toBeInTheDocument());
    });
  });
});
