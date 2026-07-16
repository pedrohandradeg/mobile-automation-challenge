import { $, driver } from '@wdio/globals';

export default class BasePage {

  getDefaultTimeout() {
    return driver.options.waitforTimeout || 10000;
  }

  async waitForDisplayed(selector, timeout = this.getDefaultTimeout()) {
    const el = await $(selector);
    await el.waitForDisplayed({ timeout });
    return el;
  }

  async click(selector) {
    const el = await this.waitForDisplayed(selector);
    await el.click();
  }

  async setValue(selector, value) {
    const el = await this.waitForDisplayed(selector);
    await el.clearValue();
    if (value) {
      await el.setValue(value);
    }
  }

  async getText(selector, timeout = this.getDefaultTimeout()) {
    const el = await this.waitForDisplayed(selector, timeout);
    return el.getText();
  }

  async isDisplayed(selector, timeout = this.getDefaultTimeout()) {
    try {
      const el = await $(selector);
      await el.waitForDisplayed({ timeout });
      return true;
    } catch {
      return false;
    }
  }

  async hideKeyboardIfNeeded() {
    if (driver.isIOS) {
      try {
        await driver.action('pointer')
          .move({ x: 200, y: 60 })
          .down()
          .up()
          .perform();
      } catch (e) {
      }
    }
  }
}
