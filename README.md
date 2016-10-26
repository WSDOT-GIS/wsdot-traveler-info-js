WSDOT Traveler Information API Client
=====================================

JavaScript client library for [WSDOT Traveler Information API].

* Supports Node and browser environments.
* Written in TypeScript.

[![Build Status](https://travis-ci.org/WSDOT-GIS/wsdot-traveler-info-js.svg?branch=master)](https://travis-ci.org/WSDOT-GIS/wsdot-traveler-info-js)

Browser needs proxy
-------------------

Since the [WSDOT Traveler Information API] does not currently support CORS, a proxy must be used in a browser environment.

Development Environment
-----------------------

[Visual Studio Code]

Testing
-------

This project uses [Jasmine] for testing in Node.js environment and [Karma] for testing in browser environment. To run both tests, run `npm test`.

[Karma] test runs on [PhantomJS] with the `web-security` option turned off to work around CORS issue. This allows the tests to pass without using a proxy.

Continuous Integration testing performed on Git push via [Travis-CI].

Usage
-----

### Install from NPM ###

```console
npm install wsdot-traveler-info --save
```

See the JavaScript and TypeScript files in the `spec` folder for usage examples.

[Jasmine]:http://jasmine.github.io/
[Karma]:http://karma-runner.github.io
[PhantomJS]:http://phantomjs.org/
[Travis-CI]:https://travis-ci.org/WSDOT-GIS/wsdot-traveler-info-js
[WSDOT Traveler Information API]:http://www.wsdot.wa.gov/Traffic/api/
[Visual Studio Code]:http://code.visualstudio.com/