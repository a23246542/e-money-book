const TotalNumber = ({ income, outcome }) => {
  return (
    <div className="container">
      <ul className="row justify-content-center">
        <li className="col-3">收入:{income}</li>
        <li className="col-3">支出:{outcome}</li>
      </ul>
    </div>
  );
};

export default TotalNumber;
