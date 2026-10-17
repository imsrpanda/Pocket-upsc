import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9222;
const OUT_DIR = path.resolve('playstore_assets');

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log("Launching Headless Chrome on port " + PORT + "...");
  const tempDir = path.resolve('node_modules', '.chrome_temp');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${tempDir}`,
    '--disable-gpu',
    '--no-first-run',
    '--remote-debugging-address=127.0.0.1',
    '--no-default-browser-check'
  ]);

  let tabs = null;
  for (let i = 0; i < 15; i++) {
    await sleep(1000);
    try {
      const listRes = await fetch(`http://127.0.0.1:${PORT}/json`);
      tabs = await listRes.json();
      if (tabs && tabs.length > 0) break;
    } catch (e) {
      // waiting
    }
  }

  try {
    if (!tabs) throw new Error("Could not connect to Chrome debugging port after 15 seconds!");
    const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
    if (!pageTab) throw new Error("No page tab found!");

    console.log("Connecting to WebSocket: " + pageTab.webSocketDebuggerUrl);
    const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && callbacks.has(data.id)) {
        const { resolve, reject } = callbacks.get(data.id);
        callbacks.delete(data.id);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        callbacks.set(msgId, { resolve, reject });
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');

    // 📱 Set standard 1080 x 2400 mobile phone dimensions (412 x 915 with scale factor 2.625)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 412,
      height: 915,
      deviceScaleFactor: 2.625,
      mobile: true,
      fitWindow: false
    });

    console.log("Navigating to http://127.0.0.1:4173/...");
    await send('Page.navigate', { url: 'http://127.0.0.1:4173/' });
    await sleep(3000);

    console.log("Configuring localStorage for Guest mode & Dark theme...");
    await send('Runtime.evaluate', {
      expression: `
        localStorage.setItem('pocketUPSC_guestMode', 'true');
        localStorage.setItem('pocketUPSC_themeMode', 'dark');
        document.documentElement.classList.add('dark');
        window.location.href = 'http://127.0.0.1:4173/';
      `
    });

    // Wait for reload and data seed
    await sleep(5000);

    async function takeScreenshot(filename) {
      const res = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      const buffer = Buffer.from(res.data, 'base64');
      const targetPath = path.join(OUT_DIR, filename);
      fs.writeFileSync(targetPath, buffer);
      console.log(`Saved screenshot: ${filename} (${buffer.length} bytes)`);
    }

    // 1. Dashboard
    console.log("Capturing Screenshot 1: Dashboard Hub...");
    await takeScreenshot('screenshot_1_dashboard.png');

    // 2. Syllabus Tracker (footer button 1)
    console.log("Navigating to Syllabus Tracker (tab 1)...");
    await send('Runtime.evaluate', {
      expression: `document.querySelectorAll('footer button')[1]?.click();`
    });
    await sleep(2500);
    await takeScreenshot('screenshot_2_tracker.png');

    // 3. Learn Repository (footer button 2)
    console.log("Navigating to Learn Repository (tab 2)...");
    await send('Runtime.evaluate', {
      expression: `document.querySelectorAll('footer button')[2]?.click();`
    });
    await sleep(2500);
    await takeScreenshot('screenshot_3_learn.png');

    // 4. Mains Desk (footer button 3)
    console.log("Navigating to Mains Desk (tab 3)...");
    await send('Runtime.evaluate', {
      expression: `document.querySelectorAll('footer button')[3]?.click();`
    });
    await sleep(2500);
    await takeScreenshot('screenshot_4_mains.png');

    // 5. Practice Quiz (footer button 4)
    console.log("Navigating to Practice Quiz (tab 4)...");
    await send('Runtime.evaluate', {
      expression: `document.querySelectorAll('footer button')[4]?.click();`
    });
    await sleep(2500);
    await takeScreenshot('screenshot_5_quiz.png');

    // 6. Settings (footer button 5)
    console.log("Navigating to Settings (tab 5)...");
    await send('Runtime.evaluate', {
      expression: `document.querySelectorAll('footer button')[5]?.click();`
    });
    await sleep(2500);
    await takeScreenshot('screenshot_6_settings.png');

    ws.close();
    console.log("All 6 screenshots captured successfully!");
  } catch (err) {
    console.error("Screenshot error:", err);
  } finally {
    chrome.kill();
  }
}

main();
