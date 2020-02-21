const mongoose = require("mongoose");
const Organisation = require('../api/organisation/organisation.model');
//let Organisation = mongoose.model("Organisation", organisationSchema);
const User = require('../api/user/user.model')
//let User = mongoose.model("User", userSchema);

const seedDatabaseWithTestData = async () => {
    //Declare a model of organisation.
    let orgNames = ["Apple","BMW","Chevrolet","Dell","EISystems","Facebook","Google","Honda","Intel","Java","Kellogs","LandRover","Mitsubishi","Nissan","Opel","Peugeot","QualityTractorParts",
    "Renault","Skoda","Toyota","Universal","Volkswagen","Wilson","Yahoo","Xerox"];

    let firstNames = ["Allison","Virgil","Joe","Andy","Trent","Fabinho","Jordan","James","Georginio","Roberto","Sadio","Mohamed"];

    
    orgNames.forEach(element => {
        console.log('element is ', element);
      //Create a new Organisation with data defined by the details passed.
      let newOrganisation = new Organisation({
        name: element,
        active: true
        });
        console.log('newOrg :', newOrganisation);

       newOrganisation.save().then(newOrg => {
            console.log('newOrg :', newOrg);
            let user = new User({
                organisationID: newOrg._id,
              name: "Jurgen",
              email: "Jurgen_admin@" + newOrg.name + ".ie",
              password: "12345678"
            });
            user.save().then((usr) => {
                console.log('adminUsr :', usr);
            }).then(() => {
                firstNames.forEach(name => {
                    let orguser = new User({
                        organisationID: newOrg._id,
                        name: name,
                        email: name + "@" + newOrg.name + ".ie",
                        password: "12345678"
                      });
                      orguser.save();
                })
            })
        })
      }
    )
  };

  const clearDatabase = async () => {
    Organisation.deleteMany({});
    User.deleteMany({});

  }

  module.exports = {seedDatabaseWithTestData, clearDatabase};