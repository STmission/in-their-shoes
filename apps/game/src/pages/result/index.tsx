import { useEffect, useState } from "react";
import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { bank } from "@game/content";
import PixelSprite from "@/components/PixelSprite";
import PetSprite from "@/components/PetSprite";
import { getSkin } from "@/skins";
import { gameStore, startSession } from "../../store";
import "./index.scss";

export default function Result() {
  const s = gameStore.session;
  const [shown, setShown] = useState(0);
  const [showBody, setShowBody] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const skin = getSkin();

  const title = s?.rank ?? "";
  const letters = Array.from(title);

  // 称号逐字弹入揭示
  useEffect(() => {
    if (!s) return;
    if (shown < letters.length) {
      const t = setTimeout(() => setShown((n) => n + 1), 170);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setShowBody(true), 350);
    return () => clearTimeout(t);
  }, [shown, s]);

  if (!s) {
    return (
      <View className="res">
        <View className="res-empty">
          <Text>暂无对局记录</Text>
          <View
            className="res-empty-btn"
            onClick={() => Taro.reLaunch({ url: "/pages/lobby/index" })}
          >
            回到大厅
          </View>
        </View>
      </View>
    );
  }

  const total = s.questions.length;
  const sceneName = s.category
    ? (bank.categories.find((c) => c.id === s.category)?.name ?? "")
    : "随机全场景";
  const insights = s.questions.filter((q) => q.funFact).slice(0, 2);

  const replay = () => {
    startSession(s.side, s.category);
    Taro.redirectTo({ url: "/pages/quiz/index" });
  };

  return (
    <View className="res">
      <View className="res-t">
        <Text className="res-lab">你的换位称号</Text>
        <Text className="res-code">
          {letters.map((ch, i) => (
            <Text key={i} className={`res-ch ${i < shown ? "is-in" : ""}`}>
              {ch}
            </Text>
          ))}
        </Text>
        <Text className={`res-sub ${showBody ? "is-in" : ""}`}>
          你在「{s.side === "male" ? "她视角" : "他视角"}」下完成了 {total} 道换位题 · {sceneName}
        </Text>
      </View>

      {showBody && (
        <View className="res-body">
          <View className="res-duo">
            <PixelSprite charId={skin.charId} side={s.side} anim="run" size={92} />
            <PetSprite petId={skin.petId} anim="bounce" size={66} />
          </View>

          <View className="pct">
            <View className="ring">
              <View className="ring-fill">
                <Text className="ring-num">{s.empathyIndex}</Text>
                <Text className="ring-lab">共情指数</Text>
              </View>
            </View>
            <View className="res-stats">
              <Text className="res-stat">
                {s.correctCount}/{total} 答对
              </Text>
              <Text className="res-stat">共 {s.score} 分</Text>
            </View>
          </View>

          {insights.map((q, i) => (
            <View className={`insight ${i % 2 ? "tilt-r" : "tilt-l"}`} key={i}>
              <Text className="insight-lab">💡 换位知识点 {i + 1}</Text>
              <Text className="insight-text">{q.funFact ?? q.explanation}</Text>
            </View>
          ))}

          <Text className="res-disc">仅供娱乐参考 · 不代表任何群体画像</Text>

          <View className="res-acts">
            <View className="res-btn primary" onClick={() => setShareOpen(true)}>
              分享战绩
            </View>
            <View className="res-btn yellow" onClick={replay}>
              再来一局
            </View>
            <View className="res-btn" onClick={() => Taro.reLaunch({ url: "/pages/lobby/index" })}>
              回大厅
            </View>
          </View>
        </View>
      )}

      {shareOpen && (
        <View className="sheetbg" onClick={() => setShareOpen(false)}>
          <View className="sheet" onClick={(e) => e.stopPropagation()}>
            <View className="handle" />
            <Text className="share-title">生成分享卡片</Text>
            <View className="sharecard">
              <Text className="sharecard-code">{title}</Text>
              <Text className="sharecard-sub">
                共情指数 {s.empathyIndex} · {sceneName}
              </Text>
            </View>
            <Text className="share-tip">
              点击右上角「···」即可分享给好友（小程序端），H5 端可截图分享。
            </Text>
            <View className="btn ghost" onClick={() => setShareOpen(false)}>
              知道了
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
