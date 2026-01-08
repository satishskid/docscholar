"use client";
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker to local source or CDN to avoid build errors 
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
    url: string | null;
}

export function PDFViewer({ url }: PDFViewerProps) {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    if (!url) {
        return (
            <div className="h-full flex items-center justify-center text-muted-foreground bg-gray-50 dark:bg-zinc-900/50 rounded-lg border-2 border-dashed">
                <div className="text-center">
                    <p className="mb-2 text-2xl">📄</p>
                    <p>Select a document to view</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-gray-100 dark:bg-zinc-950 rounded-lg overflow-hidden border">
            {/* Toolbar */}
            <div className="h-12 bg-white dark:bg-zinc-900 border-b flex items-center justify-between px-4 shadow-sm z-10">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber <= 1}>
                        Previous
                    </Button>
                    <span className="text-sm font-medium tabular-nums">
                        Page {pageNumber} of {numPages || '--'}
                    </span>
                    <Button variant="ghost" size="sm" onClick={() => setPageNumber(p => Math.min(numPages || p, p + 1))} disabled={pageNumber >= (numPages || 1)}>
                        Next
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setScale(s => Math.max(0.5, s - 0.1))}>-</Button>
                    <span className="text-sm">{Math.round(scale * 100)}%</span>
                    <Button variant="ghost" size="sm" onClick={() => setScale(s => Math.min(2.0, s + 0.1))}>+</Button>
                </div>
            </div>

            {/* Scrollable Area */}
            <div className="flex-1 overflow-auto flex justify-center p-8">
                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="shadow-xl"
                >
                    <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        className="bg-white"
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                    />
                </Document>
            </div>
        </div>
    );
}
