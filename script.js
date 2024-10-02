const professionalRadio = document.getElementById('professional');
const cookingRadio = document.getElementById('cooking');
const body = document.body;

function updateMode() {
    if (professionalRadio.checked) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
    }
}

professionalRadio.addEventListener('change', updateMode);
cookingRadio.addEventListener('change', updateMode);

// Initial mode update
updateMode();