module.exports = {
  Query: {
    Organisations: (parent, args, ctx, info) => ctx.models.organisation.find({})
  },
  Mutation: {
    createOrganisation: async (parent, args, ctx, info) => {
      const { data } = args;

      let organisation;
      let adminUser;
       await ctx.models.organisation.create({
        name: data.name,
        active: true
      }).then(
        //First parameter in then function is a method hit IF previous call was success. It returns the created organisation in this case. Marked as org here.
         async (org) => {
        organisation = org;
        await ctx.models.user.create({
           name: data.adminName,
           password: data.adminPassword,
           email: data.adminEmail,
           //Set the organisation id to this user....
           organisationID: org._id
        }).then(async (success) => {
          //Nothing to do in here beyond potentially logging success. We reached this point becaue the user for this 
          // oganisation was successfully added and we can safely return the object. The object named "Success" is the adminUser
          adminUser = success;
        }, 
        //We will only fall in here if the create organisation method worked but the create admin user
        // failed for some reason. So Alert, log and delete the organisation so they can try again.
        reasonForUserCreationFailure => {
          console.log('We have a problem creating user for organisation');
          console.log('error message is : ' + reasonForUserCreationFailure.errmsg);  
          console.log('We should really roll back this whole operation then');
          
          ctx.models.organisation.deleteOne(organisation).then(
            (deleteSuccess) => {
              console.log('We have deleted that organisation now so you can try again.');
              console.log('delete success is ' + deleteSuccess);
            },
            (deleteFailure) => {
              console.log('We tried to delete the organisation there but something seems to have gone wrong...');
              console.log('delete failure is ' + deleteFailure);
            }
          );

          throw reasonForUserCreationFailure;

        })
      }, 


      //Second parameter in "then" function is a method hit IF previous call was a failure. 
      //It returns the reason why in this case
      reasonForOrganisationCreationFailure => {
        console.log('We have a problem creating organisation');
        console.log(reasonForOrganisationCreationFailure);
        throw reasonForOrganisationCreationFailure;
      })

      if(organisation != undefined && adminUser != undefined)
        console.log(`New organisation named "${organisation.name}" created at: ${ organisation.createdAt } with an admin named "${adminUser.name}" and password of "${adminUser.password}"`);
       
      return { organisation, adminUser };
    }
  }
};
