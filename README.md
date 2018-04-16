# Agnostic Rate Limiter

## What's it?

Typescript Rate Limiter implementation. This implementation allows you to define several things like the key to map the requests, an skip function to determine when so skip request from limiter, etc. Further on the readme you can read about the different configurations.

## Installation

`npm install --save @mgiamberardino/rate-limiter`

## How to use it?

ES6:
```
import { RateLimiter } from '@mgiamberardino/rate-limiter';
//const { RateLimiter } = require('@mgiamberardino/rate-limiter');

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

Using typescript you have an interface for the optiones:
```
import { RateLimiter, RateLimiterOptions } from '@mgiamberardino/rate-limiter';

const options:RateLimiterOptions = {
    keyMapper: ...,
    requestLimit: ...,
    timeWindow:...,
};
const limiter = new RateLimiter(options);
limiter.start();
...
```

### Request Limit

```
... = {
    ...
    requestLimit: 250, // The number of calls allowed for the same key previous to start blocking.
    ...
}
```
### Key Mapper
```
... = {
    ...
    keyMapper: (req) => req.session.user, // A function to determine an identifier for the request.
    ...
}
```
### Time Window
```
... = {
    ...
    timeWindow: 1000, // The time window in milliseconds in which the requests will be analyzed.
    ...
}
```
### Skip Function
```
... = {
    ...
    skipFunction: (req) => !req.session.user, // A function to determine if a request should be ignored by the rate limiter.
    ...
}
```