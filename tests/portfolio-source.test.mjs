import assert from "node:assert/strict";
import test from "node:test";
import { resolve } from "node:path";

import {
  extractPortfolioBlocks,
  extractResumeText,
  loadPortfolioSourceData,
} from "../scripts/portfolio-source.mjs";

const rootDir = resolve(import.meta.dirname, "..");

test("loadPortfolioSourceData reads Kai projects and dossier content", async () => {
  const source = await loadPortfolioSourceData({ rootDir });

  assert.ok(source.projects["snapdragon-vivo"]);
  assert.ok(source.projects.hengjie);
  assert.equal(Object.keys(source.projects).length, 4);
  assert.match(source.dossier.profile.zh.body, /姜益栋/);
  assert.match(source.dossier.experience.en.title, /Proof/);
  assert.match(source.resumeUrls.zh, /kai\/resume\.png$/);
});

test("extractPortfolioBlocks creates focused entries without navigation or decorative copy", async () => {
  const blocks = await extractPortfolioBlocks({ rootDir, includeResumes: false });
  const ids = blocks.map((block) => block.id);
  const serialized = JSON.stringify(blocks);

  assert.ok(ids.includes("profile"));
  assert.ok(ids.includes("skills"));
  assert.ok(ids.includes("site-overview"));
  assert.ok(ids.includes("project-snapdragon-vivo"));
  assert.ok(ids.includes("project-hengjie"));
  assert.ok(ids.includes("project-index"));
  assert.match(
    blocks.find((block) => block.id === "site-overview").content.en,
    /Skilled and enjoys/,
  );
  assert.doesNotMatch(serialized, /Scroll Down|CLICK ME OR THE FILE|ISSUES/);
});

test("structured resume transcription is included for the raster resume", async () => {
  const blocks = await extractPortfolioBlocks({ rootDir, includeResumes: true });
  const resume = blocks.find((block) => block.id === "kai-resume-experience");

  assert.ok(resume);
  assert.match(resume.content.zh, /符李/);
  assert.match(resume.content.en, /Xiaohongshu/);
});
