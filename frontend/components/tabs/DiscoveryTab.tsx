"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface DiscoveryTabProps {
    searchQuery: string;
    setSearchQuery: (val: string) => void;
    onSearch: () => void;
    isSearching: boolean;
    searchResults: any[];
    onImport: (paper: any) => void;
    importingId: string | number | null;
}

export function DiscoveryTab({
    searchQuery,
    setSearchQuery,
    onSearch,
    isSearching,
    searchResults,
    onImport,
    importingId
}: DiscoveryTabProps) {
    return (
        <div className="h-full flex flex-col p-6 max-w-5xl mx-auto w-full">
            <div className="flex gap-2 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <input
                        className="w-full bg-background border rounded-lg pl-10 pr-4 py-3 text-lg focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="Search for papers (e.g., 'efficacy of crispr in sickle cell')..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                    />
                </div>
                <Button size="lg" onClick={onSearch} disabled={isSearching}>
                    {isSearching ? "Searching..." : "Search"}
                </Button>
            </div>

            {/* Matrix View (Future) / Results List */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 gap-4 pb-20">
                {searchResults.map((paper) => (
                    <Card key={paper.id} className="p-4 flex flex-col gap-3 hover:border-primary/50 transition-colors">
                        <div className="flex justify-between items-start">
                            <h3 className="font-semibold text-lg leading-tight text-primary">{paper.title}</h3>
                            <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground whitespace-nowrap">{paper.publication_year}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{paper.abstract}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                            <span>{paper.venue}</span>
                            <span>•</span>
                            <span>{paper.authors.join(", ")}</span>
                        </div>
                        <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/50">
                            {paper.pdf_url ? (
                                <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                                    Open Access PDF
                                </div>
                            ) : (
                                <div className="text-xs text-orange-500 font-medium">Abstract Only</div>
                            )}

                            <Button
                                size="sm"
                                variant={paper.pdf_url ? "default" : "secondary"}
                                disabled={!paper.pdf_url || importingId === paper.id}
                                onClick={() => onImport(paper)}
                            >
                                {importingId === paper.id ? "Downloading..." : (paper.pdf_url ? "Import to Library" : "See Publisher")}
                            </Button>
                        </div>
                    </Card>
                ))}

                {searchResults.length === 0 && !isSearching && searchQuery && (
                    <div className="text-center p-20 text-muted-foreground">No results found.</div>
                )}
                {searchResults.length === 0 && !searchQuery && (
                    <div className="text-center p-20 text-muted-foreground opacity-50">
                        Search for global research to add to your workspace.
                    </div>
                )}
            </div>
        </div>
    );
}
