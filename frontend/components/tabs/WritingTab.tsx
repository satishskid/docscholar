"use client";

import React from 'react';
import { RichTextEditor } from '@/components/RichTextEditor';

interface WritingTabProps {
    content: string;
    onChange: (content: string) => void;
    onCommand: (command: string) => void;
    onAIComplete: (text: string, cursor: number) => Promise<string | void>;
}

export function WritingTab({ content, onChange, onCommand, onAIComplete }: WritingTabProps) {
    return (
        <div className="h-full w-full max-w-4xl mx-auto px-8 py-6 overflow-y-auto">
            <RichTextEditor
                content={content}
                onChange={onChange}
                placeholder="Start writing your manuscript..."
                onCommand={onCommand}
                onAIComplete={onAIComplete}
            />
        </div>
    );
}
