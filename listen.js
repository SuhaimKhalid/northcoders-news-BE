const app = require("./api");

const { PORT = 9090 } = process.env;

app.listen(PORT, () => console.log(`Listening on ${PORT}...`));

// app.listen(9090, (err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Sever is Running!");
//   }
// });
