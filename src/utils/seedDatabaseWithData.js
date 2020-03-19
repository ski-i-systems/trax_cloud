const mongoose = require("mongoose");
const Organisation = require("../api/organisation/organisation.model");
//let Organisation = mongoose.model("Organisation", organisationSchema);
const User = require("../api/user/user.model");
const File = require("../api/file/file.model");
//let User = mongoose.model("User", userSchema);

const seedDatabaseWithTestData = async () => {
  //Declare a model of organisation.
    let orgName = "EISystems";

  let firstNames = [
    "Eoin",
    "Tom",
    "Dariusz",
    "Rory",
    "Fergal"
  ];

  return createOrganisation(orgName, firstNames);
};

  const createOrganisation = (orgName, people ) => {
    return new Promise( function (resolve, reject) {
    try {
      let newOrganisation = new Organisation({
      name: orgName,
      active: true
    });

      newOrganisation.save().then(newOrg => {
        let user = new User({
          organisationID: newOrg._id,
          name: "Paul McInerney",
          email: "paulmc@" + newOrg.name + ".ie",
          password: "12345678"
        });
  
        user.save().then(async usr => {
          addPeopleToOrganisation(newOrg, people).then(res => {
            resolve(`Successfully added the Organisation ${orgName}`);
          })
        });
      })
    }
    catch(err) {
      reject(`Some thing went wrong while creating organisation, ${err}`)
    }
  }
)};

const addPeopleToOrganisation = async (organisation, people) => {
  return new Promise(function(resolve, reject){
    people.forEach(async (name, index, array) => {
    let orguser = new User({
        organisationID: organisation._id,
        name: name,
        email: name + "@" + organisation.name + ".ie",
        password: "12345678"
      });

      let u = await orguser.save();
      console.log(`username: ${u.name} added for org: ${organisation.name}.`)

      if(index === array.length -1){
        resolve(`SUCCESS - All users added to ${organisation.name}`);
      }
    })
   })

}

const clearDatabase = () => {
  return new Promise((resolve, reject) => {
    try{
      Organisation.deleteMany({}).then(() => {
        User.deleteMany({}).then(() => {
          File.deleteMany({}).then(() => {
            resolve('All deleted!');
          });
        });
      });
    } catch(err){
      console.log('the cleardatabase catcher caught it', err);
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
