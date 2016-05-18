contract('Notary', function(accounts) {

    it("should register a proof correctly", function(done) {

        var notary = Notary.deployed(),
            hash1 = "0x4cacfb52c08d04cf99ccf56eee904e51bbd80fc5a7a70f250151b97c2fb3c093",
            comment1 = "This is comment 1";

        notary.registerProof(hash1, comment1).then(function() {
            // Checks that proof exists for hash1
            return notary.checkProof.call(hash1);

        }).then(function(successCheck) {
            // Verifies that proof was found for hash1
            assert.equal(successCheck.valueOf(), true, "Checking of proof failed");

        }).then(function() {
            // Gets metadata for hash1
            return notary.getMetadata.call(hash1);

        }).then(function(metadata) {
            // Verifies that metadata returned for hash1 are correct
            var hash = metadata[0],
                sender = metadata[1],
                timestamp = metadata[2];
                comment = metadata[3];
            assert.equal(hash.valueOf(), hash1, "Invalid hash");
            assert.equal(sender.valueOf(), sender, "Invalid sender");
            assert.equal(timestamp.valueOf(), timestamp, "Invalid timestamp");
            assert.equal(comment.valueOf(), comment1, "Invalid comment");
            
        }).then(done).catch(done);

    });


    it("should detect an unregistered proof correctly", function(done) {

        var notary = Notary.deployed(),
            hash2 = "0x4cacfb52c08d04cf99ccf56eee904e51bbd80fc5a7a70f250151b97c2fb3c094";

        // Checks that proof exists for hash1
        notary.checkProof.call(hash2).then(function(success) {
            // Verifies that proof wasn't found for hash2
            assert.equal(success.valueOf(), false, "Checking of proof failed");
        }).then(done).catch(done);

    });


    it("should reject the registration of a proof already submitted", function(done) {

        var notary = Notary.deployed(),
            hash1 = "0x4cacfb52c08d04cf99ccf56eee904e51bbd80fc5a7a70f250151b97c2fb3c093",
            comment1 = "This is comment 1";
            comment2 = "This is comment 2";

        notary.registerProof(hash1, comment1).then(function() {
            // Tries to register the same document with a different comment
            notary.registerProof(hash1, comment2);

        }).then(function() {
            // Gets metadata for hash1
            return notary.getMetadata.call(hash1);

        }).then(function(metadata) {
            // Verifies that comment returned for hash1 is correct
            var comment = metadata[3];
            assert.equal(comment.valueOf(), comment1, "Invalid comment");

        }).then(done).catch(done);

    });

});