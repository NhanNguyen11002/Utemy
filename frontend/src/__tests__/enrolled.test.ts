import { setupDriver, By, until, Key } from "./setup";

describe("navigate signup, forgot-password, blog,search all course, can not go to enrolled, my-course test", () => {
    let driver: any;

    beforeAll(async () => {
        driver = await setupDriver();
    });

    afterAll(async () => {
        await driver.quit();
    });

    test("should able to navigate to signup page", async () => {
        await driver.get("http://localhost:3000/login");
        const signupText = await driver.findElement(By.css('span.font-medium > a[href="/signup"]'));

        await signupText.click();

        const text = await driver.getCurrentUrl();

        expect(text).toContain("signup");
    });

    test("should able to navigate to forgot password page", async () => {
        await driver.get("http://localhost:3000/login");
        const signupText = await driver.findElement(By.css('span.font-medium > a[href="/forgot-password"]'));

        await signupText.click();

        const text = await driver.getCurrentUrl();
        expect(text).toContain("password");
    });

    test("should able to navigate to blog homepage", async () => {
        await driver.get("http://localhost:3000/blog");

        const text = await driver.getCurrentUrl();
        expect(text).toContain("blog");
    });

    test("should be able to search all course", async () => {
        await driver.get("http://localhost:3000/all-courses");

        await driver.findElement(By.id("search-course")).sendKeys("hoa ngữ", Key.RETURN);
        const text = await driver.findElement(By.css("p.text-2xl")).getText();

        console.log(`Text of element with class "text-2xl": ${text}`);
        expect(text).toContain("Tìm thấy");
    });
    //test private route
    test("should not be able to go to enrolled courses", async () => {
        await driver.get("http://localhost:3000/my-enrolled-courses");

        const text = await driver.getCurrentUrl();
        expect(text).toBe("http://localhost:3000/");
    });
    test("should not be able to go to lecturer route", async () => {
        await driver.get("http://localhost:3000/lecturer");

        const text = await driver.getCurrentUrl();
        expect(text).toBe("http://localhost:3000/");
    });
});
