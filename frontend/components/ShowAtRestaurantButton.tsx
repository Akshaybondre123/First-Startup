'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { QrCode, Copy, CheckCircle2, X } from 'lucide-react';

interface ShowAtRestaurantButtonProps {
    restaurantId: string;
    restaurantName: string;
}

export default function ShowAtRestaurantButton({ restaurantId, restaurantName }: ShowAtRestaurantButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const generateCode = () => {
        // Generate a unique code in format: WAMPIN-XXX
        const randomNum = Math.floor(100 + Math.random() * 900); // 3-digit random number
        const code = `WAMPIN-${randomNum}`;
        setGeneratedCode(code);
        setIsOpen(true);
    };

    const copyToClipboard = () => {
        if (generatedCode) {
            navigator.clipboard.writeText(generatedCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const closeModal = () => {
        setIsOpen(false);
        // Keep the code for a moment before clearing
        setTimeout(() => {
            setGeneratedCode(null);
            setCopied(false);
        }, 300);
    };

    return (
        <>
            <Button
                onClick={generateCode}
                className="w-full gap-2 rounded-full h-14 px-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-xl"
            >
                <QrCode className="h-5 w-5" /> Get Code
            </Button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <Card className="w-full max-w-md bg-white border-zinc-200 shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <CardContent className="p-8 relative bg-white">
                            {/* Close button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-100 transition-colors"
                            >
                                <X className="h-5 w-5 text-zinc-700" />
                            </button>

                            <div className="text-center space-y-6">
                                {/* Icon */}
                                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                    <QrCode className="h-8 w-8 text-white" />
                                </div>

                                {/* Title */}
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight mb-2 text-zinc-900">Your Visit Code</h3>
                                    <p className="text-zinc-600 text-sm">Show this code at {restaurantName}</p>
                                </div>

                                {/* Generated Code */}
                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200">
                                    <div className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                                        {generatedCode}
                                    </div>
                                </div>

                                {/* Copy Button */}
                                <Button
                                    onClick={copyToClipboard}
                                    className="w-full gap-2 rounded-full h-12 px-6 text-base font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                                >
                                    {copied ? (
                                        <>
                                            <CheckCircle2 className="h-5 w-5" /> Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-5 w-5" /> Copy Code
                                        </>
                                    )}
                                </Button>

                                {/* Info text */}
                                <p className="text-xs text-zinc-500 leading-relaxed">
                                    Present this code to the restaurant staff to verify your visit and unlock exclusive benefits.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </>
    );
}
