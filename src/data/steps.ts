export interface Step {
  id: number;
  title: string;
  description: string;
  tips: string;
  icon: string;
}

export const steps: Step[] = [
  {
    id: 1,
    title: "規劃網站目標與結構",
    description:
      "在動手寫程式之前，先確定網站的目的：是個人作品集、商業電商，還是部落格？釐清目標受眾、核心功能清單，以及網站地圖（Sitemap）。這個階段的產出通常是一份需求文件或線框圖（Wireframe）。",
    tips: "用紙筆草繪頁面架構，比直接開電腦更有效率。",
    icon: "🗺️",
  },
  {
    id: 2,
    title: "選擇技術棧（Tech Stack）",
    description:
      "根據專案規模選擇合適的工具。前端可選 React / Vue / Svelte，後端可選 Node.js / Python / Go，資料庫可選 PostgreSQL / MongoDB。本專案使用 React + TypeScript + Vite，無後端，適合學習前端架構。",
    tips: "新手建議從 React + Vite 開始，生態系成熟、文件豐富。",
    icon: "⚙️",
  },
  {
    id: 3,
    title: "設置開發環境",
    description:
      "安裝 Node.js（建議 LTS 版本）與 npm / pnpm / yarn 套件管理器。使用 VS Code 作為編輯器，安裝 ESLint、Prettier、TypeScript 等擴充套件。確認終端機可以執行 node -v 與 npm -v。",
    tips: "使用 nvm 管理多版本 Node.js，方便切換專案環境。",
    icon: "💻",
  },
  {
    id: 4,
    title: "建立專案資料夾結構",
    description:
      "執行 npm create vite@latest 建立骨架，再依照職責劃分資料夾：components（UI 元件）、pages（頁面）、data（靜態資料）、hooks（自訂 Hook）、utils（工具函式）。清晰的結構讓團隊協作更容易。",
    tips: "遵循「關注點分離」原則，每個檔案只做一件事。",
    icon: "📁",
  },
  {
    id: 5,
    title: "設計 UI 元件（Component）",
    description:
      "將畫面拆解成可重用的 React Function Component，例如 Button、Card、Text、Navbar。每個元件透過 Props 接收資料，透過 State（useState）管理互動狀態，透過 CSS className 控制樣式。",
    tips: "先建立最小可用元件，再逐步組合成複雜頁面。",
    icon: "🧩",
  },
  {
    id: 6,
    title: "實作頁面與路由",
    description:
      "使用 React Router 定義路由規則，將不同路徑對應到不同頁面元件。例如 / 對應首頁、/about 對應關於頁、/docs/:section/:page 對應文件詳情頁。路由讓單頁應用（SPA）模擬多頁體驗。",
    tips: "先從單頁開始，確認元件正常運作後再加入多頁路由。",
    icon: "🔀",
  },
  {
    id: 7,
    title: "串接後端 / API",
    description:
      "使用 fetch 或 axios 向後端 REST API 或 GraphQL 端點取得資料。搭配 useEffect Hook 在元件掛載時發送請求，並用 useState 儲存回傳結果。記得處理 loading 與 error 狀態，提升使用者體驗。",
    tips: "開發初期可用 json-server 或 MockAPI 模擬後端回應。",
    icon: "🔗",
  },
  {
    id: 8,
    title: "撰寫測試與除錯",
    description:
      "使用 Vitest + React Testing Library 為元件撰寫單元測試，驗證渲染結果與互動行為。開啟瀏覽器 DevTools，利用 Console、Network、React DevTools 面板除錯。養成 TDD（測試驅動開發）習慣，減少回歸錯誤。",
    tips: "console.log 是最快的除錯工具，但記得上線前移除。",
    icon: "🧪",
  },
  {
    id: 9,
    title: "部署上線（Deployment）",
    description:
      "執行 npm run build 產生靜態檔案（dist/），上傳至 Vercel、Netlify 或 GitHub Pages 即可免費部署。設定自訂網域、HTTPS 憑證、環境變數（.env）。CI/CD 流程可讓每次 git push 自動觸發部署。",
    tips: "Vercel 與 Netlify 支援 GitHub 整合，一鍵自動部署最方便。",
    icon: "🚀",
  },
  {
    id: 10,
    title: "維護與持續更新",
    description:
      "上線後定期更新套件版本（npm update）、修復回報的 Bug、根據使用者回饋新增功能。監控網站效能（Lighthouse 分數）、錯誤追蹤（Sentry）、流量分析（GA4）。網站是持續演進的產品，不是一次性作品。",
    tips: "寫好 CHANGELOG 與 README，讓未來的自己看得懂現在做的決策。",
    icon: "🔄",
  },
];

export function generateMarkdown(stepsData: Step[]): string {
  const lines: string[] = [
    "# 建立網站的詳細步驟",
    "",
    "> 本文件由 Note Space 網站架構學習專案自動產生。",
    "",
  ];
  stepsData.forEach((step) => {
    lines.push(`## 步驟 ${step.id}：${step.title}`);
    lines.push("");
    lines.push(step.description);
    lines.push("");
    lines.push(`> **小技巧：** ${step.tips}`);
    lines.push("");
  });
  return lines.join("\n");
}
