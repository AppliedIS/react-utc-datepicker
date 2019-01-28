# React UTC Datepicker
A simple React datepicker component that exclusively uses UTC.

## Install
`npm install --save react-utc-datepicker`

## Dependencies
* React >= 16
* [MomentJS](http://momentjs.com)
* [Font Awesome](http://fontawesome.io)

## How to use
* `import {ReactUTCDatepicker} from 'react-utc-datepicker';`
* `format` option, for formatting date (and time, if necessary); defaults to `'YYYY-MM-DD'`. Uses [Moment](http://momentjs.com/docs/#/displaying/format/) formatting.
* `button` option, for showing/hiding a button which opens the calendar popup (defaults to `true`)
* `buttonPosition` option, possible values are `before` and `after` (defaults to `after`)

## Examples
```
<ReactUTCDatepicker date={myDate}/>
```
```
<ReactUTCDatepicker date={myDate} button={false}></utc-datepicker/>
```
```
<ReactUTCDatepicker date={myDate} buttonPosition="before" format="MM/DD/YYYY HH:mm:ss"/>
```
