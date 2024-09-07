export const sampleTopologySmallBad = `Topologies:
   Sub-topology: 0
    Source: KSTREAM-SOURCE-0000000000 (topics: [input])
      --> KSTREAM-FILTER-0000000001
    Processor: KSTREAM-FILTER-0000000001 (stores: [])
      --> KSTREAM-MAPVALUES-0000000002
      <-- KSTREAM-SOURCE-0000000000
    Processor: KSTREAM-MAPVALUES-0000000002 (stores: [])
      --> KSTREAM-SINK-0000000003
      <-- KSTREAM-FILTER-0000000001
    Sink: KSTREAM-SINK-0000000003 (topic: output)
      <-- KSTREAM-MAPVALUES-0000000002
`

export const sampleTopologySmallGood = `Topologies:
  Sub-topology: 0
   Source: Customer_transactions_input_topic (topics: [input])
     --> filter_out_invalid_txns
   Processor: filter_out_invalid_txns (stores: [])
     --> Map_values_to_first_6_characters
     <-- Customer_transactions_input_topic
   Processor: Map_values_to_first_6_characters (stores: [])
     --> Mapped_transactions_output_topic
     <-- filter_out_invalid_txns
   Sink: Mapped_transactions_output_topic (topic: output)
     <-- Map_values_to_first_6_characters
`

export const sampleTopologyWithStoreBad = `Topologies:
  Sub-topology: 0
   Source: KSTREAM-SOURCE-0000000000 (topics: [input])
    --> KSTREAM-FILTER-0000000001
   Processor: KSTREAM-FILTER-0000000001 (stores: [])
     --> KSTREAM-AGGREGATE-0000000003
     <-- KSTREAM-SOURCE-0000000000
   Processor: KSTREAM-AGGREGATE-0000000003 (stores: [KSTREAM-AGGREGATE-STATE-STORE-0000000002])
     --> KTABLE-TOSTREAM-0000000004
     <-- KSTREAM-FILTER-0000000001
   Processor: KTABLE-TOSTREAM-0000000004 (stores: [])
     --> KSTREAM-SINK-0000000005
     <-- KSTREAM-AGGREGATE-0000000003
    Sink: KSTREAM-SINK-0000000005 (topic: output)
     <-- KTABLE-TOSTREAM-0000000004
`

export const sampleTopologyWithStoreGood = `Topologies:
 Sub-topology: 0
  Source: KSTREAM-SOURCE-0000000000 (topics: [input])
    --> KSTREAM-FILTER-0000000001
  Processor: KSTREAM-FILTER-0000000001 (stores: [])
    --> KSTREAM-AGGREGATE-0000000002
    <-- KSTREAM-SOURCE-0000000000
  Processor: KSTREAM-AGGREGATE-0000000002 (stores: [Purchase_count_store])
    --> KTABLE-TOSTREAM-0000000003
    <-- KSTREAM-FILTER-0000000001
  Processor: KTABLE-TOSTREAM-0000000003 (stores: [])
    --> KSTREAM-SINK-0000000004
    <-- KSTREAM-AGGREGATE-0000000002
  Sink: KSTREAM-SINK-0000000004 (topic: output)
    <-- KTABLE-TOSTREAM-0000000003
`
