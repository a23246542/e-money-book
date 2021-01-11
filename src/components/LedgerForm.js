import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

// const LedgerForm = ({ledgerItem, onFormSubmit, onCancelSubmit}) => {
const LedgerForm = ({ledgerItem, onFormSubmit, onCancelSubmit, children}) => { //%%避免無傳入報錯
  //畫面表單
  const [ title, setTitle ] = React.useState( (ledgerItem&&ledgerItem.title)||'');
  const [ amount, setAmount ] = React.useState((ledgerItem&&ledgerItem.amount)||'');//@但其實是數字
  const [ date, setDate ] = React.useState((ledgerItem&&ledgerItem.date)||'');
  // const { title, amount, date } = ledgerItem;
  //畫面資料狀態
  const [ validatePass, setValidatePass ] = React.useState(true);
  const [ alertMessage, setAlertMessage ] = React.useState('');


  useEffect(() => {
    // if (ledgerItem.id) {
      console.log(ledgerItem,'ledgerFrom useEffect');
      setTitle(ledgerItem.title);
      setAmount(ledgerItem.amount);
      setDate(ledgerItem.date);
    // }
  },[ledgerItem])

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
    // const editMode = ledgerItem && !!ledgerItem.id;//%%%ledgerItem為{} 為true 傳後面變undefined
    const isEditMode = !!ledgerItem.id; //!!這樣就行
    // setTimeout(() =>{
      console.log('LedgerForm.js被觸發',title,amount,date,!!ledgerItem.id);
    // },1000)
    // console.log('submitForm的值',title,amount,date);
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
        if(isEditMode) {
          console.log('通過編輯模式');
          console.log(title,amount,date);//%%%旧资料
          // onFormSubmit(...ledgerItem,title,amount,date);//%% @@TypeError: ledgerItem is not iterable
          // setTimeout(()=>{
            onFormSubmit({...ledgerItem,title,amount,date}, isEditMode)
          // },1000)
        } else {
          console.log('通過創建模式');
          onFormSubmit({title,amount,date}, isEditMode);
        }
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
              <input type="text" className="form-control" id="inputTitle" data-testid="inputTitle" aria-describedby="emailHelp"
                value={title}
                onChange={(e)=>{setTitle(e.target.value.trim())}}
                // ref={(input) => {setTitle(input.current.value)}}//@@原本的操作
              />
              <small id="emailHelp" className="form-text text-muted">W'ell never share your email with anyone else.</small>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-2 col-form-label">
              <label htmlFor="inputAmount" className="text-nowrap">金額*:</label>
            </div>
            <div className="col-10">
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">$</span>
                </div>
                <input type="number" className="form-control" id="inputAmount" data-testid="inputAmount"
                  value={amount}
                  // onChange={(e)=>{setAmount(e.target.value.trim())}}
                  onChange={(e)=>{setAmount(e.target.value.trim()*1);console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa',e.target.value);}}//@@
                  // ref={(input) => {setAmount(input.current.value)}}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-2 col-form-label">
              <label htmlFor="inputDate" className="text-nowrap">日期*:</label>
            </div>
            <div className="col-10">
              <input type="date" className="form-control" id="inputDate" data-testid="inputDate"
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
        {/* { !validatePass&&alertMessage&& */}
        { !validatePass&&alertMessage&&
          <div className="alert alert-warning" role="alert">
            {alertMessage}
          </div>
        }
        {
          children
        }
        <button type="submit"
          id="submit" data-testid="submit"
          className="btn btn-primary mx-3"
          onClick={(e)=>{submitForm(e); console.log('bbbbbb');}}
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
  ledgerItem: PropTypes.object.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  onCancelSubmit: PropTypes.func.isRequired
}

export default LedgerForm
