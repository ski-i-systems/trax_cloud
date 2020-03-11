const mongoose = require("mongoose");
const Organisation = require("../api/organisation/organisation.model");
//let Organisation = mongoose.model("Organisation", organisationSchema);
const User = require("../api/user/user.model");
//let User = mongoose.model("User", userSchema);

<<<<<<< HEAD
const seedDatabaseWithTestData = () => {
  //Declare a model of organisation.
    let orgNames = ["Apple","BMW","Chevrolet","Dell","EISystems",/*"Facebook","Google","Honda","Intel","Java","Kellogs","LandRover","Mitsubishi","Nissan","Opel","Peugeot","QualityTractorParts",
"Renault","Skoda","Toyota","Universal","Volkswagen","Wilson","Yahoo","Xerox"*/];
=======
const seedDatabaseWithTestData = async () => {
  //Declare a model of organisation.
  let orgNames = [
    "Apple",
    "BMW" /*,"Chevrolet","Dell","EISystems","Facebook","Google","Honda","Intel","Java","Kellogs","LandRover","Mitsubishi","Nissan","Opel","Peugeot","QualityTractorParts",
"Renault","Skoda","Toyota","Universal","Volkswagen","Wilson","Yahoo","Xerox"*/
  ];
>>>>>>> 8f74919a6c540fb2cb51007cc6ed407f165329b4

  let firstNames = [
    "Allison",
    "Virgil",
    "Joe",
    "Andy",
    "Trent" /*,"Fabinho","Jordan","James","Georginio","Roberto","Sadio","Mohamed"*/
  ];

<<<<<<< HEAD
    return new Promise( function(resolve, reject) {
      try{
      orgNames.forEach(async element =>  {
        let newOrganisation = new Organisation({
          name: element,
          active: true
          });

          let newOrg = await newOrganisation.save(); 
          let user = new User({
            organisationID: newOrg._id,
            name: "Jurgen",
            email: "Jurgen_admin@" + newOrg.name + ".ie",
            password: "12345678"
          });

          let usr = await user.save();
          console.log('adminUsr :', usr);

          firstNames.forEach(async name => {
          let orguser = new User({
=======
  orgNames.forEach(async element => {
    console.log("element is ", element);
    //Create a new Organisation with data defined by the details passed.
    let newOrganisation = new Organisation({
      name: element,
      active: true
    });
    //console.log('newOrg :', newOrganisation);

    await newOrganisation.save().then(newOrg => {
      console.log("newOrg :", newOrg);
      let user = new User({
        organisationID: newOrg._id,
        name: "Jurgen",
        email: "Jurgen_admin@" + newOrg.name + ".ie",
        password: "12345678"
      });
      user
        .save()
        .then(async usr => {
          console.log("adminUsr :", usr);
        })
        .then(async () => {
          firstNames.forEach(async name => {
            let orguser = new User({
>>>>>>> 8f74919a6c540fb2cb51007cc6ed407f165329b4
              organisationID: newOrg._id,
              name: name,
              email: name + "@" + newOrg.name + ".ie",
              password: "12345678"
            });
<<<<<<< HEAD

            let u = await orguser.save();
            console.log(`username: ${u.name} added for org: ${newOrg.name}.`)
          })
        })

        resolve("Successfully Seeded Database");
      } catch (ex) {
        reject(ex);
      }
    })
  };

const clearDatabase = () => {
  console.log('I promise to clear database')
  return new Promise((resolve, reject) => {
    try{
      console.log('I promise to clear the users!')
      Organisation.deleteMany({});
    
      console.log('I promise to clear the users!')
      User.deleteMany({});
    
      console.log('I should have done my job by now.');
      resolve('all Deleted');
  } catch(err){
    console.log('the catcher caught it');
    reject(err);
  }
});
}

function sum(a, b) {
  // return new Promise(function(resolve, reject) {
  //   console.log('in ctor of promise....')
  //   if(a != null && b != null){
  //     console.log('about to resolve')
  //     resolve(a + b);
  //   } else {
  //     reject('must pass in numbers');
  //   }
  // })
  return (a + b);
}

function sumAsync(a, b) {
  return new Promise(function(resolve, reject) {
    if(a != null && b != null){
      console.log('about to resolve ', a , ' plus ', b);
      resolve(a + b);
    } else {
      reject('must pass in numbers');
    }
  })
}

  // const clearDatabase = async () => {
  //   await Organisation.deleteMany({}).then(async resp => {
  //     console.log(resp);
  //     await User.deleteMany({}).then(async deleted => {
  //       console.log(deleted);
  //       return;
  //     })
  //   });
  // }

  module.exports = {seedDatabaseWithTestData, clearDatabase, sum, sumAsync};
=======
            await orguser.save().then(u => {
              console.log(
                `username: ${u.name} , ${u.email} added for org: ${newOrg.name}.`
              );
            });
          });
        });
    });
  });
  console.log("should have left the adding part");
};

const clearDatabase = async () => {
  await Organisation.deleteMany({}).then(async resp => {
    //console.log(resp);
    await User.deleteMany({}).then(async deleted => {
      //console.log(deleted);
      return;
    });
  });
};

module.exports = { seedDatabaseWithTestData, clearDatabase };
>>>>>>> 8f74919a6c540fb2cb51007cc6ed407f165329b4
