import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Chat, GenerateContentResponse } from "@google/genai";
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { createChatSession, sendMessageStream } from './services/geminiService';
import { Message, KnowledgeFile } from './types';

const App: React.FC = () => {
  const [files, setFiles] = useState<KnowledgeFile[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);

  // Combine all file contents into a single string for the prompt
  const knowledgeContext = useMemo(() => {
    return files.map(f => `FILE: ${f.name}\nCONTENT:\n${f.content}`).join('\n\n');
  }, [files]);

  // Re-initialize chat when knowledge base changes (or initially)
  useEffect(() => {
    const chat = createChatSession(knowledgeContext);
    setChatSession(chat);
    console.log('Chat session updated with new context size:', knowledgeContext.length);
  }, [knowledgeContext]);

  const handleFileUpload = async (fileList: FileList) => {
    const newFiles: KnowledgeFile[] = [];
    
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      // Basic check for text/json/md
      if (file.type.match('text.*') || file.name.endsWith('.md') || file.name.endsWith('.json') || file.name.endsWith('.csv')) {
        const content = await file.text();
        newFiles.push({
          name: file.name,
          content: content,
          size: file.size,
          type: file.type
        });
      } else {
        alert(`File ${file.name} không được hỗ trợ. Vui lòng tải lên file văn bản.`);
      }
    }

    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (fileName: string) => {
    setFiles(prev => prev.filter(f => f.name !== fileName));
  };

  const handleClearChat = () => {
    setMessages([]);
    // Re-create session to clear model memory
    const chat = createChatSession(knowledgeContext);
    setChatSession(chat);
  };

  const handleSendMessage = useCallback(async (text: string) => {
    if (!chatSession) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // 2. Add Placeholder Bot Message
    const botMsgId = (Date.now() + 1).toString();
    const botMsg: Message = {
      id: botMsgId,
      role: 'model',
      text: '', // Start empty
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, botMsg]);

    try {
      // 3. Stream Response
      const streamResponse = await sendMessageStream(chatSession, text);
      
      let fullText = '';
      
      for await (const chunk of streamResponse) {
        const c = chunk as GenerateContentResponse;
        const newText = c.text || '';
        fullText += newText;
        
        // Update the last message (bot) with accumulated text
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMsgId ? { ...msg, text: fullText } : msg
          )
        );
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botMsgId 
            ? { ...msg, text: "Xin lỗi, đã có lỗi xảy ra khi kết nối với AI.", isError: true } 
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [chatSession]);

  // Derive stats for charts
  const messageStats = messages.map(m => ({
    name: m.role,
    length: m.text.length,
    role: m.role
  }));

  return (
    <div className="flex h-screen mesh-bg text-slate-200 font-sans overflow-hidden">
      <Sidebar 
        files={files} 
        onFileUpload={handleFileUpload} 
        onRemoveFile={handleRemoveFile} 
        onClearChat={handleClearChat}
        messageStats={messageStats}
      />
      <main className="flex-1 flex flex-col min-w-0 relative z-10">
        <ChatArea 
          messages={messages} 
          isLoading={isLoading} 
          onSendMessage={handleSendMessage} 
        />
      </main>
    </div>
  );
};

export default App;