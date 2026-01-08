"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Sparkles } from "lucide-react";

interface Message {
    role: 'user' | 'ai';
    content: string;
}

interface AICopilotProps {
    messages: Message[];
    input: string;
    setInput: (val: string) => void;
    onSend: () => void;
    isLoading: boolean;
}

export function AICopilot({ messages, input, setInput, onSend, isLoading }: AICopilotProps) {
    return (
        <div className="h-full flex flex-col bg-background border-l">
            <div className="p-4 border-b flex items-center gap-2 bg-muted/10">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-semibold text-sm">Copilot</span>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center mt-20 opacity-50 p-4">
                            <Sparkles className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm">Ask questions about your documents.</p>
                        </div>
                    )}
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`p-3 rounded-lg max-w-[90%] text-sm ${m.role === 'user'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-foreground'
                                }`}>
                                <div className="whitespace-pre-wrap">{m.content}</div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-muted p-3 rounded-lg text-xs text-muted-foreground flex gap-1">
                                <span className="animate-bounce">●</span>
                                <span className="animate-bounce delay-100">●</span>
                                <span className="animate-bounce delay-200">●</span>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 border-t">
                <div className="relative">
                    <input
                        className="w-full bg-muted/50 border border-transparent focus:border-primary/50 rounded-md px-4 py-2 text-sm focus:outline-none pr-10"
                        placeholder="Ask a question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSend()}
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={onSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-1 top-1 h-7 w-7"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
