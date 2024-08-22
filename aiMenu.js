const { OpenAIClient, AzureKeyCredential } = require("@azure/openai");
const axios = require('axios');

const endpoint = process.env["AZURE_OPENAI_ENDPOINT"];
const azureApiKey = process.env["AZURE_OPENAI_API_KEY"];
const deploymentId = process.env["AZURE_OPENAI_DEPLOYMENT_ID"];
const searchEndpoint = process.env["AZURE_AI_SEARCH_ENDPOINT"];
const searchKey = process.env["AZURE_AI_SEARCH_API_KEY"];
const searchIndex = process.env["AZURE_AI_SEARCH_INDEX"];

const userInputs = {};

const handleAIMenu = async (event, client) => {
  const userId = event.source.userId;
  const message = event.message.text;

  if (message === 'AIメニュー') {
    userInputs[userId] = { step: 1 };
    await client.replyMessage(event.replyToken, {
      type: "text",
      text: "希望金額を教えてください。",
      quickReply: {
        items: [
          {
            type: "action",
            action: {
              type: "message",
              label: "200円",
              text: "200"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "300円",
              text: "300"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "400円",
              text: "400"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "500円",
              text: "500"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "600円",
              text: "600"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "700円",
              text: "700"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "800円",
              text: "800"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "900円",
              text: "900"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "1000円",
              text: "1000"
            }
          },
          {
            type: "action",
            action: {
              type: "message",
              label: "1100円",
              text: "1100"
            }
          }
        ]
      }
    });
    return;
  }

  if (userInputs[userId]) {
    switch (userInputs[userId].step) {
      case 1:
        userInputs[userId].budget = message;
        userInputs[userId].step = 2;
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: "エネルギー、バランス、たんぱく質、脂質、炭水化物から重視しているものを選択してください。",
          quickReply: {
            items: [
              {
                type: "action",
                action: {
                  type: "message",
                  label: "エネルギー",
                  text: "エネルギー"
                }
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "バランス",
                  text: "バランス"
                }
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "たんぱく質",
                  text: "たんぱく質"
                }
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "脂質",
                  text: "脂質"
                }
              },
              {
                type: "action",
                action: {
                  type: "message",
                  label: "炭水化物",
                  text: "炭水化物"
                }
              }
            ]
          }
        });
        return;
      case 2:
        userInputs[userId].priority = message;
        userInputs[userId].step = 3;
        await client.replyMessage(event.replyToken, {
          type: "text",
          text: "その他に希望すること（例：ベジタリアン、低カロリーなど）がありますか？"
        });
        return;
      case 3:
        userInputs[userId].additionalPreferences = message;
        await showLoadingAnimation(event.replyToken, userId);
        await generateMenuRecommendation(userId, event.replyToken, client);
        return;
      default:
        delete userInputs[userId];
    }
  }
};

const showLoadingAnimation = async (replyToken, userId) => {
  const url = 'https://api.line.me/v2/bot/chat/loading/start';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`
  };
  const data = {
    chatId: userId,
    loadingSeconds: 15  // アニメーション表示時間
  };

  try {
    await axios.post(url, data, { headers });
  } catch (error) {
    console.error('Error showing loading animation:', error);
  }
};

const generateMenuRecommendation = async (userId, replyToken, client) => {
  const { budget, priority, additionalPreferences } = userInputs[userId];
  const openaiClient = new OpenAIClient(endpoint, new AzureKeyCredential(azureApiKey));

  const messages = [
    {
      role: "user",
      content: `あなたはAIアシスタントです。大学のカフェテリアのメニューからお客さんの条件に合わせて、おすすめの料理を選んでください。条件は、${budget}円にできるだけ近い金額で、${priority}を重視した栄養が取れるメニューを推薦し、${additionalPreferences}という追加の希望も考慮してください。その提案の理由も簡単に説明してください。`
    },
  ];

  const events = await openaiClient.streamChatCompletions(deploymentId, messages, {
    maxTokens: 700,
    azureExtensionOptions: {
      extensions: [
        {
          type: "AzureCognitiveSearch",
          parameters: {
            endpoint: searchEndpoint,
            key: searchKey,
            indexName: searchIndex,
          },
        },
      ],
    },
  });

  let response = "";
  for await (const event of events) {
    for (const choice of event.choices) {
      const newText = choice.delta?.content;
      if (!!newText) {
        response += newText;
      }
    }
  }

  const aiResponse = {
    "type": "flex",
    "altText": "AI Response",
    "contents": {
      "type": "bubble",
      "body": {
        "type": "box",
        "layout": "vertical",
        "contents": [
          {
            "type": "text",
            "text": "AI Response",
            "weight": "bold",
            "size": "xl",
            "margin": "md"
          },
          {
            "type": "text",
            "text": response,
            "wrap": true,
            "size": "md",
            "margin": "md"
          }
        ]
      },
      "styles": {
        "body": {
          "backgroundColor": "#F0F8FF",
          "separator": true,
          "separatorColor": "#C0C0C0"
        }
      }
    }
  };

  await client.pushMessage(userId, aiResponse);
  delete userInputs[userId];
};

module.exports = { handleAIMenu, showLoadingAnimation, generateMenuRecommendation, userInputs };
