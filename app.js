const express = require("express");
const line = require("@line/bot-sdk");
const dotenv = require("dotenv");

// .envファイルの内容を読み込む
dotenv.config();
const app = express();

// 環境変数を定義
const port = process.env.PORT || 8081;
const channelAccessToken = process.env.CHANNEL_ACCESS_TOKEN;
const channelSecret = process.env.CHANNEL_SECRET;

if (!channelAccessToken || !channelSecret) {
  console.error("Error: CHANNEL_ACCESS_TOKEN and CHANNEL_SECRET must be set in .env file");
  process.exit(1);
}

const lineConfig = {
  channelAccessToken: channelAccessToken,
  channelSecret: channelSecret,
};

const client = new line.Client(lineConfig);
const middleware = line.middleware(lineConfig);

// スクレイピング関数とAIメニュー関数のインポート
const { handleCrowdedStatus } = require('./crowdedStatus');
const { handleAIMenu, userInputs } = require('./aiMenu');

app.post("/webhook", middleware, (req, res, next) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => next(err));
});

const handleEvent = async (event) => {
  if (event.type === "message" && event.message.type == "text") {
    const message = event.message.text;
    const userId = event.source.userId;

    if (message.toLowerCase() === '混雑状況') {
      await handleCrowdedStatus(event, client);
      return;
    }

    if (message === 'AIメニュー' || userInputs[userId]) {
      await handleAIMenu(event, client);
      return;
    }

    await client.replyMessage(event.replyToken, {
      type: "text",
      text: message,
    });
  }
};

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});