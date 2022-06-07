/*!
 * custom.js
 * 
 *
 * Custom JS Settings for Bitbay Web Wallet (https://bitbay.market)
 * Created by anoxydoxy@gmail.com for BitBay (BAY)
 */

 $.fn.removeClassPrefix = function(prefix) {
     this.each(function(i, el) {
         var classes = el.className.split(" ").filter(function(c) {
             return c.lastIndexOf(prefix, 0) !== 0;
         });
         el.className = $.trim(classes.join(" "));
     });
     return this;
 };
 
function printDiv(divName) {
  var printContents = document.getElementById(divName).innerHTML;
  var originalContents = document.body.innerHTML;
  document.body.innerHTML = printContents;
  window.print();
  document.body.innerHTML = originalContents;
} 
function printNewWindow(divName){
  w=window.open();
  w.document.write($('#' + divName).html());
  w.print();
  //w.close();              
}
 
function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,    
  function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}

$(document).ready(function() {
  

  if (location.hostname === "localhost" || location.hostname === "127.0.0.1" || location.hostname === ""){
    $("body").addClass("localhost");
  }

  if(getUrlVars()['r'] == 'success'){
    //alert alert-success fade in 
    var message = 
      "<div class='container'><div class='alert alert-success alert-dismissible alert-top'>"
      + "<a href='#' class='close' data-dismiss='alert' aria-label='close' title='close'>×</a>"
      + "The transaction was completed succesfully.<br>Your Bay will be sent to your wallet shortly.</div></div>";      
    $('#header').after(message);
  }

  //handle pressing menu items or tabs on top of regular/multisig wallet
  function showRegularWallet(){
    $("#openWalletType").val('regular').trigger('change');
    $("#multisigwallet").removeClass("active");
    $("#regularwallet").addClass("active");    
    //$(".form-openWalletTypeText").text("Regular Wallet");
    
    //empty multisig password2 field
    $('#openPass2').val('');
    $('#openPass2-confirm').val('');
  }
  function showMultisigWallet(){
    $("#openWalletType").val('multisig').trigger('change');
    $("#regularwallet").removeClass("active");
    $("#multisigwallet").addClass("active");
    //$(".form-openWalletTypeText").text("Multisig m-of-n Wallet");
  }  
	$("#regularwallet,a[href$='#wallet']").on("click", function () {
    showRegularWallet();
	});
	$("#multisigwallet,a[href$='#multisigwallet']").on("click", function () {
    showMultisigWallet();
	});
  //individual multisig does not have its own tab area 
  //we need this workaround when menu item is clicked 
  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var target = $(e.target).attr("href");
    var id = $(e.target).attr("id");
    if(target === "#wallet" && id === "multisigwalletLink")
      showMultisigWallet();
  });
	
  
  
  //***Disable enable login/create button
	$('.loginhide .btn-flatbay').prop('disabled', true);
	$('.acceptTerms').on("change",function(event) {
	 	
    parentElement = event.target.offsetParent.offsetParent;
    var dataAttribute = parentElement.getAttribute('data-wallet-login-multistep-wizard');
    //console.log('dataAttribute: ' + dataAttribute);
    //$('section.login-box[data-wallet-login-multistep-wizard='+dataAttribute+'] input[type=submit]')



    if($(this).is(":checked")) {
			$('section.login-box[data-wallet-login-multistep-wizard='+dataAttribute+'] input[type=submit]')
        .prop('disabled', false)
        .removeClass("btn-flatbay-inactive")
      /*$('.loginButton')
				.prop('disabled', false)
				.removeClass("btn-flatbay-inactive");*/
	 	}else{
			$('section.login-box[data-wallet-login-multistep-wizard='+dataAttribute+'] input[type=submit]')
      .prop('disabled', true)
        .addClass("btn-flatbay-inactive");
      /*$('.loginButton')
				.prop('disabled', true)
				.addClass("btn-flatbay-inactive");*/

		}
	});

  //remember button pressing
	$('.loginRemember').on("change",function() {
	 	if($(this).is(":checked")) {
			$('#rememberMe').val("true");
			//$('#rememberMe option:eq(true)').prop('selected', true)
	 	}else{
			$('#rememberMe').val("false");
			//$('#rememberMe option:eq(false)').prop('selected', true)
		}
		//console.log($('#rememberMe').val());
	});

  //add class to body to know what tab we are 
  //this helps with css
	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	  var target = $(e.target).attr("href") // activated tab
		target = target.substring(1);
	  $("body").removeClassPrefix("aTab-");
		$("body").addClass("aTab-" + target);
	});


  /* Escape HTML tags */
  function safe_tags(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
  }

  //based on the promise that the walletKeys is of the following format
  //first a label and than 1 or more inputs
  //i.e. label input label input label input input label input etc
  $('#print').on('click', function (e) {
    //console.log(profile_data);
    if(profile_data === undefined || Object.keys(profile_data).length === 0) {
      profile_data = HTML5.sessionStorage('profile_data').get();
      console.log('profile_data IS NOT set - get from HTML5');
    }else{
      console.log('profile_data is set already');
    }
      
    var print = [];

    print.push("<h2>BitBay - Wallet Backup Information!</h1>");
    
    if(profile_data.login_type =="password"){
      //passwords
      print.push("<h3>Email</h2>");
      print.push("<div>" + profile_data.email + "</div>");

      print.push("<h3>Password</h2>");
      print.push("<div>" + safe_tags(profile_data.passwords[0]) + "</div>");


      if(profile_data.passwords[1] !== undefined && profile_data.passwords[1] != ""){
        print.push("<h3>Password2</h2>");
        print.push("<div>" + safe_tags(profile_data.passwords[1]) + "</div>");
      }
    }
    
    var lastIn = "";
    $( "#walletKeys label, #walletKeys input" ).not(".hide").each(function( i ) {
      //console.log($(this).prop("tagName") + " " + i);
      if ( $(this).prop("tagName") == "LABEL" ) {
        print.push("<h3>" + $(this).html() + "</h2>");
        lastIn = "LABEL";
      } else if ( $(this).prop("tagName") == "INPUT" ) {
        var val = $(this).val();
        if(val !== ""){
          print.push("<div>" + val + "</div>");
          lastIn = "INPUT";
        }
        else if(lastIn == "LABEL"){
          print.pop();
          lastIn = "";
        }
      }
    });
    $("#printArea").html(print.join(""));
    //$("#printArea").append(print);
    //$( "<p>Address "+$("#walletKeys input.address").val()+"</p>" ).appendTo( "#printArea" );
    printNewWindow("printArea");
	});
  


  //changing type of wallet seletion from dropdown to tab/button
  $("#openWalletType").change(function(){
		if (this.value == "multisig"){
      $("#openPass2").parent().removeClass("hidden");
   	  if($("#confirmPass").is(":checked")){
        $("#openPass2-confirm").parent().removeClass("hidden");        
      }
    }
		else{
      $("#openPass2").parent().addClass("hidden");
      $("#openPass2-confirm").parent().addClass("hidden");        
    }      
	})


  //enable/disable confirm email/pass
  //double entry of email/pass
  $('#confirmPass').on("change",function() {
    console.log("confirmPass changed");
    var elements = ".form-email-confirm,.form-password-confirm";
    if($(".form-password2").is(":visible") )
      elements += ",.form-password2-confirm";

 	  if($(this).is(":checked")) {
      $(elements).removeClass("hidden");
	 	}else{
      $(elements).addClass("hidden");
      $('#openEmail-confirm').val('').removeClass("unconfirmed");
      $('#openPass-confirm').val('').removeClass("unconfirmed");
      $('#openPass2-confirm').val('').removeClass("unconfirmed");
      
		}
	});
  
  $(".confirm-input").on("keyup focusout",function(event){
    var confirm = $(this).attr("confirm");
    var val = $("" + confirm).val();
    var val2 = $(this).val();
    //console.log(val + " " + val2);
    if(val === val2){
      $(this).removeClass("unconfirmed");
      $(this).attr("title","");      
      //$(this).setCustomValidity("");
    }else{
      $(this).addClass("unconfirmed");
      //event.type
      $(this).attr("title","do not match");      
      //$(this).setCustomValidity("Not confirmed");      
    }
  });

  $(".confirm-email").on("keyup focusout",function(event){
    var email = $(this).val();
    if(validateEmail(email)){
      $(this).removeClass("unconfirmed");
      $(this).attr("title","");      
      //$(this).setCustomValidity("");
    }else{
      $(this).addClass("unconfirmed");
      //event.type
      $(this).attr("title","Not a valid email");      
      //$(this).setCustomValidity("Not confirmed");      
    }
  });
  
  //hide menu when clicking
  $(".navbar-nav").on("click",function() {
    //console.log("navbar click");
    $(".navbar-collapse").removeClass("in");
  });
  //hide menu when click outside
  $("nobody").on("click",function() {
    //console.log("body click");
    $(".navbar-collapse").removeClass("in");
  });


	//Navbar Submenus
	$('.navbar a.dropdown-toggle').on('click', function(e) {
        var $el = $(this);
        var $parent = $(this).offsetParent(".dropdown-menu");
        $(this).parent("li").toggleClass('open');

        if(!$parent.parent().hasClass('nav')) {
            $el.next().css({"top": $el[0].offsetTop, "left": $parent.outerWidth() - 4});
        }

        $('.nav li.open').not($(this).parents("li")).removeClass("open");

        return false;
	});

  var loc = window.location.pathname;
  var dir = loc.substring(0, loc.lastIndexOf('/'));
  //console.log(dir);
  
  $('.navbar a').not('.dropdown-toggle').on('click', function(e){
    if ( window.location.pathname == '/buy.php' ){
      var href = $(this).attr("href");
      console.log(href);
      window.location.href = dir + "/" + href;
    }
  });
  
  
  $("#buyBay").on('click', function(e){
    e.preventDefault();
    var wallet = $("#walletKeys input.address").val();
    var bc = $("body").attr("class");
    //console.log(wallet);
    //$(this).attr("href","buy.php?wallet=" + wallet);
    window.location.href = dir + "/buy.php?wallet=" + wallet + "&bc=" + bc;
  });
  
	//Remove active class for other menus except for the one which is "clicked"
	$('ul.dropdown-menu [data-toggle=tab]').on('click', function(e) {
		var $el = $(this);
		//$('ul.dropdown-menu [data-toggle=tab]').not($(this).parents("li")).addClass("activeHejsan");
		//$el.closest("li").addClass("active");
		$('ul.dropdown-menu [data-toggle=tab]').not($el).closest("li").removeClass("active");
	});




		
		
    

  //WalletLogin START - Multistep Wizard
  var walletLoginStepChild = 1;
  var walletLoginSteplength = $("#wallet .login-container section").length - 1;

  $("section").not("section:nth-of-type(1)").addClass('hide');
  //$("section").not("section:nth-of-type(1)").hide();
  $("section")
    .not("section:nth-of-type(1)")
    .css("transform", "translateX(100px)");

  

    /*for (i=0; i<=walletLoginSteplength;i++){
      console.log('steps: '+ i);
      $('#wallet .login-container .multistep_progress_bar').append(' '+(i+1));
    }
    */

  //multistep wallet login options- section click navigation
  $("#wallet .login-container .multistep_progress_bar .callout").click(function () {
    var goToStep = $(this).attr("data-multistep-wizard-step");

    if(goToStep == 2)
      showRegularWallet();
    if(goToStep == 3) {
      showMultisigWallet();
      goToStep = 2;
    }
    
    var currentSection = $("#wallet .login-container section:nth-of-type(" + goToStep + ")");
    
    currentSection.removeClass('hide').fadeIn();
    currentSection.css("transform", "translateX(0)").fadeIn();
    currentSection.prevAll("#wallet .login-container section").css("transform", "translateX(-100px)").fadeOut();
    currentSection.nextAll("#wallet .login-container section").css("transform", "translateX(100px)").fadeOut();
    $("#wallet .login-container section").not(currentSection).addClass('hide').fadeOut();
    //$("#wallet .login-container section").not(currentSection).hide();

    //show back options for wallet login wizard
    if(goToStep > 1)
      $('#multistep-wizard-reset').removeClass('hide').fadeIn();
    else
      $('#multistep-wizard-reset').addClass('hide').fadeOut();
  });
  
  //multistep wallet login - back button
  $("#wallet .login-container #multistep-wizard-reset, .nav #wallet_options").click(function () {
    goToStep = 1;

    //reset imported_wallet data if users has imported a backup file!
    if (Object.keys(profile_data).indexOf('imported_wallet') !== -1){
      profile_data.imported_wallet = [];
      var fileDropArea = document.querySelectorAll('.file-drop-area')

      fileDropArea[0].classList.remove('has-error');
      fileDropArea[0].classList.remove('is-active');
      fileDropArea[0].classList.remove('is-active-imported');

      
      fileDropArea[1].classList.add('hidden');
      fileDropArea[1].classList.remove('has-error');
      fileDropArea[1].classList.remove('is-active');
      fileDropArea[1].classList.remove('is-active-imported');
      

      //document.querySelector('#loginExtraImportFile').click();

      var fileDropAreaMessage = document.querySelectorAll('.file-drop-area .file-msg');
      fileDropAreaMessage[0].innerText = 'or drag and drop the file here';
      fileDropAreaMessage[1].innerText = 'or drag and drop the file here';

      //clear choosen file on input
      var fileDropAreaFile = document.querySelectorAll('.file-drop-area .file-input');
      fileDropAreaFile[0].value = null;
      fileDropAreaFile[1].value = null;

      document.querySelector('section.login-box[data-wallet-login-multistep-wizard=import_wallet] .walletLoginStatus').classList.remove('alert-success');
      document.querySelector('section.login-box[data-wallet-login-multistep-wizard=import_wallet] .walletLoginStatus').innerText = '';

      //$('#openBtnImportWallet').prop('disabled', true).addClass("btn-flatbay-inactive");
    }

    var currentSection = $("#wallet .login-container section:nth-of-type(" + goToStep + ")");
    currentSection.removeClass('hide').fadeIn();
    currentSection.css("transform", "translateX(0)").fadeIn();
    currentSection.prevAll("#wallet .login-container section").css("transform", "translateX(-100px)").fadeOut();
    currentSection.nextAll("#wallet .login-container section").css("transform", "translateX(100px)").fadeOut();
    $('#multistep-wizard-reset').addClass('hide').fadeOut();
    $('.walletLoginStatus').addClass('hide');
    $("#wallet .login-container section").not(currentSection).addClass('hide').fadeOut();
    //$("#wallet .login-container section").not(currentSection).hide();
    
  });
  


  //multistep section click navigation
  /*
  $("#wallet .login-container .button").click(function () {
    
    var id = $(this).attr("id");
    if (id == "next") {
      $("#prev").removeClass("disabled");
      if (walletLoginStepChild >= walletLoginSteplength) {
        $(this).addClass("disabled");
        $("#submit").removeClass("disabled");
      }
      if (walletLoginStepChild <= walletLoginSteplength) {
        walletLoginStepChild++;
      }
    } else if (id == "prev") {
      $("#next").removeClass("disabled");
      $("#submit").addClass("disabled");
      if (walletLoginStepChild <= 2) {
        $(this).addClass("disabled");
      }
      if (walletLoginStepChild > 1) {
        walletLoginStepChild--;
      }
    }
    
    var currentSection = $("#wallet .login-container section:nth-of-type(" + walletLoginStepChild + ")");
    currentSection.fadeIn();
    currentSection.css("transform", "translateX(0)");
    currentSection.prevAll("#wallet .login-container section").css("transform", "translateX(-100px)");
    currentSection.nextAll("#wallet .login-container section").css("transform", "translateX(100px)");
    $("#wallet .login-container section").not(currentSection).hide();

    
  });
  */
  //WalletLogin END - Multistep Wizard

	});
	


  var walletVersion = "1.2";   //is used for human versioning
  var walletVersionCode = "1";  //is used for the update versioning of the wallet app


  //render client version text
  $('.walletVersion').text('version: '+walletVersion);

  //isUpdateAvailable(false);
  

  //Check for Wallet App updates
function isUpdateAvailable(checkForUpdate = false) {

  //Get Github or Local wallet version
  var app_version_url = "https://raw.githubusercontent.com/bitbaydev/webwallet/master/config.xml";


$.get( app_version_url , function( data ) {
    
    //Get latest updated wallet from Github
    var pattV = /\s+version\s*=\s*"([^"]*)"/;
    var pattVCode = /\s+versionCode\s*=\s*"([^"]*)"/;
    var resultVCode = data.match(pattVCode);
    var resultV = data.match(pattV);
  
    var appVersionOnGit =  parseInt(resultVCode[1]);
    
    
    if(appVersionOnGit > walletVersionCode){
      //alert(resultVCode[1] + ' > ' + walletVersionCode);
      
      PNotify.prototype.options.styling = "bootstrap3";
    //PNotify.prototype.options.delay = 2500;
			var updateIsAvailableBox = new PNotify({
				title: 'New Update is available!',
				text: '<div class="updateAppBox">A new update is available for Bitbay web wallet (' + resultV[1] + '). <br><button class=\'btn btn-success runUpdate\'>Update</button> <button class=\'btn btn-danger pull-right cancelUpdate\'>Dismiss</button></div>',
        type: 'info',
        buttons: {
          closer: false,
          sticker: false
        },
        mouse_reset: true,
        remove: true,
				//type: 'notice',
        after_init: function(notice) {
          notice.elem.on('click', 'button', function() {
              notice.attention('bounce');
          });
        },
        mobile: {
          swipe_dismiss: true,
          styling: true
        }
      });
      updateIsAvailableBox.get().find('.updateAppBox').on('click', 'button.cancelUpdate', function(){
          updateIsAvailableBox.remove();
          alert('Cancel Update!');
      });
      
      updateIsAvailableBox.get().find('.updateAppBox').on('click', 'button.runUpdate', 
        function(){
          alert('Navigate user to PlayStore/AppStore');
      });
    
    
    }
    
    //Compare with the current client/browser wallet
    
},'text');

}


//Dynamic Peg Pie Chart
//https://codepen.io/miyavibest/pen/wdtaC
  
/* <3 
https://codepen.io/SergioLMacia/pen/eYYMjbm
*/

//***Function to Copy-click on input fields
document.addEventListener(
  "click",
  function (event) {

    // Only fire if the target has class copy
    if(!event.target.classList.contains('copy-input')) return;
    //console.log('class: ', event.target.classList.contains('copy-input'));
    //if (!event.target.matches("copy-input")) return;

    //console.log('closest: ' , $(event).closest('input'));

    //get the input-field value to copy
    var copyInputValue = event.target.parentElement.previousElementSibling.value;
    //console.log('event.target.parentElement.previousElementSibling: ', event.target.parentElement.previousElementSibling);

    $(event.target.parentElement.previousElementSibling).fadeOut().fadeIn();

    if (!navigator.clipboard) {
      // Clipboard API not available
      return;
    }

    try {
      navigator.clipboard.writeText(copyInputValue);
      //document.getElementById("copy-status").innerText = "Copied to clipboard";
      setTimeout(function () {
        //document.getElementById("copy-status").innerText = "Click to copy";
      }, 1200);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  },
  false
);

//*** File reader - Import wallet backup


  // highlight drag area
  $('.file-input').on('dragenter focus click', function() {
    $(this)[0].parentElement.classList.add('is-active');
  });

  // back to normal state
  $('.file-input').on('dragleave blur drop', function(e) {
    $(this)[0].parentElement.classList.remove('is-active');
  });

  // change inner text
  $('.file-input').on('change', async function(e) {
    

    //Local file reading not allowed by browser
    if (!window.FileReader) {
      var message = '<p>The <a href="http://dev.w3.org/2006/webapi/FileAPI/" target="_blank">File API</a>s are not fully supported by this browser.</p> <p>Upgrade your browser to the latest version.</p>';
      $textContainer.html(message);
      return ;
    }
    
    //console.log('fileDropArea: ', e.target);
    //e.target.offsetParent.children[1].children[0].firstElementChild
    var fileDropAreaClass, fileDropArea = $(this)[0].parentElement;
    if(fileDropArea.classList.contains('importfile1')) fileDropAreaClass = 'importfile1';
    if(fileDropArea.classList.contains('importfile2')) fileDropAreaClass = 'importfile2';

    
    //Define variable for client data if needed
    if(Object.keys(profile_data).indexOf('imported_wallet') === -1) {
      profile_data.imported_wallet = [];
      profile_data.imported_wallet[0] = [];
      profile_data.imported_wallet[1] = [];
    }
    
    //if(profile_data === undefined || Object.keys(profile_data).length === 0)
      //profile_data.imported_wallet = [];

    //validate file
    //console.log('fileDropArea.classList: ', fileDropArea.classList);

    var filesCount = $(this)[0].files.length;
    $textContainer = $(this).prev();
    var fileToImport = $(this)[0].files[0];

    //only 1 file can be import at a time with max-size of 1024bytes
    if (filesCount != 1 || fileToImport.size > 1024){
      
      if(fileDropAreaClass == 'importfile1') profile_data.imported_wallet[0] = [];
      if(fileDropAreaClass == 'importfile2') profile_data.imported_wallet[1] = [];

      //$('#openBtnImportWallet').prop('disabled', true).addClass("btn-flatbay-inactive");

      fileDropArea.classList.add('has-error');
      fileDropArea.classList.remove('is-active');
      fileDropArea.classList.remove('is-active-imported');
      $textContainer.html('<span class="alert alert-danger"><i class="bi bi-exclamation-triangle-fill"></i> Filesize error on imported file!!</span>');
      $('section.login-box[data-wallet-login-multistep-wizard=import_wallet] .walletLoginStatus').text('').addClass("hidden").addClass("hide").addClass('alert-danger').fadeOut().fadeIn();
      return ;
    }

    var fileName = $(this).val().split('\\').pop();
    $textContainer.html('<i class="bi bi-file-check"></i> '+ fileName);

    //read the file
    var reader = new FileReader();
    reader.readAsText(fileToImport);
    
    //Error reading the import wallet file
    reader.onerror = function() {
      if(fileDropAreaClass == 'importfile1') profile_data.imported_wallet[0] = [];
      if(fileDropAreaClass == 'importfile2') profile_data.imported_wallet[1] = [];

      //console.log('Error reading the file!' + reader.error);
      $textContainer.html('<span class="alert alert-danger"><i class="bi bi-exclamation-triangle-fill"></i> Error reading the file!</span>');
      //Enable the login button!
      fileDropArea.classList.add('has-error');
      fileDropArea.classList.remove('is-active');
      //$('#openBtnImportWallet').prop('disabled', false).removeClass("btn-flatbay-inactive");
      return ;
    }
    //Success in reading the import wallet file
    reader.onload = async function() {
      //console.log(reader.result);
      
      //check if imported wallet backup is in supported format
      var linesSplitted = splitLines(reader.result);
      var linesLength = linesSplitted.length;
      
      //Wallet file-format must have either 2 or 4 lines!
      if(linesLength == 2 || linesLength == 4) {

        
        //***validate imported backup file
        //get private key fileline
        privKeyFileLine = (linesLength-1);

        //console.log('privKeyFileLine: ' + privKeyFileLine);
        //console.log('linesSplitted: ' + linesSplitted);

          //console.log('privKeyFileLine2: ' + privKeyFileLine);

          var privkey1, privkey2, decodedPrivkey1, decodedPrivkey2;
          //check if private key is encrypted!

          if ((linesSplitted[privKeyFileLine]).includes("PASSWORDPROTECTED:")) {

            //call decryptModal() with
            //linesSplitted[privKeyFileLine], fileDropAreaClass
            var decryptedKey;

            try {
              decryptedKey = await decryptPrivKeyModal(linesSplitted[privKeyFileLine], fileDropAreaClass, {'encryptedText': linesSplitted[privKeyFileLine]});

              //console.log('Success!');
              fileDropArea.classList.remove('has-error');
              fileDropArea.classList.add('is-active-imported');

              //console.log('decryptedKey: ', decryptedKey)

              
              //is imported private keys from the files the same?
              //is this even needed lol :)
              //if ( isArraysEqual(profile_data.imported_wallet[0], profile_data.imported_wallet[1])) {}
              /*
              format of the imported client wallet file:
              [0] DO NOT LOSE, ALTER OR SHARE THIS FILE - WITHOUT THIS FILE, YOUR MONEY IS AT RISK. BACK UP! YOU HAVE BEEN WARNED! Bitmessage key: (32byte hex key)
              [1] pubkey1
              [2] pubkey2
              [3] (PASSWORDPROTECTED:)PRIVATE KEY
              */

              //save import import-file to client data
              if(fileDropAreaClass == 'importfile1') {
                profile_data.imported_wallet[0] = linesSplitted;
                profile_data.imported_wallet[0]['decrypted'] = decryptedKey;
              }
              if(fileDropAreaClass == 'importfile2'){
                profile_data.imported_wallet[1] = linesSplitted;
                profile_data.imported_wallet[1]['decrypted'] = decryptedKey;
              }

              $('section.login-box[data-wallet-login-multistep-wizard=import_wallet] .walletLoginStatus').html('Decrypting your wallet with the secret key was successfull.<br>You may now proceed with the login!').removeClass("hidden").removeClass("hide").removeClass('alert-danger').addClass('alert-success').fadeOut().fadeIn();
            } catch(e) {
              fileDropArea.classList.add('has-error');
              fileDropArea.classList.remove('is-active-imported');


              //console.log('Promise Error!');
              //console.log('e', e);
            }

          


        }

        //decrypt encrypted wallet!

        
        //console.log(document.querySelector('.file-drop-area.has-error'));
        //Check if there is any FileDropAreas's with errors
        //if not, enable login button
        if (document.querySelector('.file-drop-area.has-error') === null) {
          //$('#openBtnImportWallet').prop('disabled', false).removeClass("btn-flatbay-inactive");
        }else{
          $textContainer.html('or drag and drop the file here');

          //$('#openBtnImportWallet').prop('disabled', true).addClass("btn-flatbay-inactive");
          $('section.login-box[data-wallet-login-multistep-wizard=import_wallet] .walletLoginStatus').html('').addClass("hidden").addClass("hide").addClass('alert-danger').removeClass('alert-success').fadeOut().fadeIn();
        }
        return;
      }

      if(fileDropAreaClass == 'importfile1') profile_data.imported_wallet[0] = [];
      if(fileDropAreaClass == 'importfile2') profile_data.imported_wallet[1] = [];

      //Fileformat is not supported, Error: Wrong Backup Format
      fileDropArea.classList.add('has-error');
      fileDropArea.classList.remove('is-active');
      fileDropArea.classList.remove('is-active-imported');
      $textContainer.html('<span class="alert alert-danger"><i class="bi bi-exclamation-triangle-fill"></i> Wrong Backup format!</span>');
      $('section.login-box[data-wallet-login-multistep-wizard=import_wallet] .walletLoginStatus').text('').addClass("hidden").addClass("hide").addClass('alert-danger').fadeOut().fadeIn();
      //Disable the login button!
      //$('#openBtnImportWallet').prop('disabled', true).addClass("btn-flatbay-inactive");
    }
  });

function StartPromise() {
    var onePromise = new Promise((resolve, reject) => {
      // We call resolve(...) when what we were doing async succeeded, and reject(...) when it failed.
      // In this example, we use setTimeout(...) to simulate async code. 
      // In reality, you will probably be using something like XHR or an HTML5 API.
      
        $("#btnSave").click(function(){resolve('yay');});
        
        $('#myModal').on('hidden.bs.modal', function (e) {
          reject('boo');
        })
        
        $('#myModal').modal('show');
    });
    
    onePromise.then((successMessage) => {
      // successMessage is whatever we passed in the resolve(...) function above.
      // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
      console.log(successMessage);
      $('#myModal').modal('hide');
    }).catch((reason) => {
        console.log(reason);
        $('#myModal').modal('hide');
    });
}

async function decryptPrivKeyModal(encryptedText, fileDropAreaClass, data){

  //console.log('encryptedText: ' + encryptedText);
  //console.log('fileDropAreaClass: ' + fileDropAreaClass);
  //console.log('data: ',  data);
  var decodedPrivkey = false;
  var decryptModal;

  onePromise = new Promise((resolve, reject) => {
  decryptModal = BootstrapDialog.show({
                closable: true,
                closeByBackdrop: false,
                closeByKeyboard: false,
                title: 'Decrypt Private Key',
                nl2br: false,
                message: document.querySelector('.decryptPrivateKey').innerHTML,
                //message: '<div class="callout callout-no-border m-1">  <label class="form-control" for="secretKey1">Secret Key 1:</label> <div class="form-group input-group">  <input id="secretKey1" name="secretKey" type="password" class="form-control secretKey" placeholder="Private Key" required>           <span class="input-group-btn">             <button class="showKey btn btn-default" type="button">Show</button>           </span>          </div> <hr class=""><div class="alert alert-danger walletDecryptStatus"><i class="bi bi-exclamation-triangle-fill"></i></div></div>',
                onshown: function(dialogRef) {
                  $('.encryptedMessage').text(dialogRef.getData('encryptedText'));
                  dialogRef.getButton('modal-proceed-btn').disable();
              },
                onhide: function(dialogRef){
                    //reject('Process cancelled!');
                    return true;  //close the dialog
                },
                data: {
                    
                    //'encryptedText1': '', //encrypted private key 1
                    //'encryptedText2': ''  //encrypted private key 2
                    'decodedKey': ''
                    
                },
                buttons: [{
                    id: 'modal-cancel-btn',
                    label: 'Cancel',
                    icon: 'bi bi-x',
                    cssClass: ' none',
                    action: function(dialogRef){
                      alert('decodedKey: ' + dialogRef.getData('decodedKey'));
                      //alert('ok: ' + dialogRef.setData('sencryptedText', importedWalletBackup[0][privKeyFileLine]));
                      //alert('ok: ' + dialogRef.getData('sencryptedText'));
                      reject('Process cancelled!');
                      dialogRef.close();
                    }
                  }, {
                    id: 'modal-decrypt-btn',
                    label: 'Decrypt',
                    icon: 'bi bi-unlock-fill',
                    //cssClass: 'btn-flatbay',
                    action: function(dialogRef) {
                        //dialogRef.close();
                        var decryptWithSecret1 = dialogRef.getModalBody().find('input').val();
                        //has-success
                        decrypted1 = decryptText(dialogRef.getData('encryptedText'), decryptWithSecret1);
                        console.log('decrypted1: ', decrypted1);

                        decodedPrivkey = getDecodedPrivKey(decrypted1);
                        if(!decodedPrivkey){
                          dialogRef.getModalBody().find('.walletDecryptStatus').removeClass('hidden').find('.alert').html("Error decrypting the Wallet! <br>").removeClass('hidden').removeClass('alert-success').addClass('alert-danger');
                          dialogRef.setData('decodedKey', decodedPrivkey);
                          //reject('Error decrypting the Wallet!');
                        } else{
                          dialogRef.getModalBody().find('.walletDecryptStatus').removeClass('hidden').find('.alert').html("Success: Decrypted private key is valid! <br>").removeClass('hidden').removeClass('alert-danger').addClass('alert-success');
                          dialogRef.getButton('modal-cancel-btn').disable();
                          dialogRef.getButton('modal-decrypt-btn').disable();
                          dialogRef.getButton('modal-proceed-btn').enable();
                          resolve(decodedPrivkey);
                          //dialogRef.close();
                          
                          
                        }

                    }
                  }, {
                    id: 'modal-proceed-btn',
                    label: 'Proceed',
                    icon: 'bi bi-door-open-fill',
                    cssClass: 'btn-success',
                    action: function(dialogRef){
                      dialogRef.close();
                    }
                }]/*,
                callback: function(result) {
                    // result will be true if button was clicked, while it will be false if users close the dialog directly.

                    if (result)
                      resolve('yayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy');
                    else
                      reject('nooooooooooooooooooooooooooooooooooooo')

                    console.log('Result is: ' + result);
                    console.log('decodedKey: '+ decryptModal.getData('decodedKey'));
                    return result;
                }*/
            });


  //decryptModal.setData('encryptedText', linesSplitted[privKeyFileLine]);
  decryptModal.setData('encryptedText', data.encryptedText);

  });

  onePromise.then((successMessage) => {
      // successMessage is whatever we passed in the resolve(...) function above.
      // It doesn't have to be a string, but if it is only a succeed message, it probably will be.
      
      //console.log('successMessage: ',  successMessage);
      //$('#myModal').modal('hide');
    }).catch((reason) => {
        
        //console.log('catchReason: ',  reason);
        //$('#myModal').modal('hide');
    });

  
  console.log('onePromise: ' + onePromise);
  return onePromise;
}

//***Function to split string into lines
//https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-139.php
var splitLines = str => str.split(/\r?\n/); //splitLines(arg);


//Create Notifies for users for Balance change 
PNotify_helper = function (title, text, type) {
	$(function(){
		PNotify.prototype.options.styling = "bootstrap3";
    //Giorgos test
    //PNotify.prototype.options.delay = 2500;
			new PNotify({
				title: title,
				text: text,
				type: type,
        mobile: {
          swipe_dismiss: true,
          styling: true
        }
		});
	});	
}
//Remove all PNotifies
PNotify_remove = function () {
	$(function(){
		PNotify.removeAll();
		//$("#ui-pnotify").remove();
		//ui-pnotify  ui-pnotify-fade-normal ui-pnotify-mobile-able ui-pnotify-in ui-pnotify-fade-in ui-pnotify-move
		
	});	
}



//privkey signing progressbar init
 var sign_progressbar;

  //init progressbar for signing
  if(document.getElementById('sign').classList.contains('active')){
   sign_progressbar = new Nanobar({target: document.getElementById('nanobar-progress')});
    //console.log('nanobar-progress');
  }else{
   sign_progressbar = new Nanobar({target: document.getElementById('nanobar-progress-manual')});
    //console.log('nanobar-progress-manual');
  }
  sign_progressbar.go(0);


//https://stackoverflow.com/questions/9719570/generate-random-password-string-with-requirements-in-javascript
function generatePassword(length = 40) {
  var generatePass = (
  //length = 20,
  wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~'
) =>
  Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join('');

  return generatePass();  
}

//Crypto Random Password generator! 
$('.generatePassword').on("click", function () {
    var $el = $(this);

    if($el[0].dataset.inputFor == 'MnemonicBrainwallet') {
      $("#newMnemonicxpub").val("");
      $("#newMnemonicxprv").val("");
    }

    if($el[0].dataset.inputFor == 'HDBrainwallet') {
      $("#newHDxpub").val("");
      $("#newHDxprv").val("");
    }

    if($el[0].dataset.inputFor == 'brainwallet') {
      $("#newBitcoinAddress").val("");
      $("#newPubKey").val("");
      $("#newPrivKey").val("");
      
    }

    


    var inputElPass = $el.attr( "data-input-for");
    $("#"+inputElPass).val(generatePassword());
  });

/*
 @ Theme Switch Toggle Button
*/
const toggleButton = document.querySelector(".toggleTheme");

toggleButton.addEventListener("click", () => {
 document.body.classList.toggle("dark-mode");
});


/*
//promise-based dialog modal 
//https://loading.io/lib/modal/

//promise await try catch
https://www.valentinog.com/blog/throw-async/
if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
   // Document already fully loaded
   ready();
} else {
   // Add event listener for DOMContentLoaded (fires when document is fully loaded)
   document.addEventListener("DOMContentLoaded", ready);
}

function ready() {
   // Handler here

  

}




function domReady(fn) {
  // If we're early to the party
  document.addEventListener("DOMContentLoaded", fn);
  // If late; I mean on time.
  if (document.readyState === "interactive" || document.readyState === "complete" ) {

  }
}


document.addEventListener("DOMContentLoaded", function() {

});


// alternative to DOMContentLoaded
document.onreadystatechange = function () {
    if (document.readyState == "interactive") {
        // Initialize your application or run some code.




    }
}


domReady(() => console.log("DOM is ready, come and get it!"));
*/

