import "Owned.sol";

/*
Generic contract managing the death of the contract
Contracts can inherit from Mortal to implement this behavior
*/
contract Mortal is Owned {

    /*
    Kills the contract
    Action reserved to the owner
    */
    function kill() onlyOwner {
        selfdestruct(owner); 
    }
}