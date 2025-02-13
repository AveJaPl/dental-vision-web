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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

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
  const [suggestions, setSuggestions] = useState<{
    suggestion1: string;
    suggestion2: string;
    suggestion3: string;
  }>({ suggestion1: "", suggestion2: "", suggestion3: "" });

  const chatRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const response = await fetch("/api/chat");
      const { messages } = await response.json();
      setMessages(messages);
    } catch (error) {
      console.error("Błąd pobierania wiadomości:", error);
    }
  }

  function formatTimestamp(timestamp: string): string {
    let date = new Date(timestamp.replace("Z", "")); // Usuwamy 'Z' dla kompatybilności z Safari

    if (isNaN(date.getTime())) {
      date = new Date();
    }

    return date.toLocaleString("pl-PL", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  }

  async function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    const resizedFiles = await Promise.all(
      filesArray.map((file) => resizeImage(file))
    );
    setSelectedFiles((prev) => [...prev, ...resizedFiles]);
    e.target.value = "";
  }

  function removeSelectedFile(index: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }
  async function resizeImage(file: File, maxWidth = 800, maxHeight = 800) {
    return new Promise<File>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;

          if (width > maxWidth || height > maxHeight) {
            const scaleFactor = Math.min(maxWidth / width, maxHeight / height);
            width *= scaleFactor;
            height *= scaleFactor;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], file.name, { type: "image/jpeg" }));
              } else {
                reject(new Error("Nie udało się przeskalować obrazu"));
              }
            },
            "image/jpeg",
            0.7
          );
        };

        img.onerror = reject;
      };

      reader.onerror = reject;
    });
  }

  async function handleSend() {
    if (!textInput.trim() && selectedFiles.length === 0) return;

    setIsLoading(true);
    setSuggestions({ suggestion1: "", suggestion2: "", suggestion3: "" });

    const imagePromises = selectedFiles.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    );

    const images = await Promise.all(imagePromises).catch((error) => {
      console.error("Błąd przetwarzania plików:", error);
      return [];
    });

    const newMessage: Message = {
      id: "temp",
      role: "user",
      content: textInput.trim() || undefined,
      images: images.length > 0 ? images : undefined,
      timestamp: formatTimestamp(new Date().toISOString()),
    };

    setMessages((prev) => [...prev, newMessage]);

    setTextInput("");
    setSelectedFiles([]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) throw new Error("Błąd wysyłania wiadomości");
      const data = await response.json();
      console.log("Odpowiedź serwera:", data);
      console.log("suggestions", data.suggestions);
      setMessages(data.messages);
      setSuggestions(data.suggestions);
    } catch (error) {
      console.error("Błąd wysyłania wiadomości:", error);
    }

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
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  return (
    <div className="w-full flex justify-center">
      <Card className="relative w-full max-w-2xl h-[calc(100vh-200px)] flex flex-col border border-border bg-background shadow-sm rounded-lg">
        {/* Górny pasek */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-semibold text-lg text-foreground">
            Diagnoza online
          </h2>
        </div>

        {/* Lista wiadomości */}
        <div
          className="flex-1 overflow-y-auto space-y-4 p-4 custom-scrollbar"
          ref={chatRef}
          onScroll={handleScroll}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex flex-col gap-1 max-w-[80%] p-3 rounded-md relative shadow-sm",
                message.role === "user"
                  ? "ml-auto bg-foreground/5 border border-border text-foreground"
                  : "mr-auto bg-primary text-primary-foreground"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                {message.role === "user" ? (
                  <HiOutlineUser size={20} />
                ) : (
                  <FaUserCircle size={20} />
                )}
                <span className="text-xs opacity-80">
                  {message.role === "user" ? "Ty" : "Dentysta"} •{" "}
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
              {message.content && (
                <p className="whitespace-pre-wrap text-sm md:text-base">
                  {message.content}
                </p>
              )}
              {message.images && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {message.images.map((imgSrc, idx) => (
                    <Image
                      key={idx}
                      src={imgSrc}
                      alt="Wgrany plik"
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-foreground">
              <Loader2 className="animate-spin" size={20} />
              <span>Dentysta pisze...</span>
            </div>
          )}

          <div className="p-0 h-0 !m-0" ref={lastMessageRef}></div>
        </div>

        {/* Guzik scroll-to-bottom */}
        {showScrollToBottom && (
          <button
            onClick={scrollToBottom}
            className={`absolute ${
              suggestions.suggestion1 != "" ? "bottom-40" : "bottom-28"
            } left-4 p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-md transition-all`}
          >
            <AiOutlineArrowDown size={20} />
          </button>
        )}
        {/* Sekcja z sugerowanymi wiadomościami */}
        {suggestions.suggestion1 != "" && (
          <div className="flex py-3 border-t border-border">
            <ScrollArea className="w-full">
              <div className="flex gap-2 overflow-hidden px-2">
                {Object.values(suggestions).map((suggestion, index) => (
                  <Button
                    key={index}
                    onClick={() => {
                      setTextInput(suggestion);
                    }}
                    variant="outline"
                    className="text-xs tracking-tight px-3 py-1 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary transition rounded-md"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
          </div>
        )}

        {/* Sekcja z inputem */}
        <div className="border-t border-border p-4">
          {/* Podgląd wybranych zdjęć */}
          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto">
              {selectedFiles.map((file, idx) => {
                const url = URL.createObjectURL(file);
                return (
                  <div key={idx} className="relative">
                    <Image
                      src={url}
                      alt="Preview"
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <button
                      onClick={() => removeSelectedFile(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black"
                    >
                      <X size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pole tekstowe i przyciski */}
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
            <label
              htmlFor="image-upload"
              className="cursor-pointer p-2 text-foreground hover:text-primary transition-colors"
            >
              <FiImage size={20} />
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />
            <Button
              onClick={handleSend}
              className="flex items-center justify-center bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded-md"
            >
              <AiOutlineSend size={18} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
