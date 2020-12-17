import { TYPE_OUTCOME, TYPE_INCOME } from './constants';


export const testTabs = [
  {
    text:'支出',
    value: TYPE_OUTCOME,
    iconName:'IosCard'
  },
  {
    text:'收入',
    value:TYPE_INCOME,
    iconName:'IosCash'
  },
  // {
  //   text:'其他',
  //   value:'other',
  //   iconName:'IosCash'
  // },
]

export const testCategories = [
  {
    "name": "旅行",
    "iconName": "IosPlane",
    "id": "1",
    "type": "outcome"
  },
  {
    "name": "餐饮",
    "iconName": "IosRestaurant",
    "id": "2",
    "type": "outcome"
  },
  {
    "name": "购物",
    "iconName": "IosBasket",
    "id": "3",
    "type": "outcome"
  },
  {
    "name": "数码",
    "iconName": "IosPhonePortrait",
    "id": "4",
    "type": "outcome"
  },
  {
    "name": "工资",
    "iconName": "IosCard",
    "id": "10",
    "type": "income"
  },
  {
    "name": "兼职",
    "iconName": "IosCash",
    "id": "11",
    "type": "income"
  },
  {
    "name": "理财",
    "iconName": "LogoYen",
    "id": "12",
    "type": "income"
  },
]

export const testItems = [
  {
    "title": "这是我的工资",
    "amount": 20000,
    "date": "2020-11-18",
    "monthCategory": "2020-11",
    "id": "_bd16bjeen",
    "cid": "2",
    "timestamp": 1534550400000
  },
  {
    "title": "和哥们一起喝酒",
    "amount": 300,
    "date": "2020-12-20",
    "monthCategory": "2020-12",
    "id": "_jjfice21k",
    "cid": "3",
    "timestamp": 1534723200000
  },
  {
    "title": "理财收入",
    "amount": 1000,
    "date": "2018-08-11",
    "monthCategory": "2018-8",
    "id": "_1fg1wme63",
    "cid": "11",
    "timestamp": 1533945600000
  },
  {
    "title": "理财收入",
    "amount": 300,
    "date": "2018-11-15",
    "monthCategory": "2018-11",
    "id": "_qryggm5y8",
    "cid": "12",
    "timestamp": 1534291200000
  },
  {
    "title": "请别人吃饭",
    "amount": 300,
    "date": "2020-12-15",
    "monthCategory": "2020-12",
    "id": "_qryggm511",
    "cid": "3",
    "timestamp": 1534291200000
  }
]
