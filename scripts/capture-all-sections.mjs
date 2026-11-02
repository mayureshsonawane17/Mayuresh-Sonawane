import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const DOCS_DIR = 'docs/hero-verification';
fs.mkdirSync(DOCS_DIR, { recursive: true });

async function run() {
  console.log('Starting Headless Chrome on port 9222...');
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--mute-audio',
    'about:blank',
  ]);

  await new Promise((r) => setTimeout(r, 1200));

  let targets;
  try {
    const targetsRes = await fetch('http://localhost:9222/json/list');
    targets = await targetsRes.json();
  } catch (err) {
    console.error('Failed to connect to Chrome:', err.message);
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

  async function captureSection(selector, filename, padding = 40) {
    const rect = await evaluate(`(() => {
      const el = document.querySelector('${selector}');
      if (!el) return null;
      el.scrollIntoView({ behavior: 'instant', block: 'start' });
      const b = el.getBoundingClientRect();
      return { x: b.left, y: b.top, width: b.width, height: b.height };
    })()`);

    if (!rect) {
      console.warn(`Could not find element: ${selector}`);
      return;
    }

    await new Promise((r) => setTimeout(r, 800));

    // Evaluate viewport capture
    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
    });

    const buf = Buffer.from(shot.data, 'base64');
    fs.writeFileSync(path.join(DOCS_DIR, filename), buf);
    console.log(`Saved screenshot: ${filename} (${buf.length} bytes)`);
  }

  // 1440x900 desktop viewport
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await send('Page.enable');
  await send('Page.navigate', { url: 'http://localhost:4180' });
  await new Promise((r) => setTimeout(r, 2000));

  console.log('Navigated to preview site. Scrolling to sections...');

  // Capture About with Signature
  await captureSection('#about', 'section-about-signature.png');

  // Trigger signature replay / full draw
  await evaluate(`(() => {
    const sig = document.querySelector('#about svg');
    if (sig) {
      const paths = sig.querySelectorAll('.signature-path');
      paths.forEach(p => p.style.strokeDashoffset = '0');
    }
  })()`);
  await new Promise((r) => setTimeout(r, 500));
  await captureSection('#about', 'section-about-signature-drawn.png');

  // Capture Mask Collection
  await captureSection('#mask-collection', 'section-mask-collection.png');

  // Capture Journey
  await captureSection('#journey', 'section-journey-timeline.png');

  // Capture Hall of Fame
  await captureSection('#hall-of-fame', 'section-hall-of-fame.png');

  console.log('All section screenshots captured successfully!');
  ws.close();
  chrome.kill();
}

run().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
