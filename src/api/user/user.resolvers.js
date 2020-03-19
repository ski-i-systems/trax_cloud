const { hashPassword } = require("../../utils/hashPassword");
const { generateToken } = require("../../utils/generateToken");
const { getUserId } = require("../../utils/getUserId");
const bcrypt = require("bcryptjs");
module.exports = {
  Query: {
    //Get a single user by id, email or name
    //If it's by name, as it's not unique, the name should be accompanied by the users organisationId
    User: async (parent, args, ctx, info)  =>  { 
      let {data} = args;
      let {id, name, email} = data;
      let user;
      if(id == undefined){
        const userId = getUserId(ctx.req);
        user = await ctx.models.user.findUser(userId);        
      }

      let query;
      if(id){
        //Don't need organisation id here for the moment....
        query = { /*organisationID: user.organisationID,*/ _id: id };
      }
      else if(email){
          query = { /*organisationID: user.organisationID, */ email:email.toLowerCase() };
      }
      else if(name && user !== undefined){
        query = { organisationID: user.organisationID, name: name };
      }

      return ctx.models.user.findOne(query)
  },
    Users: async (parent, args, ctx, info) => {
      const userId = getUserId(ctx.req);
      const user = await ctx.models.user.findUser(userId);

      if(user)
        return ctx.models.user.find({organisationID : user.organisationID});
    }
    //usersByOrg: (parent,args,ctx,info) => ctx.models.user.find({organisationID:args.id})
  },
  Mutation: {
    createUser: async (parent, args, ctx, info) => {
      const { data } = args;
      const userId = getUserId(ctx.req);

      const user = await ctx.models.user.findUser(userId);

      if (user) {
        const newUser = {
          ...data,
          organisationID: user.organisationID
        };

        const userAndToken = await ctx.models.user.createNewUser(newUser);

        return userAndToken;
      }
    },
    loginUser: async (parent, args, ctx, info) => {
      const { email, password } = args.data;

      const user = await ctx.models.user.findOne({ email: email.toLowerCase() });

      if (!user) {
        throw new Error("unable to login");
      }
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new Error("unable to login user");
      }
      return {
        user,
        token: generateToken(user.id)
      };
    },
    updateUser: async (parent, args, ctx, info) => {
      let { data } = args;
      const userId = getUserId(ctx.req);

      //TODO Validate permissions here...
      if (userId) {
        return await ctx.models.user.updateUser(data);
      }
    },
    deleteUser: async (parent, args, ctx, info) => {
      let { data } = args;
      const userId = getUserId(ctx.req);
      //Should have a permissions check here along this chain....
      console.log("data is ", data);
      if (userId) {
        return await ctx.models.user.deleteUser(data.id);
      }
    }
  }
};
