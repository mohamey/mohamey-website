$(document).ready(function() {

  $('.profile-img').fadeIn(1500);
  $('.profile-caption').fadeIn(3000);

  $("#about-button").click(function() {
    $('html, body').scrollTo(document.getElementById('About-Me'), 1000);
    if($("#nav-togglerer").attr("aria-expanded")=="true")
      $("#nav-togglerer").click();
  });

  $("#experience-button").click(function() {
    $('html, body').scrollTo(document.getElementById('experience'), 1000);
    if($("#nav-togglerer").attr("aria-expanded")=="true")
      $("#nav-togglerer").click();
  });

  $("#skills-button").click(function() {
    $('html, body').scrollTo(document.getElementById('skills'), 1000);
    if($("#nav-togglerer").attr("aria-expanded")=="true")
      $("#nav-togglerer").click();
  });

  $("#contact-button").click(function() {
    $('html, body').scrollTo(document.getElementById('contact'), 1000);
    if($("#nav-togglerer").attr("aria-expanded")=="true")
      $("#nav-togglerer").click();
  });

  $("#landing-button").click(function() {
    $('html, body').scrollTo(document.getElementById('landing-banner'), 1000);
    if($("#nav-togglerer").attr("aria-expanded")=="true")
      $("#nav-togglerer").click();
  });

  $(".profile-caption").fitText();

  // Handle focus on name input field
  $ (".formName").focus(function() {
    $ ('#nameRequirements').css( "display", "block" )
  })

  // Handle focus on message input field
  $ (".formMessage").focus(function() {
    $ ('#messageRequirements').css( "display", "block" )
  })

  // Handle losing focus on name input field
  $ ('.formName').focusout(function() {
    $ ('#nameRequirements').css("display", "block" )
    const name = document.getElementsByClassName('formName')[0].value
    if (name.length < 2) {
      $ ('#nameRequirements').css('color', 'red')
      document.getElementById('nameRequirements').innerHTML= "Name must be at least 2 characters long"
    } else {
      $ ('#nameRequirements').css('color', 'green')
      document.getElementById('nameRequirements').innerHTML= "&#10003;"
    }
  })

  // Handle losing focus on email input field
  $ ('.formEmail').focusout(function() {
    $ ('#emailRequirements').css("display", "block" )
    const email = document.getElementsByClassName('formEmail')[0].value
    if (validateEmail(email)) {
      $ ('#emailRequirements').css('color', 'green')
      document.getElementById('emailRequirements').innerHTML= "&#10003;"
    } else {
      $ ('#emailRequirements').css('color', 'red')
      document.getElementById('emailRequirements').innerHTML= "Please enter a valid email"
    }
  })

  // Handle losing focus on message input field
  $ ('.formMessage').focusout(function() {
    $ ('#mesageRequirements').css("display", "block" )
    const message = document.getElementsByClassName('formMessage')[0].value
    if (message.length < 10) {
      $ ('#messageRequirements').css('color', 'red')
      document.getElementById('messageRequirements').innerHTML= "Message must be at least 10 characters long"
    } else {
      $ ('#messageRequirements').css('color', 'green')
      document.getElementById('messageRequirements').innerHTML= "&#10003;"
    }
  })
});

function redirect(){
  window.location.href = "http://mohamey.me/thanks.php";
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  console.log(email)
    return re.test(email);
}

function validateForm() {
  const name = document.getElementsByClassName("formName")[0].value
  const email = document.getElementsByClassName("formEmail")[0].value
  const message = document.getElementsByClassName("formMessage")[0].value

  // Check that none of the inputs are falsy
  if (!name || !email || !message) {
    return false
  }

  // Check that each of the inputs are valid
  if (name.length < 2 || !validateEmail(email) || message.length < 10) {
    return false
  }

  return true
}
