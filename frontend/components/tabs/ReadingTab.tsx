"use client";

import React from 'react';
import { PDFViewer } from '@/components/PDFViewer';

interface ReadingTabProps {
    fileUrl: string | null;
}

export function ReadingTab({ fileUrl }: ReadingTabProps) {
    if (!fileUrl) {
        return (
            <div className="h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                    <p className="text-lg font-medium">No PDF Selected</p>
                    <p className="text-sm">Select a file from the library to start reading.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full overflow-hidden bg-gray-100 dark:bg-zinc-900">
            {/* PDFViewer should handle its own sizing, but we wrap it to be sure */}
            <PDFViewer url={fileUrl} />
        </div>
    );
}
