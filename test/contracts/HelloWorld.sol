/*
SPDX-License-Identifier: MIT
*/
pragma solidity ^0.8.18;

contract HelloWorld {
    // Log string message in transaction
    event PrintHelloWorld(string message);

    /**
     * Call event to log a message
     */
    function logMessage() public {
        emit PrintHelloWorld("Hello World!");
    }

    /**
     * Return "Hello World!"
     *
     * @return {string memory} "Hello World"
     */
    function sayHelloWorld() public pure returns (string memory) {
        return "Hello World!";
    }

    /**
     * Call event to log a message and return "Hello World!"
     *
     * @return {string memory} "Hello World"
     */
    function logAndReturnHelloWorld() public returns (string memory) {
        emit PrintHelloWorld("Hello World!");
        return "Hello World!";
    }
}
