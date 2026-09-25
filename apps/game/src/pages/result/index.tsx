import { Button, Text, View } from "@tarojs/components";
import Taro, { useShareAppMessage } from "@tarojs/taro";
import { gameStore, startSession } from "../../store";
import "./index.scss";

const IS_WEAPP = process.env.TARO_ENV === "weapp";

export default function Result() {
  const session = gameStore.session;

  // 小程序转发分享（H5 端该 hook 不生效，走按钮降级）
  useShareAppMessage(() => ({
    title: session
      ? `我的共情指数 ${session.empathyIndex}%，称号「${session.rank}」——你有多懂 TA？`
      : "来测测你有多懂 TA 的世界！",
    path: "/pages/home/index",
  }));

  if (!session) {
    return (
      <View className="page result">
        <Button className="btn-primary" onClick={() => Taro.reLaunch({ url: "/pages/home/index" })}>
          回到首页
        </Button>
      </View>
    );
  }

  const share = async () => {
    const text = `我在《TA 的世界》共情指数 ${session.empathyIndex}%，称号「${session.rank}」，你敢来换位挑战吗？`;
    if (IS_WEAPP) {
      Taro.showToast({ title: "点右上角「···」转发给好友", icon: "none" });
      return;
    }
    try {
      const nav = navigator as Navigator & { share?: (d: { text: string }) => Promise<void> };
      if (nav.share) {
        await nav.share({ text });
      } else {
        await navigator.clipboard.writeText(`${text} ${location.href}`);
        Taro.showToast({ title: "战绩已复制，去粘贴分享吧", icon: "none" });
      }
    } catch {
      // 用户取消分享，静默
    }
  };

  const again = () => {
    startSession(session.side);
    Taro.redirectTo({ url: "/pages/quiz/index" });
  };

  return (
    <View className="page result">
      <View className="result__ring">
        <Text className="result__index">{session.empathyIndex}</Text>
        <Text className="result__index-label">共情指数</Text>
      </View>

      <Text className="result__rank">「{session.rank}」</Text>
      <Text className="result__stats">
        答对 {session.correctCount}/{session.questions.length} 题 · 得分 {session.score}
      </Text>

      <View className="result__actions">
        <Button className="btn-primary" onClick={share}>
          分享战绩
        </Button>
        <Button className="btn-ghost" onClick={again}>
          再来一局（换一批题）
        </Button>
        <Text className="result__home" onClick={() => Taro.reLaunch({ url: "/pages/home/index" })}>
          回到首页
        </Text>
      </View>
    </View>
  );
}
