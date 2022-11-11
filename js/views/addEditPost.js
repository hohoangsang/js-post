import postApi from "../services/postApi";
import { renderPostForm } from "../utils";

(async function () {
    const postDetailTitle = document.getElementById("postDetailTitle");

    const url = new URL(window.location);

    const postId = url.searchParams.get("id");

    let initialValues = {
        author: "Kira Schroeder",
        description: "content 1",
        imageUrl: "https://picsum.photos/id/214/1368/400",
        title: "Error amet sit",
    }

    if (postId) {
        postDetailTitle.innerText = "Edit the post"

        const post = await postApi.getById(postId)

        initialValues = {
            ...initialValues,
            ...post
        }
    } else postDetailTitle.innerText = "Add a post"

    const handleSubmitForm = (data) => {
        console.log(data)
    }

    renderPostForm({
        initialValues,
        callback: handleSubmitForm
    })
})()