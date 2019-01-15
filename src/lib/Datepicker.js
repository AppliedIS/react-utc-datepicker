import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as moment from 'moment';

import '../../node_modules/font-awesome/css/font-awesome.css';
import './Datepicker.css';

class DatePicker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showCalendar: false,
            days: [],
            dayNames: [],
            inputText: '', // keep track of the actual text of the input field
            tempDate: null, // moment object used for keeping track while cycling through months
            calendarTitle: '',
            calendarPosition: 'angular-utc-datepicker_below'
        };

        this._getMomentDate = this._getMomentDate.bind(this);
        this._generateCalendar = this._generateCalendar.bind(this);
        this._generateDayNames = this._generateDayNames.bind(this);
        this._openCalendar = this._openCalendar.bind(this);
        this._closeCalendar = this._closeCalendar.bind(this);
        this._prevMonth = this._prevMonth.bind(this);
        this._nextMonth = this._nextMonth.bind(this);
        this._selectDate = this._selectDate.bind(this);
        this._selectToday = this._selectToday.bind(this);
        this._keydown = this._keydown.bind(this);
        this._onDateChange = this._onDateChange.bind(this);
    }

    _getMomentDate(date) {
        if (!moment.utc(date, this.props.format).isValid()) {
            date = moment.utc().format(this.props.format);
        }
        return moment.utc(date, this.props.format);
    };

    _generateCalendar(date) {
        const days = [];

        const lastMonth = moment.utc(date).subtract(1, 'M'),
            nextMonth = moment.utc(date).add(1, 'M'),
            month = moment.utc(date).month() + 1,
            year = moment.utc(date).year(),
            firstWeekDay = 1 - moment.utc(date).startOf('M').isoWeekday(),
            totalDays = (42 + firstWeekDay) - 1; // 7 columns X 6 rows

        for (let i = firstWeekDay; i <= totalDays; i++) {
            if (i > 0 && i <= moment.utc(date).endOf('M').date()) {
                // current month
                days.push({
                    day: i,
                    month: month,
                    year: year,
                    enabled: 'react-utc-datepicker_enabled',
                    selected: moment.utc(this.props.date, this.props.format).isSame(moment.utc(year + '-' + month + '-' + i, 'YYYY-M-D'), 'day') ?
                        'react-utc-datepicker_selected' :
                        'react-utc-datepicker_unselected'
                });
            } else if (i > moment.utc(date).endOf('M').date()) {
                // next month
                days.push({
                    day: i - date.endOf('M').date(),
                    month: nextMonth.month() + 1,
                    year: nextMonth.year(),
                    enabled: 'react-utc-datepicker_disabled',
                    selected: 'react-utc-datepicker_unselected'
                });
            } else {
                // last month
                days.push({
                    day: lastMonth.endOf('M').date() - (0 - i),
                    month: lastMonth.month() + 1,
                    year: lastMonth.year(),
                    enabled: 'react-utc-datepicker_disabled',
                    selected: 'react-utc-datepicker_unselected'
                });
            }
        }

        this.setState({
            days: days
        });
    }

    _generateDayNames() {
        const dayNames = [];
        const date = moment('2017-04-02'); // sunday
        for (let i = 0; i < 7; i++) {
            dayNames.push(date.format('ddd'));
            date.add('1', 'd');
        }

        this.setState({
            dayNames: dayNames
        });
    }

    _openCalendar(event) {
        const rect = event.target.getBoundingClientRect();
        const calendarPosition = window.innerHeight - rect.bottom < 250 ?
            'react-utc-datepicker_above' :
            'react-utc-datepicker_below';
        this.setState({
            showCalendar: true,
            calendarPosition: calendarPosition
        }, () => {
            this._generateCalendar(this._getMomentDate(this.state.tempDate));
        });
    }

    _closeCalendar() {
        if (document.activeElement) {
            this.setState({
                showCalendar: document.activeElement.className.includes('react-utc-datepicker_calendar-popup') ||
                    document.activeElement.className.includes('react-utc-datepicker_input'),
                tempDate: this._getMomentDate(this.props.date)
            }, () => {
                if (!this.state.showCalendar) {
                    this.calendarTitle = this._getMomentDate(this.props.date).format('MMMM YYYY');
                    if (this.state.inputText && this.state.inputText !== this.props.date) {
                        this.el.nativeElement.value = this.props.date;
                    }
                }
            });
        }
    }

    _prevMonth() {
        const prev = moment.utc(this.state.tempDate).subtract(1, 'M');
        this.setState({
            tempDate: prev,
            calendarTitle: prev.format('MMMM YYYY')
        }, () => {
            this._generateCalendar(this.state.tempDate);
        });

    };

    _nextMonth() {
        const next = moment.utc(this.state.tempDate).add(1, 'M');
        this.setState({
            tempDate: next,
            calendarTitle: next.format('MMMM YYYY')
        }, () => {
            this._generateCalendar(this.state.tempDate);
        });
    };

    _selectDate(date) {
        const currDate = moment.utc(this.props.date, this.props.format);
        const selectedDate = moment.utc(`${date.year}-${date.month}-${date.day} ${currDate.hour()}:${currDate.minute()}:
            ${currDate.second()}`, 'YYYY-M-D HH:mm:ss');
        this.props.date = selectedDate.format(this.props.format);
        this.setState({
            tempDate: this._getMomentDate(this.props.date),
            calendarTitle: this.state.tempDate.format('MMMM YYYY'),
            showCalendar: false
        }, () => {
            this._generateCalendar(this.state.tempDate);
        });
    };

    _selectToday() {
        const today = moment.utc();
        const date = {
            day: today.date(),
            month: today.month() + 1,
            year: today.year(),
            enabled: 'react-utc-datepicker_enabled',
            selected: 'react-utc-datepicker_selected'
        };
        this._selectDate(date);
    };

    _keydown(event) {
        if (event.keyCode === 27) { // escape key
            this.setState({
                showCalendar: false
            });
        }
    };

    _onDateChange(value) {
        const isValid = moment.utc(value, this.props.format).format(this.props.format) === value;
        if (isValid) {
            this.setState({
                inputText: value,
                calendarTitle: moment.utc(value, this.format).format('MMMM YYYY')
            }, () => {
                this.props.date = value;
                this._generateCalendar(this._getMomentDate(value));
            });
        }
    };

    render() {
        const dayNameEls = [];
        this.state.dayNames.forEach((name, idx) => {
            dayNameEls.push(<div className="react-utc-datepicker_name" key={idx}>{name}</div>);
        });

        const dayEls = [];
        this.state.days.forEach((day, idx) => {
            dayEls.push(
                <div
                    className={`react-utc-datepicker_day ${day.selected} ${day.enabled}`}
                    onClick={() => this._selectDate(day)}
                    key={idx}
                >
                    {day.day}
                </div>
            );
        });

        const calendarPopupEl = this.state.showCalendar ?
            <div
                className={`react-utc-datepicker_calendar-popup ${this.state.calendarPosition}`}
                onBlur={this._closeCalendar}
                onKeyDown={this._keydown}
                tabIndex="0"
            >
                <div className="react-utc-datepicker_calendar-controls">
                    <div
                        className="react-utc-datepicker_prev"
                        onClick={this._prevMonth}
                        onKeyDown={this._keydown}
                    >
                        <i className="fa fa-arrow-left"/>
                    </div>
                    <div className="react-utc-datepicker_title">
                        {this.state.calendarTitle}
                        <span
                            className="react-utc-datepicker_today"
                            title="Today"
                            onClick={this._selectToday}
                            onKeyDown={this._keydown}
                        >
                                    <i className="fa fa-calendar-o"/>
                                </span>
                    </div>
                    <div
                        className="react-utc-datepicker_next"
                        onClick={this._nextMonth}
                        onKeyDown={this._keydown}
                    >
                        <i className="fa fa-arrow-right"/>
                    </div>
                </div>
                <div className="react-utc-datepicker_day-names">
                    {dayNameEls}
                </div>
                <div className="react-utc-datepicker_calendar">
                    {dayEls}
                    <div className="angular-utc-datepicker_clear"/>
                </div>
            </div> :
            null;


        return(
            <div className="react-utc-datepicker-container">
                <button
                    className="react-utc-datepicker_button"
                    onClick={this._openCalendar}
                    onBlur={this._closeCalendar}
                    onKeyDown={this._keydown}
                >
                    <i className="fa fa-calendar"/>
                </button>
                <input
                    ref={r => (this.el = r)}
                    className="react-utc-datepicker_input"
                    onChange={this._onDateChange}
                    onFocus={this._openCalendar}
                    onBlur={this._closeCalendar}
                    onKeyDown={this._keydown}
                    value={this.props.date}
                />
                <div className="react-utc-datepicker_datepicker">
                    {calendarPopupEl}
                </div>
            </div>
        )
    }
}

DatePicker.propTypes = {
    date: PropTypes.string,
    format: PropTypes.string
};

export default DatePicker;
