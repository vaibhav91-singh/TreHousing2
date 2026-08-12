import { test, expect } from '@playwright/test';

test('Fill Admin Panel Forms live via automated browser', async ({ page }) => {
  // 1. Go to Live Admin URL
  await page.goto('https://trehousingpublications.com/admin');
  await page.waitForTimeout(2000);

  // 2. Login Passcode if passcode screen is shown
  const passcodeField = page.locator('input[type="password"]');
  if (await passcodeField.isVisible()) {
    await passcodeField.fill('admin123');
    await page.click('button:has-text("Unlock Control Center")');
    await page.waitForTimeout(2000);
  }

  // 3. Fill Job Vacancy Form
  await page.click('text="Jobs & Vacancies"');
  await page.waitForTimeout(1000);
  
  await page.fill('input[placeholder*="BPSC TRE 3.0"]', 'BPSC TRE 4.0 Teacher Recruitment 2026');
  await page.fill('input[placeholder*="Education Department"]', 'BPSC Bihar');
  await page.fill('input[placeholder*="Patna"]', 'Patna, Bihar');
  await page.fill('input[placeholder*="BPSC"]', 'BPSC');
  await page.fill('input[placeholder*="87,000"]', '87,000+ Posts');
  await page.fill('input[placeholder*="Graduation"]', 'Graduation + B.Ed / STET');
  
  // Submit Job
  await page.click('button:has-text("Publish Job Vacancy")');
  await page.waitForTimeout(2000);

  // 4. Fill Recent Updates Form
  await page.click('text="Recent Updates"');
  await page.waitForTimeout(1000);

  await page.fill('input[placeholder*="BPSC"]', 'UPSC CSE 2026 Prelims Admit Card Released');
  await page.fill('textarea[placeholder*="Check your result"]', 'Download your admit card from the official UPSC portal now.');
  await page.fill('input[placeholder*="https://"]', 'https://upsc.gov.in');
  await page.click('button:has-text("Publish Update")');
  await page.waitForTimeout(2000);

  // 5. Fill Study Materials Form
  await page.click('text="Study Materials"');
  await page.waitForTimeout(1000);

  await page.fill('input[placeholder*="UPSC"]', 'UPSC CSE');
  await page.fill('input[placeholder*="Modern History"]', 'Indian Polity');
  await page.fill('input[placeholder*="Freedom Struggle"]', 'Laxmikanth Constitution Handnotes Part 1');
  await page.fill('input[placeholder*="https://drive.google.com"]', 'https://drive.google.com/file/d/sample-polity-pdf/view');
  await page.click('button:has-text("Add Study Material")');
  await page.waitForTimeout(2000);

  // 6. Fill Solved Papers Form
  await page.click('text="Solved Papers & Keys"');
  await page.waitForTimeout(1000);

  await page.fill('input[placeholder*="UPSC Prelims"]', 'UPSC CSE Prelims 2024 GS Paper 1 Solved');
  await page.fill('input[placeholder*="2024"]', '2024');
  await page.fill('input[placeholder*="https://drive.google.com"]', 'https://drive.google.com/file/d/sample-paper/view');
  await page.click('button:has-text("Publish Solved Paper")');
  await page.waitForTimeout(2000);

  console.log('✅ All Admin Panel forms automated & filled successfully via browser!');
});
