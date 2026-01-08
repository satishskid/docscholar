"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApiClient } from '@/hooks/useApiClient';
import { Loader2, CheckCircle2, AlertCircle, BookOpen } from "lucide-react";

type NoveltyReport = {
    novelty_score: number;
    consensus: string;
    gap_analysis: string;
    verdict: string;
    prior_art: { title: string; year: number; citations: number }[];
};

export default function NewProjectPage() {
    const [step, setStep] = useState<'IDEATION' | 'NOVELTY_CHECK'>('IDEATION');
    const [idea, setIdea] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [noveltyReport, setNoveltyReport] = useState<NoveltyReport | null>(null);
    const api = useApiClient();
    const router = useRouter();

    const handleInitialCheck = async () => {
        if (!idea.trim()) return;
        setIsGenerating(true);
        try {
            const res = await api.post('/research/novelty', { topic: idea });
            setNoveltyReport(res.data);
            setStep('NOVELTY_CHECK');
        } catch (e: any) {
            console.error(e);
            alert("Failed to analyze novelty. Proceeding to standard generation.");
            // Fallback
            handleCreateProject();
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCreateProject = async () => {
        setIsGenerating(true);
        try {
            // 1. Generate PICO (optionally could context from novelty report)
            const picoRes = await api.post('/ai/generate_pico', { idea });
            const picoData = picoRes.data;

            // 2. Create Project
            const projectPayload = {
                title: picoData.title,
                pico: picoData.pico
            };

            const createRes = await api.post('/projects/create', projectPayload);
            router.push(`/workspace/${createRes.data.id}`);

        } catch (e: any) {
            console.error(e);
            const msg = e.response?.data?.detail || e.message || "Unknown error";
            alert(`Failed to create project: ${msg}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 75) return "text-green-600";
        if (score >= 40) return "text-amber-600";
        return "text-red-600";
    };

    if (step === 'NOVELTY_CHECK' && noveltyReport) {
        return (
            <div className="container max-w-4xl mx-auto py-12 px-8">
                <Button variant="ghost" className="mb-4" onClick={() => setStep('IDEATION')}>← Back to Idea</Button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left: Score */}
                    <Card className="md:col-span-1">
                        <CardHeader>
                            <CardTitle>Novelty Score</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center py-6">
                            <div className={`text-6xl font-black ${getScoreColor(noveltyReport.novelty_score)}`}>
                                {noveltyReport.novelty_score}
                            </div>
                            <p className="text-sm font-medium mt-2 text-muted-foreground">{noveltyReport.verdict}</p>
                        </CardContent>
                    </Card>

                    {/* Right: Analysis */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Consensus & Gap Analysis</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> What is Known (Consensus)
                                </h4>
                                <p className="text-sm mt-1">{noveltyReport.consensus}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-primary flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" /> The Gap (Your Opportunity)
                                </h4>
                                <p className="text-sm mt-1">{noveltyReport.gap_analysis}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Prior Art */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Prior Art (Top Matches)</h3>
                    <div className="grid gap-3">
                        {(noveltyReport.prior_art || []).map((paper, i) => (
                            <div key={i} className="flex items-start justify-between p-4 rounded-lg border bg-card/50">
                                <div>
                                    <p className="font-medium text-sm">{paper.title}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{paper.year} • {paper.citations} Citations</p>
                                </div>
                                <Badge variant="outline">Match</Badge>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                    <Button variant="outline" onClick={() => setStep('IDEATION')}>Refine Idea</Button>
                    <Button size="lg" onClick={handleCreateProject} disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="mr-2 animate-spin" /> : null}
                        Proceed to Protocol Generation
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="container max-w-2xl mx-auto py-20 px-8">
            <h1 className="text-3xl font-bold mb-6">Start New Research</h1>
            <div className="space-y-4">
                <div className="bg-muted p-6 rounded-lg text-sm text-muted-foreground mb-8">
                    <p className="font-semibold text-foreground mb-2">The Aiper Way</p>
                    <ol className="list-decimal pl-4 space-y-1">
                        <li>Describe your research idea.</li>
                        <li><strong>AI checks for Novelty & Prior Art.</strong></li>
                        <li>We generate a PICO protocol and secure workspace.</li>
                    </ol>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Research Question / Idea</label>
                    <Input
                        placeholder="e.g. Does Vitamin D supplementation reduce asthma exacerbation in children?"
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        className="h-14 text-lg"
                    />
                </div>

                <Button
                    size="lg"
                    className="w-full"
                    onClick={handleInitialCheck}
                    disabled={!idea || isGenerating}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing Novelty...
                        </>
                    ) : (
                        "Analyze Novelty & Start"
                    )}
                </Button>
            </div>
        </div>
    );
}
