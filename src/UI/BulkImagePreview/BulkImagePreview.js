import React, {useEffect, useState} from 'react';
import Chip from '@material-ui/core/Chip';
import './BulkImagePreview.css';
import { connect } from 'react-redux';

const BulkImagePreview = props => {                        
    
    const [currentImage, setCurrentImage] = useState(props.bulkImages[0]);     
    
    const [currentIndex, setCurrentIndex] = useState(0);     
    
    const [ imageExpand, setImageExpand] = useState( false );

    const changeCurrentImage = position => {
        setCurrentImage(props.bulkImages[position]);
        setCurrentIndex(position);
    }

    const chipForImages = () => {

        return (
            <React.Fragment>
                <div className="preview-images">
                    <img alt="selected" className={ imageExpand ? "img-clicked" : ""} src={currentImage} width="200px" height="200px" id="img-to-zoom" onClick={ () => setImageExpand( !imageExpand ) }/>
                    <div className="images-chips">
                        { props.bulkImages.map( ( value, index ) => <Chip label={index + 1} key={value + index} className={currentIndex === index ? "selected-chip" : "chips"} onClick={ () => changeCurrentImage(index) }/>) }
                    </div>
                </div>
            </React.Fragment>
        );
    }
    
    return props.bulkImages ? chipForImages() : null;
};

const mapStateToProps = state => {
    return {
        searching: state.searching,
        userId: state.user.id
    }
}

export default connect(mapStateToProps)(BulkImagePreview);