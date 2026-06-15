export const KAI_PROFILE_BLOCKS = [
  {
    id: "kai-profile",
    type: "profile",
    title: "Kai / 姜益栋",
    aliases: ["Kai", "KAI", "姜益栋", "Jiang Yidong"],
    keywords: ["Knowledge", "Analyze", "Innovate", "知识建构", "分析拆解", "创新解决"],
    priority: 120,
    content: {
      zh: "我是 Kai，中文名姜益栋，出生于 2004 年 6 月 15 日。我的关键词是 Knowledge 知识建构、Analyze 分析拆解、Innovate 创新解决。擅长并享受寻找解决问题的新方式，重视创新、感受与结果导向，也希望成为一个可以独当一面的人。",
      en: "I am Kai, Chinese name Jiang Yidong, born on June 15, 2004. My working principles are Knowledge, Analyze, and Innovate: building knowledge, breaking problems down, and creating solutions. I am skilled at and enjoy finding new ways to solve problems, with an emphasis on innovation, sensitivity, patience, and results. I want to become someone who can take full ownership.",
    },
    hardFacts: {
      zh: {
        姓名: "姜益栋",
        生日: "2004-06-15",
        工作方式: ["知识建构", "分析拆解", "创新解决"],
        价值取向: ["创新", "感受", "结果导向"],
      },
      en: {
        name: "Jiang Yidong",
        birthday: "2004-06-15",
        approach: ["Knowledge", "Analyze", "Innovate"],
        values: ["innovation", "sensitivity", "patience", "results"],
      },
    },
    links: [],
    source: "website",
  },
  {
    id: "kai-reflection",
    type: "bio",
    title: "Project Reflection",
    aliases: ["项目感想", "项目经历", "成长", "Project Reflection"],
    keywords: ["25+", "200+", "项目推进", "问题拆解", "复杂情况", "落地"],
    priority: 92,
    content: {
      zh: "这三个月里，我参与了 25+ 个不同规模的项目，累计覆盖 200+ 人次。这些项目从早期探索尝试，到后期可以独立推动完整落地，类型和成熟度差异很大。一开始经常遇到流程不清晰、推进受阻等问题，但基本都能通过持续调整和解决问题把项目完整收尾。也有一些完成度较高、反馈较强的项目，让我清晰感受到把不确定的事情真正做出来本身就很有价值。这些经历让我逐渐形成自己的思考和解决问题方式：拆解问题、推进项目，并在复杂情况下把事情落地。期待以后继续学习更多。",
      en: "Over the past three months, I have participated in more than 25 projects of different sizes, reaching over 200 participants in total. They ranged from early explorations to projects I could independently drive through full delivery. The process was not always smooth: unclear workflows and blocked progress were common at first, but I generally brought projects to completion by continuously adjusting and solving problems. Several well-finished projects also received strong feedback and showed me the value of turning uncertainty into something real. These experiences shaped how I break problems down, move projects forward, and deliver under complex conditions. I look forward to learning more.",
    },
    links: [],
    source: "website",
  },
  {
    id: "kai-resume-experience",
    type: "resume",
    title: "Resume Experience",
    aliases: ["简历", "实习经历", "小红书运营", "Resume"],
    keywords: ["符李", "增长业务部", "线上零售", "小红书", "内容运营", "A/B 测试"],
    priority: 78,
    content: {
      zh: "公开简历图片显示，Kai 曾在符李增长业务部线上零售方向实习，时间标注为 2025.9-2026.1。工作包括抖音与小红书平台品牌线上营销、产品手卡与卖点合集、基于人群需求和产品优势撰写图文与口播文案、品牌合作与达人沟通、平台店铺运营、营销活动策划，以及电商人群策略 A/B 测试。简历还记录了自 2023.4 至今运营个人小红书账号的实践，包括流量规律分析、发布时间与目标受众定位、拍摄与广告内容制作、内容优化、互动提升和运营复盘。简历列出的技能包括英语六级、Excel 熟练使用、PPT 制作和 C2 驾照。",
      en: "Kai's public resume image records an internship in online retail within Fu Li's growth business department from September 2025 to January 2026. Responsibilities included Douyin and Xiaohongshu brand marketing, product selling-point materials, audience-informed image and spoken copy, brand and creator collaboration, storefront operations, campaign planning, and e-commerce audience A/B testing. It also records an independently operated Xiaohongshu account since April 2023, covering traffic pattern analysis, publishing timing and audience positioning, photography and advertising content production, content optimization, engagement improvement, and performance review. Listed skills include CET-6 English, strong Excel use, polished presentation production, and a C2 driving license.",
    },
    links: ["/kai/resume.png"],
    source: "resume",
  },
  {
    id: "kai-workflow",
    type: "skills",
    title: "Workflow & Delivery",
    aliases: ["工作流优化", "端到端交付", "Workflow optimization", "End-to-end project delivery"],
    keywords: ["Workflow optimization", "End-to-end project delivery", "Business problem solving"],
    priority: 88,
    content: {
      zh: "Kai 的合作方向包括工作流优化、端到端项目执行与交付，以及业务问题解决。他重视先理解问题和受众，再拆解流程、推动协作并以结果验证方案。",
      en: "Kai focuses on workflow optimization, end-to-end project execution and delivery, and business problem solving. He starts by understanding the problem and audience, then breaks down the workflow, coordinates execution, and validates the solution through outcomes.",
    },
    links: [],
    source: "website",
  },
];

export const KAI_PROJECTS = {
  "snapdragon-vivo": {
    title: "骁龙 vivo",
    type: { zh: "品牌合作 / 项目执行", en: "Brand Collaboration / Project Execution" },
    frontIntro: {
      zh: "围绕骁龙与 vivo 的合作项目，承担项目推进与交付工作。",
      en: "A Snapdragon and vivo collaboration supported through project execution and delivery.",
    },
    description: {
      zh: "公开作品页以合作视觉为主要展示。Kai 负责把需求拆解、协作推进与交付结果串联起来。",
      en: "The public portfolio presents the collaboration through its campaign visual. Kai connected requirement breakdown, coordination, and delivery outcomes.",
    },
    meta: { zh: "项目推进 / 工作流优化 / 交付", en: "Execution / Workflow / Delivery" },
    signals: { zh: ["品牌合作", "端到端交付"], en: ["Brand collaboration", "End-to-end delivery"] },
  },
  "snapdragon-oppo": {
    title: "骁龙 OPPO",
    type: { zh: "品牌合作 / 项目执行", en: "Brand Collaboration / Project Execution" },
    frontIntro: {
      zh: "围绕骁龙与 OPPO 的合作项目，承担项目推进与交付工作。",
      en: "A Snapdragon and OPPO collaboration supported through project execution and delivery.",
    },
    description: {
      zh: "公开作品页以合作视觉为主要展示，强调从问题拆解到最终落地的完整推进。",
      en: "The public portfolio presents the collaboration through its campaign visual, emphasizing the full path from problem breakdown to delivery.",
    },
    meta: { zh: "项目推进 / 工作流优化 / 交付", en: "Execution / Workflow / Delivery" },
    signals: { zh: ["品牌合作", "问题拆解"], en: ["Brand collaboration", "Problem breakdown"] },
  },
  "snapdragon-xiaomi": {
    title: "骁龙小米",
    type: { zh: "品牌合作 / 项目执行", en: "Brand Collaboration / Project Execution" },
    frontIntro: {
      zh: "围绕骁龙与小米的合作项目，承担项目推进与交付工作。",
      en: "A Snapdragon and Xiaomi collaboration supported through project execution and delivery.",
    },
    description: {
      zh: "公开作品页以合作视觉为主要展示，体现 Kai 对复杂流程、协作节点与结果交付的关注。",
      en: "The public portfolio presents the collaboration through its campaign visual and reflects Kai's focus on complex workflows, coordination points, and outcomes.",
    },
    meta: { zh: "项目推进 / 工作流优化 / 交付", en: "Execution / Workflow / Delivery" },
    signals: { zh: ["品牌合作", "结果导向"], en: ["Brand collaboration", "Results orientation"] },
  },
  hengjie: {
    title: "恒洁",
    type: { zh: "品牌合作 / 项目执行", en: "Brand Collaboration / Project Execution" },
    frontIntro: {
      zh: "恒洁品牌合作项目，围绕需求理解、执行推进与结果交付展开。",
      en: "A HEGII brand collaboration centered on requirement understanding, execution, and delivery.",
    },
    description: {
      zh: "公开作品页以合作视觉为主要展示。Kai 注重在推进过程中持续调整，并把不确定任务完整收尾。",
      en: "The public portfolio presents the collaboration through its campaign visual. Kai focuses on continuous adjustment and bringing uncertain work to a complete finish.",
    },
    meta: { zh: "品牌合作 / 项目执行 / 交付", en: "Brand Collaboration / Execution / Delivery" },
    signals: { zh: ["完整收尾", "结果交付"], en: ["Complete delivery", "Outcome focused"] },
  },
};
