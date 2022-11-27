// This is the main file for the Basic_Block_Chain demo program.

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
       this.nonce        = '';              // don't know this yet
       this.blockData    = blockData;
       this.previousHash = previousHash;
       this.hash         = '';              // don't know this yet

    }


}