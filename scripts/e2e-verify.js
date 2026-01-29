import puppeteer from 'puppeteer';

(async () => {
    console.log('Starting E2E Verification...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        // 0. Login
        console.log('Navigating to Login...');
        await page.goto('http://localhost:5173/login', { waitUntil: 'domcontentloaded' });
        await page.type('input[name="username"]', 'admin');
        await page.type('input[name="password"]', '0000');
        await page.click('button[type="submit"]');
        // Wait for dashboard element instead of navigation
        try {
            await page.waitForSelector('nav', { timeout: 5000 });
            console.log('✅ Login Successful (Dashboard detected)');
        } catch (e) {
            console.error('❌ Login Failed or Dashboard not loaded');
            // Capture any alert
            page.on('dialog', async dialog => {
                console.log('Alert detected:', dialog.message());
                await dialog.dismiss();
            });
        }

        // 1. Visit Home
        console.log('Navigating to Home...');
        await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded' });
        const content = await page.content();
        if (content.includes('Looky Admin')) {
            console.log('✅ Home Page Loaded');
        } else {
            console.error('❌ Home Page Content Mismatch');
        }

        // 2. Visit Commercial Areas
        console.log('Navigating to Commercial Areas...');
        await page.goto('http://localhost:5173/commercial-areas', { waitUntil: 'domcontentloaded' });
        const commContent = await page.content();
        if (commContent.includes('기초 상권 관리')) {
            console.log('✅ Commercial Areas Page Loaded');
        } else {
            console.error('❌ Commercial Areas Page Failed');
        }

        // 3. Visit Partnerships
        console.log('Navigating to Partnerships...');
        await page.goto('http://localhost:5173/partnerships', { waitUntil: 'domcontentloaded' });
        const partnerContent = await page.content();
        if (partnerContent.includes('제휴 혜택 관리')) {
            console.log('✅ Partnerships Page Loaded');
        } else {
            console.error('❌ Partnerships Page Failed');
        }

        // 4. Visit Universities
        console.log('Navigating to Universities...');
        await page.goto('http://localhost:5173/universities', { waitUntil: 'domcontentloaded' });
        const uniContent = await page.content();
        if (uniContent.includes('대학 관리')) {
            console.log('✅ Universities Page Loaded');
        } else {
            console.error('❌ Universities Page Failed');
        }

        // 5. Visit Organizations

        console.log('Navigating to Organizations...');
        await page.goto('http://localhost:5173/organizations');
        await page.waitForSelector('h1', { timeout: 10000 });
        console.log('✅ Organizations Page Loaded');

        console.log('Testing Logout...');
        const logoutBtn = await page.$('button[title="로그아웃"]');
        if (logoutBtn) {
            await logoutBtn.click();
            await page.waitForSelector('form', { timeout: 10000 });
            const url = page.url();
            if (url.includes('/login')) {
                console.log('✅ Logout Successful (Redirected to Login)');
            } else {
                console.error('❌ Logout Failed: URL is ' + url);
                process.exit(1);
            }
        } else {
            console.error('❌ Logout Button Not Found');
            process.exit(1);
        }

        console.log('E2E Verification Completed.');

    } catch (error) {
        console.error('E2E Verification Failed:', error);
    } finally {
        await browser.close();
    }
})();
