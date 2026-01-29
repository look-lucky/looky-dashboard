
import puppeteer from 'puppeteer';

(async () => {
    console.log('Starting E2E Test...');
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    try {
        // 1. Visit Home Page (Login might be required, so we check redirection or login page)
        console.log('Navigating to http://localhost:5173...');
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

        const title = await page.title();
        console.log(`Page title: ${title}`);

        // Check if we are on login page or home page
        const url = page.url();
        console.log(`Current URL: ${url}`);

        if (url.includes('/login')) {
            console.log('Redirected to login. attempting to login...');
            // TODO: Implement login if credentials are known or if we mock auth.
            // For now, just verifying the app serves and redirects is a good smoke test.
            // But let's try to verify the title contains "Looky" or similar?
        } else {
            console.log('On main page.');
            // Check for Sidebar
            const sidebar = await page.$('aside'); // Assuming sidebar uses <aside> or standard structure
            if (sidebar) {
                console.log('Sidebar detected.');
            } else {
                console.log('Sidebar NOT detected.');
            }
        }

        // 2. Visit a university specific page to check syntax safety
        // Note: If protected, we might need to be logged in. 
        // This test assumes dev server is running locally.

        console.log('E2E Test Success: Application loads without crashing.');

    } catch (error) {
        console.error('E2E Test Failed:', error);
        process.exit(1);
    } finally {
        await browser.close();
    }
})();
