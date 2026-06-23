// auth.js - Complete Authentication & Profile System

class Auth {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        const savedUser = localStorage.getItem('fitness_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }

        if (!localStorage.getItem('fitness_users')) {
            this.setupDemoData();
        }
    }

    setupDemoData() {
        const demoUsers = [
            {
                id: 1,
                name: "John Fitness",
                email: "john@fitness.com",
                password: "password123",
                avatar: "JF",
                profileCompleted: true,
                userData: {
                    height: 170,
                    weight: 70,
                    fitnessGoal: "weight_loss"
                }
            }
        ];

        localStorage.setItem('fitness_users', JSON.stringify(demoUsers));
        localStorage.setItem(
            'fitness_progress_1',
            JSON.stringify(this.defaultProgress(1))
        );
    }

    /* ---------- VALIDATION ---------- */
    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    validatePassword(password) {
        return password.length >= 8;
    }

    validateName(name) {
        return name.trim().length >= 2;
    }

    // Email existence check using a named function for clarity
emailExists(email) {
    const users = JSON.parse(localStorage.getItem('fitness_users')) || [];
    function matchesEmail(u) { return u.email === email; }
    return users.some(matchesEmail);
}

login(email, password) {
    const users = JSON.parse(localStorage.getItem('fitness_users')) || [];
    function findByEmail(u) { return u.email === email; }
    const user = users.find(findByEmail);

    if (!user) return { success: false, error: "User not found" };
    if (user.password !== password) return { success: false, error: "Wrong password" };

    this.currentUser = user;
    localStorage.setItem('fitness_user', JSON.stringify(user));
    return { success: true };
}

register(name, email, password) {
    // Validate name and email first
    if (!this.validateName(name) || !this.validateEmail(email)) {
        return { success: false, error: "Invalid name or email" };
    }
    // Validate password length (>=8)
    if (!this.validatePassword(password)) {
        return { success: false, error: "Password must be at least 8 characters" };
    }
    if (this.emailExists(email)) {
        return { success: false, error: "Email already exists" };
    }

    const users = JSON.parse(localStorage.getItem('fitness_users')) || [];

    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        avatar: this.getAvatarInitials(name),
        profileCompleted: false,
        userData: {}
    };

    users.push(newUser);
    localStorage.setItem('fitness_users', JSON.stringify(users));
    localStorage.setItem(
        `fitness_progress_${newUser.id}`,
        JSON.stringify(this.defaultProgress(newUser.id))
    );

    this.currentUser = newUser;
    localStorage.setItem('fitness_user', JSON.stringify(newUser));

    return { success: true };
}


    logout() {
        localStorage.removeItem('fitness_user');
        this.currentUser = null;
        window.location.href = './login.html';
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    getUser() {
        return this.currentUser;
    }

    /* ---------- PROFILE UPDATE (IMPORTANT FIX) ---------- */
    updatePassword(newPass) {
        // Validate new password length (>=8)
        if (!this.validatePassword(newPass)) {
            return { success: false, error: "Password must be at least 8 characters" };
        }
        if (!this.currentUser) {
            return { success: false, error: "No user logged in" };
        }
        // Update in current session
        this.currentUser.password = newPass;
        // Persist changes to storage
        localStorage.setItem('fitness_user', JSON.stringify(this.currentUser));
        const users = JSON.parse(localStorage.getItem('fitness_users')) || [];
        const idx = users.findIndex(u => u.id === this.currentUser.id);
        if (idx !== -1) {
            users[idx].password = newPass;
            localStorage.setItem('fitness_users', JSON.stringify(users));
        }
        return { success: true };
    }

    updateBasicProfile(updatedData) {
        if (!this.currentUser) return;

        this.currentUser = {
            ...this.currentUser,
            ...updatedData,
            profileCompleted: true   // ✅ KEY FIX
        };

        localStorage.setItem('fitness_user', JSON.stringify(this.currentUser));

        const users = JSON.parse(localStorage.getItem('fitness_users')) || [];
        const index = users.findIndex(u => u.id === this.currentUser.id);

        if (index !== -1) {
            users[index] = this.currentUser;
            localStorage.setItem('fitness_users', JSON.stringify(users));
        }
    }

    // Utility to escape HTML for safe insertion
    escapeHTML(str) {
        if (!str) return '';
        return str.replace(/[&<>"']/g, function (m) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            }[m];
        });
    }

    getAvatarInitials(name) {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }

    /* ---------- PROGRESS ---------- */
    defaultProgress(userId) {
        return {
            userId,
            completedSteps: [],
            points: 0,
            achievements: [],
            stats: { streak: 1 }
        };
    }

    getProgress() {
        if (!this.currentUser) return null;
        return JSON.parse(
            localStorage.getItem(`fitness_progress_${this.currentUser.id}`)
        );
    }

    completeStep(step) {
        const progress = this.getProgress();
        if (!progress.completedSteps.includes(step)) {
            progress.completedSteps.push(step);
            progress.points += 50;
            localStorage.setItem(
                `fitness_progress_${this.currentUser.id}`,
                JSON.stringify(progress)
            );
        }
    }
}

/* ---------- GLOBAL ---------- */
window.auth = new Auth();

/* ---------- NAV USER DISPLAY ---------- */
function updateUserDisplay() {
    const user = auth.getUser();
    const userInfo = document.getElementById('userInfo');
    if (!userInfo || !user) return;

    // Escape user-provided values
    const safeName = auth.escapeHTML(user.name);
    const safeEmail = auth.escapeHTML(user.email);
    const safeAvatar = auth.escapeHTML(user.avatar);

    userInfo.innerHTML = `
        <div class="profile-dropdown">
            <div class="user-avatar" onclick="toggleProfileMenu()">${safeAvatar}</div>
            <div class="dropdown-menu hidden" id="profileMenu">
                <p class="dropdown-name">${safeName}</p>
                <p class="dropdown-email">${safeEmail}</p>
                <hr>
                <a href="profile.html">Profile</a>
                <a href="profile.html#password">Change Password</a>
                <a href="register.html">Add Another Member</a>
                <hr>
                <a href="#" onclick="auth.logout()">Logout</a>
            </div>
        </div>
    `;
}


function toggleProfileMenu() {
    document.getElementById('profileMenu').classList.toggle('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    if (auth.isLoggedIn()) updateUserDisplay();
});
