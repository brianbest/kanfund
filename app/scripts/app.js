(function(document) {
  'use strict';

  document.addEventListener('polymer-ready', function() {
    // Perform some behaviour
    console.log('Polymer is ready to rock!');
  });

// wrap document so it plays nice with other libraries
// http://www.polymer-project.org/platform/shadow-dom.html#wrappers
})(wrap(document));

//document.addEventListener("scroll", makeDetails());

function makeDetails(){

 // document.getElementById('pro_details').style.display = 'block';
}


function regClient(){
  var user = $('#username').value,
      pass = $('#password').value,
      email = $('#email').value,
      redir = 'https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_5WkZBZb2kSLdoMu7Ioc7V5jJLgjTMYH7';
  $.ajax({
    type: "POST",
    url : '/regNewClient',
    data: {regusername : user, regpassword : pass, regemails : email}
  });


  //.done(function (mes){
  //redir = redir + 'redirect_uri=http://localhost:3000/created/' + msg;
//});
}
