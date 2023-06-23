import { chromium, expect, Page, test, Locator } from '@playwright/test';
import {saveVideo} from 'playwright-video';
import {Admin} from "../Admin";
import {User,data,} from '../fileData';
test.describe("Test case login", async () => {
  test.beforeEach(async ({ page,baseURL}) => {
   await page.goto(`${baseURL}web/index.php/auth/login`);
});
  data.tc_happy.forEach((element:User,index:number) => {
    test("Happy case: "+index.toString(), async ({page,baseURL},testInfo) => {
      const admin = new Admin(page);
      const video = await saveVideo(page,"video Happy_Case"+index.toString()+" .mp4");
      await admin.Login.loginId(element.username,element.password);
      let username = await page.locator("input[name='username']");
      await expect(username).toHaveValue(element.username);
      const VerifyFillUser = await page.screenshot();
      await testInfo.attach('Verify should be fill username & password', { body: VerifyFillUser, contentType: 'image/png' });
      await admin.Login.submitLogin();
      let logo = await page.locator('div.oxd-brand-banner');
      await expect(logo).toBeVisible();
      const VerifySucces = await page.screenshot();
      await testInfo.attach('Verify Succes', { body: VerifySucces, contentType: 'image/png' });
      await page.waitForTimeout(500);
      await video.stop();
    })
  });
  data.tc_unfill.forEach((element:User,index:number) => {
    test("Unfill unsername & password: "+index.toString(), async ({ page,baseURL},testInfo) => {
      const admin = new Admin(page);
      const video = await saveVideo(page,"video Unfill_Case"+index.toString()+" .mp4");
      await admin.Login.loginId(element.username,element.password);
      await admin.Login.submitLogin();
      let message =page.locator("span.oxd-input-group__message").first();
      await expect(message).toBeVisible();
      const VerifyRequired = await page.screenshot();
      await testInfo.attach('Verify Required Username & Password', { body: VerifyRequired, contentType: 'image/png'})
      await page.waitForTimeout(500);
      await video.stop();
    })
  });
  data.tc_false.forEach((element:User,index:number) => {
    test("Fill unsername & password invalid: "+index.toString(), async ({ page,baseURL},testInfo) => {
      const admin = new Admin(page);
      const video = await saveVideo(page,"video False_Case"+index.toString()+" .mp4");
      await admin.Login.loginId(element.username,element.password);
      let username = await page.locator("input[name='username']");
      await expect(username).toHaveValue(element.username);
      const VerifyFillUser = await page.screenshot();
      await testInfo.attach('Verify should be fill username & password', { body: VerifyFillUser, contentType: 'image/png' });
      await admin.Login.submitLogin();
      let message = await page.locator("p.oxd-alert-content-text");
      await expect(message).toBeVisible();
      const VerifyInvalid = await page.screenshot();
      await testInfo.attach('Verify Invalid credentials', { body: VerifyInvalid, contentType: 'image/png' })
      await page.waitForTimeout(500);
      await video.stop();
    })
  });
})
