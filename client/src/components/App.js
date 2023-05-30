import React from "react";
import "./App.css";
import {NavLink, BrowserRouter as Router, Route} from "react-router-dom";
import Home from "./Home";
import UserBin from "./my-bin";
import UserPosts from "./my-posts";
import NewImage from "./new-post";
import PopularImage from "./popularity";
import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
    ApolloProvider,
} from "@apollo/client";
const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
        uri: "http://localhost:4000",
    }),
});

function App() {
    return (
        <ApolloProvider client={client}>
            <Router>
                <div>
                    <header className='App-header'>
                        <h1 className='App-title'>Binterest</h1>
                        <nav>
                            <NavLink className='navlink' to='/'>
                                Images
                            </NavLink>
                            <NavLink className='navlink' to='/my-bin'>
                                My Bin
                            </NavLink>
                            <NavLink className='navlink' to='/my-posts'>
                                My Posts
                            </NavLink>
                            <NavLink className='navlink' to='/popularity'>
                                Popularity
                            </NavLink>
                        </nav>
                    </header>
                    <Route exact path='/' component={Home} />
                    <Route path='/my-bin/' component={UserBin} />
                    <Route path='/my-posts/' component={UserPosts} />
                    <Route path='/new-posts/' component={NewImage} />
                    <Route path='/popularity/' component={PopularImage} />
                </div>
            </Router>
        </ApolloProvider>
    );
}

export default App;
