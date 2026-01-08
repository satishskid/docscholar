"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Plus, Upload } from "lucide-react";

interface LibrarySidebarProps {
    files: any[]; // Replace with proper type when known
    selectedFile: string | null;
    onSelectFile: (file: any) => void;
    isUploading: boolean;
    onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function LibrarySidebar({ files, selectedFile, onSelectFile, isUploading, onUpload }: LibrarySidebarProps) {
    return (
        <div className="h-full flex flex-col bg-muted/20 border-r">
            <div className="p-4 border-b flex items-center justify-between bg-background/50 backdrop-blur">
                <h3 className="font-semibold text-sm">Library</h3>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {files && files.length > 0 ? (
                        files.map((file, idx) => (
                            <button
                                key={idx}
                                onClick={() => onSelectFile(file)}
                                className={`w-full flex items-center gap-2 p-2 rounded-md text-sm transition-colors ${selectedFile === file ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted/50 text-muted-foreground'
                                    }`}
                            >
                                <FileText className="h-4 w-4" />
                                <span className="truncate flex-1 text-left">
                                    {typeof file === 'string' ? file : (file.name || "Untitled.pdf")}
                                </span>
                            </button>
                        ))
                    ) : (
                        <div className="p-4 text-center text-xs text-muted-foreground">
                            No files yet.
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="p-4 border-t bg-background/50 backdrop-blur">
                <div className="relative">
                    <Button variant="outline" className="w-full gap-2" disabled={isUploading}>
                        <Upload className="h-4 w-4" />
                        {isUploading ? "Uploading..." : "Upload PDF"}
                    </Button>
                    <input
                        type="file"
                        accept=".pdf"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={onUpload}
                        disabled={isUploading}
                    />
                </div>
            </div>
        </div>
    );
}
