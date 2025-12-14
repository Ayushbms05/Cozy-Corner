function saveProfile(e) {
            e.preventDefault();
            const college = document.getElementById('collegeName').value;
            alert(`Profile Updated! Listing feed will now be filtered for: ${college}`);
            
            // In a real app, this would save to the database and redirect to home
            // window.location.href = 'student_home.html';
        }