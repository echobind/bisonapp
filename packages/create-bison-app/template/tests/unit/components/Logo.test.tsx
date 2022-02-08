/**
 * @jest-environment jsdom
 */

import React from 'react';

import { render } from '@/tests/utils';
import { Logo } from '@/components/Logo';

describe('Logo', () => {
  it('loads', async () => {
    expect(async () => {
      await render(<Logo />);
    }).not.toThrowError();
  });
});
