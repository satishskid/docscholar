"use client";
import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
    onCommand: (command: string) => void;
    onAIComplete: (text: string, cursor: number) => Promise<string | void>;
}

export function RichTextEditor({ content, onChange, placeholder, onCommand, onAIComplete }: RichTextEditorProps) {
    const [isThinking, setIsThinking] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Placeholder.configure({
                placeholder: placeholder || 'Start writing...',
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            // We only trigger onChange if it wasn't an external reset
            // But here we need to be careful with infinite loops if we sync content prop back
            onChange(editor.getText());
            // Note: in a real app, we sync HTML usually. Here we stick to text processing for simplicity 
            // or upgrade backend to handle HTML. For now, text.
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-12 font-serif text-lg leading-relaxed text-gray-800 dark:text-gray-200',
            },
        },
    });

    // Handle "Ghost Text" or AI Key triggers
    useEffect(() => {
        const handleKeyDown = async (e: KeyboardEvent) => {
            if (e.ctrlKey && e.code === 'Space') {
                e.preventDefault();
                if (!editor) return;

                setIsThinking(true);
                const text = editor.getText(); // Get plain text for AI context
                const cursor = editor.state.selection.from; // Approximate cursor

                try {
                    const suggestion = await onAIComplete(text, cursor);
                    if (suggestion && typeof suggestion === 'string') {
                        editor.commands.insertContent(" " + suggestion + " ");
                    }
                } catch (err) {
                    console.error(err);
                } finally {
                    setIsThinking(false);
                }
            }
        };

        // Attach listener to editor element if possible, or global but scoped
        // Tiptap handles keymaps better, but customized logic here:
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [editor, onAIComplete]);

    // Keep external content in sync if needed (e.g. loaded draft)
    useEffect(() => {
        if (editor && content !== editor.getText()) {
            // Only set if drastically different to avoid cursor jumps
            // Or if empty (initial load)
            if (editor.getText().length === 0 && content.length > 0) {
                editor.commands.setContent(content);
            }
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border shadow-md rounded-xl overflow-hidden">
            {/* Toolbar */}
            <div className="border-b p-3 bg-gray-50 dark:bg-zinc-800/50 flex gap-2 items-center flex-wrap">
                <div className="flex bg-white dark:bg-zinc-800 rounded-lg border p-1">
                    <Button
                        variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 w-7 p-0 font-bold"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                    >B</Button>
                    <Button
                        variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 w-7 p-0 italic"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                    >I</Button>
                    <Button
                        variant={editor.isActive('underline') ? 'secondary' : 'ghost'}
                        size="sm"
                        className="h-7 w-7 p-0 underline"
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                    >U</Button>
                </div>

                <div className="h-6 w-px bg-border mx-2"></div>

                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" className="h-7 text-xs font-medium" onClick={() => onCommand('expand')}>➕ Expand</Button>
                    <Button variant="secondary" size="sm" className="h-7 text-xs font-medium" onClick={() => onCommand('paraphrase')}>🔄 Rewrite</Button>
                    <Button variant="secondary" size="sm" className="h-7 text-xs font-medium" onClick={() => onCommand('citation')}>🔖 Cite</Button>
                </div>

                <div className="flex-1" />
                <div className="text-xs text-muted-foreground mr-4 hidden md:block">
                    {isThinking ? (
                        <span className="text-indigo-500 animate-pulse font-medium">AI is writing...</span>
                    ) : (
                        <span>Press <kbd className="px-1.5 py-0.5 bg-muted rounded border text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-muted rounded border text-[10px]">Space</kbd> for AI</span>
                    )}
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-y-auto cursor-text" onClick={() => editor.chain().focus().run()}>
                <EditorContent editor={editor} className="h-full min-h-[500px]" />
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-zinc-800 px-4 py-2 text-xs text-muted-foreground flex justify-between border-t">
                <span>{editor.storage.characterCount?.words?.() || 0} words</span>
                <span>{isThinking ? "Saving..." : "Draft saved"}</span>
            </div>
        </div>
    );
}
