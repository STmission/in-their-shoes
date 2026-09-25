import { GameSession, type Side } from "@game/core";

/** 跨页面共享的对局存储（模块级，H5 与小程序同构可用）。 */
interface GameStore {
  session: GameSession | null;
  lastQuestionIds: string[];
}

export const gameStore: GameStore = {
  session: null,
  lastQuestionIds: [],
};

export function startSession(side: Side): GameSession {
  const s = GameSession.start(side, 8, undefined, gameStore.lastQuestionIds);
  gameStore.session = s;
  return s;
}

export function finishSession(s: GameSession): void {
  gameStore.lastQuestionIds = s.questionIds;
}
