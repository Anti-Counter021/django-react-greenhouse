import {Switch, Route} from "react-router-dom";

import Cart from "./components/cart/cart";
import Home from "./components/home/home";
import Login from "./components/login/login";
import Order from "./components/order/order";
import Review from "./components/review/review";
import Logout from "./components/logout/logout";
import Footer from "./components/footer/footer";
import Profile from "./components/profile/profile";
import Register from "./components/register/register";
import Contacts from "./components/contacts/contacts";
import Categories from "./components/categories/categories";
import ProfileChange from "./components/profile_change/profile_change";
import ProductDetail from "./components/product_detail/product_detail";

import './App.scss';


function App() {

    const scrollWindow = () => {
        document.querySelector('#app').scrollIntoView();
    }

    return (
        <div className="App" id="app">
            <Switch>
                <Route path='/categories/:slug' render={
                    ({match}) => {
                        return <Categories slugCategory={match.params.slug}/>;
                    }
                }/>
                <Route exact path='/products/:slug' render={
                    ({match}) => {
                        return <ProductDetail slugProduct={match.params.slug}/>;
                    }
                }/>
                <Route exact path='/categories' component={Categories}/>
                <Route exact path='/contacts' component={Contacts}/>
                <Route exact path='/reviews' component={Review}/>
                <Route exact path='/cart' component={Cart}/>
                <Route exact path='/profile/change' component={ProfileChange}/>
                <Route exact path='/profile' component={Profile}/>
                <Route exact path='/login' component={Login}/>
                <Route exact path='/logout' component={Logout}/>
                <Route exact path='/register' component={Register}/>
                <Route exact path='/order' component={Order}/>
                <Route component={Home}/>
            </Switch>
            <Footer/>
            <div onClick={scrollWindow} className="anchor">
                <i className="fa fa-arrow-up" aria-hidden="true"/>
            </div>
        </div>
    );

}

export default App;
