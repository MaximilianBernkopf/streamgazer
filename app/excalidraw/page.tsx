'use client';

import dynamic from 'next/dynamic';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import generateExcalidrawGraph from '../utils/excalidraw';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';
import React from 'react';

// Dynamically import ExcalidrawWrapper without SSR
const Excalidraw = dynamic(() => import("./excalidrawWrapper").then(mod => mod.default), { ssr: false });

function ExcalidrawPageContent() {
    const searchParams = useSearchParams();
    const [text, setText] = useState<string>('');
    const [diagram, setDiagram] = useState<ExcalidrawElement[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsClient(true);
        }
    }, []);

    useEffect(() => {
        const textParam = searchParams.get('text');
        if (textParam) {
            setText(decodeURIComponent(textParam));
        }
    }, [searchParams]);

    useEffect(() => {
        if (isClient && text) {
            setLoading(true);
            generateExcalidrawGraph(text).then(diagram => {
                setDiagram(diagram);
                setLoading(false);
            });
        }
    }, [isClient, text]);

    if (!isClient) {
        return <div>Loading Excalidraw...</div>;
    }

    if (loading) {
        return <div>Generating Diagram...</div>;
    }

    return (
        <div style={{ height: '100vh' }}>
            <Excalidraw
                initialData={{
                    elements: diagram,
                    appState: { theme: 'dark' },
                    scrollToContent: true,
                }}
            />
        </div>
    );
}

export default function ExcalidrawPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ExcalidrawPageContent />
        </Suspense>
    );
}
