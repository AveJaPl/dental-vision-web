"use client";

import { useState, useEffect, ChangeEvent, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { AiOutlineSend, AiOutlineArrowDown } from "react-icons/ai";
import { FiImage } from "react-icons/fi";
import { Loader2 } from "lucide-react"; // Spinner
import { FaUserCircle } from "react-icons/fa";
import { HiOutlineUser } from "react-icons/hi";
import { X } from "lucide-react"; // do usuwania wybranych zdjęć

interface Message {
  id: string;
  role: "user" | "assistant";
  content?: string;
  images?: string[];
  timestamp: string;
}

export default function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);

  function getFormattedTime() {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function generateTempId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...filesArray]);
    e.target.value = "";
  }

  function removeSelectedFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSend() {
    if (!textInput.trim() && selectedFiles.length === 0) return;

    const newMessage: Message = {
      id: generateTempId(),
      role: "user",
      timestamp: getFormattedTime(),
    };

    if (textInput.trim()) {
      newMessage.content = textInput.trim();
    }

    if (selectedFiles.length > 0) {
      const base64Images = await Promise.all(
        selectedFiles.map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => {
                resolve(reader.result as string);
              };
              reader.onerror = reject;
              reader.readAsDataURL(file);
            })
        )
      );
      newMessage.images = base64Images;
    }

    setMessages((prev) => [...prev, newMessage]);
    setTextInput("");
    setSelectedFiles([]);

    setIsLoading(true);

    // Wysyłanie wiadomości do API
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMessage),
    });

    const assistantResponse = await response.json();

    setMessages((prev) => [
      ...prev,
      {
        id: generateTempId(),
        role: "assistant",
        content: assistantResponse.content,
        timestamp: getFormattedTime(),
      },
    ]);
    setIsLoading(false);
  }

  function scrollToBottom() {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }

  function handleScroll() {
    if (chatRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
      setShowScrollToBottom(scrollTop + clientHeight < scrollHeight - 50);
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="w-full flex justify-center">
      <Card className="relative w-full max-w-2xl h-[calc(100vh-200px)] flex flex-col border border-border bg-background shadow-sm rounded-lg">
        {/* Górny pasek z przyciskiem wyczyszczenia chatu */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-lg text-foreground">Diagnoza online</h2>
        </div>

        {/* Lista wiadomości */}
        <div
          className="flex-1 overflow-y-auto space-y-4 p-4 custom-scrollbar"
          ref={chatRef}
          onScroll={handleScroll}
        >
          {messages.map((message) => {
            const isUser = message.role === "user";
            const messageClasses = cn(
              "flex flex-col gap-1 max-w-[80%] p-3 rounded-md relative shadow-sm",
              isUser
                ? "ml-auto bg-foreground/5 border border-border text-foreground"
                : "mr-auto bg-primary text-primary-foreground"
            );
            return (
              <div key={message.id} className={messageClasses}>
                <div className="flex items-center gap-2 mb-1">
                  {isUser ? <HiOutlineUser size={20} /> : <FaUserCircle size={20} />}
                  <span className="text-xs opacity-80">{isUser ? "Ty" : "Dentysta"} • {message.timestamp}</span>
                </div>
                {message.content && <p className="whitespace-pre-wrap text-sm md:text-base">{message.content}</p>}
                {message.images && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {message.images.map((imgSrc, idx) => (
                      <Image key={idx} src={imgSrc} alt="Wgrany plik" width={80} height={80} className="w-20 h-20 object-cover rounded-md" />
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Loader2 className="animate-spin" size={20} />
              <span>Dentysta pisze...</span>
            </div>
          )}
        </div>

        {/* Guzik scroll-to-bottom */}
        {showScrollToBottom && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-28 left-4 p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-md transition-all"
          >
            <AiOutlineArrowDown size={20} />
          </button>
        )}

        {/* Sekcja z inputem i przyciskami */}
        <div className="border-t border-border p-4">
          {selectedFiles.length > 0 && (
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {selectedFiles.map((file, index) => {
                const url = URL.createObjectURL(file);
                return (
                  <div key={index} className="relative">
                    <Image src={url} alt="preview" width={80} height={80} className="h-20 w-20 object-cover rounded" />
                    <button onClick={() => removeSelectedFile(index)} className="absolute top-1 right-1 bg-black/50 rounded-full p-1 text-white hover:bg-black">
                      <X size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Textarea
              placeholder="Napisz wiadomość..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="flex-1 text-base resize-none"
              rows={1}
            />
            <label htmlFor="image-upload" className="cursor-pointer p-2 text-foreground hover:text-primary transition-colors">
              <FiImage size={20} />
            </label>
            <input id="image-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleImageChange} />
            <Button onClick={handleSend} className="flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded-md">
              <AiOutlineSend size={18} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
