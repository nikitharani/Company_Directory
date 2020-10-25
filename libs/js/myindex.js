
// Global variables
var  allDepartments, allLocations, allEmployees, searchedEmployeesID=[];

//------------------------------------------//
//-------------- Main code -----------------//
//------------------------------------------//

xmlhttp_php("libs/php/getAll.php", getAllEmployees);
// $.getJSON("libs/php/getAll.php", getAllEmployees);

xmlhttp_php("libs/php/getAllDepartments.php", getAllDepartments);
xmlhttp_php("libs/php/getAllLocations.php", getAllLocations);
// xmlhttp_php("libs/php/insertEmployee.php?firstName=" + latitude + "&lastName=" + longitude + "&jobTitle=" + longitude + "&email=" + longitude + "&deptId=" + longitude, insertEmployeeData);

//getting data from add an employee form
$("#send").click(function() {
  addEmployee();
});

//change department drop down list according to location
$("#location").change(function(){
  let locID = parseInt($(this).val());//$("#location option:checked").val();
  locID = locID+1;
  console.log("locID");
  console.log(locID);

  options = "";
  for(i=0; i<allDepartments.length; i++){
    if(allDepartments[i].locationID==locID){
      options += `<option value="${i}">${ allDepartments[i].name}</option>`;
    }    
    
  }
  document.getElementById('department').innerHTML=options;


});

//search using name 
$('#search').click(function()
// $('#search').on('input', e => 
{
  let ser_name = $("#search-name").val();
  // let ser_location = $("#search-location").val();
  console.log(ser_name);
  // console.log(ser_location);
  var searchednametagsIds = searchEmployeesIdByNameLocation(ser_name);
  // var searchednametagsIds = getSearchedEmployeesIdByLocation(ser_location);

  let id;
  for(i=0;i<searchednametagsIds.length;i++){
    id = searchednametagsIds[i].button_id;
    if(!(searchednametagsIds[i].visibility.localeCompare("show")))
    {
      $(`#${id}`).show();
    }else{
      $(`#${id}`).hide();

    }
  }

  return false

});

//test 
// search.on('input', e => {
//   const cards = $('.card');
//   const searchTerm = e.target.value.toLowerCase();
//   cards.each((index, card) => {
//       const regex = /^(\w*)\-(\w*)\-card/;
//       const id = $(card).attr('id');
//       const name = id.replace(regex, '$1 $2');
//       if (name.includes(searchTerm)) {
//           $(`#${id}`).show();
//       } else {
//           $(`#${id}`).hide();
//       }
//   });
// });


//------------------------------------------//




//------------------------------------------//
//-------------- Functions -----------------//
//------------------------------------------//

// Callback function for the GET request to handle the user data
function generator(employeesData) {
  console.log(employeesData);
  
  employeesData.forEach(user => {
      const id = user.id;
      const firstName = user.firstName;
      const lastName = user.lastName;
      const nameTag = `${firstName}-${lastName}`;
      const fullName = `${firstName} ${lastName}`;
      const email = user.email;
      const location = user.location;
      const jobTitle = user.jobTitle;
      const department = user.department;

      const card = createCard(id, nameTag, fullName, email, location, department, jobTitle);

      card.click(() => {
          createModal(id, nameTag, firstName, lastName, email, location, department, jobTitle);
      });
      
  })
}

//Creates the user's card from the supplied data and attaches it to the DOM
function createCard(id, nameTag, fullName, email, location, department, jobTitle) {
  const modaltest=$(`<button id="${nameTag}-${id.toString()}" type="button" class="btn btn-primary card-btn" data-toggle="modal" data-target="#exampleModalLong"> </button>`);

  // const cardDiv = $(`<div id="${nameTag}-card" class="card"></div>`);
  const infoContainer = $('<div class="card-info-container"></div>');
  const h3 = $(`<h3 id="${nameTag}" class="card-name cap">${fullName}</h3>`);
  const emailP = $(`<p class="card-text">Email: ${email}</p>`);
  const locationP = $(`<p class="card-text loc">Location: ${location}</p>`);
  const departmentP = $(`<p class="card-text dep">Department: ${department}</p>`);
  const jobTitleP = $(`<p class="card-text job">JobTitle: ${jobTitle}</p>`);

  $('#gallery').append(modaltest);
  modaltest.append(infoContainer);  
  infoContainer.append(h3).append(emailP).append(departmentP).append(locationP).append(jobTitleP);

  return modaltest;
}

// Creates the modal window and appends it to the DOM
function createModal(id, nameTag, firstName, lastName, email, location, department, jobTitle) {
  const fulName = `${firstName} ${lastName}`;
  console.log('inside create modal');
  // const container = $('<div class="modal-container"></div>');
  const container = $('<div class="modal" id="exampleModalLong" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"></div>');
  const modalDialog=$('<div class="modal-dialog" role="document"></div>');
  const modalContent = $('<div class="modal-content"></div>');
  //modal header
  const modalheader=$('<div class="modal-header"></div>');
  const modalTitle=$('<h5 class="modal-title">Employee Details</h5>');
  const x = $('<button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>');
  const button_in = $('<span aria-hidden="true">&times;</span>');//later check
  //modal body
  const modalbody=$('<div class="modal-body"></div>');
  const h3 = $(`<h3 id="${nameTag}-modal" class="modal-name cap">Name:${fulName}</h3>`);
  const emailP = $(`<p class="modal-text">Email:${email}</p>`);
  const departmentP = $(`<p class="modal-text">Deparment:${department}</p>`);
  const locationP = $(`<p class="modal-text">Location:${location}</p>`);  
  const jobTitleP = $(`<p class="modal-text">JobTitle: ${jobTitle}</p>`);
  //modal footer
  const modalfooter = $('<div class="modal-footer"></div>');
  // const prevButton = $('<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>');
  // const nextButton = $('<button type="button" id="modal-next" class="modal-next btn">Next</button>');
  const editButton = $('<button type="button" id="edit" class="btn btn-primary" data-toggle="modal" data-target="#EditContactForm">Edit</button>');
  const delButton = $('<button type="button" id="del" class="btn btn-secondary">Delete</button>');
  
  const prevButton = $('<button type="button" class="btn btn-primary">Prev</button>');
  const nextButton = $('<button type="button" class="btn btn-secondary">Next</button>');
  
  console.log('inside create modal2');
  const edit_code = editModel(firstName, lastName, location, email, department, jobTitle );

  $('body').append(container);
  container.append(modalDialog).append(modalContent);
  x.append(button_in);
  modalheader.append(modalTitle).append(x);
  modalbody.append(h3).append(emailP).append(departmentP).append(locationP).append(jobTitleP);
  modalfooter.append(editButton).append(delButton).append(prevButton).append(nextButton);
  modalContent.append(modalheader).append(modalbody).append(modalfooter);
  // dataContainer.append(h3).append(emailP).append(departmentP).append(locationP).append(jobTitleP);
  // navContainer.append(prevButton).append(nextButton);
  container.show();
  console.log('inside create modal3');
  // console.log(document.body.innerHTML);

  //edit button functionality 
editButton.click(() => {

  container.hide();
  $('body').append(edit_code);
  // $('#EditContactForm').show();

})

  // close the window
  x.click(() => container.hide());
  $(document).keydown(e => {if (e.key === 'Escape') container.hide()});

  // previous user
  const prevUser = $(`#${nameTag}-card`).prev();
  if (prevUser.length === 0) {
      disableButton(prevButton);
  }
  prevButton.click(() => {
      container.hide();
      prevUser.trigger("click");
  })

  console.log(prevUser);

  // next user
  const nextUser = $(`#${nameTag}-card`).next();
  if (nextUser.length === 0) {
      disableButton(nextButton);
  }
  nextButton.click(() => {
      container.hide();
      nextUser.trigger("click");
  })
  console.log(nextUser);

  // use arrow keys to navigate between users
  $(document).keydown(e => {
      if (container.is(':visible')) {
          if (e.key === 'ArrowLeft' && prevButton.is(':enabled')) {
              container.hide();
              prevUser.click();
          } else if (e.key === 'ArrowRight' && nextButton.is(':enabled')) {
              container.hide();
              nextUser.click();
          }
      }
  });
  console.log('inside create modal last');

}

// disable button
function disableButton(button) {
  button.prop('disabled', true);
  button.addClass('disable');
}




// base php ajax call function
function xmlhttp_php(url, func) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        func(this);
      }
      else if (this.status != 200 && this.status != 0) {
        console.log(this.status);
        console.log(`cannot get information from :${url}`);
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function getAllDepartments(xhttp) {
  departmentsData = JSON.parse(xhttp.responseText);
  allDepartments=departmentsData.data;
  console.log(allDepartments);

  options = "";
  for (i = 0; i < allDepartments.length; i++) {
      if (i == 0) {
        options += '<option value="" disabled selected>Choose Department</option>';
      }
      options += `<option value="${i}">${ allDepartments[i].name}</option>`;
    }
    const departmentList = document.getElementById("department");
    departmentList.innerHTML=options;
    
}

//locations drop down
function getAllLocations(xhttp) {
  var locationsData = JSON.parse(xhttp.responseText);
  allLocations=locationsData.data;
  console.log(allLocations);
  options = "";
  for (i = 0; i < allLocations.length; i++) {
      if (i == 0) {
        options += '<option value="" disabled selected>Choose Location</option>';
      }
      options += `<option value="${i}">${ allLocations[i].name}</option>`;
    }
    const locationList = document.getElementById("location");
    locationList.innerHTML=options;
  
  
  }

//employee data
function getAllEmployees(xhttp) {
  // console.log(xhttp);
  // employeesData = xhttp;
    employeesData = JSON.parse(xhttp.responseText);

    //allEmployee array
    allEmployees = employeesData.data;
    options = "";

    for (i = 0; i < allEmployees.length; i++) {
        if (i == 0) {
          options += '<option value="" disabled selected>Choose Location</option>';
        }
        options += `<option value="${i}">${ allEmployees[i].name}</option>`;
    }
    generator(allEmployees);
    const cards = $('.card-btn');
    console.log(cards);

}

//search employees with user enterterd name 
function getSearchedEmployeesIdByName(uname){
  uname=uname.toLowerCase();
  var searchedEmployeesID = [];
  var nameTag;
    for(i=0; i < allEmployees.length; i++){
      nameTag = allEmployees[i].firstName + "-" + allEmployees[i].lastName + "-" + allEmployees[i].id.toString();

        if (((allEmployees[i].firstName.toLowerCase().includes(uname))) || ((allEmployees[i].lastName.toLowerCase().includes(uname)))) {
            searchedEmployeesID.push({button_id :nameTag, visibility:"show"});
            
    }
    else{
      searchedEmployeesID.push({button_id:nameTag, visibility:"hide"});

    }
    }
    return searchedEmployeesID
}

//search employees with user enterterd name or location
function searchEmployeesIdByNameLocation(uentry){
  uentry=uentry.toLowerCase();
  var searchedEmployeesID = [];
  var nameTag;
    for(i=0; i < allEmployees.length; i++){
      nameTag = allEmployees[i].firstName + "-" + allEmployees[i].lastName + "-" + allEmployees[i].id.toString();

        if (((allEmployees[i].firstName.toLowerCase().includes(uentry))) || ((allEmployees[i].lastName.toLowerCase().includes(uentry))) || ((allEmployees[i].location.toLowerCase().includes(uentry))) ) {
            searchedEmployeesID.push({button_id :nameTag, visibility:"show"});
            
    }
    else{
      searchedEmployeesID.push({button_id:nameTag, visibility:"hide"});

    }
    }
    return searchedEmployeesID
}

// displayEmployeeInfo(searchedEmployeesID);
// display searched employess info using ID's
function displayEmployeeInfo(employeeIDs){
    var SearchedEmployeeData=[];

    if(employeeIDs[0]==-1){
        SearchedEmployeeData=allEmployees; //if default
    }else{
        //searchedEmployeesID
        for(i=0;i<employeeIDs.length;i++){
            var Id = employeeIDs[i];
            SearchedEmployeeData.push(allEmployees[Id-1]);
        }
   
    }
    return SearchedEmployeeData
    // innerHTml

}

//search employees with user selected Department
function getSearchedEmployeesIdByDepartment(udepartment){
    for(i=0;i<allEmployees.length;i++){
        
        if (!(allEmployees[i].department.localeCompare(udepartment))) {
            searchedEmployeesID.push(i+1);
            
    }

}
}

//search employees with user enterterd location 
function getSearchedEmployeesIdByLocation(ulocation){
  ulocation=ulocation.toLowerCase();
  var searchedEmployeesByLocation = [];
  var nameTag;

  for(i=0; i < allEmployees.length; i++){
    nameTag = allEmployees[i].firstName + "-" + allEmployees[i].lastName + "-" + allEmployees[i].id.toString();

        if ((allEmployees[i].location.toLowerCase().includes(ulocation))) {
          searchedEmployeesByLocation.push({button_id :nameTag, visibility:"show"});
            
    }else{
      searchedEmployeesByLocation.push({button_id:nameTag, visibility:"hide"});

    }
    
}
return searchedEmployeesByLocation;
} 

// create an employee
function insertEmployeeData(xhttp){
  result = JSON.parse(xhttp.responseText);

  console.log(result.status);
}
//edit function
function editModel(fname, lname, location, email, department, jobTitle )
{
  var edit_code = 
  `<div class="modal fade" id="EditContactForm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
  aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header text-center">
        <h4 class="modal-title w-100 font-weight-bold">Edit Employee</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body mx-3">
        <div class="md-form mb-5">
          <i class="fas fa-user prefix grey-text"></i>
          <input type="text" id="fname" value="${fname}" class="form-control validate">
          <label data-error="wrong" data-success="right" for="fname">First Name</label>
        </div>
        <div class="md-form mb-5">
          <i class="fas fa-user prefix grey-text"></i>
          <input type="text" id="lname" value="${lname}" class="form-control validate">
          <label data-error="wrong" data-success="right" for="lname">Last Name</label>
        </div>

        <div class="md-form mb-5">
          <i class="fas fa-envelope prefix grey-text"></i>
          <input type="email" id="eid" value="${email}" class="form-control validate">
          <label data-error="wrong" data-success="right" for="eid">Email</label>
        </div>

        <div class="md-form mb-5">
          <!-- <i class="fas fa-tag prefix grey-text"></i> -->
          <label data-error="wrong" data-success="right" for="location"></label> 
          <select id="location" class="browser-default custom-select  custom-select-xs mb-3 ">
          </select>
        </div>

        <div class="md-form mb-5">
          <!-- <i class="fas fa-tag prefix grey-text"></i> -->
          <label data-error="wrong" data-success="right" for="department"></label>
          <select id="department" class="browser-default custom-select  custom-select-xs mb-3 ">
          </select>
        </div>

        <div class="md-form mb-5">
          <i class="fas fa-tag prefix grey-text"></i>
          <input type="text" id="job" value="${jobTitle}" class="form-control validate">
          <label data-error="wrong" data-success="right" for="job">Job Title</label>
        </div>

      </div>
      <div class="modal-footer d-flex justify-content-center">
        <button id="update" class="btn btn-unique" data-dismiss="modal">Update<i class="fas fa-paper-plane-o ml-1"></i></button>
      </div>
    </div>
  </div>
</div>`;
return edit_code;
}

//add new employee
function addEmployee(){
  let fname = $("#fname").val();
  console.log(fname);

  let lname = $("#lname").val();
  let loc = $("#location option:checked").val();
  console.log(loc);
  let dep = $("#department option:checked").val();
  let eid = $("#eid").val();
  let job = $("#job").val();
  xmlhttp_php("libs/php/insertEmployee.php?firstName=" + fname + "&lastName=" + lname + "&jobTitle=" + job + "&email=" + eid + "&deptId=" + dep, insertEmployeeData);

} 

function deleteEmployee(id)
{
 
  xmlhttp_php("libs/php/deleteEmployeeByID.php?id=" + id , deleteEmployeeData);


}
// delete an employee
function deleteEmployeeData(xhttp){
  result = JSON.parse(xhttp.responseText);

  console.log(result.status);
}

//------------------------------------------//

