import RateLimiter, { RateLimiterOptions, KeyMapper } from './index';
const expect = require('expect.js');

describe('Rate Limiter', () => {
    describe('Using default limits and ip keyMapper', () => {
        const keyMapper:KeyMapper = (req) => req.ip;
        const limiter = new RateLimiter({ keyMapper });
        beforeEach(() => {
            limiter.start();
        });
        afterEach(() => {
            limiter.stop();
        });
        it(`should reject req after being made ${RateLimiter.DEFAULT_REQUESTS_LIMIT} inside ${RateLimiter.DEFAULT_TIME_WINDOW}ms time window`, () => {
            const req = {
                ip: '1.1.1.1',
            };
            Array.from(Array(RateLimiter.DEFAULT_REQUESTS_LIMIT)).forEach(() => limiter.isValid(req));
            expect(limiter.isValid(req)).not.to.be.ok();
        });
        it(`should accept req which has reached limit after ${RateLimiter.DEFAULT_TIME_WINDOW}ms time window`, () => {
            const req = {
                ip: '1.1.1.1',
            };
            Array.from(Array(RateLimiter.DEFAULT_REQUESTS_LIMIT)).forEach(() => limiter.isValid(req));
            setTimeout(() => {
                expect(limiter.isValid(req)).to.be.ok();
            }, RateLimiter.DEFAULT_TIME_WINDOW);
        });
        it(`should accept req which has reached limit after a reset all inside time window`, () => {
            const req = {
                ip: '1.1.1.1',
            };
            Array.from(Array(RateLimiter.DEFAULT_REQUESTS_LIMIT)).forEach(() => limiter.isValid(req));
            limiter.reset();
            expect(limiter.isValid(req)).to.be.ok();
        });
        it('should throw an error when running and try to start', () => {
            let exception = false;
            try {
                limiter.start();                
            } catch (e) {
                exception = true;
            }
            expect(exception).to.be.ok();
        })
        it('should throw an error when not running and try to stop', () => {
            limiter.stop();
            expect(limiter.stop).to.throwError();
            limiter.start();
        })
    });
});