import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/app/lib/ai/providers";

export const runtime = "nodejs";
export const maxDuration = 60;

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatBody {
  provider?: string;
  model?: string;
  messages?: ChatMessage[];
  temperature?: number;
  /** when true, ask the model for a JSON object response */
  json?: boolean;
}

export async function POST(req: NextRequest) {
  let body: ChatBody;
  try {
    body = (await req.json()) as ChatBody;
  } catch {
    return NextResponse.json({ error: "请求体不是合法 JSON" }, { status: 400 });
  }

  const { provider: providerId, model, messages, temperature, json } = body;

  if (!providerId) return NextResponse.json({ error: "缺少 provider" }, { status: 400 });
  if (!messages?.length) return NextResponse.json({ error: "缺少 messages" }, { status: 400 });

  const provider = getProvider(providerId);
  if (!provider) {
    return NextResponse.json({ error: `未知的 AI 服务商：${providerId}` }, { status: 400 });
  }

  // Key comes from the browser (localStorage) via header — never persisted server-side.
  const apiKey =
    req.headers.get("x-ai-key") ||
    process.env[`${providerId.toUpperCase()}_API_KEY`] ||
    "";

  if (!apiKey) {
    return NextResponse.json(
      { error: `${provider.name} API Key 未配置，请在右上角「AI 设置」中填写` },
      { status: 401 }
    );
  }

  const payload: Record<string, unknown> = {
    model: model || provider.defaultModel,
    messages,
    temperature: temperature ?? 0.7,
    stream: false,
  };
  if (json) payload.response_format = { type: "json_object" };

  try {
    const res = await fetch(`${provider.baseUrl}${provider.chatPath}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    if (!res.ok) {
      return NextResponse.json(
        { error: `${provider.name} ${res.status}: ${text.slice(0, 500)}` },
        { status: res.status }
      );
    }

    const data = JSON.parse(text);
    const content: string = data?.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ content, raw: data });
  } catch (e) {
    return NextResponse.json({ error: `请求 ${provider.name} 失败：${String(e)}` }, { status: 502 });
  }
}
