

const PriceList = ({items, onModifyItem, onDeleteItem}) => {

  return (
    <ul className="list-group">
      {
        items.map(item => (
          <li className="list-group-item d-flex align-items-center"
            key={item.id}
          >
            <span className="col-1 badge badge-primary">
              {item.category.name}
            </span>
            {/* <span className="col-11 bg-primary"></span> */}
            <span className="col-5">{item.title}</span>
            <span className="col-2 font-weight-bold">
              {/* {item.category.type === 'income'?
                `${item.price}元`:
                `-${item.price}元`
              } */}
              {(item.category.type === 'income') ? '+' : '-'}
              {item.price}元
            </span>
            <span className="col-2">{item.date}</span>
            <button className="col-1 btn btn-primary"
              // onClick={onModifyItem(item)} //會傳直接執行的函式%%%
              onClick={()=>{onModifyItem(item)}}
            >編輯</button>
            <button className="col-1 btn btn-danger"
              onClick={()=>{onDeleteItem(item)}}
            >刪除</button>
          </li>
        ))
      }
    </ul>
  )



}

export default PriceList;