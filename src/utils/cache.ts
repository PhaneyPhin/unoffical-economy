import { CACHE_TTL } from "../config";

const NodeCache = require( "node-cache" );
const cache = new NodeCache();

export const setCache = (key: string, value: any) => {
    return cache.set(key, value, CACHE_TTL)
}

export const getCache = (key: string) => {
    return cache.get(key)
}