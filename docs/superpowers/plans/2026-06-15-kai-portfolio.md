# Kai Portfolio Template Adaptation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a fully adapted Kai portfolio that preserves the original template while replacing identity, content, assets, project behavior, contact data, and AI knowledge.

**Architecture:** Copy the existing Vite application into a clean target repository, retain its static HTML/CSS/JavaScript and Node/Vercel assistant architecture, and make content changes at the current source-of-truth boundaries. Add a structured Kai profile module so raster-resume facts and the supplied reflection enter the existing incremental knowledge generator without runtime scraping.

**Tech Stack:** Vite, vanilla HTML/CSS/JavaScript, Node test runner, DeepSeek API, parse5, acorn, pdfjs-dist, Playwright/browser verification.

---

### Task 1: Establish The Independent Template Repository

**Files:**
- Copy: all tracked source files from `/Users/a1234/Documents/New project 3`
- Preserve: target `.git`
- Exclude: source `.git`, `node_modules`, `dist`, `.superpowers`

- [ ] Copy the complete template source into the target repository.
- [ ] Confirm `git status` in the original repository remains clean.
- [ ] Install dependencies in the target.
- [ ] Run the original tests as a clean baseline.

### Task 2: Add Kai Knowledge Source Tests

**Files:**
- Modify: `tests/portfolio-source.test.mjs`
- Create: `content/kai-profile.mjs`
- Modify: `scripts/portfolio-source.mjs`

- [ ] Add failing tests asserting that extracted blocks contain Kai, 姜益栋, the 25+ project reflection, and resume experience.
- [ ] Add failing tests asserting that extracted blocks exclude EIDDIE and 贾永硕.
- [ ] Run the focused test and verify the expected failure.
- [ ] Create `content/kai-profile.mjs` with bilingual structured public facts, resume transcription, confirmed phone metadata, and reflection.
- [ ] Extend `scripts/portfolio-source.mjs` to convert that structured source into knowledge blocks.
- [ ] Run the focused test and verify it passes.

### Task 3: Migrate And Normalize Assets

**Files:**
- Create: `public/kai/hero.png`
- Create: `public/kai/mountain.png`
- Create: `public/kai/resume.png`
- Create: `public/kai/contact/*`
- Create: `public/kai/partners/*`
- Create: `public/kai/projects/*`

- [ ] Copy only Kai-owned desktop assets into predictable ASCII paths.
- [ ] Exclude Desktop `中文.png` and `英文.png`.
- [ ] Verify every referenced file exists and is a valid image.

### Task 4: Replace Identity And About Content

**Files:**
- Modify: `index.html`
- Modify: `script.js`
- Modify: `styles.css`
- Modify: `server/assistant-handler.mjs`

- [ ] Add failing source tests for Kai title, K/A/I deconstruction, dossier facts, contact facts, and absence of original identity.
- [ ] Run tests and verify the expected failures.
- [ ] Replace metadata, hero label, section summary, name deconstruction, About labels, dossier cards, resume preview, and paper modal content.
- [ ] Update the assistant persona, validation messages, and status copy from EIDDIE to Kai.
- [ ] Add bilingual strings and preserve the current language switching mechanism.
- [ ] Run tests and verify they pass.

### Task 5: Replace Skill Universe With Collaboration Logos

**Files:**
- Modify: `index.html`
- Modify: `styles.css`

- [ ] Add a failing DOM/source assertion for the 12 collaboration labels.
- [ ] Replace all current tool badges with the supplied partner assets.
- [ ] Preserve the existing web composition, badge motion, focus behavior, and responsive positioning.
- [ ] Verify logos use contained image sizing without distortion.

### Task 6: Simplify Selected Projects To Hover Reveals

**Files:**
- Modify: `index.html`
- Modify: `script.js`
- Modify: `styles.css`
- Modify: `tests/portfolio-source.test.mjs`

- [ ] Add failing assertions for exactly four project cards and no project modal.
- [ ] Add failing assertions for the four project names and their image mappings.
- [ ] Remove obsolete project modal markup and click/flip logic.
- [ ] Replace project data with 骁龙 vivo, 骁龙 OPPO, 骁龙小米, and 恒洁.
- [ ] Implement direct hover and keyboard-focus image reveals while retaining the template's card composition.
- [ ] Run tests and verify they pass.

### Task 7: Rebuild Contact Rows And Resume Preview

**Files:**
- Modify: `index.html`
- Modify: `script.js`
- Modify: `styles.css`

- [ ] Add failing assertions for exactly four rows: email, phone, WeChat, resume.
- [ ] Add the supplied hover artwork to each row.
- [ ] Keep copy behavior for email, phone, and WeChat.
- [ ] Make the resume row and dossier resume open the full-size Kai resume image.
- [ ] Update the closing statement and availability copy.
- [ ] Verify keyboard and mobile behavior.

### Task 8: Rebuild And Verify Automatic Knowledge

**Files:**
- Update generated: `generated/portfolio-knowledge.json`
- Modify tests only if required by the new structured source contract.

- [ ] Run the full test suite.
- [ ] Run `npm run build` and inspect changed knowledge blocks.
- [ ] Run `npm run build` again and require `0 changed blocks`.
- [ ] Query retrieval for Kai, 骁龙 vivo, 恒洁, project experience, and contact details.
- [ ] Scan generated knowledge and runtime prompts for stale original-owner facts.

### Task 9: Browser Verification And Polish

**Files:**
- Modify only files implicated by observed defects.

- [ ] Start the Vite development server.
- [ ] Verify desktop at a common 1440px viewport.
- [ ] Verify mobile at a common 390px viewport.
- [ ] Exercise language switching, folder open/close, AI chat UI, all four project reveals, contact hovers/copy buttons, and resume preview.
- [ ] Fix observed overflow, crop, contrast, and focus issues with failing regression checks where practical.
- [ ] Repeat build and tests after fixes.

### Task 10: Publish

**Files:**
- Stage all target repository files.

- [ ] Confirm original repository is still clean.
- [ ] Inspect target `git status` and final diff.
- [ ] Commit the complete adaptation on `main`.
- [ ] Push `main` to `origin`.
- [ ] Confirm the remote branch resolves to the new commit.
