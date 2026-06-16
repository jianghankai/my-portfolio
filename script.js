const root = document.documentElement;
const siteLoader = document.getElementById("site-loader");
const siteLoaderProgress = document.getElementById("site-loader-progress");
const siteLoaderVideo = document.querySelector(".site-loader__video");
const heroSection = document.querySelector(".hero-section");
const heroPeelElement = document.getElementById("hero-peel");
const nameSection = document.querySelector(".name-section");
const nameRows = [...document.querySelectorAll(".name-row")];
const topbar = document.querySelector(".topbar");
const topbarToggle = document.getElementById("topbar-toggle");
const topbarNav = document.getElementById("topbar-nav");
const topbarNavLinks = [...document.querySelectorAll(".topbar-nav a")];
const issueSections = [...document.querySelectorAll(".issue-section[data-issue]")];
const aboutSection = document.querySelector(".issue-section--about");
const aboutHeading = document.querySelector(".issue-section--about .section-heading");
const aboutPanel = document.querySelector(".issue-section--about .about-panel");
const aboutSpiderScene = document.getElementById("about-spider-chat-trigger");
const aboutChatPaper = document.getElementById("about-chat-paper");
const aboutChatScroll = document.getElementById("about-chat-scroll");
const aboutChatForm = document.getElementById("about-chat-form");
const aboutChatInput = document.getElementById("about-chat-input");
const skillsSection = document.querySelector(".issue-section--skills");
const projectsSection = document.querySelector(".issue-section--projects");
const contactSection = document.querySelector(".issue-section--contact");
const projectGrid = document.querySelector(".issue-section--projects .project-grid");
const projectCards = [...document.querySelectorAll(".issue-section--projects .project-card")];
const skillBadges = [...document.querySelectorAll(".issue-section--skills .tool-badge")];
const revealItems = [...document.querySelectorAll(".reveal")].filter(
  (item) => !item.classList.contains("project-card"),
);
const projectButtons = document.querySelectorAll(".project-card__button[data-project-id]");
const projectModal = document.getElementById("project-modal");
const modalPanel = document.querySelector(".project-modal__panel");
const modalFront = document.getElementById("project-modal-front");
const modalMirror = document.getElementById("project-modal-mirror");
const modalTitle = document.getElementById("project-modal-title");
const modalType = document.getElementById("project-modal-type");
const modalDescription = document.getElementById("project-modal-description");
const modalDomain = document.getElementById("project-modal-domain");
const modalGithub = document.getElementById("project-modal-github");
const modalGithubNote = document.getElementById("project-modal-github-note");
const modalMeta = document.getElementById("project-modal-meta");
const modalSignals = document.getElementById("project-modal-signals");
const modalPreview = document.getElementById("project-modal-preview");
const modalProofs = document.getElementById("project-modal-proofs");
const modalProofTrigger = document.getElementById("project-modal-proof-trigger");
const modalProofSheet = document.getElementById("project-modal-proof-sheet");
const contactIcon = document.querySelector(".contact-callout__icon");
const copyContactButtons = [...document.querySelectorAll(".contact-link--copy[data-copy-value]")];
const resumeLink = document.querySelector(".contact-link--resume");
const languageToggle = document.getElementById("language-toggle");
const heroScrollLabel = document.querySelector(".hero-scroll__label");
const nameTranslationNodes = [...document.querySelectorAll(".name-translation")];
const nameLetterOverlayNodes = nameRows.map((row, index) => {
  const shell = row.querySelector(".name-letter-shell");
  if (!(shell instanceof HTMLElement)) return null;

  const overlay = document.createElement("span");
  overlay.className = "name-letter-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.textContent = nameTranslationNodes[index]?.textContent?.trim() ?? "";
  shell.append(overlay);
  return overlay;
});
const contactCopy = document.querySelector(".contact-copy");
const modalProofHeading = document.querySelector(".project-modal__proof-heading");
const modalProofNote = document.querySelector(".project-modal__proof-note");

let activeProjectButton = null;
let activeProjectData = null;
let closeTimer = null;
let closeStageTimer = null;
let flipTimer = null;
let collapseAnimation = null;
let suppressedHoverButton = null;
let lastPointerPosition = null;
let heroPeel = null;
let heroPeelTime = 0;
let currentLanguage = "zh";
const visibleIssueSections = new Set();
const issueIntersectionRatios = new Map();
const copyFeedbackTimers = new WeakMap();
let aboutChatTypingTimer = null;

const PANEL_TRANSITION_MS = 620;
const CLOSE_RETURN_DELAY_MS = 520;
const CLOSE_COLLAPSE_MS = 760;
const FLIP_DELAY_MS = 120;
const MODAL_EXIT_BUFFER_MS = 90;
const SKILL_BADGE_SEQUENCE = [7, 2, 10, 4, 1, 13, 8, 14, 9, 16, 6, 15, 5, 11, 3, 12];
const LANGUAGE_STORAGE_KEY = "site-language";
const lowMemoryDevice =
  Boolean(navigator.connection?.saveData) ||
  (typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 8);
const LOADER_MIN_VISIBLE_MS = 1800;
const LOADER_MAX_WAIT_MS = 15000;
const LOADER_RESOURCE_TIMEOUT_MS = 12000;
const ABOUT_CHAT_TIMEOUT_MS = 6500;
const RESUME_URLS = {
  zh: "/kai/resume.png",
  en: "/kai/resume.png",
  previewZh: "/kai/resume.png",
  previewEn: "/kai/resume.png",
};
const LANGUAGE_COPY = {
  zh: {
    buttonLabel: "CH",
    buttonAria: "Switch to English",
    htmlLang: "zh-CN",
    heroScroll: "向下滑动",
    nameTranslations: ["知识建构", "分析拆解", "创新解决"],
    secondaryProjects: {
      "project-two.dev": {
        intro: "前台体验和后台逻辑同一个节奏推进。",
        description: "从界面系统到后端交付一体推进，强调完整产品感，而不是把功能零散拼接。",
        meta: "产品化 / UI / API",
      },
      "project-three.dev": {
        intro: "不是纯视觉实验，而是有明确功能目标的表达型作品。",
        description: "偏表达型的实验项目，但仍然保留明确功能，让视觉冲击和实际用途同时成立。",
        meta: "创意交互 / 动效 / 可用性",
      },
      "project-four.dev": {
        intro: "更偏系统侧的能力拼接，适合做复杂环境中的解决方案。",
        description: "把基础设施、边缘设备或网络环境相关能力组合起来，做成更偏系统层的项目。",
        meta: "系统实践 / 网络 / 硬件边缘",
      },
    },
    contactCopy: "Let's build something meaningful together.",
    modal: {
      proofTrigger: "查看上线证明",
      proofTriggerWithCount: (count) => `查看上线证明与用户反馈 (${count})`,
      proofHeading: "上线证明与用户反馈",
      proofNote: "补充证据放在这里，不占主预览位置。",
      previewAria: (title) => `播放 ${title ?? "项目演示视频"}`,
      previewPlay: "播放演示",
      previewPending: "视频待补充",
      previewTitle: "项目预览",
      previewVideoTitle: "项目演示视频",
      previewNote: "项目预览素材待补充。",
    },
  },
  en: {
    buttonLabel: "EN",
    buttonAria: "Switch to Chinese",
    htmlLang: "en",
    heroScroll: "Scroll Down",
    nameTranslations: ["Knowledge Building", "Problem Analysis", "Innovative Solutions"],
    secondaryProjects: {
      "project-two.dev": {
        intro: "Interface quality and backend logic move forward in the same rhythm.",
        description: "A product built end to end, from interface system to backend delivery, with emphasis on coherence instead of stitching isolated features together.",
        meta: "Productization / UI / API",
      },
      "project-three.dev": {
        intro: "Not just a visual experiment, but an expressive build with a clear functional target.",
        description: "An expression-driven experimental project that still keeps a clear function, so visual impact and practical use can exist together.",
        meta: "Creative Interaction / Motion / Usability",
      },
      "project-four.dev": {
        intro: "A more systems-oriented build, suited to solving problems in complex environments.",
        description: "A systems-layer project that combines infrastructure, edge devices, or network-related capabilities into one solution.",
        meta: "Systems / Networking / Edge Hardware",
      },
    },
    contactCopy: "Let's build something meaningful together.",
    modal: {
      proofTrigger: "View launch proof",
      proofTriggerWithCount: (count) => `View launch proof and feedback (${count})`,
      proofHeading: "Launch Proof and User Feedback",
      proofNote: "Supporting evidence lives here without taking over the main preview.",
      previewAria: (title) => `Play ${title ?? "project demo video"}`,
      previewPlay: "Play Demo",
      previewPending: "Video Pending",
      previewTitle: "Project Preview",
      previewVideoTitle: "project demo video",
      previewNote: "Preview assets will be added here.",
    },
  },
};
const TEMPLATE_PROJECT_DETAILS = {};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const easeOutCubic = (value) => 1 - (1 - value) ** 3;
const easeInCubic = (value) => value ** 3;
const easeInOutQuad = (value) =>
  value < 0.5 ? 2 * value * value : 1 - ((-2 * value + 2) ** 2) / 2;
const isLocalizedValue = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value) && "zh" in value && "en" in value;

const getStoredLanguage = () => {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored === "en" ? "en" : stored === "zh" ? "zh" : null;
  } catch {
    return null;
  }
};

const storeLanguage = (language) => {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // ignore storage failures
  }
};

const getCopy = () => LANGUAGE_COPY[currentLanguage];
const getModalCopy = () => getCopy().modal;

const localizeValue = (value) => {
  if (isLocalizedValue(value)) return value[currentLanguage] ?? value.zh;
  return value;
};

const localizeProjectDetail = (detail) => {
  if (!detail) return null;

  return {
    ...detail,
    title: localizeValue(detail.title),
    type: localizeValue(detail.type),
    frontIntro: localizeValue(detail.frontIntro),
    description: localizeValue(detail.description),
    meta: localizeValue(detail.meta),
    githubNote: localizeValue(detail.githubNote),
    signals: localizeValue(detail.signals) ?? [],
    cover: detail.cover
      ? {
          ...detail.cover,
          logo: detail.cover.logo ? { ...detail.cover.logo } : null,
          impact: detail.cover.impact
            ? {
                ...detail.cover.impact,
                text: localizeValue(detail.cover.impact.text),
              }
            : null,
        }
      : null,
    preview: detail.preview
      ? {
          ...detail.preview,
          label: localizeValue(detail.preview.label),
          title: localizeValue(detail.preview.title),
          note: localizeValue(detail.preview.note),
        }
      : null,
    proofs: Array.isArray(detail.proofs)
      ? detail.proofs.map((proof) => ({
          ...proof,
          title: localizeValue(proof.title),
          description: localizeValue(proof.description),
          alt: localizeValue(proof.alt),
        }))
      : [],
  };
};

const applyStaticLanguage = () => {
  const copy = getCopy();

  document.documentElement.lang = copy.htmlLang;

  if (languageToggle) {
    languageToggle.textContent = copy.buttonLabel;
    languageToggle.setAttribute("aria-label", copy.buttonAria);
  }

  if (heroScrollLabel) {
    heroScrollLabel.textContent = copy.heroScroll;
  }

  nameTranslationNodes.forEach((node, index) => {
    const nextText = copy.nameTranslations[index];
    if (nextText) node.textContent = nextText;
    if (nameLetterOverlayNodes[index]) {
      nameLetterOverlayNodes[index].textContent = nextText ?? "";
    }
  });

  if (contactCopy) {
    contactCopy.textContent = copy.contactCopy;
  }

  if (resumeLink instanceof HTMLAnchorElement) {
    resumeLink.setAttribute("href", RESUME_URLS[currentLanguage]);
  }

  if (modalProofHeading) {
    modalProofHeading.textContent = copy.modal.proofHeading;
  }

  if (modalProofNote) {
    modalProofNote.textContent = copy.modal.proofNote;
  }
};

const dismissSiteLoader = () => {
  if (!(siteLoader instanceof HTMLElement) || siteLoader.dataset.dismissed === "true") return;

  siteLoader.dataset.dismissed = "true";
  if (siteLoaderProgress instanceof HTMLElement) siteLoaderProgress.style.inlineSize = "100%";
  document.body.classList.remove("is-site-loading");
  siteLoader.classList.add("is-loaded");

  window.setTimeout(() => {
    siteLoader.hidden = true;
  }, 620);
};

const setSiteLoaderProgress = (value) => {
  if (!(siteLoaderProgress instanceof HTMLElement)) return;
  siteLoaderProgress.style.inlineSize = `${Math.max(0, Math.min(100, value))}%`;
};

const normalizeAssetUrl = (value) => {
  if (!value || value.startsWith("data:") || value.startsWith("blob:")) return null;
  try {
    const url = new URL(value, window.location.href);
    if (url.origin !== window.location.origin) return null;
    return url.href;
  } catch {
    return null;
  }
};

const extractUrlsFromText = (text = "") => {
  const urls = [];
  const urlPattern = /url\((['"]?)(.*?)\1\)/g;
  let match = urlPattern.exec(text);
  while (match) {
    const normalized = normalizeAssetUrl(match[2]);
    if (normalized) urls.push(normalized);
    match = urlPattern.exec(text);
  }
  return urls;
};

const collectDeclaredAssetUrls = () => {
  const urls = new Set();

  document.querySelectorAll("img[src], video[src], source[src]").forEach((node) => {
    const src = node.getAttribute("src");
    const normalized = normalizeAssetUrl(src);
    if (normalized) urls.add(normalized);
  });

  document.querySelectorAll("[style]").forEach((node) => {
    extractUrlsFromText(node.getAttribute("style") ?? "").forEach((url) => urls.add(url));
  });

  Array.from(document.styleSheets).forEach((sheet) => {
    let rules = [];
    try {
      rules = Array.from(sheet.cssRules ?? []);
    } catch {
      return;
    }

    const visitRule = (rule) => {
      extractUrlsFromText(rule.cssText ?? "").forEach((url) => urls.add(url));
      Array.from(rule.cssRules ?? []).forEach(visitRule);
    };

    rules.forEach(visitRule);
  });

  return Array.from(urls).filter((url) => /\.(avif|webp|png|jpe?g|gif|svg|mp4)(\?.*)?$/i.test(url));
};

const waitForImageAsset = (url) =>
  new Promise((resolve) => {
    const image = new Image();
    const done = () => resolve(url);
    image.decoding = "async";
    image.onload = done;
    image.onerror = done;
    image.src = url;
    if (image.complete) done();
  });

const waitForVideoMetadata = (url) =>
  new Promise((resolve) => {
    const video = document.createElement("video");
    const done = () => resolve(url);
    video.muted = true;
    video.preload = "metadata";
    video.onloadedmetadata = done;
    video.onerror = done;
    video.src = url;
    video.load();
  });

const waitForDeclaredAssets = () => {
  const urls = collectDeclaredAssetUrls();
  const waiters = urls.map((url) =>
    /\.mp4(\?.*)?$/i.test(url) ? waitForVideoMetadata(url) : waitForImageAsset(url),
  );

  return Promise.race([
    Promise.allSettled(waiters),
    new Promise((resolve) => window.setTimeout(resolve, LOADER_RESOURCE_TIMEOUT_MS)),
  ]);
};

const promoteInitialMediaLoading = () => {
  document.querySelectorAll("img[loading='lazy']").forEach((image) => {
    image.loading = "eager";
    image.decoding = "auto";
  });
};

const waitForLoaderVideoPlayback = () =>
  new Promise((resolve) => {
    if (!(siteLoaderVideo instanceof HTMLVideoElement)) {
      resolve();
      return;
    }

    let resolved = false;
    const done = () => {
      if (resolved) return;
      resolved = true;
      cleanup();
      resolve();
    };
    const handleTimeUpdate = () => {
      if (siteLoaderVideo.currentTime > 0.08) done();
    };
    const cleanup = () => {
      window.clearTimeout(timeout);
      siteLoaderVideo.removeEventListener("timeupdate", handleTimeUpdate);
      siteLoaderVideo.removeEventListener("playing", handleTimeUpdate);
      siteLoaderVideo.removeEventListener("canplay", tryPlay);
      siteLoaderVideo.removeEventListener("error", done);
    };
    const tryPlay = () => {
      const playAttempt = siteLoaderVideo.play();
      if (playAttempt?.catch) playAttempt.catch(() => {});
      handleTimeUpdate();
    };
    const timeout = window.setTimeout(done, 4200);

    siteLoaderVideo.addEventListener("timeupdate", handleTimeUpdate);
    siteLoaderVideo.addEventListener("playing", handleTimeUpdate);
    siteLoaderVideo.addEventListener("canplay", tryPlay);
    siteLoaderVideo.addEventListener("error", done);
    if (siteLoaderVideo.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) tryPlay();
    else siteLoaderVideo.load();
  });

const applyFolderLanguage = () => {
  const lang = currentLanguage;
  document.querySelectorAll("[data-lang-zh]").forEach((node) => {
    const text = node.dataset[`lang${lang.charAt(0).toUpperCase()}${lang.slice(1)}`];
    if (text) node.textContent = text;
  });

  const resumePreviewImage = document.querySelector(".resume-page__preview");
  if (resumePreviewImage) {
    resumePreviewImage.setAttribute("src", lang === "en" ? RESUME_URLS.previewEn : RESUME_URLS.previewZh);
  }
};

const applySecondaryProjectLanguage = () => {
  const projectCopy = getCopy().secondaryProjects;

  projectButtons.forEach((button) => {
    const detail = projectCopy[button.dataset.domain ?? ""];
    if (!detail) return;

    button.dataset.description = detail.description;
    button.dataset.meta = detail.meta;

    const intro = button.querySelector("p");
    if (intro) intro.textContent = detail.intro;
  });
};

const applyLanguage = (language, { persist = true } = {}) => {
  currentLanguage = language === "en" ? "en" : "zh";
  if (persist) {
    storeLanguage(currentLanguage);
  }

  applyStaticLanguage();
  applyFolderLanguage();
  applySecondaryProjectLanguage();
  hydrateProjectCards();

  if (activeProjectButton) {
    activeProjectData = getProjectDetail(activeProjectButton);
    populateModalContent(activeProjectData);
    const currentModalCard = modalFront?.querySelector(".project-card__button");
    syncModalCardScene(activeProjectButton, {
      scene: currentModalCard?.classList.contains("is-active-scene") ? "active" : "idle",
    });
  }
};

const setupHeroPeelPath = () => {
  if (!heroPeel || !heroPeelElement) return;

  heroPeel.setupDimensions();

  const width = heroPeelElement.offsetWidth;
  const height = heroPeelElement.offsetHeight;

  heroPeel.setPeelPath(
    width,
    height,
    width * 0.992,
    height * 0.972,
    width * 0.62,
    height * 0.28,
    width * -0.22,
    height * -0.26,
  );

  heroPeel.setTimeAlongPath(heroPeelTime);
};

const setupHeroPeel = () => {
  if (!heroPeelElement || typeof window.Peel !== "function" || heroPeel) return;

  heroPeel = new window.Peel(heroPeelElement, {
    corner: window.Peel.Corners.BOTTOM_RIGHT,
    setPeelOnInit: false,
    topShadowBlur: 8,
    topShadowAlpha: 0.22,
    topShadowOffsetX: 1,
    topShadowOffsetY: 2,
    backReflection: false,
    backShadowAlpha: 0.16,
    backShadowSize: 0.04,
    bottomShadowDarkAlpha: 0.22,
    bottomShadowLightAlpha: 0.06,
  });

  heroPeel.setFadeThreshold(1.01);
  setupHeroPeelPath();
  heroPeel.setTimeAlongPath(0);
};

const normalizeProjectUrl = (value) => {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

const getProjectDetail = (button) => {
  const projectId = button.dataset.projectId;
  const projectDetail = projectId ? TEMPLATE_PROJECT_DETAILS[projectId] : null;

  if (projectDetail) return localizeProjectDetail(projectDetail);

  const title =
    button.dataset.title ??
    button.querySelector("strong")?.textContent?.trim() ??
    "Project";
  const type =
    button.dataset.type ??
    button.querySelector(".project-card__type")?.textContent?.trim() ??
    "Project Type";
  const frontIntro = button.querySelector("p")?.textContent?.trim() ?? "";
  const linkLabel = button.dataset.domain ?? "";

  return {
    title,
    type,
    link: normalizeProjectUrl(linkLabel),
    linkLabel,
    frontIntro,
    description: button.dataset.description ?? frontIntro,
    meta: button.dataset.meta ?? "",
    signals: [],
    preview: null,
    proofs: [],
  };
};

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const sanitizeClassToken = (value = "") => String(value).replace(/[^a-z0-9_-]/gi, "");

const getProjectCardIndexLabel = (button) =>
  button.dataset.projectIndex ??
  button.querySelector(".project-card__index")?.textContent?.trim() ??
  "";

const applyProjectCoverTheme = (button, cover) => {
  const theme = cover?.theme ?? {};
  const styleEntries = [
    ["--cover-logo-asset", cover?.logo?.asset ? `url("${cover.logo.asset}")` : ""],
    ["--cover-art-asset", cover?.art?.asset ? `url("${cover.art.asset}")` : ""],
    ["--cover-origin-x", theme.originX],
    ["--cover-origin-y", theme.originY],
    ["--cover-logo-muted", theme.logoMuted],
    ["--cover-logo-active", theme.logoActive],
    ["--cover-logo-glow", theme.logoGlow],
    ["--cover-burst-accent", theme.burstAccent],
    ["--cover-burst-soft", theme.burstSoft],
    ["--cover-dot-muted", theme.dotMuted],
    ["--cover-dot-active", theme.dotActive],
    ["--cover-line-muted", theme.lineMuted],
    ["--cover-ray-light", theme.rayLight],
    ["--cover-ray-ink", theme.rayInk],
    ["--cover-panel-tint", theme.panelTint],
    ["--cover-accent", theme.accent],
    ["--cover-accent-soft", theme.accentSoft],
    ["--cover-ink-soft", theme.inkSoft],
    ["--cover-ink-strong", theme.inkStrong],
    ["--cover-line-soft", theme.lineSoft],
    ["--cover-line-strong", theme.lineStrong],
    ["--cover-net-line", theme.netLine],
    ["--cover-speedline-light", theme.speedlineLight],
    ["--cover-speedline-dark", theme.speedlineDark],
    ["--cover-border-active", theme.borderActive],
    ["--cover-shadow-active", theme.shadowActive],
  ];

  styleEntries.forEach(([property, value]) => {
    if (value) {
      button.style.setProperty(property, value);
    } else {
      button.style.removeProperty(property);
    }
  });
};

const buildLogoBurstCardMarkup = ({ indexLabel, detail, cover }) => {
  const impactText = cover?.impact?.text ?? "";
  const impactMode = sanitizeClassToken(cover?.impact?.mode);
  const impactClass = impactMode ? ` project-card__impact--${impactMode}` : "";

  return `
    <span class="project-card__cover" aria-hidden="true">
      <span class="project-card__cover-panel"></span>
      <span class="project-card__cover-burst"></span>
      <span class="project-card__cover-dots"></span>
      <span class="project-card__cover-rays"></span>
      <span class="project-card__cover-bubble"></span>
      <span class="project-card__cover-fragments"></span>
      <span class="project-card__logo">
        <span class="project-card__logo-mark"></span>
      </span>
    </span>
    <span class="project-card__impact${impactClass}" aria-hidden="true">${escapeHtml(impactText)}</span>
    <span class="project-card__copy">
      <span class="project-card__index">${escapeHtml(indexLabel)}</span>
      <strong>${escapeHtml(detail.title)}</strong>
      <span class="project-card__type">${escapeHtml(detail.type)}</span>
      <p>${escapeHtml(detail.frontIntro)}</p>
    </span>
  `;
};

const buildFootballInkCardMarkup = ({ indexLabel, detail, cover }) => {
  const impactText = cover?.impact?.text ?? "";
  const impactMode = sanitizeClassToken(cover?.impact?.mode);
  const impactClass = impactMode ? ` project-card__impact--${impactMode}` : "";

  return `
    <span class="project-card__cover" aria-hidden="true">
      <span class="project-card__cover-panel"></span>
      <span class="project-card__cover-dots"></span>
      <span class="project-card__cover-rays"></span>
      <span class="project-card__cover-goal"></span>
      <span class="project-card__cover-net"></span>
      <span class="project-card__cover-burst"></span>
      <span class="project-card__cover-shot"></span>
      <span class="project-card__cover-ball"></span>
      <span class="project-card__cover-fragments"></span>
      <span class="project-card__logo">
        <span class="project-card__logo-mark"></span>
      </span>
    </span>
    <span class="project-card__impact${impactClass}" aria-hidden="true">${escapeHtml(impactText)}</span>
    <span class="project-card__copy">
      <span class="project-card__index">${escapeHtml(indexLabel)}</span>
      <strong>${escapeHtml(detail.title)}</strong>
      <span class="project-card__type">${escapeHtml(detail.type)}</span>
      <p>${escapeHtml(detail.frontIntro)}</p>
    </span>
  `;
};

const resetProjectCardVariants = (button) => {
  button.classList.remove(
    "project-card__button--pow",
    "project-card__button--bang",
    "project-card__button--crash",
    "project-card__button--wham",
    "project-card__button--logo-burst",
    "project-card__button--bugpet-pixel",
    "project-card__button--football-ink",
    "project-card__button--scriptmind-wave",
    "project-card__button--yeverse-archive",
    "project-card__button--consilium-med",
    "project-card__button--lyricflow-sheet",
  );
};

const renderProjectCardCover = (button, localizedDetail) => {
  const cover = localizedDetail.cover;
  if (!cover?.profile) return false;

  if (cover.profile === "logo-burst") {
    const indexLabel = getProjectCardIndexLabel(button);
    resetProjectCardVariants(button);
    button.classList.add("project-card__button--logo-burst");
    button.dataset.coverProfile = cover.profile;
    applyProjectCoverTheme(button, cover);
    button.innerHTML = buildLogoBurstCardMarkup({ indexLabel, detail: localizedDetail, cover });
    return true;
  }

  if (cover.profile === "football-ink") {
    const indexLabel = getProjectCardIndexLabel(button);
    resetProjectCardVariants(button);
    button.classList.add("project-card__button--football-ink");
    button.dataset.coverProfile = cover.profile;
    applyProjectCoverTheme(button, cover);
    button.innerHTML = buildFootballInkCardMarkup({ indexLabel, detail: localizedDetail, cover });
    return true;
  }

  if (cover.profile === "scriptmind-wave") {
    const indexLabel = getProjectCardIndexLabel(button);
    resetProjectCardVariants(button);
    button.classList.add("project-card__button--logo-burst", "project-card__button--scriptmind-wave");
    button.dataset.coverProfile = cover.profile;
    applyProjectCoverTheme(button, cover);
    button.innerHTML = buildLogoBurstCardMarkup({ indexLabel, detail: localizedDetail, cover });
    return true;
  }

  if (cover.profile === "bugpet-pixel") {
    const indexLabel = getProjectCardIndexLabel(button);
    resetProjectCardVariants(button);
    button.classList.add("project-card__button--logo-burst", "project-card__button--bugpet-pixel");
    button.dataset.coverProfile = cover.profile;
    applyProjectCoverTheme(button, cover);
    button.innerHTML = buildLogoBurstCardMarkup({ indexLabel, detail: localizedDetail, cover });
    return true;
  }

  if (["yeverse-archive", "consilium-med", "lyricflow-sheet"].includes(cover.profile)) {
    const indexLabel = getProjectCardIndexLabel(button);
    resetProjectCardVariants(button);
    button.classList.add(
      "project-card__button--logo-burst",
      "project-card__button--scriptmind-wave",
      `project-card__button--${cover.profile}`,
    );
    button.dataset.coverProfile = cover.profile;
    applyProjectCoverTheme(button, cover);
    button.innerHTML = buildLogoBurstCardMarkup({ indexLabel, detail: localizedDetail, cover });
    return true;
  }

  return false;
};

const hydrateProjectCards = () => {
  projectButtons.forEach((button) => {
    const projectId = button.dataset.projectId;
    const projectDetail = projectId ? TEMPLATE_PROJECT_DETAILS[projectId] : null;
    if (!projectDetail) return;

    const localizedDetail = localizeProjectDetail(projectDetail);

    if (renderProjectCardCover(button, localizedDetail)) {
      button.setAttribute(
        "aria-label",
        currentLanguage === "zh"
          ? `${localizedDetail.title}，${localizedDetail.type}`
          : `${localizedDetail.title}, ${localizedDetail.type}`,
      );
      return;
    }

    const title = button.querySelector("strong");
    const type = button.querySelector(".project-card__type");
    const intro = button.querySelector("p");

    if (title) title.textContent = localizedDetail.title;
    if (type) type.textContent = localizedDetail.type;
    if (intro) intro.textContent = localizedDetail.frontIntro;
    button.setAttribute(
      "aria-label",
      currentLanguage === "zh"
        ? `${localizedDetail.title}，${localizedDetail.type}`
        : `${localizedDetail.title}, ${localizedDetail.type}`,
    );
  });
};

const getToolBadgeNumber = (badge) => {
  const badgeClass = [...badge.classList].find((className) => /^tool-badge--\d+$/.test(className));
  return badgeClass ? Number.parseInt(badgeClass.replace("tool-badge--", ""), 10) : null;
};

const initializeSkillBadges = () => {
  if (skillBadges.length === 0) return;

  const badgeOrder = new Map(SKILL_BADGE_SEQUENCE.map((badgeNumber, index) => [badgeNumber, index]));

  skillBadges.forEach((badge, fallbackIndex) => {
    const badgeNumber = getToolBadgeNumber(badge) ?? fallbackIndex + 1;
    const order = badgeOrder.get(badgeNumber) ?? fallbackIndex;
    const angle = (order / Math.max(skillBadges.length, 1)) * Math.PI * 2 - Math.PI * 0.56;
    const enterRadius = 14 + (order % 4) * 3.2;
    const driftRadius = 3.4 + (order % 3) * 1.45;
    const enterX = Math.cos(angle) * enterRadius;
    const enterY = Math.sin(angle) * enterRadius + 18;
    const enterRotate = ((order % 2 === 0 ? -1 : 1) * (4 + (order % 4) * 1.2));
    const driftX = Math.cos(angle + Math.PI / 3) * driftRadius;
    const driftY = -5.4 - (order % 4) * 1.15;
    const driftRotate = ((badgeNumber % 2 === 0 ? 1 : -1) * (0.38 + (order % 3) * 0.12));
    const driftScale = 0.009 + (order % 4) * 0.002;
    const floatDuration = 8.6 + (order % 5) * 0.8;
    const floatDelay = order * -0.53;

    badge.style.setProperty("--badge-order", String(order));
    badge.style.setProperty("--badge-enter-x", `${enterX.toFixed(2)}px`);
    badge.style.setProperty("--badge-enter-y", `${enterY.toFixed(2)}px`);
    badge.style.setProperty("--badge-enter-rotate", `${enterRotate.toFixed(2)}deg`);
    badge.style.setProperty("--badge-drift-x", `${driftX.toFixed(2)}px`);
    badge.style.setProperty("--badge-drift-y", `${driftY.toFixed(2)}px`);
    badge.style.setProperty("--badge-drift-rotate", `${driftRotate.toFixed(2)}deg`);
    badge.style.setProperty("--badge-drift-scale", driftScale.toFixed(4));
    badge.style.setProperty("--badge-float-duration", `${floatDuration.toFixed(2)}s`);
    badge.style.setProperty("--badge-float-delay", `${floatDelay.toFixed(2)}s`);
    badge.style.setProperty("--badge-pop", "0");
    badge.style.setProperty("--badge-float", "0");
    badge.style.setProperty("--badge-burst-y", "0px");
    badge.style.setProperty("--badge-burst-scale", "0");
    badge.style.setProperty("--badge-burst-rotate", "0deg");
  });
};

const setTopbarMenuState = (isOpen) => {
  if (!topbar || !topbarToggle) return;
  topbar.classList.toggle("is-open", isOpen);
  topbarToggle.setAttribute("aria-expanded", String(isOpen));
};

const trimContactIconBackground = () => {
  if (!(contactIcon instanceof HTMLImageElement) || contactIcon.dataset.trimmed === "true") return;

  const applyTrim = () => {
    if (!contactIcon.naturalWidth || !contactIcon.naturalHeight) return;

    const canvas = document.createElement("canvas");
    canvas.width = contactIcon.naturalWidth;
    canvas.height = contactIcon.naturalHeight;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    context.drawImage(contactIcon, 0, 0);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;

    for (let index = 0; index < data.length; index += 4) {
      const red = data[index];
      const green = data[index + 1];
      const blue = data[index + 2];
      const brightness = (red + green + blue) / 3;
      const saturation = Math.max(red, green, blue) - Math.min(red, green, blue);

      if (brightness > 247 && saturation < 22) {
        data[index + 3] = 0;
      } else if (brightness > 232 && saturation < 38) {
        const softness = (247 - brightness) / 15;
        data[index + 3] = Math.min(data[index + 3], Math.round(Math.max(softness, 0) * 255));
      }
    }

    context.putImageData(imageData, 0, 0);
    contactIcon.dataset.trimmed = "true";
    contactIcon.src = canvas.toDataURL("image/png");
  };

  if (contactIcon.complete) {
    applyTrim();
  } else {
    contactIcon.addEventListener("load", applyTrim, { once: true });
  }
};

const fallbackCopyText = (value) => {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  textarea.style.inset = "0 auto auto 0";
  document.body.append(textarea);
  textarea.select();

  let copied = false;

  try {
    copied = document.execCommand("copy");
  } catch (_error) {
    copied = false;
  }

  textarea.remove();
  return copied;
};

const copyTextToClipboard = async (value) => {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch (_error) {
      return fallbackCopyText(value);
    }
  }

  return fallbackCopyText(value);
};

const getAssistantFallback = (question = "") => {
  const normalized = question.trim();
  if (currentLanguage === "en") {
    return normalized
      ? "From this portfolio, Kai is strongest at breaking down problems, improving workflows, and carrying projects through delivery. Ask me about a project, collaboration, or working style and I will keep it specific."
      : "What do you want to ask me?";
  }

  return normalized
    ? "从这个作品集看，Kai 擅长拆解问题、优化流程，并把项目持续推进到完整交付。你可以继续问项目、合作经历或者做事方式，我会尽量说具体。"
    : "你有什么想问我的？";
};

const appendAboutChatMessage = (text, type = "spider") => {
  if (!aboutChatScroll) return null;
  const message = document.createElement("p");
  message.className = `about-chat-message about-chat-message--${type}`;
  message.textContent = text;
  aboutChatScroll.append(message);
  aboutChatScroll.scrollTop = aboutChatScroll.scrollHeight;
  return message;
};

const typeAboutChatMessage = (target, text) =>
  new Promise((resolve) => {
    if (!target) {
      resolve();
      return;
    }

    window.clearInterval(aboutChatTypingTimer);
    target.textContent = "";
    let index = 0;
    aboutChatTypingTimer = window.setInterval(() => {
      target.textContent += text.charAt(index);
      index += 1;
      if (aboutChatScroll) aboutChatScroll.scrollTop = aboutChatScroll.scrollHeight;
      if (index >= text.length) {
        window.clearInterval(aboutChatTypingTimer);
        aboutChatTypingTimer = null;
        resolve();
      }
    }, 18);
  });

const openAboutChat = () => {
  if (!aboutSpiderScene || !aboutChatPaper) return;
  aboutSpiderScene.classList.add("is-chat-open");
  aboutChatPaper.hidden = false;
  aboutChatPaper.getBoundingClientRect();
  aboutChatPaper.classList.add("is-visible");
  aboutChatInput?.focus({ preventScroll: true });
};

const closeAboutChat = () => {
  if (!aboutSpiderScene || !aboutChatPaper || aboutChatPaper.hidden) return;
  aboutSpiderScene.classList.remove("is-chat-open");
  aboutChatPaper.classList.remove("is-visible");
  window.setTimeout(() => {
    if (!aboutChatPaper.classList.contains("is-visible")) aboutChatPaper.hidden = true;
  }, 280);
};

const askAboutSpider = async (question) => {
  const trimmedQuestion = question.trim();
  if (!trimmedQuestion || !aboutChatForm) return;

  appendAboutChatMessage(trimmedQuestion, "user");
  if (aboutChatInput) aboutChatInput.value = "";

  const pending = appendAboutChatMessage("", "spider");
  aboutChatForm.classList.add("is-loading");
  const controller = typeof AbortController === "function" ? new AbortController() : null;
  const timeoutId = controller ? window.setTimeout(() => controller.abort(), ABOUT_CHAT_TIMEOUT_MS) : null;

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller?.signal,
      body: JSON.stringify({ question: trimmedQuestion, language: currentLanguage }),
    });
    const payload = await response.json().catch(() => ({}));
    const answer = response.ok ? payload.answer : getAssistantFallback(trimmedQuestion);
    await typeAboutChatMessage(pending, answer || getAssistantFallback(trimmedQuestion));
  } catch {
    await typeAboutChatMessage(pending, getAssistantFallback(trimmedQuestion));
  } finally {
    if (timeoutId) window.clearTimeout(timeoutId);
    aboutChatForm.classList.remove("is-loading");
  }
};

const setCopyFeedbackState = (button, state) => {
  button.classList.remove("is-copied", "is-copy-failed");

  const existingTimer = copyFeedbackTimers.get(button);
  if (existingTimer) {
    window.clearTimeout(existingTimer);
  }

  if (!state) return;

  button.classList.add(state);
  button.dataset.copyStatus = "COPIED";

  const resetTimer = window.setTimeout(() => {
    button.classList.remove("is-copied", "is-copy-failed");
    button.dataset.copyStatus = "COPIED";
    copyFeedbackTimers.delete(button);
  }, 1400);

  copyFeedbackTimers.set(button, resetTimer);
};

const initializeContactCopyButtons = () => {
  copyContactButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const copyValue = button.dataset.copyValue?.trim();
      if (!copyValue) return;

      const copied = await copyTextToClipboard(copyValue);
      setCopyFeedbackState(button, copied ? "is-copied" : "is-copy-failed");
    });
  });
};

const updateHeroProgress = () => {
  if (!heroSection) return;

  const rect = heroSection.getBoundingClientRect();
  const scrollable = rect.height - window.innerHeight;
  const progress = scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;
  const liftProgress = easeOutCubic(clamp((progress - 0.018) / 0.18, 0, 1));
  const peelIntro = easeOutCubic(clamp(progress / 0.06, 0, 1));
  const peelBuild = easeInOutQuad(clamp(progress / 0.58, 0, 1));
  const travelProgress = easeInOutQuad(clamp((progress - 0.6) / 0.34, 0, 1));
  const peelProgress = Math.min(0.998, 0.03 * peelIntro + 0.968 * peelBuild);

  document.body.classList.toggle("is-hero-active", progress < 0.92);
  root.style.setProperty("--hero-progress", progress.toFixed(3));
  root.style.setProperty("--hero-lift-progress", liftProgress.toFixed(3));
  root.style.setProperty("--hero-detach-progress", travelProgress.toFixed(3));
  root.style.setProperty("--hero-lift-x", `${liftProgress * -18}px`);
  root.style.setProperty("--hero-lift-y", `${liftProgress * -26}px`);
  root.style.setProperty("--hero-lift-rotate", `${liftProgress * -4.2}deg`);
  root.style.setProperty("--hero-tilt-x", `${travelProgress * 8}deg`);
  root.style.setProperty("--hero-tilt-y", `${travelProgress * -18}deg`);
  root.style.setProperty("--hero-residue-opacity", `${Math.max(travelProgress * 0.78, liftProgress * 0.08)}`);
  root.style.setProperty("--hero-residue-size", `${28 + travelProgress * 168}px`);
  root.style.setProperty("--hero-shadow-opacity", `${0.42 + liftProgress * 0.18 + travelProgress * 0.11}`);
  root.style.setProperty("--hero-shift-x", `${travelProgress * window.innerWidth * -0.82}px`);
  root.style.setProperty("--hero-shift-y", `${travelProgress * window.innerHeight * -0.96}px`);
  root.style.setProperty("--hero-rotate", `${travelProgress * -20}deg`);
  root.style.setProperty("--hero-scale", `${1 + liftProgress * 0.012 - travelProgress * 0.098}`);

  if (heroPeel) {
    heroPeelTime = peelProgress;
    heroPeel.setTimeAlongPath(peelProgress);
  }
};

const updateNameProgress = () => {
  if (!nameSection || nameRows.length === 0) return;

  const rect = nameSection.getBoundingClientRect();
  const total = rect.height - window.innerHeight * 0.45;
  const progress = total > 0 ? clamp((window.innerHeight * 0.2 - rect.top) / total, 0, 1) : 0;

  nameRows.forEach((row, index) => {
    const start = index * 0.12;
    const end = start + 0.26;
    const rowProgress = clamp((progress - start) / (end - start), 0, 1);
    row.style.setProperty("--row-progress", rowProgress.toFixed(3));
  });
};

const updateProjectsProgress = () => {
  if (!projectsSection || !projectGrid || projectCards.length === 0) return;

  const sectionRect = projectsSection.getBoundingClientRect();
  const gridTop = sectionRect.top + projectGrid.offsetTop;
  const start = window.innerHeight * 0.92;
  const end = window.innerHeight * 0.24;
  const distance = start - end;
  const sectionProgress = distance > 0 ? clamp((start - gridTop) / distance, 0, 1) : 0;
  const cardFlow = clamp((sectionProgress - 0.05) / 0.82, 0, 1);
  const titleEnter = easeOutCubic(clamp((sectionProgress - 0.02) / 0.17, 0, 1));
  const titleHoldEnd = 0.82;
  const titleExitWindow = 0.1;
  const titleExit = easeOutCubic(clamp((sectionProgress - titleHoldEnd) / titleExitWindow, 0, 1));

  projectsSection.style.setProperty("--projects-progress", sectionProgress.toFixed(3));
  projectsSection.style.setProperty("--projects-title-enter", titleEnter.toFixed(3));
  projectsSection.style.setProperty("--projects-title-exit", titleExit.toFixed(3));

  projectCards.forEach((card, index) => {
    const cardStart = 0.14 + index * 0.06;
    const cardEnd = 0.62 + index * 0.075;
    const cardRaw = clamp((cardFlow - cardStart) / (cardEnd - cardStart), 0, 1);
    const cardProgress = easeInOutQuad(cardRaw);
    card.style.setProperty("--project-pop", cardProgress.toFixed(3));
  });
};

const updateIssueFiveSixTransition = () => {
  if (!projectsSection || !contactSection) return;

  const contactRect = contactSection.getBoundingClientRect();
  const start = window.innerHeight * 0.9;
  const end = window.innerHeight * 0.18;
  const distance = start - end;
  const progress = distance > 0 ? clamp((start - contactRect.top) / distance, 0, 1) : 0;

  root.style.setProperty("--issue-56-progress", progress.toFixed(3));
};

const updateSkillsTransition = () => {
  if (!skillsSection) return;

  const rect = skillsSection.getBoundingClientRect();
  const isPhoneViewport = window.innerWidth <= 560;
  const start = window.innerHeight * 0.99;
  const end = window.innerHeight * -0.12;
  const distance = start - end;
  const progress = distance > 0 ? clamp((start - rect.top) / distance, 0, 1) : 0;

  const titleRaw = clamp((progress - 0.14) / 0.22, 0, 1);
  const webRaw = clamp((progress - (isPhoneViewport ? 0.54 : 0.64)) / (isPhoneViewport ? 0.24 : 0.2), 0, 1);
  const webDensityRaw = clamp(
    (progress - (isPhoneViewport ? 0.62 : 0.74)) / (isPhoneViewport ? 0.18 : 0.14),
    0,
    1,
  );
  const iconsRaw = clamp((progress - (isPhoneViewport ? 0.7 : 0.9)) / (isPhoneViewport ? 0.22 : 0.16), 0, 1);
  const aboutExitRaw = clamp((progress - 0.28) / 0.46, 0, 1);

  const titleProgress = easeInOutQuad(titleRaw);
  const webProgress = easeInOutQuad(webRaw);
  const webDensityProgress = easeInOutQuad(webDensityRaw);
  const iconsProgress = easeInOutQuad(iconsRaw);
  const aboutExitProgress = easeInOutQuad(aboutExitRaw);

  skillsSection.style.setProperty("--skills-progress", progress.toFixed(3));
  skillsSection.style.setProperty("--skills-title-progress", titleProgress.toFixed(3));
  skillsSection.style.setProperty("--skills-web-progress", webProgress.toFixed(3));
  skillsSection.style.setProperty("--skills-web-density-progress", webDensityProgress.toFixed(3));
  skillsSection.style.setProperty("--skills-icons-progress", iconsProgress.toFixed(3));

  if (aboutSection) {
    aboutSection.style.setProperty("--about-exit-progress", aboutExitProgress.toFixed(3));
  }

  skillBadges.forEach((badge) => {
    const badgeNumber = getToolBadgeNumber(badge);
    const order = Number.parseFloat(badge.style.getPropertyValue("--badge-order")) || 0;
    const normalizedOrder = skillBadges.length > 1 ? order / (skillBadges.length - 1) : 0;
    const badgeSpread = isPhoneViewport ? 0.46 : 0.68;
    const badgeWindow = isPhoneViewport ? 0.42 : 0.32;
    const badgeLead = badgeNumber === 12 ? (isPhoneViewport ? 0.16 : 0.18) : 0;
    const badgeStart = Math.max(0, normalizedOrder * badgeSpread - badgeLead);
    const badgeEnd = Math.min(badgeStart + badgeWindow + (badgeNumber === 12 ? 0.08 : 0), 1);
    const badgeRaw = clamp((iconsProgress - badgeStart) / (badgeEnd - badgeStart), 0, 1);
    const badgePopBase = easeOutCubic(clamp((badgeRaw - 0.06) / 0.84, 0, 1));
    const badgePop = badgeNumber === 12 ? Math.max(badgePopBase, iconsProgress * 0.38) : badgePopBase;
    const badgeFloat = easeInOutQuad(clamp((badgeRaw - 0.82) / 0.18, 0, 1));
    const burstEnvelope = Math.sin(badgeRaw * Math.PI);
    const burstLift = burstEnvelope * (1 - badgeRaw * 0.22) * (isPhoneViewport ? 10 : 18);
    const burstScale = burstEnvelope * (isPhoneViewport ? 0.04 : 0.07);
    const burstRotate = burstEnvelope * (order % 2 === 0 ? -1 : 1) * 1.35;

    badge.style.setProperty("--badge-pop", badgePop.toFixed(3));
    badge.style.setProperty("--badge-float", badgeFloat.toFixed(3));
    badge.style.setProperty("--badge-burst-y", `${burstLift.toFixed(2)}px`);
    badge.style.setProperty("--badge-burst-scale", burstScale.toFixed(4));
    badge.style.setProperty("--badge-burst-rotate", `${burstRotate.toFixed(2)}deg`);
  });
};

const updateAboutEntryTransition = () => {
  if (!aboutSection || !aboutHeading || !aboutPanel) {
    root.style.setProperty("--about-enter-progress", "0");
    root.style.setProperty("--about-heading-enter", "0");
    root.style.setProperty("--about-panel-enter", "0");
    return;
  }

  const sectionRect = aboutSection.getBoundingClientRect();
  const headingRect = aboutHeading.getBoundingClientRect();
  const panelRect = aboutPanel.getBoundingClientRect();

  const sectionStart = window.innerHeight * 0.94;
  const sectionEnd = window.innerHeight * 0.44;
  const sectionDistance = sectionStart - sectionEnd;
  const progress =
    sectionDistance > 0 ? clamp((sectionStart - sectionRect.top) / sectionDistance, 0, 1) : 0;

  const headingStart = window.innerHeight * 0.64;
  const headingEnd = window.innerHeight * 0.26;
  const headingDistance = headingStart - headingEnd;
  const headingRaw =
    headingDistance > 0 ? clamp((headingStart - headingRect.top) / headingDistance, 0, 1) : 0;

  const panelStart = window.innerHeight * 0.82;
  const panelEnd = window.innerHeight * 0.34;
  const panelDistance = panelStart - panelEnd;
  const panelRaw =
    panelDistance > 0 ? clamp((panelStart - panelRect.top) / panelDistance, 0, 1) : 0;

  const headingEnter = easeOutCubic(headingRaw);
  const panelEnter = easeOutCubic(panelRaw);

  root.style.setProperty("--about-enter-progress", progress.toFixed(3));
  root.style.setProperty("--about-heading-enter", headingEnter.toFixed(3));
  root.style.setProperty("--about-panel-enter", panelEnter.toFixed(3));
};

const resetIssueProgress = () => {
  issueSections.forEach((section) => section.classList.remove("is-current"));
  document.body.classList.remove("is-skills-active");
  delete document.body.dataset.issue;
  root.style.setProperty("--bridge-progress", "0");
  root.style.setProperty("--accent-opacity", "0.16");
  root.style.setProperty("--thread-opacity", "0.24");
  root.style.setProperty("--section-dim", "0.16");
  root.style.setProperty("--issue-56-progress", "0");
  root.style.setProperty("--about-enter-progress", "0");
  root.style.setProperty("--about-heading-enter", "0");
  root.style.setProperty("--about-panel-enter", "0");
  aboutSection?.style.setProperty("--about-exit-progress", "0");
  skillsSection?.style.setProperty("--skills-progress", "0");
  skillsSection?.style.setProperty("--skills-title-progress", "0");
  skillsSection?.style.setProperty("--skills-web-progress", "0");
  skillsSection?.style.setProperty("--skills-web-density-progress", "0");
  skillsSection?.style.setProperty("--skills-icons-progress", "0");
  skillBadges.forEach((badge) => {
    badge.style.setProperty("--badge-pop", "0");
    badge.style.setProperty("--badge-float", "0");
    badge.style.setProperty("--badge-burst-y", "0px");
    badge.style.setProperty("--badge-burst-scale", "0");
    badge.style.setProperty("--badge-burst-rotate", "0deg");
  });
};

const getIssueFocus = (rect) => {
  const viewportAnchor = window.innerHeight * 0.48;
  const sectionCenter = rect.top + rect.height / 2;
  const distance = Math.abs(sectionCenter - viewportAnchor);
  const maxDistance = window.innerHeight * 0.72 + rect.height * 0.16;
  return clamp(1 - distance / maxDistance, 0, 1);
};

const getIssueProgress = (rect) => {
  const total = rect.height + window.innerHeight * 0.38;
  return total > 0 ? clamp((window.innerHeight * 0.22 - rect.top) / total, 0, 1) : 0;
};

const updateIssueProgress = () => {
  if (issueSections.length === 0) return;

  const candidates = issueSections
    .filter((section) => visibleIssueSections.has(section))
    .map((section) => {
      const rect = section.getBoundingClientRect();
      const focus = getIssueFocus(rect);
      const ratio = issueIntersectionRatios.get(section) ?? 0;
      return {
        section,
        rect,
        focus,
        score: focus * 0.72 + ratio * 0.28,
      };
    });

  if (candidates.length === 0) {
    resetIssueProgress();
    return;
  }

  const activeCandidate = candidates.reduce((best, candidate) =>
    candidate.score > best.score ? candidate : best,
  );

  const activeIssue = activeCandidate.section.dataset.issue ?? "";
  const progress = getIssueProgress(activeCandidate.rect);
  const stage = clamp((Number(activeIssue) - 3) / 3, 0, 1);
  const accentOpacity = clamp(0.24 - stage * 0.1 + Math.sin(progress * Math.PI) * 0.05, 0.08, 0.26);
  const threadOpacity = clamp(0.34 - stage * 0.1 + (1 - progress) * 0.08, 0.12, 0.4);
  const sectionDim = clamp(0.14 + stage * 0.14 + Math.abs(progress - 0.5) * 0.06, 0.14, 0.34);

  issueSections.forEach((section) => {
    section.classList.toggle("is-current", section === activeCandidate.section);
  });

  document.body.dataset.issue = activeIssue;
  document.body.classList.toggle("is-skills-active", activeIssue === "04");
  root.style.setProperty("--bridge-progress", progress.toFixed(3));
  root.style.setProperty("--accent-opacity", accentOpacity.toFixed(3));
  root.style.setProperty("--thread-opacity", threadOpacity.toFixed(3));
  root.style.setProperty("--section-dim", sectionDim.toFixed(3));
};

let ticking = false;

const updateScene = () => {
  ticking = false;
  updateHeroProgress();
  updateNameProgress();
  updateIssueProgress();
  updateAboutEntryTransition();
  updateSkillsTransition();
  updateProjectsProgress();
  updateIssueFiveSixTransition();
};

const requestSceneUpdate = () => {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(updateScene);
};

const issueObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      issueIntersectionRatios.set(entry.target, entry.intersectionRatio);

      if (entry.isIntersecting) {
        visibleIssueSections.add(entry.target);
        entry.target.classList.add("is-visible");
      } else {
        visibleIssueSections.delete(entry.target);
      }
    });

    requestSceneUpdate();
  },
  {
    threshold: [0, 0.16, 0.32, 0.48, 0.64, 0.8],
    rootMargin: "-16% 0px -16% 0px",
  },
);

currentLanguage = getStoredLanguage() ?? "zh";
document.body.classList.toggle("is-low-memory-device", lowMemoryDevice);
initializeSkillBadges();
issueSections.forEach((section) => issueObserver.observe(section));
setupHeroPeel();
applyLanguage(currentLanguage, { persist: false });
updateScene();
trimContactIconBackground();
initializeContactCopyButtons();
window.addEventListener("scroll", requestSceneUpdate, { passive: true });
window.addEventListener("resize", () => {
  setupHeroPeelPath();
  requestSceneUpdate();
});

languageToggle?.addEventListener("click", () => {
  applyLanguage(currentLanguage === "zh" ? "en" : "zh");
});

topbarToggle?.addEventListener("click", () => {
  setTopbarMenuState(!topbar?.classList.contains("is-open"));
});

topbarNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setTopbarMenuState(false);
  });
});

document.addEventListener("click", (event) => {
  if (!topbar?.classList.contains("is-open")) return;
  if (event.target instanceof Node && topbar.contains(event.target)) return;
  setTopbarMenuState(false);
});

/* ── Folder toggle & paper modal ── */
const folderScene = document.querySelector(".folder-scene");
const folderCover = document.querySelector(".folder-cover");
const folderInterior = document.querySelector(".folder-interior");
const folderCloseGuide = document.querySelector(".folder-close-guide");
const folderCards = document.querySelectorAll(".folder-card");
const paperModal = document.getElementById("paper-modal");
const paperModalContent = document.getElementById("paper-modal-content");

const PAPER_MODAL_CONTENT = {
  profile: {
    zh: {
      title: "个人档案",
      body: `<p><strong>KAI</strong>（姜益栋）</p><p>擅长并享受寻找解决问题的新方式。</p><p>通过知识建构、分析拆解与创新解决，把不确定的任务推进到完整交付。</p><p class="paper-modal__detail">创新 · 感受 · 结果导向</p>`,
    },
    en: {
      title: "Personal Profile",
      body: `<p><strong>KAI</strong> (Jiang Yidong)</p><p>Skilled at and enjoys finding new ways to solve problems.</p><p>Uses knowledge building, analysis, and innovation to move uncertain work through complete delivery.</p><p class="paper-modal__detail">Innovation · Sensitivity · Results</p>`,
    },
  },
  motto: {
    zh: {
      title: "座右铭",
      body: `<p style="font-family:'Satisfy',cursive;font-size:1.5rem;text-align:center;padding:20px 0;color:#4a3520;">创新 · 感受 · 结果导向</p><p style="text-align:right;font-family:'Satisfy',cursive;color:rgba(80,50,20,0.5);">— KAI / patience</p>`,
    },
    en: {
      title: "Motto",
      body: `<p style="font-family:'Satisfy',cursive;font-size:1.5rem;text-align:center;padding:20px 0;color:#4a3520;">Innovation · Sensitivity · Results</p><p style="text-align:right;font-family:'Satisfy',cursive;color:rgba(80,50,20,0.5);">— KAI / patience</p>`,
    },
  },
  skills: {
    zh: {
      title: "合作与能力",
      body: `<p><strong>项目方法</strong></p><div class="paper-modal__tags"><span class="paper-modal__tag">知识建构</span><span class="paper-modal__tag">分析拆解</span><span class="paper-modal__tag">创新解决</span></div><p><strong>执行方向</strong></p><div class="paper-modal__tags"><span class="paper-modal__tag">工作流优化</span><span class="paper-modal__tag">端到端交付</span><span class="paper-modal__tag">业务问题解决</span></div>`,
    },
    en: {
      title: "Collaboration & Skills",
      body: `<p><strong>Project Method</strong></p><div class="paper-modal__tags"><span class="paper-modal__tag">Knowledge</span><span class="paper-modal__tag">Analyze</span><span class="paper-modal__tag">Innovate</span></div><p><strong>Execution</strong></p><div class="paper-modal__tags"><span class="paper-modal__tag">Workflow Optimization</span><span class="paper-modal__tag">End-to-end Delivery</span><span class="paper-modal__tag">Business Problem Solving</span></div>`,
    },
  },
  education: {
    zh: {
      title: "个人目标",
      body: `<p><strong>想成为一个可以独当一面的人</strong></p><p>持续学习如何拆解问题、推进项目，并在复杂情况下把事情完整落地。</p>`,
    },
    en: {
      title: "Ambition",
      body: `<p><strong>Become someone who can take full ownership.</strong></p><p>Keep learning how to break problems down, move projects forward, and deliver under complex conditions.</p>`,
    },
  },
  experience: {
    zh: {
      title: "工作证明",
      body: `<ul><li><strong>Workflow optimization</strong>从问题与受众出发梳理流程。</li><li><strong>End-to-end project delivery</strong>持续推进协作并把项目完整收尾。</li></ul>`,
    },
    en: {
      title: "Proof",
      body: `<ul><li><strong>Workflow optimization</strong>Clarify the problem, audience, and operating process.</li><li><strong>End-to-end project delivery</strong>Coordinate execution and bring the work to completion.</li></ul>`,
    },
  },
  bio: {
    zh: {
      title: "个人简介",
      body: `<p style="font-family:'Caveat',cursive;font-size:1.15rem;line-height:1.8;">三个月里参与 25+ 个不同规模的项目，累计覆盖 200+ 人次。</p><p style="font-family:'Caveat',cursive;font-size:1.15rem;line-height:1.8;">从流程不清晰和推进受阻中持续调整，把不确定的事情真正做出来。</p><p style="font-family:'Caveat',cursive;font-size:1.15rem;line-height:1.8;">逐渐形成拆解问题、推进项目和在复杂情况下完成落地的方法。</p>`,
    },
    en: {
      title: "About Me",
      body: `<p style="font-family:'Caveat',cursive;font-size:1.15rem;line-height:1.8;">Over three months I participated in 25+ projects, reaching 200+ people in total.</p><p style="font-family:'Caveat',cursive;font-size:1.15rem;line-height:1.8;">I kept adjusting through unclear workflows and blocked progress to turn uncertainty into delivered work.</p><p style="font-family:'Caveat',cursive;font-size:1.15rem;line-height:1.8;">These experiences shaped how I break down problems, move projects forward, and deliver under complexity.</p>`,
    },
  },
  contact: {
    zh: {
      title: "联系方式",
      body: `<p><strong>Email</strong></p><p>2280207099@qq.com</p><p><strong>手机</strong></p><p>13576085887</p><p><strong>微信</strong></p><p>Aurorahv</p>`,
    },
    en: {
      title: "Contact",
      body: `<p><strong>Email</strong></p><p>2280207099@qq.com</p><p><strong>Phone</strong></p><p>13576085887</p><p><strong>WeChat</strong></p><p>Aurorahv</p>`,
    },
  },
  interests: {
    zh: {
      title: "兴趣标签",
      body: `<div class="paper-modal__tags" style="margin-top:8px;"><span class="paper-modal__tag">创新</span><span class="paper-modal__tag">感受</span><span class="paper-modal__tag">结果导向</span><span class="paper-modal__tag">patience</span></div>`,
    },
    en: {
      title: "Interests",
      body: `<div class="paper-modal__tags" style="margin-top:8px;"><span class="paper-modal__tag">Innovation</span><span class="paper-modal__tag">Sensitivity</span><span class="paper-modal__tag">Results</span><span class="paper-modal__tag">Patience</span></div>`,
    },
  },
  spider: {
    zh: {
      title: "出生档案",
      body: `<p><strong>born in 06/15/2004</strong></p>`,
    },
    en: {
      title: "Birth File",
      body: `<p><strong>born in 06/15/2004</strong></p>`,
    },
  },
  location: {
    zh: {
      title: "雪山目标",
      body: `<p><strong>25岁之前攀登一座雪山</strong></p><img class="resume-modal__image" src="/kai/mountain.png" alt="雪山目标" />`,
    },
    en: {
      title: "Mountain Goal",
      body: `<p><strong>Climb a snow mountain before 25.</strong></p><img class="resume-modal__image" src="/kai/mountain.png" alt="Mountain goal" />`,
    },
  },
  resume: {
    zh: {
      title: "简历档案",
      body: `<img class="resume-modal__image" src="${RESUME_URLS.previewZh}" alt="Kai 简历预览" /><p class="resume-modal__actions"><a href="${RESUME_URLS.zh}" target="_blank" rel="noreferrer">打开完整简历</a></p>`,
    },
    en: {
      title: "Resume File",
      body: `<img class="resume-modal__image" src="${RESUME_URLS.previewEn}" alt="Kai resume preview" /><p class="resume-modal__actions"><a href="${RESUME_URLS.en}" target="_blank" rel="noreferrer">Open full resume</a></p>`,
    },
  },
};

const openPaperModal = (cardType) => {
  if (!paperModal || !paperModalContent) return;
  const content = PAPER_MODAL_CONTENT[cardType]?.[currentLanguage];
  if (!content) return;

  paperModalContent.innerHTML = `<h3>${content.title}</h3>${content.body}`;
  paperModal.hidden = false;
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => {
    paperModal.classList.add("is-visible");
  });
};

const closePaperModal = () => {
  if (!paperModal) return;
  paperModal.classList.remove("is-visible");
  setTimeout(() => {
    paperModal.hidden = true;
    paperModalContent.innerHTML = "";
    document.body.style.overflow = "";
  }, 400);
};

const setFolderOpen = (isOpen) => {
  folderScene?.classList.toggle("is-open", isOpen);
  folderCover?.setAttribute("aria-expanded", String(isOpen));
  folderInterior?.setAttribute("aria-hidden", String(!isOpen));
};

function closeAboutDossierOverlays() {
  if (folderScene?.classList.contains("is-open")) {
    setFolderOpen(false);
  }

  if (paperModal && !paperModal.hidden) {
    closePaperModal();
  }
}

let lastAutoCloseScrollY = window.scrollY;
let autoCloseTouchStartY = null;

function shouldAutoCloseAboutDossier() {
  if (!folderScene) return false;
  if (!folderScene.classList.contains("is-open") && (paperModal?.hidden ?? true)) return false;
  const rect = folderScene.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  if (rect.height <= 0 || viewportHeight <= 0) return false;
  const visibleTop = clamp(rect.top, 0, viewportHeight);
  const visibleBottom = clamp(rect.bottom, 0, viewportHeight);
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);
  const thresholdBase = Math.min(rect.height, viewportHeight);
  return visibleHeight <= thresholdBase * 0.5;
}

function closeAboutDossierOverlaysIfPastThreshold() {
  if (shouldAutoCloseAboutDossier()) {
    closeAboutDossierOverlays();
  }
}

function handleAboutAutoCloseScroll() {
  const nextScrollY = window.scrollY;
  if (nextScrollY > lastAutoCloseScrollY + 8) {
    closeAboutDossierOverlaysIfPastThreshold();
  }
  lastAutoCloseScrollY = nextScrollY;
}

function handleAboutAutoCloseWheel(event) {
  if (event.deltaY > 8) {
    requestAnimationFrame(closeAboutDossierOverlaysIfPastThreshold);
  }
}

function handleAboutAutoCloseTouchStart(event) {
  autoCloseTouchStartY = event.touches?.[0]?.clientY ?? null;
}

function handleAboutAutoCloseTouchMove(event) {
  if (autoCloseTouchStartY === null) return;
  const currentY = event.touches?.[0]?.clientY;
  if (typeof currentY === "number" && autoCloseTouchStartY - currentY > 10) {
    requestAnimationFrame(closeAboutDossierOverlaysIfPastThreshold);
    autoCloseTouchStartY = currentY;
  }
}

folderCover?.addEventListener("click", (e) => {
  const isOpen = folderScene?.classList.contains("is-open");
  if (isOpen) {
    if (e.target.closest(".folder-card")) return;
    setFolderOpen(false);
    return;
  }
  setFolderOpen(true);
});

folderCover?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    setFolderOpen(!folderScene?.classList.contains("is-open"));
  }
});

folderCards.forEach((card) => {
  card.addEventListener("click", (e) => {
    e.stopPropagation();
    openPaperModal(card.dataset.card);
  });
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      openPaperModal(card.dataset.card);
    }
  });
});

folderCloseGuide?.addEventListener("click", (e) => {
  e.stopPropagation();
  setFolderOpen(false);
});

folderCloseGuide?.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    e.stopPropagation();
    setFolderOpen(false);
  }
});

paperModal?.querySelectorAll("[data-paper-close]").forEach((el) => {
  el.addEventListener("click", closePaperModal);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && paperModal && !paperModal.hidden) {
    closePaperModal();
  }
});

window.addEventListener("scroll", handleAboutAutoCloseScroll, { passive: true });
window.addEventListener("wheel", handleAboutAutoCloseWheel, { passive: true });
window.addEventListener("touchstart", handleAboutAutoCloseTouchStart, { passive: true });
window.addEventListener("touchmove", handleAboutAutoCloseTouchMove, { passive: true });

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -10% 0px",
  },
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 70, 210)}ms`;
  revealObserver.observe(item);
});

const getCenteredRect = () => {
  const maxWidth = Math.min(window.innerWidth - 32, 560);
  const maxHeight = Math.min(window.innerHeight - 24, 820);
  const width = Math.min(maxWidth, maxHeight * 0.68);
  const height = Math.min(maxHeight, width / 0.68);

  return {
    top: (window.innerHeight - height) / 2,
    left: (window.innerWidth - width) / 2,
    width,
    height,
  };
};

const applyPanelRect = (rect) => {
  if (!modalPanel) return;
  modalPanel.style.top = `${rect.top}px`;
  modalPanel.style.left = `${rect.left}px`;
  modalPanel.style.width = `${rect.width}px`;
  modalPanel.style.height = `${rect.height}px`;
};

const applyPanelTransform = ({ x = 0, y = 0, scaleX = 1, scaleY = 1 }) => {
  if (!modalPanel) return;
  modalPanel.style.setProperty("--panel-x", `${x}px`);
  modalPanel.style.setProperty("--panel-y", `${y}px`);
  modalPanel.style.setProperty("--panel-scale-x", `${scaleX}`);
  modalPanel.style.setProperty("--panel-scale-y", `${scaleY}`);
};

const getTransformFromRect = (fromRect, toRect) => {
  const fromCenterX = fromRect.left + fromRect.width / 2;
  const fromCenterY = fromRect.top + fromRect.height / 2;
  const toCenterX = toRect.left + toRect.width / 2;
  const toCenterY = toRect.top + toRect.height / 2;

  return {
    x: fromCenterX - toCenterX,
    y: fromCenterY - toCenterY,
    scaleX: fromRect.width / toRect.width,
    scaleY: fromRect.height / toRect.height,
  };
};

const getTransformString = ({ x = 0, y = 0, scaleX = 1, scaleY = 1 }) =>
  `translate3d(${x}px, ${y}px, 0) scale(${scaleX}, ${scaleY})`;

const cancelCollapseAnimation = () => {
  if (!collapseAnimation) return;
  collapseAnimation.cancel();
  collapseAnimation = null;
};

const clearModalTimers = () => {
  clearTimeout(closeTimer);
  clearTimeout(closeStageTimer);
  clearTimeout(flipTimer);
  cancelCollapseAnimation();
};

const setProjectCardScene = (element, scene = "idle") => {
  if (!(element instanceof HTMLElement)) return;

  element.classList.remove("is-hovered", "is-active-scene", "is-returning");

  if (scene === "hovered") {
    element.classList.add("is-hovered");
  }

  if (scene === "active") {
    element.classList.add("is-active-scene");
  }
};

const setModalCardScene = (scene = "idle") => {
  const modalCards = [
    modalFront?.querySelector(".project-card__button"),
    modalMirror?.querySelector(".project-card__button"),
  ];

  modalCards.forEach((card) => setProjectCardScene(card, scene));
};

const syncHoveredProjectCard = () => {
  if (!lastPointerPosition) return;

  if (projectModal && !projectModal.hidden && projectModal.classList.contains("is-visible")) {
    projectButtons.forEach((button) => {
      if (!button.classList.contains("is-source-hidden")) {
        setProjectCardScene(button, "idle");
      }
    });
    return;
  }

  const hoveredElement = document.elementFromPoint(
    lastPointerPosition.clientX,
    lastPointerPosition.clientY,
  );
  const hoveredButton = hoveredElement?.closest?.(".project-card__button");

  projectButtons.forEach((button) => {
    const isInteractive =
      !button.classList.contains("is-hover-suppressed") &&
      !button.classList.contains("is-source-hidden");

    if (isInteractive && button === hoveredButton) {
      setProjectCardScene(button, "hovered");
      return;
    }

    setProjectCardScene(button, "idle");
  });
};

const updatePointerPosition = (event) => {
  lastPointerPosition = { clientX: event.clientX, clientY: event.clientY };
};

const releaseSuppressedProjectHover = () => {
  suppressedHoverButton?.classList.remove("is-hover-suppressed");
  suppressedHoverButton = null;
};

const isPointerOutsideElement = (element) => {
  if (!(element instanceof HTMLElement) || !lastPointerPosition) return true;

  const { clientX, clientY } = lastPointerPosition;
  const rect = element.getBoundingClientRect();
  return (
    clientX < rect.left ||
    clientX > rect.right ||
    clientY < rect.top ||
    clientY > rect.bottom
  );
};

const queueSuppressedProjectHoverRelease = () => {
  requestAnimationFrame(() => {
    if (!suppressedHoverButton || isPointerOutsideElement(suppressedHoverButton)) {
      releaseSuppressedProjectHover();
    }
  });
};

const suppressProjectHover = (button) => {
  releaseSuppressedProjectHover();
  if (!(button instanceof HTMLElement)) return;

  suppressedHoverButton = button;
  suppressedHoverButton.classList.add("is-hover-suppressed");
};

const getProjectCardCloneMarkup = (button, { extraClasses = "", stripped = false, scene = "active" } = {}) => {
  const variantClasses = [...button.classList].filter((className) =>
    className.startsWith("project-card__button--"),
  );
  const cloneClasses = [
    "project-card__button",
    ...variantClasses,
    "project-card__button--modal",
    scene === "hovered" ? "is-hovered" : "",
    scene === "active" ? "is-active-scene" : "",
    extraClasses,
  ]
    .filter(Boolean)
    .join(" ");

  const clone = document.createElement("div");
  clone.className = cloneClasses;
  clone.setAttribute("aria-hidden", "true");
  if (button.dataset.projectId) clone.dataset.projectId = button.dataset.projectId;
  if (button.dataset.coverProfile) clone.dataset.coverProfile = button.dataset.coverProfile;
  if (button.getAttribute("style")) clone.setAttribute("style", button.getAttribute("style"));
  clone.innerHTML = button.innerHTML;

  if (stripped) {
    clone
      .querySelectorAll(
        ".project-card__copy, .project-card__impact, .project-card__logo, .project-card__index, strong, .project-card__type, p",
      )
      .forEach((element) => element.remove());

    const echoPanel = document.createElement("span");
    echoPanel.className = "project-modal__echo-panel";
    const echoLines = document.createElement("span");
    echoLines.className = "project-modal__echo-lines";
    clone.append(echoPanel, echoLines);
  }

  return clone.outerHTML;
};

const syncModalCardScene = (button, { scene = "active" } = {}) => {
  if (!modalFront || !modalMirror) return;

  modalFront.innerHTML = getProjectCardCloneMarkup(button, {
    extraClasses: "project-modal__card",
    scene,
  });
  modalMirror.innerHTML = getProjectCardCloneMarkup(button, {
    extraClasses: "project-modal__card project-modal__card--echo",
    stripped: true,
    scene,
  });
};

const clearModalCardScene = () => {
  if (modalFront) modalFront.innerHTML = "";
  if (modalMirror) modalMirror.innerHTML = "";
};

const clearModalProjectContent = () => {
  const previewVideo = modalPreview?.querySelector("video");
  if (previewVideo instanceof HTMLVideoElement) {
    previewVideo.pause();
    previewVideo.removeAttribute("src");
    previewVideo.querySelectorAll("source").forEach((source) => source.remove());
    previewVideo.load();
  }

  if (modalSignals) modalSignals.replaceChildren();
  if (modalPreview) modalPreview.replaceChildren();
  if (modalProofs) modalProofs.replaceChildren();
  if (modalProofTrigger) {
    modalProofTrigger.hidden = true;
    modalProofTrigger.textContent = getModalCopy().proofTrigger;
  }
  closeProofSheet();
};

const renderProjectSignals = (signals = []) => {
  if (!modalSignals) return;

  modalSignals.replaceChildren();
  modalSignals.hidden = signals.length === 0;

  signals.forEach((signal) => {
    const chip = document.createElement("span");
    chip.className = "project-modal__signal";
    chip.textContent = signal;
    modalSignals.append(chip);
  });
};

const createPreviewMedia = (preview) => {
  const hasVideo = Boolean(preview?.videoSrc);
  const mediaWrapper = hasVideo ? document.createElement("button") : document.createElement("div");
  mediaWrapper.className = "project-modal__preview-frame";

  if (hasVideo) {
    mediaWrapper.type = "button";
    mediaWrapper.classList.add("project-modal__preview-frame--interactive");
    mediaWrapper.dataset.previewPlay = "true";
    mediaWrapper.dataset.videoSrc = preview.videoSrc ?? "";
    mediaWrapper.dataset.videoType = preview.videoType ?? "video/mp4";
    mediaWrapper.setAttribute(
      "aria-label",
      getModalCopy().previewAria(preview.title ?? getModalCopy().previewVideoTitle),
    );
  } else {
    mediaWrapper.classList.add("project-modal__preview-frame--pending");
  }

  if (preview?.poster) {
    const poster = document.createElement("img");
    poster.className = "project-modal__preview-poster";
    poster.src = preview.poster;
    poster.alt = preview.label ?? "";
    poster.loading = "lazy";
    mediaWrapper.append(poster);
  }

  const overlay = document.createElement("div");
  overlay.className = "project-modal__preview-overlay";

  const badge = document.createElement("span");
  badge.className = "project-modal__preview-badge";
  badge.textContent = hasVideo ? getModalCopy().previewPlay : getModalCopy().previewPending;

  const play = document.createElement("span");
  play.className = "project-modal__preview-play";
  play.setAttribute("aria-hidden", "true");
  play.textContent = hasVideo ? "▶" : "•";

  const copy = document.createElement("div");
  copy.className = "project-modal__preview-copy";

  const title = document.createElement("strong");
  title.className = "project-modal__preview-title";
  title.textContent = preview?.title ?? getModalCopy().previewTitle;

  const note = document.createElement("p");
  note.className = "project-modal__preview-note";
  note.textContent = preview?.note ?? getModalCopy().previewNote;

  copy.append(title, note);
  overlay.append(badge, play, copy);
  mediaWrapper.append(overlay);

  return mediaWrapper;
};

const renderProjectPreview = (projectDetail) => {
  if (!modalPreview) return;

  modalPreview.replaceChildren();
  const preview = projectDetail.preview ?? {};
  const card = document.createElement("section");
  card.className = "project-modal__preview-card";

  if (!preview.videoSrc) {
    card.classList.add("project-modal__preview-card--pending");
  }

  card.append(createPreviewMedia(preview));

  if (Array.isArray(preview.stats) && preview.stats.length > 0) {
    const stats = document.createElement("div");
    stats.className = "project-modal__preview-stats";

    preview.stats.forEach((item) => {
      const stat = document.createElement("div");
      stat.className = "project-modal__preview-stat";

      const label = document.createElement("span");
      label.textContent = item.label;
      const value = document.createElement("strong");
      value.textContent = item.value;

      stat.append(label, value);
      stats.append(stat);
    });

    card.append(stats);
  }

  modalPreview.append(card);
};

const renderProjectProofs = (proofs = []) => {
  if (!modalProofs) return;

  modalProofs.replaceChildren();

  proofs.forEach((proof) => {
    const figure = document.createElement("figure");
    figure.className = "project-modal__proof";

    const image = document.createElement("img");
    image.className = "project-modal__proof-image";
    image.src = proof.src;
    image.alt = proof.alt ?? proof.title;
    image.loading = "lazy";

    const caption = document.createElement("figcaption");
    caption.className = "project-modal__proof-copy";

    const kicker = document.createElement("span");
    kicker.className = "project-modal__proof-kicker";
    kicker.textContent = "Real Signal";

    const title = document.createElement("strong");
    title.className = "project-modal__proof-title";
    title.textContent = proof.title;

    const description = document.createElement("p");
    description.className = "project-modal__proof-description";
    description.textContent = proof.description;

    caption.append(kicker, title, description);
    figure.append(image, caption);
    modalProofs.append(figure);
  });
};

const openProofSheet = () => {
  if (!modalProofSheet) return;
  modalProofSheet.hidden = false;
  projectModal?.classList.add("is-proof-open");
};

const closeProofSheet = () => {
  projectModal?.classList.remove("is-proof-open");
  if (modalProofSheet) modalProofSheet.hidden = true;
};

const renderProjectProofTrigger = (proofs = []) => {
  if (!modalProofTrigger) return;

  const hasProofs = proofs.length > 0;
  modalProofTrigger.hidden = !hasProofs;
  modalProofTrigger.textContent = hasProofs
    ? getModalCopy().proofTriggerWithCount(proofs.length)
    : getModalCopy().proofTrigger;
};

const populateModalContent = (projectDetail) => {
  if (modalTitle) modalTitle.textContent = projectDetail.title ?? "Project";
  if (modalType) modalType.textContent = projectDetail.type ?? "Project Type";
  if (modalDescription) {
    modalDescription.textContent = projectDetail.description ?? projectDetail.frontIntro ?? "";
  }

  renderProjectSignals(projectDetail.signals ?? []);
  renderProjectPreview(projectDetail);
  renderProjectProofs(projectDetail.proofs ?? []);
  renderProjectProofTrigger(projectDetail.proofs ?? []);

  if (modalDomain) {
    const href = projectDetail.link ?? "";
    modalDomain.textContent = projectDetail.linkLabel ?? href;
    modalDomain.href = href || "#";
    modalDomain.hidden = !href;
  }

  if (modalGithub) {
    const href = projectDetail.githubLink ?? "";
    modalGithub.textContent = projectDetail.githubLabel ?? "GitHub";
    modalGithub.href = href || "#";
    modalGithub.hidden = !href;
  }

  if (modalGithubNote) {
    const note = projectDetail.githubNote ?? "";
    modalGithubNote.textContent = note;
    modalGithubNote.hidden = !note.trim();
  }

  if (modalMeta) {
    modalMeta.textContent = projectDetail.meta ?? "";
    modalMeta.hidden = !(projectDetail.meta ?? "").trim();
  }
};

const lockBodyScroll = () => {
  const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = "hidden";
  document.body.style.paddingRight = scrollbarGap > 0 ? `${scrollbarGap}px` : "";
};

const unlockBodyScroll = () => {
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
};

const openModal = (button) => {
  if (!projectModal || !modalPanel || !modalFront) return;

  releaseSuppressedProjectHover();

  const projectDetail = getProjectDetail(button);
  const startRect = button.getBoundingClientRect();
  const centeredRect = getCenteredRect();

  activeProjectData = projectDetail;
  populateModalContent(projectDetail);
  syncModalCardScene(button, { scene: "active" });
  projectButtons.forEach((item) => {
    setProjectCardScene(item, "idle");
    item.classList.remove("is-source-hidden");
  });

  activeProjectButton = button;
  clearModalTimers();
  setProjectCardScene(button, "idle");
  button.classList.add("is-source-hidden");

  projectModal.hidden = false;
  projectModal.classList.remove("is-closing");
  projectModal.classList.remove("is-collapsing");
  projectModal.classList.remove("is-open");
  applyPanelRect(centeredRect);
  applyPanelTransform({});
  projectModal.classList.add("is-visible");
  lockBodyScroll();
  cancelCollapseAnimation();
  const isPhoneViewport = window.innerWidth <= 560;
  const mobileOpenDelay = isPhoneViewport ? 520 : FLIP_DELAY_MS;
  collapseAnimation = modalPanel.animate(
    [
      {
        transform: getTransformString(getTransformFromRect(startRect, centeredRect)),
        opacity: 1,
      },
      {
        transform: getTransformString({}),
        opacity: 1,
      },
    ],
    {
      duration: PANEL_TRANSITION_MS,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "both",
    },
  );
  collapseAnimation.onfinish = () => {
    collapseAnimation = null;
  };
  collapseAnimation.oncancel = () => {
    collapseAnimation = null;
  };
  flipTimer = window.setTimeout(() => {
    projectModal.classList.add("is-open");
  }, mobileOpenDelay);
};

const closeModal = () => {
  if (!projectModal || !modalPanel) return;

  clearModalTimers();
  closeProofSheet();
  if (activeProjectButton) {
    suppressProjectHover(activeProjectButton);
    activeProjectButton.blur();
    setProjectCardScene(activeProjectButton, "idle");
    activeProjectButton.classList.add("is-source-hidden");
  }
  projectModal.classList.add("is-closing");
  projectModal.classList.remove("is-collapsing");
  projectModal.classList.remove("is-open");
  const centeredRect = getCenteredRect();
  applyPanelRect(centeredRect);
  applyPanelTransform({});

  closeStageTimer = window.setTimeout(() => {
    const targetRect = activeProjectButton?.getBoundingClientRect();
    if (!targetRect || !projectModal?.classList.contains("is-visible")) return;
    const currentRect = modalPanel.getBoundingClientRect();
    const fromTransform = getTransformFromRect(currentRect, targetRect);

    projectModal.classList.add("is-collapsing");
    setModalCardScene("idle");
    cancelCollapseAnimation();
    applyPanelRect(targetRect);
    applyPanelTransform({});
    collapseAnimation = modalPanel.animate(
      [
        {
          transform: getTransformString(fromTransform),
          opacity: 1,
        },
        {
          transform: getTransformString({}),
          opacity: 1,
        },
      ],
      {
        duration: CLOSE_COLLAPSE_MS,
        easing: "cubic-bezier(0.28, 0.2, 0.18, 1)",
        fill: "both",
      },
    );
    collapseAnimation.onfinish = () => {
      collapseAnimation = null;
    };
    collapseAnimation.oncancel = () => {
      collapseAnimation = null;
    };
  }, CLOSE_RETURN_DELAY_MS);

  closeTimer = window.setTimeout(() => {
    const returningButton = activeProjectButton;
    projectModal.classList.remove("is-closing");
    projectModal.classList.remove("is-collapsing");
    projectModal.classList.remove("is-visible");
    projectModal.hidden = true;
    cancelCollapseAnimation();
    applyPanelTransform({});
    clearModalCardScene();
    clearModalProjectContent();
    unlockBodyScroll();
    activeProjectButton = null;
    activeProjectData = null;

    if (returningButton) {
      setProjectCardScene(returningButton, "idle");
      returningButton.classList.remove("is-source-hidden");
      queueSuppressedProjectHoverRelease();
    }
  }, CLOSE_RETURN_DELAY_MS + CLOSE_COLLAPSE_MS + MODAL_EXIT_BUFFER_MS);
};

aboutSpiderScene?.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  if (event.target.closest(".about-chat-paper")) {
    event.stopPropagation();
    return;
  }
  if (event.target.closest(".about-spider")) {
    event.stopPropagation();
    openAboutChat();
  }
});

aboutSpiderScene?.addEventListener("keydown", (event) => {
  if (
    (event.key === "Enter" || event.key === " ") &&
    event.target instanceof Element &&
    event.target.closest(".about-spider")
  ) {
    event.preventDefault();
    openAboutChat();
  }
});

aboutChatPaper?.addEventListener("click", (event) => {
  event.stopPropagation();
});

document.addEventListener("click", (event) => {
  if (!(aboutChatPaper instanceof HTMLElement) || aboutChatPaper.hidden) return;
  if (event.target instanceof Element && event.target.closest(".about-chat-paper")) return;
  closeAboutChat();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeAboutChat();
});

aboutChatForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!(aboutChatInput instanceof HTMLInputElement)) return;
  askAboutSpider(aboutChatInput.value);
});

modalPreview?.addEventListener("click", async (event) => {
  const trigger = event.target instanceof Element ? event.target.closest("[data-preview-play='true']") : null;
  if (!(trigger instanceof HTMLButtonElement) || !activeProjectData?.preview?.videoSrc) return;

  const frame = document.createElement("div");
  frame.className = "project-modal__preview-frame";
  const video = document.createElement("video");
  video.className = "project-modal__preview-video";
  video.controls = true;
  video.playsInline = true;
  video.preload = "none";
  video.poster = activeProjectData.preview.poster ?? "";

  const source = document.createElement("source");
  source.src = activeProjectData.preview.videoSrc;
  source.type = activeProjectData.preview.videoType ?? "video/mp4";
  video.append(source);

  frame.append(video);
  trigger.replaceWith(frame);

  try {
    await video.play();
  } catch (_error) {
    video.controls = true;
  }
});

modalProofTrigger?.addEventListener("click", () => {
  if (!activeProjectData?.proofs?.length) return;
  openProofSheet();
});

projectModal?.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.dataset.close === "true") {
    closeModal();
    return;
  }
  if (target.dataset.proofClose === "true") {
    closeProofSheet();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setTopbarMenuState(false);
    if (projectModal?.classList.contains("is-proof-open")) {
      closeProofSheet();
      return;
    }
    closeModal();
  }
});

window.addEventListener(
  "pointermove",
  (event) => {
    updatePointerPosition(event);

    if (suppressedHoverButton && isPointerOutsideElement(suppressedHoverButton)) {
      releaseSuppressedProjectHover();
      return;
    }

    syncHoveredProjectCard();
  },
  { passive: true },
);

window.addEventListener(
  "pointerdown",
  (event) => {
    updatePointerPosition(event);
  },
  { passive: true },
);

window.addEventListener("resize", () => {
  setTopbarMenuState(false);

  if (!projectModal || projectModal.hidden || !projectModal.classList.contains("is-visible")) return;
  const centeredRect = getCenteredRect();

  if (projectModal.classList.contains("is-closing") && activeProjectButton) {
    if (projectModal.classList.contains("is-collapsing")) {
      const targetRect = activeProjectButton.getBoundingClientRect();
      applyPanelRect(targetRect);
      applyPanelTransform({});
      return;
    }

    applyPanelRect(centeredRect);
    applyPanelTransform({});
    return;
  }

  applyPanelRect(centeredRect);

  if (!projectModal.classList.contains("is-open") && activeProjectButton) {
    applyPanelTransform(getTransformFromRect(activeProjectButton.getBoundingClientRect(), centeredRect));
    return;
  }

  applyPanelTransform({});
});

const loaderStartTime = performance.now();
const updateSiteLoaderProgress = () => {
  if (!(siteLoader instanceof HTMLElement) || siteLoader.dataset.dismissed === "true") return;
  const elapsed = performance.now() - loaderStartTime;
  const progress = Math.min(92, 12 + (elapsed / LOADER_MIN_VISIBLE_MS) * 72);
  setSiteLoaderProgress(progress);
  window.requestAnimationFrame(updateSiteLoaderProgress);
};

promoteInitialMediaLoading();
window.requestAnimationFrame(updateSiteLoaderProgress);

let initialLoadCompletionStarted = false;
const waitForWindowLoad = () =>
  document.readyState === "complete"
    ? Promise.resolve()
    : new Promise((resolve) => window.addEventListener("load", resolve, { once: true }));

const completeInitialLoad = async () => {
  if (initialLoadCompletionStarted) return;
  initialLoadCompletionStarted = true;

  await Promise.race([
    Promise.all([waitForLoaderVideoPlayback(), waitForWindowLoad().then(waitForDeclaredAssets)]),
    new Promise((resolve) => window.setTimeout(resolve, LOADER_MAX_WAIT_MS)),
  ]);

  const elapsed = performance.now() - loaderStartTime;
  const remaining = Math.max(0, LOADER_MIN_VISIBLE_MS - elapsed);
  window.setTimeout(() => {
    setSiteLoaderProgress(100);
    window.setTimeout(dismissSiteLoader, 180);
  }, remaining);
};

completeInitialLoad();
