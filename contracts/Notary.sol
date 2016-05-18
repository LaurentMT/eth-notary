import "Owned.sol";
import "Mortal.sol";

/*
Contract implementing a basic virtual notary (proof of existence)
*/
contract Notary is Owned, Mortal {

    /*
    Fallback function
    */
    function () {
        // If ether is sent to this address, send it back
        throw;
    }


    /*
    Structures
    */

    // Metadata associated to a proof of existence
    struct ProofMetadata {
        // Address which has submitted the proof
        address sender;
        // Timestamp
        uint timestamp;
        // Comment
        string comment;
    }


    /*
    Events
    */
    // Proof successfully added into the book
    event ProofAdded(bytes32 hash, address sender, uint timestamp, string comment);
    // Proof already registered in the book
    event ProofAlreadyRegistered(bytes32 hash, uint timestamp);


    /*
    State variables
    */

    // book storing proofs of existence submitted to the contract
    // Maps the hash of a file (SHA3 keccak-256) with additional metadata
    mapping (bytes32 => ProofMetadata) book;

    
    /*
    Functions
    */

    /*
    Registers a proof of existence
    Arguments:
        _hash (bytes32) = hash of the document (SHA3 keccak-256)
        _comment (string) = additional comment associated to the proof
    */
    function registerProof(bytes32 _hash, string _comment) returns (bool) {
        // Checks documents isn't already registered
        if (checkProof(_hash)) {
            ProofAlreadyRegistered(_hash, now);
            return false;
        }
        // Registers the proof with the timestamp of the block
        book[_hash] = ProofMetadata(msg.sender, now, _comment);
        // Triggers a ProofAdded event
        ProofAdded(_hash, msg.sender, now, _comment);
        return true;
    }

    /*
    Checks for the existence of a proof
    Returns true if proof exists, otherwise returns false.
    Arguments:
        _hash (bytes32) = hash of the document to be checked (SHA3 keccak-256)
    */
    function checkProof(bytes32 _hash) constant returns (bool) {
        return book[_hash].sender != address(0x0);
    }

    /*
    Gets metadata associated to a proof
    Returns a ProofMetadata.
    Arguments:
        _hash (bytes32) = hash of the document (SHA3 keccak-256)
    */
    function getMetadata(bytes32 _hash) constant returns (
        bytes32 hash, 
        address sender, 
        uint timestamp,
        string comment
    ){
        if (!checkProof(_hash)) return;
        
        sender = book[_hash].sender;
        timestamp = book[_hash].timestamp;
        comment = book[_hash].comment;
        return (_hash, sender, timestamp, comment);
    }

}