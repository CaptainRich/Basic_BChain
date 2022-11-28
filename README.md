# Basic_Block_Chain


Richard Ay, November 2022

## Table of Contents
* [Project Objective](#project-objective)
* [Technologies Used](#technologies-used)
* [Program Logic](#program-logic)
* [References](#references)
* [Application Screen Shot](#application-screen-shot)


## Project Objective
This program is an example of how to setup a block chain.  Details of a block chain (explained in the comments) are included:
- what is a block
- what does a block contain
- what is a block chain
- how does security for the block/chain work
- how is the block chain verified

## Technologies Used
* The NPM package crypto-js.
* The NPM package moment.

## Program Logic
As the application starts (from the command line with 'node main_bchain').

The first operation is the instantiation of a new 'block chain', which also creates the 'genesis' block.  The program then adds three more blocks, with hard-wired data to the chain.  As each block is created, it's proper hash value is determined such that the hash begins with '0000'.  This is accomplished by incrementing the 'nonce' value until the resulting hash meets the '0000' criteria.  Additionally, 'moment()' is used to obtain the current date/time, used as the block's timestamp.

The program then dumps the chain to the terminal using 'console.log'.  The data can be visually verified proving the chain is valid.  The program then invokes its own 'validate' function to perform a series of checks on each block in the chain.  The checks performed are: is the block's hash is recomputed to verify it is the correct value, the block's previous hash value is compared to the previous block, the block's hash is check to verify it begins with '0000'.

The program then manually changes the data in block #2 and the validation function is used again, proving the validation function actually works.

## References
1) Block chain demo by Anders Brownworth: http://https://andersbrownworth.com/blockchain/
2) Create a blockchain in JavaScript: http://https://www.youtube.com/watch?v=zVqczFZr124
3) Block chain Basics and Cryptography, MIT Open Courseware: http://https://www.youtube.com/watch?v=zVqczFZr124

## Application Screen Shot
![Basic_BChain Image](./block_chain.jpg)