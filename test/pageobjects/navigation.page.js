import { driver } from '@wdio/globals';
import BasePage from './base.page.js';

class NavigationPage extends BasePage {

    get tabHome() {
        return '~Home';
    }

    get tabWeb() {
        return driver.isIOS
            ? '~Webview'
            : '~Web';
    }

    get tabLogin() {
        return '~Login';
    }

    get tabForms() {
        return '~Forms';
    }

    get tabSwipe() {
        return '~Swipe';
    }

    get tabDrag() {
        return '~Drag';
    }

    get tabMenu() {
        return '~Menu';
    }

    async goToHome() {
        await this.hideKeyboardIfNeeded();
        await this.click(this.tabHome);
    }

    async goToWeb() {
        await this.hideKeyboardIfNeeded();
        await this.click(this.tabWeb);
    }

    async goToLogin() {
        await this.hideKeyboardIfNeeded();
        await this.click(this.tabLogin);
    }

    async goToForms() {
        await this.hideKeyboardIfNeeded();
        await this.click(this.tabForms);
    }

    async goToSwipe() {
        await this.hideKeyboardIfNeeded();
        await this.click(this.tabSwipe);
    }

    async goToDrag() {
        await this.hideKeyboardIfNeeded();
        await this.click(this.tabDrag);
    }

    async openMenu() {
        await this.hideKeyboardIfNeeded();
        await this.click(this.tabMenu);
    }

    async isTabSelected(tabSelector) {
        const el = await $(tabSelector);
        const attr = driver.isIOS
            ? await el.getAttribute('value')      // iOS: '1' quando selecionado
            : await el.getAttribute('selected');  // Android: 'true' quando selecionado
        return driver.isIOS ? attr === '1' : attr === 'true';
    }
}

export default new NavigationPage();