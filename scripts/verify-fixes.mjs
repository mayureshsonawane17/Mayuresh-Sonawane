import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const DOCS_DIR = 'docs/hero-verification';
fs.mkdirSync(DOCS_DIR, { recursive: true });

async function run() {
  console.log('Starting Headless Chrome on port 9225...');
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--disable-gpu',
    '--mute-audio',
    'about:blank',
  ]);

  await new Promise((r) => setTimeout(r, 1200));

  let targets;
  try {
    const targetsRes = await fetch('http://localhost:9225/json/list');
    targets = await targetsRes.json();
  } catch (err) {
    console.error('Failed to connect to Chrome:', err.message);
    chrome.kill();
    process.exit(1);
  }

  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let msgId = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(new Error(data.error.message));
      else resolve(data.result);
    }
  };

  await new Promise((r) => (ws.onopen = r));

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async function evaluate(expression) {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    return res.result ? res.result.value : null;
  }

  async function capture(filename) {
    const res = await send('Page.captureScreenshot', { format: 'png' });
    const buf = Buffer.from(res.data, 'base64');
    const outPath = path.join(DOCS_DIR, filename);
    fs.writeFileSync(outPath, buf);
    console.log(`Saved screenshot: ${outPath} (${buf.length} bytes)`);
    return outPath;
  }

  try {
    await send('Page.enable');
    await send('DOM.enable');

    // 1. Desktop verification (1440x900)
    console.log('\n--- 1. Testing Desktop (1440x900) ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false,
    });

    await send('Page.navigate', { url: 'http://localhost:5173/' });
    await new Promise((r) => setTimeout(r, 2000));

    // Move cursor to top of hero (clientX: 720, clientY: 50) to test maximum upward parallax tilt
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 720,
      y: 50,
    });
    await new Promise((r) => setTimeout(r, 600));

    await capture('hero_desktop_parallax_up.png');

    // Move cursor to center
    await send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 720,
      y: 450,
    });
    await new Promise((r) => setTimeout(r, 500));
    await capture('hero_desktop_center.png');

    // 2. Mobile verification (390x844)
    console.log('\n--- 2. Testing Mobile (390x844) ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true,
    });
    await send('Page.navigate', { url: 'http://localhost:5173/' });
    await new Promise((r) => setTimeout(r, 2000));
    await capture('hero_mobile_390.png');

    // 3. Scroll to About section and test Signature
    console.log('\n--- 3. Testing Authentic Signature in About Section ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
      mobile: false,
    });
    await send('Page.navigate', { url: 'http://localhost:5173/#about' });
    await new Promise((r) => setTimeout(r, 1200));

    // Scroll directly into view of the signature
    await evaluate(`
      const sig = document.querySelector('svg[aria-label="Mayuresh Sonawane Authentic Handwritten Signature"]');
      if (sig) {
        sig.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    `);
    // Wait for the stroke-by-stroke animation to complete
    await new Promise((r) => setTimeout(r, 2500));
    await capture('signature_in_about_complete.png');

    // Replay signature animation and capture in mid-flight
    await evaluate(`
      const sigContainer = document.querySelector('svg[aria-label="Mayuresh Sonawane Authentic Handwritten Signature"]').closest('div[title]');
      if (sigContainer) sigContainer.click();
    `);
    await new Promise((r) => setTimeout(r, 700)); // mid-flight capture
    await capture('signature_in_about_animating.png');

    console.log('\nVerification captures completed successfully!');
  } catch (err) {
    console.error('Error during verification:', err);
  } finally {
    ws.close();
    chrome.kill();
  }
}

run();

