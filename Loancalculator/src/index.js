import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LoanInterestCalculator from './LoanInterestCalculator';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<LoanInterestCalculator />, document.getElementById('root'));
serviceWorker.unregister();
