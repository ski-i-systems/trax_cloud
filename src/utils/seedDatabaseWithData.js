const mongoose = require("mongoose");
const Organisation = require('../api/organisation/organisation.model');
//let Organisation = mongoose.model("Organisation", organisationSchema);
const User = require('../api/user/user.model')
//let User = mongoose.model("User", userSchema);

const seedDatabaseWithTestData = async () => {
    //Declare a model of organisation.
    let orgNames = ["Apple","BMW","Chevrolet","Dell","EISystems",/*"Facebook","Google","Honda","Intel","Java","Kellogs","LandRover","Mitsubishi","Nissan","Opel","Peugeot","QualityTractorParts",
"Renault","Skoda","Toyota","Universal","Volkswagen","Wilson","Yahoo","Xerox"*/];

    let firstNames = ["Allison","Virgil","Joe","Andy"/*,"Trent","Fabinho","Jordan","James","Georginio","Roberto","Sadio","Mohamed"*/];

    
    orgNames.forEach(async element => {
        //console.log('element is ', element);
      //Create a new Organisation with data defined by the details passed.
      let newOrganisation = new Organisation({
        name: element,
        active: true
        });
        //console.log('newOrg :', newOrganisation);

       await newOrganisation.save().then(newOrg => {
            //console.log('newOrg :', newOrg);
            let user = new User({
                organisationID: newOrg._id,
              name: "Jurgen",
              email: "Jurgen_admin@" + newOrg.name + ".ie",
              password: "12345678"
            });
            user.save().then( async usr => {
                console.log('adminUsr :', usr);
            }).then(async () => {
                firstNames.forEach(async name => {
                    let orguser = new User({
                        organisationID: newOrg._id,
                        name: name,
                        email: name + "@" + newOrg.name + ".ie",
                        password: "12345678"
                      });
                      await orguser.save().then(u => {
                        console.log(`username: ${u.name} added for org: ${newOrg.name}.`)
                      });
                })
            })
        })
      }
    )
    console.log('should have left the adding part')
  };

  const clearDatabase = async () => {
    await Organisation.deleteMany({}).then(async resp => {
      console.log(resp);
      await User.deleteMany({}).then(async deleted => {
        console.log(deleted);
        return;
      })
    });
  }

  module.exports = {seedDatabaseWithTestData, clearDatabase};