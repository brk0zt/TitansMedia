import { chromium } from 'playwright';

async function testCookieAuth() {
  console.log('🧪 Testing cookie-based Facebook authentication...');
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();
    
    console.log('📍 Navigating to facebook.com...');
    await page.goto('https://www.facebook.com/', { 
      waitUntil: 'networkidle', 
      timeout: 30000 
    });
    
    await page.waitForTimeout(2000);
    
    const url = page.url();
    console.log(`📍 Current URL: ${url}`);
    
    const isLoggedIn = !url.includes('login') && !url.includes('checkpoint');
    console.log(`✅ Login status: ${isLoggedIn ? 'LOGGED IN' : 'NOT LOGGED IN'}`);
    
    if (!isLoggedIn) {
      console.log('⚠️  No valid session cookies provided');
      console.log('   This is expected for first run');
    } else {
      console.log('🎉 Session valid! Can proceed with automation');
      
      console.log('📍 Testing navigation to Business Manager...');
      await page.goto('https://business.facebook.com/', { 
        waitUntil: 'networkidle', 
        timeout: 30000 
      });
      await page.waitForTimeout(3000);
      console.log(`📍 Business Manager URL: ${page.url()}`);
    }
    
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  } finally {
    await browser.close();
    console.log('✅ Test completed');
  }
}

testCookieAuth();