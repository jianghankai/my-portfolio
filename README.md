# Kai Portfolio

Kai 的个人作品集网站。页面基于暗色杂志式视觉模板改造，包含加载视频、Hero、KAI 字母拆解、个人档案、合作方图标、项目卡片、联系方式、简历预览和 AI 知识问答。

这个 README 同时是给后续 AI Agent 的维护说明。客户如果不会写代码，可以直接把“要改什么”描述给 Agent，并让 Agent 按下面的路径修改。

## 快速运行

```bash
npm install
npm run dev
```

本地预览默认地址通常是：

```text
http://127.0.0.1:5173/
```

改完后必须验证：

```bash
npm test
npm run build
```

## 常用文件

- 页面主体：`index.html`
- 动效、语言切换、文件夹弹窗、联系复制、AI 问答交互：`script.js`
- 所有视觉样式：`styles.css`
- Kai 的结构化知识库与项目说明：`content/kai-profile.mjs`
- 自动生成后的知识库产物：`generated/portfolio-knowledge.json`
- 知识库生成脚本：`scripts/build-knowledge.mjs`
- AI 问答服务：`api/ask.js`、`server/assistant-handler.mjs`
- 公开静态资源：`public/`

## 资源目录

- Hero 人像：`public/kai/hero.png`
- 雪山图片：`public/kai/mountain.png`
- 简历图片：`public/kai/resume.png`
- 联系方式 hover 图片：`public/kai/contact/email.png`、`public/kai/contact/phone.png`、`public/kai/contact/wechat.png`
- 合作方 logo：`public/kai/logos/`
- 项目卡片 hover 背景：`public/kai/projects/`
- 加载视频：`public/site-loader.mp4`
- 加载兜底图：`public/site-loader-poster.jpg`

## 修改 Issue 标题和右上角菜单

页面 Issue 标题在 `index.html` 里。

当前结构：

- Issue 03：`About Me`
- Issue 04：`Collaboration Network`
- Issue 05：`Project Delivery`
- Issue 06：`Contact`

右上角 `Issues` 展开后的菜单也在 `index.html` 的 `.topbar-nav`：

```html
<a href="#about">About</a>
<a href="#skills">Partners</a>
<a href="#projects">Delivery</a>
<a href="#contact">Contact</a>
```

如果改某个 Issue 的标题，必须同步改对应菜单文字，避免页面标题和导航不一致。

## 添加或替换合作方 logo

合作方 logo 出现在 Issue 04 的图标网格。

Agent 操作步骤：

1. 把新 logo 放到 `public/kai/logos/`，建议使用透明底 PNG 或 SVG。
2. 在 `index.html` 里找到 `.skill-universe` 下的 `.tool-badge` 列表。
3. 新增或替换一行，格式如下：

```html
<div class="tool-badge tool-badge--11" role="img" aria-label="品牌名" title="品牌名" data-label="品牌名" style="--icon:url('/kai/logos/brand.png')"><span class="tool-badge__icon" aria-hidden="true"></span></div>
```

4. 如果新增了 `tool-badge--11`，需要在 `styles.css` 里给它补位置和 hover 颜色。搜索 `.tool-badge--10`，按同类写法新增：

```css
.tool-badge--11 {
  top: 54%;
  left: 62%;
  right: auto;
  bottom: auto;
}

.issue-section--skills .tool-badge--11 {
  --badge-accent: #ffffff;
}
```

5. 保持每个合作方只出现一次。不要重复放 OPPO、小米等已有 logo。
6. 跑 `npm test` 和 `npm run build`。

## 添加或替换项目卡片

项目卡片出现在 Issue 05。当前有 4 个项目：

- Snapdragon vivo
- Snapdragon OPPO
- Snapdragon Xiaomi
- HEGII

Agent 操作步骤：

1. 把项目 hover 背景图放到 `public/kai/projects/`。
2. 把项目 logo 放到 `public/kai/logos/`。
3. 在 `index.html` 搜索 `project-grid`，复制一个 `<article class="project-card reveal">...</article>`。
4. 修改这些字段：
   - `data-project-index="05"`
   - hover 背景：`src="/kai/projects/new-project.webp"`
   - logo：`src="/kai/logos/new-logo.png"`
   - logo alt：`alt="品牌名"`
   - 序号：`05`
   - 标题：`<strong>Project Name</strong>`
   - 类型：例如 `品牌合作 / 项目执行`
5. 在 `content/kai-profile.mjs` 的 `KAI_PROJECTS` 里新增同一个项目的结构化说明。格式参考：

```js
"new-project-id": {
  title: "Project Name",
  type: { zh: "品牌合作 / 项目执行", en: "Brand Collaboration / Project Execution" },
  frontIntro: {
    zh: "一句话说明项目背景。",
    en: "One sentence about the project.",
  },
  description: {
    zh: "说明 Kai 做了什么、如何推进、结果是什么。",
    en: "Describe Kai's role, process, and outcome.",
  },
  meta: { zh: "项目推进 / 工作流优化 / 交付", en: "Execution / Workflow / Delivery" },
  signals: { zh: ["品牌合作", "结果导向"], en: ["Brand collaboration", "Outcome focused"] },
}
```

6. 如果项目数量从 4 个变成 5 个以上，需要同步调整：
   - `tests/kai-portfolio.test.mjs` 里的项目数量断言
   - `styles.css` 里项目卡片的布局和 `nth-child` 位置
7. 跑知识库生成和验证：

```bash
npm run knowledge:build
npm test
npm run build
```

## 替换联系方式

联系方式出现在页面底部和文件夹档案里。

Agent 操作步骤：

1. 在 `index.html` 搜索旧邮箱、手机号或微信号，例如 `2280207099@qq.com`、`13576085887`、`Aurorahv`。
2. 同步修改：
   - 底部联系方式按钮文字
   - `data-copy-value`
   - 文件夹里的 `.folder-note--contact`
   - 简历卡片 footer 里的邮箱
3. 在 `script.js` 搜索 `PAPER_MODAL_CONTENT`，修改 `contact` 里的中英文弹窗内容。
4. 在 `content/kai-profile.mjs` 里同步更新相关个人信息或联系方式事实。
5. 如果联系方式 hover 图片也要替换，覆盖这些文件：
   - 邮箱：`public/kai/contact/email.png`
   - 手机：`public/kai/contact/phone.png`
   - 微信：`public/kai/contact/wechat.png`
6. 跑：

```bash
npm run knowledge:build
npm test
npm run build
```

## 替换简历

当前简历是图片：

```text
public/kai/resume.png
```

Agent 操作步骤：

1. 用新简历图片覆盖 `public/kai/resume.png`。
2. 如果文件名或格式变化，例如改成 `resume.pdf`，必须同步修改 `script.js` 里的 `RESUME_URLS`：

```js
const RESUME_URLS = {
  zh: "/kai/resume.png",
  en: "/kai/resume.png",
  previewZh: "/kai/resume.png",
  previewEn: "/kai/resume.png",
};
```

3. 如果简历内容发生变化，要把简历里的关键信息补到 `content/kai-profile.mjs`，尤其是 `kai-resume-experience` 这一段。
4. 重新生成知识库：

```bash
npm run knowledge:build
npm test
npm run build
```

## 补充 AI 知识库

AI 问答不是只看页面文字，它主要从两个地方取内容：

- `content/kai-profile.mjs`
- `script.js` 里的 `PAPER_MODAL_CONTENT`

Agent 添加知识时优先改 `content/kai-profile.mjs`。

新增知识块格式：

```js
{
  id: "kai-new-fact",
  type: "profile",
  title: "New Fact Title",
  aliases: ["用户可能会问到的关键词", "English alias"],
  keywords: ["检索关键词 1", "检索关键词 2"],
  priority: 80,
  content: {
    zh: "中文知识内容。写清楚事实，不要写含糊宣传语。",
    en: "English knowledge content. Keep it factual and searchable.",
  },
  hardFacts: {
    zh: {
      字段: "确定事实",
    },
    en: {
      field: "confirmed fact",
    },
  },
  links: [],
  source: "website",
}
```

写知识库时注意：

- 事实要具体，避免“很厉害”“很优秀”这种空话。
- `aliases` 放用户可能问的名字、简称、中文名、英文名。
- `keywords` 放检索词，比如品牌名、项目名、技能名、年份。
- 如果不确定的内容，不要写成确定事实。
- 改完必须运行 `npm run knowledge:build`，生成 `generated/portfolio-knowledge.json`。

## 替换加载视频和兜底图

加载视频：

```text
public/site-loader.mp4
```

兜底图：

```text
public/site-loader-poster.jpg
```

如果只替换视频，建议从新视频里截一帧同步替换 poster，避免加载第一秒显示旧画面。

示例命令：

```bash
ffmpeg -y -ss 0.5 -i public/site-loader.mp4 -frames:v 1 -q:v 2 public/site-loader-poster.jpg
```

## 发布前检查清单

每次改完至少运行：

```bash
npm run knowledge:build
npm test
npm run build
```

如果改的是纯样式或图片，也建议运行 `npm test` 和 `npm run build`，确认没有资源路径断掉。

检查旧信息残留可以运行：

```bash
rg -n "旧姓名|旧邮箱|旧手机号|旧项目名" . -g '!node_modules' -g '!dist' -g '!\\.git'
```

## 给 AI Agent 的推荐指令模板

可以把下面这段发给 Agent：

```text
请在这个仓库里维护 Kai 的作品集。不要改无关文件。先阅读 README.md、index.html、styles.css、script.js、content/kai-profile.mjs。根据我的需求修改页面文案、图片资源和知识库。涉及项目、联系方式、简历或个人事实时，必须同步更新 content/kai-profile.mjs，并运行 npm run knowledge:build。最后运行 npm test 和 npm run build，确认通过后再提交。
```

## 环境变量

复制 `.env.example` 并配置：

```bash
DEEPSEEK_API_KEY=
```

未配置 API Key 时，网站主体仍可正常运行；AI 问答会使用页面内的降级提示。

## 技术栈

Vite、HTML、CSS、Vanilla JavaScript、DeepSeek API。

## 仓库

[github.com/jianghankai/my-portfolio](https://github.com/jianghankai/my-portfolio)
