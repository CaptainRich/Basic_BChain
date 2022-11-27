// This is the main file for the Basic_Block_Chain demo program.

// Import the crypto-hashing function from the nodejs package.
const SHA256 = require( 'crypto-js/sha256');

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
       this.nonce        = '';                     // don't know this yet
       this.blockData    = blockData;
       this.previousHash = previousHash;
       this.hash         = this.calculateHash();   // determine the hash of the current block

    }

    // Define the method/function to compute he hash of the current block
    calculateHash() {
        // Use the hashing function to compute the hash of the block, returned as a string
        return SHA256( this.index + this.timeStamp + 
                       this.nonce + JSON.stringify(this.blockData) + this.previousHash ).toString();

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
        return new Block(  0, "11/27/2022", 0, "Genesis Block", "0" );
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
        newBlock.hash = newBlock.calculateHash();

        // Here is where we determine the value of the 'nonce'.  Check if the hash begins with
        // '0000'.  If not, add 1 to the 'nonce' and repeat.

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
                return false;
            }

            // Check that the current block's previous hash value matches the hash of the previous block.
            if( currentBlock.previousHash != previousBlock.hash ) {
                return false;
            }
        }

        // If we get this far, the chain is valid.
        return true;
    }
}


//////////////////////////////////////////////////////////////////////////////////////
// Implement the block chain.

let bc = new BlockChain();             // this will also add/create the genesis block

// Add a few more blocks (note we make up the data here).
bc.addBlock( new Block( 1, "11/3/2022", 0, {data_amount: 4}  ) );
bc.addBlock( new Block( 2, "11/5/2022", 0, {data_amount: 14} ) );
bc.addBlock( new Block( 3, "11/6/2022", 0, {data_amount: 24} ) );

// Now dump out the blocks to the console
console.log( JSON.stringify( bc, null, 4 ) );

// Verify the chain
var valid = "false";
if( bc.isChainValid() ) {
    valid = "true";
}

console.log( "Is the chain valid?  " + valid );
