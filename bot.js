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

// Main bot interaction function
async function interactWithPage() {
    const browser = await puppeteer.launch({
        headless: false, // Set to true if you don't want to open the browser window
    });
    const page = await browser.newPage();

    await page.goto('http://127.0.0.1:5500/captchured-frontend/index.html'); 
  
    await page.waitForSelector('input#enrolment-id');
   
    await new Promise(resolve => setTimeout(resolve, getRandomDelay(500, 1500)));
 
    const enrolmentId = Math.floor(Math.random() * 100000000000000).toString().padStart(14, '0');
    await page.type('input#enrolment-id', enrolmentId);

    await page.waitForSelector('input#eid-date');
    await new Promise(resolve => setTimeout(resolve, getRandomDelay(500, 1500)));
    
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
    const dateString = randomDate.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    await page.type('input#eid-date', dateString);

    await page.waitForSelector('input#eid-time');
    await new Promise(resolve => setTimeout(resolve, getRandomDelay(500, 1500)));

    const randomHour = Math.floor(Math.random() * 24).toString().padStart(2, '0');
    const randomMinute = Math.floor(Math.random() * 60).toString().padStart(2, '0');
    const timeString = `${randomHour}:${randomMinute}`;
    await page.type('input#eid-time', timeString);

    await page.waitForSelector('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, getRandomDelay(1000, 2000)));
    await page.click('button[type="submit"]');

    await new Promise(resolve => setTimeout(resolve, 5000)); // Adjust based on the backend's response time

    await browser.close();
}

interactWithPage();
