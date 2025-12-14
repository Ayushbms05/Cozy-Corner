function handleRequest(id, status) {
            const element = document.getElementById(id);
            if(status === 'accepted') {
                element.innerHTML = `<div style="text-align:center; padding:20px; color:var(--success); font-weight:bold;"><i class="fas fa-check-circle"></i> Booking Accepted!</div>`;
                // Add logic to update database
            } else {
                element.innerHTML = `<div style="text-align:center; padding:20px; color:var(--text-light);"><i class="fas fa-times-circle"></i> Request Declined</div>`;
                setTimeout(() => {
                    element.style.display = 'none';
                }, 1500);
            }
        }