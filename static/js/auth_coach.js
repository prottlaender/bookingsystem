document.addEventListener('DOMContentLoaded', function() {
  var sidenav_elems = document.querySelector('.sidenav');
  var instances = M.Sidenav.init(sidenav_elems);

  var modal_elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(modal_elems, {opacity: '0.4', preventScrolling: false, dismissible: true});
});


// Get Select Training Modal (select_training_modal)
var selectTrainingModal = document.getElementById("select_training_modal");
// Get the button that opens the modal
var openSelectTrainingModalBtn = document.getElementById("openSelectTrainingModalBtn");

// When the user clicks the button to open the modal, the modal pops up
openSelectTrainingModalBtn.onclick = function() {

//Reference the trainings Table
var table = document.getElementById("coachTrainingsTable");

 //Collect all CheckBoxes from trainings Table in an checkBoxes array
 var checkBoxes = table.getElementsByClassName("checkboxes");

 //Create an empty array to collect trainings
 var arr = []
 // loop through the checkBoxes
 for (var i = 0; i < checkBoxes.length; i++) {
   // If the checkbox is checked
   if (checkBoxes[i].checked) {
     // Store the HTML table row element where checkbox is checked in a variable
     var row = checkBoxes[i].parentNode.parentNode.parentNode.parentNode;
     // Store the innerHTML value of the second cell in a variable (cells starting with 0)
     var data = row.cells[1].innerHTML;
     // Push the training data (training ID) into the array
     arr.push(data);
   }
 }

 if (arr.length == 1) {
   document.getElementById("idinput").value=arr;

 } else if (arr.length > 1) {
   document.getElementById("idinput").value='pls. select only one value';

 } else {
   document.getElementById("idinput").value='pls. select value';

 }
 
}
