import { Image, View } from "@tarojs/components";
import { ANIMS, charById, type SpriteAnim } from "@/skins";
import type { Side } from "@game/core";
import "./PixelSprite.scss";

interface Props {
  charId?: string | null;
  side?: Side;
  anim: SpriteAnim;
  /** 展示尺寸（px）。帧源为 128px，缩放仅缩小，双端清晰。 */
  size?: number;
}

/**
 * 像素分身帧动画：裁剪容器 + 帧表 Image 条带 + translateX steps()。
 * 双端通用（wxss 支持 transform keyframes），不依赖 image-rendering。
 */
export default function PixelSprite({ charId, side = "male", anim, size = 96 }: Props) {
  const skin = charById(charId, side);
  const def = ANIMS[anim];
  return (
    <View className="pxs" style={{ width: `${size}px`, height: `${size}px` }}>
      <Image
        key={`${skin.id}-${anim}`}
        src={skin.sheets[anim]}
        className={`pxs-strip a-${anim}`}
        style={{
          width: `${def.frames * size}px`,
          height: `${size}px`,
          animationDuration: `${def.dur}s`,
        }}
        mode="widthFix"
      />
    </View>
  );
}
