import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  NavLink
} from 'react-router-dom'

import Home from '../pages/home/home'
import Settings from '../pages/settings/settings'
import About from '../pages/about/about'
import '../index.css';

class NavBar extends Component {
    render() {
        return (
            <Router>
                <div>
                    <nav className="navbar navbar-default">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse1" aria-expanded="false">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                            <NavLink className="navbar-brand" to="/">Music Mage</NavLink>
                        </div>

                        <div className="collapse navbar-collapse" id="navbar-collapse1">
                            <ul className="nav navbar-nav">
                                <li><NavLink exact activeClassName='activeNav' to='/'>Home</NavLink></li> 
                                <li><NavLink activeClassName='activeNav' to='/settings'>Settings</NavLink></li> 
                                <li><NavLink activeClassName='activeNav' to='/about'>About</NavLink></li> 
                            </ul>
                        </div>
                    </nav>

                    <Route exact path="/" component={Home}/>
                    <Route path="/settings" component={Settings}/>
                    <Route path="/about" component={About}/>
                </div>  
            </Router>      
        );
  }
}

export default NavBar