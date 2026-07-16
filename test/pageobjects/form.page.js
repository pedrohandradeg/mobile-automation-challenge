import { $, driver } from '@wdio/globals';
import BasePage from './base.page.js';

class FormPage extends BasePage {

    get inputText() {
        return '~text-input';
    }

    get inputTextResult() {
        return '~input-text-result';
    }

    get switch() {
        return '~switch';
    }

    get switchText() {
        return '~switch-text';
    }

    get dropdownChevron() {
        return driver.isIOS
            ? '~dropdown-chevron'
            : 'android=new UiSelector().resourceId("dropdown-chevron")';
    }

    get inputTextDropdown() {
        return driver.isIOS
            ? '~text_input'
            : 'android=new UiSelector().resourceId("text_input")';
    }

    get btnActive() {
        return '~button-Active';
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

    async setInputText(value) {
        await this.setValue(this.inputText, value);
    }

    async getInputTextResult() {
        return await this.getText(this.inputTextResult);
    }

    async toggleSwitch() {
        await this.click(this.switch);
    }

    async getSwitchText() {
        return await this.getText(this.switchText);
    }

    async selectDropdownOption(option) {
        await this.click(this.dropdownChevron);

        if (driver.isIOS) {
            const pickerWheel = await $('-ios class chain:**/XCUIElementTypePickerWheel');
            await pickerWheel.setValue(option);
            await this.click('~done_button');
        } else {
            const optionSelector = `android=new UiSelector().text("${option}")`;
            await this.click(optionSelector);
        }
    }

    async getDropdownText() {
        return this.getText(this.inputTextDropdown);
    }

    async clickButtonActive() {
        await this.click(this.btnActive);
    }

    async clickButtonsAlert(button) {
        if (driver.isIOS) {
            const iosLabels = {
                'OK': 'OK',
                'CANCEL': 'Cancel',
                'ASK ME LATER': 'Ask me later',
            };
            const label = iosLabels[button] || button;
            await this.click(`~${label}`);
        } else {
            await this.click(`android=new UiSelector().text("${button}")`);
        }
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
}
export default new FormPage();
