import Taro from "@tarojs/taro";
import type { Side } from "@game/core";

import MaskDudeDJ from "@/assets/skins/pa/Mask-Dude-Double-Jump.png";
import MaskDudeHit from "@/assets/skins/pa/Mask-Dude-Hit.png";
import MaskDudeIdle from "@/assets/skins/pa/Mask-Dude-Idle.png";
import MaskDudeRun from "@/assets/skins/pa/Mask-Dude-Run.png";
import NinjaFrogDJ from "@/assets/skins/pa/Ninja-Frog-Double-Jump.png";
import NinjaFrogHit from "@/assets/skins/pa/Ninja-Frog-Hit.png";
import NinjaFrogIdle from "@/assets/skins/pa/Ninja-Frog-Idle.png";
import NinjaFrogRun from "@/assets/skins/pa/Ninja-Frog-Run.png";
import PinkManDJ from "@/assets/skins/pa/Pink-Man-Double-Jump.png";
import PinkManHit from "@/assets/skins/pa/Pink-Man-Hit.png";
import PinkManIdle from "@/assets/skins/pa/Pink-Man-Idle.png";
import PinkManRun from "@/assets/skins/pa/Pink-Man-Run.png";
import VirtualGuyDJ from "@/assets/skins/pa/Virtual-Guy-Double-Jump.png";
import VirtualGuyHit from "@/assets/skins/pa/Virtual-Guy-Hit.png";
import VirtualGuyIdle from "@/assets/skins/pa/Virtual-Guy-Idle.png";
import VirtualGuyRun from "@/assets/skins/pa/Virtual-Guy-Run.png";

import CometB from "@/assets/skins/sp/Comet-bounce.gif";
import CometG from "@/assets/skins/sp/Comet-greet.gif";
import CometI from "@/assets/skins/sp/Comet-idle.gif";
import DracoB from "@/assets/skins/sp/Draco-bounce.gif";
import DracoG from "@/assets/skins/sp/Draco-greet.gif";
import DracoI from "@/assets/skins/sp/Draco-idle.gif";
import FelisB from "@/assets/skins/sp/Felis-bounce.gif";
import FelisG from "@/assets/skins/sp/Felis-greet.gif";
import FelisI from "@/assets/skins/sp/Felis-idle.gif";
import FrostB from "@/assets/skins/sp/Frost-bounce.gif";
import FrostG from "@/assets/skins/sp/Frost-greet.gif";
import FrostI from "@/assets/skins/sp/Frost-idle.gif";
import LunaB from "@/assets/skins/sp/Luna-bounce.gif";
import LunaG from "@/assets/skins/sp/Luna-greet.gif";
import LunaI from "@/assets/skins/sp/Luna-idle.gif";
import NovaB from "@/assets/skins/sp/Nova-bounce.gif";
import NovaG from "@/assets/skins/sp/Nova-greet.gif";
import NovaI from "@/assets/skins/sp/Nova-idle.gif";

/** 分身动画帧数/时长（帧为 128px，已离线 4x 最近邻放大）。 */
export type SpriteAnim = "idle" | "run" | "jump" | "hit";
export interface AnimDef {
  frames: number;
  /** 播放秒数 */
  dur: number;
  /** 是否循环；false=播一次（配合结束后回 idle） */
  loop: boolean;
}
export const ANIMS: Record<SpriteAnim, AnimDef> = {
  idle: { frames: 11, dur: 0.66, loop: true },
  run: { frames: 12, dur: 0.6, loop: true },
  jump: { frames: 6, dur: 0.5, loop: false },
  hit: { frames: 7, dur: 0.55, loop: false },
};

/** 分身：Pixel Adventure（Pixel Frog，CC0）。帧表 strip 均为 128px 高。 */
export interface CharSkin {
  id: string;
  name: string;
  tag: string;
  sheets: Record<SpriteAnim, string>;
}
export const CHARS: CharSkin[] = [
  {
    id: "pink-man",
    name: "Pink Man",
    tag: "男生阵营默认",
    sheets: { idle: PinkManIdle, run: PinkManRun, jump: PinkManDJ, hit: PinkManHit },
  },
  {
    id: "ninja-frog",
    name: "Ninja Frog",
    tag: "女生阵营默认",
    sheets: { idle: NinjaFrogIdle, run: NinjaFrogRun, jump: NinjaFrogDJ, hit: NinjaFrogHit },
  },
  {
    id: "virtual-guy",
    name: "Virtual Guy",
    tag: "像素酷盖",
    sheets: { idle: VirtualGuyIdle, run: VirtualGuyRun, jump: VirtualGuyDJ, hit: VirtualGuyHit },
  },
  {
    id: "mask-dude",
    name: "Mask Dude",
    tag: "神秘面具",
    sheets: { idle: MaskDudeIdle, run: MaskDudeRun, jump: MaskDudeDJ, hit: MaskDudeHit },
  },
];

/** 精灵：ShadowPets（CC-BY 4.0）。GIF 直播 idle/bounce/greet。 */
export type PetAnim = "idle" | "bounce" | "greet";
export interface PetSkin {
  id: string;
  name: string;
  tag: string;
  gifs: Record<PetAnim, string>;
}
export const PETS: PetSkin[] = [
  { id: "luna", name: "Luna", tag: "幽灵小狐", gifs: { idle: LunaI, bounce: LunaB, greet: LunaG } },
  {
    id: "frost",
    name: "Frost",
    tag: "霜系圆滚",
    gifs: { idle: FrostI, bounce: FrostB, greet: FrostG },
  },
  { id: "nova", name: "Nova", tag: "星轨猫咪", gifs: { idle: NovaI, bounce: NovaB, greet: NovaG } },
  {
    id: "comet",
    name: "Comet",
    tag: "彗星尾巴",
    gifs: { idle: CometI, bounce: CometB, greet: CometG },
  },
  {
    id: "felis",
    name: "Felis",
    tag: "优等喵",
    gifs: { idle: FelisI, bounce: FelisB, greet: FelisG },
  },
  {
    id: "draco",
    name: "Draco",
    tag: "迷你龙",
    gifs: { idle: DracoI, bounce: DracoB, greet: DracoG },
  },
];

export function defaultChar(side: Side): string {
  return side === "male" ? "pink-man" : "ninja-frog";
}

export function charById(id: string | null | undefined, side: Side = "male"): CharSkin {
  return (
    CHARS.find((c) => c.id === id) ?? CHARS.find((c) => c.id === defaultChar(side)) ?? CHARS[0]
  );
}
export function petById(id: string | null | undefined): PetSkin {
  return PETS.find((p) => p.id === id) ?? PETS[0];
}

// ── 皮肤选择持久化 ──
const SKIN_KEY = "tg_skin_v1";
export interface SkinChoice {
  charId: string | null; // null = 跟随阵营默认
  petId: string | null;
}

export function getSkin(): SkinChoice {
  try {
    return Taro.getStorageSync(SKIN_KEY) || { charId: null, petId: null };
  } catch {
    return { charId: null, petId: null };
  }
}

export function setSkin(choice: Partial<SkinChoice>): void {
  try {
    Taro.setStorageSync(SKIN_KEY, { ...getSkin(), ...choice });
  } catch {
    // 存储不可用时静默降级
  }
}
