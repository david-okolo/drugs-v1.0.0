var now = moment().format().toString();
//const currentTimestamp = dateformat(now, "isoDateTime");

var sidenavTop = $("#sidenav-top");
var sidenavMiddle = $("#sidenav-middle");
var main = $("#main");


var nav_anb = '<div class="container sidenav-link-container" id="anb"><img src="./images/layers_1.svg" alt=""><span class="sidenav-link">add new batch</span></div>';
var nav_anu = '<div class="container sidenav-link-container" id="anu"><img src="./images/profile_close_add.svg" alt=""><span class="sidenav-link">add new user</span></div>';
var nav_ccs = '<div class="container sidenav-link-container" id="ccs"><img src="./images/search_1.svg" alt=""><span class="sidenav-link">check collection status</span></div>';
var nav_vdn = '<div class="container sidenav-link-container" id="vdn"><img src="./images/search_1.svg" alt=""><span class="sidenav-link">verify drug number</span></div>';
var nav_cld = '<div class="container sidenav-link-container" id="cld"><img src="./images/accept_1.svg" alt=""><span class="sidenav-link">collect drug</span></div>';

var addUserForm = '<div class="container form-div"><span class="form-header">add new user</span><form onSubmit="App.addUser(); return false;"><div class="form-input"><label for="user_name">Name</label><input type="text" name="user_name" id="user_name" required></div><div class="form-input"><label for="user_address">User Address</label><input type="text" name="user_address" id="user_address" required></div><div class="form-input"><label for="user_accessLevel">Account Type</label><select name="user_accessLevel" id="user_accessLevel" required><option value="1">Retailer</option><option value="2">Manufacturer</option></select></div><button type="submit"  class="container form-button">add</button><div class="container" id="add_alert"></div></form></div>';

var addDrugForm = '<div class="container form-div"><span class="form-header">add new batch</span><form onSubmit="App.addDrugs(); return false;"><div class="form-input"><label for="drug_name">Name</label><input type="text" name="drug_name" id="drug_name" required></div><div class="form-input"><label for="drug_batch">Batch Number</label><input type="text" name="drug_batch" id="drug_batch" required></div><div class="form-input"><label for="drug_dosage">Dosage</label><select name="drug_dosage" id="drug_dosage" required><option value="1">250mg</option><option value="2">500mg</option><option value="3">1000mg</option></select></div><div class="form-input"><label for="drug_amount">Amount</label><select name="drug_amount" id="drug_amount" required><option value="10">10</option><option value="20">20</option></select></div><button type="submit"  class="container form-button">add</button><div class="container" id="add_alert"></div></form><div>';

var ccsForm = '<div class="container form-div"><span class="form-header">check collection log</span><form onSubmit="App.checkLog(); return false;"><div class="ccs-input"><label for="user_name">Batch Number</label><input type="text" name="log_batch" id="log_batch" required><button type="submit"  class="container input-button"><img src="./images/arrow_simple_1.svg" alt=""></button></div><div class="container" id="add_alert"></div></form><div class="container search-results" id="search-results"></div></div>';

var vdnForm = '<div class="container form-div"><span class="form-header">drug verification</span><form onSubmit="App.checkDrug(); return false;"><div class="ccs-input"><label for="user_name">Drug Number</label><input type="text" name="log_batch" id="check_drug_registration" required><button type="submit"  class="container input-button"><img src="./images/arrow_simple_1.svg" alt=""></button></div><div class="container" id="add_alert"></div></form><div class="container search-results" id="search-results"></div></div>';

var cdForm = '<div class="container form-div"><span class="form-header">collect batch</span><form onSubmit="App.collectDrug(); return false;"><div class="ccs-input"><label for="user_name">Batch Number</label><input type="text" name="log_batch" id="batchNumber" required><button type="submit"  class="container input-button"><img src="./images/arrow_simple_1.svg" alt=""></button></div><div class="container" id="add_alert"></div></form><div class="container search-results" id="search-results"></div></div>';

App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function(){
    return App.initWeb3();
  },

  initWeb3: function(){
    if (typeof web3 !== 'undefined'){
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    }else {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("DrugValidation.json", function(drugValidation){
      App.contracts.DrugValidation = TruffleContract(drugValidation);
      App.contracts.DrugValidation.setProvider(App.web3Provider);
      return App.render();
    });
  },

  // Controls the view
  render: function(){
    // HTML template for components
    var switchBtn = '<button type="button" class="btn btn-primary" id="views" name="button">Switch Views</button>';
    var logForm = '<div class="" id="log_form">    <form onSubmit="App.checkLog(); return false;">      <h3 class="text-center">Collect By Batch Number</h3>      <hr/>      <!--<label for="check_drug_registration">Registration Number:</label>-->      <input type="text" name="" id="log_batch" placeholder="Batch Number" required>      <br>      <br>      <h4 style="font-weight: 900; ">Search Result</h4>      <div id="logResult">      </div>      <br>      <button type="submit" class="btn btn-primary">Check</button>      <br></form></div>'
    var collectForm = '<div class="" id="check_form">    <form onSubmit="App.collectDrug(); return false;">      <h3 class="text-center">Collect By Batch Number</h3>      <hr/>      <!--<label for="check_drug_registration">Registration Number:</label>-->      <input type="text" name="" id="batchNumber" placeholder="Batch Number" required>      <br>      <br>      <h4 style="font-weight: 900; ">Search Result</h4>      <div id="checkResult">      </div>      <br>      <button type="submit" class="btn btn-primary">Collect</button>      <br>      <div id="collectResult">      </div></form></div>'
    var addForm = '<div class=""  id="add_form" style="display: none;"><div id="add_alert"></div><form onSubmit="App.addDrugs(); return false;"><h3 class="text-center">Add New Drugs</h3><hr/><!--<label for="drug_name">Name:</label>--><input type="text" name="" id="drug_name" placeholder="Name" required><br><br><!--<label for="drug_dosage">Dosage:</label>--><input type="text" name="" id="drug_dosage" placeholder="Dosage"><br><br><!--<label for="drug_registration">Registration Number:</label>--><input type="text" name="" id="drug_registration" placeholder="Batch Number" required><br><br><input type="text" name="" id="drug_amount" placeholder="Amount between 1-20" required><br><br><button type="submit" class="btn btn-lg btn-primary">Add</button></form><form onSubmit="App.addUser(); return false;"><h3 class="text-center">Create New User</h3><hr/><!--<label for="retailer_name">Name:</label>--><input type="text" name="" id="user_name" placeholder="Name" required><br><br><!--<label for="retailer_address">Registration Number:</label>--><input type="text" name="" id="user_address" placeholder="Address" required><select name="user_accessLevel" id="user_accessLevel"><option value="1">Retailer</option><option value="2">Manufacturer</option> </select><br><br><button type="submit" class="btn btn-lg btn-primary">Add</button></form></div>'
    var checkForm = '<div class="" id="check_form">    <form onSubmit="App.checkDrug(); return false;">      <h3 class="text-center">Check By Registration Number</h3>      <hr/>      <!--<label for="check_drug_registration">Registration Number:</label>-->      <input type="text" name="" id="check_drug_registration" placeholder="Registration Number" required>      <br>      <br>      <h4 style="font-weight: 900; ">Search Result</h4>      <div id="checkResult">      </div>      <br>      <button type="submit" class="btn btn-primary">Check</button>      <a href="#" style="display: none;">Collect</a>      <br>      <div id="collectResult">      </div></form></div>'

    // To select user by sending msg.sender metadata to the whichUser function
    App.contracts.DrugValidation.deployed().then((instance)=>{
      return instance.whichUser(); // returns account priviledge level
    }).then((result)=>{
      //alert(result);

      //renders view based on priviledge level
      if(result == 1){
        sidenavTop.append(nav_cld);
      } else if (result >= 2){
        sidenavTop.append(nav_anb);
        sidenavTop.append(nav_anu);
        sidenavMiddle.append(nav_ccs);
      } else {
        sidenavTop.append(nav_vdn);
      }

    });

    // Get account address and renders view
    web3.eth.getCoinbase(function(err, account){
      if (err === null) {
        App.account = account;
        $("#sidenav-bottom").html('<div class="wallet_tag">Wallet Address:</div><div class="wallet_address">'+account+'</div>');
      }
    });
  },

  //To add a new batch of drugs
  addDrugs: function(){
    var addAlert;
    // check for already existing registration number (mui importante!)

    $("#add_alert").empty();
    var drugName = $("#drug_name").val();
    var drugDosage = $("#drug_dosage").val();
    var drugBatch = $("#drug_batch").val();
    var batchAmount = $("#drug_amount").val();

    if (drugDosage == 1){
      _dosage = "250mg";
    } else if (drugDosage == 2) {
      _dosage = "500mg";
    } else if (drugDosage == 3) {
      _dosage = "1000mg";
    }



    //Form batch number input validation
    if (drugBatch.length >= 6) {
      //Checking for existing batch number
      App.contracts.DrugValidation.deployed().then(function(instance){
        return instance.checkDrugByBatch(drugBatch);
      }).then((result)=>{
        if( result[0] == 0 ){

          //adding proposed drug object if no existing batch number exists
          App.contracts.DrugValidation.deployed().then((instance) => {
            return instance.addDrugBatch(drugName, _dosage, drugBatch, batchAmount);
          }).then((answer)=>{

            //messages to browser view
            if(answer.receipt.status == true){
              var addAlert = '<div class="alert alert-success"> <p class="container"> <img src="./images/accept_cr_white.svg" alt=""> &nbsp; &nbsp; Successfully added batch &nbsp;<strong>'+drugBatch+'</strong></p></div>'
              $("#add_alert").html(addAlert);
              $("#drug_name").val("");
              $("#drug_dosage").val("");
              $("#drug_batch").val("");
              $("#drug_amount").val("");
            }else {
              var addAlert = '<div class="alert alert-success"> <p class="container"> <img src="./images/accept_1.svg" alt=""> &nbsp; &nbsp; Successfully &nbsp;<strong>654321</strong></p></div>'
              $("#add_alert").html(addAlert);
            }
          });
        } else {
          var addAlert = '<div class="alert alert-danger"> <p class="container"> <img src="./images/no_cr_white.svg" alt=""> &nbsp; &nbsp; Drug batch &nbsp;<strong>'+drugBatch+' already exists</strong></p></div>'
          $("#add_alert").html(addAlert);
          $("#drug_name").val("");
          $("#drug_dosage").val("");
          $("#drug_batch").val("");
          $("#drug_amount").val("");
        }
      });
    } else {
      var addAlert = '<div class="alert alert-danger" role="alert">Please fill in a valid registration number.</div>'
      $("#add_alert").html(addAlert);
    }
  },


  //To return drug information from drug registration number
  checkDrug: function(){
    $("#search-results").empty();

    var checkRegistration = $("#check_drug_registration").val(); // collects registration number from window;

    // Sends registration data to backend function
    App.contracts.DrugValidation.deployed().then(function(instance){
      return instance.checkDrug(checkRegistration);

      //returns drug object
    }).then(function(foundDrug){
      var id = foundDrug[0];
      var name = foundDrug[1];
      var dosage = foundDrug[2];
      var batchNumber = foundDrug[3];
      var registrationNo = foundDrug[4];
      var collected = foundDrug[6];
      if (collected == true) {
        var recieved = "./images/accept_cr.svg";
      } else {
        var recieved = "./images/no_cr.svg";
      }

      if (registrationNo == 0) {
        var searchTemplate = '<div class="alert alert-danger"> <p class="container"> <img src="./images/no_cr_white.svg" alt=""> &nbsp; &nbsp; Drug with number &nbsp;<strong>'+checkRegistration+' doesn\'t exist</strong></p></div>';
      } else {
        var searchTemplate = '<p><strong>Name : </strong>'+name+'</p><p><strong>Dosage : </strong>'+dosage+'</p><p><strong>Batch Number : </strong>'+batchNumber+'</p><p><strong>Valid : </strong> <img class="p_img" src="'+recieved+'" alt=""></p>';
      }
      $("#search-results").html(searchTemplate);
    });
  },

  collectDrug: function(){
    var _batch = $("#batchNumber").val();
    $("#collectResult").empty();
    App.contracts.DrugValidation.deployed().then((instance)=>{
      return instance.confirmRetailer();
    }).then((result)=>{
      if( result ){
        App.contracts.DrugValidation.deployed().then(function(instance){
          return instance.checkDrugByBatch(_batch);
        }).then((answer)=>{
         
          var name = answer[1];
          var dosage = answer[2];
          var batchNumber = answer[0];
          var collected = answer[4];

          var drugTemplate = "<p><strong>Name:</strong> "+name+"</p><p><strong>Dosage:</strong> "+dosage+"</p><p><strong>Batch Number:</strong> "+batchNumber+"</p>";
          if (batchNumber == 0){
            var collectMsg = '<div class="alert alert-danger"> <p class="container"> <img src="./images/no_cr_white.svg" alt=""> &nbsp; &nbsp; Batch &nbsp;<strong>'+_batch+' does not exist</strong></p></div>';
            $("#search-results").html(collectMsg);
          }else {
            if(!collected){
              App.contracts.DrugValidation.deployed().then(function(instance){
                return instance.collectDrugBatch(_batch, now);
              }).then((tx)=>{
                if(tx.receipt.status == true){
                  $("#search-results").html(drugTemplate);
                  $("#search-results").append('<img class="c_img" src="./images/accept_cr_lg.svg" alt=""></img>');
                }
              });
            }else{
              var collectMsg = '<div class="alert alert-danger"> <p class="container"> <img src="./images/no_cr_white.svg" alt=""> &nbsp; &nbsp; Batch &nbsp;<strong>'+_batch+' has been collected</strong></p></div>';
              $("#search-results").html(collectMsg);
            }
          }
        });
      }else{
        var collectMsg = '<div class="alert alert-danger"> <p class="container"> <img src="./images/no_cr_white.svg" alt=""> &nbsp; &nbsp; You\'re not an authorized retailer.</strong></p></div>';
        $("#search-results").html(collectMsg);
      }
    });
  },

  addUser: function(){
    //missing code to collect retailers address saved in var _address
    var _address = $("#user_address").val();
    //missing code to collect retailers name saved in var _name
    var _name = $("#user_name").val();

    var _accessLevel = $("#user_accessLevel").val();

    App.contracts.DrugValidation.deployed().then((instance)=>{
      return instance.addUser(_name, _address, _accessLevel);
    }).then((answer)=>{

      //messages to browser view
      if(answer.receipt.status == true){
        var addAlert = '<div class="alert alert-success"> <p class="container"> <img src="./images/accept_cr_white.svg" alt=""> &nbsp; &nbsp; Successfully added user &nbsp;<strong>'+_name+'</strong></p></div>'
        $("#add_alert").html(addAlert);
        $("#user_name").val("");
        $("#user_address").val("");
        $("#user_accessLevel").val("");
      }else {
        var addAlert = '<div class="alert alert-success"> <p class="container"> <img src="./images/accept_1.svg" alt=""> &nbsp; &nbsp; Successfully &nbsp;<strong>654321</strong></p></div>'
        $("#add_alert").html(addAlert);
      }
    });
  },

  checkLog: function(){
    var _batch = $("#log_batch").val();

    App.contracts.DrugValidation.deployed().then((instance)=>{
      return instance.callLog(_batch);
    }).then((result)=>{
      var collector = result[0];
      var timestamp = result[1];
      var name = result[2];

      if (collector != "0x0000000000000000000000000000000000000000"){
        var resultTemplate = '<span class="results-header"></span><p><strong>Name : </strong>'+name+'</p><p><strong>Collector\'s Address : </strong>'+collector+'</p><p><strong>Timestamp : </strong>'+timestamp+'</p>';
      } else {
        var resultTemplate = '<div class="alert alert-danger"> <p class="container"> <img src="./images/no_cr_white.svg" alt=""> &nbsp; &nbsp; Batch &nbsp;<strong>'+_batch+' hasn\'t been collected or doesn\'t exist</strong></p></div>';
      }
      $("#search-results").html(resultTemplate);
    })
  }

};

$(function() {
  $(window).load(function() {
    App.init();

    $(document).on('click', '#anb', () => {
      $("#main").empty();
      $("#main").html(addDrugForm);
      $("#anu").css('border-color','#1f4266');
      $("#ccs").css('border-color','#1f4266');
      $("#anb").css('border-color','#fff');
    });

    $(document).on('click', '#anu', () => {
      $("#main").empty();
      $("#main").html(addUserForm);
      $("#anb").css('border-color','#1f4266');
      $("#ccs").css('border-color','#1f4266');
      $("#anu").css('border-color','#fff');
    });

    $(document).on('click', '#ccs', () => {
      $("#main").empty();
      $("#main").html(ccsForm);
      $("#anb").css('border-color','#1f4266');
      $("#anu").css('border-color','#1f4266');
      $("#ccs").css('border-color','#fff');
    });

    $(document).on('click', '#vdn', () => {
      $("#main").empty();
      $("#main").html(vdnForm);
      $("#vdn").css('border-color','#fff');
    });

    $(document).on('click', '#cld', () => {
      $("#main").empty();
      $("#main").html(cdForm);
      $("#cld").css('border-color','#fff');
    });

  });
});
