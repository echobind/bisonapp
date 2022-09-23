/**
 * @jest-environment jsdom
 */

import { render } from '@/tests/utils';
import { CenteredBoxForm } from '@/components/CenteredBoxForm';

describe('CenteredBoxForm', () => {
  it('loads', async () => {
    const { findByText } = render(<CenteredBoxForm>Hello</CenteredBoxForm>);

    const component = await findByText('Hello');

    expect(component).toBeVisible();
  });
});
