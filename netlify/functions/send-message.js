exports.handler = async (event) => {
  const headers = { "Content-Type": "application/json" };

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Only POST allowed" }) };
  }

  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: "Server not configured" }) };
    }

    const body = JSON.parse(event.body || "{}");
    const text = String(body.text || "").trim().slice(0, 1000);

    if (!text) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Message empty" }) };
    }

    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: text })
    });

    if (!res.ok) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: "Telegram failed" }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (error) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: "Server error" }) };
  }
};
