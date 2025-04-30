import { getProfile } from "../api/profile.mjs";

function applyTailwindClasses(element, classNames) {
    element.classList.add(...classNames.split(" "));
}

const accessToken = localStorage.getItem("accessToken");
const username = localStorage.getItem("username"); // assuming you store username on login

// Display credits globally if logged in
function displayGlobalCredits() {
    if (!accessToken || !username) return;

    const creditsBar = document.createElement("div");
    creditsBar.id = "credits_bar";
    document.body.insertAdjacentElement("afterbegin", creditsBar); // show at top of page
}

// Display profile page
async function displayProfile() {
    try {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const usernameParam = urlParams.get("username");
        const profile = await getProfile(accessToken, usernameParam);

        if (!profile) return;

        const main = document.querySelector("main");


        // Banner container
        const bannerContainer = document.createElement("div");
        applyTailwindClasses(bannerContainer, "banner_container w-full");

        const bannerImg = document.createElement("img");
        applyTailwindClasses(bannerImg, "banner_img w-full h-48 object-cover");

        bannerImg.src = profile.data.banner?.url || "default-banner.jpg";
        bannerImg.alt = profile.data.banner?.alt || "User banner";

        bannerContainer.appendChild(bannerImg);

        // Profile card
        const cardProfile = document.createElement("div");
        applyTailwindClasses(cardProfile, "card_profile flex items-center m-8");

        const profileImg = document.createElement("img");
        applyTailwindClasses(profileImg, "profile_img rounded-full w-32 h-32 mr-6");
        profileImg.src = profile.data.avatar?.url || "default-avatar.jpg";
        profileImg.alt = profile.data.avatar?.alt || "User avatar";

        const profileInfo = document.createElement("div");
        profileInfo.className = "profile_info";

        const nameHeading = document.createElement("h1");
        applyTailwindClasses(nameHeading, "name_heading flex justify-center text-2xl font-bold");
        nameHeading.textContent = profile.data.name;

        const creditsParagraph = document.createElement("p");
        creditsParagraph.innerHTML = `<strong>Credits:</strong> ${profile.data.credits}`;

        profileInfo.appendChild(nameHeading);
        profileInfo.appendChild(creditsParagraph);

        cardProfile.appendChild(profileImg);
        cardProfile.appendChild(profileInfo);

        // Button container
        const buttonContainer = document.createElement("div");
        applyTailwindClasses(buttonContainer, "button_container flex gap-2 my-4 ml-8");

        const editButton = document.createElement("button");
        applyTailwindClasses(editButton, "edit_button bg-Blue_Chill text-white text-sm px-3 py-1 rounded");
        editButton.innerText = "Edit Profile";
        editButton.addEventListener("click", () => {
            window.location.href = "../profile/edit.html";
        });

        const createButton = document.createElement("button");
        applyTailwindClasses(createButton, "create_button bg-Blue_Chill text-white text-sm px-3 py-1 rounded");
        createButton.innerText = "Create Post";
        createButton.addEventListener("click", () => {
            window.location.href = "../postActions/create.html";
        });


        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(createButton);

        // Post container
        const postContainer = document.createElement("div");
        postContainer.id = "post_container";
        postContainer.className = "grid";

        main.appendChild(bannerContainer);
        main.appendChild(cardProfile);
        main.appendChild(buttonContainer);
        main.appendChild(postContainer);


        await (usernameParam);
    } catch (error) {
        console.error("Error displaying profile:", error);
    }
}

displayGlobalCredits();
await displayProfile();
