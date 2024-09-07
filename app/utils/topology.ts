interface Processor {
    name: string;
    stores: string[];
    upstream: string[];
    downstream: string[];
};

interface Source {
    name: string;
    topics: string[];
    downstream: string[];
};

interface Sink {
    name: string;
    topic: string;
    upstream: string[];
};

interface Subtopology {
    name: string;
    sources: Source[];
    processors: Processor[];
    sinks: Sink[];
};

export interface Topology {
    name: string;
    subtopologies: Subtopology[];
};


export function parseTopologyString(topology_string: string): Topology {

    const topology: Topology = {
        name: "",
        subtopologies: []
    };

    const subtopology_identifier = /Sub-topology:/;
    const source_processor_sink_identifier = /(Source:|Processor:|Sink:)/;
    const right_arrow_identifier = /-->/
    const left_arrow_identifier = /<--/
    const topics_identifier = /\(topics:/
    const topic_identifier = /\(topic:/
    const stores_identifier = /\(stores:/

    // remove leading `Topologies:`, leading and trailing whitespace from each line
    const trimmed_topology_string = topology_string.replace(/^Topologies:/, "").replace(/^\s*/gm, '').replace(/\s+$/gm, '');

    const subtopology_strings = trimmed_topology_string.split(subtopology_identifier).filter((x) => x !== "")

    for (const subtopology_string of subtopology_strings) {
        const subtopology: Subtopology = {
            name: "",
            sources: [],
            processors: [],
            sinks: []
        };

        const subtopology_name = subtopology_string.split('\n')[0].trim();
        const subtopology_string_without_name = subtopology_string.replace(subtopology_name, "").trim();
        const source_processor_sink_strings = subtopology_string_without_name.split(source_processor_sink_identifier).filter((x) => x !== "");

        subtopology.name = subtopology_name;

        // Iterate over the split string array and categorize the sections
        for (let i = 0; i < source_processor_sink_strings.length; i += 2) {
            const type = source_processor_sink_strings[i].trim(); // "Source:", "Processor:", or "Sink:"
            const details = source_processor_sink_strings[i + 1].trim(); // The details following the type

            if (type === "Source:") {
                const first_line = details.split('\n')[0].trim();
                const name = first_line.split(topics_identifier)[0].trim();
                const topics_string = first_line.split(topics_identifier)[1].trim().replace(/\)$/, '');
                const topics = topics_string.replace(/\[|\]/g, "").split(',').map((x) => x.trim());
                const downstream = details.split('\n').filter((x) => x.match(right_arrow_identifier)).map((x) => x.split(right_arrow_identifier)[1].split(',').map((x) => x.trim())).flat();
                const source: Source = {
                    name: name,
                    topics: topics,
                    downstream: downstream.filter((x) => x !== "none")
                };
                subtopology.sources.push(source);
            }

            if (type === "Processor:") {
                const first_line = details.split('\n')[0].trim();
                const name = first_line.split(stores_identifier)[0].trim();
                const stores_string = first_line.split(stores_identifier)[1].trim().replace(/\)$/, '');
                const stores = stores_string.replace(/\[|\]/g, "").split(',').map((x) => x.trim()).filter((x) => x !== "");
                const upstream = details.split('\n').filter((x) => x.match(left_arrow_identifier)).map((x) => x.split(left_arrow_identifier)[1].split(',').map((x) => x.trim())).flat();
                const downstream = details.split('\n').filter((x) => x.match(right_arrow_identifier)).map((x) => x.split(right_arrow_identifier)[1].split(',').map((x) => x.trim())).flat();
                const processor: Processor = {
                    name: name,
                    stores: stores,
                    upstream: upstream.filter((x) => x !== "none"),
                    downstream: downstream.filter((x) => x !== "none")
                };
                subtopology.processors.push(processor);
            }

            if (type === "Sink:") {
                const first_line = details.split('\n')[0].trim();
                const name = first_line.split(topic_identifier)[0].trim();
                const topic_string = first_line.split(topic_identifier)[1].trim().replace(/\)$/, '');
                const topic = topic_string.trim();
                const upstream = details.split('\n').filter((x) => x.match(left_arrow_identifier)).map((x) => x.split(left_arrow_identifier)[1].split(',').map((x) => x.trim())).flat();
                const sink: Sink = {
                    name: name,
                    topic: topic,
                    upstream: upstream.filter((x) => x !== "none"),
                };
                subtopology.sinks.push(sink);
            }

        }
        topology.subtopologies.push(subtopology);
    }

    console.log(topology);
    return topology;
}
