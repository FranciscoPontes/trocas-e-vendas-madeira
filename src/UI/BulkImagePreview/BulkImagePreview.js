import React, {useState, useEffect} from 'react';
import Chip from '@material-ui/core/Chip';
import './BulkImagePreview.css';

const BulkImagePreview = props => {                        
    
    const [currentImage, setCurrentImage] = useState(props.bulkImages[0]);     
    
    const [currentIndex, setCurrentIndex] = useState(0);     
    
    const changeCurrentImage = position => {
        setCurrentImage(props.bulkImages[position]);
        setCurrentIndex(position);
    }

    const imageZoom = (imgID, resultID) => {
        let img, lens, result, cx, cy;
        img = document.getElementById(imgID);
        result = document.getElementById(resultID);
        /* Create lens: */
        lens = document.createElement("DIV");
        lens.setAttribute("class", "img-zoom-lens");
        /* Insert lens: */
        img.parentElement.insertBefore(lens, img);
        /* Calculate the ratio between result DIV and lens: */
        cx = result.offsetWidth / lens.offsetWidth;
        cy = result.offsetHeight / lens.offsetHeight;
        /* Set background properties for the result DIV */
        result.style.backgroundImage = "url('" + img.src + "')";
        result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
        /* Execute a function when someone moves the cursor over the image, or the lens: */
        lens.addEventListener("mousemove", moveLens);
        img.addEventListener("mousemove", moveLens);
        /* And also for touch screens: */
        lens.addEventListener("touchmove", moveLens);
        img.addEventListener("touchmove", moveLens);

        const moveLens = e => {
            let pos, x, y;
            /* Prevent any other actions that may occur when moving over the image */
            e.preventDefault();
            /* Get the cursor's x and y positions: */
            pos = getCursorPos(e);
            /* Calculate the position of the lens: */
            x = pos.x - (lens.offsetWidth / 2);
            y = pos.y - (lens.offsetHeight / 2);
            /* Prevent the lens from being positioned outside the image: */
            if (x > img.width - lens.offsetWidth) {x = img.width - lens.offsetWidth;}
            if (x < 0) {x = 0;}
            if (y > img.height - lens.offsetHeight) {y = img.height - lens.offsetHeight;}
            if (y < 0) {y = 0;}
            /* Set the position of the lens: */
            lens.style.left = x + "px";
            lens.style.top = y + "px";
            /* Display what the lens "sees": */
            result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
        }
    
        const getCursorPos = e => {
            let a, x = 0, y = 0;
            e = e || window.event;
            /* Get the x and y positions of the image: */
            a = img.getBoundingClientRect();
            /* Calculate the cursor's x and y coordinates, relative to the image: */
            x = e.pageX - a.left;
            y = e.pageY - a.top;
            /* Consider any page scrolling: */
            x = x - window.pageXOffset;
            y = y - window.pageYOffset;
            return {x : x, y : y};
        }

    }



    // useEffect( () => {
    //     imageZoom("myimage", "myresult");
    // });

    const chipForImages = () => {

        return (
            <React.Fragment>
                <div className="preview-images">
                    <img src={currentImage} width="200px" height="200px" id="img-to-zoom"/>
                    <div className="images-chips">
                        { props.bulkImages.map( ( value, index ) => <Chip label={index + 1} key={value + index} className={currentIndex === index ? "selected-chip" : "chips"} onClick={ () => changeCurrentImage(index) }/>) }
                    </div>
                    {/* <div class="img-zoom-container">
                        <img id="myimage" src="img_girl.jpg" width="300" height="240" alt="Girl" />
                        <div id="myresult" class="img-zoom-result"></div>
                    </div> */}
                </div>
            </React.Fragment>
        );
    }
    
    return props.bulkImages ? chipForImages() : null;
};

export default BulkImagePreview;