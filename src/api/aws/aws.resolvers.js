const { generateGetUrl, generatePutUrl } = require("../../awsPresigner");
const { getUserId } = require("../../utils/getUserId");

module.exports = {
  Query: {
    URL: async (parent, args, { req, models }, info) => {
      const { filename } = args;
      const url = await generateGetUrl(filename);
      console.log(url);
      return { url };
    },
    PUTURL: async (parent, args, ctx, info) => {
      console.log("args", args);
      // const file = args.data;
      // const contentType = file.type;
      const { data } = args;
      const userId = getUserId(ctx.req);
      const user = await ctx.models.user.findOne({ _id: userId });
      let URLS = [];
      if (user) {
        //const putURL = await generatePutUrl(file.name, contentType);
        // console.log("the puturl", putURL);

        data.map((file) => {
          const putURL = generatePutUrl(file.name, file.type);
          file.url = putURL;
          URLS.push(file);
        });
      }

      return URLS;
      // const options = {
      //   params: {
      //     Key: file.name,
      //     ContentType: contentType,
      //   },
      //   headers: {
      //     "Content-Type": contentType,
      //   },
      // };
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
