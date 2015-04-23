FactomJS
========


Node.JS wrapper for Factom API

## Installation
 npm install factomjs --save

## Usage

var factomjs = require('factomjs')({host: 'http://demo.factom.org', port: '8088'});

var pubkey = 'wallet';

factomjs.creditbalance(pubkey);

factomjs.buycredit(pubkey, 100);

factomjs.dblocksbyrange(4, 4);
factomjs.submitentry('f4f614fd9b59fe26827137937d401e2b82125c4eb48f966e6e8d30f187184cb0', 'tipamoykluch', 'Another Hello from Moscow2!');
factomjs.entry('536f6d65206461746120746f207361766520696e20666163746f6d');

## Tests
 
NOPE

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

* 0.1.1 Added examples
* 0.1.0 Initial release
