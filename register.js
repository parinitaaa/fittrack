// register.js - Registration page logic
document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const formAlert = document.getElementById('formAlert');
    
    // Real-time validation
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    // Validate name
    nameInput.addEventListener('blur', function() {
        validateFormField(this, auth.validateName, 'Name must be at least 2 characters long');
    });
    
    // Validate email
    emailInput.addEventListener('blur', function() {
        validateFormField(this, auth.validateEmail, 'Please enter a valid email address');
    });
    
    // Validate password
    passwordInput.addEventListener('blur', function() {
        validateFormField(this, auth.validatePassword, 'Password must be at least 6 characters long');
    });
    
    // Validate password confirmation
    confirmPasswordInput.addEventListener('input', function() {
        const password = passwordInput.value;
        const confirmPassword = this.value;
        const errorElement = this.nextElementSibling;
        
        if (errorElement && errorElement.classList.contains('form-error')) {
            if (password !== confirmPassword) {
                this.classList.add('error');
                errorElement.textContent = 'Passwords do not match';
                errorElement.classList.add('show');
            } else {
                this.classList.remove('error');
                errorElement.classList.remove('show');
            }
        }
    });
    
    // Handle form submission
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        // Validate all fields
        let isValid = true;
        
        if (!auth.validateName(name)) {
            nameInput.classList.add('error');
            nameInput.nextElementSibling.classList.add('show');
            isValid = false;
        }
        
        if (!auth.validateEmail(email)) {
            emailInput.classList.add('error');
            emailInput.nextElementSibling.classList.add('show');
            isValid = false;
        }
        
        if (!auth.validatePassword(password)) {
            passwordInput.classList.add('error');
            passwordInput.nextElementSibling.classList.add('show');
            isValid = false;
        }
        
        if (password !== confirmPassword) {
            confirmPasswordInput.classList.add('error');
            confirmPasswordInput.nextElementSibling.classList.add('show');
            isValid = false;
        }
        
        if (!isValid) {
            showAlert('Please fix the errors in the form', 'error');
            return;
        }
        
        // Check if email already exists
        if (auth.emailExists(email)) {
            showAlert('Email already registered. Please use a different email or login.', 'error');
            emailInput.classList.add('error');
            return;
        }
        
        // Show loading state
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitBtn.disabled = true;
        
        try {
            // Register user
            const result = auth.register(name, email, password);
            
            if (result.success) {
                showAlert('Account created successfully! Redirecting to dashboard...', 'success');
                
                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                showAlert(result.error, 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Registration error:', error);
            showAlert('An error occurred. Please try again.', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    function showAlert(message, type) {
        formAlert.textContent = message;
        formAlert.className = 'alert';
        formAlert.classList.add(`alert-${type}`);
        formAlert.style.display = 'flex';
        
        // Scroll to alert
        formAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-hide success messages
        if (type === 'success') {
            setTimeout(() => {
                formAlert.style.display = 'none';
            }, 5000);
        }
    }
    
    function validateFormField(field, validationFn, errorMessage) {
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('form-error')) {
            if (!validationFn(field.value)) {
                field.classList.add('error');
                errorElement.textContent = errorMessage;
                errorElement.classList.add('show');
                return false;
            } else {
                field.classList.remove('error');
                errorElement.classList.remove('show');
                return true;
            }
        }
        return validationFn(field.value);
    }
});