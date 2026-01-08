
export function ComparisonSection() {
    return (
        <section className="w-full py-24 relative z-20 bg-gradient-to-b from-transparent to-muted/20">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                        Accelerate Your Discovery
                    </h2>
                    <p className="mx-auto max-w-[700px] text-muted-foreground mt-4 text-lg">
                        Stop spending months on manual tasks. Start discovering.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-start">

                    {/* Traditional Process */}
                    <div className="rounded-3xl border border-dashed border-muted-foreground/30 bg-background/50 p-8 relative overflow-hidden group hover:border-muted-foreground/50 transition-colors">
                        <h3 className="text-2xl font-bold mb-6 text-muted-foreground flex items-center gap-2">
                            <span className="text-3xl">⏳</span> The Old Way
                        </h3>
                        <ul className="space-y-4 text-muted-foreground font-medium">
                            {[
                                "Literature review (weeks)",
                                "Manual gap analysis",
                                "Study design planning",
                                "Data collection",
                                "Analysis & interpretation",
                                "Writing & revision (months)",
                                "Journal submission",
                                "Peer review process"
                            ].map((step, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs opacity-50">{i + 1}</span>
                                    {step}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* DocScholar Process */}
                    <div className="rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5 p-8 relative overflow-hidden shadow-2xl shadow-primary/10 transform lg:-translate-y-4 hover:scale-[1.02] transition-transform duration-500">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-600" />
                        <h3 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 flex items-center gap-2">
                            <span className="text-3xl">⚡️</span> The Aiper Way
                        </h3>
                        <ul className="space-y-4 font-semibold text-foreground/90">
                            {[
                                { text: "Smart Search & Import", extra: "(Seconds)" },
                                { text: "AI-Driven Gap Analysis" },
                                { text: "PICO-Guided Design" },
                                { text: "One-Click Data Extraction" },
                                { text: "Synthetic Insights (RAG)" },
                                { text: "Co-Pilot Drafting", extra: "(Days)" },
                                { text: "Auto-Format & Submission" },
                                { text: "Pre-Submission Review" }
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs">✓</span>
                                    <span>
                                        {item.text}
                                        {item.extra && <span className="text-primary text-sm font-normal ml-2">{item.extra}</span>}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </section>
    );
}
