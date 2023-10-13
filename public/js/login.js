const getElement = (id) => document.getElementById(id);

const _credentialInvalid = (id, msg) => {
  const invalidElement = getElement("invalid-credentials");
  const inputContainer = getElement(id);
  inputContainer.classList.remove("ring-gray-300");
  inputContainer.classList.add("ring-red-500");
  invalidElement.classList.remove("hidden");
  invalidElement.innerText = msg;
  return false;
};

const _credentialValid = (id) => {
  const invalidElement = getElement("invalid-credentials");
  const inputContainer = getElement(id);
  inputContainer.classList.remove("ring-gray-300");
  inputContainer.classList.remove("ring-red-500");
  inputContainer.classList.add("ring-green-500");
  invalidElement.classList.add("hidden");
  return true;
};

const validateEmail = (email) => {
  if (!email && !email.includes("@")) {
    return _credentialInvalid("email", "Please enter a valid email.");
  }
  return _credentialValid("email");
};

const validatePassword = (password) => {
  if (!password) {
    return _credentialInvalid("password", "Please enter a valid password.");
  }
  return _credentialValid("password");
};

const validateCredentials = () => {
  const email = getElement("email").value;
  const password = getElement("password").value;
  if (!validateEmail(email) || !validatePassword(password)) {
    return false;
  }
  axios.post("/login", { email, password }).then((res) => {
    console.log(res);
  });
};
