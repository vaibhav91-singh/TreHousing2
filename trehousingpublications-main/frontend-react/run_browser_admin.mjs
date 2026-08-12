import { chromium } from 'playwright';

async function fillAdminData() {
  console.log('🚀 Launching Chrome browser to operate Admin Panel...');
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. Open Live Website Admin
    console.log('Opening https://trehousingpublications.com/admin ...');
    await page.goto('https://trehousingpublications.com/admin');
    await page.waitForTimeout(3000);

    // 2. Check for Passcode input
    const passcodeField = page.locator('input[type="password"]');
    if (await passcodeField.isVisible()) {
      console.log('Entering Passcode admin123 ...');
      await passcodeField.fill('admin123');
      await page.click('button:has-text("Unlock Control Center")');
      await page.waitForTimeout(3000);
    }

    // 3. Fill Jobs Form
    console.log('Filling Job Vacancy Form via UI...');
    const jobsTab = page.locator('button:has-text("Jobs & Vacancies")');
    if (await jobsTab.isVisible()) {
      await jobsTab.click();
      await page.waitForTimeout(1000);
      
      const inputs = page.locator('form input');
      if (await inputs.count() > 0) {
        await inputs.nth(0).fill('BPSC TRE 4.0 Teacher Recruitment 2026');
        await inputs.nth(1).fill('BPSC Bihar');
        await inputs.nth(2).fill('Patna, Bihar');
        await inputs.nth(3).fill('BPSC');
        await inputs.nth(4).fill('87,000+ Posts');
        await inputs.nth(5).fill('Graduation + B.Ed');
        
        await page.click('button:has-text("Publish Job Vacancy")');
        await page.waitForTimeout(2000);
      }
    }

    // 4. Fill Recent Updates Form
    console.log('Filling Recent Updates Form via UI...');
    const updatesTab = page.locator('button:has-text("Recent Updates")');
    if (await updatesTab.isVisible()) {
      await updatesTab.click();
      await page.waitForTimeout(1000);

      const inputs = page.locator('form input');
      const textareas = page.locator('form textarea');

      await inputs.nth(0).fill('UPSC CSE 2026 Admit Card Released');
      await textareas.nth(0).fill('Download your admit card from the official UPSC portal now.');
      await inputs.nth(1).fill('https://upsc.gov.in');

      await page.click('button:has-text("Publish Update")');
      await page.waitForTimeout(2000);
    }

    // 5. Fill Study Materials Form
    console.log('Filling Study Material Form via UI...');
    const studyTab = page.locator('button:has-text("Study Materials")');
    if (await studyTab.isVisible()) {
      await studyTab.click();
      await page.waitForTimeout(1000);

      const inputs = page.locator('form input');
      await inputs.nth(0).fill('UPSC CSE');
      await inputs.nth(1).fill('Indian Polity');
      await inputs.nth(2).fill('Constitution Notes Part 1');
      await inputs.nth(3).fill('https://drive.google.com/file/d/sample-polity-notes/view');

      await page.click('button:has-text("Add Study Material")');
      await page.waitForTimeout(2000);
    }

    console.log('🎉 Browser Operations Completed Successfully!');
  } catch (err) {
    console.error('Error during browser operation:', err);
  } finally {
    await browser.close();
  }
}

fillAdminData();
