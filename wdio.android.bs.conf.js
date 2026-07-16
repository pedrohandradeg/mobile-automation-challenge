import fs from 'node:fs';
import allureReporter from '@wdio/allure-reporter';

export const config = {
    runner: 'local',

    specs: [
        './test/specs/**/*.js'
    ],
    exclude: [],

    maxInstances: 1,

    user: process.env.BROWSERSTACK_USERNAME,
    key: process.env.BROWSERSTACK_ACCESS_KEY,

    services: [
        ['browserstack', {
            app: process.env.BS_APP_ANDROID_URL,
            browserstackLocal: false,
        }],
    ],

    capabilities: [{
        platformName: 'Android',
        'appium:deviceName': 'Google Pixel 8',
        'appium:platformVersion': '14.0',
        'appium:automationName': 'UiAutomator2',
        'appium:app': process.env.BS_APP_ANDROID_URL,
        'bstack:options': {
            projectName: 'Mobile Automation Challenge',
            buildName: process.env.CI_PIPELINE_ID || 'local-build',
            sessionName: 'Android E2E Tests',
        },
    }],

    logLevel: 'info',
    bail: 0,

    waitforTimeout: 15000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,

    framework: 'mocha',
    reporters: [
        'spec',
        ['allure', {
            outputDir: 'reports/allure-results',
            disableWebdriverAndroidStepsReporting: true,
            disableWebdriverStepsReporting: false,
        }],
    ],

    mochaOpts: {
        ui: 'bdd',
        timeout: 60000
    },

    before: async function (capabilities) {
        allureReporter.addEnvironment('Platform', capabilities.platformName);
        allureReporter.addEnvironment('Device', capabilities['appium:deviceName'] || 'N/A');
        allureReporter.addEnvironment('OS Version', capabilities['appium:platformVersion'] || 'N/A');
        allureReporter.addEnvironment('Cloud Provider', 'BrowserStack App Automate');
    },

    afterTest: async function (test, context, { passed }) {
        if (!passed) {
            const dir = './reports/screenshots';
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            const safeParent = test.parent.replace(/[\s/\\]+/g, '_');
            const safeTitle = test.title.replace(/[\s/\\]+/g, '_');
            const screenshotPath = `${dir}/FAIL-${safeParent}-${safeTitle}-${Date.now()}.png`;

            await browser.saveScreenshot(screenshotPath);

            const screenshotBuffer = fs.readFileSync(screenshotPath);
            allureReporter.addAttachment('Screenshot da falha', screenshotBuffer, 'image/png');

            try {
                const logs = await browser.getLogs('server');
                allureReporter.addAttachment('Logs do servidor', JSON.stringify(logs, null, 2), 'application/json');
            } catch (e) {}
        }
    },
};