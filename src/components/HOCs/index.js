import React from "react";

import Loading from "../Loading";

export const withError = Component => ({ error, ...rest }) =>
  error ? (
    <div className="interactions">
      <p>Something went wrong.</p>
    </div>
  ) : (
    <Component {...rest} />
  );

export const withLoading = Component => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component {...rest} />;
