
const fileRouter = require("./fileRouter");
const userRouter = require("./userRouter");
// const chatRouter = require("./chatRouter");

module.exports = function (app) {

    app.use("/user", userRouter);
    app.use("/file", fileRouter);
    // app.use("/chat", chatRouter);
    
}
