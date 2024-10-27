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
  let error: Error | null = null

  for (const modelName of models) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName, safetySettings })
      const result = await model.generateContent(prompt)
      response = await result.response.text()
      break // 成功したら次のモデルは試さない
    } catch (e) {
      error = e as Error
      console.error(`${modelName} でエラーが発生しました:`, e)
      // エラーが使用制限に関するものでない場合は、即座にエラーを投げる
      if (!e.toString().includes('quota')) {
        throw e
      }
      // 使用制限エラーの場合は次のモデルを試す
    }
  }

  if (response) {
    return response
  } else {
    console.error('すべてのモデルでエラーが発生しました')
    throw error || new Error('応答の生成に失敗しました')
  }
}