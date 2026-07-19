import type { Page } from '@playwright/test';

export async function assertNoHorizontalOverflow(page: Page): Promise<void> {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  if (overflow) throw new Error('LEADBOX-RULE: Horizontal overflow detected');
}

export async function assertVisibleInsideViewport(page: Page, selector: string): Promise<void> {
  const box = await page.locator(selector).boundingBox();
  if (!box) throw new Error(`LEADBOX-RULE: Element not visible: ${selector}`);
  const viewport = page.viewportSize();
  if (!viewport) return;
  const contained = box.x >= 0 && box.y >= 0 && box.x + box.width <= viewport.width + 1;
  if (!contained) throw new Error(`LEADBOX-RULE: Element exceeds viewport: ${selector}`);
}
