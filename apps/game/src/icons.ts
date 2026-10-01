import type { CategoryId } from "@game/content";

import icChat from "@/assets/icons/1F4AC.png";
import icDate from "@/assets/icons/1F498.png";
import icEmotion from "@/assets/icons/1F3AD.png";
import icMoney from "@/assets/icons/1F6CD.png";
import icLife from "@/assets/icons/1F3E0.png";
import icSocial from "@/assets/icons/1F389.png";
import icPrivate from "@/assets/icons/1F525.png";
import icScreen from "@/assets/icons/1F3AC.png";
import icFuture from "@/assets/icons/1F3E1.png";
import icScore from "@/assets/icons/1F9EE.png";
import icNeeds from "@/assets/icons/1F48E.png";
import icFight from "@/assets/icons/2694.png";
import icDice from "@/assets/icons/1F3B2.png";

/**
 * 场景图标（OpenMoji 彩色描边版，CC BY-SA 4.0，署名见 docs/CREDITS.md）。
 * 与贴纸杂志风的粗墨描边+平涂色保持一致。
 */
export const SCENE_ICON: Record<CategoryId | "all", string> = {
  all: icDice,
  chat: icChat,
  date: icDate,
  emotion: icEmotion,
  money: icMoney,
  life: icLife,
  social: icSocial,
  private: icPrivate,
  screen: icScreen,
  future: icFuture,
  score: icScore,
  needs: icNeeds,
  fight: icFight,
};
