
// Global variables
var allDepartments, allLocations, allEmployees, searchedEmployeesID = [];
var departmentList, locationList, rowColor = true, ascendingOrder = true, ascendingOrderDepartment = true, ascendingOrderLocation = true;
var EmployeesView = true, departmentView = false, locationView = false;

//------------------------------------------//
//-------------- Main code -----------------//
//------------------------------------------// 


// alert("Your screen resolution is: " + screen.width + "x" + screen.height);


xmlhttp_php("libs/php/getAll.php", getAllEmployees);
// $.getJSON("libs/php/getAll.php", getAllEmployees);
xmlhttp_php("libs/php/getAllDepartments.php", getAllDepartments);
xmlhttp_php("libs/php/getAllLocations.php", getAllLocations);

//getting data from add an employee form
$("#send").click(function () {
  addEmployee();

});

//change department drop down list according to location
$("#location").change(function () {
  let locID = parseInt($(this).val());//$("#location option:checked").val();  
  options = setDepartmentDropdown(locID);
  document.getElementById('department').innerHTML = options;


});
$(".loc").change(function () {
  let locID = parseInt($(this).val());//$("#location option:checked").val();
  options = setDepartmentDropdown(locID);
  document.getElementsByClassName("depart")[0].innerHTML = options;
  // document.getElementsByClassName("depart")[1].innerHTML = options;

  locName = $(this).find('option:selected').text();

  var searchedEmployeesButtonVisibilty = searchEmployeesIdByNameLocation(locName);

  let id;
  for (i = 0; i < searchedEmployeesButtonVisibilty.length; i++) {
    id = searchedEmployeesButtonVisibilty[i].button_id;
    if (!(searchedEmployeesButtonVisibilty[i].visibility.localeCompare("show"))) {
      $(`#${id}`).show();
    } else {
      $(`#${id}`).hide();

    }
  }
  return false;


})

//name sort calling function
$("#name-sort").click(function () {
  ascending();
});

$("#location-sort").click(function () {
  var locationName_with_index = [];

  for (var i in allLocations) {
    locationName_with_index.push([allLocations[i].name.toLowerCase(), 'loc-row-' + String(allLocations[i].id)]);
  }
  //appling sort
  locationName_with_index.sort(function (left, right) {
    return left[0] < right[0] ? -1 : 1;
  });

  if (ascendingOrderLocation == true) {
    for (i = 0; i < locationName_with_index.length; i++) {
      $(`#${locationName_with_index[i][1]}`).prependTo("#loc-body");
    }
    ascendingOrderLocation = false;
  }
  else {
    for (i = locationName_with_index.length - 1; i >= 0; i--) {
      $(`#${locationName_with_index[i][1]}`).prependTo("#loc-body");
    }
    ascendingOrderLocation = true;
  }
});

$("#department-sort").click(function () {
  var departmentName_with_index = [];

  for (var i in allDepartments) {
    departmentName_with_index.push([allDepartments[i].name.toLowerCase(), 'dept-row-' + String(allDepartments[i].id)]);
  }
  //appling sort
  departmentName_with_index.sort(function (left, right) {
    return left[0] < right[0] ? -1 : 1;
  });

  if (ascendingOrderDepartment == true) {
    for (i = 0; i < departmentName_with_index.length; i++) {
      $(`#${departmentName_with_index[i][1]}`).prependTo("#depart-body");
    }
    ascendingOrderDepartment = false;
  }
  else {
    for (i = departmentName_with_index.length - 1; i >= 0; i--) {
      $(`#${departmentName_with_index[i][1]}`).prependTo("#depart-body");
    }
    ascendingOrderDepartment = true;
  }
});

//change location dropdown list according to department
$("#department").change(function () {
  let deptID = parseInt($(this).val());//$("#location option:checked").val();
  options = setLocationDropdown(deptID);
  document.getElementById('location').innerHTML = options;

});
$(".depart").change(function () {
  let deptID = parseInt($(this).val());//$("#location option:checked").val();    
  options = setLocationDropdown(deptID);
  document.getElementsByClassName("loc")[0].innerHTML = options;
  // document.getElementsByClassName("loc")[1].innerHTML = options;

  deptName = $(this).find('option:selected').text();
  locName = $($(".loc")[0]).find('option:selected').text();

  var searchedEmployeesButtonVisibilty = searchEmployeesIdByDepartmentLocation(deptName, locName);

  let id;
  for (i = 0; i < searchedEmployeesButtonVisibilty.length; i++) {
    id = searchedEmployeesButtonVisibilty[i].button_id;
    if (!(searchedEmployeesButtonVisibilty[i].visibility.localeCompare("show"))) {
      $(`#${id}`).show();
    } else {
      $(`#${id}`).hide();

    }
  }
  return false;

})


//search using name 
$('#search, #search-mob').click(function () {
  let ser_name = $("#search-name-mobile").val();
  if (ser_name == "") {
    ser_name = $("#search-name").val();
  }
  else {
    ser_name = $("#search-name-mobile").val();
  }


  // console.log(ser_name);
  // console.log(ser_location);
  var searchednametagsIds = searchEmployeesIdByNameLocation(ser_name);

  // console.log(searchednametagsIds);

  let id;
  for (i = 0; i < searchednametagsIds.length; i++) {
    id = searchednametagsIds[i].button_id;
    if (!(searchednametagsIds[i].visibility.localeCompare("show"))) {
      $(`#${id}`).show();
    } else {
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
  // console.log(employeesData);

  const edit_code = editModel();
  $('body').append(edit_code);

  const delete_code = deleteModal('employees');
  $('body').append(delete_code);

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

  if (rowColor == true) {
    var modaltest = $(`<button id="buton-${String(id)}" type="button" class="btn card-btn btn-block mt-0 even" data-toggle="modal" data-target="#exampleModalLong-${id}"> </button>`);
    rowColor = false;
  }
  else {
    var modaltest = $(`<button id="buton-${String(id)}" type="button" class="btn card-btn btn-block mt-0 odd" data-toggle="modal" data-target="#exampleModalLong-${id}"> </button>`);
    rowColor = true;
  }
  // const modaltest = $(modaltest2);
  // const cardDiv = $(`<div id="${nameTag}-card" class="card"></div>`);
  const infoContainer = $(`<div class="card-info-container btn-container d-flex"></div>`);
  const h3 = $(`<p id="${nameTag}" class="card-text-fname">${fullName}</p>`);
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
  // console.log($(`#exampleModalLong-${id}`).length);
  if ($(`#exampleModalLong-${id}`).length == 0) {

    const fulName = `${firstName} ${lastName}`;

    // container is nothing but modal
    const container = $(`<div class="modal fade card-m mx-5" id="exampleModalLong-${id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel-${id}" aria-hidden="true"></div>`);
    const modalDialog = $('<div class="modal-dialog modal-s" role="document"></div>');
    const modalContent = $('<div class="modal-content"></div>');

    //modal header
    const modalheader = $('<div class="modal-header"></div>');
    const modalTitle = $(`<h5 class="modal-title" id="exampleModalLabel-${id}">Employee Details</h5>`);
    const x = $(`<button type="button" class="close" data-dismiss="modal" aria-label="Close"></button>`);
    const button_in = $(`<span aria-hidden="true">&times;</span>`);//later check

    //modal body
    const modalbody = $('<div class="modal-body"></div>');
    const h3 = $(`<h3 id="${nameTag}-modal" class="modal-name cap">Name:${fulName}</h3>`);
    const emailP = $(`<p class="modal-text">Email:${email}</p>`);
    const departmentP = $(`<p class="modal-text">Department:${department}</p>`);
    const locationP = $(`<p class="modal-text">Location:${location}</p>`);
    const jobTitleP = $(`<p class="modal-text">JobTitle: ${jobTitle}</p>`);

    //modal footer
    const modalfooter = $('<div class="modal-footer"></div>');
    const editButton = $(`<button type="button" id="edit" class="btn btn-primary button1" data-toggle="modal" data-target="#EditContactForm"><i class="fas fa-edit"></i>
  </button>`);
    const prevButton = $('<button type="button" class="btn btn-secondary button1"> <i class="fas fa-angle-double-left"></i></button>');
    const nextButton = $('<button type="button" class="btn btn-secondary button1"> <i class="fas fa-angle-double-right"></i></button>');
    const delButton = $('<button type="button" id="del" class="btn btn-primary button1" data-toggle="modal" data-target="#delete-modal-employees"><i class="fas fa-trash-alt"></i></button>');

    $('body').append(container);
    container.append(modalDialog).append(modalContent);
    x.append(button_in);
    modalheader.append(modalTitle).append(x);
    modalbody.append(h3).append(emailP).append(departmentP).append(locationP).append(jobTitleP);
    modalfooter.append(editButton).append(delButton).append(prevButton).append(nextButton);
    modalContent.append(modalheader).append(modalbody).append(modalfooter);

    // document.getElementById('del-text').innerHTML="Are you sure want to Delete ?";

    container.show();
    // console.log('inside create modal3');
    // console.log($(`#exampleModalLong-${id}`).length);
    // console.log(document.body.innerHTML);

    //edit button functionality 
    editButton.click(() => {

      // container.hide();
      x.trigger("click");

      // assigning default values of current user
      document.getElementById('fname-edit').value = firstName;
      document.getElementById('lname-edit').value = lastName;
      document.getElementById('eid-edit').value = email;
      document.getElementById('job-edit').value = jobTitle;
      document.getElementById('location-edit').innerHTML = getLocationDropdownWithSelectedId(location);
      document.getElementById('department-edit').innerHTML = getDepartmentDropdownWithSelectedId(department);

      //change department drop down list according to location in update 
      $("#location-edit").change(function () {
        let locID = parseInt($(this).val());//$("#location option:checked").val();
        options = setDepartmentDropdown(locID);
        document.getElementById('department-edit').innerHTML = options;
      });

      //change location drop down list according to department in update 
      $("#department-edit").change(function () {
        let deptID = parseInt($(this).val());//$("#location option:checked").val();
        options = setLocationDropdown(deptID);
        document.getElementById('location-edit').innerHTML = options;
      });

      //update button functionality
      $("#update").click(() => {
        // deleteEmployee(id,"Update sucessful");
        updateEmployee(id);

      })

    })

    // //delete button functionality

    delButton.click(() => {
      document.getElementById('del-text-employees').innerHTML = "Are you sure want to delete employee " + "'" + fulName + "' ?";
      $('#del-yes-employees').click(() => {
        container.hide();
        $('#delete-modal-employees').hide();
        deleteEmployee(id);
      })
    })

    // // close the window
    // x.click(() => {
    //   container.hide();
    //   // window.location.reload();

    // });

    $(document).keydown(e => {
      if (e.key === 'Escape') {
        //  container.hide();
        x.trigger("click");
        //  window.location.reload();

      }
    });

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

    // console.log(prevUser);

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
    // console.log(nextUser);

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
  }
  else {
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
      // console.log(this.status);
      // console.log(`cannot get information from :${url}`);
    }
  };
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

function getAllDepartments(xhttp) {
  departmentsData = JSON.parse(xhttp.responseText);

  if (departmentsData.status.code == "200") {

    allDepartments = departmentsData.data;
    // console.log(allDepartments);

    options = "";
    for (i = 0; i < allDepartments.length; i++) {
      if (i == 0) {
        options += '<option value="" selected>Choose Department</option>';
      }
      options += `<option value="${allDepartments[i].id}">${allDepartments[i].name}</option>`;
    }
    departmentList = options;
    const departmentDropdown = document.getElementById("department");

    departmentDropdown.innerHTML = options;
    document.getElementsByClassName("depart")[0].innerHTML = options;
    // document.getElementsByClassName("depart")[1].innerHTML = options;
    // loc-In-Dept-edit

    // set data in department table
    departmentGenerator(allDepartments);

  }
  else {
    alert(xhttp.status.description);
  }
}

//locations drop down
function getAllLocations(xhttp) {

  var locationsData = JSON.parse(xhttp.responseText);
  if (locationsData.status.code == "200") {
    allLocations = locationsData.data;
    // console.log(allLocations);
    options = "";
    for (i = 0; i < allLocations.length; i++) {
      if (i == 0) {
        options += '<option value="" selected>Choose Location</option>';
      }
      options += `<option value="${allLocations[i].id}">${allLocations[i].name}</option>`;
    }
    locationList = options;
    const locationDropdown = document.getElementById("location");
    locationDropdown.innerHTML = options;
    // console.log(document.getElementsByClassName("loc"));
    document.getElementsByClassName("loc")[0].innerHTML = options;
    // document.getElementsByClassName("loc")[1].innerHTML = options;
    document.getElementById("loc-In-Dept-add").innerHTML = options;
    // document.getElementById("loc-In-Dept-edit").innerHTML = options;


    // set data in locations table
    locationGenerator(allLocations);


  }
  else {
    alert(xhttp.status.description);
  }
}

//employee data
function getAllEmployees(xhttp) {

  employeesData = JSON.parse(xhttp.responseText);
  if (employeesData.status.code == "200") {
    //allEmployee array
    allEmployees = employeesData.data;
    generator(allEmployees);
  }
  else {
    alert(xhttp.status.description);
  }

}

//search employees with user enterterd name 
function getSearchedEmployeesIdByName(uname) {
  uname = uname.toLowerCase();
  var searchedEmployeesID = [];
  var nameTag;
  for (i = 0; i < allEmployees.length; i++) {
    nameTag = "buton-" + String(allEmployees[i].id);

    if (((allEmployees[i].firstName.toLowerCase().includes(uname))) || ((allEmployees[i].lastName.toLowerCase().includes(uname)))) {
      searchedEmployeesID.push({ button_id: nameTag, visibility: "show" });

    }
    else {
      searchedEmployeesID.push({ button_id: nameTag, visibility: "hide" });

    }
  }
  return searchedEmployeesID
}

//search employees with user enterterd name or location
function searchEmployeesIdByNameLocation(uentry) {
  uentry = uentry.toLowerCase();
  var searchedEmployeesButtonVisibilty = [];
  var nameTag;
  for (i = 0; i < allEmployees.length; i++) {
    nameTag = "buton-" + String(allEmployees[i].id);

    if (((allEmployees[i].firstName.toLowerCase().includes(uentry))) || ((allEmployees[i].lastName.toLowerCase().includes(uentry))) || ((allEmployees[i].location.toLowerCase().includes(uentry)))) {
      searchedEmployeesButtonVisibilty.push({ button_id: nameTag, visibility: "show" });
    }
    else {
      searchedEmployeesButtonVisibilty.push({ button_id: nameTag, visibility: "hide" });
    }
  }
  return searchedEmployeesButtonVisibilty
}

//search employees with user selected Department
function getSearchedEmployeesIdByDepartment(udepartment) {
  for (i = 0; i < allEmployees.length; i++) {

    if (!(allEmployees[i].department.localeCompare(udepartment))) {
      searchedEmployeesID.push(i + 1);
    }
  }
}

//search employees with user enterterd location 
function getSearchedEmployeesIdByLocation(ulocation) {
  ulocation = ulocation.toLowerCase();
  var searchedEmployeesByLocation = [];
  var nameTag;

  for (i = 0; i < allEmployees.length; i++) {
    nameTag = "buton-" + String(allEmployees[i].id);

    if ((allEmployees[i].location.toLowerCase().includes(ulocation))) {
      searchedEmployeesByLocation.push({ button_id: nameTag, visibility: "show" });

    } else {
      searchedEmployeesByLocation.push({ button_id: nameTag, visibility: "hide" });

    }

  }
  return searchedEmployeesByLocation;
}

//edit function
function editModel() {
  var edit_code =
    `<div class="modal fade" style="overflow: auto" id="EditContactForm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
      <div class="modal-header text-center">
        <h4 class="modal-title w-100 font-weight-bold" id="myModalLabel">Edit Employee</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body mx-3">
        <div class="form-group mb-1">
        <label data-error="wrong" data-success="right" for="fname-edit">First Name</label>
          <input type="text" id="fname-edit" class="form-control validate">
        </div>
        <div class="form-group mb-1">
        <label data-error="wrong" data-success="right" for="lname-edit">Last Name</label>
          <input type="text" id="lname-edit" class="form-control validate">
        </div>

        <div class="form-group mb-3">
        <label data-error="wrong" data-success="right" for="eid-edit">Email</label>
          <input type="email" id="eid-edit" class="form-control validate">
        </div>       

        <div class="form-group mb-3">
          <label data-error="wrong" data-success="right" for="department-edit">Department</label>
          <select id="department-edit" class="browser-default custom-select  custom-select-xs mb-3"></select>
          <div id="invalid-department" class="invalid-department"></div>
        </div>

        <div class="form-group mb-3">
          <label data-error="wrong" data-success="right" for="location-edit">Location</label> 
          <select id="location-edit" class="browser-default custom-select  custom-select-xs mb-3"></select>
          <div id="invalid-location" class="invalid-location"></div>
        </div>

        <div class="form-group mb-3">
        <label data-error="wrong" data-success="right" for="job-edit">Job Title</label>
          <input type="text" id="job-edit" class="form-control validate">
        </div>

      </div>
      <div class="modal-footer d-flex justify-content-center">
      <button id="update" type="button" class="btn btn-unique">Update</button>
      </div>
    </div>
  </div>
</div>`;

  return edit_code;
}

//add new employee
function addEmployee() {
  let fname = $("#fname").val();
  // console.log(fname);
  let loc = parseInt($("#location option:checked").val());
  let dep = parseInt($("#department option:checked").val());
  if (Number.isNaN(loc)) {
    $("#invalid-loc").text("* Invalid Location Selected!");
    return -1;
  }
  if (Number.isNaN(dep)) {
    $("#invalid-dept").text("* Invalid Department Selected!");
    return -1;
  }

  $("#modalContactForm").hide();

  let lname = $("#lname").val();
  // console.log(loc);
  let eid = $("#eid").val();
  let job = $("#job").val();
  xmlhttp_php("libs/php/insertEmployee.php?firstName=" + fname + "&lastName=" + lname + "&jobTitle=" + job + "&email=" + eid + "&deptId=" + dep, insertEmployeeData);

}

// create an employee
function insertEmployeeData(xhttp) {
  output = JSON.parse(xhttp.responseText);

  //alert code
  document.getElementById('alertMsg').innerHTML = output.status.description;
  $('#alert-modal').show();
  $('#alert-ok, #alert-close').click(function () {
    window.location.reload();
  });
  // close modal using escape
  $(document).keydown(e => {
    if (e.key === 'Escape') {
      $('#alert-modal').hide();
      window.location.reload();
    }
  });
}

function deleteEmployee(id) {

  xmlhttp_php("libs/php/deleteEmployeeByID.php?id=" + id, deleteEmployeeData);

}

// delete an employee
function deleteEmployeeData(xhttp) {
  output = JSON.parse(xhttp.responseText);

  //alert code
  document.getElementById('alertMsg').innerHTML = output.status.description;
  $('#alert-modal').show();
  $('#alert-ok, #alert-close').click(function () {
    window.location.reload();
  });
  // close modal using escape
  $(document).keydown(e => {
    if (e.key === 'Escape') {
      $('#alert-modal').hide();
      window.location.reload();
    }
  });

}

//update employee
function updateEmployee(id) {
  // deleteEmployee(id,"Update sucessful");
  let fname = $("#fname-edit").val();
  // console.log(fname);

  let lname = $("#lname-edit").val();
  let loc = parseInt($("#location-edit option:checked").val());
  let dep = parseInt($("#department-edit option:checked").val());
  if (Number.isNaN(loc)) {
    $("#invalid-location").text("* Invalid Location Selected!");
    return -1;
  }
  if (Number.isNaN(dep)) {
    $("#invalid-department").text("* Invalid Department Selected!");
    return -1;
  }
  $("#EditContactForm").hide();
  // console.log(loc);

  let eid = $("#eid-edit").val();
  let job = $("#job-edit").val();
  xmlhttp_php("libs/php/updateEmployee.php?firstName=" + fname + "&lastName=" + lname + "&jobTitle=" + job + "&email=" + eid + "&deptId=" + dep + "&id=" + id, updateEmployeeData);

}

function updateEmployeeData(xhttp) {
  output = JSON.parse(xhttp.responseText);

  //alert code
  document.getElementById('alertMsg').innerHTML = output.status.description;
  $('#alert-modal').show();
  $('#alert-ok, #alert-close').click(function () {
    window.location.reload();
  });
  // close modal using escape
  $(document).keydown(e => {
    if (e.key === 'Escape') {
      $('#alert-modal').hide();
      window.location.reload();
    }
  });
}

//set department dropdown based on location
function setDepartmentDropdown(locID) {
  options = "";
  for (i = 0; i < allDepartments.length; i++) {
    if (i == 0) {
      options += '<option value="" disabled selected>Choose Department</option>';
    }

    if (allDepartments[i].locationID == locID) {
      options += `<option value="${allDepartments[i].id}">${allDepartments[i].name}</option>`;
    }

  }
  return options;

}

//set location dropdown based on department
function setLocationDropdown(deptID) {

  options = "";
  for (i = 0; i < allDepartments.length; i++) {
    if (i == 0) {
      options += `<option value="" disabled>Choose Location</option>`;
    }
    if (allDepartments[i].id == deptID) {
      for (j = 0; j < allLocations.length; j++) {
        if (allDepartments[i].locationID == allLocations[j].id) {
          options += `<option value="${allLocations[j].id}" selected>${allLocations[j].name}</option>`;
        }
        else {
          options += `<option value="${allLocations[j].id}">${allLocations[j].name}</option>`;
        }
      }
    }

  }
  return options;

}


//search employees with user enterterd department and location
function searchEmployeesIdByDepartmentLocation(deptName, locName) {

  deptName = deptName.toLowerCase();
  locName = locName.toLowerCase();

  var searchedEmployeesButtonVisibilty = [];
  var nameTag;

  for (i = 0; i < allEmployees.length; i++) {
    nameTag = "buton-" + String(allEmployees[i].id);

    if (!(allEmployees[i].location.toLowerCase().localeCompare(locName)) && !(allEmployees[i].department.toLowerCase().localeCompare(deptName))) {
      searchedEmployeesButtonVisibilty.push({ button_id: nameTag, visibility: "show" });

    }
    else {
      searchedEmployeesButtonVisibilty.push({ button_id: nameTag, visibility: "hide" });

    }
  }
  return searchedEmployeesButtonVisibilty
}

//sorting buttons according to alphabetical order
function ascending() {

  var FirstName_with_index = [];

  for (var i in allEmployees) {
    FirstName_with_index.push([allEmployees[i].firstName.toLowerCase(), 'buton-' + String(allEmployees[i].id)]);
  }
  //appling sort
  FirstName_with_index.sort(function (left, right) {
    return left[0] < right[0] ? -1 : 1;
  });

  if (ascendingOrder == true) {
    for (i = 0; i < FirstName_with_index.length; i++) {
      $(`#${FirstName_with_index[i][1]}`).prependTo("#gallery");
    }
    ascendingOrder = false;
  }
  else {
    for (i = FirstName_with_index.length - 1; i >= 0; i--) {
      $(`#${FirstName_with_index[i][1]}`).prependTo("#gallery");
    }
    ascendingOrder = true;
  }

}

//generator departments

function departmentGenerator(departmentData) {
  // console.log(departmentData);


  //department edit modal
  const deptEditModal =
    `<div class="modal" id="EditDepartment" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Department</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
          <div class="modal-body">   
            <div class="md-form mb-0 mt-2 mr-5 ">       
              <i class="fas fa-building prefix grey-text d-block mt-4 "></i>              
              <label data-error="wrong" data-success="right" class="mb-5" for="dname">Department Name</label>
              <input type="text" id="dname" class="form-control-sm mt-3 validate">
              <div id="invalid-dname" class="invalid-department"></div>  
            </div>
            <div class="md-form mb-3 mt-0">
              <i class="fas fa-map-marker-alt prefix grey-text d-block "></i>
              <label data-error="wrong" data-success="right" for="location"></label>
              <select id="loc-In-Dept-edit" class="browser-default sel-drop custom-select  ml-3 mb-3 ">
              </select>
              <div id="invalid-loc-dname" class="invalid-location"></div>  
             </div>    
          </div>
        <div class="modal-footer">
          <button type="button" id="dptEditSave" class="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  </div>`;
  //end department edit modal

  const delete_dept_code = deleteModal('department');

  if ($(`#EditDepartment`).length == 0) {
    $('body').append(deptEditModal);
    $('body').append(delete_dept_code);
  }

  departmentData.forEach(user => {
    const id = user.id;
    const deptName = user.name;
    const locationId = user.locationID;
    const locName = user.location;

    //creating table rows

    const DeptRow = $(`<tr id="dept-row-${id}">
    <td class="p-2">${deptName}</td>
    <td class="p-2">${locName}</td>
    <td class="p-2"><button type="button" id=edit-${id} class="btn btn-primary button2" data-toggle="modal" data-target="#EditDepartment"><i class="fas fa-edit"></i>
      <button type="button" id="del-${id}" class="btn btn-primary button2" data-toggle="modal" data-target="#delete-modal-department"><i class="fas fa-trash-alt"></i></button>
    </td>    
    </tr>`)

    if ($(`#dept-row-${id}`).length == 0) {
      $('#depart-body').append(DeptRow);
    }
    else {
      $(`#dept-row-${id}`).find("td").eq(0)[0].innerHTML = deptName;
      $(`#dept-row-${id}`).find("td").eq(1)[0].innerHTML = locName;
    }

    $(`#edit-${id}`).click(() => {
      // console.log($( `.invalid-location`));


      // assign default value
      document.getElementById('dname').value = deptName;
      document.getElementById('loc-In-Dept-edit').innerHTML = getLocationDropdownWithSelectedId(locationId);


      $('#dptEditSave').click(() => {

        newDeptName = $('#dname').val();
        locID = parseInt($('#loc-In-Dept-edit').val());

        //validation to edit department
        if (newDeptName == "") {
          $("#invalid-dname").text("*Please Enter Department!");
          return -1;
        }
        if (Number.isNaN(locID)) {
          $("#invalid-loc-dname").text("* Invalid Location Selected!");
          return -1;
        }

        // change immediately department details with out using database updated information
        $(`#dept-row-${id}`).find("td").eq(0)[0].innerHTML = newDeptName;
        $(`#dept-row-${id}`).find("td").eq(1)[0].innerHTML = $("#loc-In-Dept-edit").find('option:selected').text();

        //hide edit modal
        $('#EditDepartment').modal('hide');

        //update details with php / sending values to php
        xmlhttp_php("libs/php/updateDepartmentByID.php?id=" + id + "&deptName=" + newDeptName + "&locID=" + locID, updateDepartmentData);
      })

    })

    //delete button
    $(`#del-${id}`).click(() => {
      document.getElementById('del-text-department').innerHTML = "Are you sure want to delete department " + "'" + deptName + "' ?";

      $('#del-yes-department').click(() => {
        // console.log(deptName);
        $(`#dept-row-${id}`).hide();
        xmlhttp_php("libs/php/deleteDepartmentByIDorName.php?id=" + id, updateDepartmentData);

      })
    })



  })
}

function updateDepartmentData(xhttp) {
  output = JSON.parse(xhttp.responseText);
  //alert code
  document.getElementById('alertMsg').innerHTML = output.status.description;
  $('#alert-modal').show();
  $('#alert-ok, #alert-close').click(function () {
    window.location = window.location.href + "#department-tab";
    window.location.reload();
  });
  // close modal using escape
  $(document).keydown(e => {
    if (e.key === 'Escape') {
      $('#alert-modal').hide();
      window.location = window.location.href + "#department-tab";
      window.location.reload();
    }
  });
}

// add department send functionality

$('#send-dept').click(function () {
  newDepartmentName = $('#dname-add').val();
  locID = parseInt($(`#loc-In-Dept-add`).val());
  // console.log(locID);

  //validation to add department
  if (newDepartmentName == "") {
    $("#invalid-dep-add").text("* Please Enter Department!");
    return -1;
  }
  if (Number.isNaN(locID)) {
    $("#invalid-loc-dept").text("* Invalid Location Selected!");
    return -1;
  }

  $('#modalDepartmentForm').hide();

  xmlhttp_php("libs/php/updateDepartmentByID.php?deptName=" + newDepartmentName + "&locID=" + locID, updateDepartmentData);


})

//pre loader
var preloader = document.getElementById('loading');
function myFunction() {
  setTimeout(function () { preloader.style.display = 'none'; }, 1000);
}


//BY defauly view
$(document).ready(function () {

  tabView = "";
  var n = window.location.href.indexOf("#");
  if (n > 0) {
    tabView = window.location.href.substring(n, window.location.href.length);
    window.history.replaceState({}, "Company Directory", window.location.href.substring(0, n));
    // console.log(n);
    // console.log(tabView);
  }

  if (tabView == "") {
    // console.log(tabView);
    if (EmployeesView == true) {
      $('#employee-tab').trigger("click");
    }
    else if (departmentView == true) {
      $('#department-tab').trigger("click");
    }
    else if (locationView == true) {
      $('#location-tab').trigger("click");
    }
  }
  else {
    // console.log(tabView);
    $(`${tabView}`).trigger("click");
  }

});



//displaying 3 different views

$('#employee-tab').click(function () {
  EmployeesView = true, departmentView = false, locationView = false;
  $('.mobile-search').show();
  $('.department-modal').hide();
  $('.location-modal').hide();
  $('.employee-modal').show();
  $('.navbar-collapse').collapse('hide');
  return false;

})
$('#department-tab').click(function () {
  EmployeesView = false, departmentView = true, locationView = false;
  $('.mobile-search').hide();
  $('.location-modal').hide();
  $('.employee-modal').hide();
  $('.department-modal').show();
  $('.navbar-collapse').collapse('hide');
  return false;

})
$('#location-tab').click(function () {
  EmployeesView = false, departmentView = false, locationView = true;
  $('.mobile-search').hide();
  $('.department-modal').hide();
  $('.employee-modal').hide();
  $('.location-modal').show();
  $('.navbar-collapse').collapse('hide');
  return false;


})


//generator locations

function locationGenerator(locationData) {
  // console.log(locationData);


  //department edit modal
  const locEditModal =
    `<div class="modal" id="EditLocation" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Edit Location</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
          <div class="modal-body">   
            <div class="md-form mb-0 mt-2 mr-5 ">       
              <i class="fas fa-map-marker-alt prefix grey-text d-block mt-4 "></i>              
              <label data-error="wrong" data-success="right" class="mb-5" for="locname">Location Name</label>
              <input type="text" id="locname-edit" class="form-control-sm mt-3 validate">
              <div id="invalid-loc-locname" class="invalid-location"></div>
            </div>
          </div>
        <div class="modal-footer">
          <button type="button" id="locEditSave" class="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  </div>`;

  $('body').append(locEditModal);
  // document.getElementById('del-text').innerHTML="Are you sure want to delete Location?";


  //end location edit modal

  //delete location modal
  const delete_loc_code = deleteModal('location');
  $('body').append(delete_loc_code);

  locationData.forEach(user => {
    const id = user.id;
    const locName = user.name;

    //creating table rows

    const locRow = $(`<tr id="loc-row-${id}">    
    <td class="p-2">${locName}</td>
    <td class="p-2"><button type="button" id=edit-loc-${id} class="btn btn-primary button2" data-toggle="modal" data-target="#EditLocation"><i class="fas fa-edit"></i>
      <button type="button" id="del-loc-${id}" class="btn btn-primary button2" data-toggle="modal" data-target="#delete-modal-location"><i class="fas fa-trash-alt"></i></button>
    </td>    
    </tr>`)

    $('#loc-body').append(locRow);


    $(`#edit-loc-${id}`).click(() => {

      document.getElementById('locname-edit').value = locName;

      $('#locEditSave').click(() => {

        newLocName = $('#locname-edit').val();

        //validation to edit location
        if (newLocName == "") {
          $("#invalid-loc-locname").text("* Please Enter Location!");
          return -1;
        }

        $('#EditLocation').hide();

        xmlhttp_php("libs/php/updateLocationByID.php?id=" + id + "&locName=" + newLocName, updateLocationData);
      })

    })

    //delete button
    $(`#del-loc-${id}`).click(() => {
      document.getElementById('del-text-location').innerHTML = "Are you sure want to delete location " + "'" + locName + "' ?";

      $("#del-yes-location").click(() => {
        // delete location from location table with locID
        xmlhttp_php("libs/php/deleteLocationByIDorName.php?id=" + id, updateLocationData);

      })
    })

  })
}

function updateLocationData(xhttp) {
  output = JSON.parse(xhttp.responseText);
  //alert code
  document.getElementById('alertMsg').innerHTML = output.status.description;
  $('#alert-modal').show();
  $('#alert-ok, #alert-close').click(function () {
    window.location = window.location.href + "#location-tab";
    window.location.reload();
  });
  // close modal using escape
  $(document).keydown(e => {
    if (e.key === 'Escape') {
      $('#alert-modal').hide();
      window.location = window.location.href + "#location-tab";
      window.location.reload();
      window.location.reload();
      window.location.reload();
    }
  });
}

// add department send functionality
$('#send-loc').click(function () {
  newLocationName = $('#lname-add').val();

  //validation to add location
  if (newLocationName == "") {
    $("#invalid-loc-loc").text("* Please Enter Location!");
    return -1;
  }

  $('#modalLocationForm').hide();

  xmlhttp_php("libs/php/updateLocationByID.php?locName=" + newLocationName, updateLocationData);


})

//get default value for location dropdown in edit form
function getLocationDropdownWithSelectedId(loc) {
  options = "";
  for (i = 0; i < allLocations.length; i++) {
    if (i == 0) {
      options += '<option value="" >Choose Location</option>';
    }
    if ((allLocations[i].id == loc) || (allLocations[i].name == loc)) {
      options += `<option value="${allLocations[i].id}" selected>${allLocations[i].name}</option>`;

    }
    else {
      options += `<option value="${allLocations[i].id}">${allLocations[i].name}</option>`;
    }
  }

  return options;
}


//get default value for location dropdown in edit form
function getDepartmentDropdownWithSelectedId(dep) {
  options = "";
  for (i = 0; i < allDepartments.length; i++) {
    if (i == 0) {
      options += '<option value="" >Choose Location</option>';
    }
    if ((allDepartments[i].id == dep) || (allDepartments[i].name == dep)) {
      options += `<option value="${allDepartments[i].id}" selected>${allDepartments[i].name}</option>`;

    }
    else {
      options += `<option value="${allDepartments[i].id}">${allDepartments[i].name}</option>`;
    }
  }

  return options;
}

function deleteModal(name) {
  var delModal = `<div class="modal card-dm fade" id="delete-modal-${name}" tabindex="-1" role="dialog">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Delete</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body" id="del-text-${name}">
        <p>Are you sure want to Delete ?</p>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" id="del-yes-${name}" data-dismiss="modal">Yes</button>
        <button type="button" class="btn btn-secondary" id="del-no-${name}" data-dismiss="modal">No</button>
      </div>
    </div>
  </div>
</div>`
  return delModal;
}



//------------------------------------------//

