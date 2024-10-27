'use client'

import { useState } from 'react'
import { getGeminiResponse } from './actions/gemini-api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import ReactMarkdown from 'react-markdown'
import { Cat, Book, Brain, RefreshCw, Send, Home } from 'lucide-react'

export function LanguageTrainingComponent() {
  const [question, setQuestion] = useState('')
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [stage, setStage] = useState<'title' | 'question' | 'feedback'>('title')

  const levelDescriptions = {
    '1': 'オノマトペを多用した例文を、オノマトペを使わない文章に言い換えるレベルです。',
    '2': '身近な単語の定義を説明するレベルです。',
    '3': '高度な語彙と論理的な表現力を鍛えるレベルです。',
  }

  const getQuestion = async (level: string) => {
    setIsLoading(true)
    let prompt = ''
    const explainers = [
      "新入社員", "小学校の先生",
      "祖父母", "ペットショップ店員", "ミュージシャン",
      "ホテルのフロントスタッフ", "料理人", 
    ];
    
    const listeners = [
      "先輩社員", "小学生",  "料理初心者", "一般市民",
      "非技術者の同僚", "お客様", "外国人観光客", "ファン", 
      "地域住民", "小学3年生", "孫", "初めてペットを飼う人",
      "ジム初心者", "依頼人", "車のオーナー", "家を探している人",
      "投資初心者", "大学生", "目撃者", "子供たち", "入院患者",
      "ペットの飼い主", "モデル", "施主", "音楽教室の生徒", "読者",
      "俳優", "海外からのビジネスマン", "観光客", "新婚夫婦", "友達",
    ];
    
    function getRandomExplainer() {
      const randomIndex = Math.floor(Math.random() * explainers.length);
      return explainers[randomIndex];
    }
    
    function getRandomListener() {
      const randomIndex = Math.floor(Math.random() * listeners.length);
      return listeners[randomIndex];
    }  
    
    
    if (level === '1') {
      const examples = [
        "キッチン用品：あの、シュッシュッてする、泡立てるやつ、どこにある？",
        "キッチン用品：カリカリするやつでパン切りたいんだけど…",
        "キッチン用品：トントンする、ニンニク潰すやつ貸してくれる？",
        "キッチン用品：クルクル回して胡椒かける、あのガリガリするやつ",
        "キッチン用品：冷蔵庫でカチカチになった氷をガツンと割るやつ",
        "掃除道具：床をキュッキュッって拭くやつ、新しいの買ってきてくれない？",
        "掃除道具：カーペットのゴミをゴロゴロ取る、粘着テープのついたやつ",
        "掃除道具：服のホコリをコロコロするやつ",
        "掃除道具：窓をシュッて拭くやつ",
        "工具：ギュイーンって音がする、木を切るやつ",
        "工具：釘をトンカチで打つんだけど、金槌どこ？",
        "工具：グリグリ回してネジを締めるやつ",
        "身の回りのもの：髪をパチパチ留める、黒い小さなやつ",
        "身の回りのもの：書類をパチンとまとめる、金属のやつ",
        "身の回りのもの：カバンの中でカチャカチャ音がする、鍵をまとめるやつ",
        "その他：スーパーでピッてやって会計する機械",
        "その他：公園にある、ギッコンバッタンするやつ",
        "その他：赤ちゃんがプープー鳴らす、ゴムのやつ",
        "その他：お風呂でアワアワになるやつ",
        "その他：夜、虫がブンブン飛んでくるから、パチンと叩くやつ",
        "その他：怪我した時にペタッと貼るやつ",
        "少し高度な表現：あの、ニュルニュルっと出てきて、歯をゴシゴシ磨くやつ",
        "少し高度な表現：カサカサしてる袋にパラパラ入ってるお菓子",
        "少し高度な表現：チクッと刺して、服にブスッとつけるやつ",
      ];
      
      prompt = `オノマトペを極端に多用した例文を1つ作成し、それをオノマトペを使わない文章に言い換える問題を出題してください。以下の点に注意してください：
1. 毎回異なる場面や状況を想定し、多様な例文を作成してください。
2. 使用するオノマトペは、動物の鳴き声、自然現象、人間の動作や感情など、幅広い種類から選んでください。
3. 文章の長さや複雑さにも変化をつけてください。
4. 次はオノマトペの例です。${examples}

問題文は以下の形式で出力してください：

## オノマトペ言い換え問題

次の文章のオノマトペを使わない表現に言い換えて、要約した文章にしてください：

[オノマトペを含む文章。2文程度]

回答例は出さないでください。`
} else if (level === '2') {
  prompt = `身近な単語の定義を説明する問題を1つ出題してください。以下の点に注意してください：
1. 毎回異なるカテゴリーから単語を選んでください（例：日用品、食べ物、自然現象、抽象概念など）。
2. 難易度に変化をつけ、簡単な単語から少し難しい単語まで幅広く出題してください。
3. 文化的な背景や用途、特徴など、多角的な視点から定義できる単語を選んでください。
4. 説明する人と説明される人の役職や関係性は以下の設定を使用してください：
- 説明する人: ${getRandomExplainer()}
- 説明される人: ${getRandomListener()}
5. 設定した役職や関係性に応じて、適切な言葉遣いや説明の深さを調整してください。

問題文は以下の形式で出力してください：

## 単語定義問題

あなたは${getRandomExplainer()}で、${getRandomListener()}に以下の単語を説明してください：

[単語]

回答例は出さないでください。`
    } else {
      prompt = `高度な語彙と論理的な表現力を鍛えるレベル3の問題を1つ出題してください。以下の点に注意してください：
1. 毎回異なるタイプの問題を考えてください（例：言い換え、要約、論述、比較分析など）。
2. 様々な分野や話題を扱い、幅広い知識や思考力を要する問題を作成してください。
3. 問題の難易度や複雑さに変化をつけてください。

問題文は以下の形式で出力してください：

# [問題タイプ]

[具体的な問題文]

回答例は出さないでください。また、絵や画像を使用する問題は避け、テキストのみで回答できる問題を出題してください。`
    }
    const response = await getGeminiResponse(prompt)
    setQuestion(response)
    setUserAnswer('')
    setFeedback('')
    setIsLoading(false)
    setStage('question')
  }

  const submitAnswer = async () => {
    setIsLoading(true);
    const prompt = `以下は、レベル${selectedLevel}の問題とユーザーの回答です。

問題: ${question}

ユーザーの回答: ${userAnswer}

この回答に対する評価とアドバイスを100点満点の点数とともに、以下の点に注意して記述してください。
${levelDescriptions[selectedLevel as keyof typeof levelDescriptions]}
評価は言語能力と表現力に焦点を当て、必ずマークダウン形式でお願いします。

* まず、回答の良い点を具体的に挙げて褒めてください。その際、猫の絵文字（🐱😺😸😹😻😼😽🙀😿😾）を適切に使用してください。
* 改善点がある場合は、「ここをもう少し工夫すると、さらによくなりますよ」というポジティブな表現で提案してください。
* 全体的に励ましと前向きな姿勢を維持し、ユーザーのモチベーションを高めるようなコメントを心がけてください。親しみやすく温かい雰囲気を作ってください。
* 言語表現力や語彙力を意識した具体的なアドバイスや例を提供し、ユーザーが次回さらに良い回答ができるようサポートしてください。アドバイスの際も、適切に猫の絵文字を使用して、あまり長くなりすぎないようにしてください。
* 必ず100点満点の点数を付けてください。`;


    const response = await getGeminiResponse(prompt);
    setFeedback(response);
    setIsLoading(false);
    setStage('feedback');
  };

  const renderTitleScreen = () => (
    <div className="space-y-6">
      <CardTitle className="text-3xl text-center font-bold text-primary">言語化・語彙力トレーニング 🐱</CardTitle>
      <p className="text-center text-lg">レベルを選んでトレーニングを始めましょう！</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 hover:shadow-lg transition-shadow bg-blue-50 dark:bg-blue-900">
          <CardTitle className="text-xl mb-2 flex items-center"><Cat className="mr-2" /> レベル1</CardTitle>
          <p>オノマトペを言い換えよう！</p>
          <Button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={() => { setSelectedLevel('1'); getQuestion('1'); }} disabled={isLoading}>
            スタート
          </Button>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow bg-green-50 dark:bg-green-900">
          <CardTitle className="text-xl mb-2 flex items-center"><Book className="mr-2" /> レベル2</CardTitle>
          <p>身近な単語を説明しよう！</p>
          <Button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={() => { setSelectedLevel('2'); getQuestion('2'); }} disabled={isLoading}>
            スタート
          </Button>
        </Card>
        <Card className="p-4 hover:shadow-lg transition-shadow bg-purple-50 dark:bg-purple-900">
          <CardTitle className="text-xl mb-2 flex items-center"><Brain className="mr-2" /> レベル3</CardTitle>
          <p>高度な表現力を鍛えよう！</p>
          <Button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={() => { setSelectedLevel('3'); getQuestion('3'); }} disabled={isLoading}>
            スタート
          </Button>
        </Card>
      </div>
    </div>
  )

  const renderQuestionScreen = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-2xl text-primary">問題 (レベル{selectedLevel}) 🤔</h3>
      <Card className="p-6 bg-yellow-50 dark:bg-yellow-900 shadow-md">
        <ReactMarkdown className="prose dark:prose-invert max-w-none text-lg">
          {question}
        </ReactMarkdown>
      </Card>
      <div className="space-y-2">
        <Textarea
          placeholder="ここに回答を入力してください"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          rows={6}
          className="text-lg p-4"
        />
        <p className="text-sm text-muted-foreground text-right">
          文字数: {userAnswer.length}
        </p>
      </div>
      <div className="flex justify-between">
        <Button onClick={() => getQuestion(selectedLevel!)} disabled={isLoading} className="flex items-center bg-green-500 hover:bg-green-600 text-white">
          <RefreshCw className="mr-2 h-4 w-4" /> 新しい問題
        </Button>
        <Button onClick={submitAnswer} disabled={isLoading || !userAnswer} className="flex items-center bg-purple-500 hover:bg-purple-600 text-white">
          <Send className="mr-2 h-4 w-4" /> 回答を送信
        </Button>
      </div>
    </div>
  )

  const renderFeedbackScreen = () => (
    <div className="space-y-4">
      <h3 className="font-semibold text-2xl text-primary">フィードバック 😺</h3>
      <Card className="p-6 bg-green-50 dark:bg-green-900 shadow-md">
        <ReactMarkdown className="prose dark:prose-invert max-w-none text-lg">
          {feedback}
        </ReactMarkdown>
      </Card>
      <div className="flex justify-between">
        <Button onClick={() => getQuestion(selectedLevel!)} disabled={isLoading} className="flex items-center bg-green-500 hover:bg-green-600 text-white">
          <RefreshCw className="mr-2 h-4 w-4" /> 新しい問題
        </Button>
        <Button onClick={() => setStage('title')} className="flex items-center bg-gray-500 hover:bg-gray-600 text-white">
          <Home className="mr-2 h-4 w-4" /> タイトルに戻る
        </Button>
      </div>
    </div>
  )

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardContent className="p-6 space-y-6">
        {stage === 'title' && renderTitleScreen()}
        {stage === 'question' && renderQuestionScreen()}
        {stage === 'feedback' && renderFeedbackScreen()}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground bg-muted p-4 rounded-b-lg">
        <Cat className="mr-2 h-4 w-4" /> このアプリケーションはGemini APIを使用しています
      </CardFooter>
    </Card>
  )
}