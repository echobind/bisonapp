import { BrowserContext, Locator, Page } from '@playwright/test';

import config from '@/playwright.config';

export async function clickNewPage(
  context: BrowserContext,
  // the locator that, when clicked, will open a new page
  clickableTarget: Locator
): Promise<Page> {
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    // assume this opens the new tab
    clickableTarget.click(),
  ]);

  // the page doesn't seem to inherit the timeout from context, so setting it
  // here too
  newPage.setDefaultTimeout(config.timeout || 30000);
  newPage.setDefaultNavigationTimeout(config.timeout || 30000);

  await newPage.waitForLoadState();

  return newPage;
}

export async function uploadFile(page: Page, clickableTarget: Locator, filePath: string) {
  // Note that Promise.all prevents a race condition
  // between clicking and waiting for the file chooser.
  const [fileChooser] = await Promise.all([
    // It is important to call waitForEvent before click to set up waiting.
    page.waitForEvent('filechooser'),
    // Opens the file chooser.
    clickableTarget.click(),
  ]);

  await fileChooser.setFiles(filePath);
}
