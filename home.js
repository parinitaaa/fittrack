// home (1).js - Dashboard logic (FINAL FIX)

function populateRecommendations(userData) {
    if (!userData) return;
    
    const age = userData.age || '-';
    const weight = userData.weight || '-';
    const height = userData.height || '-';
    const goal = userData.fitnessGoal || 'maintenance';

    const userProfileSummary = document.getElementById('userProfileSummary');
    if (userProfileSummary) {
        userProfileSummary.innerHTML = `<p>Based on your profile (Age: ${age}, Weight: ${weight}kg, Height: ${height}cm), here is your customized plan.</p>`;
    }

    let calories = 2000;
    let exercise = '3-4 days/week';
    let macros = '30% P / 40% C / 30% F';
    let steps = '8,000';
    let plan = '';

    if (goal === 'weight_loss') {
        calories = 1800;
        exercise = '4-5 days/week';
        macros = '40% P / 30% C / 30% F';
        steps = '10,000';
        plan = 'Focus on a caloric deficit, high protein intake to preserve muscle, and consistent cardio combined with strength training.';
    } else if (goal === 'muscle_gain') {
        calories = 2500;
        exercise = '5-6 days/week';
        macros = '30% P / 50% C / 20% F';
        steps = '7,000';
        plan = 'Focus on a caloric surplus, progressive overload in strength training, and adequate rest for muscle recovery.';
    } else if (goal === 'endurance') {
        calories = 2200;
        exercise = '5-6 days/week';
        macros = '20% P / 60% C / 20% F';
        steps = '12,000';
        plan = 'Focus on cardiovascular endurance, high carbohydrate intake for energy, and consistent aerobic training.';
    } else {
        calories = 2000;
        exercise = '3-4 days/week';
        macros = '30% P / 40% C / 30% F';
        steps = '8,000';
        plan = 'Maintain current habits, ensuring a balanced diet and regular physical activity to sustain overall health.';
    }

    const calorieTargetEl = document.getElementById('calorieTarget');
    if (calorieTargetEl) calorieTargetEl.innerText = `${calories} kcal`;

    const exercisePlanEl = document.getElementById('exercisePlan');
    if (exercisePlanEl) exercisePlanEl.innerText = exercise;

    const macroSplitEl = document.getElementById('macroSplit');
    if (macroSplitEl) macroSplitEl.innerText = macros;

    const dailyStepsEl = document.getElementById('dailySteps');
    if (dailyStepsEl) dailyStepsEl.innerText = steps;

    const planDetailsEl = document.getElementById('planDetails');
    if (planDetailsEl) {
        planDetailsEl.innerHTML = `
            <div class="alert alert-info">
                <strong><i class="fas fa-info-circle"></i> Your Plan:</strong> ${plan}
            </div>
        `;
    }
}

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
        if (recommendationsSection) {
            recommendationsSection.classList.remove('hidden');
            populateRecommendations(user.userData);
        }

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
            const activityLevel = document.getElementById('activityLevel').value;

            auth.updateBasicProfile({
                userData: { age, height, weight, fitnessGoal, activityLevel }
            });

            // Populate right away so it looks nice before redirect
            populateRecommendations({ age, height, weight, fitnessGoal, activityLevel });
            if (profileSection) profileSection.classList.add('hidden');
            if (recommendationsSection) recommendationsSection.classList.remove('hidden');

            // 🔁 allow redirect once after completion
            localStorage.removeItem(redirectFlagKey);

            alert('Profile completed successfully!');
            window.location.href = 'diet.html';
        });
    }
});
