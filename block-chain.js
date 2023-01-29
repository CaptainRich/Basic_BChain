// Classes for block chain manipulation.

// Import the crypto-hashing function from the nodejs package.
const SHA256 = require( 'crypto-js/sha256');

// Import the 'moment' library for date/time functions.
const moment = require( 'moment' );

// Define what a "block" looks like/contains.
class Block{
    constructor( indexNum, timeStamp, nonce, blockData, previousHash = "" ) {
       // indexNum     - the number of the block in the chain (not really needed since the position of the 
       //                block in the chain determines the block number.)
       // timeStamp    - the date/time the block was created/added to the chain
       // nonce        - a random number determined to make the hash start with '0000' (num_zeros)
       // blockData    - the data contained in the block - this can be complex (tokens, transactions, etc.)
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

        // Number of leading zeros needed in the hash.  If this is changed, make the same change below
        // in the isChainValid method.
        var num_zeros = 4;           

        // Get a string with the needed number of zeros.
        var needed_zeros = Array(num_zeros+1).join("0");

        // Get the hash of the block (same as 'calculateHash' above)
        var blockHash = SHA256( this.index + this.timeStamp + 
                                this.nonce + JSON.stringify(this.blockData) + this.previousHash ).toString();

        // Get the leading 4 characters, which we ultimately want to be '0000'.
        var leadingZ = blockHash.slice(0,num_zeros);

        // As long as the leading 'num_zeros' characters are NOT all zeroes, increment the 'nonce' and try again.      
        while( leadingZ != needed_zeros ) {
            this.nonce++;
            blockHash = SHA256( this.index + this.timeStamp + 
                                this.nonce + JSON.stringify(this.blockData) + this.previousHash ).toString();
            leadingZ  = blockHash.slice(0,num_zeros);
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
    // The "index", "nonce" and "previous hash" are set to zero.
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

        // Loop over all the blocks in the chain and verify their data.  (Skip the 'genesis' block.)
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
            // Number of leading zeros needed in the hash.  If this is changed, make the same change above
            // in the nonceBlock method.
            var num_zeros = 4;           

            // Get a string with the needed number of zeros.
            var needed_zeros = Array(num_zeros+1).join("0");

            const first4 = currentBlock.hash.slice(0,num_zeros);
            if( first4 != needed_zeros ) {
                return "No, invalid nonce/hash for block: " + i;
            }
        }

        // If we get this far, the chain is valid.
        return "yes";
    }
}


module.exports.BlockChain = BlockChain;
module.exports.Block      = Block;