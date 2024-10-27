'use server'

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '')

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
]

export async function getGeminiResponse(prompt: string) {
  const models = ['gemini-1.5-pro-002', 'gemini-1.5-flash-002']
  let response: string | null = null
  let error: Error | null = null  // eslint-disable-next-line prefer-const

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName, safetySettings })
      const result = await model.generateContent(prompt)
      response = await result.response.text()
      break // 成功したら次のモデルは試さない
    } catch (e) {
      console.error(`${modelName} でエラーが発生しました:`, e);
      if (e instanceof Error && !e.toString().includes('quota')) {
        throw e;
      } else if (!(e instanceof Error)) {
        console.error("予期しないエラー:", e);
        throw new Error("予期しないエラーが発生しました。");
      }
      // quota制限の場合、エラーをerror変数に格納
      error = e instanceof Error ? e : new Error('quota制限エラー');
    }
  }

  if (response) {
    return response
  } else {
    throw error || new Error('応答の生成に失敗しました')
  }
}