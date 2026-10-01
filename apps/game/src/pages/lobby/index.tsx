import { useState } from "react";
import { Button, Image, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import type { Side } from "@game/core";
import { bank, type CategoryId, type SceneCategory } from "@game/content";
import PixelSprite from "@/components/PixelSprite";
import { SCENE_ICON } from "@/icons";
import { charById, getSkin } from "@/skins";
import { startSession } from "../../store";
import "./index.scss";

/** 场景图标块撞色（与图标底色互补） */
const SCENE_COLOR: Record<string, string> = {
  chat: "#BFEAF4",
  date: "#FFD6E4",
  emotion: "#DCD3FF",
  money: "#FFE9B0",
  life: "#C9EBC2",
  social: "#FFD9C8",
  private: "#FFC9D6",
  screen: "#C4D3FF",
  future: "#C4EDE2",
  score: "#FFDCB8",
  needs: "#DCD0FF",
  fight: "#FFC4B8",
};

const SCENE_STAR: Record<string, string> = {
  chat: "★★",
  date: "★★",
  emotion: "★★★",
  money: "★★",
  life: "★",
  social: "★",
  private: "★★★",
  screen: "★★",
  future: "★★★",
  score: "★★★",
  needs: "★★",
  fight: "★★★",
};

type Filter = "all" | "male" | "female";

export default function Lobby() {
  const [filter, setFilter] = useState<Filter>("all");
  const [pickSideOpen, setPickSideOpen] = useState(false);
  const [side, setSide] = useState<Side | null>(null);
  const skin = getSkin();

  const countOf = (c: SceneCategory, s: Side) =>
    bank.questions.filter(
      (q) =>
        q.category === c.id && q.targetPerspective === (s === "male" ? "for-female" : "for-male"),
    ).length;

  const go = (s: Side, category: CategoryId | null) => {
    startSession(s, category);
    setPickSideOpen(false);
    setSide(null);
    Taro.navigateTo({ url: "/pages/quiz/index" });
  };

  const rows = bank.categories.flatMap((c: SceneCategory) =>
    (["male", "female"] as const)
      .filter((s) => filter === "all" || filter === s)
      .map((s) => ({
        scene: c,
        side: s,
        count: countOf(c, s),
      })),
  );

  return (
    <View className="page lobby">
      <View className="hd">
        <View className="brand">
          <i />
          TA 的世界
        </View>
        <View className="btn-sm" onClick={() => Taro.switchTab({ url: "/pages/mine/index" })}>
          换装 ›
        </View>
      </View>

      {/* 综合推荐大卡：随机全场景，需选阵营 */}
      <View className="feat">
        <Text className="feat-tag">SMART PICK · 综合推荐</Text>
        <Text className="feat-name">随机全场景</Text>
        <Text className="feat-sub">12 大场景混抽 8 题 · 全面检验换位功力</Text>
        <View className="feat-btn" onClick={() => setPickSideOpen(true)}>
          开始挑战 →
        </View>
      </View>

      {/* 筛选：谁答 */}
      <View className="chips">
        {(
          [
            ["all", "全部 " + rows.length],
            ["male", "男生答"],
            ["female", "女生答"],
          ] as [Filter, string][]
        ).map(([f, label]) => (
          <View key={f} className={`chip ${filter === f ? "on" : ""}`} onClick={() => setFilter(f)}>
            {label}
          </View>
        ))}
      </View>

      {/* 场景小测列表 */}
      <View className="tlist">
        {rows.map(({ scene, side, count }) => (
          <View
            key={`${scene.id}-${side}`}
            className="trow stick"
            onClick={() => go(side, scene.id)}
          >
            <View className="tico" style={{ background: SCENE_COLOR[scene.id] }}>
              <Image className="tico-img" src={SCENE_ICON[scene.id]} mode="aspectFit" />
            </View>
            <View className="tinfo">
              <Text className="tname">{scene.name}</Text>
              <Text className="tmeta">
                {side === "male" ? "她的处境 · 男生答" : "他的处境 · 女生答"} · {count} 题 · 约 1
                分钟 · {SCENE_STAR[scene.id]}
              </Text>
              <Text className={`ttag ${side === "male" ? "m" : "f"}`}>
                {side === "male" ? "♂ 换位专场" : "♀ 换位专场"}
              </Text>
            </View>
            <Text className="tgo">›</Text>
          </View>
        ))}
      </View>

      <View className="lobby-note stick">
        <Text>📌 每条小测 = 一个场景的「对面视角」题。娱乐向，不代表任何群体画像。</Text>
      </View>

      {pickSideOpen && (
        <View className="sheetbg" onClick={() => setPickSideOpen(false)}>
          <View className="sheet" onClick={(e) => e.stopPropagation()}>
            <View className="handle" />
            <View className="sheet-title">
              <Image className="sheet-ic" src={SCENE_ICON.all} mode="aspectFit" /> 随机全场景
            </View>
            <Text className="sheet-sub">选择你的阵营 —— 你将回答「对面视角」的处境题</Text>
            <View className="pick-sides">
              {(["male", "female"] as const).map((sd) => {
                const skinObj = charById(skin.charId ?? undefined, sd);
                return (
                  <View
                    key={sd}
                    className={`pick-side ${side === sd ? "is-on" : ""}`}
                    onClick={() => setSide(sd)}
                  >
                    <View className="pick-side-spr">
                      <PixelSprite charId={skinObj.id} anim="idle" size={64} />
                    </View>
                    <Text className="pick-side-l">
                      {sd === "male" ? "🙋‍♂️ 我是男生" : "🙋‍♀️ 我是女生"}
                    </Text>
                    <Text className="pick-side-h">
                      {sd === "male" ? "答女生处境题" : "答男生处境题"}
                    </Text>
                  </View>
                );
              })}
            </View>
            <Button
              className={`btn ${side ? "" : "is-disabled"}`}
              onClick={() => side && go(side, null)}
            >
              开始换位挑战 →
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}
