/**
 * @jest-environment jsdom
 */

import React from 'react';

import { render } from '@/tests/utils';
import { ErrorText } from '@/components/ErrorText';

describe('ErrorText', () => {
  it('loads', async () => {
    const { findByText } = render(<ErrorText>Ma Error</ErrorText>);

    const component = await findByText('Ma Error');

    expect(component).toBeVisible();
  });
});
