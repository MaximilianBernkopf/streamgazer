import { Topology } from './topology';
import { parseTopologyString } from './topology';

function sanitize(input: string): string {
  // remove 10 digits postfix from the end of the string
  return input.replace(/-\d{10}$/, "");
}

function convertTopologyToMermaid(topology: Topology): string {

  let mermaid_graph = "";

  // TODO: Integrate classDef with colors
  //       see: https://blog.devgenius.io/docs-as-code-diagrams-in-microservices-using-mermaid-f5b52fb53752
  mermaid_graph += `graph TD\n\n`;

  mermaid_graph += "    %%% Cross Topology Links\n";
  // handle topics and state stores separately since they are not inside the topology
  for (const subtopology of topology.subtopologies) {

    for (const source of subtopology.sources) {
      for (const topic of source.topics) {
        mermaid_graph += `    ${topic}{{${topic}}} --> ${source.name}(${sanitize(source.name)})\n`;
      }
    }

    for (const processor of subtopology.processors) {
      for (const store of processor.stores) {
        mermaid_graph += `    ${processor.name}(${sanitize(processor.name)}) --> ${store}[(${sanitize(store)})]\n`;
      }
    }

    for (const sink of subtopology.sinks) {
      mermaid_graph += `    ${sink.name}(${sanitize(sink.name)}) --> ${sink.topic}{{${sanitize(sink.topic)}}}\n`;
    }
  }

  mermaid_graph += "\n";

  mermaid_graph += "    %%% Sub-Topologies\n";
  // handle sources and sinks separately since they are not inside the topology
  for (const subtopology of topology.subtopologies) {
    mermaid_graph += `    subgraph "Sub-Topology: ${subtopology.name}"\n`;

    for (const processor of subtopology.processors) {
      for (const upstream of processor.upstream) {
        if (mermaid_graph.includes(`${upstream}(${sanitize(upstream)}) --> ${processor.name}(${sanitize(processor.name)})`)) {
          continue;
        } else {
          mermaid_graph += `        ${upstream}(${sanitize(upstream)}) --> ${processor.name}(${sanitize(processor.name)})\n`;
        }
      }
      for (const downstream of processor.downstream) {
        if (mermaid_graph.includes(`${processor.name}(${sanitize(processor.name)}) --> ${downstream}(${sanitize(downstream)})`)) {
          continue;
        } else {
          mermaid_graph += `        ${processor.name}(${sanitize(processor.name)}) --> ${downstream}(${sanitize(downstream)})\n`;
        }
      }
    }

    mermaid_graph += `    end\n`;
  }

  console.log(mermaid_graph);

  return mermaid_graph
}

function generateMermaidGraph(topology_string: string): string {
  if (typeof window === 'undefined') {
    return ''; // Avoid executing on the server
  } else {
    const topology = parseTopologyString(topology_string);
    const mermaid_graph = convertTopologyToMermaid(topology);

    return mermaid_graph;
  }
}

export default generateMermaidGraph;
