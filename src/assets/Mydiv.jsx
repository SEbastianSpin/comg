import React, { useRef, useState } from 'react';

function MyDiv({userImage}) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const divRef = useRef(null);
    const imgRef = useRef(null);

    function handleMouseMove(event) {
        const { clientX, clientY } = event;
        const { offsetLeft, offsetTop } = divRef.current;
        setPosition({ x: clientX - offsetLeft, y: clientY - offsetTop });
    }


    function handleClick(event) {
        const { clientX, clientY } = event;
        const { offsetLeft, offsetTop } = divRef.current;
        const clickPosition = { x: clientX - offsetLeft, y: clientY - offsetTop };
        alert(`Clicked at position (${clickPosition.x}, ${clickPosition.y})`);
      }

      function handleLoad() {
        const { naturalWidth, naturalHeight } = imgRef.current;
        divRef.current.style.width = `${naturalWidth}px`;
        divRef.current.style.height = `${naturalHeight}px`;
      }

      
    return (
        <div ref={divRef} onMouseMove={handleMouseMove}  onClick={handleClick} >
         
            <img src={userImage} className="ImagePreview"  onLoad={handleLoad}   >
            </img>
            {/* <p>Mouse position inside the div: {position.x}, {position.y}</p> */}
        </div>
    );
}

export default MyDiv;