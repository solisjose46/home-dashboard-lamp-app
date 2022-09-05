async function postData(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });
    return response;
  }

(function () {
    const usernameInput = document.getElementById("username-input");
    const passwordInput = document.getElementById("password-input");
    const loginBtn = document.getElementById("login-btn");
    const clearBtn = document.getElementById("clear-btn");

    loginBtn.addEventListener("click", ()=> {
        const login = {
            username: usernameInput.value,
            password: passwordInput.value
        };

        postData("http://192.168.122.46:5000/login", login)
        .then((response) => {
            if(!response.ok){
                throw Error(response.statusText);
            }

            return response;
        })
        .then((response) => {
            console.log(response);
        })
        .catch((error) => {
            console.log(error);
        })
    });

    clearBtn.addEventListener("click", () => {
        usernameInput.value = "";
        passwordInput.value = "";
    });
})();