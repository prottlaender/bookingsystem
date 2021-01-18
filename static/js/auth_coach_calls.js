document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.sidenav');
  var instances = M.Sidenav.init(elems);

  var modal_elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(modal_elems, {opacity: '0.4', preventScrolling: false, dismissible: true});
});

// Get the confirm participants button
var openConfirmParticipantsModalBtn = document.getElementById("openConfirmParticipantsModalBtn");

// When the user click on confirm participants button
openConfirmParticipantsModalBtn.onclick = function() {

//Reference the participants Table
var table = document.getElementById("confirmParticipantsTable");

 //Collect all CheckBoxes from participants Table in an checkBoxes array
 var checkBoxes = table.getElementsByClassName("checkboxes");

 //Create an empty array to collect all participants data objects
 var arr = []
 // loop through the checkBoxes
 for (var i = 0; i < checkBoxes.length; i++) {
   // If the checkbox is checked
   if (checkBoxes[i].checked) {
     // Store the HTML table row element where checkbox is checked in a variable
     var row = checkBoxes[i].parentNode.parentNode.parentNode.parentNode;
     // Store the innerHTML value of the fourth cell in a variable (cells starting with 0)
     var emaildata = row.cells[3].innerHTML;
     // Store the innerHTML value of the sixth cell in a variable (cells starting with 0)
     var iddata = row.cells[5].innerHTML;
     // Create the participants data object
     var obj = { email: emaildata, id: iddata }
     // Push the participants data objects into the array
     arr.push(obj);
   }
 }

 const data_stringify = JSON.stringify(arr)

 console.log("data_stringify: " +data_stringify);
 console.log("arr.length: " +arr.length);

 if (arr.length == 0) {
   document.getElementById("participantsdata").value="pls. select minimum one participant"
 } else {
   document.getElementById("participantsdata").value=data_stringify
   document.getElementById("amountparticipants").value=arr.length
 }

}
