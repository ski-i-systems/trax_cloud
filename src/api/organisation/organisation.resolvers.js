const { hashPassword } = require("../../utils/hashPassword");

module.exports = {
  Query: {
    Organisations: (parent, args, ctx, info) =>    {
       console.log('req is ' + ctx.req);   
      return ctx.models.organisation.find({})
    }
  },
  Mutation: {
    createOrganisation: async (parent, args, ctx, info) => {
      const { data } = args;

      let organisation, adminUser;

      console.log('1-Gonna try hash the password');
      await hashPassword(data.adminPassword)
      .then(async (hashedPassword) => {
        console.log('2-Gonna try to create the organisation seeing as we have the password hashed successfully');
        await ctx.models.organisation.create({
        name: data.name,
        active: true
        })
        .then(async (createdOrganisation) => {
          console.log('3-Gonna try create the admin user');
          await ctx.models.user.create({
          name: data.adminName,
          password: hashedPassword,
          email: data.adminEmail,
          //Set the organisation id to this user....
          organisationID: createdOrganisation._id
          }).catch(err => {
            console.log('Caught exception when creating admin user with err: ' + err);
            if(createdOrganisation != undefined)
              ctx.models.organisation.findOneAndDelete(createdOrganisation);
          })
          .then(async (createdUser) => {
            console.log('4')
            //Only return the objects if they were both successful. We are potentially
            //in here even if the create organisation failed, so check it before assigning it.
            if(createdOrganisation != undefined)
            {
              console.log('5')
              organisation = createdOrganisation;
              adminUser = createdUser;
            };
          })
          .catch(err => {
            console.log('Caught exception when creating user with err: ' + err);
            if(createdOrganisation != undefined)
              ctx.models.organisation.findOneAndDelete(createdOrganisation);
          })
        })
      })
      
      console.log('6')
      return {organisation, adminUser};
    }
  }
}