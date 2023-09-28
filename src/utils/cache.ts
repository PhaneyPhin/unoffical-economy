import { CACHE_TTL } from "../config";
import NodeCache from "node-cache";
const cache = new NodeCache({
    stdTTL: CACHE_TTL
});

export default cache