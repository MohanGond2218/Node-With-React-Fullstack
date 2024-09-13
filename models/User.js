const mongoose = require("mongoose");
const { ServerApiVersion } = require("mongodb");
const keys = require("../config/keys");

const uri = keys.mongoURI;

// Step 1: Connect to MongoDB using Mongoose
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  })
  .then(() => {
    console.log("Successfully connected to MongoDB via Mongoose!");
  })
  .catch((err) => {
    console.error("Connection error", err);
  });

// Step 2: Define a schema
const userSchema = new mongoose.Schema({
  googleId: String, // This is where you store the Google User ID
});

// Create a model for the schema
const User = mongoose.model("users", userSchema);

// Step 3: Function to save a new user to MongoDB
async function saveUser(googleId) {
  try {
    // Check if the user already exists in the database
    let user = await User.findOne({ googleId });

    if (user) {
      console.log("User already exists:", user);
      return user; // Return the existing user
    }

    // If user doesn't exist, create and save a new user
    const newUser = new User({ googleId });
    const result = await newUser.save();
    console.log("New user saved to MongoDB:", result);
    return result;
  } catch (error) {
    console.error("Error saving user:", error);
    throw error;
  }
}

// Export the User model and saveUser function
module.exports = {
  User,
  saveUser,
};
