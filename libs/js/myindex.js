
// Global variables
var  allDepartments, allLocations, allEmployees, searchedEmployeesID=[];
var departmentList, locationList;

//------------------------------------------//
//-------------- Main code -----------------//
//------------------------------------------//

xmlhttp_php("libs/php/getAll.php", getAllEmployees);
// $.getJSON("libs/php/getAll.php", getAllEmployees);
xmlhttp_php("libs/php/getAllDepartments.php", getAllDepartments);
xmlhttp_php("libs/php/getAllLocations.php", getAllLocations);

//getting data from add an employee form
$("#send").click(function() {
  addEmployee();
  window.location.reload();

});

//change department drop down list according to location
$("#location").change(function(){
  let locID = parseInt($(this).val());//$("#location option:checked").val();  
  options = setDepartmentDropdown(locID);  
  document.getElementById('department').innerHTML=options;


});
$("#loc").change(function(){
  let locID = parseInt($(this).val());//$("#location option:checked").val();
  options = setDepartmentDropdown(locID);
  document.getElementById('depart').innerHTML = options;

  locName =  $("#loc option:selected").text();

  var searchedEmployeesButtonVisibilty = searchEmployeesIdByNameLocation(locName);
  console.log(searchedEmployeesButtonVisibilty);

  let id;
  for(i=0;i<searchedEmployeesButtonVisibilty.length;i++){
    id = searchedEmployeesButtonVisibilty[i].button_id;
    if(!(searchedEmployeesButtonVisibilty[i].visibility.localeCompare("show")))
    {
      $(`#${id}`).show();
    }else{
      $(`#${id}`).hide();

    }
  }
  return false;


})

//change location dropdown list according to department
$("#department").change(function(){
  let deptID = parseInt($(this).val());//$("#location option:checked").val();
  options = setLocationDropdown(deptID);  
  document.getElementById('location').innerHTML=options;

});
$("#depart").change(function(){
  let deptID = parseInt($(this).val());//$("#location option:checked").val();    
  options = setLocationDropdown(deptID);
  document.getElementById('loc').innerHTML = options;

  deptName = $("#depart option:selected").text();
  locName = $("#loc option:selected").text();

  var searchedEmployeesButtonVisibilty = searchEmployeesIdByDepartmentLocation(deptName,locName);

  let id;
  for(i=0;i<searchedEmployeesButtonVisibilty.length;i++){
    id = searchedEmployeesButtonVisibilty[i].button_id;
    if(!(searchedEmployeesButtonVisibilty[i].visibility.localeCompare("show")))
    {
      $(`#${id}`).show();
    }else{
      $(`#${id}`).hide();

    }
  }
  return false;

})


//search using name 
$('#search').click(function()
{
  let ser_name = $("#search-name").val();
  // let ser_location = $("#search-location").val();
  console.log(ser_name);
  // console.log(ser_location);
  var searchednametagsIds = searchEmployeesIdByNameLocation(ser_name);
  const cards = $('.card-btn');
  console.log(cards.length);
  console.log(cards);
  // console.log(searchednametagsIds);

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
  return false;

});


//------------------------------------------//
//------------------------------------------//
//-------------- Functions -----------------//
//------------------------------------------//

// Callback function for the GET request to handle the user data
function generator(employeesData) {
  console.log(employeesData);

  const edit_code = editModel();  
  $('body').append(edit_code);

  
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
 
  if(parseInt(id)%2 == 0)
  {
    var modaltest=$(`<button id="buton-${String(id)}" type="button" class="btn card-btn btn-block mt-0 even" data-toggle="modal" data-target="#exampleModalLong-${id}"> </button>`);

  }
  else{
    var modaltest=$(`<button id="buton-${String(id)}" type="button" class="btn card-btn btn-block mt-0 odd" data-toggle="modal" data-target="#exampleModalLong-${id}"> </button>`);

  }
  // const modaltest = $(modaltest2);
  // const cardDiv = $(`<div id="${nameTag}-card" class="card"></div>`);
  const infoContainer = $(`<div class="card-info-container d-flex"></div>`);
  const h3 = $(`<p id="${nameTag}" class="card-text">${fullName}</p>`);
  const emailP = $(`<p class="card-text-em">${email}</p>`);
  const locationP = $(`<p class="card-text-loc">${location}</p>`);

  // const locationP = $(`<p class="card-text mr-4 ">${location}</p>`);
  const departmentP = $(`<p class="card-text-em">${department}</p>`);
  const jobTitleP = $(`<p class="card-text">${jobTitle}</p>`);

  $('#gallery').append(modaltest);
  modaltest.append(infoContainer);  
  infoContainer.append(h3).append(emailP).append(departmentP).append(locationP);

  return modaltest;
}

// Creates the modal window and appends it to the DOM
function createModal(id, nameTag, firstName, lastName, email, location, department, jobTitle) {
  console.log($(`#exampleModalLong-${id}`).length);
  if($(`#exampleModalLong-${id}`).length==0){
  
  const fulName = `${firstName} ${lastName}`;
  console.log('inside create modal');

  // container is nothing but modal
  const container = $(`<div class="modal fade card-m mx-5" id="exampleModalLong-${id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel-${id}" aria-hidden="true"></div>`);
  const modalDialog=$('<div class="modal-dialog" role="document"></div>');
  const modalContent = $('<div class="modal-content"></div>');

  //modal header
  const modalheader=$('<div class="modal-header"></div>');
  const modalTitle=$(`<h5 class="modal-title" id="exampleModalLabel-${id}">Employee Details</h5>`);
  const x = $(`<button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>`);
  const button_in = $(`<span aria-hidden="true">&times;</span>`);//later check

  //modal body
  const modalbody=$('<div class="modal-body"></div>');
  const h3 = $(`<h3 id="${nameTag}-modal" class="modal-name cap">Name:${fulName}</h3>`);
  const emailP = $(`<p class="modal-text">Email:${email}</p>`);
  const departmentP = $(`<p class="modal-text">Deparment:${department}</p>`);
  const locationP = $(`<p class="modal-text">Location:${location}</p>`);  
  const jobTitleP = $(`<p class="modal-text">JobTitle: ${jobTitle}</p>`);

  //modal footer
  const modalfooter = $('<div class="modal-footer"></div>');
  const editButton = $(`<button type="button" id="edit" class="btn btn-primary" data-toggle="modal" data-target="#EditContactForm">Edit</button>`);
  const delButton = $('<button type="button" id="del" class="btn btn-secondary">Delete</button>');  
  const prevButton = $('<button type="button" class="btn btn-primary">Prev</button>');
  const nextButton = $('<button type="button" class="btn btn-secondary">Next</button>');
  
  console.log('inside create modal2'); 

  $('body').append(container);
  container.append(modalDialog).append(modalContent);
  x.append(button_in);
  modalheader.append(modalTitle).append(x);
  modalbody.append(h3).append(emailP).append(departmentP).append(locationP).append(jobTitleP);
  modalfooter.append(editButton).append(delButton).append(prevButton).append(nextButton);
  modalContent.append(modalheader).append(modalbody).append(modalfooter);

  container.show();
  console.log('inside create modal3');
  console.log($(`#exampleModalLong-${id}`).length);
  // console.log(document.body.innerHTML);

  //edit button functionality 
  editButton.click(() => {

  // container.hide();
  x.trigger("click");

  document.getElementById('fname-edit').value = firstName;
  document.getElementById('lname-edit').value = lastName;
  document.getElementById('eid-edit').value = email;
  document.getElementById('job-edit').value = jobTitle;
  document.getElementById('location-edit').innerHTML = locationList;
  document.getElementById('department-edit').innerHTML = departmentList;

  //change department drop down list according to location in update 
  $("#location-edit").change(function(){
    let locID = parseInt($(this).val());//$("#location option:checked").val();
    options = setDepartmentDropdown(locID);
    document.getElementById('department-edit').innerHTML=options;
  });

  //change location drop down list according to department in update 
  $("#department-edit").change(function(){
    let deptID = parseInt($(this).val());//$("#location option:checked").val();
    options = setLocationDropdown(deptID);
    document.getElementById('location-edit').innerHTML=options;
  });

  //update button functionality
  $("#update").click(()=>{
    // deleteEmployee(id,"Update sucessful");
    let fname = $("#fname-edit").val();
    console.log(fname);

    let lname = $("#lname-edit").val();
    let loc = parseInt($("#location-edit option:checked").val()) + 1;
    console.log(loc);
    let dep = parseInt($("#department-edit option:checked").val()) + 1;
    let eid = $("#eid-edit").val();
    let job = $("#job-edit").val();
    xmlhttp_php("libs/php/updateEmployee.php?firstName=" + fname + "&lastName=" + lname + "&jobTitle=" + job + "&email=" + eid + "&deptId=" + dep +"&id=" + id, updateEmployeeData);

    alert('Update Succesful!');
    window.location.reload();

  })

})

//delete button functionality
delButton.click(() => {
  // container.hide();
  deleteEmployee(id,"Delete sucessful");
})

// // close the window
// x.click(() => {
//   container.hide();
//   // window.location.reload();

// });

$(document).keydown(e => 
  {if (e.key === 'Escape'){
  //  container.hide();
    x.trigger("click");
  //  window.location.reload();

  }});

  // previous user
  const prevUser = $(`#buton-${id}`).prev();
  if (prevUser.length === 0) {
      disableButton(prevButton);
  }
  prevButton.click(() => {
      // container.hide();
      x.trigger("click");
      prevUser.trigger("click");
      
  })

  console.log(prevUser);

  // next user
  const nextUser = $(`#buton-${id}`).next();
  if (nextUser.length === 0) {
      disableButton(nextButton);
  }
  nextButton.click(() => {
      // container.hide();
      x.trigger("click");
      nextUser.trigger("click");
  })
  console.log(nextUser);

  // use arrow keys to navigate between users
  $(document).keydown(e => {
      if (container.is(':visible')) {
          if (e.key === 'ArrowLeft' && prevButton.is(':enabled')) {
              // container.hide();
              x.trigger("click");
              prevUser.click();
          } else if (e.key === 'ArrowRight' && nextButton.is(':enabled')) {
              // container.hide();
              x.trigger("click");
              nextUser.click();
          }
      }
  });
  console.log('inside create modal last');
}
else{
  $(`#exampleModalLong-${id}`).show();
}  

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
        func(this);
        console.log(this.status);
        console.log(`cannot get information from :${url}`);
      }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function getAllDepartments(xhttp) {
  departmentsData = JSON.parse(xhttp.responseText);

  if(departmentsData.status.code == "200"){

  allDepartments=departmentsData.data;
  console.log(allDepartments);

  options = "";
  for (i = 0; i < allDepartments.length; i++) {
      if (i == 0) {
        options += '<option value="" disabled selected>Choose Department</option>';
      }
      options += `<option value="${i}">${ allDepartments[i].name}</option>`;
    }
    departmentList = options;
    const departmentDropdown = document.getElementById("department");

    departmentDropdown.innerHTML=options;
    document.getElementById("depart").innerHTML=options;
  }
  else
  {
    alert(xhttp.status.description);
  }
}

//locations drop down
function getAllLocations(xhttp) {
  
  var locationsData = JSON.parse(xhttp.responseText);
  if(locationsData.status.code == "200"){
  allLocations=locationsData.data;
  console.log(allLocations);
  options = "";
  for (i = 0; i < allLocations.length; i++) {
      if (i == 0) {
        options += '<option value="" disabled selected>Choose Location</option>';
      }
      options += `<option value="${i}">${ allLocations[i].name}</option>`;
    }
    locationList = options;
    const locationDropdown = document.getElementById("location");
    locationDropdown.innerHTML=options;
    document.getElementById("loc").innerHTML=options;
  }
  else
  {
    alert(xhttp.status.description);
  }
  }

//employee data
function getAllEmployees(xhttp) {
  
    employeesData = JSON.parse(xhttp.responseText);
    if(employeesData.status.code=="200")
    {
    //allEmployee array
    allEmployees = employeesData.data;
    // options = "";

    // for (i = 0; i < allEmployees.length; i++) {
    //     if (i == 0) {
    //       options += '<option value="" disabled selected>Choose Location</option>';
    //     }
    //     options += `<option value="${i}">${ allEmployees[i].name}</option>`;
    // }
    generator(allEmployees);
  }
  else
  {
    alert(xhttp.status.description);
  }

}

//search employees with user enterterd name 
function getSearchedEmployeesIdByName(uname){
  uname = uname.toLowerCase();
  var searchedEmployeesID = [];
  var nameTag;
    for(i=0; i < allEmployees.length; i++){
      nameTag = "buton-"+String(allEmployees[i].id);

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
  var searchedEmployeesButtonVisibilty = [];
  var nameTag;
    for(i=0; i < allEmployees.length; i++){
      nameTag = "buton-"+String(allEmployees[i].id);

        if (((allEmployees[i].firstName.toLowerCase().includes(uentry))) || ((allEmployees[i].lastName.toLowerCase().includes(uentry))) || ((allEmployees[i].location.toLowerCase().includes(uentry))) ) {
          searchedEmployeesButtonVisibilty.push({button_id :nameTag, visibility:"show"});            
    }
    else{
      searchedEmployeesButtonVisibilty.push({button_id:nameTag, visibility:"hide"});
    }
    }
    return searchedEmployeesButtonVisibilty
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
  ulocation = ulocation.toLowerCase();
  var searchedEmployeesByLocation = [];
  var nameTag;

  for(i=0; i < allEmployees.length; i++){
    nameTag = "buton-"+String(allEmployees[i].id); 

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
  alert(xhttp.status.description);
}
//edit function
function editModel()
{
    var edit_code = 
    `<div class="modal fade" id="EditContactForm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
      <div class="modal-header text-center">
        <h4 class="modal-title w-100 font-weight-bold" id="myModalLabel">Edit Employee</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body mx-3">
        <div class="form-group mb-5">
        <label data-error="wrong" data-success="right" for="fname-edit">First Name</label>
          <input type="text" id="fname-edit" class="form-control validate">
        </div>
        <div class="form-group mb-5">
        <label data-error="wrong" data-success="right" for="lname-edit">Last Name</label>
          <input type="text" id="lname-edit" class="form-control validate">
        </div>

        <div class="form-group mb-5">
        <label data-error="wrong" data-success="right" for="eid-edit">Email</label>
          <input type="email" id="eid-edit" class="form-control validate">
        </div>

        <div class="form-group mb-5">
          <label data-error="wrong" data-success="right" for="location-edit">Location</label> 
          <select id="location-edit" class="browser-default custom-select  custom-select-xs mb-3 "></select>
        </div>

        <div class="form-group mb-5">
          <label data-error="wrong" data-success="right" for="department-edit">Department</label>
          <select id="department-edit" class="browser-default custom-select  custom-select-xs mb-3 "></select>
        </div>

        <div class="form-group mb-5">
        <label data-error="wrong" data-success="right" for="job-edit">Job Title</label>
          <input type="text" id="job-edit" class="form-control validate">
        </div>

      </div>
      <div class="modal-footer d-flex justify-content-center">
      <button id="update" type="button" class="btn btn-unique" data-dismiss="modal">Update</button>
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
  let loc = parseInt($("#location option:checked").val()) + 1;
  console.log(loc);
  let dep = parseInt($("#department option:checked").val()) + 1;
  let eid = $("#eid").val();
  let job = $("#job").val();
  xmlhttp_php("libs/php/insertEmployee.php?firstName=" + fname + "&lastName=" + lname + "&jobTitle=" + job + "&email=" + eid + "&deptId=" + dep, insertEmployeeData);

} 

function deleteEmployee(id,msg)
{
 
  xmlhttp_php("libs/php/deleteEmployeeByID.php?id=" + id , deleteEmployeeData);
  alert(msg);
  window.location.reload();

}

// delete an employee
function deleteEmployeeData(xhttp){
  alert(xhttp.status.description);
  
}

//update employee
function updateEmployee(){
  if(xhttp.status.code == "200"){
  let fname = $("#fname-edit").val();

  let lname = $("#lname-edit").val();
  let loc = $("#location-edit option:checked").val();
  let dep = $("#department-edit option:checked").val();
  let eid = $("#eid-edit").val();
  let job = $("#job-edit").val();
  xmlhttp_php("libs/php/updateEmployee.php?firstName=" + fname + "&lastName=" + lname + "&jobTitle=" + job + "&email=" + eid + "&deptId=" + dep +"&id=" + id, updateEmployeeData);
}
else {
  alert(xhttp.status.description)
}
} 

function updateEmployeeData(xhttp){
  alert(xhttp.status.description);
 // window.location.reload();
}

//set department dropdown based on location
function setDepartmentDropdown(locID){
  locID = locID+1;
  options = "";
  for(i=0; i<allDepartments.length; i++){
    if (i==0)
    {
      options += '<option value="" disabled selected>Choose Location</option>';
    }
    
    if(allDepartments[i].locationID==locID){
      options += `<option value="${i}">${ allDepartments[i].name}</option>`;
    }    
    
  }
  return options;

}

//set location dropdown based on department
function setLocationDropdown(deptID){
  deptID = deptID+1;


  options = "";
  for(i=0; i<allDepartments.length; i++)
  {
    if(allDepartments[i].id==deptID)
    {
      for(j=0; j<allLocations.length; j++)
      {
        if (allDepartments[i].locationID == allLocations[j].id)
        {          
        options += `<option value="${j}" selected>${ allLocations[j].name}</option>`;
        }
        else
        {
          options += `<option value="${j}">${ allLocations[j].name}</option>`;
        }
      }
    }    
    
  }
  return options;

}


//search employees with user enterterd department and location
function searchEmployeesIdByDepartmentLocation(deptName,locName){

  deptName = deptName.toLowerCase();
  locName = locName.toLowerCase();

  var searchedEmployeesButtonVisibilty = [];
  var nameTag;

    for(i=0; i < allEmployees.length; i++){
      nameTag = "buton-"+String(allEmployees[i].id);

        if (!(allEmployees[i].location.toLowerCase().localeCompare(locName)) && !(allEmployees[i].department.toLowerCase().localeCompare(deptName))) {
          searchedEmployeesButtonVisibilty.push({button_id :nameTag, visibility:"show"});
            
    }
    else{
      searchedEmployeesButtonVisibilty.push({button_id:nameTag, visibility:"hide"});

    }
    }
    return searchedEmployeesButtonVisibilty
}

//------------------------------------------//

