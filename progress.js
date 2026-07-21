document.addEventListener("DOMContentLoaded", () => {
    const user = auth.getUser();
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const weight = Number(user.userData?.weight || 60);

    const activities = [
        { id: "steps", name: "Steps Walked", unit: "steps", max: 10000, inc: 500, cal: 0.04 },
        { id: "water", name: "Water Intake", unit: "L", max: 3, inc: 0.25, cal: 0 },
        { id: "sleep", name: "Sleep", unit: "hrs", max: 8, inc: 1, cal: 0 },
        { id: "yoga", name: "Yoga", unit: "mins", max: 45, inc: 10, cal: 0.03 },
        { id: "cycling", name: "Cycling", unit: "mins", max: 60, inc: 5, cal: 0.08 },
        { id: "workout", name: "Workout", unit: "mins", max: 60, inc: 10, cal: 0.1 },
        { id: "running", name: "Running", unit: "mins", max: 40, inc: 5, cal: 0.12 },
        { id: "stretch", name: "Stretching", unit: "mins", max: 30, inc: 5, cal: 0.02 }
    ];

    let activityData = JSON.parse(localStorage.getItem("daily_activities")) || {};
    const container = document.getElementById("activitiesContainer");

    function render() {
        container.innerHTML = "";

        activities.forEach(act => {
            const value = activityData[act.id] || 0;

            container.innerHTML += `
                <div class="stat-card">
                    <div class="stat-info">
                        <div class="stat-value">${value} ${act.unit}</div>
                        <div class="stat-label">${act.name}</div>

                        <div class="activity-buttons">
                            <button onclick="updateActivity('${act.id}', ${act.inc})">
                                +${act.inc} ${act.unit}
                            </button>
                        </div>

                        <progress value="${value}" max="${act.max}"></progress>
                    </div>
                </div>
            `;
        });

        calculateCalories();
    }

    window.updateActivity = function (id, inc) {
        const act = activities.find(a => a.id === id);
        activityData[id] = Math.min(act.max, (activityData[id] || 0) + inc);
        localStorage.setItem("daily_activities", JSON.stringify(activityData));
        render();
    };

    function calculateCalories() {
        let totalCalories = 0;

        activities.forEach(act => {
            totalCalories += (activityData[act.id] || 0) * act.cal * weight;
        });

        totalCalories = Math.round(totalCalories);
        document.getElementById("caloriesBurned").innerText = totalCalories + " kcal";
        document.getElementById("calorieBar").value = totalCalories;
    }

    render();
});

function goNext() {
    const user = auth.getUser();
    const weight = Number(user?.userData?.weight || 60);
    const caloriesStr = document.getElementById("caloriesBurned").innerText;
    const calories = parseInt(caloriesStr) || 0;
    
    saveDailyProgress(weight, calories);
    auth.completeStep('progress');
    
    window.location.href = "diet.html";
}

function saveDailyProgress(weight, calories) {
    const history = JSON.parse(localStorage.getItem('progress_history')) || [];
    
    // Check if we already saved today to avoid duplicate entries
    const today = new Date().toLocaleDateString();
    const existingIndex = history.findIndex(h => h.date === today);
    
    if (existingIndex !== -1) {
        history[existingIndex].weight = weight;
        history[existingIndex].calories = calories;
    } else {
        history.push({
            date: today,
            weight: weight,
            calories: calories
        });
    }

    localStorage.setItem('progress_history', JSON.stringify(history));
}
