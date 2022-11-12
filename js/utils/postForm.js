import { setBackgroundImg, setFieldValue } from "./common";

export function initPostForm({formId, defaultValues, onSubmit }) {
    const form = document.getElementById(formId);
    if (!form) return;

    setFormValues(form, defaultValues)
}

function setFormValues(form, formValues) {
    setFieldValue(form, '[name="title"]', formValues.title);
    setFieldValue(form, '[name="author"]', formValues.author);
    setFieldValue(form, '[name="description"]', formValues.description);

    setFieldValue(form, '[name="imageUrl"]', formValues.imageUrl); //hidden field
    setBackgroundImg(document, '#postHeroImage', formValues.imageUrl)
}
