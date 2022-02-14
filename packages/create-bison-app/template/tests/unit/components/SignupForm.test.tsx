/**
 * @jest-environment jsdom
 */

import React from 'react';

import { render, waitFor, userEvent } from '@/tests/utils';
import { SignupForm } from '@/components/SignupForm';

describe('SignupForm', () => {
  it('loads', async () => {
    expect(() => {
      render(<SignupForm />);
    }).not.toThrowError();
  });

  describe('email validation', () => {
    it('shows errors when invalid', async () => {
      const { getByLabelText, getByText } = render(<SignupForm />);

      // update email
      const emailInput = getByLabelText(/email address/i);
      userEvent.type(emailInput, 'notemail');

      // submit form
      const submitButton = getByText(/signup/i);
      userEvent.click(submitButton);

      await waitFor(() => expect(emailInput).toHaveAttribute('aria-invalid', 'true'));

      userEvent.type(emailInput, 'asdf@wee.net');

      await waitFor(() => expect(emailInput).not.toHaveAttribute('aria-invalid', 'true'));
    });
  });

  describe('password validation', () => {
    it('shows errors when invalid', async () => {
      const { getByLabelText, getByText } = render(<SignupForm />);

      // update password
      const passwordInput = getByLabelText(/password/i);
      userEvent.type(passwordInput, 'pw');

      // submit form
      const submitButton = getByText(/signup/i);
      userEvent.click(submitButton);

      await waitFor(() => expect(passwordInput).toHaveAttribute('aria-invalid', 'true'));

      userEvent.type(passwordInput, 'ihave8characters');

      await waitFor(() => expect(passwordInput).not.toHaveAttribute('aria-invalid', 'true'));
    });
  });
});
