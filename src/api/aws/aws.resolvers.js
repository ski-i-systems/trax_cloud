const { generateGetUrl, generatePutUrl } = require("../../awsPresigner");
module.exports = {
  Query: {
    URL: async (parent, args, { req, models }, info) => {
      const { filename } = args;
      const url = await generateGetUrl(filename);
      console.log(url);
      return {url};
    },
    //   //return urlResult;
    //   //const userId = getUserId(req);
    //   // const user = await models.user.findOne({ _id: userId });
    //   // if(user)
    //   //   return models.file.findById(args.id);
    //   // else
    //   //   throw new Error("Authentication Required");

    //   // const results = generateGetUrl("INVOICE.pdf")
    //   // .then((getURL) => {
    //   //   console.log(getURL);
    //   // })
    //   // .catch((err) => {
    //   //   console.log(err);
    //   // });
    // },
    // Filer: (parent,args,ctx,info) =>{
    //     console.log("in filer");
    //     return "hello"
    // }
  },
};
