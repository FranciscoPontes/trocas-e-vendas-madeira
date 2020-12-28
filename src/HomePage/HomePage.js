import React from 'react';
import Button from '../UI/Button';
import './HomePage.css';
import {connect} from 'react-redux';
import {tryLogin} from '../ReduxStore/reducer';

const HomePage = props => {

    const redirect = path => {
        props.history.replace(path);
    }

    return (
        <React.Fragment>

            <h4>This will be the home page, with the possibility to login or register</h4>
            <div className="homepage-buttons">
                { !props.user ? <Button color="primary" text="Login" className="buttons" click={props.login}/>
                : <React.Fragment>
                    <Button color="primary" text="Vender/Trocar" className="buttons" click={ () => redirect("/nova-venda")}/>
                    <Button color="secondary" text="Minhas trocas/vendas" className="buttons" click={ () => redirect("/minhas-vendas")}/>
                  </React.Fragment>
                 }
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}


const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch(tryLogin())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(HomePage);


