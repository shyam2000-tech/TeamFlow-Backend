import app from "./app"
import { connectDB } from "./config/db";
import { ENV } from "./config/env";

connectDB();

const PORT = ENV.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});