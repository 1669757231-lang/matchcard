const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 基础配置
const ROOT = 'D:/桌面/matchmate';
const outputDir = path.join(ROOT, 'output');
const baseResultPath = path.join(outputDir, 'result.json');
const scriptPath = path.join(ROOT, 'scripts', 'generate-card.js');

const base = JSON.parse(fs.readFileSync(baseResultPath, 'utf-8'));

// 8类球员的球衣色彩/卡片文案
const profiles = {
  messi: {
    nameCn: '梅西',
    nameEn: 'MESSI',
    country: '阿根廷',
    countryEn: 'Argentina',
    jerseyNumber: 10,
    themeColor: '#75AADB',
    darkColor: '#1A3C7A',
    tagline: '真正的足球不用喊',
    description: '你是梅西型看球搭子。你看球最在意质感，一个精妙的传球能让你比进球还兴奋，宁可为技艺喝彩，也不爱浮夸嘈杂。',
    temperament: '你更偏向沉稳的欣赏者，喜欢研究进攻节奏与球员意识，擅长用一句精辟评论戳中比赛要害。',
  },
  ronaldo: {
    nameCn: 'C罗',
    nameEn: 'RONALDO',
    country: '葡萄牙',
    countryEn: 'Portugal',
    jerseyNumber: 7,
    themeColor: '#9C7A34',
    darkColor: '#0C3A00',
    tagline: '永远热血，永远相信逆转',
    description: '你是C罗型看球搭子。你看重能量与冲刺，每次临门一脚都像战役前的冲锋号角，关键时刻最关注反击与逆转。',
    temperament: '你偏向情绪化表达，擅长在关键时刻喊加油，比赛高潮区会快速带动全场情绪。',
  },
  mbappe: {
    nameCn: '姆巴佩',
    nameEn: 'MBAPPE',
    country: '法国',
    countryEn: 'France',
    jerseyNumber: 7,
    themeColor: '#002654',
    darkColor: '#001428',
    tagline: '关键时刻见真章',
    description: '你是姆巴佩型看球搭子。你节奏感很强，偏爱快攻和高位压迫，喜欢一目了然的威胁点，凡事喜欢先看到结果。',
    temperament: '你是快节奏解说者，偏好简洁有力表达，复盘前常先做“先判断后证据”式快速结论。',
  },
  haaland: {
    nameCn: '哈兰德',
    nameEn: 'HAALAND',
    country: '挪威',
    countryEn: 'Norway',
    jerseyNumber: 9,
    themeColor: '#BA0C2F',
    darkColor: '#7A0820',
    tagline: '数据不会骗人',
    description: '你是哈兰德型看球搭子。你重视效率和产出，场上每一次触球都在计算入球概率，喜欢硬核数据与终局视角。',
    temperament: '你偏向直球风格，少废话，看到关键时刻会直接发表精简而明确的判断。',
  },
  vinicius: {
    nameCn: '维尼修斯',
    nameEn: 'VINICIUS',
    country: '巴西',
    countryEn: 'Brazil',
    jerseyNumber: 20,
    themeColor: '#009C3B',
    darkColor: '#006828',
    tagline: '足球是开心的游戏',
    description: '你是维尼修斯型看球搭子。节奏轻快，注重流畅配合与个人天赋，喜欢“看起来舒服”的进攻时刻。',
    temperament: '你更擅长氛围互动，聊天里经常带着调侃和轻松感，让观赛更有欢乐感。',
  },
  bellingham: {
    nameCn: '贝林厄姆',
    nameEn: 'BELLINGHAM',
    country: '英国',
    countryEn: 'England',
    jerseyNumber: 10,
    themeColor: '#CF081F',
    darkColor: '#8A0515',
    tagline: '全场总在观察',
    description: '你是贝林厄姆型看球搭子。兼具审美与逻辑，能快速建立整体认知，重视中场链路与场上结构。',
    temperament: '你发言细腻，常结合位置、节奏和战术意图展开解读，像一位温和的讲解员。',
  },
  yamal: {
    nameCn: '亚马尔',
    nameEn: 'YAMAL',
    country: '西班牙',
    countryEn: 'Spain',
    jerseyNumber: 19,
    themeColor: '#AA151B',
    darkColor: '#750E13',
    tagline: '天赋与热情并行',
    description: '你是亚马尔型看球搭子。天赋思维敏捷，容易被闪现瞬间和突然反击吸引，喜欢风格鲜明的单点爆发。',
    temperament: '你更有实验性，喜欢讨论反常规进球和“这球为什么很帅”，观点通常短句且有爆发感。',
  },
  rodri: {
    nameCn: '罗德里',
    nameEn: 'RODRI',
    country: '西班牙',
    countryEn: 'Spain',
    jerseyNumber: 16,
    themeColor: '#F2003C',
    darkColor: '#A8002A',
    tagline: '懂得节奏与秩序',
    description: '你是罗德里型看球搭子。偏爱场面控制与秩序，擅长观察中场枢纽的切换和对抗细节。',
    temperament: '你讲话稳重，观点含金量高，善于指出未被注意到的空间关系和节奏变化。',
  },
};

const commonQuotes = [
  '这脚传球太妙了。',
  '这节奏你看懂了么？关键在这个点。',
  '这就是比赛，关键时刻不许出错。',
];

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const types = Object.keys(profiles);
const generated = [];

for (const typeKey of types) {
  const p = profiles[typeKey];

  const data = {
    ...base,
    typeKey,
    nameCn: p.nameCn,
    nameEn: p.nameEn,
    country: p.country,
    countryEn: p.countryEn,
    jerseyNumber: p.jerseyNumber,
    themeColor: p.themeColor,
    darkColor: p.darkColor,
    tagline: p.tagline,
    description: p.description,
    temperament: p.temperament,
    commonQuotes,
    scores: {
      ...(base.scores || {}),
      [typeKey]: 92,
    },
  };

  const jsonPath = path.join(outputDir, `result-${typeKey}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf-8');

  execSync(`node "${scriptPath}" "${jsonPath}"`, {
    stdio: 'inherit',
    cwd: ROOT,
  });

  generated.push(typeKey);
}

console.log('✅ 已生成 8 张按球衣配色的卡片：', generated.join('、'));