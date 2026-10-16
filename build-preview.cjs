// Part 1: load real Blade files and helpers
const fs = require('fs');
const path = require('path');
const REPO = 'c:\\Users\\tusuu\\Desktop\\VoxSign Institutions\\PearlEdu\\PearlEdu Repo';
const OUT_DIR = __dirname;
const read = (p) => fs.readFileSync(path.join(REPO, p), 'utf8');
let layout = read('resources/views/layouts/pearledu-landing.blade.php');
let home = read('resources/views/landing/pearledu-home.blade.php');
let logoPartial = read('resources/views/layouts/partials/logo.blade.php');
const chords = logoPartial.match(/'M[^']*?Z'/g) || [];
function logoSvg(h, color) {
  const paths = chords.map((c) => '    <path d=' + c + '/>').join('\n');
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="30 30 340 340" fill="' + color + '" role="img" aria-label="PearlEdu" class="vx-logo" style="--vx-logo-h:' + h + 'px;height:' + h + 'px;width:auto;display:block;flex-shrink:0">\n' + paths + '\n  </svg>';
}
const css = (layout.match(/<style>([\s\S]*?)<\/style>/) || ['', ''])[1];
let bodyJs = (layout.match(/<\/footer>([\s\S]*?)<\/body>/) || ['', ''])[1];
bodyJs = bodyJs.replace(/{{--[\s\S]*?--}}/g, '');
let content = home
  .replace(/{{--[\s\S]*?--}}/g, '')
  .replace(/@extends\(.*?\)/g, '')
  .replace(/@section\('content'\)/g, '')
  .replace(/@endsection/g, '')
  .replace(/\{\{\s*url\('\/login'\)\s*\}\}/g, '#onboard')
  .replace(/\{\{\s*url\('\/'\)\s*\}\}/g, '#top')
  .replace(/\{\{\s*route\('pearledu\.onboard'\)\s*\}\}/g, '#onboard')
  .replace(/@csrf/g, '')
  .replace(/@include\('partials\.turnstile'[^)]*\)/g, '<!-- anti-spam check runs on the live site -->');
content = content.replace(/@error\('[^']*'\)(.*?)@enderror/gs, '');
content = content.replace(/\{\{\s*old\('[^']*'\)\s*\}\}/g, '');
const tick = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
function card(name, tag, amount, per, hot, badge, feats, cta) {
  return '<article class="pe-price-card' + (hot ? ' pe-price-card--hot' : '') + '">' +
    (badge ? '<span class="pe-price-badge">' + badge + '</span>' : '') +
    '<h3>' + name + '</h3><p class="pe-price-tagline">' + tag + '</p>' +
    '<div class="pe-price-amount">' + amount + '</div><p class="pe-price-period">' + per + '</p><ul>' +
    feats.map((f) => '<li>' + tick + f + '</li>').join('') +
    '</ul><a href="#onboard" class="' + (hot ? 'pe-btn-grad' : 'pe-btn') + '">' + cta + '</a></article>';
}
const samplePlans =
  card('Starter', 'For small schools getting organised', 'UGX 150,000 <span style="font-size:14px;font-weight:500">/ term</span>', 'per school, per term', false, '', ['Learner records &amp; enrollment', 'Attendance registers', 'Fee tracking &amp; receipts'], 'Choose Starter') +
  card('Standard', 'For growing schools that need insight', 'UGX 350,000 <span style="font-size:14px;font-weight:500">/ term</span>', 'per school, per term', true, 'Most popular', ['Everything in Starter', 'Grading, broadsheets &amp; reports', 'CBT exams &amp; parent SMS', 'Mobile-money reconciliation'], 'Choose Standard') +
  card('Enterprise', 'For groups, districts &amp; chains', 'Custom', 'annual agreement', false, '', ['Everything in Standard', 'Multi-campus oversight', 'EMIS-ready exports'], 'Talk to us');
content = content.replace(/@forelse\(\$plans[\s\S]*?@endforelse/, samplePlans);
let shell = layout.slice(layout.indexOf('<div class="pe-nav-shell"'), layout.indexOf('</footer>') + 9);
shell = shell
  .replace(/{{--[\s\S]*?--}}/g, '')
  .replace(/@include\('layouts\.partials\.logo', \['height' => 32[^\]]*\]\)/g, 'NAVLOGO32')
  .replace(/@include\('layouts\.partials\.logo', \['height' => 24[^\]]*\]\)/g, 'NAVLOGO24')
  .replace(/\{\{\s*url\('\/login'\)\s*\}\}/g, '#onboard')
  .replace(/\{\{\s*url\('\/'\)\s*\}\}/g, '#top')
  .replace(/\{\{\s*config\('tenancy\.base_domain'\)\s*\}\}/g, 'voxsign.co.ug')
  .replace(/\{\{\s*date\('Y'\)\s*\}\}/g, String(new Date().getFullYear()))
  .replace(/@if\(session\('status'\)\)[\s\S]*?@endif/g, '')
  .replace(/@yield\('content'\)/, '<!--PE_CONTENT-->');
shell = shell.split('NAVLOGO32').join(logoSvg(32, 'currentColor')).split('NAVLOGO24').join(logoSvg(24, '#9FE7F5'));
const parts = shell.split('<!--PE_CONTENT-->');
const headExtra = '<link rel="preconnect" href="https://api.fontshare.com">\n<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap" rel="stylesheet">\n<link href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">';
const html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">\n<title>PearlEdu — School Management Platform by VoxSign</title>\n<link rel="icon" type="image/svg+xml" href="favicon.svg?v=4">\n<link rel="icon" href="favicon.ico?v=4" sizes="any">\n<meta name="theme-color" content="#053F5C">\n<script>(function(){try{var k="voxsign-color-scheme";var s=localStorage.getItem(k);var t=(s==="light"||s==="dark")?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t);}catch(e){}})();<\/script>\n' + headExtra + '\n<style>' + css + '</style>\n<style>.pe-preview-note{background:#F27F0C;color:#fff;font:600 13px/1.5 system-ui,sans-serif;text-align:center;padding:8px 16px;position:relative;z-index:70}.pe-preview-note a{color:#fff;text-decoration:underline}<\/style>\n</head>\n<body id="top">\n<div class="pe-preview-note">Static preview of the PearlEdu landing page &mdash; forms are demo-only here. Live: <a href="https://pearledu.voxsign.co.ug">pearledu.voxsign.co.ug</a></div>\n' + parts[0] + '\n' + content + '\n' + parts[1] + '\n' + bodyJs + '\n</body>\n</html>\n';
fs.writeFileSync(path.join(OUT_DIR, 'index.html'), html);
console.log('Wrote index.html (' + (html.length / 1024).toFixed(1) + ' KB)');

