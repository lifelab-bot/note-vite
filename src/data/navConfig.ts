export interface NavLeaf {
  label: string;
  to: string;
}

export interface NavDropdown {
  kind: "dropdown";
  label: string;
  items: NavLeaf[];
}

export interface NavLink {
  kind: "link";
  label: string;
  href: string;
  position?: "right";
}

export type NavEntry = NavDropdown | NavLink;

export const navItems: NavEntry[] = [
  {
    kind: "dropdown",
    label: "⌨️ Docker",
    items: [{ label: "Docker基本指令", to: "/docs/Docker/Docker基本指令" }],
  },
  {
    kind: "dropdown",
    label: "⌨️ Markdown Note",
    items: [{ label: "複製按鈕怎麼做", to: "/docs/Markdown Note/複製按鈕怎麼做" }],
  },
  {
    kind: "dropdown",
    label: "🗂️ 專案紀錄",
    items: [
      {
        label: "Telegram Bot × Google Calendar 早安通知",
        to: "/docs/專案紀錄/Telegram Bot × Google Calendar 早安通知",
      },
      {
        label: "GitHub Actions Telegram 定時提醒",
        to: "/docs/專案紀錄/GitHub Actions Telegram 定時提醒",
      },
      {
        label: "環境變數概念：系統 vs 程式",
        to: "/docs/專案紀錄/environment-variables-concept",
      },
    ],
  },
  {
    kind: "dropdown",
    label: "💬 Claude 問答",
    items: [
      "2026-05-06",
      "2026-05-07",
      "2026-05-11",
      "2026-05-12",
      "2026-05-13",
      "2026-05-14",
      "2026-05-15",
      "2026-05-18",
      "2026-05-19",
      "2026-05-20",
      "2026-05-21",
      "2026-05-22",
    ].map((d) => ({ label: d, to: `/docs/ClaudeQA/${d}` })),
  },
  {
    kind: "dropdown",
    label: "⌨️ Python",
    items: [
      { label: "學習筆記｜資料型別", to: "/docs/Python/學習筆記/資料型別" },
      { label: "學習筆記｜if 判斷式", to: "/docs/Python/學習筆記/if判斷式" },
      { label: "學習筆記｜數學運算", to: "/docs/Python/學習筆記/數學運算" },
      { label: "學習筆記｜字串方法", to: "/docs/Python/學習筆記/字串方法" },
      { label: "學習筆記｜Serise A 題目", to: "/docs/Python/學習筆記/SeriseA練習題" },
      { label: "學習筆記｜基礎入門", to: "/docs/Python/學習筆記/基礎入門" },
      { label: "學習筆記｜變數與字串", to: "/docs/Python/學習筆記/變數與字串" },
      { label: "學習筆記｜應用小專案", to: "/docs/Python/學習筆記/應用小專案" },
      { label: "Claude教學｜L1 函式深入", to: "/docs/Python/Claude教學練習紀錄/2026-04-30_L1_函式深入" },
      { label: "Claude教學｜L2 迴圈進階", to: "/docs/Python/Claude教學練習紀錄/2026-05-01_L2_迴圈進階" },
      { label: "Claude教學｜L3 List完整操作", to: "/docs/Python/Claude教學練習紀錄/2026-05-12_L3_List完整操作" },
      { label: "Claude教學｜L4 Dictionary", to: "/docs/Python/Claude教學練習紀錄/2026-05-14_L4_Dictionary" },
      { label: "Claude教學｜L1–L4 總複習", to: "/docs/Python/Claude教學練習紀錄/2026-05-19_L1-L4_總複習" },
    ],
  },
  {
    kind: "dropdown",
    label: "🇬🇧 English 學習紀錄",
    items: [
      { label: "學習紀錄總覽", to: "/docs/English/學習紀錄/intro" },
      { label: "寫作練習｜2025-05-01 ~ 05-03", to: "/docs/English/寫作練習/2025-05-01_to_03" },
      { label: "寫作練習｜2026-05-20", to: "/docs/English/寫作練習/2026-05-20" },
      { label: "學習紀錄｜2026-05-21", to: "/docs/English/學習紀錄/2026-05-21_wrong-order-cafe" },
    ],
  },
  {
    kind: "dropdown",
    label: "📖 閱讀心得",
    items: [
      { label: "閱讀心得總覽", to: "/docs/Reading/intro" },
      { label: "原子習慣", to: "/docs/Reading/2026-05-19_原子習慣" },
    ],
  },
  {
    kind: "dropdown",
    label: "⌨️ Unix 工具集",
    items: [
      { label: "Terminal 無法用 code . 呼叫 VS Code", to: "/docs/UnixTools/Terminal無法用con .呼叫vscode" },
      { label: "tar_tgz轉換", to: "/docs/UnixTools/tar_tgz轉換" },
      { label: "p7zip加解壓", to: "/docs/UnixTools/p7zip加解壓" },
      { label: "如何裝yarn", to: "/docs/UnixTools/如何裝yarn" },
      { label: "如何裝ping", to: "/docs/UnixTools/如何裝ping" },
    ],
  },
  {
    kind: "link",
    label: "My GitHub",
    href: "https://github.com/lifelab-bot",
    position: "right",
  },
];
