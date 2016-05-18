/*
Global variables
*/

// Notary contract instance
var notary;
// List of accounts
var accounts;
// Current account used for demo
var account;


/*
UI
*/

// Updates registerStatus in UI
function setRegisterStatus(message) {
    var status = document.getElementById("registerStatus");
    status.innerHTML = message;
};

// Updates checkStatus in UI
function setCheckStatus(message) {
    var status = document.getElementById("checkStatus");
    status.innerHTML = message;
};


/*
Interactions with contract
*/

// Registers a proof of existence
function register() {
    // Gets data from form
    var comment = document.getElementById("registerComment").value,
        file = document.getElementById("registerFile").files[0],
        reader = new FileReader(),
        blob = file.slice(0, file.size);

    // Hashes and registers the proof when file has been readed
    reader.onloadend = function(evt) {
        if (evt.target.readyState == FileReader.DONE) {
            var data = evt.target.result;
            // Hashes the file with SHA3 keccak-256
            var hash = "0x" + web3.sha3(data);

            var hash2 = web3.sha3("Some string to be hashed");
            console.log("hash2" + hash2);
            // Registers the proof
            notary.registerProof(hash, comment, {from: account}).then(function() {
                setRegisterStatus("Registration submitted");
            }).catch(function(e) {
                console.log(e);
                setRegisterStatus("Error encountered while submitting a proof");
            });
        }
    };

    // Reads the file
    reader.readAsBinaryString(blob);
}

// Checks a proof of existence
function check() {
    // Gets data from form
    var file = document.getElementById("checkFile").files[0],
        reader = new FileReader(),
        blob = file.slice(0, file.size);

    // Hashes and registers the proof when file has been readed
    reader.onloadend = function(evt) {
        if (evt.target.readyState == FileReader.DONE) {
            var data = evt.target.result;
            // Hashes the file with SHA3 keccak-256
            var hash = "0x" + web3.sha3(data);
            // Registers the proof
            notary.checkProof.call(hash).then(function(success) {
                if (!success) {
                    setCheckStatus("Proof not found"); 
                } else {
                    // Gets metadata associated to the proof
                    notary.getMetadata.call(hash).then(function(metadata) {
                        var hash = metadata[0],
                            sender = metadata[1],
                            timestamp = metadata[2].valueOf();
                            comment = metadata[3];
                        var status = "Proof found (" + hash + "-" + timestamp + "-" + sender + "-" + comment + ")";
                        setCheckStatus(status);
                    }).catch(function(e) {
                        console.log(e);
                        setCheckStatus("Error encountered while checking a proof");
                    });
                } 
            }).catch(function(e) {
                console.log(e);
                setCheckStatus("Error encountered while checking a proof");
            });
        }
    };

    // Reads the file
    reader.readAsBinaryString(blob);
}



/*
Initialization
*/

// Initializes web3 events handlers
function initializeWeb3EventHandlers() {
    // Initializes a function handler for notary.ProofAdded event
    var proofAddedEvent = notary.ProofAdded(function(error, result) {
        if (!error) {
            var hash = result.args.hash,
                timestamp = result.args.timestamp.valueOf(),
                sender = result.args.sender,
                comment = result.args.comment,
                status = "Registration processed (" + hash + "-" + timestamp + "-" + sender + "-" + comment + ")";
            setRegisterStatus(status);
        }
    });

    // Initializes a function handler for notary.ProofAlreadyRegistered event
    var proofAlreadyRegisteredEvent = notary.ProofAlreadyRegistered(function(error, result) {
        if (!error) {
            var hash = result.args.hash,
                timestamp = result.args.timestamp.valueOf(),
                status = "Proof already registered (" + hash + "-" + timestamp + ")";
            setRegisterStatus(status);
        }
    });
}

// Initializes accounts
function initializeAccounts() {
    web3.eth.getAccounts(function(err, accs) {
        if (err != null) {
            alert("There was an error fetching your accounts.");
            return;
        }

        if (accs.length == 0) {
            alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
            return;
        }

        accounts = accs;
        account = accounts[0];
    });
}

// Initialization on load of window
window.onload = function() {
    // Gets the instance of the deployed notaray contract
    notary = Notary.deployed();
    // Initialize accounts used for this test
    initializeAccounts();
    // Initializes handlers listening to contract events
    initializeWeb3EventHandlers();
}
