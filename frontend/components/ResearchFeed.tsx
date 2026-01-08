"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Paper {
    id: string;
    title: string;
    journal: string;
    date: string;
    citations: number;
    url: string;
}

export function ResearchFeed() {
    const [papers, setPapers] = useState<Paper[]>([]);
    const [loading, setLoading] = useState(true);
    const [specialty, setSpecialty] = useState("clinical medicine");

    const fetchFeed = async () => {
        setLoading(true);
        try {
            // Use local API proxy if available, else direct logic. 
            // We implemented /api/v1/research/feed in backend
            const res = await axios.get(`http://localhost:8000/api/v1/research/feed?specialty=${specialty}`);
            setPapers(res.data);
        } catch (e) {
            console.error("Failed to fetch feed", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, [specialty]);

    return (
        <div className="w-full max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                        Live Research Feed
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        Stay motivated with the latest open-access breakthroughs.
                    </p>
                </div>
                <div className="flex gap-2">
                    <select
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                    >
                        <option value="clinical medicine">Clinical Medicine</option>
                        <option value="oncology">Oncology</option>
                        <option value="cardiology">Cardiology</option>
                        <option value="neurology">Neurology</option>
                        <option value="public health">Public Health</option>
                        <option value="artificial intelligence medicine">AI in Medicine</option>
                    </select>
                    <Button variant="outline" size="icon" onClick={fetchFeed} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {papers.map((paper) => (
                    <Card key={paper.id} className="group hover:border-primary/50 transition-all hover:shadow-lg">
                        <CardContent className="p-6 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                                <Badge variant="secondary" className="text-xs font-normal">
                                    {paper.journal}
                                </Badge>
                                <span className="text-xs text-muted-foreground">{paper.date}</span>
                            </div>
                            <h3 className="font-semibold text-lg mb-3 line-clamp-3 group-hover:text-primary transition-colors">
                                <a href={paper.url} target="_blank" rel="noopener noreferrer">
                                    {paper.title}
                                </a>
                            </h3>
                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    Cited by <span className="font-medium text-foreground">{paper.citations}</span>
                                </span>
                                <a
                                    href={paper.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary hover:text-primary/80"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {loading && papers.length === 0 && (
                <div className="text-center py-20 text-muted-foreground animate-pulse">
                    Loading latest research...
                </div>
            )}
        </div>
    );
}
