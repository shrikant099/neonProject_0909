document.addEventListener('DOMContentLoaded', () => {

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');  // Retrieve 'userId' from the URL
    console.log(`User reset password Id ${userId}`);

    const resetFrom = document.querySelector('#newPassForm');
    resetFrom.addEventListener('submit', async (event) => {
        event.preventDefault();
        const password = document.querySelector('#createPass').value;
        const msgBox = document.querySelector('#msgBox');

        if (!password) {
            msgBox.innerHTML = "Fill both password and confirm password!";
        } else {
            msgBox.innerHTML = '';
        }

        try {
            // Make sure that userId is correctly passed in the URL
            const fetchResetPasswordAPi = await fetch(`/api/auth/resetpassword/${userId}`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ password: password }) // Send password in request body
            });

            const resetAPiResult = await fetchResetPasswordAPi.json();

            if (!fetchResetPasswordAPi.ok) {
                msgBox.innerHTML = resetAPiResult.message || "Internal server Error Please Try Again";
            } else {
                msgBox.innerHTML = '';
                window.location.href = './index.html'
            }

        } catch (error) {
            console.log(`Error fetching Reset Password api ${error}`);
            msgBox.innerHTML = "Please try again Internal server error";
        }
    });
});
