import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export function PricingSection() {
    const tiers = [
        {
            name: "Researcher",
            price: "Free",
            desc: "Perfect for individual residents and students.",
            features: ["5 Projects", "Basic RAG Analysis", "Google Drive Integration", "Standard Support"],
            cta: "Start Free",
            popular: false
        },
        {
            name: "Lab Pro",
            price: "$29",
            period: "/month",
            desc: "For serious research groups and PhD candidates.",
            features: ["Unlimited Projects", "Advanced Gap Analysis", "Team Collaboration", "Priority Support", "Custom Exports"],
            cta: "Get Pro",
            popular: true
        },
        {
            name: "Institution",
            price: "Custom",
            desc: "For medical schools and hospital systems.",
            features: ["SSO & Security Compliance", "On-Premise Deployment", "Dedicated Success Manager", "API Access"],
            cta: "Contact Sales",
            popular: false
        }
    ];

    return (
        <section className="w-full py-24 bg-background">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter">Simple, Transparent Pricing</h2>
                    <p className="text-muted-foreground mt-4">No hidden fees. Cancel anytime.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {tiers.map((tier, i) => (
                        <div key={i} className={`relative p-8 rounded-3xl border ${tier.popular ? 'border-primary/50 bg-primary/5 shadow-2xl shadow-primary/10' : 'border-border bg-card'} transition-all hover:scale-105`}>
                            {tier.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                                    Most Popular
                                </div>
                            )}
                            <div className="mb-8">
                                <h3 className="text-lg font-medium text-muted-foreground">{tier.name}</h3>
                                <div className="flex items-baseline gap-1 mt-2">
                                    <span className="text-4xl font-bold">{tier.price}</span>
                                    {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                                </div>
                                <p className="text-sm text-muted-foreground mt-4">{tier.desc}</p>
                            </div>
                            <ul className="space-y-4 mb-8">
                                {tier.features.map((f, j) => (
                                    <li key={j} className="flex items-center gap-3 text-sm">
                                        <Check className="w-4 h-4 text-primary shrink-0" />
                                        <span>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button className={`w-full rounded-full ${tier.popular ? 'bg-primary' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`} variant={tier.popular ? 'default' : 'outline'}>
                                {tier.cta}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
