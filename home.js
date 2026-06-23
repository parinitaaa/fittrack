// home (1).js - Dashboard logic (FINAL FIX)

document.addEventListener('DOMContentLoaded', () => {
    const user = auth.getUser();

    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const profileSection = document.getElementById('profileSection');
    const recommendationsSection = document.getElementById('recommendationsSection');

    const redirectFlagKey = 'profileRedirectDone';
    const alreadyRedirected = localStorage.getItem(redirectFlagKey);

    // ✅ PROFILE COMPLETED
    if (user.profileCompleted) {

        if (profileSection) profileSection.classList.add('hidden');
        if (recommendationsSection) recommendationsSection.classList.remove('hidden');

        // 🔁 Redirect ONLY ONCE
        if (!alreadyRedirected) {
            localStorage.setItem(redirectFlagKey, "true");

            setTimeout(() => {
                window.location.href = 'diet.html';
            }, 800);
        }

        return;

    }

    // ❌ PROFILE NOT COMPLETED
    if (profileSection) profileSection.classList.remove('hidden');
    if (recommendationsSection) recommendationsSection.classList.add('hidden');

    // Handle profile form submit (first time only)
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', e => {
            e.preventDefault();

            const age = document.getElementById('age').value;
            const height = document.getElementById('height').value;
            const weight = document.getElementById('weight').value;
            const fitnessGoal = document.getElementById('fitnessGoal').value;

            auth.updateBasicProfile({
                userData: { age, height, weight, fitnessGoal }
            });

            // 🔁 allow redirect once after completion
            localStorage.removeItem(redirectFlagKey);

            alert('Profile completed successfully!');
            window.location.href = 'diet.html';
        });
    }
});
