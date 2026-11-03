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

  await send('Page.enable');

  const viewports = [
    { name: '1440', width: 1440, height: 900 },
    { name: '1920', width: 1920, height: 1080 },
    { name: 'mobile', width: 390, height: 844 },
  ];

  for (const vp of viewports) {
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.name === 'mobile',
    });

    await send('Page.navigate', { url: 'http://localhost:5173' });
    await new Promise((r) => setTimeout(r, 2000));

    const rect = await evaluate(`(() => {
      const el = document.querySelector('#build-explore');
      if (!el) return null;
      el.scrollIntoView({ behavior: 'instant', block: 'start' });
      const b = el.getBoundingClientRect();
      return { x: b.left, y: b.top, width: b.width, height: b.height };
    })()`);

    if (!rect) {
      console.warn('Could not find #build-explore');
      continue;
    }

    await new Promise((r) => setTimeout(r, 1000));

    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
    });

    const buf = Buffer.from(shot.data, 'base64');
    const outPath = path.join(DOCS_DIR, `section-split-${vp.name}.png`);
    fs.writeFileSync(outPath, buf);
    console.log(`Saved screenshot: ${outPath} (${buf.length} bytes)`);

    // Also copy to artifacts dir for inspection
    const artifactPath = `/Users/mayureshsonawane/.gemini/antigravity/brain/292b571a-3347-4435-ad72-e2ce45d785ac/section-split-${vp.name}.png`;
    fs.writeFileSync(artifactPath, buf);
  }

  console.log('Capture completed!');
  ws.close();
  chrome.kill();
}

run().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
