// This is the main file for the Basic_Block_Chain demo program.

// Import our block chain classes
const {BlockChain, Transaction} = require( './block-chain.js' );

// Import the 'moment' library for date/time functions.
const moment = require( 'moment' );

// Import the library for private/public key generation
const EC = require( 'elliptic').ec;

// Create an instance of the elliptic library
const ec = new EC( 'secp256k1' );     // specify the elliptic curve to use

// Import the DOTENV package to utilize the secret keys in '.env'
require( 'dotenv' ).config();

//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

// Setup the public/private keys to be used.
const objKey1        = ec.keyFromPrivate( process.env.Private_key_1 );
const walletAddress1 = objKey1.getPublic( 'hex' );
const objKey2        = ec.keyFromPrivate( process.env.Private_key_2 );
const walletAddress2 = objKey2.getPublic( 'hex' );

// Implement the block chain.
let bc        = new BlockChain();             // this will also add/create the genesis block

// Create transactions for the block chain.  The addresses here are public keys to an individual's wallet.
const trans1 = new Transaction( walletAddress1, walletAddress2, 25 );
trans1.signTransaction( objKey1 );
bc.addTransaction( trans1 );

// const trans2 = new Transaction( walletAddress2, walletAddress1, 40 );
// trans2.signTransaction( objKey2 );
// bc.addTransaction( trans2 );

// Now the transactions must be added to a block (mined).
console.log( "\nStarting the mining process ..." );
bc.minePendingTransactions( walletAddress1 );
console.log( "Balance for miner's address is:", bc.getBalanceOfAddress( walletAddress1 ) );

console.log( "\nStarting the mining process again ..." );
bc.minePendingTransactions( walletAddress1 );
console.log( "Balance for miner's address is:", bc.getBalanceOfAddress( walletAddress1 ) );

console.log( JSON.stringify( bc, null, 4 ) );
console.log( "Is the blockchain valid?", bc.isChainValid() );


// This is the initial code, before adding 'transactions', that manually created the blocks in the chain.
// let timestamp = 0;
// let toAddress = 0;

// // Add a few more blocks (note we make up the data here).
// timestamp = moment().format();
// bc.addBlock( new Block( 1, timestamp, 0, {data_amount: 34, user: 'tom'}  ), toAddress );

// timestamp = moment().format();
// bc.addBlock( new Block( 2, timestamp, 0, {data_amount: 14, user: 'dick'} ), toAddress );

// timestamp = moment().format();
// bc.addBlock( new Block( 3, timestamp, 0, {data_amount: 24, user: 'harry'} ), toAddress );

// // Dump out the chain of blocks to the console
// console.log( JSON.stringify( bc, null, 4 ) );

// // Verify the chain
// var valid = bc.isChainValid();
// console.log( "Is the chain valid?  " + valid );

// // Alter the data in block 2, to invalidate the chain.
// bc.chain[2].blockData = {data_amount: 15, user: 'hacker'};
// bc.chain[2].hash      = bc.chain[2].calculateHash();   // recalculate the hash, attempting to cover up the data change

// console.log( " " );
// console.log( " " );
// console.log( " " );
// console.log( "///////////////////////////////////////////////////////////////" );
// console.log( "Altered (hacked) chain is now:" );
// console.log( JSON.stringify( bc, null, 4 ) );
// var valid = bc.isChainValid();
// console.log( "Is the chain valid?  " + valid );

