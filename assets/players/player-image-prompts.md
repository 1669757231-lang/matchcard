## MatchMate 运动员形象固定模板（用于 GPT IMAGE2）

目标：为 8 种结果类型生成风格统一、可直接替换到 `assets/players/` 的角色图。建议输出 PNG，透明或纯净背景，1024x1024。

### 统一提示词模板
- 画风：真实主义运动插画，统一 3/4侧身半身像，俯视轻微，赛场背景虚化，强对比但高级色彩。
- 结构：上半身到膝盖，人物占画面 70%-80%，留白不少于 10%。
- 色调：主光源左上，冷白主光 + 暖边缘补光。
- 细节：保留颈部、锁骨、衣服纹理、鞋钉和鞋底。
- 禁止：水印、文字、LOGO、二维码、模糊、畸形肢体。

### 统一反差参数
- `style: cinematic digital illustration`
- `lighting: soft top-left studio light + subtle rim light`
- `background: abstract stadium gradient, clean`
- `mood: high-energy, confident`

### 逐角色文件名与 prompt 核心词

1. **messi.png**
   - 关键词：`L. Messi portrait, elegant dribbler, compact build, short curly hair, confident smile, blue and white subtle club tone`

2. **ronaldo.png**
   - 关键词：`Cristiano Ronaldo portrait, intense athlete, powerful shoulders, iconic hairstyle, high contrast, fierce eyes, gold and black club tone`

3. **mbappe.png**
   - 关键词：`Kylian Mbappe portrait, explosive speed vibe, slim build, calm expression, sprint-ready stance, white and blue tactical strip`

4. **haaland.png**
   - 关键词：`Erling Haaland portrait, strong frame, focused striker energy, white and dark jersey palette, sharp jawline, commanding presence`

5. **vinicius.png**
   - 关键词：`Vinícius Jr portrait, joyful rhythm, flowing ponytail/short hair, smooth movement, playful expression, vibrant brazilian colors`

6. **bellingham.png**
   - 关键词：`Bellingham portrait, mature midfielder aura, analytical and calm, balanced posture, navy tone uniform details`

7. **yamal.png**
   - 关键词：`Lamine Yamal portrait, youthful flair, energetic and trendy look, bright accents, expressive eyes`

8. **rodri.png**
   - 关键词：`Rodri portrait, deep thinker midfielder, composed posture, tactical aura, muted maroon-brown accents`

### 文件名（最终保存）
- `assets/players/messi.png`
- `assets/players/ronaldo.png`
- `assets/players/mbappe.png`
- `assets/players/haaland.png`
- `assets/players/vinicius.png`
- `assets/players/bellingham.png`
- `assets/players/yamal.png`
- `assets/players/rodri.png`

### 放入后自动生效
`D:/桌面/matchmate/scripts/generate-card.js` 会按 `result.typeKey` 自动读取：
- 如果存在对应图片，直接渲染该玩家形象
- 不存在则回退 `player-placeholder.svg`

