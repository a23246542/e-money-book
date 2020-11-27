import Ionicons from '../plugin/ionicons';

const PriceList = ({items, onModifyItem, onDeleteItem}) => {

  const { IosCreate, IosCloseCircle } = Ionicons;

  return (
    <ul className="list-group">
      {
        items.map(item => {

          // const {iconName:CategoryIcon} = item.category;//%%@@不行
          const CategoryIcon = Ionicons[item.category.iconName]
          return (
            <li className="list-group-item d-flex align-items-center"
              key={item.id}
            >
              <span className="col-1 badge badge-primary">
                <CategoryIcon/>
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
              <a className="col-1 d-flex justify-content-center align-items-center"
                // style={{backgroundColor:'#28a745'}}
                // onClick={onModifyItem(item)} //會傳直接執行的函式%%%
                onClick={()=>{onModifyItem(item)}}
              >
                <IosCreate
                  // icon="ios-create"
                  fontSize="35px"
                  color="#28a745"
                  style={{marginRight:'5px'}}
                />編輯
              </a>
              <a className="col-1 d-flex justify-content-center align-items-center"
                onClick={()=>{onDeleteItem(item)}}
              >
                <IosCloseCircle
                  // icon="ios-close-circle"
                  fontSize="30px"
                  color="#dc3545"
                  style={{marginRight:'5px'}}
                />
                刪除
              </a>
            </li>
          )
        })
      }
    </ul>
  )



}

export default PriceList;