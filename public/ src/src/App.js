import React, { useState } from 'react';
import { 
  Bold, Italic, Type, Hash, AtSign, Sparkles, Eye, Copy, 
  Moon, Sun, Zap, Instagram, 
  Linkedin, Twitter, Facebook, Send, Plus, Wand2
} from 'lucide-react';

const CopywritingSuite = () => {
  const [content, setContent] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showAI, setShowAI] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [generatedHashtags, setGeneratedHashtags] = useState([]);
  const [showHashtags, setShowHashtags] = useState(false);

  const platforms = {
    instagram: { name: 'Instagram', icon: Instagram, limit: 2200, color: '#E4405F' },
    linkedin: { name: 'LinkedIn', icon: Linkedin, limit: 3000, color: '#0077B5' },
    twitter: { name: 'Twitter/X', icon: Twitter, limit: 280, color: '#1DA1F2' },
    tiktok: { name: 'TikTok', icon: Type, limit: 2200, color: '#000000' },
    facebook: { name: 'Facebook', icon: Facebook, limit: 63206, color: '#1877F2' },
    whatsapp: { name: 'WhatsApp', icon: Send, limit: 65536, color: '#25D366' }
  };

  const templates = [
    {
      id: 1,
      category: 'Hooks',
      title: 'Hook de Problema',
      content: '❌ ¿Te pasa que...?\n\n[Describe el problema]\n\n✅ Aquí te digo cómo solucionarlo:\n\n[Tu solución]',
      tags: ['problema', 'solución', 'engagement']
    },
    {
      id: 2,
      category: 'Storytelling',
      title: 'Historia Personal',
      content: '🎬 Historia real:\n\nHace [tiempo] yo [situación inicial]...\n\nPero todo cambió cuando [momento clave].\n\nAhora [resultado actual].\n\n💡 La lección: [aprendizaje]',
      tags: ['historia', 'personal', 'inspiración']
    },
    {
      id: 3,
      category: 'Tips',
      title: 'Lista de Consejos',
      content: '📚 [Número] tips para [objetivo]:\n\n1️⃣ [Tip 1]\n2️⃣ [Tip 2]\n3️⃣ [Tip 3]\n4️⃣ [Tip 4]\n5️⃣ [Tip 5]\n\n¿Cuál vas a probar primero? 👇',
      tags: ['tips', 'lista', 'educativo']
    },
    {
      id: 4,
      category: 'CTA',
      title: 'Llamada a la Acción',
      content: '🔥 [Beneficio principal]\n\n✨ Esto es lo que obtienes:\n• [Beneficio 1]\n• [Beneficio 2]\n• [Beneficio 3]\n\n👆 ¡Dale like si te sirve!\n💬 Comenta tu experiencia\n📤 Comparte con quien lo necesite',
      tags: ['cta', 'beneficios', 'acción']
    }
  ];

  const formatButtons = [
    { icon: Bold, label: 'Bold', format: '**' },
    { icon: Italic, label: 'Italic', format: '_' },
    { icon: Hash, label: 'Hashtag', format: '#' },
    { icon: AtSign, label: 'Mention', format: '@' }
  ];

  const symbols = ['✨', '🔥', '💡', '🎯', '📈', '🚀'];

  const characterCount = content.length;
  const currentLimit = platforms[selectedPlatform].limit;
  const isOverLimit = characterCount > currentLimit;

  const applyFormat = (format) => {
    const textarea = document.getElementById('content-editor');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newText;
    if (format === '**' || format === '_') {
      newText = content.substring(0, start) + format + selectedText + format + content.substring(end);
    } else {
      newText = content.substring(0, start) + format + selectedText + content.substring(end);
    }
    
    setContent(newText);
  };

  const insertSymbol = (symbol) => {
    const textarea = document.getElementById('content-editor');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const newText = content.substring(0, start) + symbol + content.substring(start);
    setContent(newText);
  };

  const generateAISuggestions = async () => {
    if (!content.trim()) {
      alert('Escribe algo de contenido primero para que la IA pueda ayudarte');
      return;
    }

    setIsLoadingAI(true);
    setShowAI(true);
    
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: `Analiza este copy y genera 4 variaciones para ${platforms[selectedPlatform].name}:

"${content}"

Responde SOLO con JSON:
{
  "variations": [
    {"title": "Emocional", "content": "copy..."},
    {"title": "Educativo", "content": "copy..."},
    {"title": "Directo", "content": "copy..."},
    {"title": "Profesional", "content": "copy..."}
  ]
}`
            }
          ]
        })
      });

      const data = await response.json();
      let responseText = data.content[0].text;
      responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const aiResponse = JSON.parse(responseText);
      setAiSuggestions(aiResponse.variations || []);
      
    } catch (error) {
      console.error('Error:', error);
      setAiSuggestions([
        { title: "Error", content: "No se pudo conectar con la IA" }
      ]);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const generateHashtags = async () => {
    if (!content.trim()) {
      alert('Escribe contenido primero');
      return;
    }

    setIsLoadingAI(true);
    setShowHashtags(true);
    
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 500,
          messages: [
            {
              role: "user",
              content: `Genera hashtags para: "${content}"

Responde SOLO JSON: {"hashtags": ["#tag1", "#tag2", ...]}`
            }
          ]
        })
      });

      const data = await response.json();
      let responseText = data.content[0].text;
      responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      
      const hashtagResponse = JSON.parse(responseText);
      setGeneratedHashtags(hashtagResponse.hashtags || []);
      
    } catch (error) {
      setGeneratedHashtags(['#error']);
    } finally {
      setIsLoadingAI(false);
    }
  };

  const getPreviewStyle = () => {
    const colors = {
      instagram: 'bg-gradient-to-br from-purple-600 via-pink-600 to-yellow-500',
      linkedin: 'bg-blue-600',
      twitter: 'bg-blue-400',
      tiktok: 'bg-black',
      facebook: 'bg-blue-700',
      whatsapp: 'bg-green-500'
    };
    return colors[selectedPlatform] || 'bg-gray-600';
  };

  const formatPreviewText = (text) => {
    return text.split('\n').map((line, idx) => (
      <div key={idx} className={line.trim() === '' ? 'h-4' : ''}>
        {line.split(/(\*\*.*?\*\*|_.*?_)/g).map((part, partIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('_') && part.endsWith('_')) {
            return <em key={partIdx}>{part.slice(1, -1)}</em>;
          }
          return part;
        })}
      </div>
    ));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    alert('¡Copiado!');
  };

  const wordCount = content.split(' ').filter(w => w.length > 0).length;
  const lineCount = content.split('\n').length;
  const hashtagCount = (content.match(/#\w+/g) || []).length;
  const mentionCount = (content.match(/@\w+/g) || []).length;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`border-b transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-gray-500 hidden sm:block">Suite de Copywriting Gratuita</span>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex space-x-1">
              {[
                { id: 'editor', label: 'Editor', icon: Type },
                { id: 'templates', label: 'Plantillas', icon: Zap }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white' 
                      : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {activeTab === 'editor' && (
              <div className={`rounded-xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="p-6">
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Plataforma objetivo</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {Object.entries(platforms).map(([key, platform]) => (
                        <button
                          key={key}
                          onClick={() => setSelectedPlatform(key)}
                          className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all ${
                            selectedPlatform === key
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                              : darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <platform.icon className="w-5 h-5 mb-1" style={{ color: platform.color }} />
                          <span className="text-xs">{platform.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    {formatButtons.map((btn, idx) => (
                      <button
                        key={idx}
                        onClick={() => applyFormat(btn.format)}
                        className="flex items-center space-x-1 px-3 py-1 bg-white dark:bg-gray-600 rounded border hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                      >
                        <btn.icon className="w-4 h-4" />
                        <span className="text-sm">{btn.label}</span>
                      </button>
                    ))}
                    
                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2"></div>
                    
                    {symbols.map((symbol, idx) => (
                      <button
                        key={idx}
                        onClick={() => insertSymbol(symbol)}
                        className="px-2 py-1 bg-white dark:bg-gray-600 rounded border hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors"
                      >
                        {symbol}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <textarea
                      id="content-editor"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Escribe tu copy aquí... Usa **texto** para negritas y _texto_ para cursivas"
                      className={`w-full h-64 p-4 rounded-lg border resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors ${
                        darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300'
                      }`}
                    />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className={`text-sm ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
                          {characterCount} / {currentLimit.toLocaleString()}
                        </span>
                        <div className={`w-20 h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                          <div
                            className={`h-full rounded-full transition-all ${
                              isOverLimit ? 'bg-red-500' : 'bg-gradient-to-r from-purple-500 to-blue-500'
                            }`}
                            style={{ width: `${Math.min((characterCount / currentLimit) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={generateAISuggestions}
                          disabled={isLoadingAI}
                          className={`flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg hover:opacity-90 transition-colors ${isLoadingAI ? 'opacity-50' : ''}`}
                        >
                          <Wand2 className={`w-4 h-4 ${isLoadingAI ? 'animate-spin' : ''}`} />
                          <span>{isLoadingAI ? 'Generando...' : 'IA'}</span>
                        </button>
                        
                        <button
                          onClick={generateHashtags}
                          disabled={isLoadingAI}
                          className={`flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-lg hover:opacity-90 transition-colors ${isLoadingAI ? 'opacity-50' : ''}`}
                        >
                          <Hash className="w-4 h-4" />
                          <span>Tags</span>
                        </button>
                        
                        <button 
                          onClick={copyToClipboard}
                          className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copiar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'templates' && (
              <div className={`rounded-xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="p-6">
                  <div className="grid gap-4">
                    {templates.map(template => (
                      <div
                        key={template.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                          darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setContent(template.content)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{template.title}</h3>
                            <p className="text-sm text-gray-500">{template.category}</p>
                          </div>
                          <Plus className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          {template.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {template.content.substring(0, 100)}...
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className={`rounded-xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-purple-500" />
                  <h3 className="font-semibold">Preview {platforms[selectedPlatform].name}</h3>
                </div>
              </div>
              
              <div className="p-4">
                <div className={`p-4 rounded-lg ${getPreviewStyle()} text-white min-h-32`}>
                  <div className="text-sm opacity-90 mb-2">
                    {platforms[selectedPlatform].name} Post
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm text-gray-900 p-3 rounded text-sm">
                    {content ? formatPreviewText(content) : (
                      <span className="text-gray-500 italic">Tu copy aparecerá aquí...</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {showHashtags && (
              <div className={`rounded-xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Hash className="w-5 h-5 text-green-500" />
                      <h3 className="font-semibold">Hashtags Sugeridos</h3>
                    </div>
                    <button
                      onClick={() => setShowHashtags(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  {isLoadingAI ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
                      <span className="ml-2 text-sm">Generando hashtags...</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {generatedHashtags.map((hashtag, idx) => (
                        <button
                          key={idx}
                          onClick={() => insertSymbol(hashtag + ' ')}
                          className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                        >
                          {hashtag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {showAI && (
              <div className={`rounded-xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 text-purple-500" />
                      <h3 className="font-semibold">Sugerencias IA</h3>
                    </div>
                    <button
                      onClick={() => setShowAI(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="space-y-3">
                    {isLoadingAI ? (
                      <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                        <span className="ml-3">Generando sugerencias...</span>
                      </div>
                    ) : (
                      aiSuggestions.map((suggestion, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                            darkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setContent(suggestion.content || suggestion)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm text-purple-600 dark:text-purple-400">
                              {suggestion.title || `Sugerencia ${idx + 1}`}
                            </h4>
                            <Plus className="w-4 h-4 text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {typeof suggestion === 'string' ? suggestion : (suggestion.content || '').substring(0, 150) + '...'}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className={`rounded-xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold">Análisis del Copy</h3>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Palabras</span>
                  <span className="font-semibold">{wordCount}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Líneas</span>
                  <span className="font-semibold">{lineCount}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Hashtags</span>
                  <span className="font-semibold">{hashtagCount}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Menciones</span>
                  <span className="font-semibold">{mentionCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopywritingSuite;
