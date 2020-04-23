import ApolloBoost, { gql } from "apollo-boost";

const client = new ApolloBoost({
  uri: "http://localhost:7777"
});

const getUsers = gql`
  query {
    Users {
      name 
      email
    }
  }
`;
const getOrgs = gql`
  query {
    Organisations {
      name 
    }
  }
`;

client
  .query({
    query: getUsers
  })
  .then(response => {
    let html = "";
    response.data.Users.forEach(user => {
      html += `
        <div><h3>${user.name}</h3></div>
        `;
    });
    document.getElementById("users").innerHTML = html;
  });

client
  .query({
    query: getOrgs
  })
  .then(response => {
    let html = "";
    response.data.Organisations.forEach(org => {
      html += `
        <div>
            <h3>${org.name}</h3>
            </div>
        `;
    });
    document.getElementById("orgs").innerHTML = html;
  });
