$("#title")
  .each(function () {
    const textCounter = document.getElementById("title-counter");
    this.setAttribute(
      "style",
      "height:" + this.scrollHeight + "px;overflow-y:hidden;"
    );
    textCounter.setAttribute(
      "style",
      "height:" + this.scrollHeight + "px;overflow-y:hidden;"
    );
  })
  .on("input", function () {
    const textCounter = document.getElementById("title-counter");
    textCounter.style.height = "2rem";
    textCounter.style.height = this.scrollHeight + "px";
    textCounter.innerHTML = this.value.length + "/300";
    this.style.height = "2rem";
    this.style.height = this.scrollHeight + "px";
    if (this.value.length <= 0) {
      const postBtn = document.getElementById("post-btn");
      postBtn.setAttribute("disabled", true);
      postBtn.style.opacity = 0.5;
    } else {
      const postBtn = document.getElementById("post-btn");
      postBtn.removeAttribute("disabled");
      postBtn.style.opacity = 1;
    }
  });

$("#content")
  .each(function () {
    this.setAttribute(
      "style",
      "height:" + this.scrollHeight + "px;overflow-y:hidden;"
    );
  })
  .on("input", function () {
    this.style.height = "15rem";
    this.style.height = this.scrollHeight + "px";
  });
