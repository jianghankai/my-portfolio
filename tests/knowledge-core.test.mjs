import assert from "node:assert/strict";
import test from "node:test";

import {
  buildDeterministicEntry,
  formatKnowledgeContext,
  hashKnowledgeBlock,
  mergeKnowledgeEntries,
  selectKnowledgeEntries,
} from "../server/knowledge-core.mjs";

const profileBlock = {
  id: "profile",
  type: "profile",
  title: "Sample Profile",
  aliases: ["示例作者", "Sample Profile"],
  keywords: ["作品集作者", "portfolio author"],
  priority: 100,
  content: {
    zh: "Sample Profile 是一名作品集作者。",
    en: "Sample Profile is a test profile.",
  },
  links: [],
};

const skillsBlock = {
  id: "skills",
  type: "skills",
  title: "Skills",
  aliases: ["技能", "技术栈"],
  keywords: ["React", "TypeScript", "设计"],
  priority: 80,
  content: {
    zh: "React、TypeScript、体验设计。",
    en: "React, TypeScript, and experience design.",
  },
  links: [],
};

const yeverseBlock = {
  id: "project-yeverse",
  type: "project",
  title: "Project Atlas",
  aliases: ["Project Atlas"],
  keywords: ["Three.js", "项目档案", "artist archive"],
  priority: 60,
  content: {
    zh: "Project Atlas 是一个沉浸式项目档案。",
    en: "Project Atlas is an immersive project archive.",
  },
  links: ["https://example.com/project-atlas"],
};

test("hashKnowledgeBlock ignores object key order and repeated whitespace", () => {
  const first = {
    ...yeverseBlock,
    content: { zh: "Project Atlas  是一个\n沉浸式档案。", en: "Project archive" },
  };
  const second = {
    content: { en: "Project archive", zh: "Project Atlas 是一个 沉浸式档案。" },
    priority: 60,
    keywords: ["Three.js", "项目档案", "artist archive"],
    aliases: ["Project Atlas"],
    links: ["https://example.com/project-atlas"],
    title: "Project Atlas",
    type: "project",
    id: "project-yeverse",
  };

  assert.equal(hashKnowledgeBlock(first), hashKnowledgeBlock(second));
});

test("mergeKnowledgeEntries reuses entries whose source hash has not changed", () => {
  const previous = {
    ...buildDeterministicEntry(yeverseBlock),
    facts: {
      zh: "已由模型压缩的 Project Atlas 摘要。",
      en: "Previously compressed Project Atlas summary.",
    },
  };

  const result = mergeKnowledgeEntries({
    blocks: [yeverseBlock],
    previousEntries: [previous],
    generatedEntries: [],
  });

  assert.equal(result[0].facts.zh, previous.facts.zh);
  assert.equal(result[0].sourceHash, hashKnowledgeBlock(yeverseBlock));
});

test("selectKnowledgeEntries ranks a directly named project and always includes profile", () => {
  const projectIndex = {
    id: "project-index",
    type: "index",
    title: "Projects",
    aliases: ["项目", "作品"],
    keywords: ["Project Atlas", "Project Beacon"],
    priority: 55,
    content: {
      zh: "当前公开项目：Project Atlas、Project Beacon。",
      en: "Current public projects: Project Atlas, Project Beacon.",
    },
    links: [],
  };
  const knowledge = {
    entries: [profileBlock, skillsBlock, projectIndex, yeverseBlock].map(buildDeterministicEntry),
  };

  const selected = selectKnowledgeEntries({
    knowledge,
    question: "Project Atlas 的 3D 场景交互是怎么做的？",
    language: "zh",
    limit: 3,
  });

  assert.deepEqual(
    selected.map((entry) => entry.id),
    ["profile", "project-yeverse"],
  );
});

test("selectKnowledgeEntries falls back to profile and skills for a general question", () => {
  const knowledge = {
    entries: [profileBlock, skillsBlock, yeverseBlock].map(buildDeterministicEntry),
  };

  const selected = selectKnowledgeEntries({
    knowledge,
    question: "你适合怎样的合作方式？",
    language: "zh",
    limit: 3,
  });

  assert.deepEqual(
    selected.map((entry) => entry.id),
    ["profile", "skills"],
  );
});

test("formatKnowledgeContext uses only the requested language", () => {
  const context = formatKnowledgeContext(
    [buildDeterministicEntry(yeverseBlock)],
    "en",
  );

  assert.match(context, /immersive project archive/);
  assert.doesNotMatch(context, /沉浸式/);
});
