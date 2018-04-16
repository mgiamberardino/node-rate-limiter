import { RateLimiterStoreAdapter } from './rate.limiter';

export class MemoryStore implements RateLimiterStoreAdapter {
    
    private map: Map<String, Number> = new Map<String, number>();

    resetAll() {
        this.map = new Map<String, Number>();
    }

    increment(key:string):number{
        const oldValue = this.map.get(key) || new Number(0);
        const newValue = +oldValue + 1;
        this.map.set(key, newValue);
        return newValue;
    }
}