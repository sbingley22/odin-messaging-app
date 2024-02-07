const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
  firstname: { type: String, required: true, maxLength: 30 },
  lastname: { type: String, required: true, maxLength: 30 },
  about: { type: String, maxLength: 200 },
  interests: { type: String, maxLength: 200 },
  image: { data: Buffer, contentType: String }
})

// Save an image to the profile
ProfileSchema.methods.saveImage = function(imagePath, callback) {
  // Read the image file as binary data
  fs.readFile(imagePath, (err, data) => {
    if (err) {
      return callback(err);
    }
    // Set the image data and content type
    this.image.data = data
    this.image.contentType = 'image/jpeg'
    // Save the profile
    this.save(callback);
  });
};

module.exports = mongoose.model("Profile", ProfileSchema)