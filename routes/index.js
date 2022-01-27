
const fileRouter = require("./fileRouter");
const userRouter = require("./userRouter");
// const chatRouter = require("./chatRouter");

module.exports = function (app) {

    app.use("test", function (req, res){
        res.json("asdhasjhdjkashjdhasdhjkashdhasjkdhkasd")
        res.end()
    })
    app.use("/user", userRouter);
    app.use("/file", fileRouter);
    // app.use("/chat", chatRouter);
    
}
