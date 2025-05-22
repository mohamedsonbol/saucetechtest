// Add.env dependancy
require('dotenv').config()
const {Builder, By, Key, until} = require('selenium-webdriver')
const utils = require('./utils')
const chrome = require('selenium-webdriver/chrome');

const SAUCE_USERNAME = process.env.SAUCE_USERNAME;
const SAUCE_ACCESS_KEY = process.env.SAUCE_ACCESS_KEY;
// const ONDEMAND_URL = `https://${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY}@ondemand.us-west-1.saucelabs.com:443/wd/hub`;
// NOTE: Use the URL below if using our EU datacenter (e.g. logged in to app.eu-central-1.saucelabs.com)
const ONDEMAND_URL = `https://${SAUCE_USERNAME}:${SAUCE_ACCESS_KEY}@ondemand.eu-central-1.saucelabs.com:443/wd/hub`;


/**
* Run this test before working on the problem.
* When you view the results on your dashboard, you'll see that the test "Failed".
* Your job is to figure out why the test failed and make the changes necessary to make the test pass.
* Once you get the test working, update the code so that when the test runs, it can reach the Sauce Labs homepage,
* hover over 'Developers' and then clicks the 'Documentation' link
*/

describe('Broken Sauce', function () {
    it('should go to Google and click Sauce', async function () {

        try {
            const chromeOptions = new chrome.Options();
            chromeOptions.addArguments('--disable-blink-features=AutomationControlled');
            chromeOptions.excludeSwitches(['enable-automation']);

            let driver = await new Builder().withCapabilities(utils.brokenCapabilities).setChromeOptions(chromeOptions).usingServer(ONDEMAND_URL).build();

            await driver.get("https://www.google.com");
            // If you see a German or English GDPR modal on google.com you 
            // will have to code around that or use the us-west-1 datacenter.
            // You can investigate the modal elements using a Live Test(https://app.saucelabs.com/live/web-testing)

            // Handle GDPR cookie consent if it appears
            try {
                const acceptButton = await driver.wait(
                    until.elementLocated(By.xpath('//button[contains(., "Alle akzeptieren")]')),
                    3000
                )
                await acceptButton.click()
            } catch (e) {
                console.log('No cookie consent modal found')
            }
    
            // Search field name changed from "Search" to "q"
            let search = await driver.findElement(By.name("q"));
            await search.sendKeys("Sauce Labs");

            // I was not able to continue from here as google.com is requesting to verify recaptcha
            let button = await driver.findElement(By.name("btnK"))
            await button.click()
            

            let page = await driver.findElement(By.partialLinkText("sauce"));
    
            await driver.quit();
        } catch (err) {
            // hack to make this pass for Gitlab CI
            // candidates can ignore this
            if (process.env.GITLAB_CI === 'true') {
                console.warn("Gitlab run detected.");
                console.warn("Skipping error in brokenSauce.js");
            } else {
                throw err;
            }
        }

    });
});
