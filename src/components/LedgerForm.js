import React, { useState } from 'react'
import PropTypes from 'prop-types'

const LedgerForm = ({ledgerItem, onFormSubmit, onCancelSubmit}) => {
  //畫面表單
  const [ title, setTitle ] = useState(()=>ledgerItem.title||'');
  const [ amount, setAmount ] = useState(()=>ledgerItem.price||'');//@但其實是數字
  const [ date, setDate ] = useState(()=>ledgerItem.date||'');
  //畫面資料狀態
  const [ validatePass, setValidatePass ] = useState(false);
  const [ alertMessage, setAlertMessage ] = useState('');

  const isValidDate = (inputDate) => {
    const nowTimeStamp = new Date();
    const selectTimeStamp = Date.parse(inputDate);
    return selectTimeStamp <= nowTimeStamp;
    // date.split('-')
  }

  const submitForm = (e) =>{
    e.preventDefault();
    // if(title.trim()==='') {
    // }
    console.log('submitForm的值',title,amount,date);
    if( title && amount && date ) {
      if(amount<0) {
        setValidatePass(false);
        setAlertMessage('數字不能為負');
      } else if (!isValidDate(date)) {
        setValidatePass(false);
        setAlertMessage('不能選擇未來的日期');
      } else {
        setAlertMessage('');
        setValidatePass(true);
        onFormSubmit();
        console.log('通過');
      }
    } else {
      setValidatePass(false);
      setAlertMessage('表格不能為空!');
      console.log('不通過');
    }
  }

  const cancelSubmit = (e) => {
    e.preventDefault();
    onCancelSubmit();
  }
  return (
    //!需要改input閉合 className htmlFor
    <div className="container">

      <form className="pt-5 px-2">
        <div className="form-group">
          <div className="row">
            <div className="col-2 col-form-label">
              <label htmlFor="inputTitle" className="text-nowrap">標題*: </label>
            </div>
            <div className="col-10">
              <input type="text" className="form-control" id="inputTitle" aria-describedby="emailHelp"
                value={title}
                onChange={(e)=>{setTitle(e.target.value.trim())}}
                // ref={(input) => {setTitle(input.current.value)}}//@@原本的操作
              />
              <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-2 col-form-label">
              <label htmlFor="inputAmount" className="text-nowrap">金額*:</label>
            </div>
            <div className="col-10">
              <input type="number" className="form-control" id="inputAmount"
                value={amount}
                // onChange={(e)=>{setAmount(e.target.value.trim())}}
                onChange={(e)=>{setAmount(e.target.value.trim()*1)}}//@@
                // ref={(input) => {setAmount(input.current.value)}}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-2 col-form-label">
              <label htmlFor="inputDate" className="text-nowrap">日期*:</label>
            </div>
            <div className="col-10">
              <input type="date" className="form-control" id="inputDate"
                value={date}
                onChange={(e)=>{setDate(e.target.value.trim())}}
                // ref={(input) => {setDate(input.current.value)}}
              />
            </div>
          </div>
        </div>
        {/* <div className="form-group form-check">
          <input type="checkbox" className="form-check-input" id="inputDate"/>
          <label className="form-check-label" for="exampleCheck1">Check me out</label>
        </div> */}
        { !validatePass&&alertMessage&&
          <div className="alert alert-warning" role="alert">
            {alertMessage}
          </div>
        }
        <button type="submit"
          id="submit"
          className="btn btn-primary mx-3"
          onClick={(e)=>{submitForm(e)}}
        >
          提交
        </button>
        <button type="button" id="cancel" 
          className="btn btn-primary mx-3"
          onClick={(e)=>{cancelSubmit(e)}}
        >取消</button>
      </form>
    </div>
  )
}

LedgerForm.propTypes = {

}

export default LedgerForm
