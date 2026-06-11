// lib/status/plans.ts
// Тарифные конфигурации страницы статуса.
// Все строки этапов/подзадач — ключи в content/*.json (ветка status.plans).
// plan читается из Trello-карточки: строка "PLAN: setup|pro|custom" в описании.

export type PlanId = "setup" | "pro" | "custom";

export interface StageConfig {
  /** ключ для t("status.plans.{plan}.stages.{i}.name") */
  nameKey: string;
  /** ключи дефолтных подзадач — если нет чеклиста Day N в Trello */
  defaultSubtaskKeys: string[];
}

export interface PlanConfig {
  id: PlanId;
  /** ключ i18n для чипа тарифа */
  chipKey: string;
  /** визуальный стиль чипа */
  chipVariant: "gray" | "lime" | "amber";
  stages: StageConfig[];
  /** кол-во раундов правок */
  revisionTotal: number;
  /** ключ i18n для строки счётчика правок */
  revisionLabelKey: string;
  /** кол-во раундов согласования */
  approvalCount: number;
  /** ключ i18n для заголовка approve-блока */
  approveHeadingKey: string;
  /** дни техподдержки после запуска */
  supportDays: number;
  /** показывать номера дней в этапах */
  showDayNumbers: boolean;
}

export const PLANS: Record<PlanId, PlanConfig> = {
  setup: {
    id: "setup",
    chipKey: "status.plans.setup.chip",
    chipVariant: "gray",
    stages: [
      {
        nameKey: "status.plans.setup.stages.0.name",
        defaultSubtaskKeys: [
          "status.plans.setup.stages.0.sub.0",
          "status.plans.setup.stages.0.sub.1",
          "status.plans.setup.stages.0.sub.2",
        ],
      },
      {
        nameKey: "status.plans.setup.stages.1.name",
        defaultSubtaskKeys: [
          "status.plans.setup.stages.1.sub.0",
          "status.plans.setup.stages.1.sub.1",
          "status.plans.setup.stages.1.sub.2",
        ],
      },
      {
        nameKey: "status.plans.setup.stages.2.name",
        defaultSubtaskKeys: [
          "status.plans.setup.stages.2.sub.0",
          "status.plans.setup.stages.2.sub.1",
          "status.plans.setup.stages.2.sub.2",
        ],
      },
    ],
    revisionTotal: 2,
    revisionLabelKey: "status.plans.setup.revisionLabel",
    approvalCount: 1,
    approveHeadingKey: "status.plans.setup.approveHeading",
    supportDays: 30,
    showDayNumbers: true,
  },

  pro: {
    id: "pro",
    chipKey: "status.plans.pro.chip",
    chipVariant: "lime",
    stages: [
      {
        nameKey: "status.plans.pro.stages.0.name",
        defaultSubtaskKeys: [
          "status.plans.pro.stages.0.sub.0",
          "status.plans.pro.stages.0.sub.1",
          "status.plans.pro.stages.0.sub.2",
        ],
      },
      {
        nameKey: "status.plans.pro.stages.1.name",
        defaultSubtaskKeys: [
          "status.plans.pro.stages.1.sub.0",
          "status.plans.pro.stages.1.sub.1",
        ],
      },
      {
        nameKey: "status.plans.pro.stages.2.name",
        defaultSubtaskKeys: [
          "status.plans.pro.stages.2.sub.0",
          "status.plans.pro.stages.2.sub.1",
          "status.plans.pro.stages.2.sub.2",
        ],
      },
      {
        nameKey: "status.plans.pro.stages.3.name",
        defaultSubtaskKeys: [
          "status.plans.pro.stages.3.sub.0",
          "status.plans.pro.stages.3.sub.1",
        ],
      },
      {
        nameKey: "status.plans.pro.stages.4.name",
        defaultSubtaskKeys: [
          "status.plans.pro.stages.4.sub.0",
          "status.plans.pro.stages.4.sub.1",
          "status.plans.pro.stages.4.sub.2",
        ],
      },
    ],
    revisionTotal: 2,
    revisionLabelKey: "status.plans.pro.revisionLabel",
    approvalCount: 2,
    approveHeadingKey: "status.plans.pro.approveHeading",
    supportDays: 60,
    showDayNumbers: true,
  },

  custom: {
    id: "custom",
    chipKey: "status.plans.custom.chip",
    chipVariant: "amber",
    stages: [
      {
        nameKey: "status.plans.custom.stages.0.name",
        defaultSubtaskKeys: [
          "status.plans.custom.stages.0.sub.0",
          "status.plans.custom.stages.0.sub.1",
        ],
      },
      {
        nameKey: "status.plans.custom.stages.1.name",
        defaultSubtaskKeys: [
          "status.plans.custom.stages.1.sub.0",
          "status.plans.custom.stages.1.sub.1",
          "status.plans.custom.stages.1.sub.2",
        ],
      },
      {
        nameKey: "status.plans.custom.stages.2.name",
        defaultSubtaskKeys: [
          "status.plans.custom.stages.2.sub.0",
          "status.plans.custom.stages.2.sub.1",
        ],
      },
      {
        nameKey: "status.plans.custom.stages.3.name",
        defaultSubtaskKeys: [
          "status.plans.custom.stages.3.sub.0",
          "status.plans.custom.stages.3.sub.1",
          "status.plans.custom.stages.3.sub.2",
        ],
      },
    ],
    revisionTotal: 3,
    revisionLabelKey: "status.plans.custom.revisionLabel",
    approvalCount: 99, // на каждом дизайн-раунде
    approveHeadingKey: "status.plans.custom.approveHeading",
    supportDays: 90,
    showDayNumbers: false,
  },
};

/** Извлечь PlanId из описания Trello-карточки */
export function parsePlanFromDesc(desc: string): PlanId {
  const m = desc.match(/PLAN:\s*(setup|pro|custom)/i);
  if (m) return m[1].toLowerCase() as PlanId;
  return "setup"; // fallback
}

/** Маппинг: env-переменная TRELLO_LIST_* → индекс этапа для каждого тарифа.
 *  stage = 0 означает «принят» (до первого этапа).
 *  stage = planStages.length + 1 означает «готово».
 */
export function getStageFromListId(
  listId: string,
  plan: PlanId
): number {
  const listPaid    = process.env.TRELLO_LIST_PAID    || "";
  const listBrief   = process.env.TRELLO_LIST_BRIEF   || "";
  const listBuild   = process.env.TRELLO_LIST_BUILD   || "";
  const listLaunch  = process.env.TRELLO_LIST_LAUNCH  || "";
  const listDone    = process.env.TRELLO_LIST_DONE    || "";

  // Дополнительные списки только для pro
  const listBrand   = process.env.TRELLO_LIST_BRAND   || "";
  const listSections= process.env.TRELLO_LIST_SECTIONS|| "";

  if (listId === listDone)   return PLANS[plan].stages.length + 1; // «готово»
  if (listId === listPaid)   return 0; // «принят»

  if (plan === "pro") {
    // 5 этапов: brief→1, brand→2, sections→3, build→4, launch→5
    if (listId === listBrief)    return 1;
    if (listId === listBrand)    return 2;
    if (listId === listSections) return 3;
    if (listId === listBuild)    return 4;
    if (listId === listLaunch)   return 5;
  } else if (plan === "custom") {
    // 4 этапа: brief→1, brand→2, build→3, launch→4
    if (listId === listBrief)  return 1;
    if (listId === listBrand)  return 2;
    if (listId === listBuild)  return 3;
    if (listId === listLaunch) return 4;
  } else {
    // setup: 3 этапа: brief→1, build→2, launch→3
    if (listId === listBrief)  return 1;
    if (listId === listBuild)  return 2;
    if (listId === listLaunch) return 3;
  }

  return 0;
}
