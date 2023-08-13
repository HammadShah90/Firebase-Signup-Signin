import { auth, createUserWithEmailAndPassword, setDoc, doc, db, } from "../firbaseConfig.js";


// ---------Signup Create Variables----------

const userFirstName = document.querySelector("#firstName");
// console.log(userFirstName);
const userSurName = document.querySelector("#lastName");
// console.log(userSurName);
const userSignUpName = document.querySelector("#userName");
// console.log(userSignUpName);
const userSignUpMob = document.querySelector("#contactNumber");
// console.log(userSignUpMob);
const userSignUpEmail = document.querySelector("#email");
// console.log(userSignUpEmail);
const userSignUpPassword = document.querySelector("#password");
// console.log(userSignUpPassword);
const userSignUpBtn = document.querySelector(".signUpBtn");
// console.log(userSignUpBtn);
const signupShowPassword = document.querySelector("#showPassword")
// console.log(signupShowPassword);



// ---------ourUsers Local Storage----------

// const ourUsers = JSON.parse(localStorage.getItem('users')) || [];

// console.log(ourUsers);



// ---------Signup Function----------



async function signUpHandler() {
  if (userFirstName.value == "" || userSurName.value == "" || userSignUpName.value == "" || userSignUpEmail.value == "" || userSignUpPassword == "") {
    Swal.fire({
      icon: 'error',
      title: 'Shabash Bacha Saari Fields fill karo'
    })
  } else {
    try {
      const response = await
        createUserWithEmailAndPassword(auth, userSignUpEmail.value, userSignUpPassword.value)
  
      // console.log(response, "===>>> Response SignUP Await");
  
      const user = response.user
  
      console.log(user, "===>>> Response User Data");
  
      if (user) {
        addUserHandler(user.uid)
      }
  
      let timerInterval
      Swal.fire({
        title: '<b>Signup Successfully Done</b>',
        html: 'Please wait <b></b> milliseconds',
        timer: 3000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading()
          const b = Swal.getHtmlContainer().querySelector('b')
          timerInterval = setInterval(() => {
            b.textContent = Swal.getTimerLeft()
          }, 50)
        },
        willClose: () => {
          clearInterval(timerInterval)
        }
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
          console.log('I was closed by the timer')
        }
      })
  
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // console.log(error);
      console.log(errorCode);
      console.log(errorMessage);
  
  
      if (errorCode) {
        if (errorCode == "auth/missing-email") {
          Swal.fire({
            icon: 'error',
            title: 'Shabash Bacha Email to likho'
          })
        } else if (errorCode == "auth/missing-password") {
          Swal.fire({
            icon: 'error',
            title: 'Shabash Bacha password to likho'
          })
        } else if (errorCode == "auth/email-already-in-use") {
          Swal.fire({
            icon: 'error',
            title: 'Shabash Bacha email dusra likho ye already use hai'
          })
        } else if (!userFirstName && !userSurName){
          Swal.fire({
            icon: 'error',
            title: 'Shabash Bacha apna firstName or lastName bhi likho'
          })
        } else {
          return Swal.fire({
            icon: 'error',
            title: 'Shabash Bacha Email or password sahi likho'
          })
        }
      }
    }
  }
}


async function addUserHandler(userUid) {
  try {
    const users = await setDoc(doc(db, "users", userUid), {
      userFirstName: userFirstName.value,
      userSurName: userSurName.value,
      userName: userSignUpName.value,
      userContactNumber: userSignUpMob.value,
      userEmail: userSignUpEmail.value,
      userID: userUid
    })

    window.location.href = `../index.html`

  } catch (error) {
    // console.error("Error adding document: ", error);
    Swal.fire({
      icon: 'error',
      title: 'Shabash Bacha sari feilds fill karo'
    })
  }
}


// ---------Show Password Function----------

function showPassword() {

  if (userSignUpPassword.type === "password") {
    userSignUpPassword.type = "text"

  } else {
    userSignUpPassword.type = "password"

  }

}


// ---------Signup addEventListener----------

userSignUpBtn.addEventListener('click', signUpHandler);
signupShowPassword.addEventListener('click', showPassword);
