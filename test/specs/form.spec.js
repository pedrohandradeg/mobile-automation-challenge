import { expect } from '@wdio/globals';
import NavigationPage from '../pageobjects/navigation.page.js';
import FormPage from '../pageobjects/form.page.js';

describe('Tela Form components', () => {
    beforeEach(async () => {
        await NavigationPage.goToForms();
    });

    it('Deve validar o que está sendo digitado', async () => {
        const inputText = 'Testando o input text';
        await FormPage.setInputText(inputText);

        expect(await FormPage.getInputTextResult()).toBe(inputText);
    });

    it('Deve interagir com o switch', async () => {
        expect(await FormPage.getSwitchText()).toBe('Click to turn the switch ON');

        await FormPage.toggleSwitch();

        expect(await FormPage.getSwitchText()).toBe('Click to turn the switch OFF');
    });

    it('Deve interagir com o dropdown', async () => {
        const optionToSelect = 'Appium is awesome';
        await FormPage.selectDropdownOption(optionToSelect);

        expect(await FormPage.getDropdownText()).toBe(optionToSelect);
    });

    it('Deve interagir com o botão Active e clicar em OK', async () => {
        await FormPage.clickButtonActive();

        expect(await FormPage.isAlertDisplayed()).toBe(true);
        expect(await FormPage.getTextAlertTitle()).toBe('This button is');
        expect(await FormPage.getTextAlertMessage()).toBe('This button is active');

        await FormPage.clickButtonsAlert('OK');
    });

    it('Deve interagir com o botão Active e clicar em Cancel', async () => {
        await FormPage.clickButtonActive();

        expect(await FormPage.isAlertDisplayed()).toBe(true);
        expect(await FormPage.getTextAlertTitle()).toBe('This button is');
        expect(await FormPage.getTextAlertMessage()).toBe('This button is active');

        await FormPage.clickButtonsAlert('CANCEL');
    });

    it('Deve interagir com o botão Active e clicar em Ask Me Later', async () => {
        await FormPage.clickButtonActive();

        expect(await FormPage.isAlertDisplayed()).toBe(true);
        expect(await FormPage.getTextAlertTitle()).toBe('This button is');
        expect(await FormPage.getTextAlertMessage()).toBe('This button is active');

        await FormPage.clickButtonsAlert('ASK ME LATER');
    });
});