import React, { useEffect } from 'react';
import Button from '../UI/Button';
import './HomePage.css';
import {connect} from 'react-redux';
import * as ReducerAPI from '../ReduxStore/reducer';
import ImageCarousel from '../UI/ImageCarousel/ImageCarousel';

const HomePage = props => {

    const redirect = path => {
        props.history.replace(path);
    }

    useEffect( () => {
        if (props.user) props.fetchData(props.user.id);
    }, [props.user]);

    const generateSells = sells => sells.map( sell => <ImageCarousel key={sell.title} title={sell.title} description={sell.description} bulkImages={sell.imagesUrl}/>)

    return (
        <React.Fragment>
            <div className="homepage-content">
                <div className="homepage-buttons">
                    { !props.user ? <Button color="primary" text="Login" className="buttons" click={props.login}/>
                    : <React.Fragment>
                        <Button color="primary" text="Vender/Trocar" className="buttons" click={ () => redirect("/nova-venda")}/>
                        <Button color="secondary" text="Minhas trocas/vendas" className="buttons" click={ () => redirect("/minhas-vendas")}/>
                    </React.Fragment>
                    }
                </div>
                {/* <h4>TODO: <ul><li>Display content to users</li><li>Search</li><li>Add contact number + email</li><li>Image zoom</li></ul></h4> */}
                { props.otherSells ? generateSells( props.otherSells ) : null }
            </div>
        </React.Fragment>
    );
}

const mapStateToProps = state => {
    return {
        user: state.user,
        otherSells: state.otherSells
    }
}


const mapDispatchToProps = dispatch => {
    return {
        login: () => dispatch(ReducerAPI.tryLogin()),
        fetchData: (uId) => dispatch(ReducerAPI.fetchOtherSells(uId))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(HomePage);


