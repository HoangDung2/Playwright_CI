import { chromium, expect, Page, test, Locator } from '@playwright/test';
import {Admin} from "../Admin";
import {User,data,} from '../fileData';
test.describe("Test case login", async () => {
  test.beforeEach(async ({ page,baseURL}) => {
   await page.goto(`${baseURL}web/index.php/auth/login`);
});
  data.tc.forEach((element:User,index:number) => {
    test("Happy case: "+index.toString(), async ({page,baseURL},testInfo) => {
      const admin = new Admin(page);
      await page.goto(`${baseURL}web/index.php/auth/login`);
      await admin.Login.loginId(element.username,element.password);
      let username = await page.locator("xpath=//input[@name='username']");
      await expect(username).toBeVisible();
      const screenshot = await page.screenshot();
      await testInfo.attach('Verify should be fill username & password', { body: screenshot, contentType: 'image/png/jpeg' });
      await admin.Login.submitLogin();
      let logo = await page.locator("xpath=//img[@src='/web/images/orangehrm-logo.png?v=1683010990518']");
      await expect(logo).toBeVisible();
      await testInfo.attach('Verify Succes', { body: screenshot, contentType: 'image/png/jpeg' });
    })
  });
  data.tc_unfill.forEach((element:User,index:number) => {
    test("Unfill unsername & password: "+index.toString(), async ({ page,baseURL},testInfo) => {
      const admin = new Admin(page);
      const screenshot = await page.screenshot();
      await admin.Login.loginId(element.username,element.password);
      await admin.Login.submitLogin();
      let ms = await page.locator("span.oxd-input-group__message").first();
      await expect(ms).toBeVisible();
      await testInfo.attach('Verify Required Username & Password', { body: screenshot, contentType: 'image/png/jpeg' });
    })
  });
  data.tc_false.forEach((element:User,index:number) => {
    test("Fill unsername & password invalid: "+index.toString(), async ({ page,baseURL},testInfo) => {
      const admin = new Admin(page);
      const screenshot = await page.screenshot();
      await admin.Login.loginId(element.username,element.password);
      await admin.Login.submitLogin();
      let ms = await page.locator("p.oxd-alert-content-text");
      await expect(ms).toBeVisible();
      await testInfo.attach('Verify Invalid credentials', { body: screenshot, contentType: 'image/png/jpeg' });
    })
  });
})
