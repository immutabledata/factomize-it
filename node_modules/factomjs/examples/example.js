var factomjs = require('../lib/index.js')({host: 'http://demo.factom.org', port: '8088'});
var pubkey = 'wallet';

factomjs.creditbalance(pubkey);
factomjs.dblocksbyrange(0, 0);
factomjs.buycredit(pubkey, 100);
factomjs.submitentry('f4f614fd9b59fe26827137937d401e2b82125c4eb48f966e6e8d30f187184cb0', 'parking', 'Texas,MEY 279');
factomjs.entry('536f6d65206461746120746f207361766520696e20666163746f6d');
