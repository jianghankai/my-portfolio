# Kai Portfolio

Kai 的个人作品集网站，基于原有视觉模板改造，保留加载动画、章节叙事、蜘蛛主题、文件夹交互、中英文切换与响应式动效。

## 内容

- Hero：Kai 个人视觉与 K / A / I 字母拆解
- About：个人资料、项目经历、知识库与简历
- Skill Universe：合作品牌与项目方
- Projects：骁龙 vivo、骁龙 OPPO、骁龙小米、恒洁
- Contact：邮箱、手机号、微信与简历
- AI Assistant：基于网站与简历生成的 Kai 专属知识问答

## 本地运行

```bash
npm install
npm run dev
```

构建与测试：

```bash
npm test
npm run build
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
