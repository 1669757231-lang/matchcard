# ⚽ MatchMate — Find Your World Cup Watching Buddy

> 8 card-style questions. Discover your football spirit player. Auto-generates a shareable 3:4 result card.
>
> 🌐 **Bilingual** — `/matchmate` (中文) + `/matchmate-en` (English) — one install, both ready.
>
> 📲 Get it on **Floatboat** → Combo Store → search **"MatchMate"**

---

## 🎮 Player Types (9 total)

| # | Type | Theme | Rarity |
|---|------|-------|--------|
| ⭐ | Messi | Argentina Blue | **Secret Rare** |
| ⭐ | Ronaldo | Portugal Gold | **Secret Rare** |
| 🆕 | Neymar | Brazil Gold | Regular |
| | Vinicius Jr | Brazil Green | Regular |
| | Mbappé | France Blue | Regular |
| | Haaland | Norway Red | Regular |
| | Bellingham | England Red | Regular |
| | Yamal | Spain Red | Regular |
| | Rodri | Spain Deep Red | Regular |

> 🌟 **Pull a Messi or Ronaldo?** Screenshot it, share in Discord → **2,000 Points** reward!

---

## 🚀 Usage

### On Floatboat
Download **Floatboat** → Combo Store → search **"MatchMate"** → Start!

### In Claude Code
```bash
git clone https://github.com/1669757231-lang/matchcard.git
cd matchcard && npm install
# Both /matchmate and /matchmate-en auto-discovered
```

---

## 🖼️ Result Card

| Feature | Description |
|---------|-------------|
| 🏆 Player Type | Full name + country + jersey |
| 📊 Radar Chart | 6-dimension personality radar |
| 📈 Bar Metrics | Score breakdown for each trait |
| 💬 Catchphrases | Your watching buddy catchphrases |
| 🎭 Vibe | Your football watching temperament |
| 🎨 Theme Color | Unique color per player type |
| 📢 CTA Footer | Floatboat + Discord promotion |

---

## 📁 Project Structure

```
├── .claude/commands/
│   ├── matchmate.md          # Chinese skill
│   └── matchmate-en.md       # English skill
├── templates/
│   ├── card.html             # Chinese card (1080×1440)
│   └── card-en.html          # English card
├── scripts/
│   └── generate-card.js      # Puppeteer screenshot
├── assets/players/           # 9 player images + fallback
└── package.json
```

---

## 📋 Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) or **Floatboat**
- Node.js >= 18 (for local use)
- npm

## 📄 License

MIT
