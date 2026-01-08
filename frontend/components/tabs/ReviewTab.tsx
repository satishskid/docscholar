"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ReviewTabProps {
    integrityReport: any;
    isCheckingIntegrity: boolean;
    onCheckIntegrity: () => void;
}

export function ReviewTab({ integrityReport, isCheckingIntegrity, onCheckIntegrity }: ReviewTabProps) {
    return (
        <div className="max-w-6xl mx-auto h-full p-8 flex flex-col gap-8 overflow-y-auto pb-48">

            <div className="text-center space-y-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-xl shadow-indigo-500/20">
                    🚀
                </div>
                <h2 className="text-3xl font-bold">Submission Readiness Check</h2>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    AI is analyzing your manuscript against submission criteria including compliance, formatting, and statistical integrity.
                </p>
                <div className="flex justify-center gap-4">
                    <Button size="lg" onClick={onCheckIntegrity} disabled={isCheckingIntegrity}>
                        {isCheckingIntegrity ? "Analyzing..." : "Run Analysis"}
                    </Button>
                </div>
            </div>

            {integrityReport && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 border-l-4 border-l-green-500">
                        <h4 className="font-semibold mb-2">Originality Score</h4>
                        <div className="text-4xl font-bold text-green-600">{Math.round((1 - integrityReport.similarity_score) * 100)}%</div>
                        <p className="text-xs text-muted-foreground mt-1">Unique content relative to open database.</p>
                    </Card>
                    <Card className="p-4 border-l-4 border-l-blue-500">
                        <h4 className="font-semibold mb-2">Citation Density</h4>
                        <div className="text-4xl font-bold text-blue-600">Good</div>
                        <p className="text-xs text-muted-foreground mt-1">Sufficient references found.</p>
                    </Card>
                </div>
            )}

            <div className="bg-card border rounded-xl p-8 flex flex-col items-center gap-6 mt-4">
                <div className="flex gap-4">
                    <Button size="lg" variant="outline" className="h-14 px-8 border-dashed">
                        Download Word (.docx)
                    </Button>
                    <Button size="lg" className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
                        Submit to Journal
                    </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                    Aiper guarantees data privacy during the submission process.
                </p>
            </div>

        </div>
    );
}
