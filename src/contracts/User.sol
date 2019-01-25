pragma solidity ^0.5.0;

contract User {
    address payable owner;
    mapping(string => UserRecord) userRecords;
    struct UserRecord {
        string identifier;
        bool doesExist;
    }

    constructor () public {
        // Ensure that the contract creator is also the one who allows hash update
        owner = msg.sender;
    }

    function setHash(string memory user, string memory identifier) public onlyOwner {
        userRecords[user] = UserRecord({ identifier: identifier, doesExist: true });
    }

    function getHash(string memory user) public view onlyOwner returns(string memory) {
        require(userRecords[user].doesExist);

        return userRecords[user].identifier;
    }

    function destroy() public onlyOwner {
        selfdestruct(owner);
    }

    modifier onlyOwner {
        require(
            msg.sender == owner,
            "Only owner can call this function."
        );
        _;
    }
}
