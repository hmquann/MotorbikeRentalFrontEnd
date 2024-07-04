// import React, { useState } from 'react';
// import Lightbox from 'react-image-lightbox';
// import 'react-image-lightbox/style.css';

// function ImageWithLightbox({ imageSrc }) {
//     const [isOpen, setIsOpen] = useState(false);

//     return (
//         <div>
//             <img
//                 src={imageSrc}
//                 alt="Thumbnail"
//                 style={{ cursor: 'pointer', width: '200px' }} 
//                 onClick={() => setIsOpen(true)}
//             />
//             {isOpen && (
//                 <Lightbox
//                     mainSrc={imageSrc}
//                     onCloseRequest={() => setIsOpen(false)}
//                 />
//             )}
//         </div>
//     );
// }

// export default ImageWithLightbox;