const { hashPassword } = require("../../utils/hashPassword");
const { generateToken } = require("../../utils/generateToken");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    organisationID: { type: Schema.Types.ObjectId, ref: "Organisation" },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    active: Boolean
  },
  { timestamps: true }
);

userSchema.statics.createNewUser = async function(userDetails) {
  //Declare a model of User.
  let User = mongoose.model("User", userSchema);
  const { name, email, organisationID, password } = userDetails;
  //Create a new User with data defined by the details passed.

  //organisationId can be garnered from the logged in user when we are passing it in the request object.
  //Not there at the moment so hardcoding here for the moment

  let user = new User({ name, email, organisationID, active: true });

  await hashPassword(password)
    .then(async hashedPass => {
      user.password = hashedPass;
      await user.save().then(usr => {
        user = usr;
      });
    })
    .catch(err => {
      throw new Error(err);
    });

  return { user, token: generateToken(user.id) };
};

userSchema.statics.updateUser = async () => {
  
};


userSchema.statics.findUser = async (userId, callback) => {
  const user = mongoose.model("User", userSchema);
  return user.findOne({ _id: userId }, callback);
};
module.exports = mongoose.model("users", userSchema);
