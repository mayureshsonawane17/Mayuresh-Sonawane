import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const DOCS_DIR = 'docs/hero-verification';
fs.mkdirSync(DOCS_DIR, { recursive: true });

const VIEWPORTS = [
  { width: 1920, height: 1080, name: '1920x1080' },
  { width: 1440, height: 900,  name: '1440x900' },
  { width: 1280, height: 720,  name: '1280x720' },
  { width: 1024, height: 768,  name: '1024x768' },
  { width: 768,  height: 1024, name: '768x1024' },
  { width: 390,  height: 844,  name: '390x844', mobile: true },
];

async function run() {
  console.log('=== FIX 4: AUTOMATED HERO ASSERTIONS & VERIFICATION ===\n');
  console.log('Starting Headless Chrome with remote debugging on 9222...');
  
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
    console.error('Failed to connect to Chrome on port 9222:', err.message);
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
  await send('Emulation.setEmulatedMedia', {
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
  });

  const BASE_URL = 'http://localhost:4180/';
  let totalFailures = 0;

  for (const vp of VIEWPORTS) {
    console.log(`\n--------------------------------------------------`);
    console.log(`Testing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
    console.log(`--------------------------------------------------`);

    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: !!vp.mobile,
    });

    await send('Page.navigate', { url: BASE_URL });
    await new Promise((r) => setTimeout(r, 3400));

    // Evaluate assertions across reveal = 0, 0.25, 0.5
    for (const testReveal of [0.0, 0.25, 0.5]) {
      // Set reveal state directly via React hook
      await send('Runtime.evaluate', {
        expression: `(() => {
          if (window.__setHeroReveal) {
            window.__setHeroReveal(${testReveal});
          }
          const hero = document.getElementById('hero');
          if (hero) {
            hero.style.setProperty('--reveal', '${testReveal}');
          }
        })()`,
      });

      // Small pause for DOM/React update
      await new Promise((r) => setTimeout(r, 250));

      const evalExpr = `(() => {
        const errors = [];
        const boxes = {};

        // 1. No horizontal overflow
        const scrollW = document.documentElement.scrollWidth;
        const innerW = window.innerWidth;
        if (scrollW > innerW + 1) {
          errors.push('Horizontal overflow: scrollWidth (' + scrollW + ') > innerWidth (' + innerW + ')');
        }

        // Elements
        const pill = document.querySelector('#hero .copy-reveal-line');
        const headline = document.querySelector('#hero h1');
        const paragraph = document.querySelector('#hero p');
        const ctas = document.querySelector('#hero a[href="#about"]')?.parentElement;
        const frontName = document.querySelector('#hero .front-name-char')?.closest('.overflow-hidden');
        const portrait = document.querySelector('#hero picture img');
        const seamSvg = document.querySelector('#hero svg.hero-seam-svg') || document.querySelector('#hero svg');

        function intersects(r1, r2, tolerance = 2) {
          if (!r1 || !r2) return false;
          return !(
            r1.right - tolerance <= r2.left ||
            r1.left + tolerance >= r2.right ||
            r1.bottom - tolerance <= r2.top ||
            r1.top + tolerance >= r2.bottom
          );
        }

        const pillRect = pill?.getBoundingClientRect();
        const headRect = headline?.getBoundingClientRect();
        const paraRect = paragraph?.getBoundingClientRect();
        const ctaRect = ctas?.getBoundingClientRect();
        const frontRect = frontName?.getBoundingClientRect();
        const portRect = portrait?.getBoundingClientRect();

        boxes.pill = pillRect ? { top: pillRect.top, bottom: pillRect.bottom, left: pillRect.left, right: pillRect.right } : null;
        boxes.headline = headRect ? { top: headRect.top, bottom: headRect.bottom, left: headRect.left, right: headRect.right } : null;
        boxes.paragraph = paraRect ? { top: paraRect.top, bottom: paraRect.bottom, left: paraRect.left, right: paraRect.right } : null;
        boxes.ctas = ctaRect ? { top: ctaRect.top, bottom: ctaRect.bottom, left: ctaRect.left, right: ctaRect.right } : null;
        boxes.frontName = frontRect ? { top: frontRect.top, bottom: frontRect.bottom, left: frontRect.left, right: frontRect.right } : null;
        boxes.portrait = portRect ? { top: portRect.top, bottom: portRect.bottom, left: portRect.left, right: portRect.right } : null;

        // 2. Bounding boxes: headline, paragraph, pill, CTAs do not intersect each other or name layers
        if (pillRect && headRect && intersects(pillRect, headRect)) {
          errors.push('Pill intersects Headline');
        }
        if (headRect && paraRect && intersects(headRect, paraRect)) {
          errors.push('Headline intersects Paragraph');
        }
        if (paraRect && ctaRect && intersects(paraRect, ctaRect)) {
          errors.push('Paragraph intersects CTAs');
        }
        if (headRect && frontRect && intersects(headRect, frontRect)) {
          errors.push('Headline intersects Front Name');
        }
        if (paraRect && frontRect && intersects(paraRect, frontRect)) {
          errors.push('Paragraph intersects Front Name');
        }
        if (ctaRect && frontRect && intersects(ctaRect, frontRect)) {
          errors.push('CTAs intersect Front Name');
        }

        // 3. Front-name bounding box lies entirely below --chin-y and does NOT intersect face region
        if (portRect && frontRect) {
          const chinY = portRect.top + portRect.height * 0.52;
          const faceTop = portRect.top + portRect.height * 0.28;
          const faceBottom = chinY;
          const faceLeft = portRect.left + portRect.width * 0.30;
          const faceRight = portRect.left + portRect.width * 0.70;
          const faceBox = { top: faceTop, bottom: faceBottom, left: faceLeft, right: faceRight };

          // Front name must start below chin
          if (frontRect.top < chinY - 4) {
            errors.push('Front name top (' + frontRect.top.toFixed(1) + ') is above chin (' + chinY.toFixed(1) + ')');
          }
          if (intersects(frontRect, faceBox)) {
            errors.push('Front name intersects face region (eyes to chin)!');
          }
        }

        // 4. Seam element hidden at reveal 0
        if (${testReveal} === 0.0) {
          const seam = document.querySelector('#hero .hero-seam-svg');
          if (seam) {
            const style = window.getComputedStyle(seam);
            if (style.opacity !== '0' && style.visibility !== 'hidden' && style.display !== 'none') {
              errors.push('Seam SVG is visible at reveal 0 (opacity=' + style.opacity + ', visibility=' + style.visibility + ')');
            }
          }
        }

        // 5. Nav items do not wrap
        const navLinks = document.querySelectorAll('header nav a');
        navLinks.forEach((link, idx) => {
          if (link.offsetHeight > 26) {
            errors.push('Nav item ' + idx + ' (' + link.textContent.trim() + ') wrapped to multiple lines (height: ' + link.offsetHeight + 'px)');
          }
        });

        return { passed: errors.length === 0, errors, boxes };
      })()`;

      const evalRes = await send('Runtime.evaluate', { expression: evalExpr, returnByValue: true });
      const res = evalRes.result?.value || { passed: false, errors: ['Evaluation failed'] };

      if (!res.passed) {
        console.error(`  [FAIL] reveal=${testReveal}:`, res.errors);
        console.error('    Bounding boxes:', JSON.stringify(res.boxes, null, 2));
        totalFailures++;
      } else {
        console.log(`  [PASS] reveal=${testReveal}: All assertions satisfied!`);
      }

      // Capture screenshot at reveal = 0 and reveal = 0.5
      if (testReveal === 0.0 || testReveal === 0.5) {
        const pctLabel = testReveal === 0.0 ? '0' : '50';
        const filename = `repair-after-${vp.name}-reveal-${pctLabel}.png`;
        const { data } = await send('Page.captureScreenshot', { format: 'png' });
        const filePath = path.join(DOCS_DIR, filename);
        fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
        console.log(`    Captured screenshot: ${filePath} (${fs.statSync(filePath).size} bytes)`);
      }
    }
  }

  try {
    chrome.kill('SIGTERM');
  } catch (e) {}

  console.log('\n==================================================');
  if (totalFailures === 0) {
    console.log('RESULT: ALL VIEWPORT ASSERTIONS PASSED PERFECTLY!');
    console.log('==================================================');
    process.exit(0);
  } else {
    console.error(`RESULT: FAILED WITH ${totalFailures} ASSERTION ERROR(S)!`);
    console.log('==================================================');
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
