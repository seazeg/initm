fetch("/api", {
    method: "get",
})
    .then(function (response) {
        console.log(response);
    })
    .then(function (body) {
        document.body.innerHTML = body;
    });
