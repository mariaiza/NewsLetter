const express = require("express");
const https = require("https");
const app = express();
const mailchimp = require('@mailchimp/mailchimp_marketing');

mailchimp.setConfig({
    apiKey: '73a2cf917c72ace590bf7706ab837ac8-us8',
    server: 'us8',
});


// CONFIGURE EXPRESS APP
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(express.static("public"))


// TEST MAILCHIMP
async function callPing() {
    const response = await mailchimp.ping.get();
    console.log(response);
}
callPing();


// CODE REQUEST METHODS
app.get("/", function (req, res) {
    res.sendFile(`${__dirname}/signup.html`);

})

app.post("/", function (req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    console.log(firstName, lastName, email);

    async function run() {

        const response = await mailchimp.lists.addListMember("edc52759f0", {
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        });
        console.log(response);

        res.sendFile(`${__dirname}/success.html`);

    }
    run().catch(e => {
        // console.log(e);
        var errorText = JSON.parse(e.response.error.text);
        console.log(e.status);
        console.log(errorText.title);
        console.log(errorText.detail);
        // console.log(e.response.res.text.Title);
        console.log(e.response.text.detail);
        res.sendFile(__dirname + "/failure.html");
    });



})

app.post("/failure", function(req,res) {
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function () {
    console.log("server is running on port 3000");

})

//   run();

//listId edc52759f0
//   another aPI key 73a2cf917c72ace590bf7706ab837ac8-us8
//   another aPI key 16a77a0f827eed631410dcf2af3b0deb-us8