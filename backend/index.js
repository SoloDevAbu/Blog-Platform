const express = require("express");
const app = express();

const userRoute = require("./routes/user.routes");
const postRoute = require("./routes/post.routes");
const commentRoute = require("./routes/comment.routes");

app.use(express.json());

app.use("/user", userRoute);
app.use('/post', postRoute);
app.use('/comment', commentRoute);


app.listen(3000);