const { scrapeCrowdedStatus } = require('./scraper');

const handleCrowdedStatus = async (event, client) => {
  const { fukakusa_titles, fukakusa_statuses, seta_titles, seta_statuses, omiya_titles, omiya_statuses } = await scrapeCrowdedStatus();
  
  const flexMessage = {
    type: "flex",
    altText: "キャンパス混雑状況",
    contents: {
      type: "carousel",
      contents: [
        // 深草キャンパス
        {
          type: "bubble",
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "image",
                url: "https://www.ryukoku.ac.jp/campus/images/features/nav-feature01.jpg",
                size: "full",
                aspectMode: "cover",
                aspectRatio: "2:3",
                gravity: "top"
              },
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "box",
                    layout: "vertical",
                    contents: [
                      {
                        type: "text",
                        text: "深草キャンパス",
                        size: "xl",
                        color: "#ffffff",
                        weight: "bold"
                      }
                    ]
                  },
                  ...fukakusa_titles.map((title, index) => ({
                    type: "box",
                    layout: "baseline",
                    contents: [
                      {
                        type: "text",
                        text: title,
                        color: "#ebebeb",
                        size: "sm",
                        flex: 0
                      },
                      {
                        type: "text",
                        text: fukakusa_statuses[index],
                        color: "#ffffffcc",
                        size: "sm",
                        margin: "none",
                        align: "end"
                      }
                    ],
                    spacing: "lg"
                  }))
                ],
                position: "absolute",
                offsetBottom: "0px",
                offsetStart: "0px",
                offsetEnd: "0px",
                backgroundColor: "#03303Acc",
                paddingAll: "20px",
                paddingTop: "18px",
                height: "230px"
              }
            ],
            paddingAll: "0px"
          }
        },
        // 瀬田キャンパス
        {
          type: "bubble",
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "image",
                url: "https://www.ryukoku.ac.jp/campus/images/features/nav-feature02.jpg",
                size: "full",
                aspectMode: "cover",
                aspectRatio: "2:3",
                gravity: "top"
              },
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "box",
                    layout: "vertical",
                    contents: [
                      {
                        type: "text",
                        text: "瀬田キャンパス",
                        size: "xl",
                        color: "#ffffff",
                        weight: "bold"
                      }
                    ]
                  },
                  ...seta_titles.map((title, index) => ({
                    type: "box",
                    layout: "baseline",
                    contents: [
                      {
                        type: "text",
                        text: title,
                        color: "#ebebeb",
                        size: "sm",
                        flex: 0
                      },
                      {
                        type: "text",
                        text: seta_statuses[index],
                        color: "#ffffffcc",
                        size: "sm",
                        margin: "none",
                        align: "end"
                      }
                    ],
                    spacing: "lg"
                  }))
                ],
                position: "absolute",
                offsetBottom: "0px",
                offsetStart: "0px",
                offsetEnd: "0px",
                backgroundColor: "#9C8E7Ecc",
                paddingAll: "20px",
                paddingTop: "18px",
                height: "230px"
              }
            ],
            paddingAll: "0px"
          }
        },
        // 大宮キャンパス
        {
          type: "bubble",
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "image",
                url: "https://www.ryukoku.ac.jp/campus/images/features/nav-feature03.jpg",
                size: "full",
                aspectMode: "cover",
                aspectRatio: "2:3",
                gravity: "top"
              },
              {
                type: "box",
                layout: "vertical",
                contents: [
                  {
                    type: "box",
                    layout: "vertical",
                    contents: [
                      {
                        type: "text",
                        text: "大宮キャンパス",
                        size: "xl",
                        color: "#ffffff",
                        weight: "bold"
                      }
                    ]
                  },
                  ...omiya_titles.map((title, index) => ({
                    type: "box",
                    layout: "baseline",
                    contents: [
                      {
                        type: "text",
                        text: title,
                        color: "#ebebeb",
                        size: "sm",
                        flex: 0
                      },
                      {
                        type: "text",
                        text: omiya_statuses[index],
                        color: "#ffffffcc",
                        size: "sm",
                        margin: "none",
                        align: "end"
                      }
                    ],
                    spacing: "lg"
                  }))
                ],
                position: "absolute",
                offsetBottom: "0px",
                offsetStart: "0px",
                offsetEnd: "0px",
                backgroundColor: "#9C8E7Ecc",
                paddingAll: "20px",
                paddingTop: "18px",
                height: "230px"
              }
            ],
            paddingAll: "0px"
          }
        }
      ]
    }
  };

  await client.replyMessage(event.replyToken, flexMessage);
};

module.exports = { handleCrowdedStatus };
