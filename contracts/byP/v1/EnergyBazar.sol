/*
 * A token contract where the creator pool is used as base.
 * User can approve Smart meter to use its tokens. The Smart Meter can use those tokens on behal of owner.
 * A special donate function so people, gnerating extra free energy and give back to the system if they want.
 */


pragma solidity ^0.4.16;

interface energyToken { function receiveApproval(address _from, uint256 _value, address _token, bytes _extraData); }

contract MyToken {
    // Public variables of the token
    string public name = "Energy Bazar";
    string public symbol = "EBZ";
    uint8 public decimals = 100;
    uint256 public totalSupply = 1000000;
    // Private account of the contract creator. to be used as a base account
    address supplier;

    // This creates an array with all balances
    // The actual balance
    mapping (address => uint256) public balanceOf;
    // The balance allowed for the Smart Meter to spend
    mapping (address => mapping (address => uint256)) public allowance;

    // This generates a public event on the blockchain that will notify clients
    event Transfer(address indexed from, address indexed to, uint256 value);

    // This notifies clients about the amount donated
    event Donate(address indexed from, uint256 value);

    //This notifies energy tokens created
    event CreatedEnergy(address indexed from, uint256 value);

    //This notifies energy tokens used
    event RemovedEnergy(address indexed from, uint256 value);

    /**
     * Constrctor function
     *
     * Initializes contract with initial supply tokens to the creator of the contract
     */
    function MyToken() {
        supplier = msg.sender;                              // Storing the contract creator's address
        balanceOf[msg.sender] = totalSupply;                // Give the creator all initial tokens
    }
    
    

    /**
     * Internal transfer, only can be called by this contract
     */
    function _transfer(address _from, address _to, uint _value) internal {
        require(_to != 0x0);                               // Prevent transfer to 0x0 address. Use burn() instead
        require(balanceOf[_from] >= _value);                // Check if the sender has enough
        require(balanceOf[_to] + _value > balanceOf[_to]); // Check for overflows
        balanceOf[_from] -= _value;                         // Subtract from the sender
        balanceOf[_to] += _value;                           // Add the same to the recipient
        Transfer(_from, _to, _value);                       //Send Event
    }

    /**
     * Transfer tokens from one account to other(s)
     *
     * Send `_value` tokens to `_to` from your account
     *
     * @param _to The address of the recipient
     * @param _value the amount to send
     */
    function transfer(address _to, uint256 _value) {
        _transfer(msg.sender, _to, _value);
    }

    /**
     * Add tokens to the energy creators account
     *
     * Send `_value` tokens to `_to` from `supplier` account
     *
     * @param _to The address of the person owning Smart Meter
     * @param _value the amount to send
     */
    function createdEnergy(address _to, uint256 _value) {
        _transfer(supplier, _to, _value);
        CreatedEnergy(_to, _value);                                 // Send Event
    }


    /**
     * Transfer tokens from other address (i.e. Smart meter)
     * To be triggred by smart meter
     *
     * Send `_value` tokens to `owner` in behalf of `_from`
     *
     * @param _from The address of the sender
     * @param _value the amount to send
     */
    function transferFrom(address _from, uint256 _value) returns (bool success) {
        require(_value <= allowance[_from][msg.sender]);     // Check allowance
        allowance[_from][msg.sender] -= _value;
        _transfer(_from, supplier, _value);
        RemovedEnergy(_from, _value);                        // Send Event
        return true;
    }

    /**
     * Set allowance for Smart Meter to spend on your behalf
     *
     * Allows `_spender` to spend no more than `_value` tokens in your behalf
     *
     * @param _spender The smart meter address authorized to spend
     * @param _value the max amount they can spend
     */
    function approve(address _spender, uint256 _value)
        returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        return true;
    }

    /**
     * Donate Tokens to the platform for social service/impact
     *
     * Remove `_value` tokens from the system irreversibly
     *
     * @param _value the amount of money to burn
     */
    function donate(uint256 _value) returns (bool success) {
        require(balanceOf[msg.sender] >= _value);   // Check if the sender has enough
        _transfer(msg.sender, supplier, _value);
        Donate(msg.sender, _value);                   // Send Event
        return true;
    }
    
    
}
