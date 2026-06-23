document.addEventListener('DOMContentLoaded', () => {
    const user = auth.getUser();

    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('height').value = user.userData?.height || '';
    document.getElementById('weight').value = user.userData?.weight || '';
    document.getElementById('fitnessGoal').value = user.userData?.fitnessGoal || 'maintenance';
});

function saveProfile() {
    const name = document.getElementById('name').value.trim();
    const height = document.getElementById('height').value.trim();
    const weight = document.getElementById('weight').value.trim();
    const fitnessGoal = document.getElementById('fitnessGoal').value;
    
    // Validation
    if (name.length < 2) {
        alert('Name too short');
        return;
    }

    const heightNum = Number(height);
    if (!height || isNaN(heightNum) || heightNum <= 0) {
        alert('Please enter a valid height in cm');
        return;
    }

    const weightNum = Number(weight);
    if (!weight || isNaN(weightNum) || weightNum <= 0) {
        alert('Please enter a valid weight in kg');
        return;
    }

    if (!fitnessGoal) {
        alert('Please select a fitness goal');
        return;
    }

    auth.updateBasicProfile({
        name,
        userData: { height: heightNum, weight: weightNum, fitnessGoal }
    });

    alert('Profile updated successfully!');
    window.location.href = 'index.html'; // dashboard → auto redirect
}

function addAnotherMember() {
    auth.logout();
    window.location.href = 'register.html';
}

function changePassword() {
    const newPass = document.getElementById('newPassword').value;
    const confirmPass = document.getElementById('confirmPassword').value;
    if (newPass !== confirmPass) {
        alert('Passwords do not match');
        return;
    }
    if (!auth.validatePassword(newPass)) {
        alert('Password must be at least 8 characters');
        return;
    }
    const result = auth.updatePassword(newPass);
    if (result.success) {
        alert('Password updated successfully');
        // Clear inputs
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmPassword').value = '';
    } else {
        alert(result.error || 'Failed to update password');
    }
}

function forgotPassword() {
    alert('Password reset link sent (demo)');
}
