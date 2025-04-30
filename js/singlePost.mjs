import { getSinglePost } from "../api/singlePost.mjs";


const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

if (postId) {
    try {

        let post = await getSinglePost(localStorage.getItem("accessToken"), postId);

        if (post) {
            function createSinglePost(coverImage, postTitle, postBody) {
                const content = document.getElementById("singlepost_container");

                // image
                const card = document.createElement("div");
                card.classList.add("card");
                card.classList.add("flex");

                const postImage = document.createElement("img");
                postImage.src = coverImage;
                postImage.classList.add("cover");

                card.appendChild(postImage);

                // Title, text and button
                const title = document.createElement("h2");
                title.classList.add('cover_text');
                title.innerText = postTitle;

                const smallText = document.createElement("p");
                smallText.classList.add("cover_small_text");
                smallText.innerText = postBody;

                card.appendChild(title);
                card.appendChild(smallText);

                content.appendChild(card);
            }

            createSinglePost(post.media?.url || 'default-image.jpg', post.title, post.body);
        } else {
            console.error("Post not found");
        }
    } catch (error) {
        console.error("Error fetching post:", error);
    }
} else {
    console.error("Post ID not found in URL");
}
