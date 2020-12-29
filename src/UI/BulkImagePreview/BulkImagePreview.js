import React, {useState} from 'react';
import Chip from '@material-ui/core/Chip';
import './BulkImagePreview.css';

const BulkImagePreview = props => {                        
    
    const [currentImage, setCurrentImage] = useState(props.bulkImages[0]);     
    
    const [currentIndex, setCurrentIndex] = useState(0);     
    
    const changeCurrentImage = position => {
        setCurrentImage(props.bulkImages[position]);
        setCurrentIndex(position);
    }

    const chipForImages = () => {

        return (
            <React.Fragment>
                <div className="preview-images">
                    <img src={currentImage} width="200px"/>
                    <div className="images-chips">
                        { props.bulkImages.map( ( value, index ) => <Chip label={index + 1} key={value} className={currentIndex === index ? "selected-chip" : "chips"} onClick={ () => changeCurrentImage(index) }/>) }
                    </div>
                </div>
            </React.Fragment>
        );
    }
    
    return props.bulkImages ? chipForImages() : null;
};

export default BulkImagePreview;