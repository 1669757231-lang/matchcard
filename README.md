# ⚽ MatchMate — Football Watching Buddy Personality Test

> 8 interactive card-style questions. Find your 2026 World Cup spirit player. Auto-generates a shareable 3:4 result card.
>
> **🌐 Bilingual out of the box — Chinese `/matchmate` + English `/matchmate-en` — one install, both ready.**

```bash
git clone https://github.com/1669757231-lang/matchcard.git
cd matchcard && npm install
# Claude Code auto-discovers both slash commands
```

### 使用

在 Claude Code 中输入：

```
/matchmate
```

Claude 会引导你完成 8 道看球人格题目，并自动生成一张结果图。

---

## 🎨 视觉与引流：固定球员形象 + Floatboat CTA

### 1) 固定模板图片

为了让每次生成“更稳、更美、更有识别度”，项目采用 **内置球员形象** 模式：

- `assets/players/messi.png`
- `assets/players/ronaldo.png`
- `assets/players/mbappe.png`
- `assets/players/haaland.png`
- `assets/players/vinicius.png`
- `assets/players/bellingham.png`
- `assets/players/yamal.png`
- `assets/players/rodri.png`

- 若缺失对应图，会自动回退 `assets/players/player-placeholder.svg`。
- 头像不再动态生成，保证每次风格一致。

### 2) 不同球员不同色彩（按性格定制）

结果卡片会根据 `result.json` 的 `themeColor` / `darkColor` 做配色，做到不同人格“同模板不同色相”。

建议颜色（可按项目风格微调）：

- `messi`: `themeColor #75AADB` / `darkColor #1A3C7A`
- `ronaldo`: `themeColor #9C7A34` / `darkColor #0C3A00`
- `mbappe`: `themeColor #002654` / `darkColor #001428`
- `haaland`: `themeColor #BA0C2F` / `darkColor #7A0820`
- `vinicius`: `themeColor #009C3B` / `darkColor #006828`
- `bellingham`: `themeColor #CF081F` / `darkColor #8A0515`
- `yamal`: `themeColor #AA151B` / `darkColor #750E13`
- `rodri`: `themeColor #F2003C` / `darkColor #A8002A`

> 提示：如果你后续让 GPT IMAGE2 出图，建议统一风格（半身像、3/4 侧身、同构图比例、统一背景），最终保持固定输出尺寸（如 1024x1024）.

### 3) 底部宣传文案（引流到 Floatboat Discord）

卡片底部已设计为固定 CTA：

- 标题：**“下载 Floatboat，生成你的专属看球搭子。”**
- 副文：**“加入 Floatboat Discord，与全国球迷一起复盘比赛、晒你的测试结果，扩圈更有氛围。”**
- CTA 标签：
  - `立即下载 Floatboat`
  - `加入 Discord`

后续你如果要做更强转化，我可以继续加上二维码占位区（右下角）、短链引导码样式和二维码图层。

## 🖼️ 结果卡片

测试完成后自动生成一张结果卡片 PNG，包含：

- 🏆 看球搭子类型
- 📊 六维雷达图
- 💬 常见发言
- 🎭 赛场气质
- 🎨 主题色配色

## 🛠️ 自定义

### 添加新球员类型

在 `scripts` 生成的数据里补齐字段即可；配色在 `result.json` 中设置。

### 修改题目

在 `.claude/commands/matchmate.md` 的测试题目和得分规则处修改。

### 调整卡片样式

修改 `templates/card.html`。

### 替换球员头像

将球员图片放入 `assets/players/`，名称按类型 key 对齐。

## 📁 项目结构

```text
matchmate/
├── .claude/
│   └── commands/
│       └── matchmate.md      # Skill 定义（题目+类型+流程）
├── scripts/
│   └── generate-card.js      # Puppeteer 截图脚本
├── templates/
│   └── card.html             # 结果卡片模板（统一 CTA 布局）
├── assets/
│   └── players/              # 球员形象（固定模板）
│       ├── messi.png
│       ├── ronaldo.png
│       ├── mbappe.png
│       ├── haaland.png
│       ├── vinicius.png
│       ├── bellingham.png
│       ├── yamal.png
│       ├── rodri.png
│       └── player-placeholder.svg
├── output/
│   ├── result.json
│   └── matchmate-*.png
├── package.json
└── README.md
```

## 📋 前置要求

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- Node.js >= 18
- npm

## 📄 License

MIT