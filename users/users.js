import {
  onAuthStateChanged,
  auth,
  query,
  collection,
  db,
  getDocs,
  where
} from '../firbaseConfig.js'

const allUsersArea = document.querySelector('.allUsersArea')
console.log(allUsersArea);

let logUserEmail;

onAuthStateChanged(auth, (user) => {
  if (user) {
    
    logUserEmail = user.email
    // console.log(logUserEmail)
    showAllUsers(user.email)
    
  } else {

    // User is signed out
    window.location.href = '../login/login.html'
  }
});



async function showAllUsers(email) {
  // console.log(logUserEmail);
  const q = query(collection(db, "users"), where("userEmail", "!=", email));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {

    console.log(doc.id, " => ", doc.data());
    const { userFirstName, userSurName, userName, userEmail, userDescription, userContactNumber, profilePic } = doc.data()


    const userBox = document.createElement('div')
    userBox.setAttribute('class', 'col-3 mx-4 mb-3')
    userBox.setAttribute('style', 'width: 29%;')

    console.log(userBox);

    const content = `
    <div class="userBox border border-info border-2 rounded-3">
    <div class="card-body">
        <div>
            <img src=${profilePic || "../Assets/dummy-image.jpg"} alt="" id="myUserProfilePic" class="d-flex justify-content-center mb-3">
            <h4 class="card-title mb-3">${userFirstName} ${userSurName}</h4>
            <h5 class="card-subtitle text-secondary mb-3">${userName}</h5>
            <h6 class="card-text text-secondary mb-3">${userEmail}</h6>
            <p class="card-text text-secondary mb-5" style="font-size: 12px;"><b>${userDescription || "No Description Added Yet"}</b></p>
        </div>
        <div>
            <a href="#" class="button me-2">Show Posts</a>
            <a href="../dashboard/dashboard.html" class="button">Go Back</a>
        </div>
    </div>
</div>`

    userBox.innerHTML = content

    allUsersArea.appendChild(userBox)
  });
}





