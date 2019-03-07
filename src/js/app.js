var now = moment().format().toString();
//const currentTimestamp = dateformat(now, "isoDateTime");


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

  render: function(){
    var drugValidationInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    web3.eth.getCoinbase(function(err, account){
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " +account);
        loader.hide();
        content.show();
      }
    });
  },

  addDrug: function(){
    var drugValidationInstance;
    var addAlert;
    // Add check for already existing registration number (mui importante!) --- Done
    $("#add_alert").empty();
    var appInstance;
    var drugName = $("#drug_name").val();
    var drugDosage = $("#drug_dosage").val();
    var drugRegistration = $("#drug_registration").val();

    //Form batch number input validation
    if (drugRegistration.length >= 6) {
      //Checking for existing batch number
      App.contracts.DrugValidation.deployed().then(function(instance){
        return instance.checkDrug(drugRegistration);
      }).then((result)=>{
        if( result[3] == 0 ){
          //adding object if no existing batch number matches
          App.contracts.DrugValidation.deployed().then((instance) => {
            return instance.addDrug(drugName, drugDosage, drugRegistration);
          }).then((answer)=>{
            if(answer.receipt.status == true){
              var addAlert = '<div class="alert alert-success" role="alert">Successfully Added</div>'
              $("#add_alert").html(addAlert);
            }else {
              var addAlert = '<div class="alert alert-danger" role="alert">Failed...</div>'
              $("#add_alert").html(addAlert);
            }
          });
        } else {
          var addAlert = '<div class="alert alert-warning" role="alert">Drug with current batch number already added</div>'
          $("#add_alert").append(addAlert);
        }
      });
    } else {
      var addAlert = '<div class="alert alert-danger" role="alert">Please fill in a valid registration number.</div>'
      $("#add_alert").append(addAlert);
    }
  },

  checkDrug: function(){
    $("#checkResult").empty();
    $("#check_form form a").hide();

    var checkRegistration = $("#check_drug_registration").val();
    App.contracts.DrugValidation.deployed().then(function(instance){
      return instance.checkDrug(checkRegistration);
    }).then(function(foundDrug){
      var id = foundDrug[0];
      var name = foundDrug[1];
      var dosage = foundDrug[2];
      var registrationNo = foundDrug[3];
      var collected = foundDrug[5];
      if (collected == true) {
        var recieved = "Yes";
      } else {
        var recieved = "No";
      }

      if (registrationNo == 0) {
        var drugTemplate = '<div class="alert alert-danger" role="alert">There is no drug registered to that number.</div>';
        $("#check_form form a").hide();
      } else {
        var drugTemplate = "<p><strong>Name:</strong> "+name+"</p><p><strong>Dosage:</strong> "+dosage+"</p><p><strong>Registration Number:</strong> "+registrationNo+"</p><p><strong>Collected Status:</strong> "+recieved+"</p>";
        if (collected != true) {
          App.contracts.DrugValidation.deployed().then((instance)=>{
            return instance.confirmRetailer();
          }).then((result)=>{
            if (result == true){
              $("#check_form form a").show();
            }
          });
        } else {
          $("#check_form form a").hide();
        }
      }
      $("#checkResult").html(drugTemplate);
    });
  },

  collectDrug: function(_checkRegistration){
    $("#collectResult").empty();
    App.contracts.DrugValidation.deployed().then((instance)=>{
      return instance.confirmRetailer();
    }).then((result)=>{
      if( result == true ){
        App.contracts.DrugValidation.deployed().then(function(instance){
          return instance.collectDrug(_checkRegistration, now);
        }).then((answer)=>{
          if(answer.receipt.status == true){
            var collectMsg = '<div class="alert alert-success" role="alert">Done</div>';!
            $("#collectResult").html(collectMsg);
            $("#checkResult").empty();
          }
        });
      }else {
        var collectMsg = '<div class="alert alert-danger" role="alert">You\'re not an authorized retailer</div>';
        $("#collectResult").html(collectMsg);
      }
    });
  },

  addRetailer: function(){
    //missing code to collect retailers address saved in var _address
    var _address = $("#retailer_address").val();
    //missing code to collect retailers name saved in var _name
    var _name = $("#retailer_name").val();
    App.contracts.DrugValidation.deployed().then((instance)=>{
      return instance.addRetailer(_name, _address);
    })
  }

};

$(function() {
  $(window).load(function() {
    App.init();

    $("#views").click(() => {
      $("#add_form").toggle();
      $("#check_form").toggle();
    });

    $("#check_form form a").click(()=>{
      var checkRegistration = $("#check_drug_registration").val();
      App.collectDrug(checkRegistration);
      $("#check_form form a").hide();
    });
  });
});
