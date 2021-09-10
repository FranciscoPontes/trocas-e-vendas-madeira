import HomePage from "./HomePage/HomePage";
import NavBar from "./NavBar/NavBar";
import { Switch, Route, Redirect } from "react-router-dom";
import NovaVenda from "./NovaVenda/NovaVenda";
import { connect } from "react-redux";
import MySells from "./MySells/MySells";
import { LeftNavigationBar } from "./LeftNavigationBar/LeftNavigationBar";

export const routePaths = {
  NOVA_VENDA: "/nova-venda",
  MINHAS_VENDAS: "/minhas-vendas",
};

const App = (props) => {
  return (
    <div className="App">
      <NavBar />
      <LeftNavigationBar props={props} />
      <Switch>
        <Route path="/" exact component={HomePage} />
        {props.user ? (
          <Switch>
            <Route path="/nova-venda" component={NovaVenda} />
            <Route path="/minhas-vendas" component={MySells} />
          </Switch>
        ) : (
          <Redirect to="/" />
        )}
      </Switch>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(App);
