export default defineAppConfig({
  pages: [
    "pages/lobby/index",
    "pages/friends/index",
    "pages/mine/index",
    "pages/quiz/index",
    "pages/result/index",
  ],
  window: {
    backgroundTextStyle: "dark",
    backgroundColor: "#0A0812",
    navigationBarBackgroundColor: "#0A0812",
    navigationBarTitleText: "TA 的世界",
    navigationBarTextStyle: "white",
  },
  tabBar: {
    color: "#6B6480",
    selectedColor: "#FF7BB0",
    backgroundColor: "#14111F",
    borderStyle: "black",
    list: [
      { pagePath: "pages/lobby/index", text: "大厅" },
      { pagePath: "pages/friends/index", text: "好友" },
      { pagePath: "pages/mine/index", text: "我的" },
    ],
  },
});
