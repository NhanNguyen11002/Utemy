import { setupDriver, By, until, Key } from "./setup";

describe("Title, login, navigate enrolled, my-course test, cannot navigate to admin page", () => {
    let driver: any;

    beforeAll(async () => {
        driver = await setupDriver();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test("should have the correct title", async () => {
        await driver.get("http://localhost:3000");

        await driver.wait(until.elementLocated(By.css("div.App")), 10000);

        const title = await driver.getTitle();
        console.log(`Page title: ${title}`);
        expect(title).toBe("Utemy");
    });

    test("should able to login", async () => {
        await driver.get("http://localhost:3000/login");

        await driver.findElement(By.id("email")).sendKeys("ntnhan11002@gmail.com");
        await driver.findElement(By.id("password")).sendKeys("12345678");
        await driver.findElement(By.id("login-button")).click();

        const toastLocator = By.css('[role="status"]');
        const toast = await driver.wait(until.elementLocated(toastLocator), 10000);

        const toastText = await toast.getText();
        console.log(`Toast text: ${toastText}`);
        expect(toastText).toContain("Đăng nhập thành công");
    });

    test("should be able to go to enrolled courses", async () => {
        await driver.get("http://localhost:3000/my-enrolled-courses");

        const text = await driver.getCurrentUrl();
        expect(text).toContain("enrolled");
    });

    test("should be able to go to my courses", async () => {
        await driver.get("http://localhost:3000/lecturer");

        const text = await driver.getCurrentUrl();
        expect(text).toContain("lecturer");
    });
    //test admin route
    test("should not be able to go to admin route", async () => {
        await driver.get("http://localhost:3000/admin");

        const text = await driver.getCurrentUrl();
        expect(text).toBe("http://localhost:3000/");
    });
});
