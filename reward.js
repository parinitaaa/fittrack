// reward.js - Rewards page logic
let currentRewardId = null;

document.addEventListener('DOMContentLoaded', function() {
    const user = auth.getUser();
    const progress = auth.getProgress();
    
    if (!user || !progress) {
        window.location.href = 'index.html';
        return;
    }
    
    // Update page title with user's name
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        pageTitle.innerHTML = `${user.name}'s Rewards`;
    }
    
    // Update points and stats
    document.getElementById('totalPoints').textContent = progress.points;
    document.getElementById('achievementsCount').textContent = progress.achievements.length;
    document.getElementById('rewardsEarned').textContent = progress.completedSteps.length;
    document.getElementById('streakDays').textContent = progress.stats.streak;
    
    // Load rewards
    loadRewards(progress);
    
    // Complete rewards step
    auth.completeStep('rewards');
});

function loadRewards(progress) {
    const rewardsGrid = document.getElementById('rewardsGrid');
    
    const rewards = [
        {
            id: 1,
            name: "Fitness Ebook",
            points: 100,
            description: "Get our exclusive fitness guide",
            icon: "📚",
            unlocked: progress.points >= 100
        },
        {
            id: 2,
            name: "10% Discount",
            points: 250,
            description: "Discount on fitness products",
            icon: "💸",
            unlocked: progress.points >= 250
        },
        {
            id: 3,
            name: "Personal Training Session",
            points: 500,
            description: "30-min virtual training session",
            icon: "👨‍🏫",
            unlocked: progress.points >= 500
        },
        {
            id: 4,
            name: "Premium Membership",
            points: 1000,
            description: "1 month of premium features",
            icon: "⭐",
            unlocked: progress.points >= 1000
        },
        {
            id: 5,
            name: "Fitness Tracker",
            points: 2000,
            description: "Branded fitness tracker device",
            icon: "⌚",
            unlocked: progress.points >= 2000
        },
        {
            id: 6,
            name: "Gym Membership",
            points: 5000,
            description: "3-month gym membership",
            icon: "🏋️",
            unlocked: progress.points >= 5000
        }
    ];
    
    if (rewardsGrid) {
        rewardsGrid.innerHTML = rewards.map(reward => `
            <div class="reward-card ${reward.unlocked ? 'unlocked' : 'locked'}">
                <div class="reward-icon">${reward.icon}</div>
                <h3 class="reward-title">${reward.name}</h3>
                <p class="reward-desc">${reward.description}</p>
                <div class="reward-points">${reward.points} points</div>
                <button class="btn ${reward.unlocked ? 'btn-success' : 'btn-secondary'}" 
                        onclick="showRewardModal(${reward.id}, ${reward.points}, ${reward.unlocked})"
                        ${!reward.unlocked ? 'disabled' : ''}>
                    ${reward.unlocked ? 'Claim Now' : 'Need ' + (reward.points - progress.points) + ' more points'}
                </button>
            </div>
        `).join('');
    }
}

function showRewardModal(rewardId, points, unlocked) {
    if (!unlocked) return;
    
    currentRewardId = rewardId;
    const modal = document.getElementById('rewardModal');
    const modalMessage = document.getElementById('modalMessage');
    const confirmBtn = document.getElementById('confirmClaim');
    
    modalMessage.textContent = `Are you sure you want to claim this reward for ${points} points?`;
    confirmBtn.textContent = `Claim (${points} points)`;
    modal.classList.remove('hidden');
}

function closeRewardModal() {
    const modal = document.getElementById('rewardModal');
    modal.classList.add('hidden');
    currentRewardId = null;
}

// Handle reward claim
document.getElementById('confirmClaim')?.addEventListener('click', function() {
    const progress = auth.getProgress();
    const points = parseInt(this.textContent.match(/\d+/)[0]);
    
    if (progress.points >= points) {
        // Subtract points
        auth.addPoints(-points);
        
        // Show success message
        alert('Reward claimed successfully! You will receive it via email.');
        
        // Close modal
        closeRewardModal();
        
        // Reload page to update points
        setTimeout(() => {
            location.reload();
        }, 1000);
    } else {
        alert('Not enough points to claim this reward!');
        closeRewardModal();
    }
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('rewardModal');
    if (event.target === modal) {
        closeRewardModal();
    }
});
document.addEventListener('DOMContentLoaded', loadChart);

function loadChart() {
    const ctx = document.getElementById('progressChart');
    if (!ctx) return;

    const history = JSON.parse(localStorage.getItem('progress_history')) || [];

    if (history.length === 0) return;

    const labels = history.map(h => h.date);
    const weights = history.map(h => h.weight);
    const calories = history.map(h => h.calories);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Weight Lost (kg)',
                    data: weights,
                    borderWidth: 2,
                    tension: 0.3
                },
                {
                    label: 'Calories Burned',
                    data: calories,
                    borderWidth: 2,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
