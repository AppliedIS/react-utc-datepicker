import React from 'react';
import {render} from 'react-dom';
import {Datepicker} from './lib';
import * as moment from 'moment';

const format = 'YYYY-MM-DD HH:mm:ss[Z]';
const date = moment.utc().format(format);
const App = () => (
    <div style={{width: 640, margin: '15px auto'}}>
        <h1>Hello React</h1>
        <Datepicker date={date} format={format}/>
    </div>
);

render(<App/>, document.getElementById('root'));
