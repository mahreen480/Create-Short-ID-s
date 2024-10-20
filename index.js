const express = require("express");
const path = require("path")
const cookieParser = require("cookie-parser")
const { connectToMongoDb } = require("./connection");
const { restrictToLoggedInToUserOnly } = require("./middleware/auth")
const URL = require("./models/url")

const urlRoutes = require("./routes/url");
const staticRoute = require("./routes/staticRouter")
const userRoutes = require("./routes/user")

const app = express();
const PORT = 8080;


connectToMongoDb("mongodb+srv://mahreenmughal480:Abc123@cluster0.wukfk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", { dbName: "shorturl" })

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use("/url", restrictToLoggedInToUserOnly, urlRoutes)
app.use("/", staticRoute);
app.use("/user", userRoutes)

app.get("/url/:shortId", async (req, res) => {
    try {
        const shortId = req.params.shortId;
        const entry = await URL.findOneAndUpdate(
            { shortId },
            { $push: { visitHistory: { timestamp: Date.now() } } }
        );
        if (!entry) {
            return res.status(404).send("URL not found");
        }
        res.redirect(entry.redirectURL);
    }
    catch (error) {
        console.error("Error during redirection:", error);
        res.status(500).send("An error occurred");
    }
});

app.get("/test", async (req, res) => {
    try {
        const allUrls = await URL.find({});
        return res.json({
            success: true,
            urls: allUrls,
        });
    } catch (error) {
        console.error("Error fetching URLs:", error);
        res.status(500).json({ success: false, message: "An error occurred" });
    }
});


app.listen(PORT, () => { console.log(`Server is started at ${PORT}`) })