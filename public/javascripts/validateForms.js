// Example starter JavaScript for disabling form submissions if there are invalid field
(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')
    console.log(forms)

    // Loop over them and prevent submission
    Array.from(forms)
        .forEach(form => {
            form.addEventListener('submit', event => {
                console.log('inside validation')
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()