import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import test from "node:test";

import { extractPortfolioBlocks } from "../scripts/portfolio-source.mjs";

const rootDir = resolve(import.meta.dirname, "..");
const readSource = (file) => readFile(resolve(rootDir, file), "utf8");

test("page source presents Kai identity and removes original-owner identity", async () => {
  const [html, assistant] = await Promise.all([
    readSource("index.html"),
    readSource("server/assistant-handler.mjs"),
  ]);
  const publicSource = `${html}\n${assistant}`;

  assert.match(html, /KAI/);
  assert.match(html, /姜益栋/);
  assert.match(html, /Knowledge/);
  assert.match(html, /Analyze/);
  assert.match(html, /Innovate/);
  assert.match(publicSource, /13576085887/);
  assert.match(publicSource, /2280207099@qq\.com/);
  assert.match(publicSource, /Aurorahv/);
  assert.doesNotMatch(publicSource, /legacy-owner-marker/i);
});

test("page source contains one badge per collaboration logo", async () => {
  const html = await readSource("index.html");
  const partners = [
    "恒洁",
    "李宁",
    "New Balance",
    "OPPO",
    "一加",
    "小米",
    "雷士",
    "掌阅",
    "西门子",
    "vivo",
  ];

  for (const partner of partners) {
    assert.match(html, new RegExp(partner, "i"));
  }

  const badgeUrls = [...html.matchAll(/class="tool-badge[^"]*"[^>]+--icon:url\('([^']+)'\)/g)].map((match) => match[1]);
  assert.equal(badgeUrls.length, 10);
  assert.equal(new Set(badgeUrls).size, 10);
});

test("projects are exactly four hover-only collaboration cards", async () => {
  const [html, script] = await Promise.all([readSource("index.html"), readSource("script.js")]);
  const cardCount = (html.match(/class="project-card reveal"/g) ?? []).length;

  assert.equal(cardCount, 4);
  assert.match(html, /Snapdragon vivo/);
  assert.match(html, /Snapdragon OPPO/);
  assert.match(html, /Snapdragon Xiaomi/);
  assert.match(html, /HEGII/);
  assert.match(html, /\/kai\/projects\/vivo\.webp/);
  assert.match(html, /\/kai\/projects\/oppo\.webp/);
  assert.match(html, /\/kai\/projects\/xiaomi\.jpg/);
  assert.match(html, /\/kai\/projects\/hengjie\.webp/);
  assert.match(html, /\/kai\/logos\/oppo\.svg/);
  assert.doesNotMatch(html, /悬停查看项目画面|Hover to reveal project imagery/);
  assert.doesNotMatch(html, /id="project-modal"/);
  assert.doesNotMatch(script, /button\.addEventListener\("click", \(\) => openModal/);
});

test("contact area exposes email phone wechat and resume with supplied hover art", async () => {
  const html = await readSource("index.html");
  const contactRows = (html.match(/class="contact-link /g) ?? []).length;

  assert.equal(contactRows, 4);
  assert.match(html, /2280207099@qq\.com/);
  assert.match(html, /13576085887/);
  assert.match(html, /Aurorahv/);
  assert.match(html, /\/kai\/contact\/email\.png/);
  assert.match(html, /\/kai\/contact\/phone\.png/);
  assert.match(html, /\/kai\/contact\/wechat\.png/);
  assert.match(html, /\/kai\/resume\.png/);
});

test("knowledge extraction includes Kai resume and reflection without original-owner facts", async () => {
  const blocks = await extractPortfolioBlocks({ rootDir, includeResumes: true });
  const serialized = JSON.stringify(blocks);

  assert.match(serialized, /Kai/);
  assert.match(serialized, /姜益栋/);
  assert.match(serialized, /25\+/);
  assert.match(serialized, /200\+/);
  assert.match(serialized, /符李/);
  assert.match(serialized, /Workflow optimization/);
  assert.doesNotMatch(serialized, /legacy-owner-marker|legacy-project-marker/i);
});
