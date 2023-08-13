import {
  auth,
  onAuthStateChanged,
  getDoc,
  doc,
  db,
  signOut,
  addDoc,
  collection,
  orderBy,
  getDocs,
  query,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  setDoc,
  where,
  updateDoc,
} from "../firbaseConfig.js";

// const isLoggedInUser = JSON.parse(localStorage.getItem("isLoggedInUser"))

// if (!isLoggedInUser) {
//     window.location.href = "../index.html";
// }

// const userPosts = JSON.parse(localStorage.getItem('posts')) || []

const userFullName = document.querySelector("#userFullName");
const userProfileName = document.querySelector("#userProfileName");
const currentUserDescription = document.querySelector(
  "#currentUserDescription"
);
const userEmailAddress = document.querySelector("#userEmailAddress");
const userContactNum = document.querySelector("#userContactNum");
const logOutbutton = document.querySelector("#logOut");
const postInputField = document.querySelector("#postInputField");
const postBtn = document.querySelector("#postBtn");
const postArea = document.querySelector(".postArea");
const editFirstName = document.querySelector("#editFirstName");
const editSurName = document.querySelector("#editSurName");
const editUserName = document.querySelector("#editUserName");
const editUserEmail = document.querySelector("#editUserEmail");
const editUserMob = document.querySelector("#editUserMob");
const editUserDescription = document.querySelector("#editUserDescription");
const profilePic = document.querySelector("#profilePic");
const updateBtn = document.querySelector("#updateBtn");
const userDashboardDp = document.querySelector("#userDashboardDp");
const navProfilePic = document.querySelector("#navProfilePic");
const postProfilePic = document.querySelector("#postProfilePic");
const showPostProfilePic = document.querySelector("#showPostProfilePic");
const showPostUserFullname = document.querySelector("#showPostUserFullname");
const postImagefile = document.querySelector("#postImagefile");
const updatePostImagefile = document.querySelector("#updatePostImagefile");
const updatePostInputField = document.querySelector("#updatePostInputField");
const updatePostBtn = document.querySelector("#updatePostBtn");

// console.log(userFullName);

postBtn.disabled = true;

let currentLoginUserId;
let postIdGlobal;

// let currentLoginUser;

showPosts();

onAuthStateChanged(auth, (user) => {
  if (user) {
    // console.log(user.email);
    const uid = user.uid;
    // console.log(uid);
    getUserData(uid);
    getUserDataToEditProfile(uid);
    currentLoginUserId = uid;
    showAllUsers(user.email);
    // console.log(currentLoginUserId);
  } else {
    window.location.href = `../index.html`;
  }
});

async function getUserData(userUid) {
  try {
    const docRef = doc(db, "users", userUid);
    const docSnap = await getDoc(docRef);
    // console.log(docSnap);

    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      const {
        userEmail,
        userFirstName,
        userContactNumber,
        userName,
        userSurName,
        profilePic,
        userDescription,
      } = docSnap.data();
      // console.log(userEmail);

      userFullName.textContent = `${userFirstName} ${userSurName}`;
      showPostUserFullname.textContent = `${userFirstName} ${userSurName}`;
      userProfileName.textContent = userName;
      userEmailAddress.textContent = userEmail;
      userContactNum.textContent = userContactNumber;
      currentUserDescription.textContent =
        userDescription || "No Description Added";
      userDashboardDp.src = profilePic || "../Assets/dummy-image.jpg";
      navProfilePic.src = profilePic || "../Assets/dummy-image.jpg";
      postProfilePic.src = profilePic || "../Assets/dummy-image.jpg";
      showPostProfilePic.src = profilePic || "../Assets/dummy-image.jpg";

      // showPosts(docSnap.data())
      // console.log(currentLoginUser);
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.log(error);
  }
}

const getUserDataToEditProfile = async (userUid) => {
  try {
    const docRef = doc(db, "users", userUid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const {
        userFirstName: userFirstNameFromDb,
        userSurName: userSurNameFromDb,
        userName: userNameFromDb,
        userEmail: userEmailFromDb,
        userContactNumber: userContactNumberFromDb,
      } = docSnap.data();

      editFirstName.value = userFirstNameFromDb;
      editSurName.value = userSurNameFromDb;
      editUserName.value = userNameFromDb;
      editUserEmail.value = userEmailFromDb;
      editUserMob.value = userContactNumberFromDb;
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.log(error);
  }
};

const logoutHandler = async () => {
  try {
    const response = await signOut(auth);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

const enablePostBtn = () => {
  if (postInputField.value === "") {
    postBtn.disabled = true; //button remains disabled
  } else {
    postBtn.disabled = false; //button is enabled
  }
};

const postHandler = async () => {
  // console.log(postInputField.value);

  // var currentDate = new Date();

  const file = postImagefile.files[0];

  // console.log(file);

  // Create the file metadata
  /** @type {any} */
  const metadata = {
    contentType: "image/jpeg"
  };

  // Upload file and metadata to the object 'images/mountains.jpg'
  const storageRef = ref(storage, "postImages/" + file.name);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;
        case "storage/canceled":
          // User canceled the upload
          break;

        // ...

        case "storage/unknown":
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        console.log("File available at", downloadURL);

        try {
          const docRef = await addDoc(collection(db, "myPosts"), {
            postContent: postInputField.value,
            postCreatorId: currentLoginUserId,
            currentTime: serverTimestamp(),
            postImageUrl: downloadURL,
          });

          // console.log(docRef.id);

          showPosts();
          postInputField.value = "";
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      });
    }
  );
};

const updatePostHandler = () => {
  // console.log("update button working properly");

  // console.log(updatePostInputField.value);

  // var currentDate = new Date();

  const file = updatePostImagefile.files[0];

  // console.log(file);

  // Create the file metadata
  /** @type {any} */
  const metadata = {
    contentType: "image/jpeg",
  };

  // Upload file and metadata to the object 'images/mountains.jpg'
  const storageRef = ref(storage, "postImages/" + file.name);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("Upload is " + progress + "% done");
      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;
        case "storage/canceled":
          // User canceled the upload
          break;

        // ...

        case "storage/unknown":
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        console.log("File available at", downloadURL);

        try {
          const updateDocRef = doc(db, "myPosts", postIdGlobal);
          const response = await updateDoc(updateDocRef, {
            postContent: updatePostInputField.value,
            postImageUrl: downloadURL
          });

          // console.log(docRef.id);

          showPosts();
          updatePostInputField.value = "";
        } catch (e) {
          console.error("Error adding document: ", e);
        }
      });
    }
  );
};

async function showPosts() {
  postArea.innerHTML = "";

  const q = query(collection(db, "myPosts"), orderBy("currentTime", "desc"));

  const querySnapshot = await getDocs(q);

  querySnapshot.forEach(async (doc) => {
    // console.log(doc);
    const postId = doc.id;

    const { postContent, postCreatorId, currentTime, postImageUrl } =
      doc.data();
    // console.log(postContent);
    // console.log(postCreatorId);
    // console.log(currentTime);

    const autherDetails = await getAutherData(postCreatorId);

    const postElement = document.createElement("div");
    postElement.setAttribute("class", "border p-3 mt-2 mb-2");
    postElement.setAttribute("style", "border-radius: 10px;");
    postElement.setAttribute("id", doc.id);
    const contentOfPost = `
    <div class="d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center">
                                <img src=${
                                  autherDetails.profilePic ||
                                  "../Assets/dummy-image.jpg"
                                } alt="" class="rounded-circle me-3"
                                    style="width: 50px; height: 50px;">
                                <div>
                                    <div class="d-flex align-items-center">
                                        <h6 class="bottomMargin me-1" style="font-size: 14px;">${
                                          autherDetails.userFirstName
                                        } ${autherDetails.userSurName}</h6>
                                        <p class="bottomMargin me-1 mb-1 fw-bold">.</p>
                                        <p class="bottomMargin">1st</p>
                                    </div>
                                    <div class="d-flex">
                                        <p class="bottomMargin" style="font-size: 11px;">
                                          ${
                                            autherDetails.userDescription ||
                                            "No Description Added"
                                          }
                                        </p>
                                    </div>
                                    <div class="d-flex align-items-center">
                                        <p class="bottomMargin me-1" style="font-size: 11px;">${moment(
                                          currentTime.toDate()
                                        ).fromNow()}</p>
                                        <p class="bottomMargin me-1 mb-1 fw-bold" style="font-size: 11px;">.</p>
                                        <i class="fa-solid fa-earth-asia align-self-center"
                                            style="font-size: 11px;"></i>
                                    </div>
                                </div>
                            </div>
                            ${
                              postCreatorId === currentLoginUserId
                                ? `<div class="align-self-start dropstart">
                            <a class="nav-link p-0 mt-1" href="#" id="navbarDropdown"
                                role="button" data-bs-toggle="dropdown" aria-expanded="false" style="color: #000000;">
                                <i class="fa-solid fa-ellipsis-vertical fs-5"></i>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                <li>
                                    <a class="dropdown-item" href="#" onclick="editPost('${postId}')" data-bs-toggle="modal" data-bs-target="#editModal">
                                        <i class="fa-solid fa-pen-to-square"></i>
                                        Edit Post
                                    </a>
                                </li>
                                <li>
                                    <a class="dropdown-item" href="#" onclick="deletePost('${postId}')">
                                        <i class="fa-solid fa-trash-can"></i>
                                        Delete Post
                                    </a>
                                </li>
                            </ul>
                        </div>`
                                : ""
                            }
                        </div>
                        <div class="mt-2">
                            <p class="bottomMargin">
                                ${postContent}
                            </p>
                        </div>
                        <div class="mt-3 p-0">
                            <img src=${
                              postImageUrl || "../Assets/sunset.jpg"
                            } alt="" class="sizeImg" />
                        </div>`;

    postElement.innerHTML = contentOfPost;
    // console.log(postElement);
    postArea.appendChild(postElement);
  });
}

async function getAutherData(authorUid) {
  // console.log(authorUid, "==>>authorUid")

  const docRef = doc(db, "users", authorUid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document!");
  }
}

const editPost = (uId) => {
  console.log(uId);
  postIdGlobal = uId;
};

const deletePost = async (uId) => {
  console.log(uId);
  try {
    if (uId) {
      await deleteDoc(doc(db, "myPosts", uId));
      console.log("Deleted Successfully");
      const dPost = document.getElementById(uId);
      dPost.remove();
    } else {
      console.log("you are not able to delete this post");
    }
  } catch (error) {
    console.log(error);
  }
};

const updateProfileHandler = () => {
  console.log(
    editFirstName.value,
    editSurName.value,
    editUserName.value,
    editUserEmail.value,
    editUserMob.value,
    profilePic.files[0],
    "update button working properly"
  );

  const file = profilePic.files[0];
  // console.log(file.name);

  // Create the file metadata
  // @type {any}
  const metadata = {
    contentType: "image/jpeg",
  };

  // Upload file and metadata to the object 'images/mountains.jpg'
  if (profilePic.files) {
    const storageRef = ref(storage, "userProfilePics/" + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          // console.log("File available at", downloadURL);
          try {
            await setDoc(doc(db, "users", currentLoginUserId), {
              userFirstName: editFirstName.value,
              userSurName: editSurName.value,
              userName: editUserName.value,
              userEmail: editUserEmail.value,
              userContactNumber: editUserMob.value,
              userDescription: editUserDescription.value,
              profilePic: downloadURL,
              userId: currentLoginUserId,
            });
          } catch (error) {
            console.log(error);
          }
        });
      }
    );
  }

  // setTimeout(() => {
  //   window.location.reload()
  // }, 9000)
};

async function showAllUsers(email) {
  // console.log(email);

  const q = query(collection(db, "users"), where("userEmail", "!=", email));
  const allUsersArea = document.querySelector(".allUsersArea");

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // console.log(doc);
    const {
      userFirstName,
      userSurName,
      userName,
      userEmail,
      userDescription,
      userContactNumber,
      profilePic,
    } = doc.data();

    allUsersArea.innerHTML += `
    <div class="d-flex align-items-center mt-3">
      <img
        src=${profilePic || "../Assets/dummy-image.jpg"}
        alt="userProfilePicture"
        class="rounded-circle me-3"
        style="width: 50px; height: 50px"
      />
      <div>
        <div class="d-flex align-items-center">
          <h6 class="bottomMargin me-1" style="font-size: 14px">
          ${userFirstName} ${userSurName}
          </h6>
        </div>
        <div class="d-flex">
          <p class="bottomMargin" style="font-size: 11px">
          ${userDescription || "No Description Added Yet"}
          </p>
        </div>
      </div>
    </div>
    <div class="ms-5 mt-2">
      <button type="button" class="btn rounded-pill px-3 border" onclick="followHandler('${doc.id}', '${userFirstName}', '${userSurName}', '${userName}', '${userEmail}', '${userDescription}', '${userContactNumber}', '${profilePic}')">
        <i class="fa-solid fa-plus"></i>
        Follow
      </button>
    </div>`;
  });
}

const followHandler = async (
  followingId,
  followingFName,
  followingSName,
  followingUName,
  followingEmail,
  followingDescription,
  followingCNum,
  followingPp
) => {

  console.log(
    followingId,
    followingFName,
    followingSName,
    followingUName,
    followingEmail,
    followingDescription,
    followingCNum,
    followingPp,
    "==>> Follow Handler Working"
  );

  // const iFollowing = 
};

logOutbutton.addEventListener("click", logoutHandler);
postBtn.addEventListener("click", postHandler);
postInputField.addEventListener("keyup", enablePostBtn);
updateBtn.addEventListener("click", updateProfileHandler);
updatePostBtn.addEventListener("click", updatePostHandler);

window.editPost = editPost;
window.deletePost = deletePost;
window.followHandler = followHandler;
