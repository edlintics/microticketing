// This is the global css file, which is required lo load up when rendering any pages in the pages folder

// the file should named as "_app.js"
// any global css we need to import, it must be import in this file
// the import should be based on the directory of the file

import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";

import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};

// beware you need to add in the global, the getinitalprops in other files will not be triggered
AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);

  const { data } = await client.get("/api/users/currentuser");

  /* To solve the problem of when you render the getIntialProp globally but not in the single page, we need to to move the child page up to
  the global component server. the pageProps below give us access to the getIntialPageProp of what ever the child page we are rendering*/

  let pageProps = {};

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client,
      data.currentUser
    );
  } // pass this data down to the child pages

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;
