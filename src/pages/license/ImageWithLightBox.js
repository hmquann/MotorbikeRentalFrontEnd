import React, { useState } from 'react';
import 'lightbox.js-react/dist/index.css'; // Import CSS cho lightbox

import {SlideshowLightbox} from 'lightbox.js-react'; 

function ImageWithLightbox({ imageSrc }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <img
                src={imageSrc}
                alt="Thumbnail"
                style={{
                    cursor: 'pointer',
                    width: '200px', // Chiều rộng của ảnh thumbnail
                    height: 'auto',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' // Hiệu ứng đổ bóng
                }}
                onClick={() => setIsOpen(true)}
            />
            {isOpen && (
                <SlideshowLightbox
                    images={[imageSrc]} // Truyền mảng chứa URL của hình ảnh
                    onCloseRequest={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}

export default ImageWithLightbox;
