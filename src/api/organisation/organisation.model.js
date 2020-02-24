const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//const { hashPassword } = require("../../utils/hashPassword");
const organisationSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    active: Boolean
  },
  { timestamps: true }
);

//#region Static Methods
//Static methods do not require an instance of an organisation, just the schema. So we can't use an actual organisation to run these methods,
//but the graphql ctx object defines a schema for us to use static methods as well. This is a perfect example of when to use a static method anyway.

organisationSchema.statics.createNewOrganisation = async function(details) {
  //Declare a model of organisation.
  let Organisation = mongoose.model("Organisation", organisationSchema);
  //Create a new Organisation with data defined by the details passed.
  let newOrganisation = new Organisation({
    name: details.userData.name,
    active: true
  });

  //These are just return values to be assigned to.
  //Again, there must be a better way of doing this, I just don't know what that is yet.
  let organisation, adminUser;

  //Now we have an instance of an organisation, ask it to create an administrator for itself, with the method defined below
   await newOrganisation.createAdministrator({userSchema: details.userSchema, userData: details.userData})
      .then(async (createdUser) => {
        //If it does that succesfully, assign those values to the returning variables
          organisation = newOrganisation;
          adminUser = createdUser;
          //And because we used new instead of create, don't forget to save the document to the database
          newOrganisation.save();
      })
      .catch(err => {
        //Any hassle, throw the error up the chain so graphql displays whats wrong.
        console.log('err is ' + err);
        throw err;
      })

  //Error handling still required below, but need some study around best practice for this.
  return { organisation, adminUser };
};

//#endregion

//#region Instance Methods
organisationSchema.methods.createAdministrator = async function createAdministrator(
  data
) {
  //This is an instance method, so we have an organisation created, now we can call methods while referring to it with the "this" keyword.
  //Below is a breakdown of the variables passed into the method required.
  let { userSchema } = data;
  let { adminName, adminEmail, adminPassword } = data.userData;
  let newAdminUser;


  //Attempt to hash the password first, if successful, create the user and assign him an organisation id using "this._id"
  //await hashPassword(adminPassword).then(async (hashedPassword) => {
      await userSchema.create({
        name: adminName,
        password: adminPassword,
        email: adminEmail,

        //Set this organisations id to this user....
        organisationID: this._id
        })
        .then(newUser => {
          //assign variable to the newAdminUser 
          //ps, There must be a better way of doing this, like surely we should be able to return from this point...Need more research on promises
          //but for now it gets the code up and running.
          newAdminUser = newUser
        })
    //})
    .catch(err => {
      console.log('Overall error is: ', err);
      throw err;
    });
  //And return here.
  return newAdminUser;
};

//#endregion

//statis method to find organisation by name
organisationSchema.statics.findByName = (name, callback) => {

  let Organisation = mongoose.model("Organisation", organisationSchema);
  return Organisation.findOne(name, callback);
};

module.exports = mongoose.model("organisations", organisationSchema);
