import React from 'react'
import { BrowserRouter, Switch, Route,Redirect } from "react-router-dom";
import Home from './screen/Home';
import Editor from './screen/Editor';

export default function Routes() {
    return (
        <BrowserRouter>
        <Switch>
        <Route path="/" exact component={Home}/>
        <Redirect exact from="/editor" to="/" />
        <Route path="/editor/:editorId" component={Editor}/>
        </Switch>
        </BrowserRouter>
    )
}
