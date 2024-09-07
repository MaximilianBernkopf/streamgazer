import { MermaidConfig } from "@excalidraw/mermaid-to-excalidraw";
import { ExcalidrawElement } from "@excalidraw/excalidraw/types/element/types";

async function generateExcalidrawGraph(topology_string: string): Promise<ExcalidrawElement[]> {
  if (typeof window === "undefined") {
    // Avoid executing code on the server-side
    return [];
  } else {
    // Dynamically import Excalidraw-related libraries on the client-side
    const [parseMermaidToExcalidraw, convertToExcalidrawElements] = await Promise.all([
      import("@excalidraw/mermaid-to-excalidraw").then(mod => mod.parseMermaidToExcalidraw),
      import("@excalidraw/excalidraw").then(mod => mod.convertToExcalidrawElements)
    ]);

    const generateMermaidGraph = (await import('./mermaid')).default;

    const mermaid_graph = generateMermaidGraph(topology_string);

    const config: MermaidConfig = {
      themeVariables: {
        fontSize: "12",
      },
    };

    const { elements, files } = await parseMermaidToExcalidraw(mermaid_graph, config);
    const excalidrawElements = convertToExcalidrawElements(elements);

    return excalidrawElements;
  }
}

export default generateExcalidrawGraph;
