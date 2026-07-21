// login.js - Login page logic
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const formAlert = document.getElementById('formAlert');
    
    // Real-time validation
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    // Validate email
    emailInput.addEventListener('blur', function() {
        validateFormField(this, auth.validateEmail, 'Please enter a valid email address');
    });
    
    // Validate password
    passwordInput.addEventListener('blur', function() {
        validateFormField(this, auth.validatePassword, 'Password must be at least 8 characters long');
    });
    
    // Handle form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Validate fields
        let isValid = true;
        
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
        
        if (!isValid) {
            showAlert('Please fix the errors in the form', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        submitBtn.disabled = true;
        
        try {
            // Attempt login
            const result = auth.login(email, password);
            
            if (result.success) {
                showAlert('Login successful! Redirecting to dashboard...', 'success');
                
                // Redirect to dashboard after 1 second
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                showAlert(result.error, 'error');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Login error:', error);
            showAlert('An error occurred. Please try again.', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    function showAlert(message, type) {
        formAlert.textContent = message;
        formAlert.className = `alert alert-${type}`;
        formAlert.style.display = 'flex';
        
        // Scroll to alert
        formAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    
    // Handle forgot password
    const forgotPasswordLink = document.getElementById('forgotPassword');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            const email = emailInput.value.trim();
            if (!email) {
                showAlert('Please enter your email address first to reset your password.', 'info');
            } else {
                showAlert('A password reset link has been sent to ' + email, 'success');
            }
        });
    }
    
    // Demo auto-fill helper
    document.querySelector('.alert-info').addEventListener('click', function() {
        emailInput.value = 'john@fitness.com';
        passwordInput.value = 'password123';
        emailInput.classList.remove('error');
        passwordInput.classList.remove('error');
        emailInput.nextElementSibling.classList.remove('show');
        passwordInput.nextElementSibling.classList.remove('show');
    });
});