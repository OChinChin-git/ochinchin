const signUpButton = document.getElementById('signUpButton');
const signInButton = document.getElementById('signInButton');
const signInForm = document.getElementById('signIn');
const signUpForm = document.getElementById('signup');

// Chuyển sang trang đăng ký khi nhấn "Sign Up"
signUpButton.addEventListener('click', function() {
    signInForm.style.display = "none";
    signUpForm.style.display = "block";
});

// Chuyển sang trang đăng nhập khi nhấn "Sign In"
signInButton.addEventListener('click', function() {
    signInForm.style.display = "block";
    signUpForm.style.display = "none";
});

// Phần đăng nhập Google (trang đăng nhập)
document.getElementById('googleSignInButton').addEventListener('click', function() {
    // Thực hiện đăng nhập Google
    console.log("Đăng nhập với Google (trang đăng nhập)");
});

// Phần đăng nhập Google (trang đăng ký)
document.getElementById('googleSignUpButton').addEventListener('click', function() {
    // Thực hiện đăng nhập Google
    console.log("Đăng nhập với Google (trang đăng ký)");
});
