import axios from "axios";
import { useState } from "react";

function useRequest({ url, method, body, onSuccess }) {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    // in the parameter introduce props so we can optionally add in more information to send to the api
    try {
      setErrors(null); // make the errors disappear
      // exuture if it is successul, status 200
      const response = await axios[method](url, { ...body, ...props });

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      // execute if there is errors, status 400
      setErrors(
        <div className="alert alert-danger">
          <h4>Oops....</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
}

export default useRequest;
