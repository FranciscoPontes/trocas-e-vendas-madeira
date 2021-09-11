import HomePage from "./HomePage/HomePage";
import NavBar from "./NavBar/NavBar";
import { Switch, Route, Redirect } from "react-router-dom";
import NovaVenda from "./NovaVenda/NovaVenda";
import { connect } from "react-redux";
import MySells from "./MySells/MySells";
import LeftNavigationBar from "./LeftNavigationBar/LeftNavigationBar";

export const routePaths = {
  HOME: "/",
  NOVA_VENDA: "/nova-venda",
  MINHAS_VENDAS: "/minhas-vendas",
  FAVORITOS: "/favoritos",
};

const App = (props) => {
  return (
    <div className="App">
      <NavBar />
      <LeftNavigationBar props={props} />
      <Switch>
        <Route path={routePaths.HOME} exact component={HomePage} />
        {props.user ? (
          <Switch>
            <Route path={routePaths.NOVA_VENDA} component={NovaVenda} />
            <Route
              path={routePaths.MINHAS_VENDAS}
              render={(props) => <MySells {...props} currentTab={0} />}
            />
            <Route
              path={routePaths.FAVORITOS}
              render={(props) => <MySells {...props} currentTab={1} />}
            />
          </Switch>
        ) : (
          <Redirect to={routePaths.HOME} />
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
