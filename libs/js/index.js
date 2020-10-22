
// Global variables
var  allDepartments, allLocations, allEmployees, searchedEmployeesID=[];

//------------------------------------------//
//-------------- Main code -----------------//
//------------------------------------------//

xmlhttp_php("libs/php/getAll.php", getAllEmployees);
xmlhttp_php("libs/php/getAllDepartments.php", getAllDepartments);
xmlhttp_php("libs/php/getAllLocations.php", getAllLocations);
generator(allEmployees);
//------------------------------------------//




//------------------------------------------//
//-------------- Functions -----------------//
//------------------------------------------//

// Callback function for the GET request to handle the user data
function generator(employeesData) {
  employeesData.forEach(user => {
      const firstName = user.firstName;
      const lastName = user.lastName;
      const nameTag = `${firstName}-${lastName}`;
      const fullName = `${firstName} ${lastName}`;
      const email = user.email;
      const location = user.location;
      const jobTitle = user.jobTitle;
      const department = user.department;

      const card = createCard(nameTag, fullName, email, location, department, jobTitle);

      card.click(() => {
          createModal(nameTag, fullName, email, location, department, jobTitle);
      });
  })
}

//Creates the user's card from the supplied data and attaches it to the DOM
function createCard(nameTag, fullName, email, location, department, jobTitle) {
  const cardDiv = $(`<div id="${nameTag}-card" class="card"></div>`);
  const infoContainer = $('<div class="card-info-container"></div>');
  const h3 = $(`<h3 id="${nameTag}" class="card-name cap">${fullName}</h3>`);
  const emailP = $(`<p class="card-text">${email}</p>`);
  const locationP = $(`<p class="card-text loc">${location}</p>`);
  const departmentP = $(`<p class="card-text dep">${department}</p>`);
  const jobTitleP = $(`<p class="card-text job">${jobTitle}</p>`);



  $('#gallery').append(cardDiv);
  cardDiv.append(infoContainer);  
  infoContainer.append(h3).append(emailP).append(departmentP).append(locationP).append(jobTitleP);

  return cardDiv;
}

// Creates the modal window and appends it to the DOM
function createModal(nameTag, fullName, email, location, department, jobTitle) {
  const container = $('<div class="modal-container"></div>');
  const modal = $('<div class="modal"></div>');
  const x = $('<button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>');
  const dataContainer = $('<div class="modal-info-container"></div>');
  const h3 = $(`<h3 id="${nameTag}-modal" class="modal-name cap">Name:${fullName}</h3>`);
  const emailP = $(`<p class="modal-text">Email:${email}</p>`);
  const departmentP = $(`<p class="modal-text dep">Deparment:${department}</p>`);
  const locationP = $(`<p class="modal-text loc">Location:${location}</p>`);  
  // const hr = $('<hr>');
  const jobTitleP = $(`<p class="modal-text">JobTitle: ${jobTitle}</p>`);
  const navContainer = $('<div class="modal-btn-container"></div>');
  const prevButton = $('<button type="button" id="modal-prev" class="modal-prev btn">Prev</button>');
  const nextButton = $('<button type="button" id="modal-next" class="modal-next btn">Next</button>');
  
  $('body').append(container);
  container.append(modal);
  modal.append(x).append(dataContainer).append(navContainer);
  dataContainer
      .append(h3).append(emailP).append(departmentP)
      .append(jobTitleP).append(locationP).append(jobTitleP);
  navContainer.append(prevButton).append(nextButton);

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
      prevUser.click();
  })

  // next user
  const nextUser = $(`#${nameTag}-card`).next();
  if (nextUser.length === 0) {
      disableButton(nextButton);
  }
  nextButton.click(() => {
      container.hide();
      nextUser.click();
  })

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
  // document.getElementById("IntroCountry").innerHTML = countryIntro.data.introduction;
  // document.getElementById("gdp").innerHTML = "$" + (countryIntro.data.gdp.value).toString() + " billion (in 2017)";
  // document.getElementById("economy").innerHTML = countryIntro.data.economy;

  // // console.log(countryIntro.data);

  // document.getElementById("languages").innerHTML = countryIntro.data.people.languages;
  // document.getElementById("religions").innerHTML = countryIntro.data.people.religions;
  // document.getElementById("ethnic-groups").innerHTML = countryIntro.data.people.ethnic_groups;
  // document.getElementById("death-rate").innerHTML = countryIntro.data.people.death_rate;
  // document.getElementById("birth-rate").innerHTML = countryIntro.data.people.birth_rate;
  // document.getElementById("unemployment").innerHTML = countryIntro.data.people.unemployment_rate;
  // document.getElementById("sex-ratio").innerHTML = countryIntro.data.people.sex_ratio;
  
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
}

//employee data
function getAllEmployees(xhttp) {
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
}

//search employees with user enterterd name 
function getSearchedEmployeesIdByName(uname){
    for(i=0;i<allEmployees.length;i++){
        
        if ((!(allEmployees[i].firstName.localeCompare(uname))) || (!(allEmployees[i].lastName.localeCompare(uname)))) {
            searchedEmployeesID.push(i+1);
            
    }
    }
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
    for(i=0;i<allEmployees.length;i++){
        
        if (!(allEmployees[i].location.localeCompare(ulocation))) {
            searchedEmployeesID.push(i+1);
            
    }
}
} 

//------------------------------------------//
