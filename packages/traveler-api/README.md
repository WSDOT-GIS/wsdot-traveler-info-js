WSDOT Traveler Information API Client
=====================================

JavaScript client library for [WSDOT Traveler Information API].

* Supports Node and browser environments.
* Written in TypeScript.

Browser needs proxy
-------------------

Since the [WSDOT Traveler Information API] does not currently support [Cross-Origin Resource Sharing (CORS)][CORS], a proxy must be used in a browser environment.

Development Environment
-----------------------

[Visual Studio Code]

Testing
-------

This project uses [Jasmine] for testing.

Usage
-----

### Install from NPM ###

```console
npm install wsdot-traveler-info --save
```

See the JavaScript and TypeScript files in the `spec` folder for usage examples.

[CORS]:https://enable-cors.org/
[Jasmine]:https://jasmine.github.io/
[WSDOT Traveler Information API]:https://www.wsdot.wa.gov/Traffic/api/
[Visual Studio Code]:https://code.visualstudio.com/
