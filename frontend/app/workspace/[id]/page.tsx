"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useApiClient } from '@/hooks/useApiClient';
import { Button } from "@/components/ui/button";
import { SettingsDialog } from '@/components/SettingsDialog';

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

import { LibrarySidebar } from '@/components/sidebar/LibrarySidebar';
import { AICopilot } from '@/components/sidebar/AICopilot';
import { StudyTab } from '@/components/tabs/StudyTab';
import { DiscoveryTab } from '@/components/tabs/DiscoveryTab';
import { ReadingTab } from '@/components/tabs/ReadingTab';
import { WritingTab } from '@/components/tabs/WritingTab';
import { ReviewTab } from '@/components/tabs/ReviewTab';

export default function WorkspacePage() {
    const { id } = useParams();
    const api = useApiClient();

    // -- Data State --
    const [project, setProject] = useState<any>(null);
    const [protocol, setProtocol] = useState<any>(null);

    // -- UI State --
    const [activeTab, setActiveTab] = useState<'study' | 'literature' | 'write' | 'discover' | 'review'>('study');
    const [showSettings, setShowSettings] = useState(false);

    // -- Sidebar State --
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [uploading, setUploading] = useState(false);

    // -- Discovery State --
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isImporting, setIsImporting] = useState<string | null>(null);

    // -- Writing State --
    const [editorContent, setEditorContent] = useState("");

    // -- Copilot State --
    const [chatInput, setChatInput] = useState("");
    const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([]);
    const [isChatting, setIsChatting] = useState(false);

    // -- Protocol/Review State --
    const [isGeneratingProtocol, setIsGeneratingProtocol] = useState(false);
    const [integrityReport, setIntegrityReport] = useState<any>(null);
    const [isCheckingIntegrity, setIsCheckingIntegrity] = useState(false);

    // -- Effects --
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await api.get('/projects');
                const found = res.data.find((p: any) => p.id === id);
                if (found) setProject(found);
            } catch (e) {
                console.error("Failed to load project", e);
            }
        };
        if (id) fetchProject();
    }, [id, api]);

    // -- Handlers --
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        try {
            await api.post(`/files/upload_pdf?project_id=${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("File uploaded!");
            // Refresh logic would go here
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        try {
            const res = await api.get(`/research/search?query=${searchQuery}`);
            setSearchResults(res.data);
        } catch (err) { console.error(err); }
        finally { setIsSearching(false); }
    };

    const handleGenerateProtocol = async () => {
        if (!project || !project.pico) return;
        setIsGeneratingProtocol(true);
        try {
            const res = await api.post('/research/protocol', {
                pico: project.pico, title: project.title
            });
            setProtocol(res.data);
        } catch (e) { alert("Failed to generate protocol."); }
        finally { setIsGeneratingProtocol(false); }
    };

    const handleChat = async () => {
        if (!chatInput.trim()) return;
        const msg = chatInput;
        setChatMessages(prev => [...prev, { role: 'user', content: msg }]);
        setChatInput("");
        setIsChatting(true);
        try {
            const res = await api.post('/ai/chat_with_docs', {
                message: msg, project_id: id
            });
            setChatMessages(prev => [...prev, { role: 'ai', content: res.data.reply }]);
        } catch (e) {
            setChatMessages(prev => [...prev, { role: 'ai', content: "Error communicating with AI." }]);
        } finally { setIsChatting(false); }
    };

    const handleEditorCommand = async (command: string) => {
        // Simple command handling that might not need text selection if it's general
        // Or if it needs selection, we might need a way to get it from editor.
        // For 'expand' etc, backend likely needs text.
        // For this refactor, we will assume RichTextEditor handles selection internally usually, 
        // BUT our API call needs 'text'.
        // Since we decoupled, we might need to rethink `handleEditorCommand` or
        // let RichTextEditor pass more info.
        // However, for this MVP step:

        if (command === 'expand' || command === 'paraphrase') {
            // We need selection. But we don't have ref to editor here easily?
            // Actually, window.getSelection() works for contenteditable.
            const selection = window.getSelection()?.toString();
            if (!selection) {
                alert("Select text to use this command.");
                return;
            }
            const res = await api.post('/ai/editor_command', {
                text: selection, command, project_id: id
            });
            // We can't insert back easily without ref.
            // Ideally RichTextEditor should handle the API call or expose a Ref.
            // For now, we will just alert the result to prove connection, 
            // or append to editorContent (clunky).

            // BETTER: Let's assume WritingTab handles the API call logic? 
            // No, page.tsx owns state. 
            // Let's defer complexity: Alert result.
            alert(`AI Result: ${res.data.result}`);
        }
    };

    const handleIntegrityCheck = async () => {
        setIsCheckingIntegrity(true);
        try {
            const res = await api.post('/integrity/similarity', {
                text: editorContent || "Draft content", project_id: id
            });
            setIntegrityReport(res.data);
        } catch (e) { alert("Integrity check failed"); }
        finally { setIsCheckingIntegrity(false); }
    };

    return (
        <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden font-sans">
            {/* Header */}
            <header className="h-14 border-b flex items-center px-4 justify-between bg-background z-20">
                <div className="flex items-center gap-4">
                    <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        DocScholar
                    </span>
                    <span className="text-muted-foreground text-sm">/</span>
                    <span className="font-medium text-sm text-foreground">{project?.title || "Loading..."}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>Settings</Button>
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">JS</div>
                </div>
            </header>

            {/* Main Workbench Layout */}
            <div className="flex-1 overflow-hidden">
                <ResizablePanelGroup direction="horizontal">

                    {/* LEFT PANE: Library */}
                    <ResizablePanel defaultSize={20} minSize={15} maxSize={30} className="hidden md:block">
                        <LibrarySidebar
                            files={project?.files || []}
                            selectedFile={selectedFile}
                            onSelectFile={(f) => {
                                setSelectedFile(f);
                                setActiveTab('literature');
                            }}
                            isUploading={uploading}
                            onUpload={handleFileUpload}
                        />
                    </ResizablePanel>

                    <ResizableHandle />

                    {/* CENTER PANE: Workspace */}
                    <ResizablePanel defaultSize={55} minSize={30}>
                        <div className="h-full flex flex-col">
                            {/* Tab Navigation */}
                            <div className="border-b px-4 py-2 flex items-center bg-background z-10">
                                <nav className="flex space-x-4">
                                    {[
                                        { id: 'study', label: 'Study Design', icon: '📐' },
                                        { id: 'discover', label: 'Discovery', icon: '🔍' },
                                        { id: 'literature', label: 'Reading', icon: '📖' },
                                        { id: 'write', label: 'Writing', icon: '✍️' },
                                        { id: 'review', label: 'Review', icon: '✅' },
                                    ].map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={`
                                                pb-1 border-b-2 transition-colors flex items-center gap-2 text-sm font-medium
                                                ${activeTab === tab.id
                                                    ? 'border-primary text-primary'
                                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                                                }
                                            `}
                                        >
                                            <span className="text-xs">{tab.icon}</span>
                                            {tab.label}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Content Area */}
                            <div className="flex-1 overflow-hidden relative bg-muted/5">
                                {activeTab === 'study' && (
                                    <StudyTab
                                        project={project}
                                        isGeneratingProtocol={isGeneratingProtocol}
                                        onGenerateProtocol={handleGenerateProtocol}
                                        protocol={protocol}
                                    />
                                )}

                                {activeTab === 'discover' && (
                                    <DiscoveryTab
                                        searchQuery={searchQuery}
                                        setSearchQuery={setSearchQuery}
                                        onSearch={handleSearch}
                                        isSearching={isSearching}
                                        searchResults={searchResults}
                                        onImport={async (paper) => {
                                            setIsImporting(paper.id);
                                            try {
                                                await api.post('/research/import', {
                                                    project_id: id, paper_url: paper.pdf_url, title: paper.title
                                                });
                                                alert("Imported!");
                                            } catch (e) { alert("Failed import"); }
                                            setIsImporting(null);
                                        }}
                                        importingId={isImporting}
                                    />
                                )}

                                {activeTab === 'literature' && (
                                    <ReadingTab
                                        fileUrl={selectedFile ? (typeof selectedFile === 'string' ? selectedFile : selectedFile.url) : null}
                                    />
                                )}

                                {activeTab === 'write' && (
                                    <WritingTab
                                        content={editorContent}
                                        onChange={setEditorContent}
                                        onCommand={handleEditorCommand}
                                        onAIComplete={async (text, cursor) => {
                                            const res = await api.post('/ai/autocomplete', {
                                                text, cursor_position: cursor, project_id: id
                                            });
                                            return res.data.suggestion;
                                        }}
                                    />
                                )}

                                {activeTab === 'review' && (
                                    <ReviewTab
                                        integrityReport={integrityReport}
                                        isCheckingIntegrity={isCheckingIntegrity}
                                        onCheckIntegrity={handleIntegrityCheck}
                                    />
                                )}
                            </div>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle />

                    {/* RIGHT PANE: Copilot */}
                    <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                        <AICopilot
                            messages={chatMessages}
                            input={chatInput}
                            setInput={setChatInput}
                            onSend={handleChat}
                            isLoading={isChatting}
                        />
                    </ResizablePanel>

                </ResizablePanelGroup>
            </div>

            <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
        </div>
    );
}
