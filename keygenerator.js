// Import the library for private/public key generation
const EC = require( 'elliptic').ec;

// Create an instance of the elliptic library
const ec = new EC( 'secp256k1' );     // specify the elliptic curve to use


// Generate/obtain the keys, as 'hex' strings.
const key        = ec.genKeyPair();
const publicKey  = key.getPublic( 'hex' );
const privateKey = key.getPrivate( 'hex' );

console.log();
console.log( 'Public key is: ', publicKey );
console.log( 'Private key is: ', privateKey );
