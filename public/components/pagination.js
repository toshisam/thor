import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
export default (props) => {
  const { location, app, page, totalCount, size, displayTotal} = props;
  const totalPages = Math.ceil(totalCount / size);

  function generateLink(page) {
    return {
      pathname: location.pathname,
      query: _.assign({}, location.query, { page })
    };
  }

  let prevPage = (<Link to={generateLink(page - 1)}><i className="fa fa-backward"></i></Link>);
  let nextPage = (<Link to={generateLink(page + 1)}><i className="fa fa-forward"></i></Link>);

  if (page === 1) {
    prevPage = (<span className="disabled"><i className="fa fa-backward"></i></span>);
  }

  if (totalPages === 1 || totalPages === page) {
    nextPage = (<span className="disabled"><i className="fa fa-forward"></i></span>);
  }

  return (
    <div className="rhythm-pagination">
      <div>
        { prevPage }
        <span className="totals">Displaying { page } of { totalPages }</span>
        { nextPage }
      </div>
      <div>{ totalCount } Total Results</div>
    </div>
  );
};
