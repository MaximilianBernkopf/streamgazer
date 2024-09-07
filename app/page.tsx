'use client';

import { useState, useEffect } from "react";
import { sampleTopologySmallBad, sampleTopologySmallGood, sampleTopologyWithStoreBad, sampleTopologyWithStoreGood } from "./sampleTopologies";

export default function Home() {
  const [inputText, setInputText] = useState("");

  // On component mount, check if there is saved text in localStorage and restore it
  useEffect(() => {
    const savedText = localStorage.getItem("inputText");
    if (savedText) {
      setInputText(savedText);
    }
  }, []);

  // Update localStorage whenever inputText changes
  useEffect(() => {
    localStorage.setItem("inputText", inputText);
  }, [inputText]);

  const handleMermaidRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    const encodedText = encodeURIComponent(inputText);
    window.location.href = `/streamgazer/mermaid?text=${encodedText}`; // TODO: Handle base URL correctly
  };

  const handleExcalidrawRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    const encodedText = encodeURIComponent(inputText);
    window.location.href = `/streamgazer/excalidraw?text=${encodedText}`; // TODO: Handle base URL correctly
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            target="_blank"
            rel="noopener noreferrer"
          >
            StreamGazer - A Kafka Streams Topology Visualizer
          </a>
        </div>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://maximilianbernkopf.github.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            By Maximilian Bernkopf
          </a>
        </div>
      </div>
      <div className="w-full max-w-2xl">
        <div className="flex justify-center space-x-4 mb-4">
          <button
            onClick={() => setInputText(sampleTopologySmallBad)}
            className="w-full mx-2 my-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-700 text-white border border-gray-500 rounded-lg shadow-md hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 transition-transform transform hover:scale-105 focus:outline-none"
          >
            Stateless Bad
          </button>
          <button
            onClick={() => setInputText(sampleTopologySmallGood)}
            className="w-full mx-2 my-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-700 text-white border border-gray-500 rounded-lg shadow-md hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 transition-transform transform hover:scale-105 focus:outline-none"
          >
            Stateless Good
          </button>
          <button
            onClick={() => setInputText(sampleTopologyWithStoreBad)}
            className="w-full mx-2 my-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-700 text-white border border-gray-500 rounded-lg shadow-md hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 transition-transform transform hover:scale-105 focus:outline-none"
          >
            Stateful Bad
          </button>
          <button
            onClick={() => setInputText(sampleTopologyWithStoreGood)}
            className="w-full mx-2 my-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-700 text-white border border-gray-500 rounded-lg shadow-md hover:bg-gradient-to-r hover:from-gray-700 hover:to-gray-600 transition-transform transform hover:scale-105 focus:outline-none"
          >
            Stateful Good
          </button>
        </div>

        <div className="mb-4 w-full lg:mb-8 lg:max-w-2xl">
          <textarea
            placeholder="Enter your text here"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
            rows={20}
          />
        </div>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
        <a
          href=""
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Ascii Art{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Coming soon...
          </p>
        </a>

        <a
          href="/mermaid"
          onClick={handleMermaidRedirect}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Mermaid{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            A mermaid diagram of your topology, recommended for markdown documents.
          </p>
        </a>

        <a
          href="/excalidraw"
          onClick={handleExcalidrawRedirect}
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            Excalidraw{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            A visual representation of your topology using Excalidraw. Best used for additional annotations.
          </p>
        </a>

        <a
          href=""
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
        >
          <h2 className="mb-3 text-2xl font-semibold">
            ReactFlow {" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className="m-0 max-w-[30ch] text-balance text-sm opacity-50">
            Coming soon...
          </p>
        </a>
      </div>
    </main>
  );
}
