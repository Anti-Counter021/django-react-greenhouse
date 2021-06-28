import {Switch, Route} from "react-router-dom";

import Cart from "./components/cart/cart";
import Home from "./components/home/home";
import Login from "./components/login/login";
import Order from "./components/order/order";
import Logout from "./components/logout/logout";
import Footer from "./components/footer/footer";
import Register from "./components/register/register";
import Categories from "./components/categories/categories";
import ProductDetail from "./components/product_detail/product_detail";

import './App.scss';

function App() {
    return (
        <div className="App">
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
                <Route exact path='/cart' component={Cart}/>
                <Route exact path='/login' component={Login}/>
                <Route exact path='/logout' component={Logout}/>
                <Route exact path='/register' component={Register}/>
                <Route exact path='/order' component={Order}/>
                <Route component={Home}/>
            </Switch>
            <Footer/>
        </div>
    );
}

export default App;
