function switchForm(formType) {
            const loginForm = document.getElementById('loginForm');
            const signupForm = document.getElementById('signupForm');
            const loginBtn = document.getElementById('loginBtn');
            const signupBtn = document.getElementById('signupBtn');

            if (formType === 'login') {
                loginForm.classList.add('active');
                signupForm.classList.remove('active');
                loginBtn.classList.add('active');
                signupBtn.classList.remove('active');
            } else {
                loginForm.classList.remove('active');
                signupForm.classList.add('active');
                loginBtn.classList.remove('active');
                signupBtn.classList.add('active');
            }
        }

        function showNotification(message) {
            const notify = document.getElementById('notification');
            const text = document.getElementById('notifyText');
            text.innerText = message;
            
            notify.classList.add('show');
            
            // Hide after 3 seconds
            setTimeout(() => {
                notify.classList.remove('show');
            }, 3000);
        }

        function handleLogin(e) {
            e.preventDefault();
            window.location.href="../HostDashboard/HostDashboard.html";
            // showNotification('Welcome Host! Accessing Dashboard...');
            // console.log("Host Login submitted");
        }

        function handleSignup(e) {
            e.preventDefault();
            window.location.href="../HostDashboard/HostDashboard.html";
            // showNotification('Application Submitted! Verification in progress.');
            // console.log("Host Signup submitted with proof");
        }