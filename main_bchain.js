// This is the main file for the Basic_Block_Chain demo program.

// Import the crypto-hashing function from the nodejs package.
const SHA256 = require( 'crypto-js/sha256');

// Import the 'moment' library for date/time functions.
const moment = require( 'moment' );

// Define what a "block" looks like/contains.
class Block{
    constructor( indexNum, timeStamp, nonce, blockData, previousHash = "" ) {
       // indexNum     - the number of the block in the chain
       // timeStamp    - the date/time the block was created/added to the chain
       // nonce        - a random number determined to make the hash start with '0000'
       // blockData    - the data contained in the block - this can be complex
       // previousHash - the hash of the previous/preceding block, to insure integrity of the chain

       this.indexNum     = indexNum;
       this.timeStamp    = timeStamp;
       this.nonce        = '';                      // don't know this yet
       this.blockData    = blockData;
       this.previousHash = previousHash;
       this.hash         = this.nonceBlockHash();   // determine the hash of the current block

    }

    // Define the method/function to compute he hash of the current block
    calculateHash() {
        // Use the hashing function to compute the hash of the block, returned as a string
        return SHA256( this.index + this.timeStamp + 
                       this.nonce + JSON.stringify(this.blockData) + this.previousHash ).toString();

    }

    // Define the method/function to determine the proper 'nonce' for a (new) block.
    nonceBlockHash() {
        // Get the hash of the block (same as 'calculateHash' above)
        var blockHash = SHA256( this.index + this.timeStamp + 
                                this.nonce + JSON.stringify(this.blockData) + this.previousHash ).toString();

        // Get the leading 4 characters, which we ultimately want to be '0000'.
        var leading4 = blockHash.slice(0,4);

        // As long as the leading 4 characters are NOT '0000'', increment the 'nonce' and try again.
        while( leading4 != "0000" ) {
            this.nonce++;
            blockHash = SHA256( this.index + this.timeStamp + 
                                this.nonce + JSON.stringify(this.blockData) + this.previousHash ).toString();
            leading4  = blockHash.slice(0,4);
        }

        return blockHash;
    }
}

// Define what a "block chain" looks like/contains, and its methods.
class BlockChain{
    constructor(){
        // The block chain is an array of blocks, the first of which is the 'genesis block".
        this.chain = [ this.createGenesisBlock() ];
    }

    // The first block on a chain is the "genesis" block and is created manually.
    createGenesisBlock() {
        let timestamp = moment().format();
        return new Block(  0, timestamp, 0, "Genesis Block", "0" );
    }

    // Method to get/return the last block.
    getLatestBlock() {
        return this.chain[ this.chain.length-1 ];
    }

    // Method to add a new block to the chain.
    addBlock( newBlock ) {
        // Set the value of the previous block's hash in the current block
        newBlock.previousHash = this.getLatestBlock().hash;

        // Since the properties of the current block were just changed, its hash must be
        // recomputed.
        newBlock.hash = newBlock.nonceBlockHash();

        // Add the new block to the chain
        this.chain.push( newBlock );
    }

    // Add validation for the chain.
    isChainValid() {
        // No need to check the first block (index = 0) since we manually created it.

        // Loop over all the blocks in the chain and verify their data.
        for( let i = 1; i < this.chain.length; i++ ) {
            // Grab the current and previous blocks
            const currentBlock  = this.chain[i];
            const previousBlock = this.chain[i-1];

            // Recompute the hash of the current block and make sure it matches
            if( currentBlock.hash != currentBlock.calculateHash() ) {
                return "No, bad block hash for block: " + i;
            }

            // Check that the current block's previous hash value matches the hash of the previous block.
            if( currentBlock.previousHash != previousBlock.hash ) {
                return "No, previous hash mismatch for block: " + i;
            }

            // Check that (based on the 'nonce') the hash of the current block begins with '0000'
            const first4 = currentBlock.hash.slice(0,4);
            if( first4 != "0000" ) {
                return "No, invalid nonce/hash for block: " + i;
            }
        }

        // If we get this far, the chain is valid.
        return "yes";
    }
}

//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
// Implement the block chain.

let bc        = new BlockChain();             // this will also add/create the genesis block
let timestamp = 0;

// Add a few more blocks (note we make up the data here).
timestamp = moment().format();
bc.addBlock( new Block( 1, timestamp, 0, {data_amount: 4}  ) );

timestamp = moment().format();
bc.addBlock( new Block( 2, timestamp, 0, {data_amount: 14} ) );

timestamp = moment().format();
bc.addBlock( new Block( 3, timestamp, 0, {data_amount: 24} ) );

// Dump out the chain of blocks to the console
console.log( JSON.stringify( bc, null, 4 ) );

// Verify the chain
var valid = bc.isChainValid();
console.log( "Is the chain valid?  " + valid );

// Alter the data in block 2, to invalidate the chain.
bc.chain[2].blockData = {data_amount: 15};
bc.chain[2].hash      = bc.chain[2].calculateHash();   // recalculate the hash, attempting to cover up the data change

console.log( " " );
console.log( "/////////////////////////////" );
console.log( "Altered chain is now:" );
console.log( JSON.stringify( bc, null, 4 ) );
var valid = bc.isChainValid();
console.log( "Is the chain valid?  " + valid );

