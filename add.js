function addInit(){
  // Set up validator

  $.validate({
    modules : 'file',
    validateOnEvent :     true});

  // Set up chars count down for comments
  $('#comments').restrictLength( $('#max-length-element') );

  // Set up glyphicon class after validating an input element
  $('input')
  .bind('validation', function(evt, isValid) {

    // get the <span> element with class "form-control-feedback"
    var feedback = $(this).siblings(".form-control-feedback");

    // Add ok icon if valid
    if(isValid) {
      feedback.addClass("glyphicon-ok").removeClass("glyphicon-remove");
    }
    else {
      feedback.addClass("glyphicon-remove")
      .removeClass("glyphicon-ok");
    }
  });


  $('input').on('blur', function() {

    if($(this).val()===''){

      // check if the input has 'error' class.
      // if not, remov any glyphicon
      if(!$(this).hasClass("error")){
        var feedback= $(this).siblings(".form-control-feedback");
        feedback.removeClass("glyphicon-remove glyphicon-ok");
      }
    }
  });

  /*
          Selectmenu for facility type.
          Bind a handler that toggles the form elements to
          show the elements of selected type and hide
          the others. */

  $( "#type" ).selectmenu({
    change : function(event, ui){
      // Get selected type
      var type_str = $(this).val();

      var field_selector = "[id^=field-"+type_str+"]";

      // Remove hidden class first
      $(field_selector).removeClass("hidden");

      // Show the fields correspond to selected type
      $(field_selector).slideDown()
      .find("input").prop("required",true);

      // Find the fields needed to be hidden
      var hidden_fields = $("#field").children(":not("+field_selector+")");

      // Clear the inputs and error messages
      hidden_fields
      .find("input").prop("required",false).val('').blur();

      // Hide the fields
      hidden_fields.slideUp();
    },
    width:"100%"

  });

  // Datepicker for installation date
  $( "#date" ).datepicker({
    showAnim: "slideDown",
    dateFormat: "yy-mm-dd"
  });

  // Radioset for image upload choices
  $( "#radioset-image" ).buttonset();


  $("#radioset-image").buttonset().find('label').css('width', '50%');

  $("#radioset-image").on("change", function() {

    // Get the id of checked radio
    var checked_id = $("#radioset-image :radio:checked").attr('id');

    // User chose to upload image by URL
    if(checked_id ==='radio-url') {
      // Clear the input file if any
      $("#image-file").val('');

      // Clear the file name and make url field editable
      $("#image-url").val('').prop("disabled", false);

      // Fire blur event to trigger validator
      // in order to remove any error message
      $("#image-url").blur();

      // Reset placeholder
      $("#image-url").prop("placeholder", "Enter image URL");
    }
    else{

      // Clear the url and trigger blur() to dismiss error message
      $("#image-url").val("").blur();

      // Disable the input
      $("#image-url").prop("disabled",true);

      // Change the placeholder
      $("#image-url").prop("placeholder", "Choose a local image file");
    }
  });

  // Trigger input file when user clicked 'local file' radio
  $('#radio-local').on("click", function(){

    // Fire a click event
    $("#image-file").click();

  });

  /*
            Display image file name on the url field
            when a file is selected.
        */
  $("#image-file").on("change", function () {
    var file = $("#image-file")[0].files[0];

    // A file is chosen
    if(file){
      // Display file name and disable the field
      $("#image-url").val(file.name);

    }
    else{
      $("#image-url").val("No file chosen");
    }

  });

  $("#btn-submit").button();

  $("#error-box button").on("click", function(){
    $("#error-box").fadeOut();
  });
  // Handle submission
  $("#add-form").submit(function(event){

    // Stop form from submitting normally
    event.preventDefault();

    // add_lat & add_lng are global variables in home.js
    $('#input-lat').val(add_lat);
    $('#input-lng').val(add_lng);

    // Dismiss error box
    $("#error-box").hide();

    // Submit the form
    $.ajax( {
      url: 'add.php',
      type: 'POST',
      data: new FormData( this ),
      processData: false,
      contentType: false
    } )
    .done(function(data) {
      if(data !== 'OK'){
        // Some errors occur
        $("#error-message").html(data);
        $("#error-box").fadeIn();
      }
      else{

        /* Zoom to the new added facility */
        var new_post = new google.maps.LatLng(add_lat, add_lng);
        map.setCenter(new_post);
        map.setZoom(13);

        // Clear all input fields and ok feedback-icon
        $('input').val('')
          .parent().removeClass("has-success");
        $('input')
          .siblings(".form-control-feedback").removeClass("glyphicon-ok");;
        $('textarea').val('')
          .parent().removeClass("has-success");
        $('textarea')
          .siblings(".form-control-feedback").removeClass("glyphicon-ok");;

        // Dismiss add infoWindow
        $('#cancel-btn').click();

        // Hide add modal
        $("#addModal").modal("hide");

        // Show success modal
        $('#successModal').modal('show');
      }
    })
    .fail(function() {
        $("#error-message").html("<p>Sorry, there was an error processing your request. Please try again later. </p>");
        $("#error-box").fadeIn();
    })
    .always(function(){
      $("#btn-submit").text("Submit");
    });

    $("#btn-submit").html('<i class="fa fa-spinner fa-spin"></i>');


  });

};

