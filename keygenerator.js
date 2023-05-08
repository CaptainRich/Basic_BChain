// Import the library for private/public key generation
const EC = require( 'elliptic').ec;

// Create an instance of the elliptic library
const ec = new EC( 'secp256k1' );     // specify the elliptic curve to use


// Generate/obtain the keys, as 'hex' strings.
const key        = ec.genKeyPair();             // generate the keys
const publicKey  = key.getPublic( 'hex' );      // extract the 'public' key
const privateKey = key.getPrivate( 'hex' );     // extract the 'private' key


// Display the public/private keys
console.log();
console.log( 'Public key is : ', publicKey );
console.log( 'Private key is: ', privateKey );
