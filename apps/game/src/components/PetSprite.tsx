import { Image } from "@tarojs/components";
import { petById, type PetAnim } from "@/skins";
import { useMemo } from "react";

interface Props {
  petId?: string | null;
  anim: PetAnim;
  size?: number;
}

/** 陪测精灵：GIF 逐帧播放，双端 <Image> 均支持动图。tick 变化时强制重播。 */
export default function PetSprite({ petId, anim, size = 84 }: Props) {
  const pet = petById(petId);
  const src = useMemo(() => pet.gifs[anim], [pet, anim]);
  return (
    <Image
      key={`${pet.id}-${anim}-${src}`}
      src={src}
      style={{ width: `${size}px`, height: `${size}px` }}
      mode="aspectFit"
    />
  );
}
