import React from 'react';
import UserStore from '../stores/UserStore.js';
import LoginForm from './LoginForm';
import SubmitButton from './SubmitButton';
import { observer } from 'mobx-react';
import './Login.css';

class Login extends React.Component {
    async componentDidMount() {
        try {
            let res = await fetch('/isLoggedIn', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            let result = await res.json();
            if (result && result.success) {
                UserStore.loading = false;
                UserStore.isLoggedIn = true;
                UserStore.username = result.username;
            }
            else {
                UserStore.loading = false;
                UserStore.isLoggedIn = false
            }
        } catch (e) {
            UserStore.loading = false;
            UserStore.isLoggedIn = false
        }
    }

    async doLogout() {
        try {
            let res = await fetch('/logout', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            let result = await res.json();
            if (result && result.success) {
                UserStore.isLoggedIn = false;
                UserStore.username = '';
            }
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        if (UserStore.loading) {
            return (
                <div className='login'>
                    <div className='container'>
                        Loading, please wait...
                    </div>
                </div>
            );
        }
        else {
            if (UserStore.isLoggedIn) {
                return (
                    <div className='login'>
                        <div className='container'>
                            Welcome {UserStore.username}
                            <SubmitButton
                                text={'Log out'}
                                disabled={false}
                                onClick={() => this.doLogout()}
                            />
                        </div>
                    </div>
                );
            }
        }
        return (
            <div className='login'>
                <div className='container'>
                    <h2>Login</h2>
                    <hr />
                    <LoginForm />
                </div>
                <p>No account yet? Register it <a href='/register'>here</a>.</p>
            </div>
        );
    }
}

export default observer(Login);
