import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9223; // Use distinct port
const OUT_DIR = path.resolve('playstore_assets');

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function captureDeviceScreens(title, prefix, width, height, scale = 1) {
  console.log(`\n========================================`);
  console.log(`Capturing ${title} (${width}x${height})...`);
  console.log(`========================================`);

  const tempDir = path.resolve('node_modules', `.chrome_temp_${prefix}`);
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
      // retry
    }
  }

  if (!tabs) {
    chrome.kill();
    throw new Error(`Could not connect to Chrome on port ${PORT}`);
  }

  const pageTab = tabs.find(t => t.type === 'page') || tabs[0];
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

  await send('Emulation.setDeviceMetricsOverride', {
    width: Math.round(width / scale),
    height: Math.round(height / scale),
    deviceScaleFactor: scale,
    mobile: false,
    fitWindow: false
  });

  await send('Page.navigate', { url: 'http://127.0.0.1:4173/' });
  await sleep(2000);

  // Set guest mode and dark mode
  await send('Runtime.evaluate', {
    expression: `
      localStorage.setItem('pocketUPSC_guestMode', 'true');
      localStorage.setItem('pocketUPSC_themeMode', 'dark');
      document.documentElement.classList.add('dark');
      window.location.href = 'http://127.0.0.1:4173/';
    `
  });
  await sleep(4000);

  async function takeScreenshot(filename) {
    const res = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    const buffer = Buffer.from(res.data, 'base64');
    const targetPath = path.join(OUT_DIR, filename);
    fs.writeFileSync(targetPath, buffer);
    console.log(`Saved: ${filename} (${buffer.length} bytes)`);
  }

  // 1. Dashboard
  console.log(`[${prefix}] 1. Dashboard...`);
  await takeScreenshot(`${prefix}_1_dashboard.png`);

  // 2. Syllabus Tracker (aside nav button 1)
  console.log(`[${prefix}] 2. Syllabus Tracker...`);
  await send('Runtime.evaluate', {
    expression: `document.querySelectorAll('aside nav button')[1]?.click();`
  });
  await sleep(2500);
  await takeScreenshot(`${prefix}_2_tracker.png`);

  // 3. Learn Repository (aside nav button 2)
  console.log(`[${prefix}] 3. Learn Repository...`);
  await send('Runtime.evaluate', {
    expression: `document.querySelectorAll('aside nav button')[2]?.click();`
  });
  await sleep(2500);
  await takeScreenshot(`${prefix}_3_learn.png`);

  // 4. Mains Desk (aside nav button 3)
  console.log(`[${prefix}] 4. Mains Desk...`);
  await send('Runtime.evaluate', {
    expression: `document.querySelectorAll('aside nav button')[3]?.click();`
  });
  await sleep(2500);
  await takeScreenshot(`${prefix}_4_mains.png`);

  // 5. Practice Vault (aside nav button 4)
  console.log(`[${prefix}] 5. Practice Vault...`);
  await send('Runtime.evaluate', {
    expression: `document.querySelectorAll('aside nav button')[4]?.click();`
  });
  await sleep(2500);
  await takeScreenshot(`${prefix}_5_quiz.png`);

  ws.close();
  chrome.kill();
  await sleep(1500);
}

async function main() {
  try {
    // 1. 7-inch Tablet (1920 x 1200 landscape)
    await captureDeviceScreens("7-inch Tablet", "tablet_7inch", 1920, 1200, 1.5);

    // 2. 10-inch Tablet (2560 x 1600 landscape)
    await captureDeviceScreens("10-inch Tablet", "tablet_10inch", 2560, 1600, 2);

    // 3. Chromebook / Desktop (1920 x 1080 landscape)
    await captureDeviceScreens("Chromebook / Desktop", "desktop", 1920, 1080, 1);

    console.log("\nAll Tablet and Desktop screenshots successfully captured!");
  } catch (err) {
    console.error("Error capturing tablet/desktop screens:", err);
  }
}

main();
