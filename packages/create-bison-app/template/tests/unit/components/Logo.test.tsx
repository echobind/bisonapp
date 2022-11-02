/**
 * @jest-environment jsdom
 */

import { render } from '@/tests/utils';
import { Logo } from '@/components/Logo';
import '@/tests/matchMedia.mock';

describe('Logo', () => {
  it('loads', async () => {
    expect(async () => {
      await render(<Logo />);
    }).not.toThrowError();
  });
});
