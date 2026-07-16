import { driver } from '@wdio/globals';
import BasePage from './base.page.js';

class LoginPage extends BasePage {

    get inputEmail() {
        return '~input-email';
    }

    get inputPassword() {
        return '~input-password';
    }

    get inputRepeatPassword() {
        return '~input-repeat-password';
    }

    get btnLogin() {
        return '~button-LOGIN';
    }

    get btnSignUp() {
        return '~button-SIGN UP';
    }

    get linkLogin() {
        return driver.isIOS
            ? "-ios predicate string:name == 'Login' AND type == 'XCUIElementTypeStaticText'"
            : 'android=new UiSelector().text("Login")';
    }

    get linkSignUp() {
        return driver.isIOS
            ? '~Sign up'
            : 'android=new UiSelector().text("Sign up")';
    }

    get alertTitle() {
        return driver.isIOS
            ? '-ios class chain:**/XCUIElementTypeAlert/**/XCUIElementTypeStaticText[1]'
            : 'android=new UiSelector().resourceId("com.wdiodemoapp:id/alert_title")';
    }

    get alertMessage() {
        return driver.isIOS
            ? '-ios class chain:**/XCUIElementTypeAlert/**/XCUIElementTypeStaticText[2]'
            : 'android=new UiSelector().resourceId("android:id/message")';
    }

    get btnAlertOk() {
        return driver.isIOS
            ? '~OK'
            : 'android=new UiSelector().resourceId("android:id/button1")';
    }

    async openLogin() {
        return this.click(this.linkLogin);
    }

    async openSignUp() {
        return this.click(this.linkSignUp);
    }

    async realizarLogin(email, password) {
        await this.setValue(this.inputEmail, email);
        await this.setValue(this.inputPassword, password);
        await this.click(this.btnLogin);
    }

    async realizarCadastro(email, password) {
        await this.setValue(this.inputEmail, email);
        await this.setValue(this.inputPassword, password);
        await this.setValue(this.inputRepeatPassword, password);
        await this.click(this.btnSignUp);
    }

    async isAlertDisplayed() {
        return this.isDisplayed(this.alertTitle);
    }

    async getTextAlertTitle() {
        return this.getText(this.alertTitle);
    }

    async getTextAlertMessage() {
        return this.getText(this.alertMessage);
    }

    async dismissAlert() {
        await this.click(this.btnAlertOk);
    }

    async getTextErroMessageEmail() {
        const selector = driver.isIOS
            ? "-ios predicate string:name == 'Please enter a valid email address' AND visible == true"
            : 'android=new UiSelector().text("Please enter a valid email address")';
        return this.getText(selector, 15000);
    }

    async getTextErroMessagePassword() {
        const selector = driver.isIOS
            ? "-ios predicate string:name == 'Please enter at least 8 characters' AND visible == true"
            : 'android=new UiSelector().text("Please enter at least 8 characters")';
        return this.getText(selector, 15000);
    }

    async getTextErroMessageConfirmPassword() {
        const selector = driver.isIOS
            ? "-ios predicate string:name == 'Please enter the same password' AND visible == true"
            : 'android=new UiSelector().text("Please enter the same password")';
        return this.getText(selector, 15000);
    }
}
export default new LoginPage();
