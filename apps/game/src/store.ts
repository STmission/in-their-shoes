import Taro from "@tarojs/taro";
import { GameSession, type Side } from "@game/core";
import type { CategoryId } from "@game/content";

/** 跨页面共享的对局存储（模块级，H5 与小程序同构可用）。 */
interface GameStore {
  session: GameSession | null;
  lastQuestionIds: string[];
  pendingCategory: CategoryId | null;
}

export const gameStore: GameStore = {
  session: null,
  lastQuestionIds: [],
  pendingCategory: null,
};

export function startSession(side: Side, category: CategoryId | null): GameSession {
  const s = GameSession.start({
    side,
    category: category ?? undefined,
    count: 8,
    excludeIds: gameStore.lastQuestionIds,
  });
  gameStore.session = s;
  return s;
}

// ── 历史记录（本地存储）──
export interface HistoryRecord {
  side: Side;
  categoryName: string;
  empathyIndex: number;
  rank: string;
  correctCount: number;
  total: number;
  at: number;
}

const HISTORY_KEY = "tg_history_v1";

export function finishSession(s: GameSession, categoryName: string): void {
  gameStore.lastQuestionIds = s.questionIds;
  const rec: HistoryRecord = {
    side: s.side,
    categoryName,
    empathyIndex: s.empathyIndex,
    rank: s.rank,
    correctCount: s.correctCount,
    total: s.questions.length,
    at: Date.now(),
  };
  const list = getHistory();
  list.unshift(rec);
  try {
    Taro.setStorageSync(HISTORY_KEY, list.slice(0, 50));
  } catch {
    // 存储不可用时静默降级
  }
}

export function getHistory(): HistoryRecord[] {
  try {
    return Taro.getStorageSync(HISTORY_KEY) || [];
  } catch {
    return [];
  }
}

// ── 好友码（本地生成，演示数据）──
const CODE_KEY = "tg_friend_code_v1";

export function getFriendCode(): string {
  try {
    const cached = Taro.getStorageSync(CODE_KEY);
    if (cached) return cached;
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    Taro.setStorageSync(CODE_KEY, code);
    return code;
  } catch {
    return "TG0000";
  }
}
