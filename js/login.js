(function () {
    const usernameInput = document.getElementById("username-input");
    const passwordInput = document.getElementById("password-input");
    const loginBtn = document.getElementById("login-btn");
    const clearBtn = document.getElementById("clear-btn");

    loginBtn.addEventListener("click", ()=> {
        // post
    });

    clearBtn.addEventListener("click", () => {
        usernameInput.value = "";
        passwordInput.value = "";
    });
})();