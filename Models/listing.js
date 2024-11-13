const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  image: {
    type: {
      filename: { type: String, default: "defaultImage" },
      url: {
        type: String,
        default:
          "https://static.vecteezy.com/system/resources/previews/037/248/582/large_2x/ai-generated-travelling-to-thailand-advertisment-background-with-copy-space-free-photo.jpg",
      },
    },
    default: {
      filename: "defaultImage",
      url: "https://static.vecteezy.com/system/resources/previews/037/248/582/large_2x/ai-generated-travelling-to-thailand-advertisment-background-with-copy-space-free-photo.jpg",
    },
  },
  price: Number,
  location: String,
  country: String,
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
