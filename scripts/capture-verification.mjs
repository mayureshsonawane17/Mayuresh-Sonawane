import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const DOCS_DIR = 'docs/hero-verification';
fs.mkdirSync(DOCS_DIR, { recursive: true });

async function run() {
  console.log('Starting Headless Chrome with CDP...');
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--mute-audio',
    'about:blank',
  ]);

  await new Promise((r) => setTimeout(r, 1200));

  const verRes = await fetch('http://localhost:9222/json/version');
  const ver = await verRes.json();
  console.log('Connected to:', ver.Browser);

  const targetsRes = await fetch('http://localhost:9222/json/list');
  const targets = await targetsRes.json();
  const pageTarget = targets.find((t) => t.type === 'page') || targets[0];

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let msgId = 1;
  const pending = new Map();

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
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

  await send('Page.enable');
  await send('DOM.enable');
  await send('Runtime.enable');

  async function capture(filename, width, height, opts = {}) {
    console.log(`Capturing: ${filename} (${width}x${height})...`);
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });

    if (opts.reducedMotion) {
      await send('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
      });
    } else {
      await send('Emulation.setEmulatedMedia', {
        features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }],
      });
    }

    if (opts.url) {
      await send('Page.navigate', { url: opts.url });
      await new Promise((r) => setTimeout(r, opts.wait || 2000));
    }

    if (opts.eval) {
      await send('Runtime.evaluate', { expression: opts.eval, awaitPromise: true });
      await new Promise((r) => setTimeout(r, 400));
    }

    const { data } = await send('Page.captureScreenshot', { format: 'png' });
    const filePath = path.join(DOCS_DIR, filename);
    fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
    console.log(`  Saved ${filePath} (${fs.statSync(filePath).size} bytes)`);
  }

  const BASE_URL = 'http://localhost:4180/';

  // 1. Initial Load at standard 1440x900
  await capture('hero-1440x900-idle.png', 1440, 900, { url: BASE_URL, wait: 3500 });

  // 2. Intro timeline keyframe states (evaluated at specific times)
  await capture('intro-0.4s.png', 1440, 900, {
    url: BASE_URL,
    wait: 400,
  });

  await capture('intro-1.2s.png', 1440, 900, {
    url: BASE_URL,
    wait: 1200,
  });

  await capture('intro-2.0s.png', 1440, 900, {
    url: BASE_URL,
    wait: 2000,
  });

  await capture('intro-3.2s.png', 1440, 900, {
    url: BASE_URL,
    wait: 3300,
  });

  // 3. Reveal states on desktop (0%, 25%, 50%)
  await capture('reveal-0pct.png', 1440, 900, {
    eval: `document.getElementById('hero').style.setProperty('--reveal', '0.0')`,
  });

  await capture('reveal-25pct.png', 1440, 900, {
    eval: `
      document.getElementById('hero').style.setProperty('--reveal', '0.25');
      const topEdge = 0.25 * 128 + 14;
      const bottomEdge = 0.25 * 128 - 14;
      document.getElementById('hero').children[1].style.clipPath = 'polygon(0% 0%, ' + topEdge + '% 0%, ' + bottomEdge + '% 100%, 0% 100%)';
    `,
  });

  await capture('reveal-50pct.png', 1440, 900, {
    eval: `
      document.getElementById('hero').style.setProperty('--reveal', '0.50');
      const topEdge = 0.50 * 128 + 14;
      const bottomEdge = 0.50 * 128 - 14;
      document.getElementById('hero').children[1].style.clipPath = 'polygon(0% 0%, ' + topEdge + '% 0%, ' + bottomEdge + '% 100%, 0% 100%)';
    `,
  });

  // 4. Parallax states: Pointer Left vs Pointer Right
  await capture('pointer-far-left.png', 1440, 900, {
    eval: `
      document.getElementById('hero').dispatchEvent(new PointerEvent('pointermove', { clientX: 50, clientY: 450, bubbles: true }));
    `,
  });

  await capture('pointer-far-right.png', 1440, 900, {
    eval: `
      document.getElementById('hero').dispatchEvent(new PointerEvent('pointermove', { clientX: 1390, clientY: 450, bubbles: true }));
    `,
  });

  // 5. Scroll Exit at 30% and 80%
  await capture('scroll-exit-30pct.png', 1440, 900, {
    eval: `window.scrollTo({ top: window.innerHeight * 0.3, behavior: 'instant' });`,
  });

  await capture('scroll-exit-80pct.png', 1440, 900, {
    eval: `window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'instant' });`,
  });

  // 6. Reduced motion state
  await capture('reduced-motion.png', 1440, 900, {
    url: BASE_URL,
    reducedMotion: true,
    wait: 800,
  });

  // 7. Multi-resolution matrix
  // 1920x1080 (Wide Desktop)
  await capture('hero-1920x1080.png', 1920, 1080, { url: BASE_URL, wait: 3500 });

  // 1280x720 (Laptop)
  await capture('hero-1280x720.png', 1280, 720, { url: BASE_URL, wait: 3500 });

  // 1024x768 (Tablet Landscape)
  await capture('hero-1024x768.png', 1024, 768, { url: BASE_URL, wait: 3500 });

  // 768x1024 (Tablet Portrait)
  await capture('hero-768x1024.png', 768, 1024, { url: BASE_URL, wait: 3500 });

  // 390x844 (Mobile Modern)
  await capture('hero-390x844-idle.png', 390, 844, { url: BASE_URL, wait: 3500 });

  await capture('hero-390x844-mid-drag.png', 390, 844, {
    eval: `
      document.getElementById('hero').style.setProperty('--reveal', '0.40');
      const topEdge = 0.40 * 128 + 14;
      const bottomEdge = 0.40 * 128 - 14;
      document.getElementById('hero').children[1].style.clipPath = 'polygon(0% 0%, ' + topEdge + '% 0%, ' + bottomEdge + '% 100%, 0% 100%)';
    `,
  });

  await capture('hero-390x844-scrolled.png', 390, 844, {
    eval: `window.scrollTo({ top: 350, behavior: 'instant' });`,
  });

  // 360x740 (Mobile Compact)
  await capture('hero-360x740.png', 360, 740, { url: BASE_URL, wait: 3500 });

  ws.close();
  chrome.kill();
  console.log('All verification captures completed successfully!');
}

run().catch((err) => {
  console.error('Capture script error:', err);
  process.exit(1);
});

