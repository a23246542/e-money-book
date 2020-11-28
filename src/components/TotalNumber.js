

const TotalNumber = ({income,outcome}) => {
  return (
    <ul className="row">
      <li className="col">收入:{income}</li>
      <li className="col">支出:{outcome}</li>
    </ul>
  )
}

export default TotalNumber;