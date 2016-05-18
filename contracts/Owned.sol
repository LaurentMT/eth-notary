/*
Generic contract managing the ownership of the contract by a single address.
Contracts can inherit from Owned to implement this behavior
*/
contract Owned {

    /*
    State variables
    */

    // Address owning the contract
    address public owner;

    /*
    Constructor
    */
    function Owned() {
        owner = msg.sender;
    }

    /*
    Functions
    */

    /*
    Transfers contract ownership to a new address
    Arguments:
        _newOwner (address) = address of the new owner
    */
    function transferOwnership(address _newOwner) onlyOwner {
        owner = _newOwner;
    }

    /*
    Modifiers
    */

    /*
    Restricts execution to message owner
    */
    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _
    }

}