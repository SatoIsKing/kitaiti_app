async function analyzeData() {
    // APIキーはここに記入してください
    const GEMINI_API_KEY = "APiキーを入れる";
    
    const model = document.getElementById('modelName').value;
    const game = document.getElementById('gameCount').value;
    const info = document.getElementById('summary').value;

    if(!model || !game) {
        alert("機種名とゲーム数を、どうぞお教えくださいなー。");
        return;
    }

    const resultArea = document.getElementById('resultArea');
    const resultText = document.getElementById('resultText');
    resultArea.style.display = 'block';
    resultText.innerText = "ただいま、神託を仰いでおります……。";

    const prompt = `あなたはパチスロ期待値の専門家です。
以下の状況を分析し、期待値の有無と、打つべきかどうかの結論を、理由を添えて短く教えてください。
機種名: ${model}
現在のゲーム数: ${game}
補足状況: ${info}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        // ここが重要でございます！
        if (data.error) {
            resultText.innerText = "Google様からエラーが届きましたー：「" + data.error.message + "」";
            console.error("詳細:", data.error);
            return;
        }

        if (data.candidates && data.candidates[0]) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            resultText.innerText = aiResponse;
        } else {
            resultText.innerText = "返事の形が予想と違っているようです。中身：" + JSON.stringify(data);
        }
    } catch (error) {
        // エラーの内容を画面にそのまま表示します
        resultText.innerText = "神託が届きませぬ…。「" + error.message + "」と申しております。";
        console.error("詳細エラー:", error);
    }
}