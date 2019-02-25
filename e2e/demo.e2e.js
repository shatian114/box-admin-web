import puppeteer from 'puppeteer';

describe('demo', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000000;
    page = await browser.newPage();
    await page.goto('http://localhost:8000');
    await page.type('#username', 'f22');
    await page.type('#password', '123456');
    await page.click('button[type="submit"]');
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:8000');
    await page.waitForSelector('a[href="/PlanFarmerboxneed"]'); // should display error
    await page.click('a[href="/PlanFarmerboxneed"]');
    await page.waitForSelector('.anticon-plus');
  });

  function orderLoop(counttt) {
    it(`农户增加需求单${counttt}`, async () => {
      console.log(333);
      await page.screenshot({ path: './e2e/screen/modal.png' });
      const links = await page.$$('.ant-btn-primary');
      await links[1].click();
      await page.waitForSelector('.ant-modal-body');
      console.log(444);
      await page.waitFor(() => !document.querySelector('.ant-spin.ant-spin-spinning'));
      console.log(555);
      const links2 = await page.$$('.ant-calendar-picker-input');
      await links2[2].click();
      await page.focus('.ant-calendar-input');
      await page.keyboard.down('Control');
      await page.keyboard.press('KeyA');
      await page.keyboard.up('Control');
      let month = Math.floor(Math.random() * 13);
      if (month.toString().length < 2) month = `0${month.toString()}`;
      let day = Math.floor(Math.random() * 30);
      if (day.toString().length < 2) day = `0${day.toString()}`;
      await page.waitForSelector('.ant-calendar-input');
      await page.type('.ant-calendar-input', `2018-${month}-${day} 17:04:40`);
      await page.click('.ant-calendar-ok-btn');
      await page.type('#needDesc', `这是自动生成第${counttt}条`);
      await page.type('#needCount', Math.floor(Math.random() * 300).toString());
      const select = await page.$$('.ant-select-selection__rendered');
      select[3].click();
      await page.waitForSelector('.ant-select-dropdown-menu-item');
      const selectMenus = await page.$$('.ant-select-dropdown-menu-item');
      selectMenus[Math.floor(Math.random() * 3)].click();
      console.log(`这是自动生成第${counttt}条`);
      const bc = await page.$$('.ant-btn-primary');
      await bc[2].click();
      console.log(666);
      await page.waitFor(() => !document.querySelector('.ant-modal-body'));

      console.log(777);
      expect(true).toBe(true);
    });
  }
  for (let i = 1; i < 60; i += 1) {
    const count = i;
    orderLoop(count);
  }
  // it('测试页面登录', async () => {
  //   await page.type('#username', 'admin');
  //   await page.type('#password', '123456');
  //   await page.click('button[type="submit"]');
  //   await page.waitForSelector('a[href="/bigInOrder"]'); // should display error
  // });
  // it('大批量录入', async () => {
  //   await page.click('a[href="/bigInOrder"]');
  //   await page.waitForSelector('a[href="/bigInOrder/storage"');
  //   await page.click('a[href="/bigInOrder/storage"]');
  //   await page.waitForSelector('.anticon-caret-right');

  //   const links = await page.$$('.ant-btn-primary');
  //   await links[2].click();
  //   await page.waitForSelector('.ant-modal-title');
  //   await page.screenshot({ path: './e2e/screen/modal.png' });
  // });

  afterEach(() => {
    page.close();
  });

  afterAll(() => {
    browser.close();
  });
});
