const checkTokenAndUpdateUI = () => {
    const userIcon = document.querySelector('.user-icon');
    const token = localStorage.getItem('token');

    if (token) {
        userIcon.style.display = 'none';
    } else {
        userIcon.style.display = 'block';
    };
};

window.addEventListener('load', () => {
    checkTokenAndUpdateUI();
});