import {
  auth,
  onAuthStateChanged,
  doc,
  getDoc,
  db,
  query,
  collection,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  signOut,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "../firbaseConfig.js";

const profileUserFullname = document.querySelector("#profileUserFullname");
const profileUserName = document.querySelector("#profileUserName");
const profileUserDescription = document.querySelector(
  "#profileUserDescription"
);
const profileUserPic = document.querySelector("#profileUserPic");
const postArea = document.querySelector(".postArea");
const logOutbutton = document.querySelector("#logOut");
const navProfilePic = document.querySelector("#navProfilePic");
const followersCount = document.querySelector(".followersCount");
const followingCount = document.querySelector(".followingCount");

// console.log(followersCount);
// console.log(followingCount);
// console.log(profileUserDescription);
// console.log(profileUserPic);

let currentLoginUserId;
let myFollowings;

// ===========>>>>>>>> Get User data <<<<<<<<=========

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    // console.log(uid);
    //   getUserData(uid)
    //   getUserDataToEditProfile(uid)
    getUserData(uid);
    getUserDataToEditProfile(uid);
    showPosts(uid);
    showAllUsers(user.email);
    currentLoginUserId = uid;
  } else {
    window.location.href = `../dashboard/dashboard.html`;
  }
});

// ===========>>>>>>>> Show User Data <<<<<<<<=========

async function getUserData(userUid) {
  try {
    const docRef = doc(db, "users", userUid);
    const docSnap = await getDoc(docRef);

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
        followers,
        following,
      } = docSnap.data();
      // console.log(userEmail);

      profileUserFullname.textContent = `${userFirstName} ${userSurName}`;
      profileUserName.textContent = userName;
      profileUserDescription.textContent =
        userDescription || "No Description Added";
      profileUserPic.src = profilePic || "../Assets/dummy-image.jpg";
      navProfilePic.src = profilePic || "../Assets/dummy-image.jpg";

      if (!following) {
        const followingRef = doc(db, "users", currentLoginUserId);
        await updateDoc(followingRef, {
          following: arrayUnion(`.`),
        });
      } else {
        myFollowings = [...following];
        const usersFollowingMe = following.length - 1;
        followingCount.textContent = usersFollowingMe || "0";
        followersCount.textContent = followers.length || "0";
      }

      // showPosts(docSnap.data())
      // console.log(currentLoginUser);
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.log(error);
  }
}

// ===========>>>>>>>> Edit User Data <<<<<<<<=========

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

// ===========>>>>>>>> Get Current user Details <<<<<<<<=========

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

// ===========>>>>>>>> Show Current User Posts <<<<<<<<=========

async function showPosts(uid) {
  // console.log(uid);
  try {
    postArea.innerHTML = "";

    const q = query(
      collection(db, "myPosts"),
      where("postCreatorId", "==", uid),
      orderBy("currentTime")
    );

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
                                  <img src=${autherDetails.profilePic ||
        "../Assets/dummy-image.jpg"
        } alt="" class="rounded-circle me-3"
                                      style="width: 50px; height: 50px;">
                                  <div>
                                      <div class="d-flex align-items-center">
                                          <h6 class="bottomMargin me-1" style="font-size: 14px;">${autherDetails.userFirstName
        } ${autherDetails.userSurName}</h6>
                                          <p class="bottomMargin me-1 mb-1 fw-bold">.</p>
                                          <p class="bottomMargin">1st</p>
                                      </div>
                                      <div class="d-flex">
                                          <p class="bottomMargin" style="font-size: 11px;">
                                            ${autherDetails.userDescription ||
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
                              ${postCreatorId === currentLoginUserId
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
                              <img src=${postImageUrl} alt="" class="sizeImg" />
                          </div>`;

      postElement.innerHTML = contentOfPost;
      // console.log(postElement);
      postArea.appendChild(postElement);
    });
  } catch (error) {
    console.log(error);
  }
}


// ===========>>>>>>>>Delete Current User Posts <<<<<<<<=========

const deletePost = async (uId) => {
  // console.log(uId);
  try {
    if (uId) {
      await deleteDoc(doc(db, "myPosts", uId));
      console.log("Deleted Successfully");
      Swal.fire({
        position: "center",
        icon: "success",
        title: `You have Deleted post Successfully`,
        showConfirmButton: false,
        timer: 1500,
      });
      const dPost = document.getElementById(uId);
      dPost.remove();
    } else {
      console.log("you are not able to delete this post");
    }
  } catch (error) {
    console.log(error);
  }
};

// ===========>>>>>>>> Show All Users Connect with Postbook <<<<<<<<=========

async function showAllUsers(email) {
  // console.log(email);

  try {
    const q = query(collection(db, "users"), where("userEmail", "!=", email));
    const allUsersArea = document.querySelector(".allUsersArea");

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // console.log(doc.id);
      const {
        userFirstName,
        userSurName,
        userName,
        userEmail,
        userDescription,
        userContactNumber,
        profilePic,
        followers,
        following,
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
        <button type="button" class="btn rounded-pill px-3 border" onclick="followHandler('${doc.id
        }', '${userFirstName}', '${userSurName}', '${userName}')">
          ${followers?.includes(currentLoginUserId) ? '<i class="fa-solid fa-minus"></i>' : '<i class="fa-solid fa-plus"></i>'}
          ${followers?.includes(currentLoginUserId) ? "Unfollow" : "Follow"}
        </button>
      </div>`;
    });
  } catch (error) {
    console.log(error);
  }
}

// ===========>>>>>>>> Follow Other Users <<<<<<<<=========

const followHandler = async (
  followingId,
  followingFName,
  followingSName,
  followingUName
) => {
  console.log(
    followingId,
    followingFName,
    followingSName,
    followingUName,
    "==>> Follow Handler Working"
  );

  const followingRef = doc(db, "users", currentLoginUserId);

  if (!myFollowings.includes(`${followingId}`)) {
    await updateDoc(followingRef, {
      following: arrayUnion(`${followingId}`),
    });
    Swal.fire({
      position: "center",
      icon: "success",
      title: `You are now Following ${followingFName} ${followingSName}`,
      showConfirmButton: false,
      timer: 1500,
    });
    savingFollowersToOtherUser(followingId, currentLoginUserId);
    getUserData(currentLoginUserId);
    setTimeout(() => {
      window.location.reload();
    }, 1550);
    return;
  } else {
    await updateDoc(followingRef, {
      following: arrayRemove(`${followingId}`),
    });
    Swal.fire({
      position: "center",
      icon: "success",
      title: `You have unfollowed ${followingFName} ${followingSName}`,
      showConfirmButton: false,
      timer: 1500,
    });
    const restartUi = document.querySelector(".swal2-confirm");
    console.log(restartUi);
    removingFollowersFromOtherUser(followingId, currentLoginUserId);
    getUserData(currentLoginUserId);
    setTimeout(() => {
      window.location.reload();
    }, 1550);
  }
};

const savingFollowersToOtherUser = async (followingUid, currentUserUid) => {
  console.log(followingUid);
  console.log(currentUserUid);
  const followingRef = doc(db, "users", followingUid);
  await updateDoc(followingRef, {
    followers: arrayUnion(`${currentUserUid}`),
  });
};

const removingFollowersFromOtherUser = async (followingUid, currentUserUid) => {
  console.log(followingUid);
  console.log(currentUserUid);
  const followingRef = doc(db, "users", followingUid);
  await updateDoc(followingRef, {
    followers: arrayRemove(`${currentUserUid}`),
  });
};

const logoutHandler = async () => {
  try {
    const response = await signOut(auth);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

logOutbutton.addEventListener("click", logoutHandler);

// window.editPost = editPost;
window.deletePost = deletePost;
window.followHandler = followHandler;
