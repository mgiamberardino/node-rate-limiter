# Agnostic Rate Limiter

## What's it?

Typescript Rate Limiter implementation. This implementation allows you to define several things like the key to map the requests, an skip function to determine when so skip request from limiter, etc. Further on the readme you can read about the different configurations.

## Installation

`npm install --save @mgiamberardino/node-rate-limiter`

## How to use it?

ES6:
```
import RateLimiter from '@mgiamberardino/node-rate-limiter';

const limiter = new RateLimiter({ options });
limiter.start();
...
//Express usage example
expressApp.use((req, res, next) => {
    if (limiter.isValid(req)){
        return next();
    }
    throw new Error('Request rejected');
});
...
```

## Options

### Request Limit

### Key Mapper

### Time Window

### Skip Function