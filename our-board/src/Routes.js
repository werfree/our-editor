import React from 'react'
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from './screen/Home';
import Editor from './screen/Editor';

export default function Routes() {
    return (
        <BrowserRouter>
        <Switch>
        <Route path="/" exact component={Home}/>
        <Route path="/editor" exact component={Editor}/>
        </Switch>
        </BrowserRouter>
    )
}
