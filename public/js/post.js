const submitPost = () => {
  const content = document.getElementById("content").value;
  const title = document.getElementById("title").value;
  const data = { content, title };
  axios.post("/post/create", data).then((res) => {
    if (res.data) {
      window.location.href = "/";
    } else {
      alert("Error creating post");
    }
  });
};
