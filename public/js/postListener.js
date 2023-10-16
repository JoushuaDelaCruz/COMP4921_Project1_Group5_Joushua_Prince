$("#title-form")
  .each(function () {
    const textCounter = document.getElementById("title-counter");
    this.setAttribute("style", "height:" + "2.25rem" + "px;overflow-y:hidden;");
    textCounter.setAttribute("style", "height:" + "2.25rem" + "px;");
  })
  .on("input", function () {
    const textCounter = document.getElementById("title-counter");
    textCounter.style.height = "2.25rem";
    textCounter.style.height = this.scrollHeight + "px";
    textCounter.innerHTML = this.value.length + "/300";
    this.style.height = "2.25rem";
    this.style.height = this.scrollHeight + "px";
  });
