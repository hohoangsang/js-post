import postApi from "../services/postApi";
import { renderPostForm } from "../utils";

(async function () {
    const url = new URL(window.location);

    const postId = url.searchParams.get("id");

    let initialValues = {
        author: "Kira Schroeder",
        description: "content 1",
        imageUrl: "https://picsum.photos/id/214/1368/400",
        title: "Error amet sit",
    }

    if (postId) {
        const post = await postApi.getById(postId)

        initialValues = {
            ...initialValues,
            ...post
        }
    }

    const handleSubmitForm = (data) => {
        console.log(data)
    }

    renderPostForm({
        initialValues,
        callback: handleSubmitForm
    })
})()