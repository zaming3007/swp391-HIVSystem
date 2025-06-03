// Define regex patterns 
const usernamePattern = /^[a-zA-Z0-9_]+$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Login function
async function submitLogin() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    // Clear previous errors
    errorDiv.classList.add('d-none');

    // Validation
    if (!username || !password) {
        showError(errorDiv, 'Vui lòng nhập đầy đủ thông tin đăng nhập');
        return;
    }

    if (username.length < 3) {
        showError(errorDiv, 'Tên đăng nhập phải có ít nhất 3 ký tự');
        return;
    }

    if (password.length < 3) {
        showError(errorDiv, 'Mật khẩu phải có ít nhất 3 ký tự');
        return;
    }

    try {
        const response = await fetch('/Account/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `Username=${encodeURIComponent(username)}&Password=${encodeURIComponent(password)}`
        });

        if (response.ok) {
            location.reload(); // Reload to update session state
        } else {
            const text = await response.text();
            if (text.includes('không đúng') || text.includes('không tồn tại')) {
                showError(errorDiv, 'Tên đăng nhập hoặc mật khẩu không đúng');
            } else {
                showError(errorDiv, 'Lỗi đăng nhập. Vui lòng thử lại.');
            }
        }
    } catch (error) {
        showError(errorDiv, 'Lỗi kết nối. Vui lòng thử lại.');
    }
}

// Register function
async function submitRegister() {
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorDiv = document.getElementById('registerError');

    // Clear previous errors
    errorDiv.classList.add('d-none');

    // Validation
    if (!username || !email || !password || !confirmPassword) {
        showError(errorDiv, 'Vui lòng nhập đầy đủ tất cả thông tin');
        return;
    }

    if (username.length < 3) {
        showError(errorDiv, 'Tên đăng nhập phải có ít nhất 3 ký tự');
        return;
    }

    if (username.length > 50) {
        showError(errorDiv, 'Tên đăng nhập không được dài quá 50 ký tự');
        return;
    }

    // Username validation: chỉ chấp nhận chữ, số và dấu gạch dưới
    if (!usernamePattern.test(username)) {
        showError(errorDiv, 'Tên đăng nhập chỉ được chứa chữ cái, số và dấu gạch dưới');
        return;
    }

    // Email validation
    if (!emailPattern.test(email)) {
        showError(errorDiv, 'Email không hợp lệ');
        return;
    }

    if (password.length < 6) {
        showError(errorDiv, 'Mật khẩu phải có ít nhất 6 ký tự');
        return;
    }

    if (password !== confirmPassword) {
        showError(errorDiv, 'Mật khẩu xác nhận không khớp');
        return;
    }

    try {
        const response = await fetch('/Account/Register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `Username=${encodeURIComponent(username)}&Email=${encodeURIComponent(email)}&Password=${encodeURIComponent(password)}`
        });

        if (response.ok) {
            // Close modal and reload page to show success message
            const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
            if (modal) {
                modal.hide();
            }
            // Reload page to show success message and updated state
            location.reload();
        } else {
            const text = await response.text();
            if (text.includes('đã tồn tại')) {
                showError(errorDiv, 'Tên đăng nhập đã tồn tại. Vui lòng chọn tên khác.');
            } else if (text.includes('đã được sử dụng')) {
                showError(errorDiv, 'Email đã được sử dụng. Vui lòng sử dụng email khác.');
            } else {
                showError(errorDiv, 'Lỗi đăng ký. Vui lòng thử lại.');
            }
        }
    } catch (error) {
        showError(errorDiv, 'Lỗi kết nối. Vui lòng thử lại.');
    }
}

// Helper function
function showError(errorDiv, message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('d-none');
} 