import { Text, View } from "@tarojs/components";
import { useDidShow } from "@tarojs/taro";
import Taro from "@tarojs/taro";
import { useState } from "react";
import { bank } from "@game/content";
import PixelSprite from "@/components/PixelSprite";
import PetSprite from "@/components/PetSprite";
import { CHARS, PETS, charById, getSkin, petById, setSkin } from "@/skins";
import { getHistory, type HistoryRecord } from "../../store";
import "./index.scss";

function fmtDate(at: number): string {
  const d = new Date(at);
  return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function Mine() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [skin, setSkinState] = useState(getSkin);

  useDidShow(() => {
    setHistory(getHistory());
    setSkinState(getSkin());
  });

  const latest = history[0];
  const totalTests = history.length;
  const bestIndex = history.reduce((m, r) => Math.max(m, r.empathyIndex), 0);
  const curChar = charById(skin.charId, "male");
  const curPet = petById(skin.petId);

  const pickChar = (id: string) => {
    setSkin({ charId: id });
    setSkinState(getSkin());
  };
  const pickPet = (id: string) => {
    setSkin({ petId: id });
    setSkinState(getSkin());
  };

  return (
    <View className="page mine">
      <View className="hd">
        <Text className="hd-title">我的</Text>
      </View>

      <View className="mi-role">
        <View className="mi-duo">
          <PixelSprite charId={curChar.id} anim="idle" size={56} />
          <PetSprite petId={curPet.id} anim="idle" size={40} />
        </View>
        <View className="mi-info">
          <Text className="mi-name">换位玩家</Text>
          <Text className="mi-rank">
            {latest ? `最近称号 · ${latest.rank}` : "还没有测试记录，去大厅开一局吧"}
          </Text>
        </View>
        <View className="btn-sm" onClick={() => Taro.switchTab({ url: "/pages/lobby/index" })}>
          去挑战 ›
        </View>
      </View>

      <View className="mi-stats">
        <View className="mi-stat stick">
          <Text className="mi-stat-v">{totalTests}</Text>
          <Text className="mi-stat-l">累计测试</Text>
        </View>
        <View className="mi-stat stick">
          <Text className="mi-stat-v">{bestIndex || "-"}</Text>
          <Text className="mi-stat-l">最高指数</Text>
        </View>
        <View className="mi-stat stick">
          <Text className="mi-stat-v">{bank.questions.length}</Text>
          <Text className="mi-stat-l">题库题目</Text>
        </View>
      </View>

      <View className="sec" style={{ marginTop: "20px" }}>
        <Text className="sec-title">换装间</Text>
        <Text className="sec-sub">分身 × 陪测精灵</Text>
      </View>

      <View className="skin-shop stick">
        <View className="skin-duo">
          <View className="skin-slot">
            <PixelSprite charId={curChar.id} anim="run" size={72} />
            <Text className="skin-name">{curChar.name}</Text>
            <Text className="skin-tag">分身 · 答题时的你</Text>
          </View>
          <Text className="skin-x">×</Text>
          <View className="skin-slot">
            <PetSprite petId={curPet.id} anim="bounce" size={60} />
            <Text className="skin-name">{curPet.name}</Text>
            <Text className="skin-tag">精灵 · 陪测搭档</Text>
          </View>
        </View>

        <Text className="skin-lab">分身池（Pixel Frog）</Text>
        <View className="skin-grid">
          {CHARS.map((c) => (
            <View
              key={c.id}
              className={`skin-cell ${curChar.id === c.id && skin.charId ? "on" : ""} ${!skin.charId && c.id === "pink-man" ? "on" : ""}`}
              onClick={() => pickChar(c.id)}
            >
              <View className="skin-cell-spr">
                <PixelSprite charId={c.id} anim="idle" size={44} />
              </View>
              <Text className="skin-cell-n">{c.name}</Text>
            </View>
          ))}
        </View>

        <Text className="skin-lab">精灵池（ShadowPets）</Text>
        <View className="skin-grid pets">
          {PETS.map((p) => (
            <View
              key={p.id}
              className={`skin-cell ${curPet.id === p.id && skin.petId ? "on" : ""} ${!skin.petId && p.id === "luna" ? "on" : ""}`}
              onClick={() => pickPet(p.id)}
            >
              <PetSprite petId={p.id} anim="idle" size={40} />
              <Text className="skin-cell-n">{p.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="sec" style={{ marginTop: "20px" }}>
        <Text className="sec-title">测试记录</Text>
        <Text className="sec-sub">仅保存在本机</Text>
      </View>

      <View className="mi-list">
        {history.length === 0 && (
          <View className="mi-empty stick">
            <Text className="fr-empty-e">🗂️</Text>
            <Text className="fr-empty-t">还没有记录，完成一次换位挑战后这里会出现</Text>
          </View>
        )}
        {history.map((r, i) => (
          <View key={r.at + i} className="mi-item stick">
            <View className="mi-item-e">{r.side === "male" ? "🙋‍♂️" : "🙋‍♀️"}</View>
            <View className="fr-info">
              <Text className="fr-name">
                {r.categoryName} · {r.rank}
              </Text>
              <Text className="fr-sub">
                {fmtDate(r.at)} · 答对 {r.correctCount}/{r.total}
              </Text>
            </View>
            <View className="mi-score">
              <Text className="mi-score-v">{r.empathyIndex}</Text>
              <Text className="mi-score-l">指数</Text>
            </View>
          </View>
        ))}
      </View>

      <View className="mi-note">
        题目均为娱乐向情境题，不代表任何群体画像；数据与皮肤仅保存在本机。 像素素材：Pixel Adventure
        (CC0) / ShadowPets (CC-BY 4.0)。
      </View>
    </View>
  );
}
