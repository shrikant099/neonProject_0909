document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.querySelector('#ragisterForm');
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const firstName = document.querySelector('#firstName').value.trim();
        const lastName = document.querySelector('#lastName').value.trim();
        const email = document.querySelector('#email').value.trim();
        const password = document.querySelector('#password').value.trim();
        const number = document.querySelector('#number').value;


        if (!firstName || !lastName || !email || !number|| !password) {
            alert('All fields are required!');
            return;
        }

        const formData = { firstName, lastName, email, number ,password };

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                console.log('Registration successful. Token:', result.token);

                // Save token in local storage
                localStorage.setItem('token', result.token);

                alert('Registration successful!');
                window.location.href = './index.html';
            } else {
                // Handle errors from the server
                alert(result.message || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during registration:', error.message);
            alert('Failed to register. Please try again later.');
        }
    });
});



// Login Api
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#login-form');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.querySelector('#email').value.trim();
        const password = document.querySelector('#password').value.trim();

        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }

        const loginData = { email, password };

        try {
            // First, try to login the normal user
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (!response.ok) {
                throw new Error('Invalid email or password.');
            }

            const result = await response.json();

            if (result.success) {
                console.log('Login successful. Token:', result.token);

                localStorage.setItem('token', `Bearer ${result.token}`);

                alert('Login successful!');

                const adminResponse = await fetch('/api/admin/login', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }) 
                });

                const adminResult = await adminResponse.json();

                if (adminResponse.ok && adminResult.message === "Admin is logged in") {
                    console.log('Admin login successful');
                    alert('Admin logged in');
                    window.location.href = '../admin-pannel.html'; 

                } else {
                    console.log('User login successful');
                    window.location.href = './index.html'; 
                }
            } else {
                alert(result.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during login:', error.message);
            alert('Something went wrong. Please try again.');
        }
    });
});
