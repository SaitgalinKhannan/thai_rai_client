import React, {useState, ChangeEvent} from 'react';
import '../../App.css';
import {MdCloudUpload, MdDelete} from 'react-icons/md';
import {Image, SimpleGrid} from "@chakra-ui/react";

export type ImageInfo = {
    file: File;
    url: string;
};

type UploaderProps = {
    onImagesChange: (newImages: ImageInfo[]) => void;
    images: ImageInfo[];
};

function Uploader({onImagesChange, images: propImages}: Readonly<UploaderProps>) {
    const [images, setImages] = useState<ImageInfo[]>([]);
    const [fileNames, setFileNames] = useState<string[]>([]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files && files.length > 0) {
            const fileList = Array.from(files);

            const newImages = fileList.map((file) => ({
                file,
                url: URL.createObjectURL(file)
            }));

            setImages((prevImages) => [...prevImages, ...newImages]);
            setFileNames((prevFileNames) => [...prevFileNames, ...fileList.map((file) => file.name)]);
            onImagesChange([...images, ...newImages]);
        }
    };


    const handleDeleteClick = (index: number) => {
        setImages((prevImages) => {
            const newImages = [...prevImages];
            newImages.splice(index, 1);
            return newImages;
        });

        setFileNames((prevFileNames) => {
            const newFileNames = [...prevFileNames];
            newFileNames.splice(index, 1);
            return newFileNames;
        });
    };

    const handleFormClick = () => {
        const inputField = document.querySelector(".input-field") as HTMLInputElement | null;
        if (inputField) {
            inputField.click();
        }
    };

    return (
        <>
            <div className={"form"} onClick={handleFormClick}>
                <input
                    type="file"
                    accept="image/*"
                    className="input-field"
                    multiple
                    hidden
                    onChange={handleFileChange}
                />

                <MdCloudUpload color="#1475cf" size={60}/>
                <p>Browse Files to upload</p>
            </div>


            <SimpleGrid width={"100%"} minChildWidth='250px' spacing='10px'>
                {images.map((image, index) => (
                    <section className="uploaded_image">
                        <div className="image-container">
                            <Image
                                maxW={"250px"}
                                maxH={"300px"}
                                src={image.url} alt={`Uploaded Image ${index}`}
                            />
                        </div>
                        <div className="info-container">
                            {fileNames[index]}
                            <div className="delete-icon">
                                    <MdDelete onClick={() => handleDeleteClick(index)}/>
                            </div>
                        </div>
                    </section>
                ))}
            </SimpleGrid>
        </>
    );
}

export default Uploader;
