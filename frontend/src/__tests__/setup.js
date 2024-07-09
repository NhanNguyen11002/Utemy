const { Builder, By, until, Key } = require("selenium-webdriver");
require("chromedriver");

const setupDriver = async () => {
    const driver = await new Builder().forBrowser("chrome").build();
    return driver;
};
module.exports = {
    setupDriver,
    By,
    until,
    Key,
};
