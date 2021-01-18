document.addEventListener('DOMContentLoaded', function() {
  var sidenav_elems = document.querySelector('.sidenav');
  var instances = M.Sidenav.init(sidenav_elems);

  var dropdowns = document.querySelectorAll('.dropdown-trigger')
  for (var i = 0; i < dropdowns.length; i++) {
      M.Dropdown.init(dropdowns[i]);
  }

  var dropdowns_sidenav = document.querySelectorAll('.dropdown-trigger-sidenav')
  for (var i = 0; i < dropdowns_sidenav.length; i++) {
      M.Dropdown.init(dropdowns_sidenav[i]);
  }

  var tab_elems = document.querySelector('.tabs');
  var instance = M.Tabs.init(tab_elems);

  var modal_elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(modal_elems, {opacity: '0.4', preventScrolling: false, dismissible: true});
});

document.getElementById('bookTrainingResetFormBtn').addEventListener('click', function() {
  document.getElementById("bookTrainingForm").reset();
})

document.getElementById('cancelTrainingResetFormBtn').addEventListener('click', function() {
  document.getElementById("cancelTrainingForm").reset();
})

document.getElementById('updateMyDataResetFormBtn').addEventListener('click', function() {
  document.getElementById("updateMyDataForm").reset();
})

document.getElementById('changeEmailResetFormBtn').addEventListener('click', function() {
  document.getElementById("changeEmailForm").reset();
})

document.getElementById('changePasswordResetFormBtn').addEventListener('click', function() {
  document.getElementById("changePasswordForm").reset();
})

// Book Training
document.getElementById('bookTrainingBtn').addEventListener('click', function() {
  //Get the table
  var table = document.getElementById("playerTrainingTable");
  //Collect all CheckBoxes from table in an checkBoxes array
  var checkBoxes = table.getElementsByClassName("checkboxes");
  //Create an empty array to collect checked data
  var arr = []
  // loop through the checkBoxes
  for (var i = 0; i < checkBoxes.length; i++) {
   // If the checkbox i is checked
   if (checkBoxes[i].checked) {
     // Store the HTML table row element where checkbox is checked in a variable
     var row = checkBoxes[i].parentNode.parentNode.parentNode.parentNode;
     // Store the innerHTML value of the cell in a variable (cells starting with 0)
     var trainingId = row.cells[1].innerHTML;
     var trainingLocation = row.cells[3].innerHTML;
     var trainingDate = row.cells[4].innerHTML;
     // Push the data into the array
     arr.push(trainingId, trainingLocation, trainingDate);
   }
  }
  // Ensure that only one checkBox is selected
  if (arr.length == 3) {
   document.getElementById("idInputBookTraining").value=arr[0];
   document.getElementById("locationInputBookTraining").value=arr[1];
   document.getElementById("dateInputBookTraining").value=arr[2];

 } else if (arr.length > 3) {
   document.getElementById("idInputBookTraining").value='pls. select only one training';
   document.getElementById("locationInputBookTraining").value='no Data'
   document.getElementById("dateInputBookTraining").value='no Data'

  } else {
   document.getElementById("idInputBookTraining").value='pls. select one training';
   document.getElementById("locationInputBookTraining").value='no Data'
   document.getElementById("dateInputBookTraining").value='no Data'

  }
// End of the onclick event listener
});

// Book Training Mobile
document.getElementById('bookTrainingMobileBtn').addEventListener('click', function() {
  //Get the table
  var table = document.getElementById("playerTrainingTable");
  //Collect all CheckBoxes from table in an checkBoxes array
  var checkBoxes = table.getElementsByClassName("checkboxes");
  //Create an empty array to collect checked data
  var arr = []
  // loop through the checkBoxes
  for (var i = 0; i < checkBoxes.length; i++) {
   // If the checkbox i is checked
   if (checkBoxes[i].checked) {
     // Store the HTML table row element where checkbox is checked in a variable
     var row = checkBoxes[i].parentNode.parentNode.parentNode.parentNode;
     // Store the innerHTML value of the cell in a variable (cells starting with 0)
     var trainingId = row.cells[1].innerHTML;
     var trainingLocation = row.cells[3].innerHTML;
     var trainingDate = row.cells[4].innerHTML;
     // Push the data into the array
     arr.push(trainingId, trainingLocation, trainingDate);
   }
  }
  // Ensure that only one checkBox is selected
  if (arr.length == 3) {
   document.getElementById("idInputBookTraining").value=arr[0];
   document.getElementById("locationInputBookTraining").value=arr[1];
   document.getElementById("dateInputBookTraining").value=arr[2];

 } else if (arr.length > 3) {
   document.getElementById("idInputBookTraining").value='pls. select only one training';
   document.getElementById("locationInputBookTraining").value='no Data'
   document.getElementById("dateInputBookTraining").value='no Data'

  } else {
   document.getElementById("idInputBookTraining").value='pls. select one training';
   document.getElementById("locationInputBookTraining").value='no Data'
   document.getElementById("dateInputBookTraining").value='no Data'

  }
// End of the onclick event listener
});

// Cancel Booking
document.getElementById('cancelBookingBtn').addEventListener('click', function() {
  //Get the table
  var table = document.getElementById("playerBookingTable");
  //Collect all CheckBoxes from table in an checkBoxes array
  var checkBoxes = table.getElementsByClassName("checkboxes");
  //Create an empty array to collect checked data
  var arr = []
  // loop through the checkBoxes
  for (var i = 0; i < checkBoxes.length; i++) {
   // If the checkbox i is checked
   if (checkBoxes[i].checked) {
     // Store the HTML table row element where checkbox is checked in a variable
     var row = checkBoxes[i].parentNode.parentNode.parentNode.parentNode;
     // Store the innerHTML value of the cell in a variable (cells starting with 0)
     var trainingId = row.cells[1].innerHTML;
     var trainingLocation = row.cells[3].innerHTML;
     var trainingDate = row.cells[4].innerHTML;
     // Push the data into the array
     arr.push(trainingId, trainingLocation, trainingDate);
   }
  }
  // Ensure that only one checkBox is selected
  if (arr.length == 3) {
   document.getElementById("idInputCancelBooking").value=arr[0];
   document.getElementById("locationInputCancelBooking").value=arr[1];
   document.getElementById("dateInputCancelBooking").value=arr[2];

 } else if (arr.length > 3) {
   document.getElementById("idInputCancelBooking").value='pls. select only one booking';
   document.getElementById("locationInputCancelBooking").value='no Data'
   document.getElementById("dateInputCancelBooking").value='no Data'

  } else {
   document.getElementById("idInputCancelBooking").value='pls. select one booking';
   document.getElementById("locationInputCancelBooking").value='no Data'
   document.getElementById("dateInputCancelBooking").value='no Data'

  }
// End of the onclick event listener
});

// Cancel Booking Mobile
document.getElementById('cancelBookingMobileBtn').addEventListener('click', function() {
  //Get the table
  var table = document.getElementById("playerBookingTable");
  //Collect all CheckBoxes from table in an checkBoxes array
  var checkBoxes = table.getElementsByClassName("checkboxes");
  //Create an empty array to collect checked data
  var arr = []
  // loop through the checkBoxes
  for (var i = 0; i < checkBoxes.length; i++) {
   // If the checkbox i is checked
   if (checkBoxes[i].checked) {
     // Store the HTML table row element where checkbox is checked in a variable
     var row = checkBoxes[i].parentNode.parentNode.parentNode.parentNode;
     // Store the innerHTML value of the cell in a variable (cells starting with 0)
     var trainingId = row.cells[1].innerHTML;
     var trainingLocation = row.cells[3].innerHTML;
     var trainingDate = row.cells[4].innerHTML;
     // Push the data into the array
     arr.push(trainingId, trainingLocation, trainingDate);
   }
  }
  // Ensure that only one checkBox is selected
  if (arr.length == 3) {
   document.getElementById("idInputCancelBooking").value=arr[0];
   document.getElementById("locationInputCancelBooking").value=arr[1];
   document.getElementById("dateInputCancelBooking").value=arr[2];

 } else if (arr.length > 3) {
   document.getElementById("idInputCancelBooking").value='pls. select only one booking';
   document.getElementById("locationInputCancelBooking").value='no Data'
   document.getElementById("dateInputCancelBooking").value='no Data'

  } else {
   document.getElementById("idInputCancelBooking").value='pls. select one booking';
   document.getElementById("locationInputCancelBooking").value='no Data'
   document.getElementById("dateInputCancelBooking").value='no Data'

  }
// End of the onclick event listener
});

// Update My Data
document.getElementById('updateMyDataBtn').addEventListener('click', function() {

  var myEmail = document.getElementById("myDataEmail").innerHTML;
  document.getElementById("emailInputUpdateMyEmail").value=myEmail;

// End of the onclick event listener
});

// Update My Data Mobile
document.getElementById('updateMyDataMobileBtn').addEventListener('click', function() {

  var myEmail = document.getElementById("myDataEmail").innerHTML;
  document.getElementById("emailInputUpdateMyEmail").value=myEmail;

// End of the onclick event listener
});

//Change My Email
document.getElementById('changeMyEmailBtn').addEventListener('click', function() {

  var myEmail = document.getElementById("myDataEmail").innerHTML;
  document.getElementById("emailInputChangeMyEmail").value=myEmail;

// End of the onclick event listener
});

//Change My Email Mobile
document.getElementById('changeMyEmailMobileBtn').addEventListener('click', function() {

  var myEmail = document.getElementById("myDataEmail").innerHTML;
  document.getElementById("emailInputChangeMyEmail").value=myEmail;

// End of the onclick event listener
});
