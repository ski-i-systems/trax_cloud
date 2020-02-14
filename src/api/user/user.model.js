const { hashPassword } = require("../../utils/hashPassword");
const { generateToken } = require("../../utils/generateToken");

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    organisationID: { type: Schema.Types.ObjectId, ref: 'Organisation' },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);

userSchema.statics.createNewUser = async function(userDetails) {
  //Declare a model of User.
  let User = mongoose.model('User', userSchema);
  const { name, email, organisationID, password } = userDetails;
  //Create a new User with data defined by the details passed.

  //organisationId can be garnered from the logged in user when we are passing it in the request object.
  //Not there at the moment so hardcoding here for the moment
  let organisationID = "5e42cb45c07da73d3c7dd4f4";
  
  let user = new User({ name, email, organisationID });
  
  await hashPassword(password).then( async hashedPass => {
    user.password = hashedPass;
    await user.save().then(usr => {
      user = usr;
    })
  }).catch(err => {
    throw new Error(err);
  });
  
  return { user, token: generateToken(user.id) };

};

module.exports = mongoose.model("users", userSchema);
