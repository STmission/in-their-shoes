import { useState } from "react";
import { Button, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import type { Side } from "@game/core";
import { startSession } from "../../store";
import "./index.scss";

const SIDES: { key: Side; emoji: string; label: string; hint: string }[] = [
  { key: "male", emoji: "🙋‍♂️", label: "我是男生", hint: "答女生处境题" },
  { key: "female", emoji: "🙋‍♀️", label: "我是女生", hint: "答男生处境题" },
];

export default function Home() {
  const [side, setSide] = useState<Side | null>(null);

  const start = () => {
    if (!side) return;
    startSession(side);
    Taro.navigateTo({ url: "/pages/quiz/index" });
  };

  return (
    <View className="page home">
      <View className="home__hero">
        <Text className="home__title">TA 的世界</Text>
        <Text className="home__subtitle">你有多懂对面的世界？</Text>
        <Text className="home__tag">男生答女生题 · 女生答男生题</Text>
      </View>

      <View className="home__sides">
        {SIDES.map((s) => (
          <View
            key={s.key}
            className={`side-card side-card--${s.key} ${side === s.key ? "is-active" : ""}`}
            onClick={() => setSide(s.key)}
          >
            <Text className="side-card__emoji">{s.emoji}</Text>
            <Text className="side-card__label">{s.label}</Text>
            <Text className="side-card__hint">{s.hint}</Text>
          </View>
        ))}
      </View>

      <Button className={`btn-primary home__cta ${side ? "" : "is-disabled"}`} onClick={start}>
        开始换位挑战 →
      </Button>
    </View>
  );
}
