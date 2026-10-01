import { useState } from "react";
import { Input, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import PetSprite from "@/components/PetSprite";
import { getSkin } from "@/skins";
import { DEMO_FRIENDS } from "../../data/friends";
import { getFriendCode } from "../../store";
import "./index.scss";

export default function Friends() {
  const [code] = useState(getFriendCode);
  const [kw, setKw] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [addCode, setAddCode] = useState("");
  const skin = getSkin();

  const list = DEMO_FRIENDS.filter((f) => !kw || f.name.includes(kw));

  const toast = (title: string) => Taro.showToast({ title, icon: "none", duration: 1800 });

  const copyCode = () => {
    Taro.setClipboardData({
      data: code,
      success: () => toast("好友码已复制"),
      fail: () => toast(`好友码：${code}`),
    });
  };

  const doAdd = () => {
    if (!addCode.trim()) {
      toast("先输入好友码哦");
      return;
    }
    setAddOpen(false);
    setAddCode("");
    toast("演示版本：好友关系即将上线");
  };

  return (
    <View className="page friends">
      <View className="hd">
        <Text className="hd-title">好友</Text>
        <View className="btn-sm" onClick={() => setAddOpen(true)}>
          + 添加
        </View>
      </View>

      <View className="fr-code stick">
        <View className="fr-code-l">
          <Text className="fr-code-lab">我的换位好友码</Text>
          <Text className="fr-code-v">{code}</Text>
        </View>
        <View className="fr-code-r">
          <PetSprite petId={skin.petId} anim="greet" size={52} />
          <View className="btn-sm" onClick={copyCode}>
            复制
          </View>
        </View>
      </View>

      <View className="fr-invite">
        <Text className="fr-invite-t">🤝 邀请好友对测同一题包</Text>
        <Text className="fr-invite-p">你答 TA 的视角、TA 答你的视角，互相打分后再比比默契值</Text>
      </View>

      <View className="sec" style={{ marginTop: "20px" }}>
        <Text className="sec-title">已加入的好友</Text>
        <Text className="sec-sub">演示数据</Text>
      </View>

      <View className="fr-search stick">
        <Text className="fr-search-ico">🔍</Text>
        <Input
          className="fr-search-i"
          placeholder="搜索好友昵称"
          placeholderClass="fr-search-ph"
          value={kw}
          onInput={(e) => setKw(e.detail.value)}
        />
      </View>

      <View className="fr-list">
        {list.length === 0 && (
          <View className="fr-empty">
            <Text className="fr-empty-e">🫥</Text>
            <Text className="fr-empty-t">没有找到「{kw}」</Text>
          </View>
        )}
        {list.map((f, i) => (
          <View key={f.name} className={`fr-item stick ${i % 2 ? "tilt-r" : "tilt-l"}`}>
            <View className="fr-ava">{f.emoji}</View>
            <View className="fr-info">
              <Text className="fr-name">{f.name}</Text>
              <Text className="fr-sub">上次测试 · {f.lastTest}</Text>
            </View>
            <View className="fr-match">
              <Text className="fr-match-v">{f.match}%</Text>
              <Text className="fr-match-l">默契</Text>
            </View>
          </View>
        ))}
      </View>

      {addOpen && (
        <View className="sheetbg" onClick={() => setAddOpen(false)}>
          <View className="sheet" onClick={(e) => e.stopPropagation()}>
            <View className="handle" />
            <Text className="sheet-title">添加好友</Text>
            <Text className="sheet-sub">输入对方的 6 位换位好友码，互相解锁对测记录</Text>
            <Input
              className="fr-add-i"
              placeholder="例如 A7K2P9"
              placeholderClass="fr-search-ph"
              value={addCode}
              onInput={(e) => setAddCode(e.detail.value.toUpperCase())}
              maxlength={6}
            />
            <View className="btn" onClick={doAdd}>
              确认添加
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
