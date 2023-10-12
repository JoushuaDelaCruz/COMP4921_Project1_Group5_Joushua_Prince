const getElement = (id) => document.getElementById(id);

const validateUsername = (username) => {
  console.log(username);
  if (!username) {
    const invalidElement = getElement("is-username-invalid");
    const inputContainer = getElement("username");
    inputContainer.classList.remove("ring-gray-300");
    invalidElement.classList.remove("invisible");
    return false;
  }
  return true;
};

const validatePassword = (password) => {
  console.log(password);
};

const login = () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;

  const validUser = validatePassword(password) || validateUsername(username);

  if (validUser) {
    const data = {
      username,
      password,
      email,
    };
    console.log(data);
  }
  return;
};
