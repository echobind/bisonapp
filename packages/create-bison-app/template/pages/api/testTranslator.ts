import type { NextApiRequest, NextApiResponse } from 'next';

import { translator } from '@/utils/i18n-translator';

export default async function testTranslation(req: NextApiRequest, res: NextApiResponse) {
  const firstName = req.body.firstName || 'Guest';

  const t = translator({ ns: ['common'] });
  const welcomeMessage = t('welcome', { firstName });

  return res.status(200).json({ welcomeMessage });
}
