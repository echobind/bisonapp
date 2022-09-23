/**
 * @jest-environment jsdom
 */

import { render } from '@/tests/utils';
import { Logo } from '@/components/Logo';

describe('Logo', () => {
  it('loads', async () => {
    expect(async () => {
      await render(<Logo />);
    }).not.toThrowError();
  });
});
