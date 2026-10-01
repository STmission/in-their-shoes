import { useEffect, useRef, useState } from "react";
import { Image, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import type { SubmitResult } from "@game/core";
import { bank } from "@game/content";
import PixelSprite from "@/components/PixelSprite";
import PetSprite from "@/components/PetSprite";
import { SCENE_ICON } from "@/icons";
import { getSkin, type SpriteAnim } from "@/skins";
import { finishSession, gameStore } from "../../store";
import "./index.scss";

const AUTO_NEXT_MS = 2600;
const ANALYZE_MS = 1400;

export default function Quiz() {
  const session = gameStore.session;
  const [picked, setPicked] = useState<number | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [anim, setAnim] = useState<SpriteAnim>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skin = getSkin();

  // 直接进入本页而无对局时（如 H5 刷新），回大厅。
  useEffect(() => {
    if (!gameStore.session) Taro.reLaunch({ url: "/pages/lobby/index" });
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  if (!session) return <View className="page" />;

  const q = session.current;
  const total = session.questions.length;
  const revealed = session.phase === "revealed";
  const scene = q ? bank.categories.find((c) => c.id === q.category) : undefined;

  const advance = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    if (session.next() === "finished") {
      const sceneName = session.category
        ? (bank.categories.find((c) => c.id === session.category)?.name ?? "")
        : "随机全场景";
      finishSession(session, sceneName);
      setAnalyzing(true);
      setTimeout(() => Taro.redirectTo({ url: "/pages/result/index" }), ANALYZE_MS);
    } else {
      setPicked(null);
      setResult(null);
      setAnim("idle");
    }
  };

  const choose = (i: number) => {
    if (session.phase !== "answering") return;
    const r = session.submit(i);
    setPicked(i);
    setResult(r);
    setAnim(r.correct ? "jump" : "hit");
    // spec: 选中自动连跳——短延迟后自动进入下一题/过场
    timer.current = setTimeout(advance, AUTO_NEXT_MS);
  };

  if (analyzing) {
    return (
      <View className="analyze">
        <View className="ana-card">
          <PixelSprite charId={skin.charId} side={session.side} anim="run" size={110} />
          <Text className="analyze-t">正在生成你的共情指数</Text>
          <Text className="analyze-p">统计你对「对面世界」的理解力……</Text>
        </View>
      </View>
    );
  }

  const optionClass = (i: number) => {
    if (!revealed) return "";
    if (i === q?.answerIndex) return "is-correct";
    if (i === picked) return "is-wrong";
    return "is-dimmed";
  };

  return (
    <View className="page quiz">
      <View className="qhd">
        <View className="qclose" onClick={() => Taro.navigateBack({ delta: 1 })}>
          ×
        </View>
        <Text className="qcount">
          {session.index + 1}
          <Text className="qcount-total"> / {total}</Text>
        </Text>
        <Text className="qstreak">{session.streak >= 2 ? `🔥${session.streak}` : ""}</Text>
      </View>
      <View className="qbar">
        <View
          className="qbar-i"
          style={{ width: `${((session.index + (revealed ? 1 : 0)) / total) * 100}%` }}
        />
      </View>

      <View className="qstage">
        <View className="qbuddy">
          <PixelSprite charId={skin.charId} side={session.side} anim={anim} size={84} />
        </View>
        <View className="qpet">
          <PetSprite
            petId={skin.petId}
            anim={revealed ? (result?.correct ? "bounce" : "greet") : "idle"}
            size={56}
          />
        </View>
      </View>

      <View className="qbody">
        {scene && (
          <View className="qidx">
            <Image className="qidx-ic" src={SCENE_ICON[scene.id]} mode="aspectFit" /> {scene.name}
          </View>
        )}
        <View className="qcard stick">
          <Text className="qtext">{q?.scenario}</Text>
        </View>

        <View className="opts">
          {q?.options.map((opt, i) => (
            <View key={i} className={`opt ${optionClass(i)}`} onClick={() => choose(i)}>
              <Text className="opt-key">{["A", "B", "C", "D"][i]}</Text>
              <Text className="opt-text">{opt}</Text>
            </View>
          ))}
        </View>

        {revealed && result && (
          <View className="feedback" onClick={advance}>
            <Text className={`verdict ${result.correct ? "is-correct" : "is-wrong"}`}>
              {result.correct ? `✓ 答对！+${result.gained}` : "✗ 标绿的是正确答案"}
              {result.streak >= 2 ? `  🔥 连对 x${result.streak}` : ""}
            </Text>
            <View className="explain">
              <Text className="explain-text">💡 {result.question.explanation}</Text>
              {result.question.funFact && (
                <Text className="funfact">📖 {result.question.funFact}</Text>
              )}
            </View>
            <Text className="autonext">轻点继续 · 自动进入下一题</Text>
          </View>
        )}
      </View>
    </View>
  );
}
