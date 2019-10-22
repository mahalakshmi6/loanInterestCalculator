import React, { Component } from 'react';
import './LoanInterestCalculator.css';

export default class LoanCalculator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonValue: 'Calculate loan interest',
            inputAmountValueDisplay: '',
            inputAmountValue: 0,
            inputMonthValueDisplay: '',
            inputMonthValue: 0,
            showError: false,
            interestDetails: {},
            showCalculatedValues: false,
            previousCalculatedDetails: []
        }
    }
    calculateLoan = () => {
        if ((this.state.inputAmountValue >= 500 && this.state.inputAmountValue <= 5000) && (this.state.inputMonthValue >= 6 && this.state.inputMonthValue <= 24)) {
            this.setState({
                buttonValue: 'Calculating...'
            })
            let previousCalculatedDetails = this.state.previousCalculatedDetails
            var data = {
                amount: this.state.inputAmountValue,
                months: this.state.inputMonthValue
            }
            previousCalculatedDetails.push(data);
            this.setState({
                previousCalculatedDetails
            })
            fetch("https://ftl-frontend-test.herokuapp.com/interest?amount=" + this.state.inputAmountValue + "&numMonths=" + this.state.inputMonthValue, {
                method: "GET"
            }).then(res => res.json())
                .then((data) => {
                    this.setState({
                        interestDetails: data,
                        showCalculatedValues: true,
                        buttonValue: 'Calculate loan interest'
                    }, () => {
                        console.log(this.state.interestDetails)
                    })
                }).catch((err) => {
                    console.log(err)
                });
        } else {
            this.setState({
                showError: true
            })
        }
    }
    setLoanCalculation = (amount,months) => {
        var temp ="$ "+amount
        this.setState({
            inputAmountValue: amount,
            inputAmountValueDisplay: temp,
            inputMonthValue: months,
            inputMonthValueDisplay: months
        },() => {
            this.calculateLoan();
        })
    }
    checkAmount = (event) => {
        var inputValue = event.target.value;
        var temp = ''
        temp = inputValue
        this.setState({
            inputAmountValue: inputValue,
            inputAmountValueDisplay: temp
        })
    }
    checkMonths = (event) => {
        var inputValue = event.target.value;
        this.setState({
            inputMonthValue: inputValue,
            inputMonthValueDisplay: inputValue
        })
    }
    changeSlider = (event) => {
        var slider = document.getElementById("myRange");
        var inputValue = "$ " + slider.value
        this.setState({
            inputAmountValueDisplay: inputValue,
            inputAmountValue: slider.value
        })
    }
    render() {
        return (
            <div className="whole-container">
                <div className="loan-div">
                <div className="title" style={{borderBottom:"none"}}>Loan interest calculator</div>
                    <div className="loan-calculator-block">
                        {this.state.showError ? <div className="error-text">Entered values are invalid.Please Recheck !</div> : null}
                        <div className="each-div">
                            <div className="each-label">Enter the loan amount ($500 - $5000):</div>
                            <input className="each-input" value={`${this.state.inputAmountValueDisplay}`} onChange={this.checkAmount} type="text" placeholder="Enter the loan amount" ></input>
                            <input type="range" min="500" max="5000" onInput={this.changeSlider} className="slider" id="myRange"></input>
                        </div>
                        <div className="each-div">
                            <div className="each-label">Enter the loan duration (6 - 24 months) :</div>
                            <input className="each-input" value={this.state.inputMonthValueDisplay} onChange={this.checkMonths} type="text" placeholder="Enter the loan months" ></input>
                        </div>
                        <button className="calculate-button" onClick={this.calculateLoan}>{this.state.buttonValue}</button>
                        {this.state.showCalculatedValues ?
                            <div>
                                <div className="each-div">
                                    <div className="each-label">Interest Rate</div>
                                    <div className="each-value">{this.state.interestDetails.interestRate}</div>
                                </div>
                                <div className="each-div">
                                    <div className="each-label">Monthly Payment</div>
                                    <div className="each-value">$ {this.state.interestDetails.monthlyPayment.amount}</div>
                                </div>
                                <div className="each-div">
                                    <div className="each-label">No of Payments</div>
                                    <div className="each-value">{this.state.interestDetails.numPayments}</div>
                                </div>
                                <div className="each-div">
                                    <div className="each-label">Principal Amount</div>
                                    <div className="each-value">$ {this.state.interestDetails.principal.amount}</div>
                                </div>
                            </div>
                            : null}
                    </div>
                </div>
                <div className="previous-details">
                    {this.state.previousCalculatedDetails && this.state.previousCalculatedDetails.length > 0 ?
                        <div className="details-div">
                            <div className="title">Calculated History</div>
                            {this.state.previousCalculatedDetails.map((item, index) => {
                                return (
                                    <div className="each-history-div" onClick={this.setLoanCalculation.bind(this,item.amount,item.months)}>
                                        <div className="each-history-value">
                                            <div className="each-label">Loan Amount</div>
                                            <div className="each-value">$ {item.amount}</div>
                                        </div>
                                        <div className="each-history-value">
                                            <div className="each-label">Loan duration</div>
                                            <div className="each-value">{item.months} month(s)</div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        : null}
                </div>
            </div>
        )
    }
}