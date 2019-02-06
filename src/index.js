import React from 'react';
import {render} from 'react-dom';
import {ReactUTCDatepicker} from './lib';
import * as moment from 'moment';

const myFormat = 'YYYY-MM-DD HH:mm:ss[Z]';
const myDate = moment.utc().format(myFormat);
const font = '\'Segoe UI\', \'Open Sans\', \'Helvetica Neue\', sans-serif';
const App = () => (
    <div style={{width: 640, margin: '15px auto', fontFamily: font, fontSize: '15px'}}>
        <h1>React UTC Datepicker</h1>
        <ReactUTCDatepicker date={myDate} format={myFormat} onChange={value => { console.log(value); }}/>
    </div>
);

render(<App/>, document.getElementById('root'));
