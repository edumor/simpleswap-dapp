//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)
// import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title YourContract
 * @notice Example contract for demonstration and educational purposes.
 * @dev Allows anyone to update a greeting, tracks usage, and lets the owner withdraw Ether.
 * @author BuidlGuidl
 */
contract YourContract {
    // State Variables
    /// @notice The owner of the contract, set at deployment and immutable.
    address public immutable owner;

    /// @notice The current greeting message stored in the contract.
    string public greeting = "Building Unstoppable Apps!!!";

    /// @notice Indicates if the last greeting change was premium (sent with ETH).
    bool public premium = false;

    /// @notice Total number of times the greeting has been changed.
    uint256 public totalCounter = 0;

    /// @notice Tracks how many times each user has changed the greeting.
    mapping(address => uint) public userGreetingCounter;

    /// @notice Emitted when the greeting is changed.
    /// @param greetingSetter The address that set the new greeting.
    /// @param newGreeting The new greeting string.
    /// @param premium True if ETH was sent with the greeting change.
    /// @param value The amount of ETH sent (in wei).
    event GreetingChange(address indexed greetingSetter, string newGreeting, bool premium, uint256 value);

    /**
     * @notice Contract constructor, sets the owner.
     * @param _owner The address to be set as the contract owner.
     */
    constructor(address _owner) {
        owner = _owner;
    }

    /// @notice Restricts function access to only the contract owner.
    modifier isOwner() {
        require(msg.sender == owner, "Not the Owner");
        _;
    }

    /**
     * @notice Allows anyone to change the greeting and increments counters.
     * @dev If ETH is sent, marks the greeting as premium. Emits a GreetingChange event.
     * @param _newGreeting The new greeting string to store.
     */
    function setGreeting(string memory _newGreeting) public payable {
        // Print data to the hardhat chain console. Remove when deploying to a live network.
        console.log("Setting new greeting '%s' from %s", _newGreeting, msg.sender);

        // Change state variables
        greeting = _newGreeting;
        totalCounter += 1;
        userGreetingCounter[msg.sender] += 1;

        // If ETH is sent, mark as premium
        if (msg.value > 0) {
            premium = true;
        } else {
            premium = false;
        }

        emit GreetingChange(msg.sender, _newGreeting, msg.value > 0, msg.value);
    }

    /**
     * @notice Allows the owner to withdraw all Ether from the contract.
     * @dev Only callable by the owner (see isOwner modifier).
     */
    function withdraw() public isOwner {
        (bool success, ) = owner.call{ value: address(this).balance }("");
        require(success, "Failed to send Ether");
    }

    /**
     * @notice Allows the contract to receive Ether directly.
     * @dev This function is called when Ether is sent with no data.
     */
    receive() external payable {}
}
