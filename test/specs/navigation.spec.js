import { expect } from '@wdio/globals';
import NavigationPage from '../pageobjects/navigation.page.js';

describe('Navegação entre telas', () => {

    it('Deve navegar para a aba Login e marcá-la como selecionada', async () => {
        await NavigationPage.goToLogin();
        expect(await NavigationPage.isTabSelected(NavigationPage.tabLogin)).toBe(true);
    });

    it('Deve navegar para a aba Forms e marcá-la como selecionada', async () => {
        await NavigationPage.goToForms();
        expect(await NavigationPage.isTabSelected(NavigationPage.tabForms)).toBe(true);
    });

    it('Deve navegar para a aba Swipe e marcá-la como selecionada', async () => {
        await NavigationPage.goToSwipe();
        expect(await NavigationPage.isTabSelected(NavigationPage.tabSwipe)).toBe(true);
    });

    it('Deve navegar para a aba Drag e marcá-la como selecionada', async () => {
        await NavigationPage.goToDrag();
        expect(await NavigationPage.isTabSelected(NavigationPage.tabDrag)).toBe(true);
    });

    it('Deve navegar de volta para Home e marcá-la como selecionada', async () => {
        await NavigationPage.goToHome();
        expect(await NavigationPage.isTabSelected(NavigationPage.tabHome)).toBe(true);
    });
});