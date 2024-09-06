const puppeteer = require('puppeteer');

function getRandomText(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function getRandomDelay(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

async function interactWithPage() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('http://127.0.0.1:5500/captchured-frontend/index.html');

    // Filling the enrolment ID
    await page.waitForSelector('input#enrolment-id');
    await new Promise(resolve => setTimeout(resolve, getRandomDelay(500, 1500)));
    const enrolmentId = Math.floor(Math.random() * 100000000000000).toString().padStart(14, '0');
    await page.type('input#enrolment-id', enrolmentId);

    // Filling the date
    await page.waitForSelector('input#eid-date');
    await new Promise(resolve => setTimeout(resolve, getRandomDelay(500, 1500)));
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
    const dateString = randomDate.toISOString().split('T')[0];
    await page.type('input#eid-date', dateString);

    // Filling the time
    await page.waitForSelector('input#eid-time');
    await new Promise(resolve => setTimeout(resolve, getRandomDelay(500, 1500)));
    const randomHour = Math.floor(Math.random() * 24).toString().padStart(2, '0');
    const randomMinute = Math.floor(Math.random() * 60).toString().padStart(2, '0');
    const timeString = `${randomHour}:${randomMinute}`;
    await page.type('input#eid-time', timeString);

    // Click submit
    await page.waitForSelector('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, getRandomDelay(1000, 2000)));
    await page.click('button[type="submit"]');

    // Collect interaction data
    const postData = {
        key_count: 0, // You can log actual key count from a previous script if needed
        key_sequence: [], // Key sequence could be gathered similar to key press listener
        time_delay: [], // Time delay data could be gathered if necessary
        mouse_movements: [], // Log real mouse movements if you capture them on the bot side
        mouse_clicks: [], // Same for clicks
        total_time: 0, // Log time spent on the page if relevant
        environment: {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: await page.evaluate(() => navigator.language),
            cpu: await page.evaluate(() => navigator.hardwareConcurrency),
            browser: await page.evaluate(() => navigator.userAgent),
            os: await page.evaluate(() => navigator.platform),
            deviceType: /Mobi|Tablet/.test(await page.evaluate(() => navigator.userAgent)) ? "Mobile/Tablet" : "Desktop",
        }
    };

    // Sending the interaction data to the backend via POST request
    await page.evaluate(async (postData) => {
        await fetch('http://localhost:3000/capture', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData),
        });
    }, postData);

    // Keep the page open for a specific amount of time (30 minutes in this case)
    console.log('Keeping the browser open for 30 minutes...');
    await new Promise(resolve => setTimeout(resolve, 30 * 60 * 1000)); // 30 minutes delay

    // Closing the browser after the delay
    await browser.close();
}

interactWithPage();
