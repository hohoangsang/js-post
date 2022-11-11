export function renderPostForm({initialValues, callback}) {
    const postDetailTitle = document.getElementById("postDetailTitle");

    const url = new URL(window.location);

    if (postDetailTitle) {
        if (url.searchParams.get("id")) {
            postDetailTitle.innerText = "Edit the post"
        } else postDetailTitle.innerText = "Add a post"
    }
}