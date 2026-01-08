"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StudyTabProps {
    project: any;
    isGeneratingProtocol: boolean;
    onGenerateProtocol: () => void;
    protocol: any;
}

export function StudyTab({ project, isGeneratingProtocol, onGenerateProtocol, protocol }: StudyTabProps) {
    if (!project) return <div>Loading project...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full pb-20 overflow-y-auto p-4">
            {/* PICO Card */}
            <Card className="p-6 col-span-1 border-t-4 border-t-primary shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <span className="p-1 rounded bg-primary/10 text-primary text-xs">PICO</span>
                        Framework
                    </h3>
                    <Button variant="ghost" size="sm">Edit</Button>
                </div>
                <div className="space-y-4">
                    <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                        <div className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Patient / Population</div>
                        <div className="text-sm font-medium">{project.pico?.population || "Not defined"}</div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                        <div className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Intervention</div>
                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400">{project.pico?.intervention || "Not defined"}</div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                        <div className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Comparison</div>
                        <div className="text-sm font-medium">{project.pico?.comparison || "Not defined"}</div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-lg border border-border/50">
                        <div className="text-xs font-bold text-muted-foreground mb-1 uppercase tracking-wider">Outcome</div>
                        <div className="text-sm font-medium text-green-600 dark:text-green-400">{project.pico?.outcome || "Not defined"}</div>
                    </div>
                </div>
            </Card>

            {/* Protocol Builder */}
            <Card className="p-6 col-span-1 md:col-span-2 shadow-sm border-border/50">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-semibold text-lg">Research Protocol</h3>
                    <Button size="sm" onClick={onGenerateProtocol} disabled={isGeneratingProtocol}>
                        {isGeneratingProtocol ? "Drafting..." : "Generate Draft"}
                    </Button>
                </div>

                {protocol ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                        <h3>{protocol.title}</h3>
                        <div dangerouslySetInnerHTML={{ __html: protocol.content?.replaceAll('\n', '<br/>') || "" }} />
                    </div>
                ) : (
                    <div className="text-center p-10 text-muted-foreground border-2 border-dashed rounded-xl">
                        <div className="text-4xl mb-4">📝</div>
                        <p>Generate a structured research protocol based on your PICO elements.</p>
                        <p className="text-xs mt-2 opacity-75">Includes Methodology, Data Analysis Plan, and Ethics.</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
