// LOGIN / SIGNUP
function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const userType = document.getElementById("userType").value;

  if(!email || !password || !userType) { alert("Fill all fields"); return; }

  auth.createUserWithEmailAndPassword(email, password)
    .then(cred => db.collection("users").doc(cred.user.uid).set({
      email: email,
      userType: userType
    }))
    .then(() => redirectUser(userType))
    .catch(err => alert(err.message));
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(cred => db.collection("users").doc(cred.user.uid).get())
    .then(doc => redirectUser(doc.data().userType))
    .catch(err => alert(err.message));
}

function redirectUser(userType) {
  if(userType === "homeowner") window.location.href = "home.html";
  else if(userType === "contractor") window.location.href = "contractor.html";
}

// LOGOUT
function logout() {
  auth.signOut().then(() => window.location.href = "index.html");
}

// PROJECT CREATION
function createProject() {
  const name = document.getElementById("projectName").value;
  const location = document.getElementById("location").value;
  const budget = document.getElementById("budget").value;

  if(!name || !location || !budget) { alert("Fill all fields"); return; }

  db.collection("projects").add({
    name: name,
    location: location,
    budget: parseFloat(budget),
    createdAt: new Date()
  }).then(() => alert("Project Created!"))
    .catch(err => alert(err.message));
}

// BROWSE CONTRACTORS
function loadContractors() {
  const listDiv = document.getElementById("contractorList");
  if(!listDiv) return;

  db.collection("users").where("userType","==","contractor").get()
    .then(snapshot => {
      listDiv.innerHTML = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        const div = document.createElement("div");
        div.innerHTML = `${data.email} <button onclick="hireContractor('${doc.id}')">Hire</button>`;
        listDiv.appendChild(div);
      });
    });
}

function hireContractor(contractorId) { alert("Contractor hired: " + contractorId); }

// LOAD PROJECTS FOR CONTRACTOR
function loadProjects() {
  const listDiv = document.getElementById("projectList");
  if(!listDiv) return;

  db.collection("projects").get()
    .then(snapshot => {
      listDiv.innerHTML = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        const div = document.createElement("div");
        div.innerHTML = `${data.name} - ${data.location} - $${data.budget}`;
        listDiv.appendChild(div);
      });
    });
}

// CALL THESE FUNCTIONS ON PAGE LOAD
window.onload = function() {
  loadContractors();
  loadProjects();
}
