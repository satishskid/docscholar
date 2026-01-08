"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiClient } from '@/hooks/useApiClient';
import { useAuth } from "@/context/AuthContext";
import { SettingsDialog } from '@/components/SettingsDialog';

interface Project {
    id: string;
    title: string;
    status: string;
    created_at: string;
    pico: {
        patient: string;
        intervention: string;
        outcome: string;
    };
}

export default function DashboardPage() {
    const { user, loading, googleAccessToken, logout, signInWithGoogle } = useAuth();
    const api = useApiClient();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        if (!user || !googleAccessToken) return;

        // init user and fetch projects
        const fetchData = async () => {
            setIsLoadingProjects(true);
            try {
                await api.post('/init_user'); // Ensure vault structure exists
                const res = await api.get('/projects');
                setProjects(res.data);
            } catch (e) {
                console.error("Failed to load projects", e);
            } finally {
                setIsLoadingProjects(false);
            }
        };

        fetchData();
    }, [user, googleAccessToken, api]);

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    );

    if (!user) return <div className="p-8 text-center">Please log in to view dashboard.</div>;

    if (!googleAccessToken) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-background gap-4">
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold">Secure Vault Cached</h2>
                    <p className="text-muted-foreground max-w-md">
                        Your session expired but your data is safe. Please re-authenticate to unlock your Drive Vault.
                    </p>
                </div>
                <Button onClick={logout} variant="secondary">Reset Session</Button>
                <Button onClick={signInWithGoogle} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    Unlock Vault (Sign In)
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* Gradient Orbs */}
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <header className="border-b border-border/40 bg-background/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">A</div>
                        <span className="font-bold text-xl tracking-tight">Aiper</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={() => setShowSettings(true)}>Settings</Button>
                        <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
                        <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                            {user.email?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
            </header>

            <div className="container mx-auto p-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">My Research</h1>
                        <p className="text-muted-foreground mt-1">Manage your secure projects and clinical studies.</p>
                    </div>
                    <Link href="/workspace/new">
                        <Button className="rounded-full px-6 shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-purple-600 hover:scale-105 transition-all">
                            + New Project
                        </Button>
                    </Link>
                </div>

                {isLoadingProjects && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-40 rounded-xl bg-muted/50 animate-pulse" />
                        ))}
                    </div>
                )}

                {!isLoadingProjects && projects.length === 0 && (
                    <div className="text-center py-24 bg-gradient-to-b from-muted/30 to-background border border-dashed border-border rounded-xl">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                            <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium mb-2">No projects yet</h3>
                        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Start your first research paper. Your data will be encrypted and stored in your private Drive vault.</p>
                        <Link href="/workspace/new">
                            <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5">Create Initial Draft</Button>
                        </Link>
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <Link key={project.id} href={`/workspace/${project.id}`}>
                            <Card className="group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer h-full border-primary/5 bg-gradient-to-br from-card to-background hover:-translate-y-1">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="space-y-1">
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Clinical Study</span>
                                            <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                                                {project.title}
                                            </CardTitle>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${project.status === 'draft' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-green-500/10 text-green-600 border-green-500/20'}`}>
                                            {project.status.toUpperCase()}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="p-3 rounded-lg bg-muted/30 border border-border/50 text-sm text-muted-foreground mb-4 backdrop-blur-sm">
                                        <div className="flex gap-2 mb-1">
                                            <span className="font-semibold text-foreground/80 text-xs w-12 shrink-0">PICO:</span>
                                            <span className="line-clamp-2 text-xs">{project.pico.patient} vs {project.pico.intervention}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/30 pt-3">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            {new Date(project.created_at).toLocaleDateString()}
                                        </span>
                                        <span className="group-hover:translate-x-1 transition-transform text-primary font-medium">Open →</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
