import {Component} from 'react';
import {browserHistory} from 'react-router';

export default class IsUserLoggedIn extends Component {
    constructor() {
        super();

        this.isLoggedIn = localStorage.getItem('isLoggedIn') == 'true' ? true : false;
    }

    componentDidMount() {
        if (!this.isLoggedIn) {
            browserHistory.replace("/login")
        }
    }

    render() {
        if (this.isLoggedIn) {
            return this.props.children
        } else {
            return null
        }
    }
}