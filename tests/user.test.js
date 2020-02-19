require("cross-fetch/polyfill");
const ApolloBoost = require("apollo-boost").default;
const gql = require("graphql-tag").default


const client = new ApolloBoost({
  uri: "http://localhost:7777"
});

test("should create new user", async () => {
  const getUsers = gql`
    query{
  Users{
    name
    id
  }
}
  `;
  const response = await client.query({
    query: getUsers
  });
  expect(response.data.Users[1].name).toBe("Anna")
});
