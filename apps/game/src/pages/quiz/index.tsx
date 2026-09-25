import { useEffect, useState } from "react";
import { Button, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import type { SubmitResult } from "@game/core";
import { finishSession, gameStore } from "../../store";
import "./index.scss";

const OPTION_LABELS = ["A", "B", "C", "D"];

export default function Quiz() {
  const session = gameStore.session;
  const [picked, setPicked] = useState<number | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);

  // 直接进入本页而无对局时（如 H5 刷新），回首页。
  useEffect(() => {
    if (!gameStore.session) {
      Taro.reLaunch({ url: "/pages/home/index" });
    }
  }, []);

  if (!session || !session.current) return <View className="page" />;

  const q = session.current;
  const total = session.questions.length;
  const revealed = session.phase === "revealed";

  const choose = (i: number) => {
    if (session.phase !== "answering") return;
    const r = session.submit(i);
    setPicked(i);
    setResult(r);
  };

  const next = () => {
    if (session.next() === "finished") {
      finishSession(session);
      Taro.redirectTo({ url: "/pages/result/index" });
    } else {
      setPicked(null);
      setResult(null);
    }
  };

  const optionClass = (i: number) => {
    if (!revealed) return "";
    if (i === q.answerIndex) return "is-correct";
    if (i === picked) return "is-wrong";
    return "is-dimmed";
  };

  return (
    <View className="page quiz">
      <View className="quiz__topbar">
        <Text className="quiz__counter">
          {session.index + 1}/{total}
        </Text>
        <View className="quiz__progress">
          <View
            className="quiz__progress-fill"
            style={{ width: `${((session.index + (revealed ? 1 : 0)) / total) * 100}%` }}
          />
        </View>
        <Text className={`quiz__streak ${session.streak >= 2 ? "is-hot" : ""}`}>
          {session.streak >= 2 ? `🔥${session.streak}` : ""}
        </Text>
      </View>

      <View className="quiz__card">
        <Text className="quiz__scenario">{q.scenario}</Text>
      </View>

      <View className="quiz__options">
        {q.options.map((opt, i) => (
          <View key={i} className={`option ${optionClass(i)}`} onClick={() => choose(i)}>
            <Text className="option__label">{OPTION_LABELS[i]}</Text>
            <Text className="option__text">{opt}</Text>
          </View>
        ))}
      </View>

      {revealed && result && (
        <View className="quiz__feedback">
          <Text className={`quiz__verdict ${result.correct ? "is-correct" : "is-wrong"}`}>
            {result.correct ? `✓ 答对！+${result.gained}` : "✗ 答错了，参考答案已标绿"}
            {result.streak >= 2 ? `  🔥连对 x${result.streak}` : ""}
          </Text>
          <View className="quiz__explain">
            <Text className="quiz__explain-text">💡 {result.question.explanation}</Text>
            {result.question.funFact && (
              <Text className="quiz__funfact">📖 小知识：{result.question.funFact}</Text>
            )}
          </View>
          <Button className="btn-primary" onClick={next}>
            {session.index + 1 === total ? "查看我的共情指数 →" : "下一题 →"}
          </Button>
        </View>
      )}
    </View>
  );
}
