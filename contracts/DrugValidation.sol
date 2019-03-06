//version with retailers associative array that has uint as key

pragma solidity ^0.5.0;

contract DrugValidation {

  address public manufacturer;

  //Model the drug struct
  struct Drug {
    uint id;
    string name;
    string dosage;
    uint batchNumber;
    address manufacturerAddress;
    bool recieved;
  }

  struct CollectionData {
    address collectionAddress;
    uint batchNumber;
    string timestamp;
  }

  struct Retailer {
    string name;
    address retailerAddress;
  }

  // Associative arrays
  mapping (uint => Retailer) public retailers;
  Drug[] public drugs;
  mapping (uint => CollectionData) public collectionLog;

  //cache counters
  uint public retailerCount;
  uint public drugCount;
  uint public collectionLogCount;

  bool private checker;

  constructor() public {
    manufacturer = msg.sender;
  }

  //To add the drug data. Expects 3 arguments
  function addDrug(string memory _name, string memory _dosage, uint _batchNumber) public {
    checker = false;
    for (uint i = 0; i < drugCount; i++) {
      if( drugs[i].batchNumber == _batchNumber ){
        checker = true;
      }
    }

    if (msg.sender == manufacturer && checker == false) {
      drugCount++; //To increment the drug count by 1 everytime this function is called
      drugs.push(Drug(drugCount, _name, _dosage, _batchNumber, msg.sender, false)); //adding the drug data to the array
    }
  }

  function addRetailer(string memory _name, address _address) public {
    retailerCount++;
    retailers[retailerCount] = Retailer(_name, _address);
  }

  function logCollection(uint _batchNumber, string memory _timestamp) private {
    collectionLogCount++;
    collectionLog[collectionLogCount] = CollectionData(msg.sender, _batchNumber, _timestamp);
  }

  function collectDrug(uint _batchNumber, string memory _timestamp ) public returns (bool) {
    for (uint i = 0; i < drugCount; i++) {
      if( drugs[i].batchNumber == _batchNumber ){
        drugs[i].recieved = true;
        logCollection(_batchNumber, _timestamp);
      }
    }
  }

  function checkDrug(uint _batchNumber) public view returns(uint, string memory, string memory, uint, address, bool) {

    for (uint i = 0; i < drugCount; i++) {
      if( drugs[i].batchNumber == _batchNumber ){
        return(drugs[i].id, drugs[i].name, drugs[i].dosage, drugs[i].batchNumber, drugs[i].manufacturerAddress, drugs[i].recieved);
      }
    }
  }

//  function allDrugs() view public returns ()
}
