import { expect } from '@wdio/globals';
import NavigationPage from '../pageobjects/navigation.page.js';
import LoginPage from '../pageobjects/login.page.js';

describe('Tela Login e Sign Up Form', () => {

    beforeEach(async () => {
        await NavigationPage.goToLogin();
    });

    describe('Cenários positivos', () => {
        it('Deve realizar login com sucesso com credenciais válidas', async () => {
            await LoginPage.realizarLogin('test@example.com', 'password123');

            expect(await LoginPage.isAlertDisplayed()).toBe(true);
            expect(await LoginPage.getTextAlertTitle()).toBe('Success');
            expect(await LoginPage.getTextAlertMessage()).toBe('You are logged in!');

            await LoginPage.dismissAlert();
        });

        it('Deve realizar um sign up com sucesso e realizar login em seguida', async () => {
            await LoginPage.openSignUp();
            await LoginPage.realizarCadastro('ciclano@teste.com', 'teste4545');
            await LoginPage.dismissAlert();

            await LoginPage.openLogin();
            await LoginPage.realizarLogin('ciclano@teste.com', 'teste4545');

            expect(await LoginPage.isAlertDisplayed()).toBe(true);
            expect(await LoginPage.getTextAlertTitle()).toBe('Success');
            expect(await LoginPage.getTextAlertMessage()).toBe('You are logged in!');

            await LoginPage.dismissAlert();
        });       
    })

    describe('Cenários negativos', () => {
        it("Deve validar os campos obrigatórios de login", async () => {
            await LoginPage.realizarLogin('', '');

            expect(await LoginPage.getTextErroMessageEmail()).toBe('Please enter a valid email address');
            expect(await LoginPage.getTextErroMessagePassword()).toBe('Please enter at least 8 characters');
        });

        it('Deve validar os campos obrigatórios de sign up', async () => {
            await LoginPage.openSignUp();

            await LoginPage.realizarCadastro('', '');

            expect(await LoginPage.getTextErroMessageEmail()).toBe('Please enter a valid email address');
            expect(await LoginPage.getTextErroMessagePassword()).toBe('Please enter at least 8 characters');
            expect(await LoginPage.getTextErroMessageConfirmPassword()).toBe('Please enter the same password');
        });
    })
});