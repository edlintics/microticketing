import axios from "axios";
// logic to buil dand instance of axios that work on current env

export default function buildClient({ req }) {
  // desstrcturing the req of incoming request
  // Check the section of GetIntialProps called on browser or server

  if (typeof window === "undefined") {
    // window only exist the browser side
    // we are on the server
    // request should be made to http://ingress-nginx.ingress-nginx..hasgdj

    return axios.create({
      // create a preconfigured version of axios

      // typically we need to specify the header at here with the router
      // However, the req,header carry all the information of host and also with cookies, so we dont need to, we can console.log(req.header) to see all carried information
      baseURL: "'http://www.ticketing-dev-edlintics.xyz",
      headers: req.headers,
    });
    // Reaching out to http://SERVICENAME.NAMESPACE.svc.cluster.local/ROUTER
  } else {
    // we are on the browser!
    // reuests can be made with a base url of ''
    return axios.create({
      baseUrl: "/",

      // we dont need to worry about the cookies problem as the browser take care of it for us
    });
  }
}
