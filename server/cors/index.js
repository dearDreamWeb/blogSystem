module.exports = app => {
    const cors = require("cors");
    const corsOptions = {
        origin: "http://localhost:8080",
        credentials: true
    }
    app.use(cors(corsOptions));
}