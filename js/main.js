/*Author:Miguel Suarez
  Date:08/10/2026

*/
document.addEventListener('DOMContentLoaded', function () {
    // Your JavaScript code here
    console.log('DOM fully loaded and parsed');
    /**VARIABLES */
    const passwordCheckbox = document.getElementById('show-password');
    const preloader = document.getElementById('preloader');
    const toggleButton = document.getElementById('toggle-button');
    const controller = new AbortController();

    console.log('AbortController initialized:', controller);

    /* Add event listener for form submission */
    document.addEventListener('submit', async function as(event) {
        viewPreloader();
        const objForm = document.querySelector('form');
        enableDisableForm(true, objForm);

        if (validateForm(objForm)) {
            console.log('Form is valid. Proceed with submission.');

            await sendFormData(objForm, controller.signal)
                .then((response) => {
                    viewMessage(2, 'Form submitted successfully!', 2000);
                    console.log('Data sent successfully:', response);
                }).catch((error) => {
                    console.error('Error submitting form:', error);
                    viewMessage(1, 'Error submitting form. Please try again.', 2000);
                }).finally(() => {
                    enableDisableForm(false, objForm);
                    hidePreloader();
                });
        } else {
            console.log('Form is invalid. Please correct the errors.');
            enableDisableForm(false, objForm);
            hidePreloader();
        }
        event.preventDefault(); // Prevent the default form submission behavior
    });

    /* Function to send form data */
    async function sendFormData(form, signal) {
        const formData = new FormData();
        formData.append('user_name', form[0].value);
        formData.append('user_password', form[1].value);
        var object = {};
        formData.forEach(function (value, key) {
            object[key] = value;
        });

        let result = `{"status":200, "data":${JSON.stringify(object)}, "message":"Login Ok"}`;
        signal.addEventListener('abort', () => {
            console.log('Abort signal received, cancelling request...');
        })
        return JSON.parse(result);
    }

    /* Function to validate the form */
    function validateForm(objForm) {
        //const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const regexUsername = /^[a-zA-Z]{3,16}$/;
        const regexPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        const inputs = objForm.querySelectorAll('input, textarea, select');
        for (let input of inputs) {
            if (input.type === 'password' && !regexPassword.exec(input.value)) {
                console.log(`Password too short for input: ${input.name}`);
                viewMessage(1, 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.', 2000);
                return false; // Form is valid
            }
            if (input.type === 'text' && !regexUsername.exec(input.value)) {
                console.log(`Invalid username for input: ${input.name}`);
                viewMessage(1, 'Username must be between 3 and 16 characters long and contain only letters.', 2000);
                return false; // Form is valid
            }
            // if (input.type === 'email' && !regexEmail.exec(input.value)) {
            //   console.log(`Invalid email for input: ${input.name}`);
            //   viewMessage(1, 'Please enter a valid email address.', 2000);
            //   return false; // Form is valid
            // }
        }
        return true; // Form is valid
    }

    /* Function to display messages */
    function viewMessage(type, message, time) {
        const messageElement = document.getElementById('message-from-server');
        messageElement.className = 'validation-message'; // reset
        messageElement.classList.add(type === 1 ? 'error' : 'success');
        messageElement.style.display = 'block';
        messageElement.querySelector('p').textContent = message;

        clearTimeout(messageElement._timer);
        messageElement._timer = setTimeout(() => {
            messageElement.style.display = 'none';
        }, time);

    }

    function enableDisableForm(status, objForm) {
        const elements = objForm.querySelectorAll('input, textarea, select,button');
        for (let element of elements) {
            element.disabled = status;
        }
    }

    function viewPreloader() {
        preloader.style.display = 'flex';
        preloader.style.opacity = '1';
    }

    function hidePreloader() {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 300); // coincide con la transición CSS
    }

    function onloadView() {
        viewPreloader();
        setTimeout(hidePreloader, 800); // ✅ oculta tras 800ms
    };

    /* Add event listener for the checkbox to toggle password visibility */
    passwordCheckbox.addEventListener('change', function () {
        const passwordInputs = document.querySelectorAll('input[data-type="password"]');
        passwordInputs.forEach(input => {
            if (this.checked) {
                input.type = 'text';
            } else {
                input.type = 'password';
            }
        });
        /* Automatically change back to password after 1 second */
        setTimeout(() => {
            passwordInputs.forEach(input => {
                input.type = 'password';
                passwordCheckbox.checked = false; // Uncheck the checkbox after 1 second
            });
        }, 1000); // Change back to password after 1 second
    });

    /* Toggle button functionality */
    if (toggleButton) {
        toggleButton.addEventListener('click', function () {
            const nav = document.querySelector('nav');
            if (nav.style.display === 'block') {
                nav.style.display = 'none';
            } else {
                nav.style.display = 'block';
            }
        });
    }

    onloadView();
});
