"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import mermaid from "mermaid";
import domtoimage from "dom-to-image";
import generateMermaidGraph from "../utils/mermaid";

function MermaidPageContent() {
    const searchParams = useSearchParams();
    const [text, setText] = useState("");
    const [diagram, setDiagram] = useState("");
    const [mermaidText, setmermaidText] = useState("");
    const [isClient, setIsClient] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const svgId = "mermaid-svg";

    useEffect(() => {
        if (typeof window !== "undefined") {
            setIsClient(true);
        }
    }, []);

    useEffect(() => {
        const textParam = searchParams.get("text");
        if (textParam) {
            setText(decodeURIComponent(textParam));
        }
    }, [searchParams]);

    useEffect(() => {
        if (isClient && text && window !== undefined) {
            renderDiagram(text);
        }
    }, [isClient, text]);

    useEffect(() => {
        if (isClient && typeof window !== "undefined" && diagram) {
            const svgElement = document.getElementById(svgId);
            if (svgElement && containerRef.current) {
                // Dynamically import svg-pan-zoom because i couldn't figure out how to make it work with SSR
                import("svg-pan-zoom").then((mod) => {
                    const panZoomInstance = mod.default(`#${svgId}`, {
                        zoomEnabled: true,
                        controlIconsEnabled: true,
                        fit: true,
                        center: true,
                    });

                    return () => panZoomInstance.destroy();
                }).catch((err) => console.error("Error loading svg-pan-zoom:", err));
            }
        }
    }, [isClient, svgId, diagram]);

    const renderDiagram = async (code: string) => {
        const element = containerRef.current;
        if (element) {
            const generatedDiagram = generateMermaidGraph(code);
            setmermaidText(generatedDiagram);
            const { svg } = await mermaid.render(svgId, generatedDiagram);

            element.innerHTML = svg.replace(/[ ]*max-width:[ 0-9\.]*px;/i, '') + `<style>svg { height: 100%; }</style>`;
            setDiagram(svg);
        }
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(mermaidText).then(() => {
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        });
    };

    const handleDownloadAsSvg = () => {
        const link = document.createElement("a");
        link.download = "mermaid-diagram.svg";
        link.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(diagram)}`;
        link.click();
    };

    const handleDownloadAsPng = () => {
        const link = document.createElement("a");
        link.download = "mermaid-diagram.png";
        domtoimage.toPng(containerRef.current as Node).then((dataUrl) => {
            link.href = dataUrl;
            link.click();
        }
        );
    };

    if (!isClient) {
        return null;
    }

    return (
        <main className="flex flex-col items-center justify-start h-screen p-4">
            <div className="flex items-center justify-center space-x-4 mb-6">
                <button
                    onClick={handleCopyToClipboard}
                    className="w-auto px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-700 text-white border border-gray-500 rounded-lg shadow-md hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 transition-transform transform hover:scale-105 focus:outline-none"
                >
                    {copySuccess ? (
                        <span>&#10003; Copied!</span>
                    ) : (
                        "Copy Text"
                    )}
                </button>
                <button
                    onClick={handleDownloadAsSvg}
                    className="w-auto px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-700 text-white border border-gray-500 rounded-lg shadow-md hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 transition-transform transform hover:scale-105 focus:outline-none"
                >
                    Download SVG
                </button>
                <button
                    onClick={handleDownloadAsPng}
                    className="w-auto px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-700 text-white border border-gray-500 rounded-lg shadow-md hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 transition-transform transform hover:scale-105 focus:outline-none"
                >
                    Download PNG
                </button>
            </div>

            {/* Full-Screen Diagram Container */}
            <div
                ref={containerRef}
                className="mermaid-container"
                style={{ width: "100%", height: "90%" }}
            >
            </div>
        </main >
    );
}

export default function MermaidPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MermaidPageContent />
        </Suspense>
    );
}
