# Kai Portfolio Template Adaptation Design

## Goal

Create a separate Kai portfolio repository by fully preserving the EIDDIE template's visual system, layout, loading video, spider motif, folder interaction, language switch, motion, and responsive behavior while replacing all personal content and selected project behavior with Kai's supplied information and assets.

The source repository at `/Users/a1234/Documents/New project 3` is read-only for this task. All implementation happens in `/Users/a1234/Documents/Codex/2026-06-15/kai-portfolio`.

## Visual Thesis

Keep the original comic dossier universe intact: bold black-and-white editorial composition, red accents, tactile paper layers, playful spider transitions, and restrained image-led hover reveals. The adaptation changes the person and portfolio evidence, not the template's identity or polish.

## Content Structure

1. Hero keeps the existing composition and loading video, replacing the name sticker with `kai.png`.
2. Name deconstruction becomes `KAI`: Knowledge / 知识建构, Analyze / 分析拆解, Innovate / 创新解决.
3. About keeps the interactive spider chat and dossier folder, replacing all identity, birthday, profile, values, ambition, proof, location, resume, and contact data.
4. Skill Universe becomes a collaboration universe using the supplied partner logos.
5. Selected Projects contains only 骁龙 vivo, 骁龙 OPPO, 骁龙小米, and 恒洁. Cards do not open or flip; hover reveals the corresponding supplied image.
6. Contact keeps the template composition and four rows: email, phone, WeChat, and resume.

## Identity And Copy

- Display name: Kai / KAI.
- Chinese name: 姜益栋.
- Birthday: 2004-06-15.
- Summary: `Skilled and enjoys finding new ways to solve problems.`
- Profile values: 创新 / 感受 / 结果导向; English supporting word: `patience`.
- Ambition: 想成为一个可以独当一面的人.
- Proof: Workflow optimization; End-to-end project delivery.
- Mountain caption: 25岁之前攀登一座雪山.
- Contact statement: `Let's build something meaningful together.`
- Availability: End-to-end project execution & delivery; Business problem solving.
- Email: 2280207099@qq.com.
- Phone: 13576085887.
- WeChat: Aurorahv.

## About Assistant

The existing DeepSeek-backed assistant remains functional and speaks for Kai. Its build-time knowledge pipeline stays automatic and incremental.

Knowledge sources:

- Current website-visible bilingual content.
- Kai's supplied resume image, transcribed into a structured bilingual public knowledge source.
- Kai's supplied long personal reflection about participating in 25+ projects and serving 200+ people.

The reflection is supporting knowledge, not a fixed greeting or fixed answer. The assistant may use it when answering about projects, growth, working style, problem solving, or execution. It must not turn broad reflection into fabricated project facts.

## Resume Behavior

Only `/Users/a1234/Desktop/简历.png` belongs to Kai. The desktop files `中文.png` and `英文.png` belong to the original owner and must not be copied.

The Kai resume image is used in the dossier and contact hover state. Clicking the resume entry opens a readable full-size image preview. Its public contents are transcribed for the AI knowledge build because the current PDF-only extractor cannot reliably extract text from a raster image.

## Asset Mapping

- Hero: `kai.png`.
- Location: `雪山.png`.
- Contact hover: `邮箱.png`, `手机.png`, `微信.png`, `简历.png`.
- Project hover: `hover/vivo.webp`, `hover/oppo.webp`, `hover/小米.jpg`, `hover/恒洁.webp`.
- Partner logos: all files under Desktop `图标`.
- 骁龙 vivo / OPPO / 小米 use the corresponding vivo, OPPO, and 小米 logos.

## Partner Universe

Use the supplied logos for 恒洁, 李宁, New Balance, OPPO Find N6, OPPO 一加, 小米 Pad, 雷士, 掌阅, 西门子, 骁龙 vivo, 骁龙 OPPO, and 骁龙小米. Reuse logo artwork where one brand represents multiple named collaborations, but keep each collaboration label separately accessible.

## Interaction Rules

- Preserve existing page entrance, scroll, name-letter, spider chat, folder, paper modal, language, and contact hover/copy interactions.
- Preserve the project carousel/layout motion where it supports the template.
- Remove project click handlers, flip/modal affordances, and project detail modal.
- Each project card displays its collaboration logo at rest and directly reveals the supplied project image on hover and keyboard focus.
- Contact entries use the supplied wide hover artwork without reducing keyboard accessibility.

## Responsive And Accessibility

Maintain current desktop and mobile breakpoints. All interactive elements keep visible focus states, semantic labels, keyboard behavior, and bilingual labels. Hover reveals must have equivalent `:focus-visible` behavior. Long Chinese and English copy must not overflow.

## Verification

- Confirm the original source repository remains byte-for-byte unmodified at Git status level.
- Run the full Node test suite.
- Run two consecutive production builds; the second knowledge build must report zero changed blocks.
- Verify generated knowledge contains Kai and excludes EIDDIE/Jia Yongshuo facts.
- Verify named project retrieval does not include unrelated projects.
- Browser-check desktop and mobile hero, About folder/chat, partner universe, all four project hovers, contact hovers, language switch, and resume preview.
- Push the verified `main` branch to `jianghankai/my-portfolio`.
