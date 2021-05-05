import React from 'react';
import {BrowserRouter as Router, Switch,Route} from "react-router-dom";
import { NotFound } from '../pages/404';
import { CreateAccount } from '../pages/create-account';
import { Login } from '../pages/login';

export const LoggedOutRouter = ()=> {

    return (
        <Router>
            <Switch>
                <Route path="/create-account">
                    <CreateAccount/>
                </Route>
                <Route path="/" exact>
                    {/* exact가 포함되어야지 /의 경로가 /에만 해당됨 */}
                    <Login/>
                </Route>
                <Route>
                    <NotFound/>
                </Route>
            </Switch>
        </Router>
    );
}