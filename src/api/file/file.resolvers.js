const { getUserId } = require("../../utils/getUserId");
const { getDateInNumbers } = require("../../utils/getDateInNumbers");
ObjectId = require("mongodb").ObjectID;
module.exports = {
  Query: {
    //FilesOld: (parent, args, ctx, info) => ctx.models.file.find({}),
    //Files should not expect organisation id to be passed into it,
    //it should get it from the user who should be logged in at this point.

    Files: async (parent, { data }, { req, models }, info) => {
      const userId = getUserId(req);
      const user = await models.user.findOne({ _id: userId });

      let { documentType, id, creatorId, fields } = data;

      if (user) {
        let mongooseFilter = {};
        mongooseFilter.organisationID = user.organisationID;

        if (documentType) {
          mongooseFilter.documentType = documentType;
        }
        if (id) {
          mongooseFilter._id = id;
        }
        if (fields) {
          console.log("fields is:", fields);

          mongooseFilter.fields = { $all: [] };

          let $eq, $lt, $gt, $lte, $gte;
          for (let index = 0; index < fields.length; index++) {
            const element = fields[index];
            console.log("st is:", element.searchType);
            let searchOperator = {};
            let arrayVals = element.value.split("|");
            switch (element.searchType) {
              case "equals":
                searchOperator = {
                  $elemMatch: {
                    key: element.key,
                    value: { $eq: element.value },
                  },
                };
                break;

              case "notEquals":
                searchOperator = {
                  $elemMatch: {
                    key: element.key,
                    value: { $neq: element.value },
                  },
                };
                break;

              case "lessThan":
                searchOperator = {
                  $elemMatch: {
                    key: element.key,
                    value: { $lt: element.value },
                  },
                };
                break;

              case "greaterThan":
                searchOperator = {
                  $elemMatch: {
                    key: element.key,
                    value: { $gt: element.value },
                  },
                };
                break;

              case "lessThanOrEqual":
                searchOperator = {
                  $elemMatch: {
                    key: element.key,
                    value: { $lte: element.value },
                  },
                };
                break;

              case "greaterThanOrEqual":
                searchOperator = {
                  $elemMatch: {
                    key: element.key,
                    value: { $gte: element.value },
                  },
                };
                break;

              case "in":
                searchOperator = {
                  $elemMatch: { key: element.key, value: { $in: arrayVals } },
                };
                break;

              case "notIn":
                searchOperator = {
                  $elemMatch: { key: element.key, value: { $nin: arrayVals } },
                };
                break;

              default:
                searchOperator = {
                  $elemMatch: {
                    key: element.key,
                    value: { $eq: element.value },
                  },
                };
                break;
            }

            mongooseFilter.fields.$all.push(searchOperator);
          }
        }
        if (creatorId) {
          mongooseFilter.creator = creatorId;
        }

        console.log("mongoosefilter: ", mongooseFilter);

        return models.file.find(mongooseFilter);
      } else throw new Error("Authentication Required");
    },

    File: async (parent, args, { req, models }, info) => {
      const userId = getUserId(req);
      const user = await models.user.findOne({ _id: userId });
      if (user) return models.file.findById(args.id);
      else throw new Error("Authentication Required");
    },
  },
  Mutation: {
    createFile: async (parent, args, { req, res, models }, info) => {
      const userId = getUserId(req);
      const user = await models.user.findOne({ _id: userId });
      const { documentType, filePath } = args.data;

      if (user) {
        const file = await models.file.create({
          creator: userId,
          organisationID: user.organisationID,
          documentType,
          fields: args.fields,
        });

        await file.uploadFileToAzure({
          imgPath: filePath,
          orgId: user.organisationID,
          docType: documentType,
        });

        return { file };
      } else if (!user) {
        throw new Error("Authentication Required");
      }
    },
    createFileS3: async (parent, args, ctx, info) => {
      console.log("args", args);

      const { folderId, storageType, filePath } = args.data;
      console.log("storageType", folderId);

      const userId = getUserId(ctx.req);
      const user = await ctx.models.user.findOne({ _id: userId });
      const folder = await ctx.models.folder.findOne({ _id: folderId });

      if (user && folder) {
        const file = await ctx.models.file.create({
          creator: userId,
          organisationID: user.organisationID,
          storageType,
          folderId,
          folderFields: args.fields,
          filePath,
        });

        // await file.uploadFileToAzure({
        //   imgPath: filePath,
        //   orgId: user.organisationID,
        //   docType: documentType,
        // });
        console.log("the file is ", file);
        return { file };
      } else if (!user || !folder) {
        throw new Error("Authentication Required");
      }
      return file;
    },
    updateFile: async (parent, args, { req, models }, info) => {
      const userId = getUserId(req);
      const user = await models.user.findOne({ _id: userId });
      const { _id, data, fields } = args;

      let changesMade = false;
      if (user) {
        let file = await models.file.findOne({ _id: _id });

        if (file.documentType != data.documentType) {
          changesMade = true;
          file.documentType = data.documentType;
        }

        fields.forEach((field) => {
          let fieldKey = file.fields.find((x) => x.key == field.key);

          if (fieldKey === undefined) {
            console.log(
              `Couldn't find ${field.key} so gonna add it to the file....`
            );
            changesMade = true;
            file.fields.push(field);
          } else {
            console.log(`Found the field named ${field.key}....`);
            if (fieldKey.value != field.value) {
              console.log(
                `Found the field named ${field.key} and the original value: ${fieldKey.value} and new value: ${field.value}  are different so gonna override it's value....`
              );
              changesMade = true;
              fieldKey.value = field.value;
            } else {
              console.log(
                `Found the field named ${field.key} but the original value: ${fieldKey.value} and new value: ${field.value} are the same so no changes`
              );
            }
          }
        });

        if (changesMade) file = file.save();

        return { file };
      } else {
        throw new Error("Authentication Required");
      }
    },

    deleteFile: async (parent, args, { req, models }, info) => {
      const userId = getUserId(req);
      const user = await models.user.findOne({ _id: userId });
      if (
        user /* && user.permissions.contains('candeletefiles') later on we will double check here that the user is allowed to delete this file.... */
      ) {
        const { id } = args;

        let deleteResponse = await models.file.deleteOne({ _id: id });

        let deleteResult = {
          deleteCount: deleteResponse.deletedCount,
          success:
            deleteResponse.ok == 1 && deleteResponse.deletedCount == 1
              ? "Success"
              : "Failed",
        };

        return deleteResult;
      }
    },
  },
};
