import React, { useState } from 'react';

function ImageUploader({ sendDataToParent }) {    
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');
 
    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length !== 4) {
            setError('Vui lòng đăng tải đủ 4 ảnh các góc độ chiếc xe của bạn.');
            setImages([]);  // Clear previous images if selection is invalid
            sendDataToParent([]);  // Send empty array to parent if invalid
        } else {
            setError('');
            const imageUrls = files.map((file) => URL.createObjectURL(file));
            setImages(imageUrls);
            sendDataToParent(files);  // Send the files to the parent component
        }
    };

    return (
        <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Hình ảnh</h2>
            <p className="text-zinc-600 dark:text-zinc-300 mt-2">
            Đăng 4 hình ở các góc độ khác nhau để tăng thông tin cho xe của bạn.
            </p>
            <div className="mt-4">
                <div className="w-full bg-zinc-100 dark:bg-zinc-700 rounded-lg flex flex-col items-center justify-center p-4">
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="hidden"
                        id="imageUpload"
                    />
                    <label
                        htmlFor="imageUpload"
                        className="bg-green-500 text-white py-2 px-4 rounded-lg cursor-pointer"
                    >
                        Chọn ảnh
                    </label>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
                {images.length === 4 && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {images.map((imageSrc, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={imageSrc}
                                    alt={`Uploaded Preview ${index + 1}`}
                                    className={`object-cover ${index === 0 ? 'w-full h-48' : 'w-full h-24'}`}
                                />
                                {index === 0 && <span className="absolute top-2 left-2 text-white bg-teal-500 p-1 text-sm rounded">Ảnh chính</span>}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ImageUploader;
