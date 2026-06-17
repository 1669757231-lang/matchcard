/**
 * MatchMate - 结果卡片截图脚本
 * 用法: node scripts/generate-card.js <result.json路径> [--en]
 *
 * 读取JSON数据，填充HTML模板，用Puppeteer截图生成PNG
 * --en 使用英文模板 card-en.html
 */

const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

// === 解析参数 ===
const args = process.argv.slice(2);
const isEnglish = args.includes('--en');
const jsonPath = args.find(a => !a.startsWith('--'));

// === 配置 ===
const TEMPLATE_NAME = isEnglish ? 'card-en.html' : 'card.html';
const TEMPLATE_PATH = path.join(__dirname, '..', 'templates', TEMPLATE_NAME);
const OUTPUT_DIR = path.join(__dirname, '..', 'output');
const ASSET_DIR = path.join(__dirname, '..', 'assets', 'players');
const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1440;

// === 雷达图坐标计算 ===
const RADAR_CENTER = 0;
const RADAR_CENTER_Y = 0;
const RADAR_RADIUS = 108;
const RADAR_ANGLES = [
  -Math.PI / 2, // 上头指数
  -Math.PI / 2 + Math.PI / 3, // 战术画板
  -Math.PI / 2 + 2 * Math.PI / 3, // 群聊活跃
  -Math.PI / 2 + Math.PI, // 戏精程度
  -Math.PI / 2 + 4 * Math.PI / 3, // 投机心态
  -Math.PI / 2 + 5 * Math.PI / 3, // 跟风系数
];

const DIMENSIONS_CN = [
  { key: 'excitement', name: '上头指数' },
  { key: 'tactical', name: '战术画板' },
  { key: 'chatActivity', name: '群聊活跃' },
  { key: 'drama', name: '戏精程度' },
  { key: 'speculative', name: '投机心态' },
  { key: 'trendFollowing', name: '跟风系数' },
];

const DIMENSIONS_EN = [
  { key: 'excitement', name: 'Hype' },
  { key: 'tactical', name: 'Tactics' },
  { key: 'chatActivity', name: 'Chatter' },
  { key: 'drama', name: 'Drama' },
  { key: 'speculative', name: 'Speculation' },
  { key: 'trendFollowing', name: 'Trend' },
];

const TYPE_COLOR_MAP = {
  messi: { themeColor: '#75AADB', darkColor: '#1A3C7A' },
  ronaldo: { themeColor: '#9C7A34', darkColor: '#0C3A00' },
  mbappe: { themeColor: '#002654', darkColor: '#001428' },
  haaland: { themeColor: '#BA0C2F', darkColor: '#7A0820' },
  vinicius: { themeColor: '#009C3B', darkColor: '#006828' },
  bellingham: { themeColor: '#CF081F', darkColor: '#8A0515' },
  yamal: { themeColor: '#AA151B', darkColor: '#750E13' },
  rodri: { themeColor: '#F2003C', darkColor: '#A8002A' },
  neymar: { themeColor: '#F4A900', darkColor: '#8B6914' },
};

function clamp100(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function getRadarPoint(score, angleIndex) {
  const angle = RADAR_ANGLES[angleIndex];
  const x = (clamp100(score) / 100) * RADAR_RADIUS * Math.cos(angle);
  const y = (clamp100(score) / 100) * RADAR_RADIUS * Math.sin(angle);
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

function generateRadarSvg(radarScores = {}, themeColor = '#75AADB', langDims = DIMENSIONS_CN) {
  const points = langDims.map((item, i) => {
    const pt = getRadarPoint(radarScores[item.key], i);
    return `${pt.x},${pt.y}`;
  }).join(' ');

  const dots = langDims.map((item, i) => {
    const pt = getRadarPoint(radarScores[item.key], i);
    return `<circle cx="${pt.x}" cy="${pt.y}" r="4" fill="${themeColor}" stroke="white" stroke-width="2"/>`;
  }).join('\n            ');

  return { points, dots };
}

function buildMetricRows(radarScores = {}, langDims = DIMENSIONS_CN) {
  return langDims.map((item) => {
    const score = clamp100(radarScores[item.key]);
    return `
      <div class="metric-row">
        <div class="metric-label">${item.name}</div>
        <div class="bar-track"><span class="bar-fill" style="width:${score}%;"></span></div>
        <div class="metric-val">${score}</div>
      </div>`;
  }).join('\n');
}

// === 颜色 ===
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex || '');
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 230, g: 235, b: 225 };
}

function getBgColor(themeColor) {
  const rgb = hexToRgb(themeColor);
  const r = Math.round(rgb.r + (255 - rgb.r) * 0.85);
  const g = Math.round(rgb.g + (255 - rgb.g) * 0.85);
  const b = Math.round(rgb.b + (255 - rgb.b) * 0.85);
  return `rgb(${r},${g},${b})`;
}

function resolvePlayerImage(typeKey) {
  const key = String(typeKey || 'messi').toLowerCase();
  const candidates = ['png', 'jpg', 'jpeg', 'webp'];
  for (const ext of candidates) {
    const full = path.join(ASSET_DIR, `${key}.${ext}`);
    if (fs.existsSync(full)) {
      return pathToFileURL(full).href;
    }
  }

  const fallback = path.join(ASSET_DIR, 'player-placeholder.svg');
  if (fs.existsSync(fallback)) {
    return pathToFileURL(fallback).href;
  }

  return '';
}

function safeText(v, fallback = '') {
  if (typeof v === 'number') return String(v);
  return v ? String(v) : fallback;
}

async function main() {
  const jsonPathArg = jsonPath;
  if (!jsonPathArg) {
    console.error('用法: node generate-card.js <result.json路径> [--en]');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(jsonPathArg, 'utf-8'));

  let html = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

  // 先解析类型和颜色
  const typeKey = safeText(data.typeKey, '').toLowerCase();
  const colors = TYPE_COLOR_MAP[typeKey] || {};
  const themeColor = safeText(data.themeColor, colors.themeColor || '#75AADB');
  const darkColor = safeText(data.darkColor, colors.darkColor || '#1A3C7A');

  const langDims = isEnglish ? DIMENSIONS_EN : DIMENSIONS_CN;
  const radar = generateRadarSvg(data.radarScores || {}, themeColor, langDims);
  const quotes = Array.isArray(data.commonQuotes)
    ? data.commonQuotes.map((q) => `<div class="qitem">${q}</div>`).join('\n            ')
    : '';

  const taglineDescMap = {
    messi: '对丑陋赢球的容忍度为零，看球审美至上',
    ronaldo: '永远热血，永远相信逆转的可能',
    mbappe: '关键时刻见真章，速度和效率才是王道',
    haaland: '数据不会说谎，进球才是硬道理',
    vinicius: '足球的本质就是快乐和激情',
    bellingham: '全面理解比赛，战术与激情兼备',
    yamal: '年轻无所畏惧，未来属于敢冒险的人',
    rodri: '足球最美的地方藏在细节里',
    neymar: '足球不只是一场比赛，更是一场秀',
  };

  const scoreLabelMap = isEnglish
    ? { messi:'Messi', ronaldo:'Ronaldo', mbappe:'Mbappé', haaland:'Haaland', vinicius:'Vini Jr', bellingham:'Bellingham', yamal:'Yamal', rodri:'Rodri', neymar:'Neymar' }
    : { messi:'梅西型', ronaldo:'C罗型', mbappe:'姆巴佩型', haaland:'哈兰德型', vinicius:'维尼修斯型', bellingham:'贝林厄姆型', yamal:'亚马尔型', rodri:'罗德里型', neymar:'内马尔型' };

  const playerImage = resolvePlayerImage(typeKey);
  const noPhotoClass = playerImage ? '' : ' no-photo';

  const replacements = {
    '{{BG_COLOR}}': getBgColor(themeColor),
    '{{THEME_COLOR}}': themeColor,
    '{{DARK_COLOR}}': darkColor,

    '{{NAME_CN}}': safeText(data.nameCn, '未知球迷'),
    '{{NAME_EN}}': safeText(data.nameEn, 'UNKNOWN'),
    '{{COUNTRY_CN}}': safeText(data.country, '未知国家'),
    '{{COUNTRY_EN}}': safeText(data.countryEn, 'Unknown Country'),
    '{{JERSEY_NUMBER}}': safeText(data.jerseyNumber, '??'),
    '{{TAGLINE}}': safeText(data.tagline, '看球型人格'),
    '{{TAGLINE_DESC}}': taglineDescMap[typeKey] || '',
    '{{DESCRIPTION}}': safeText(data.description),
    '{{TEMPERAMENT}}': safeText(data.temperament),
    '{{QUOTES_HTML}}': quotes,
    '{{RADAR_POINTS}}': radar.points,
    '{{RADAR_DOTS}}': radar.dots,
    '{{INITIALS}}': isEnglish ? safeText(data.nameEn, 'M').charAt(0) : safeText(data.nameCn, '梅').charAt(0),
    '{{SCORE_LABEL}}': scoreLabelMap[typeKey] || (isEnglish ? safeText(data.nameEn, 'MatchMate') : safeText(data.nameCn, '看球搭子') + '型'),
    '{{PLAYER_IMAGE}}': playerImage,
    '{{AVATAR_NO_PHOTO_CLASS}}': noPhotoClass,
    '{{RADAR_METRIC_ROWS}}': buildMetricRows(data.radarScores || {}, langDims),
  };

  for (const [placeholder, value] of Object.entries(replacements)) {
    html = html.split(placeholder).join(value);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const tempHtmlPath = path.join(OUTPUT_DIR, 'temp-card.html');
  fs.writeFileSync(tempHtmlPath, html, 'utf-8');

  let puppeteer;
  try {
    puppeteer = require('puppeteer');
  } catch (e) {
    console.error('❌ 未安装 puppeteer，请运行: npm install');
    console.error('   或者你可以直接在浏览器中打开以下文件查看效果：');
    console.error('   ' + tempHtmlPath);
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: CARD_WIDTH, height: CARD_HEIGHT, deviceScaleFactor: 2 });
  await page.goto('file://' + tempHtmlPath.replace(/\\/g, '/'), {
    waitUntil: 'networkidle0',
    timeout: 30000,
  });
  await page.evaluateHandle('document.fonts.ready');

  const timestamp = Date.now();
  const langSuffix = isEnglish ? '-en' : '';
  const outputPath = path.join(OUTPUT_DIR, `matchmate-${typeKey || 'result'}${langSuffix}-${timestamp}.png`);

  const cardElement = await page.$('.card');
  if (cardElement) {
    await cardElement.screenshot({ path: outputPath, type: 'png' });
  } else {
    await page.screenshot({
      path: outputPath,
      type: 'png',
      clip: { x: 0, y: 0, width: CARD_WIDTH, height: CARD_HEIGHT },
    });
  }

  await browser.close();
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }


  console.log('✅ 结果卡片已生成！');
  console.log('📁 文件路径: ' + outputPath);
}

main().catch((err) => {
  console.error('❌ 生成失败:', err.message);
  process.exit(1);
});
