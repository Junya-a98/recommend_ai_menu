# ソフトバンク共同ハッカソン
龍谷大学ハッカソンプロジェクト

概要

今回スマートキャンパスという題材でハッカソンに取り組みました。この題材から私たちは必要な情報を手軽に知れるシステムの開発を行いました。  作成したシステム

AzureとLINE APIを活用して、龍谷大学のウェブサイトから取得した混雑状況をユーザーに提供するシステムを作成しました。また本システムは、龍谷大学のウェブサイトから大学の食堂メニューを取得して、それをもとにAIによって推奨メニューをLINEで受け取ることができるようなシステムを作成しました。

混雑状況のシステムアーキテクチャ図は次の図に示します。
![image](https://github.com/user-attachments/assets/7b772805-cb69-404f-a52b-d3aee875e2cd)
このプロジェクトは、以下のAzureサービスとその他のツールを使用して構築されています:
Azure Functions: 龍谷大学のウェブサイトから混雑状況とメニュー情報をスクレイピングし、データを取得・加工します。
Azure Blob Storage: 取得・加工されたデータを保存します。
Azure OpenAI: 保存されたメニュー情報を基に、推奨メニューを生成します。
Azure Cognitive Search: データをインデックス化し、ユーザーからのクエリに基づいて情報を検索します。
ngrok: ローカル環境で動作するサーバーを外部からアクセス可能にし、AzureサービスとLINE APIを繋ぎます。
LINE Messaging API: ユーザーからの質問を受け取り、生成された回答を提供します。
データフロー
データ取得: Azure Functionsを使って、龍谷大学のウェブサイトから混雑状況とメニュー情報をスクレイピングします。
データ保存: Azure Blob Storageにデータを保存します。
クエリ生成: ユーザーからのクエリを受け取り、Azure OpenAIで適切な検索クエリを生成します。
情報検索: Azure Cognitive Searchを使用して、保存されたデータから関連情報を検索します。
推奨メニュー生成: Azure OpenAIで検索結果を基に、条件に合ったメニューを推薦します。
LINE通知: 最終的に、推奨メニューと混雑状況をLINE APIを通じてユーザーに通知します。
使用技術
Azure Functions
Azure Blob Storage
Azure OpenAI
Azure Cognitive Search
ngrok
LINE Messaging API
プロンプト例
plaintext
コードをコピーする
あなたはAIアシスタントです。大学のカフェテリアのメニューからお客さんの条件に合わせて、おすすめの料理を選んでください。条件は、600円にできるだけ近い金額で、エネルギーを重視した栄養が取れるメニューを推薦し、ベジタリアンという追加の希望も考慮してください。その提案の理由も簡単に説明してください。ただし回答は600字以内でお願いします。
インストールとセットアップ
リポジトリをクローンします:
bash
コードをコピーする
git clone https://github.com/your-repo/eggplant.git
必要なAzureサービスを設定し、ngrokをインストールします。
ローカル環境でサーバーを起動し、ngrokで外部アクセスを可能にします。
ライセンス
本プロジェクトはMITライセンスのもとで公開されています。詳細はLICENSEファイルを参照してください。

開発者
あなたの名前
連絡先
プロジェクトに関する質問や提案がありましたら、上記の連絡先までご連絡ください。
