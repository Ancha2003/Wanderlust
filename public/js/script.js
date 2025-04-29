document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form.needs-validation");

    form.addEventListener("submit", function (event) {
        let isValid = true;

        // Validate Title
        const title = form.querySelector("input[name='listing[title]']");
        if (!title.value.trim()) {
            isValid = false;
            alert("Title is required");
        }

        // Validate Price
        const price = form.querySelector("input[name='listing[price]']");
        if (!price.value.trim() || isNaN(price.value) || price.value <= 0) {
            isValid = false;
            alert("Please enter a valid price");
        }

        // Validate Image URL
        const image = form.querySelector("input[name='listing[image][url]']");
        if (!image.value.trim() || !image.value.startsWith("http")) {
            isValid = false;
            alert("Please enter a valid image URL");
        }

        // Validate Location
        const location = form.querySelector("input[name='listing[location]']");
        if (!location.value.trim()) {
            isValid = false;
            alert("Location is required");
        }

        // Prevent form submission if validation fails
        if (!isValid) {
            event.preventDefault();
        }
    });
});


const reviewForm = document.getElementById('review-form');
reviewForm.addEventListener('submit', function(event) {
  const commentField = document.getElementById('comment');
  if (!commentField.value.trim()) {
    alert("Please fill in the comment field.");
    event.preventDefault();
  }
});