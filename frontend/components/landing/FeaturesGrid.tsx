import { Shield, Database, Sparkles, BookOpen, Quote, Clock } from "lucide-react";

export function FeaturesGrid() {
    const features = [
        {
            icon: Shield,
            title: "Data Sovereignty",
            desc: "Your data never leaves your secure vault. We use Bring-Your-Own-Key (BYOK) architecture for zero-retention privacy.",
            colSpan: "lg:col-span-2",
            bg: "bg-blue-500/5 group-hover:bg-blue-500/10",
            iconColor: "text-blue-500"
        },
        {
            icon: Database,
            title: "Unified Clinical OS",
            desc: "From PICO search to final submission, manage your entire research lifecycle in one cohesive workspace.",
            colSpan: "lg:col-span-1",
            bg: "bg-purple-500/5 group-hover:bg-purple-500/10",
            iconColor: "text-purple-500"
        },
        {
            icon: Sparkles,
            title: "Evidence-Based Integrity",
            desc: "Eliminate hallucinations. Our RAG engine cites strictly from your verified document vault.",
            colSpan: "lg:col-span-1",
            bg: "bg-rose-500/5 group-hover:bg-rose-500/10",
            iconColor: "text-rose-500"
        },
        {
            icon: BookOpen,
            title: "Automated Literature Review",
            desc: "Let AI scan thousands of papers and extract only the relevant PICO elements for your study.",
            colSpan: "lg:col-span-2",
            bg: "bg-emerald-500/5 group-hover:bg-emerald-500/10",
            iconColor: "text-emerald-500"
        }
    ];

    return (
        <section className="w-full py-24 bg-card/30 border-y border-border/50">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Why Top Labs Choose Aiper
                    </h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                        The modern research stack is broken. Aiper fixes the fragmentation, privacy risks, and subscription fatigue.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {features.map((f, i) => (
                        <div key={i} className={`p-8 rounded-3xl border border-border transition-all group hover:border-sidebar-primary/50 hover:scale-[1.01] ${f.bg} ${f.colSpan}`}>
                            <div className={`w-12 h-12 rounded-2xl ${f.bg.replace('group-hover:', '')} ${f.iconColor} flex items-center justify-center mb-6`}>
                                <f.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-xl mb-3">{f.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
