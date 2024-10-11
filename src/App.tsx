import React, { useState } from 'react';
import { Send, Plus } from 'lucide-react';
import ChatPopup from './components/ChatPopup';

interface Result {
  企业标准: string;
  行业标准: string;
  国际标准: string;
}

function App() {
  const [question, setQuestion] = useState('');
  const [results, setResults] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeChat, setActiveChat] = useState<keyof Result | null>(null);

  const handleRun = async () => {
    setLoading(true);

    // Simulating API calls to three different standards
    const mockApiCall = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return `针对 "${question}" 的结果`;
    };

    try {
      const [resultA, resultB, resultC] = await Promise.all([
        mockApiCall(),
        mockApiCall(),
        mockApiCall()
      ]);

      setResults({ 企业标准: resultA, 行业标准: resultB, 国际标准: resultC });
    } catch (error) {
      console.error('获取结果时出错:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAskMore = (test: keyof Result) => {
    setActiveChat(test);
  };

  const handleExampleClick = (example: string) => {
    setQuestion(example);
  };

  const exampleQuestions = [
    "如何优化代码性能？",
    "什么是敏捷开发方法论？",
    "如何确保代码安全性？"
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">研发质量助手</h1>
        
        <div className="mb-4">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="输入要查询的问题"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="mb-4 flex justify-center">
          <button
            onClick={handleRun}
            disabled={loading || !question.trim()}
            className="bg-blue-500 text-white px-8 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? '查询中...' : (
              <>
                查询 <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </div>

        <div className="mb-6 flex justify-center space-x-4">
          {exampleQuestions.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 text-sm"
            >
              示例 {index + 1}
            </button>
          ))}
        </div>
        
        <div className="space-y-4">
          {(['企业标准', '行业标准', '国际标准'] as const).map((test) => (
            <div key={test} className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">{test}</h2>
              <div className="mb-2 whitespace-pre-wrap">
                {results?.[test] || '-'}
              </div>
              {results?.[test] && (
                <button
                  onClick={() => handleAskMore(test)}
                  className="mt-2 bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center text-sm"
                >
                  深入询问 <Plus className="ml-1 h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {activeChat && results && (
        <ChatPopup
          test={activeChat}
          onClose={() => setActiveChat(null)}
          initialMessage={results[activeChat]}
        />
      )}
    </div>
  );
}

export default App;