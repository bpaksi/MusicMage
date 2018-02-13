import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Route,
    NavLink,
    Switch
} from 'react-router-dom'

import AlertStore from './stores/alertStore'
import './stores/socket'

import Home from './pages/home/home'
import About from './pages/about/about'
// import ArtistAll from './pages/artist/artistAll'
import Artist from './pages/artist/artist'
// import ArtistAlbum from './pages/artistAlbum/artistAlbum'
import NotFound from './pages/notFound/notFound'

import './index.css';

class App extends Component {

    componentWillMount() {
        AlertStore.on("change", () => {
            // toast = AlertStore.pop()
         })
     } 

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
                                <li><NavLink activeClassName='activeNav' to='/artists'>Artists</NavLink></li>
                                <li><NavLink activeClassName='activeNav' to='/about'>About</NavLink></li>
                            </ul>
                        </div>
                    </nav>
                    <div className="container-fluid">
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route exact path="/artists" component={Artist} />
                            <Route exact path="/artist/:artist" component={Artist} />
                            <Route exact path="/artist/:artist/:album" component={Artist} />
                            <Route exact path="/about" component={About} />
                            <Route component={NotFound} />
                        </Switch>
                    </div>
                </div>
            </Router>
        );
    }
}

// function test(toast) {
//     toastr.options = {
//         "closeButton": true,
//         "debug": false,
//         "newestOnTop": true,
//         "progressBar": true,
//         "positionClass": "toast-top-right",
//         "preventDuplicates": false,
//         "showDuration": "300",
//         "hideDuration": "1000",
//         "timeOut": 0,
//         "extendedTimeOut": 0,
//         "showEasing": "swing",
//         "hideEasing": "linear",
//         "showMethod": "fadeIn",
//         "hideMethod": "fadeOut",
//         "tapToDismiss": false
//     }

//     toastr[toast.type](toast.msg, toast.title);
// }

export default App