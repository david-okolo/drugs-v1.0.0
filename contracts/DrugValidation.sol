//version with retailers associative array that has uint as key

pragma solidity ^0.5.0;

contract DrugValidation {

  //Model the drug struct
  struct Drug {
    uint id;
    string name;
    string dosage;
    uint batchNumber;
    uint drugNumber;
    address manufacturerAddress;
  }

  struct Batch {
    uint batchNumber;
    string name;
    string dosage;
    address manufacturerAddress;
    bool recieved;
  }

  struct Collection {
    address collectionAddress;
    uint batchNumber;
    string timestamp;
    address manufacturerAddress;
  }

  struct User {
    string name;
    address userAddress;
    uint accountPriviledge;
    address addedBy;
  }

  // Associative arrays
  User[] public users;
  Drug[] public drugs;
  Batch[] public batches;
  Collection[] public collectionLog;

  //cache counters
  uint public userCount;
  uint public drugCount;
  uint public logCount;
  uint public batchCount;

  constructor() public {
    userCount++;
    users.push(User("Owner", msg.sender, 3, msg.sender));
  }

  function whichUser() view public returns (uint) {
    uint level;
    level = 0;

    for (uint i = 0; i < userCount; i++) {
      if( users[i].userAddress == msg.sender ){
       // return users[i].accountPriviledge;
        level = users[i].accountPriviledge;

        break;
      }
    }

    return level;

  }

  //To add the drug data. Expects 3 arguments
  function addDrug(string memory _name, string memory _dosage, uint _batchNumber) public {
    bool isDrug;
    uint level;
    uint drugNumber;
    isDrug = false;

    for (uint i = 0; i < batchCount; i++) {
      if( batches[i].batchNumber == _batchNumber ){
        isDrug = true;
        break;
      }
    }

    drugNumber = (_batchNumber * 100) + 1;

    level = whichUser();

    if (level >= 2 && isDrug == false) {
      batchCount++;
      batches.push(Batch(_batchNumber, _name, _dosage, msg.sender, false));
      drugCount++; //To increment the drug count by 1 everytime this function is called
      drugs.push(Drug(drugCount, _name, _dosage, _batchNumber, drugNumber, msg.sender)); //adding the drug data to the array
    }
  }

  function addDrugBatch(string memory _name, string memory _dosage, uint _batchNumber, uint _amount) public {
    bool isDrug;
    uint drugNumber;
    uint level;
    uint amount;

    amount = _amount + 1;
    isDrug = false;
    for (uint i = 0; i < batchCount; i++) {
      if( batches[i].batchNumber == _batchNumber ){
        isDrug = true;
        break;
      }
    }

    level = whichUser();

    if (level >= 2 && !isDrug) {
      batchCount++;
      batches.push(Batch(_batchNumber, _name, _dosage, msg.sender, false));

      for(uint i = 1; i < amount; i++) {
        drugNumber = (_batchNumber * 100) + i;
        drugCount++; //To increment the drug count by 1 everytime this function is called
        drugs.push(Drug(drugCount, _name, _dosage, _batchNumber, drugNumber, msg.sender)); //adding the drug data to the array
      }

    }
  }

  function addUser(string memory _name, address _address, uint _level) public {
    uint isManufacturer;
    bool isUser;
    isManufacturer = 0;
    isUser = false;

    isManufacturer = whichUser();

    for (uint i = 0; i < userCount; i++) {
      if( users[i].userAddress == _address) {
        isUser = true;
        break;
      }
    }

    if ( isManufacturer >= 2  && !isUser ) {
      userCount++;
      users.push(User(_name, _address, _level, msg.sender));
    }

  }

  function confirmRetailer() public view returns (bool) {
    uint level;

    level = whichUser();

    if ( level == 1 ) {
      return true;
    } else {
      return false;
    }
  }

  function logCollection(uint _batchNumber, string memory _timestamp, address _manufacturerAddress ) private {
    logCount++;
    collectionLog.push(Collection(msg.sender, _batchNumber, _timestamp, _manufacturerAddress));
  }

  function collectDrug(uint _batchNumber, string memory _timestamp ) public {
    for (uint i = 0; i < drugCount; i++) {
      if( batches[i].batchNumber == _batchNumber ){
        batches[i].recieved = true;
        logCollection(_batchNumber, _timestamp, batches[i].manufacturerAddress);
        break;
      }
    }

  }



  function collectDrugBatch(uint _batchNumber, string memory _timestamp ) public {
    uint isRetailer;

    isRetailer = 0;
    isRetailer = whichUser();

    for (uint i = 0; i < batchCount; i++) {
      if( isRetailer == 1 && batches[i].batchNumber == _batchNumber ){
        batches[i].recieved = true;
        logCollection(_batchNumber, _timestamp, batches[i].manufacturerAddress);
        break;
      }
    }
  }


  function callLog(uint _batchNumber) public view returns (address, string memory, string memory) {
    for (uint i = 0; i < logCount; i++){
      if(collectionLog[i].batchNumber == _batchNumber && collectionLog[i].manufacturerAddress == msg.sender) {
        for (uint j = 0; j < userCount; j++) {
          if (users[j].userAddress == collectionLog[i].collectionAddress){
            return (collectionLog[i].collectionAddress, collectionLog[i].timestamp, users[j].name);
            break;
          }
        }
        break;
      }
    }
  }

  function checkDrug(uint _drugNumber) public view returns(uint, string memory, string memory, uint, uint, address, bool) {
    uint _batchNumber;
    bool _recieved;
    _recieved = false;

    for (uint i = 0; i < drugCount; i++) {
      if( drugs[i].drugNumber == _drugNumber ){

        _batchNumber = drugs[i].batchNumber;
        for (uint j = 0; j < batchCount; j++){
          if (batches[j].batchNumber == _batchNumber) {
            if (batches[j].recieved){
              _recieved = true;
            }

            break;
          }
        }

        return(drugs[i].id, drugs[i].name, drugs[i].dosage, drugs[i].batchNumber, drugs[i].drugNumber, drugs[i].manufacturerAddress, _recieved);
        break;
      }
    }
  }

  function checkDrugByBatch(uint _batchNumber) public view returns(uint, string memory, string memory, address, bool) {

    address addedBy;
    addedBy = 0x0000000000000000000000000000000000000000;

    for (uint i = 0; i < userCount; i++) {
      if( users[i].userAddress == msg.sender ){
        addedBy = users[i].addedBy;
        break;
      }
    }    

        for (uint i = 0; i < batchCount; i++){
          if (batches[i].batchNumber == _batchNumber && batches[i].manufacturerAddress == addedBy) {
            return(batches[i].batchNumber, batches[i].name, batches[i].dosage, batches[i].manufacturerAddress, batches[i].recieved);
            break;
          }
        }


      }

//  function allDrugs() view public returns ()
}
