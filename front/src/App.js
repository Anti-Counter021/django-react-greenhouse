import {Switch, Route} from "react-router-dom";

import Home from "./components/home/home";
import Footer from "./components/footer/footer";
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
                <Route component={Home}/>
            </Switch>
            <Footer/>
        </div>
    );
}

export default App;
