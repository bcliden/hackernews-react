import React from "react";
import classNames from "classnames";
import Button from "../Button";

const Sort = ({ sortKey, activeSortKey, isSortReverse, onSort, children }) => {
  const sortClass = classNames("button-inline", {
    "button-active": sortKey === activeSortKey
  });

  const iconClass = classNames(
    "fas",
    { "fa-arrow-down": isSortReverse },
    { "fa-arrow-up": !isSortReverse }
  );

  return (
    <React.Fragment>
      <Button onClick={() => onSort(sortKey)} className={sortClass}>
        {children}
      </Button>
      {sortKey === activeSortKey ? (
        <i className={iconClass} style={{ marginLeft: "0.5rem" }} />
      ) : null}
    </React.Fragment>
  );
};

export default Sort;
