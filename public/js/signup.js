const getElement = (id) => document.getElementById(id);

const _credentialInvalid = (id, msg) => {
  const invalidElement = getElement(`is-${id}-invalid`);
  const inputContainer = getElement(id);
  inputContainer.classList.remove("ring-gray-300");
  inputContainer.classList.add("ring-red-500");
  invalidElement.classList.remove("hidden");
  invalidElement.innerText = msg;
  return false;
};

const _credentialValid = (id) => {
  const invalidElement = getElement(`is-${id}-invalid`);
  const inputContainer = getElement(id);
  inputContainer.classList.remove("ring-gray-300");
  inputContainer.classList.remove("ring-red-500");
  inputContainer.classList.add("ring-green-500");
  invalidElement.classList.add("hidden");
  return true;
};

const validateUsername = async (username) => {
  if (!username) {
    return _credentialInvalid("username", "Please enter a valid username.");
  }
  const isExist = await axios
    .post("/signup/isUsernameExist", { username: username })
    .then((res) => res.data);
  if (isExist) {
    return _credentialInvalid("username", "Username already exists.");
  } else {
    return _credentialValid("username");
  }
};

const validateEmail = async (email) => {
  if (!email && !email.includes("@")) {
    return _credentialInvalid("email", "Please enter a valid email.");
  }
  const isExist = await axios
    .post("/signup/isEmailExist", { email: email })
    .then((res) => res.data);
  if (isExist) {
    return _credentialInvalid("email", "Email already exists.");
  } else {
    return _credentialValid("email");
  }
};

const validatePassword = (password) => {
  if (password.length < 10) {
    return _credentialInvalid(
      "password",
      "Password must be at least 10 characters long."
    );
  }
  if (!password.match(/[a-z]/)) {
    return _credentialInvalid(
      "password",
      "Password must contain at least one lowercase letter."
    );
  }
  if (!password.match(/[A-Z]/)) {
    return _credentialInvalid(
      "password",
      "Password must contain at least one uppercase letter."
    );
  }
  if (!password.match(/[0-9]/)) {
    return _credentialInvalid(
      "password",
      "Password must contain at least one number."
    );
  }
  if (!password.match(/[^a-zA-Z0-9]/)) {
    return _credentialInvalid(
      "password",
      "Password must contain at least one special character."
    );
  }
  return _credentialValid("password");
};

const validateCredentials = async () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;

  const isPasswordValid = validatePassword(password);
  const isUsernameValid = await validateUsername(username);
  const isEmailValid = await validateEmail(email);

  if (isPasswordValid && isUsernameValid && isEmailValid) {
    const credentials = {
      username,
      password,
      email,
    };
    await axios.post("/signup", credentials).then((res) => {
      if (res.data) {
        window.location.href = "/login";
      } else {
        alert("Error while creating user");
      }
    });
  }
  return;
};
