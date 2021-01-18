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

// Reset Form Buttons
document.getElementById('createUserResetFormBtn').addEventListener('click', function() {
  document.getElementById("createUserForm").reset();
})

document.getElementById('updateUserResetFormBtn').addEventListener('click', function() {
  document.getElementById("updateUserForm").reset();
})

document.getElementById('updateUserEmailResetFormBtn').addEventListener('click', function() {
  document.getElementById("updateUserEmailForm").reset();
})

document.getElementById('updateUserStatusResetFormBtn').addEventListener('click', function() {
  document.getElementById("updateUserStatusForm").reset();
})

document.getElementById('updateUserPasswordResetFormBtn').addEventListener('click', function() {
  document.getElementById("updateUserPasswordForm").reset();
})

document.getElementById('userInvoicingResetFormBtn').addEventListener('click', function() {
  document.getElementById("userInvoicingForm").reset();
})

document.getElementById('createTrainingResetFormBtn').addEventListener('click', function() {
  document.getElementById("createTrainingForm").reset();
})

document.getElementById('updateTrainingResetFormBtn').addEventListener('click', function() {
  document.getElementById("updateTrainingForm").reset();
})

document.getElementById('createLocationResetFormBtn').addEventListener('click', function() {
  document.getElementById("createLocationForm").reset();
})

document.getElementById('updateLocationResetFormBtn').addEventListener('click', function() {
  document.getElementById("updateLocationForm").reset();
})

document.getElementById('paymentResetFormBtn').addEventListener('click', function() {
  document.getElementById("paymentForm").reset();
})

document.getElementById('stornoResetFormBtn').addEventListener('click', function() {
  document.getElementById("stornoForm").reset();
})

// Check CheckBoxes Functionalities

// Update User
document.getElementById('updateUserBtn').addEventListener('click', function() {
  //Get the table
  var table = document.getElementById("adminUsersTable");
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
     var data = row.cells[3].innerHTML;
     // Push the data into the array
     arr.push(data);
   }
  }
  // Ensure that only one checkBox is selected
  if (arr.length == 1) {
   document.getElementById("emailInputUpdateUser").value=arr;

  } else if (arr.length > 1) {
   document.getElementById("emailInputUpdateUser").value='pls. select only one user';

  } else {
   document.getElementById("emailInputUpdateUser").value='pls. select one user';

  }
// End of the onclick event listener
});

// Update User Mobile
document.getElementById('updateUserMobileBtn').addEventListener('click', function() {
  //Get the table
  var table = document.getElementById("adminUsersTable");
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
     var data = row.cells[3].innerHTML;
     // Push the data into the array
     arr.push(data);
   }
  }
  // Ensure that only one checkBox is selected
  if (arr.length == 1) {
   document.getElementById("emailInputUpdateUser").value=arr;

  } else if (arr.length > 1) {
   document.getElementById("emailInputUpdateUser").value='pls. select only one user';

  } else {
   document.getElementById("emailInputUpdateUser").value='pls. select one user';

  }
// End of the onclick event listener
});

// Update User Email
document.getElementById('updateUserEmailBtn').addEventListener('click', function() {
  //Get the table
  var table = document.getElementById("adminUsersTable");
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
     var data = row.cells[3].innerHTML;
     // Push the data into the array
     arr.push(data);
   }
  }
  // Ensure that only one checkBox is selected
  if (arr.length == 1) {
   document.getElementById("emailInputUpdateUserEmail").value=arr;

  } else if (arr.length > 1) {
   document.getElementById("emailInputUpdateUserEmail").value='pls. select only one user';

  } else {
   document.getElementById("emailInputUpdateUserEmail").value='pls. select one user';

  }
// End of the onclick event listener
});

// Update User Email Mobile
document.getElementById('updateUserEmailMobileBtn').addEventListener('click', function() {
  //Get the table
  var table = document.getElementById("adminUsersTable");
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
     var data = row.cells[3].innerHTML;
     // Push the data into the array
     arr.push(data);
   }
  }
  // Ensure that only one checkBox is selected
  if (arr.length == 1) {
   document.getElementById("emailInputUpdateUserEmail").value=arr;

  } else if (arr.length > 1) {
   document.getElementById("emailInputUpdateUserEmail").value='pls. select only one user';

  } else {
   document.getElementById("emailInputUpdateUserEmail").value='pls. select one user';

  }
// End of the onclick event listener
});

// Update User Status
document.getElementById('updateUserStatusBtn').addEventListener('click', function() {
  //Get the table
  var table = document.getElementById("adminUsersTable");
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
     var data = row.cells[3].innerHTML;
     // Push the data into the array
     arr.push(data);
   }
  }
  // Ensure that only one checkBox is selected
  if (arr.length == 1) {
   document.getElementById("emailInputUpdateUserStatus").value=arr;

  } else if (arr.length > 1) {
   document.getElementById("emailInputUpdateUserStatus").value='pls. select only one user';

  } else {
   document.getElementById("emailInputUpdateUserStatus").value='pls. select one user';

  }
// End of the onclick event listener
});

// Update User Status Mobile
document.getElementById('updateUserStatusMobileBtn').addEventListener('click', function() {
  //Get the table
  var table = document.getElementById("adminUsersTable");
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
     var data = row.cells[3].innerHTML;
     // Push the data into the array
     arr.push(data);
   }
  }
  // Ensure that only one checkBox is selected
  if (arr.length == 1) {
   document.getElementById("emailInputUpdateUserStatus").value=arr;

  } else if (arr.length > 1) {
   document.getElementById("emailInputUpdateUserStatus").value='pls. select only one user';

  } else {
   document.getElementById("emailInputUpdateUserStatus").value='pls. select one user';

  }
// End of the onclick event listener
});

// Update User Password
document.getElementById('updateUserPasswordBtn').addEventListener('click', function() {
  //Get the table
  var table = document.getElementById("adminUsersTable");
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
     var data = row.cells[3].innerHTML;
     // Push the data into the array
     arr.push(data);
   }
  }
  // Ensure that only one checkBox is selected
  if (arr.length == 1) {
   document.getElementById("emailInputUpdateUserPassword").value=arr;

  } else if (arr.length > 1) {
   document.getElementById("emailInputUpdateUserPassword").value='pls. select only one user';

  } else {
   document.getElementById("emailInputUpdateUserPassword").value='pls. select one user';

  }
// End of the onclick event listener
});

// Update User Password Mobile
document.getElementById('updateUserPasswordMobileBtn').addEventListener('click', function() {
  //Get the table
  var table = document.getElementById("adminUsersTable");
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
     var data = row.cells[3].innerHTML;
     // Push the data into the array
     arr.push(data);
   }
  }
  // Ensure that only one checkBox is selected
  if (arr.length == 1) {
   document.getElementById("emailInputUpdateUserPassword").value=arr;

  } else if (arr.length > 1) {
   document.getElementById("emailInputUpdateUserPassword").value='pls. select only one user';

  } else {
   document.getElementById("emailInputUpdateUserPassword").value='pls. select one user';

  }
// End of the onclick event listener
});

// Update Training
document.getElementById('updateTrainingBtn').addEventListener('click', function() {
  //Get the table
  var table = document.getElementById("adminTrainingTable");
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
   document.getElementById("idInputUpdateTraining").value=arr[0];
   document.getElementById("locationInputUpdateTraining").value=arr[1];
   document.getElementById("dateInputUpdateTraining").value=arr[2];

 } else if (arr.length > 3) {
   document.getElementById("idInputUpdateTraining").value='pls. select only one training';
   document.getElementById("locationInputUpdateTraining").value='no Data'
   document.getElementById("dateInputUpdateTraining").value='no Data'

  } else {
   document.getElementById("idInputUpdateTraining").value='pls. select one training';
   document.getElementById("locationInputUpdateTraining").value='no Data'
   document.getElementById("dateInputUpdateTraining").value='no Data'

  }
// End of the onclick event listener
});

// Update Training Mobile
document.getElementById('updateTrainingMobileBtn').addEventListener('click', function() {
  //Get the table
  var table = document.getElementById("adminTrainingTable");
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
   document.getElementById("idInputUpdateTraining").value=arr[0];
   document.getElementById("locationInputUpdateTraining").value=arr[1];
   document.getElementById("dateInputUpdateTraining").value=arr[2];

 } else if (arr.length > 3) {
   document.getElementById("idInputUpdateTraining").value='pls. select only one training';
   document.getElementById("locationInputUpdateTraining").value='no Data'
   document.getElementById("dateInputUpdateTraining").value='no Data'

  } else {
   document.getElementById("idInputUpdateTraining").value='pls. select one training';
   document.getElementById("locationInputUpdateTraining").value='no Data'
   document.getElementById("dateInputUpdateTraining").value='no Data'

  }
// End of the onclick event listener
});

// Update Location
document.getElementById('updateLocationBtn').addEventListener('click', function() {
  //Get the table
  var table = document.getElementById("adminLocationTable");
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
     var locationID = row.cells[1].innerHTML;
     var locationName = row.cells[2].innerHTML;
     var locationCity = row.cells[5].innerHTML;
     // Push the data into the array
     arr.push(locationID, locationName, locationCity);
   }
  }
  // Ensure that only one checkBox is selected
  if (arr.length == 3) {
   document.getElementById("idInputUpdateLocationID").value=arr[0];
   document.getElementById("idInputUpdateLocationName").value=arr[1];
   document.getElementById("idInputUpdateLocationCity").value=arr[2];

 } else if (arr.length > 3) {
   document.getElementById("idInputUpdateLocationID").value='pls. select only one location';
   document.getElementById("idInputUpdateLocationName").value='No Data';
   document.getElementById("idInputUpdateLocationCity").value='No Data';

  } else {
   document.getElementById("idInputUpdateLocationID").value='pls. select one location';
   document.getElementById("idInputUpdateLocationName").value='No Data';
   document.getElementById("idInputUpdateLocationCity").value='No Data';

  }
// End of the onclick event listener
});

// Update Location Mobile
document.getElementById('updateLocationMobileBtn').addEventListener('click', function() {
  //Get the table
  var table = document.getElementById("adminLocationTable");
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
     var locationID = row.cells[1].innerHTML;
     var locationName = row.cells[2].innerHTML;
     var locationCity = row.cells[5].innerHTML;
     // Push the data into the array
     arr.push(locationID, locationName, locationCity);
   }
  }
  // Ensure that only one checkBox is selected
  if (arr.length == 3) {
   document.getElementById("idInputUpdateLocationID").value=arr[0];
   document.getElementById("idInputUpdateLocationName").value=arr[1];
   document.getElementById("idInputUpdateLocationCity").value=arr[2];

 } else if (arr.length > 3) {
   document.getElementById("idInputUpdateLocationID").value='pls. select only one location';
   document.getElementById("idInputUpdateLocationName").value='No Data';
   document.getElementById("idInputUpdateLocationCity").value='No Data';

  } else {
   document.getElementById("idInputUpdateLocationID").value='pls. select one location';
   document.getElementById("idInputUpdateLocationName").value='No Data';
   document.getElementById("idInputUpdateLocationCity").value='No Data';

  }
// End of the onclick event listener
});

// Create Training
document.getElementById('createTrainingBtn').addEventListener('click', function() {
  //Get the table
  var table = document.getElementById("adminLocationTable");
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
     var locationID = row.cells[1].innerHTML;
     var locationName = row.cells[2].innerHTML;
     var locationCity = row.cells[5].innerHTML;
     // Push the data into the array
     arr.push(locationID, locationName, locationCity);
   }
  }
  // Ensure that only one checkBox is selected
  if (arr.length == 3) {
   document.getElementById("idInputCreateTrainingLocationID").value=arr[0];
   document.getElementById("idInputCreateTrainingLocationName").value=arr[1];
   document.getElementById("idInputCreateTrainingLocationCity").value=arr[2];

 } else if (arr.length > 3) {
   document.getElementById("idInputCreateTrainingLocationID").value='pls. select only one location';
   document.getElementById("idInputCreateTrainingLocationName").value='No Data';
   document.getElementById("idInputCreateTrainingLocationCity").value='No Data';

  } else {
   document.getElementById("idInputCreateTrainingLocationID").value='pls. select one location';
   document.getElementById("idInputCreateTrainingLocationName").value='No Data';
   document.getElementById("idInputCreateTrainingLocationCity").value='No Data';

  }
// End of the onclick event listener
});

// Create Training Mobile
document.getElementById('createTrainingMobileBtn').addEventListener('click', function() {
  //Get the table
  var table = document.getElementById("adminLocationTable");
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
     var locationID = row.cells[1].innerHTML;
     var locationName = row.cells[2].innerHTML;
     var locationCity = row.cells[5].innerHTML;
     // Push the data into the array
     arr.push(locationID, locationName, locationCity);
   }
  }
  // Ensure that only one checkBox is selected
  if (arr.length == 3) {
   document.getElementById("idInputCreateTrainingLocationID").value=arr[0];
   document.getElementById("idInputCreateTrainingLocationName").value=arr[1];
   document.getElementById("idInputCreateTrainingLocationCity").value=arr[2];

 } else if (arr.length > 3) {
   document.getElementById("idInputCreateTrainingLocationID").value='pls. select only one location';
   document.getElementById("idInputCreateTrainingLocationName").value='No Data';
   document.getElementById("idInputCreateTrainingLocationCity").value='No Data';

  } else {
   document.getElementById("idInputCreateTrainingLocationID").value='pls. select one location';
   document.getElementById("idInputCreateTrainingLocationName").value='No Data';
   document.getElementById("idInputCreateTrainingLocationCity").value='No Data';

  }
// End of the onclick event listener
});

// Create User Invoice
document.getElementById('createUserInvoiceBtn').addEventListener('click', function() {
  //Get the table
  var table = document.getElementById("adminUsersTable");
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
     var data = row.cells[3].innerHTML;
     // Push the data into the array
     arr.push(data);
   }
  }
  // Ensure that only one checkBox is selected
  if (arr.length == 1) {
   document.getElementById("emailInputCreateUserInvoice").value=arr;

  } else if (arr.length > 1) {
   document.getElementById("emailInputCreateUserInvoice").value='pls. select only one user';

  } else {
   document.getElementById("emailInputCreateUserInvoice").value='pls. select exactly one user';

  }
// End of the onclick event listener
});

// Create User Invoice Mobile
document.getElementById('createUserInvoiceMobileBtn').addEventListener('click', function() {
  //Get the table
  var table = document.getElementById("adminUsersTable");
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
     var data = row.cells[3].innerHTML;
     // Push the data into the array
     arr.push(data);
   }
  }
  // Ensure that only one checkBox is selected
  if (arr.length == 1) {
   document.getElementById("emailInputCreateUserInvoice").value=arr;

  } else if (arr.length > 1) {
   document.getElementById("emailInputCreateUserInvoice").value='pls. select only one user';

  } else {
   document.getElementById("emailInputCreateUserInvoice").value='pls. select exactly one user';

  }
// End of the onclick event listener
});

// Cancel User Invoice
document.getElementById('cancelUserInvoiceBtn').addEventListener('click', function() {
  //Get the table
  var table = document.getElementById("adminInvoicesTable");
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
     var invoiceID = row.cells[1].innerHTML;
     var invoiceDate = row.cells[2].innerHTML;
     var invoiceEmail = row.cells[5].innerHTML;
     // Push the data into the array
     arr.push(invoiceID, invoiceDate, invoiceEmail);
   }
  }
  // Ensure that only one checkBox is selected
  if (arr.length == 3) {
   document.getElementById("idInputCancelUserInvoice").value=arr[0];
   document.getElementById("dateInputCancelUserInvoice").value=arr[1];
   document.getElementById("emailInputCancelUserInvoice").value=arr[2];

 } else if (arr.length > 3) {
   document.getElementById("idInputCancelUserInvoice").value='pls. select only one invoice';
   document.getElementById("dateInputCancelUserInvoice").value='No Data';
   document.getElementById("emailInputCancelUserInvoice").value='No Data';

  } else {
   document.getElementById("idInputCancelUserInvoice").value='pls. select exactly one invoice';
   document.getElementById("dateInputCancelUserInvoice").value='No Data';
   document.getElementById("emailInputCancelUserInvoice").value='No Data';

  }
// End of the onclick event listener
});

// Cancel User Invoice Mobile
document.getElementById('cancelUserInvoiceMobileBtn').addEventListener('click', function() {
  //Get the table
  var table = document.getElementById("adminInvoicesTable");
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
     var invoiceID = row.cells[1].innerHTML;
     var invoiceDate = row.cells[2].innerHTML;
     var invoiceEmail = row.cells[5].innerHTML;
     // Push the data into the array
     arr.push(invoiceID, invoiceDate, invoiceEmail);
   }
  }
  // Ensure that only one checkBox is selected
  if (arr.length == 3) {
   document.getElementById("idInputCancelUserInvoice").value=arr[0];
   document.getElementById("dateInputCancelUserInvoice").value=arr[1];
   document.getElementById("emailInputCancelUserInvoice").value=arr[2];

 } else if (arr.length > 3) {
   document.getElementById("idInputCancelUserInvoice").value='pls. select only one invoice';
   document.getElementById("dateInputCancelUserInvoice").value='No Data';
   document.getElementById("emailInputCancelUserInvoice").value='No Data';

  } else {
   document.getElementById("idInputCancelUserInvoice").value='pls. select exactly one invoice';
   document.getElementById("dateInputCancelUserInvoice").value='No Data';
   document.getElementById("emailInputCancelUserInvoice").value='No Data';

  }
// End of the onclick event listener
});

// Create Invoice Payment
document.getElementById('createUserInvoicePaymentBtn').addEventListener('click', function() {
  //Get the table
  var table = document.getElementById("adminInvoicesTable");
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
     var invoiceID = row.cells[1].innerHTML;
     var invoiceDate = row.cells[2].innerHTML;
     var invoiceEmail = row.cells[5].innerHTML;
     // Push the data into the array
     arr.push(invoiceID, invoiceDate, invoiceEmail);
   }
  }
  // Ensure that only one checkBox is selected
  if (arr.length == 3) {
   document.getElementById("idInputCreatePaymentInvoice").value=arr[0];
   document.getElementById("dateInputCreatePaymentInvoice").value=arr[1];
   document.getElementById("emailInputCreatePaymentInvoice").value=arr[2];

 } else if (arr.length > 3) {
   document.getElementById("idInputCreatePaymentInvoice").value='pls. select only one invoice';
   document.getElementById("dateInputCreatePaymentInvoice").value='No Data';
   document.getElementById("emailInputCreatePaymentInvoice").value='No Data';

  } else {
   document.getElementById("idInputCreatePaymentInvoice").value='pls. select exactly one invoice';
   document.getElementById("dateInputCreatePaymentInvoice").value='No Data';
   document.getElementById("emailInputCreatePaymentInvoice").value='No Data';

  }
// End of the onclick event listener
});

// Create Invoice Payment Mobile
document.getElementById('createUserInvoicePaymentMobileBtn').addEventListener('click', function() {
  //Get the table
  var table = document.getElementById("adminInvoicesTable");
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
     var invoiceID = row.cells[1].innerHTML;
     var invoiceDate = row.cells[2].innerHTML;
     var invoiceEmail = row.cells[5].innerHTML;
     // Push the data into the array
     arr.push(invoiceID, invoiceDate, invoiceEmail);
   }
  }
  // Ensure that only one checkBox is selected
  if (arr.length == 3) {
   document.getElementById("idInputCreatePaymentInvoice").value=arr[0];
   document.getElementById("dateInputCreatePaymentInvoice").value=arr[1];
   document.getElementById("emailInputCreatePaymentInvoice").value=arr[2];

 } else if (arr.length > 3) {
   document.getElementById("idInputCreatePaymentInvoice").value='pls. select only one invoice';
   document.getElementById("dateInputCreatePaymentInvoice").value='No Data';
   document.getElementById("emailInputCreatePaymentInvoice").value='No Data';

  } else {
   document.getElementById("idInputCreatePaymentInvoice").value='pls. select exactly one invoice';
   document.getElementById("dateInputCreatePaymentInvoice").value='No Data';
   document.getElementById("emailInputCreatePaymentInvoice").value='No Data';

  }
// End of the onclick event listener
});
