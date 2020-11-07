import React from 'react';

import { render } from '../../../tests/utils';
import '../../matchMedia.mock';
import { Nav } from '../../../components/Nav';

describe('Nav', () => {
  it('loads', async () => {
    expect(async () => {
      await render(<Nav />);
    }).not.toThrowError();
  });
});
