import { MemoryStore } from "./memory.store";

export interface RateLimiterStoreAdapter {
    resetAll():void;
    increment(key:string):number;
}

export interface KeyMapper {
    (req: any): string;
}

export interface RateLimiterOptions {
    requestsLimit?: number;
    timeWindow?: number;
    keyMapper:KeyMapper;
    store?: RateLimiterStoreAdapter;
}

export class RateLimiter {
    public static readonly DEFAULT_REQUESTS_LIMIT = 100;
    public static readonly DEFAULT_TIME_WINDOW = 1000;
    public static readonly DEFAULT_OPTIONS = {
        requestsLimit: RateLimiter.DEFAULT_REQUESTS_LIMIT,
        timeWindow: RateLimiter.DEFAULT_TIME_WINDOW
    };
    private options:RateLimiterOptions;;
    private store: RateLimiterStoreAdapter;
    private isRunning:boolean = false;
    private timeoutId: NodeJS.Timer;

    constructor(options:RateLimiterOptions) {
        this.options = Object.assign({}, RateLimiter.DEFAULT_OPTIONS, options);
        this.store = options && options.store 
            ? options.store 
            : new MemoryStore();
    }

    private cyclicReset() {
        this.store.resetAll();
        this.timeoutId = setTimeout(() => this.cyclicReset(), this.options.timeWindow);
    }

    start() {
        if (this.isRunning) {
            throw new Error('This RateLimiter is already running');
        }
        this.isRunning = true;
        this.cyclicReset();
    }

    stop() {
        if (!this.isRunning) {
            throw new Error('This RateLimiter is not running');
        }
        clearTimeout(this.timeoutId);
        this.isRunning = false;
        this.store.resetAll();
    }

    skip(req: any):boolean {
        return false;
    }

    isValid(req: any):boolean {
        if (!this.isRunning || this.skip(req)){
            return true;
        }
        const key = this.options.keyMapper(req);
        const calls = this.store.increment(key);
        if (calls > this.options.requestsLimit){
            return false;
        }
        return true;
    }

    reset(){
        this.stop();
        this.store.resetAll();
        this.start();
    }
}

export default RateLimiter;