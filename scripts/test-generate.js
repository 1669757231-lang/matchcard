/**
 * MatchMate - 测试脚本
 * 生成一个梅西型的测试结果JSON，然后调用截图脚本
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUTPUT_DIR = path.join(__dirname, '..', 'output');

// 确保输出目录存在
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 梅西型测试数据
const testData = {
  typeKey: 'messi',
  nameCn: '梅西',
  nameEn: 'MESSI',
  country: '阿根廷',
  countryEn: 'Argentina',
  jerseyNumber: 10,
  themeColor: '#75AADB',
  darkColor: '#1A3C7A',
  tagline: '真正的足球不用喊',
  quote: '这脚传球太妙了。',
  description: '你是梅西型看球搭子。你看球最在意质感，一个精妙的传球能让你比进球还兴奋。你的足球审美来自梅西式的低调优雅：真正的高手不需要喊叫，一个眼神、一脚传球就够了。你对粗糙的比赛容忍度很低，因为你知道足球最美的样子是什么。',
  temperament: '你是安静型陪看，适合看大师级表演、看传球艺术、看球场上的智慧，也容易因为比赛质量太差而默默换台。',
  commonQuotes: [
    '这脚传球太妙了。',
    '你看他那个跑位，大师级。',
    '进球？那只是附带的。',
  ],
  radarScores: {
    excitement: 40,
    tactical: 85,
    chatActivity: 25,
    drama: 20,
    speculative: 30,
    trendFollowing: 15,
  },
  scores: {
    messi: 75,
    ronaldo: 45,
    mbappe: 55,
    haaland: 35,
    vinicius: 60,
    bellingham: 50,
    yamal: 40,
    rodri: 45,
  },
};

// 写入JSON
const jsonPath = path.join(OUTPUT_DIR, 'result.json');
fs.writeFileSync(jsonPath, JSON.stringify(testData, null, 2), 'utf-8');
console.log('📝 测试数据已写入:', jsonPath);

// 调用截图脚本
const scriptPath = path.join(__dirname, 'generate-card.js');
try {
  execSync(`node "${scriptPath}" "${jsonPath}"`, {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..'),
  });
} catch (e) {
  console.error('❌ 截图失败:', e.message);
  process.exit(1);
}
