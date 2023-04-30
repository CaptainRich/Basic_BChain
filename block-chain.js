// Classes for block chain manipulation.

// Import the crypto-hashing function from the nodejs package.  Note that "crypto-js" must be installed from "npm".
const SHA256 = require( 'crypto-js/sha256');

// Import the 'moment' library for date/time functions.
const moment = require( 'moment' );

// Import the library for private/public key generation
const EC = require( 'elliptic').ec;

// Create an instance of the elliptic library
const ec = new EC( 'secp256k1' );     // specify the elliptic curve to use

// Define the size of the "nonce", the number of leading zeroes the block's hash must start with
const num_zeros = 4;

// Define what the block's data looks like (this could be a transaction in the cyrpto-currency arena).
// Transactions are typically "from" someone, "to" someone.
class Transaction{
    constructor( fromAddress, toAddress, dataAmount ){
        this.fromAddress = fromAddress;
        this.toAddress   = toAddress;
        this.dataAmount  = dataAmount;
    }
}

// Define what a "block" looks like/contains.
class Block{
    //constructor( indexNum, timeStamp, nonce, transactions, previousHash = "" ) {
    constructor( timeStamp, transactions, previousHash = "" ) {
       // indexNum     - the number of the block in the chain (not really needed since the position of the 
       //                block in the chain determines the block number.)
       // timeStamp    - the date/time the block was created/added to the chain
       // nonce        - a random number determined to make the hash start with '0000' (num_zeros)
       // blockData    - the data contained in the block - this can be complex (tokens, transactions, etc.)
       // previousHash - the hash of the previous/preceding block, to insure integrity of the chain

       //this.indexNum     = indexNum;
       this.timeStamp    = timeStamp;
       this.nonce        = 0;                      // don't know this yet
       this.transactions = transactions;
       this.previousHash = previousHash;
       this.hash         = this.nonceBlockHash();   // determine the hash of the current block

    }

    // Define the method/function to compute he hash of the current block
    calculateHash() {
        // Use the hashing function to compute the hash of the block, returned as a string
        return SHA256( this.timeStamp +  this.nonce + JSON.stringify(this.transactions) + this.previousHash ).toString();
    }

    // Define the method/function to determine the proper 'nonce' for a (new) block.  The block's hash is supposed to start with 4 zeroes.  This is one of the requirements of a valid block.  Some call this process "mining".
    nonceBlockHash() {       

        // Get a string with the needed number of zeros.
        var needed_zeros = Array(num_zeros+1).join("0");

        // Get the hash of the block (same as 'calculateHash' above)
        // var blockHash = SHA256( this.index + this.timeStamp + 
        //                         this.nonce + JSON.stringify(this.blockData) + this.previousHash ).toString();
        var blockHash = this.calculateHash();

        // Get the leading 4 characters, which we ultimately want to be '0000'.
        var leadingZ = blockHash.slice(0,num_zeros);

        // As long as the leading 'num_zeros' characters are NOT all zeroes, increment the 'nonce' and try again.      
        while( leadingZ != needed_zeros ) {
            this.nonce++;
            // blockHash = SHA256( this.index + this.timeStamp + 
            //                     this.nonce + JSON.stringify(this.blockData) + this.previousHash ).toString();
            blockHash = this.calculateHash();
            leadingZ  = blockHash.slice(0,num_zeros);
        }

        return blockHash;
    }

    // Obtain the hash of the block's data, which is what will be 'signed" with the private key.
    blockDataHash() {
        return SHA256( this.blockData ).toString();
    }

    // Setup the signing activity
    signBlockData( signingKey ) {

        // Verify the public keys match
        if( signingKey.getPUblic( 'hex' ) !== this.publicKey ) {
            throw new Error( 'You cannot sign a blockData that is not yours');
        }

        // Get the hash of the current block's data
        const hashData = this.blockDataHash();

        // Sign the data
        const signed = signingKey.sign( hashData, 'base64' );
        this.signature = signed.toDer( 'hex' );                    // 'toDer' is an encoding format
    }

    // Verify that the signing succeeded.
    isSigningValid() {
        if( this.publicKey === null )
            return true;                // possible in the mining reward instance

        if( !this.signature || this.signature.length === 0 )
            throw new Error( 'No signature in this block/transaction.' );

        /// The data has a signature, verify it is the correct signature.
        const publicKey = ec.keyFromPublic( this.publicKey, 'hex' );
        return publicKey.verify( this.calculateHash(), this.signature );

    }
}

// Define what a "block chain" looks like/contains, and its methods.
class BlockChain{
    constructor(){
        // The block chain is an array of blocks, the first of which is the 'genesis block".
        this.chain = [ this.createGenesisBlock() ];
        this.pendingTransactions = [];                // defined as an empty array
        this.miningReward        = 10;                // the reward for creating (mining) a block
    }

    // The first block on a chain is the "genesis" block and is created manually.  
    // The "index", "nonce" and "previous hash" are set to zero.
    createGenesisBlock() {
        let timestamp = moment().format();
        return new Block(  timestamp, "Genesis Block", "0" );
    }

    // Method to get/return the last block.
    getLatestBlock() {
        return this.chain[ this.chain.length-1 ];
    }

    // This is the initial function to create a block.
    // Method to add a new block to the chain.  "Mining" is the action of determining and adding the 'nonce'.
    // addBlock( newBlock, toAddress ) {
    //     // Set the value of the previous block's hash in the current block
    //     newBlock.previousHash = this.getLatestBlock().hash;

    //     // Since the properties of the current block were just changed, its hash must be
    //     // recomputed.
    //     newBlock.hash = newBlock.nonceBlockHash();    'mine' the block

    //     // Add the new block to the chain
    //     this.chain.push( newBlock );
    // }

    // Mine (create,add) a new block.
    minePendingTransactions( miningRewardAddress ){

        console.log( "In 'minePendingTransactions' ..." );
        console.log( "pendingTransactions: \n" );
        console.log( this.pendingTransactions );


        // miningRewardAddress  - the address of the miner's wallet where the reward is sent if mining is successful.
        let block = new Block( Date.now(), this.pendingTransactions );
        block.nonceBlockHash();
        console.log( "block mined: ", block );
       

        this.chain.push( block );
        this.pendingTransactions = [
            new Transaction( null, miningRewardAddress, this.miningReward )  // no "fromAddress" when creating (mining) a block
        ];

        console.log( "New block added (mined)." );
        console.log( "mining transaction added to pending: ", this.pendingTransactions );
    }

    // Put the current transaction into the "pending" array
    createTransaction( transaction ){
        this.pendingTransactions.push( transaction );
    }

    // Determine the balance of a specified address.
    getBalanceOfAddress( address ){
        let balance = 0;

        // Loop over all of the transactions in all of the blocks, looking for the specified address.  Update the balance accordingly.
        for( const block of this.chain ){
            for( const trans of block.transactions ) {
                if( trans.fromAddress == address ){
                   balance -= trans.dataAmount;            // reduce the balance since an amount was "sent". 
                }

                if( trans.toAddress == address ){
                    balance += trans.dataAmount;           // increase the balance since an amount is "received".
                }
            }
        }

        return balance;

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
            // Number of leading zeros needed in the hash.    
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
module.exports.Transaction  = Transaction;