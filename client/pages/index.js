import buildClient from "../api/build-client";

const LandingPage = function ({ currentUser }) {
  // reimplement currentUser from the getIntial prop
  return currentUser ? (
    <h1>You are signed in </h1>
  ) : (
    <h1> You are not signed in </h1>
  );
};

// This is the function run on serverside rendering, any data returned at here, we can use it in the function above

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context); // using the helper function in the api folder, where we perform all the logic for server side render or client render

  const { data } = await client.get("/api/users/currentuser");
  return data;
};

export default LandingPage;
