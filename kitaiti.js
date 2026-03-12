// 【重要】APIキーはここには書きません。Vercelの裏側で安全に処理されます。

async function analyzeData() {
    const inputData = document.getElementById('inputData').value;
    const resultText = document.getElementById('resultText');

    if (!inputData) {
        resultText.innerText = "データが入力されておりませぬ。何かお書き込みくださいー。";
        return;
    }

    resultText.innerText = "ただいま、神託を仰いでおります……少々お待ちを……。";

    const prompt = `
以下のスロットの履歴データから、現在の期待値を分析し、
「押し時」か「引き時」かを理由と共に簡潔に教えてください。
また、設定推測についても一言添えてくださいね。

データ：
${inputData}
`;

    try {
        // 直接Googleに聞くのではなく、Vercel内に作った「/api/generate」という窓口に頼みます
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) {
            throw new Error(`サーバーからの返事が芳しくありません（Status: ${response.status}）`);
        }

        const data = await response.json();

        // Googleからのエラーが混じっていないか確認します
        if (data.error) {
            resultText.innerText = "Google様よりエラーが届きましたー：「" + data.error.message + "」";
            return;
        }

        // 無事にAIの言葉が届いているか確認します
        if (data.candidates && data.candidates[0] && data.candidates[0].content.parts[0]) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            resultText.innerText = aiResponse;
        } else {
            resultText.innerText = "神託の形が読み取れませんでした……。中身を確認いたします。";
            console.log("受信データ:", data);
        }

    } catch (error) {
        console.error("通信エラー:", error);
        resultText.innerText = "通信に失敗いたしましたー。インターネットの繋がりや、Vercelの設定をご確認くださいませ。";
    }
}