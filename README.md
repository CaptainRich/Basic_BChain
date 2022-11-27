# Basic_Block_Chain


Richard Ay, November 2022

## Table of Contents
* [Project Objective](#project-objective)
* [Technologies Used](#technologies-used)
* [Program Logic](#program-logic)
* [Application Screen Shot](#application-screen-shot)


## Project Objective
This program is an example of how to setup a block chain.  Details of a block chain are included:
- what is a block
- what does a block contain
- what is a block chain
- how does security for the block/chain work

## Technologies Used
* The NPM package crypto-js.

## Program Logic
As the application starts (from the command line with 'node index') a connection to a MySQL database is setup.  This connection is used in all subsequent access to the 'staff_db' database.

The application then presents the user with a menu of possible actions (as discussed in 'acceptance criteria #1' above).  This menu is redisplayed after each action selected by the user.  Each action invokes its own function to perform its task, sometimes requesting additional information from the user.  The data displayed is acquired from the database using 'SELECT' statements, with various 'JOINs' as needed to reference multiple tables.

In setting up the environment for this application, MySQL is started from the command line and then the 'schema' and 'seeds' files are used to define data for the initial database.  

The source code for this application is divided into modules based on the various functions of the 'employee'.  The main routine in the root folder (index.js) connects to the database, then invokes the main menu.  The main menu routine, as well as the other modules (departments.js, employees.js, and roles.js) are in the /db_routines subdirectory.  The actual database (staff_db) is located in 'C:\ProgramData\MySQL\MySQL Server 8.0\Data'.


## Application Screen Shot
![Basic_BChain Image](./screen-capture.jpg)