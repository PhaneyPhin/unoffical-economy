import { SchemaRegistry } from "@kafkajs/confluent-schema-registry";
import { SCHEMA_REGISTRY_URL } from "../config";

const registry = new SchemaRegistry({ host: SCHEMA_REGISTRY_URL })

export default registry