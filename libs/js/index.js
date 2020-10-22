
// Global variables
var  allDepartments, allLocations, allEmployees, searchedEmployeesID=[];

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
    allDepartments=departmentsData.data

    for (i = 0; i < allDepartments.data.length; i++) {
        if (i == 0) {
          options += '<option value="" disabled selected>Choose Department</option>';
        }
        options += `<option value="${i}">${ allDepartments.data[i].name}</option>`;
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

    for (i = 0; i < allLocations.data.length; i++) {
        if (i == 0) {
          options += '<option value="" disabled selected>Choose Location</option>';
        }
        options += `<option value="${i}">${ allLocations.data[i].name}</option>`;
      }
    }

    //employee data
    function getAllEmployees(xhttp) {
        employeesData = JSON.parse(xhttp.responseText);
        //allEmployee array
        allEmployees = employeesData.data;
    
        for (i = 0; i < allLocations.data.length; i++) {
            if (i == 0) {
              options += '<option value="" disabled selected>Choose Location</option>';
            }
            options += `<option value="${i}">${ allLocations.data[i].name}</option>`;
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
