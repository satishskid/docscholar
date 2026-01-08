"use client";
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
    const [geminiKey, setGeminiKey] = useState("");
    const [groqKey, setGroqKey] = useState("");

    useEffect(() => {
        if (open) {
            const storedKeys = localStorage.getItem('aiper_keys');
            if (storedKeys) {
                try {
                    const keys = JSON.parse(storedKeys);
                    setGeminiKey(keys.gemini || "");
                    setGroqKey(keys.groq || "");
                } catch (e) {
                    console.error(e);
                }
            }
        }
    }, [open]);

    const handleSave = () => {
        const keys = {
            gemini: geminiKey,
            groq: groqKey
        };
        localStorage.setItem('aiper_keys', JSON.stringify(keys));
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>API Configuration</DialogTitle>
                    <DialogDescription>
                        Enter your API keys. They are stored locally in your browser and never saved to our database.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="gemini" className="text-right">
                            Gemini API Key
                        </Label>
                        <Input
                            id="gemini"
                            value={geminiKey}
                            onChange={(e) => setGeminiKey(e.target.value)}
                            className="col-span-3"
                            type="password"
                            placeholder="AIzaSy..."
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="groq" className="text-right">
                            Groq API Key
                        </Label>
                        <Input
                            id="groq"
                            value={groqKey}
                            onChange={(e) => setGroqKey(e.target.value)}
                            className="col-span-3"
                            type="password"
                            placeholder="gsk_..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
