import React, {Component} from 'react';
import {render} from 'react-dom';
import {ReactUTCDatepicker} from './lib';
import * as moment from 'moment';

class Index extends Component {
    constructor(props) {
        super(props);

        this.myFormat = 'YYYY-MM-DD HH:mm:ss[Z]';
        this.font = '\'Segoe UI\', \'Open Sans\', \'Helvetica Neue\', sans-serif';

        this.state = {
            date: moment.utc().format(this.myFormat)
        };

        this._changeDate = this._changeDate.bind(this);
    }

    _changeDate() {
        this.setState({
            date: moment.utc().format(this.myFormat)
        });
    }

    render() {
        return(
            <div style={{width: 640, margin: '15px auto', fontFamily: this.font, fontSize: '15px'}}>
                <h1>React UTC Datepicker</h1>
                <ReactUTCDatepicker date={this.state.date} format={this.myFormat} onChange={value => { console.log(value); }}/>
                <button type="button" onClick={this._changeDate}>Set date to now</button>
            </div>
        );
    }
}

render(<Index/>, document.getElementById('root'));
