import React, { useState, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import style from './style.module.scss';

const LedgerFormComponent = ({
  ledgerItem = {},
  onFormSubmit,
  onCancelSubmit,
  children,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [formValidate, setFormValidate] = useState({
    validatePass: true,
    alertMessage: '',
  });

  useEffect(() => {
    if (!ledgerItem.id) {
      return;
    }
    setTitle(ledgerItem.title);
    setAmount(ledgerItem.amount.toString());
    setDate(ledgerItem.date);
  }, [ledgerItem.id, ledgerItem.title, ledgerItem.amount, ledgerItem.date]);

  const isValidDate = (inputDate) => {
    const nowTimeStamp = new Date().getTime();
    const selectTimeStamp = new Date(inputDate).setHours(0, 0, 0, 0);
    return selectTimeStamp <= nowTimeStamp;
  };

  const submitForm = (e) => {
    e.preventDefault();
    const isEditMode = !!ledgerItem.id;
    const amountNumber = Number(amount);
    if (title && amount && date) {
      if (amountNumber < 0) {
        setFormValidate({
          validatePass: false,
          alertMessage: '數字不能為負',
        });
      } else if (!isValidDate(date)) {
        setFormValidate({
          validatePass: false,
          alertMessage: '不能選擇未來的日期',
        });
      } else {
        setFormValidate({
          validatePass: true,
          alertMessage: '',
        });
        if (isEditMode) {
          onFormSubmit(
            {
              ...ledgerItem,
              title,
              amount: amountNumber,
              date,
            },
            isEditMode
          );
          setTitle('');
          setAmount('');
          setDate('');
        } else {
          onFormSubmit(
            {
              title,
              amount: amountNumber,
              date,
            },
            isEditMode
          );
          setTitle('');
          setAmount('');
          setDate('');
        }
      }
    } else {
      setFormValidate({
        validatePass: false,
        alertMessage: '表格不能為空',
      });
    }
  };

  const cancelSubmit = (e) => {
    e.preventDefault();
    onCancelSubmit();
  };

  return (
    <div className="container" data-testid="LedgerForm">
      <form className="pt-5 px-2">
        <div className="form-group">
          <div className="row">
            <div className="col-2 col-form-label">
              <label htmlFor="inputTitle" className="text-nowrap">
                標題*:{' '}
              </label>
            </div>
            <div className="col-10">
              <input
                type="text"
                className="form-control"
                id="inputTitle"
                data-testid="inputTitle"
                aria-describedby="emailHelp"
                value={title || ''}
                onChange={(e) => {
                  setTitle(e.target.value.trim());
                }}
              />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-2 col-form-label">
              <label htmlFor="inputAmount" className="text-nowrap">
                金額*:
              </label>
            </div>
            <div className="col-10">
              <div className={`${style.inputAmount} input-group`}>
                <div className="input-group-prepend">
                  <span className="input-group-text">$</span>
                </div>
                <input
                  type="number"
                  className="form-control"
                  id="inputAmount"
                  data-testid="inputAmount"
                  value={amount || ''}
                  onChange={(e) => {
                    setAmount(e.target.value.trim().toString());
                  }} //@@
                />
              </div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col-2 col-form-label">
              <label htmlFor="inputDate" className="text-nowrap">
                日期*:
              </label>
            </div>
            <div className="col-10">
              <input
                type="date"
                className="form-control"
                id="inputDate"
                data-testid="inputDate"
                value={date || ''}
                onChange={(e) => {
                  setDate(e.target.value.trim());
                }}
                // ref={(input) => {setDate(input.current.value)}}
              />
            </div>
          </div>
        </div>
        {!formValidate.validatePass && (
          <div className="alert alert-warning" role="alert">
            {formValidate.alertMessage}
          </div>
        )}
        {children}
        <button
          type="submit"
          id="submit"
          data-testid="submit"
          className="btn btn-primary mx-3"
          onClick={submitForm}
        >
          提交
        </button>
        <button
          type="button"
          id="cancel"
          data-testid="cancel"
          className="btn btn-primary mx-3"
          onClick={(e) => {
            cancelSubmit(e);
          }}
        >
          取消
        </button>
      </form>
    </div>
  );
};

LedgerFormComponent.propTypes = {
  ledgerItem: PropTypes.object,
  onFormSubmit: PropTypes.func.isRequired,
  onCancelSubmit: PropTypes.func.isRequired,
};

export const LedgerForm = memo(LedgerFormComponent);
