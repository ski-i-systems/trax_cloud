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

  let emailLower = email.toLowerCase();

  let user = new User({ name, emailLower, organisationID, active: true });

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
userSchema.statics.findUser = async (userId, callback) => {
  const user = mongoose.model("User", userSchema);
  return user.findOne({ _id: userId }, callback);
};
userSchema.statics.updateUser = async data => {
  let UserModel = mongoose.model("User", userSchema);

  if (data.password) {
    passResult = await hashPassword(data.password);
    data = {
      ...data,
      password: passResult
    };
  }

  if (data.email) {
    data = {
      ...data,
      email: data.email.toLowerCase()
    };
  }
  console.log("here is finshed data", data);
  return await UserModel.findOneAndUpdate(
    { _id: data.id },
    data,
    { upsert: false, new: true },
    async (err, User) => {
      if (err) return err;
      console.log("user is " + User);
    }
  );

  // console.log("User", User);

  // return User;
};

userSchema.statics.deleteUser = async userId => {
  let UserModel = mongoose.model("User", userSchema);
  let deletedUser = await UserModel.findUser(userId);
  if (deletedUser) {
    //update this to updateandremove
    await UserModel.findByIdAndRemove(userId, function(err, doc) {
      if (err) return err;

      console.log("doc is : " + doc);
    });
  }
  return deletedUser;
};

module.exports = mongoose.model("users", userSchema);
