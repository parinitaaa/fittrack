// diet.js - Diet page logic

document.addEventListener('DOMContentLoaded', function () {
    const user = auth.getUser();
    const progress = auth.getProgress();

    if (!user || !progress) {
        window.location.href = 'index.html';
        return;
    }

    // Update page title with user's name
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        pageTitle.innerHTML = `${user.name}'s Diet Plan`;
    }

    // Load today's meals
    loadTodaysMeals();

    // Load weekly meals and set default day
    loadWeeklyMeals();

    // Add event listeners for day buttons
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            // Remove active class from all buttons
            document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            // Load meals for selected day
            loadDayMeals(this.dataset.day);
        });
    });

    // Complete diet step
    auth.completeStep('diet');
});

function loadTodaysMeals() {
    const todayMeals = document.getElementById('todayMeals');
    const meals = [
        {
            time: "7:00 AM",
            type: "Breakfast",
            name: "Oatmeal with Berries",
            description: "Steel-cut oats with mixed berries and almonds",
            calories: 320,
            protein: 15,
            carbs: 45,
            fats: 10
        },
        {
            time: "10:00 AM",
            type: "Snack",
            name: "Greek Yogurt",
            description: "Greek yogurt with honey and walnuts",
            calories: 180,
            protein: 20,
            carbs: 15,
            fats: 8
        },
        {
            time: "1:00 PM",
            type: "Lunch",
            name: "Chicken Salad",
            description: "Grilled chicken salad with avocado and olive oil",
            calories: 450,
            protein: 35,
            carbs: 20,
            fats: 25
        },
        {
            time: "4:00 PM",
            type: "Snack",
            name: "Apple with Peanut Butter",
            description: "Apple slices with natural peanut butter",
            calories: 220,
            protein: 8,
            carbs: 25,
            fats: 12
        },
        {
            time: "7:00 PM",
            type: "Dinner",
            name: "Salmon with Vegetables",
            description: "Baked salmon with roasted vegetables",
            calories: 480,
            protein: 40,
            carbs: 30,
            fats: 20
        }
    ];

    todayMeals.innerHTML = meals.map(meal => `
        <div class="meal-card">
            <div class="meal-header">
                <div class="meal-time">${meal.time}</div>
                <div class="meal-type">${meal.type}</div>
            </div>
            <div class="meal-content">
                <h4>${meal.name}</h4>
                <p>${meal.description}</p>
                <div class="meal-nutrition">
                    <div class="nutrition-item"><i class="fas fa-fire"></i><span>${meal.calories} cal</span></div>
                    <div class="nutrition-item"><i class="fas fa-drumstick-bite"></i><span>${meal.protein}g protein</span></div>
                    <div class="nutrition-item"><i class="fas fa-bread-slice"></i><span>${meal.carbs}g carbs</span></div>
                    <div class="nutrition-item"><i class="fas fa-oil-can"></i><span>${meal.fats}g fats</span></div>
                </div>
            </div>
        </div>
    `).join('');
}

function loadWeeklyMeals() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const todayIdx = new Date().getDay(); // 0 = Sunday
    const today = days[(todayIdx + 6) % 7]; // map Sunday (0) to sunday, Monday (1) to monday, etc.

    // Sync active button class with today's day
    document.querySelectorAll('.day-btn').forEach(btn => {
        if (btn.dataset.day === today) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    loadDayMeals(today);
}

function loadDayMeals(day) {
    // Normalize day key to lowercase to match weeklyData keys
    const dayKey = (day || '').toLowerCase();
    const weeklyMeals = document.getElementById('weeklyMeals');

    const weeklyData = {
        monday: [
            {
                time: "Breakfast",
                name: "Scrambled Eggs",
                description: "Eggs with spinach and whole wheat toast",
                calories: 350,
                protein: 25,
                carbs: 30,
                fats: 15
            },
            {
                time: "Lunch",
                name: "Turkey Sandwich",
                description: "Whole grain bread with turkey and veggies",
                calories: 420,
                protein: 30,
                carbs: 45,
                fats: 12
            },
            {
                time: "Dinner",
                name: "Beef Stir Fry",
                description: "Lean beef with mixed vegetables",
                calories: 450,
                protein: 35,
                carbs: 40,
                fats: 18
            }
        ],
        tuesday: [
            {
                time: "Breakfast",
                name: "Protein Smoothie",
                description: "Protein powder with banana and almond milk",
                calories: 300,
                protein: 30,
                carbs: 25,
                fats: 5
            },
            {
                time: "Lunch",
                name: "Chicken Quinoa Bowl",
                description: "Grilled chicken with quinoa and vegetables",
                calories: 480,
                protein: 40,
                carbs: 45,
                fats: 10
            },
            {
                time: "Dinner",
                name: "Baked Fish",
                description: "Fish with sweet potato and asparagus",
                calories: 400,
                protein: 35,
                carbs: 35,
                fats: 8
            }
        ],
        wednesday: [
            {
                time: "Breakfast",
                name: "Greek Yogurt Parfait",
                description: "Yogurt with granola and berries",
                calories: 320,
                protein: 20,
                carbs: 40,
                fats: 6
            },
            {
                time: "Lunch",
                name: "Tuna Salad",
                description: "Tuna with mixed greens and olive oil",
                calories: 380,
                protein: 30,
                carbs: 10,
                fats: 22
            },
            {
                time: "Dinner",
                name: "Chicken Breast",
                description: "Grilled chicken with broccoli and rice",
                calories: 420,
                protein: 45,
                carbs: 35,
                fats: 10
            }
        ]
        // Add other days as necessary
    };

    const meals = weeklyData[dayKey];

    // Error handling / fallback UI for missing days
    if (!meals || meals.length === 0) {
        weeklyMeals.innerHTML = `
            <div class="alert alert-info" style="grid-column: 1 / -1; width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <i class="fas fa-info-circle"></i>
                <span>No meals planned for ${dayKey.charAt(0).toUpperCase() + dayKey.slice(1)} yet. Please check back later!</span>
            </div>
        `;
        return;
    }

    weeklyMeals.innerHTML = meals.map(meal => `
        <div class="meal-card animate fade-in">
            <div class="meal-header">
                <div class="meal-time">${meal.time}</div>
                <div class="meal-type">${dayKey.charAt(0).toUpperCase() + dayKey.slice(1)}</div>
            </div>
            <div class="meal-content">
                <h4>${meal.name}</h4>
                <p>${meal.description}</p>
                <div class="meal-nutrition">
                    <div class="nutrition-item"><i class="fas fa-fire"></i><span>${meal.calories} cal</span></div>
                    <div class="nutrition-item"><i class="fas fa-drumstick-bite"></i><span>${meal.protein || 0}g protein</span></div>
                    <div class="nutrition-item"><i class="fas fa-bread-slice"></i><span>${meal.carbs || 0}g carbs</span></div>
                    <div class="nutrition-item"><i class="fas fa-oil-can"></i><span>${meal.fats || 0}g fats</span></div>
                </div>
            </div>
        </div>
    `).join('');
}