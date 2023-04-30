// This is the main file for the Basic_Block_Chain demo program.

// Import our block chain classes
const {BlockChain, Block, Transaction} = require( './block-chain.js' );

// Import the 'moment' library for date/time functions.
const moment = require( 'moment' );

//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
// Implement the block chain.

let bc        = new BlockChain();             // this will also add/create the genesis block

// Create transactions for the block chain.  The addresses here are public keys to an individual's wallet.
bc.createTransaction( new Transaction( 'address1', 'address2', 150 ) );
bc.createTransaction( new Transaction( 'address2', 'address1', 40 ) );

// Now the transactions must be added to a block (mined).
console.log( "\nStarting the mining process ..." );
bc.minePendingTransactions( 'miners-address' );
console.log( "Balance for miner's address is:", bc.getBalanceOfAddress( 'miners-address' ) );

console.log( "\nStarting the mining process again ..." );
bc.minePendingTransactions( 'miners-address' );
console.log( "Balance for miner's address is:", bc.getBalanceOfAddress( 'miners-address' ) );




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

