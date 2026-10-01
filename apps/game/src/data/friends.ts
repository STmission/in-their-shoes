/** 好友页演示数据 —— 原型态，非真实好友关系，正式版走服务端。 */
export interface DemoFriend {
  name: string;
  emoji: string;
  lastTest: string;
  match: number;
}

export const DEMO_FRIENDS: DemoFriend[] = [
  { name: "小鹿", emoji: "🦌", lastTest: "约会现场 · 知心姐姐", match: 86 },
  { name: "阿哲", emoji: "🐯", lastTest: "暧昧心事 · 读心大师", match: 78 },
  { name: "Momo", emoji: "🐱", lastTest: "荧幕情感 · 默契养成中", match: 71 },
  { name: "老周", emoji: "🐻", lastTest: "未来蓝图 · 火星来客", match: 54 },
];
