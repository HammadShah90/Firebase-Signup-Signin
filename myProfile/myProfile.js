import { auth, onAuthStateChanged, doc, getDoc, db, query, collection, where, getDocs } from "../firbaseConfig.js";

const profileUserFullname = document.querySelector("#profileUserFullname");
const profileUserName = document.querySelector("#profileUserName");
const profileUserDescription = document.querySelector(
  "#profileUserDescription"
);
const profileUserPic = document.querySelector("#profileUserPic");

console.log(profileUserFullname);
console.log(profileUserName);
console.log(profileUserDescription);
console.log(profileUserPic);

let currentLoginUserId;

onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    console.log(uid);
    //   getUserData(uid)
    //   getUserDataToEditProfile(uid)
    getUserData(uid);
    showAllUsers(user.email);
    currentLoginUserId = uid;
  } else {
    window.location.href = `../dashboard/dashboard.html`;
  }
});

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
      } = docSnap.data();
      // console.log(userEmail);

      profileUserFullname.textContent = `${userFirstName} ${userSurName}`;
      profileUserName.textContent = userName;
      profileUserDescription.textContent =
        userDescription || "No Description Added";
      profileUserPic.src = profilePic || "../Assets/dummy-image.jpg";

      // showPosts(docSnap.data())
      // console.log(currentLoginUser);
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.log(error);
  }
}

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
      <button type="button" class="btn rounded-pill px-3 border" onclick="followHandler('${
        doc.id
      }', '${userFirstName}', '${userSurName}', '${userName}', '${userEmail}', '${userDescription}', '${userContactNumber}', '${profilePic}')">
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

// window.editPost = editPost;
// window.deletePost = deletePost;
// window.followHandler = followHandler;
