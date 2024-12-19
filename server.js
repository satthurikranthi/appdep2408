const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "profilepics")
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

let app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL encoded bodies

app.use('/profilepics', express.static('profilepics'));

let authorize = (req, res, next) => {
    console.log("insideauthorise emw");

    let token = req.headers["Authorization"];
    console.log(token);
    next();

};


app.use(authorize);

app.post("/signup", upload.single("profilepic"), async (req, res) => {
    console.log(req.body);

    console.log(req.file);

    let hashedpassword = await bcrypt.hash(req.body.password, 10);

    try {
        let newkranthi = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            age: req.body.age,
            email: req.body.email,
            password: hashedpassword,
            mobileNo: req.body.mobileNo,
            profilepic: req.file.path,
        });

        await User.insertMany([newkranthi]);

        res.json({ status: "success", msg: "User created successfully." });
    } catch (err) {
        res.json({ status: "failure", msg: "Unable to create account." });
    }
});

app.post("/login", upload.none(), async (req, res) => {
    console.log(req.body);

    let userDetailsArr = await User.find({ email: req.body.email });
    console.log(userDetailsArr);

    if (userDetailsArr.length > 0) {
        // Await the result of bcrypt.compare
        let ispasswordCorrect = await bcrypt.compare(req.body.password, userDetailsArr[0].password);

        if (ispasswordCorrect) {
            // Create JWT token
            let token = jwt.sign({
                email: req.body.email,
                password: req.body.password,
            }, "amboombush");

            let dataToClient = {
                firstName: userDetailsArr[0].firstName,
                lastName: userDetailsArr[0].lastName,
                age: userDetailsArr[0].age,
                email: userDetailsArr[0].email,
                mobileNo: userDetailsArr[0].mobileNo,
                profilepic: userDetailsArr[0].profilepic,
                token: token, // Include token in the response
            };

            return res.json({ status: "success", data: dataToClient }); // Send token and user data
        } else {
            res.json({ status: "failure", msg: "Invalid password" });
        }
    } else {
        res.json({ status: "failure", msg: "Invalid Email" });
    }
});

app.put("/updateprofile", upload.single("profilepic"),
    async (req, res) => {
        console.log(req.body);

        try {


            if (req.body.firstName.trim().length > 0) {
                console.log("inside updating firstName");

                await User.updateMany(
                    { email: req.body.email },
                    { firstName: req.body.firstName }
                );


            }
            if (req.body.lastName.trim().length > 0) {
                console.log("inside updating lastName");

                await User.updateMany(
                    { email: req.body.email },
                    { lastName: req.body.lastName }
                );


            }

            if (req.body.age > 0) {
                console.log("inside updating age");

                await User.updateMany(
                    { email: req.body.email },
                    { age: req.body.age }
                );
            }

            if (req.body.password) {
                console.log("inside updating password");

                await User.updateMany(
                    { email: req.body.email },
                    { passwordName: req.body.password }
                );
            }

            if (req.body.mobileNo.trim().length > 0) {
                console.log("inside updating mobileNoii8");


                await User.updateMany(
                    { email: req.body.email },
                    { firstName: req.body.mobileNo }
                );
            }

            if (req.file) {
                console.log("inside updating profilepic");

                await User.updateMany(
                    { email: req.body.email },
                    { profilepic: req.file.path }
                );

            }
            res.json({ status: "success", msg: "profile updated successfully" })

        } catch (err) {

            res.json({ status: "failure", msg: "unable to update profile", err: err });

        }




    });


app.delete("/deleteProfile", async (req, res) => {

    console.log(req.query);

    try {
        await User.deleteMany({ email: req.query.email });
        res.json({ status: "succes", msg: "profile deleted successfully." })

    } catch (err) {
        res.json({ status: "failure", msg: "unable to delete profile.", err })
    }

});


app.post("/validateToken", upload.none(), async (req, res) => {
    console.log(req.body.token);

    try {
        let decryptedToken = jwt.verify(req.body.token, "amboombush");
        console.log(decryptedToken);

        let userDetailsArr = await User.find({ email: decryptedToken.email });

        if (userDetailsArr.length > 0) {
            let dataToClient = {
                firstName: userDetailsArr[0].firstName,
                lastName: userDetailsArr[0].lastName,
                age: userDetailsArr[0].age,
                email: userDetailsArr[0].email,
                mobileNo: userDetailsArr[0].mobileNo,
                profilepic: userDetailsArr[0].profilepic,
                token: req.body.token, // Send token back (or a new one if necessary)
            };

            return res.json({ status: "success", data: dataToClient });
        } else {
            return res.json({ status: "failure", msg: "Invalid Email" });
        }
    } catch (err) {
        return res.json({ status: "failure", msg: "Invalid token or expired" });
    }
});

app.listen(process.env.port, () => {
    console.log(`Listening on port 4567  ${process.env.port}`);
});

let userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    email: String,
    password: String,
    mobileNo: String,
    profilepic: String
});

let User = mongoose.model("user", userSchema, "kranthis");

let connectToMDB = async () => {
    try {
        await mongoose.connect(process.env.mdburl);
        console.log("Successfully connected to MDB");
    } catch (err) {
        console.log("Unable to connect to MDB", err);
    }
};

connectToMDB();
