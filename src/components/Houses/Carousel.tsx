import {FC, useState} from "react";
import {Photo} from "../../api/model";
import {Box, Button, Image} from "@chakra-ui/react";
import {image} from "../../api/Data";
import noImage from "../../assets/images/no-photo.png"
import left from "../../assets/left.png"
import right from "../../assets/right.png"

interface CarouselProps {
    images: Readonly<Photo[]>;
}

const Carousel: FC<CarouselProps> = ({images}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showFullScreen, setShowFullScreen] = useState(false);

    const handleNext = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex + 1 === images.length ? 0 : prevIndex + 1
        );
    };

    const handlePrevious = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const handleImageClick = () => {
        setShowFullScreen(true);
    };

    const handleCloseFullScreen = () => {
        setShowFullScreen(false);
    };

    return (
        <>
            <Box position="relative" maxW={"100vw"} height={{base: "60vw", lg: "30vw"}} width={"100%"}
                 marginBottom="8px" overflow="hidden">
                <Image
                    src={images.length > 0 ? image(images[currentIndex].id) : noImage}
                    height="100%"
                    width="100%"
                    objectFit="contain"
                    position="absolute"
                    top={0}
                    left={0}
                    zIndex={2}
                    onClick={handleImageClick}
                />

                <Image
                    src={images.length > 0 ? image(images[currentIndex].id) : noImage}
                    height="100%"
                    width="100%"
                    objectFit="cover"
                    position="absolute"
                    top={0}
                    left={0}
                    zIndex={1}
                    filter='auto'
                    blur='20px'
                />

                <Button
                    position="absolute"
                    top="50%"
                    left="0"
                    height="100%"
                    transform="translateY(-50%)"
                    zIndex={3}
                    onClick={handlePrevious}
                    backgroundColor="transparent"
                    width={{base: "10px", lg: "50px"}}
                    borderRadius={0}
                    padding={0}
                    _hover={{backgroundColor: "rgba(49, 49, 49, .3)"}}
                >
                    <Image src={left}/>
                </Button>
                <Button
                    position="absolute"
                    top="50%"
                    right="0"
                    height="100%"
                    transform="translateY(-50%)"
                    zIndex={3}
                    onClick={handleNext}
                    backgroundColor="transparent"
                    width={{base: "10px", lg: "50px"}}
                    borderRadius={0}
                    padding={0}
                    _hover={{backgroundColor: "rgba(49, 49, 49, .3)"}}
                >
                    <Image src={right}/>
                </Button>
            </Box>

            {showFullScreen && (
                <div
                    className="fullscreen-overlay active"
                    onClick={handleCloseFullScreen}
                >
                    <div className="fullscreen-image">
                        <img
                            className="centered-image"
                            src={images.length > 0 ? image(images[currentIndex].id) : noImage}
                            alt="Full Screen"
                        />
                    </div>
                </div>
            )}
        </>
    );
};
export default Carousel;

{
    /*<HStack
        position="relative"
        maxW={"100vw"}
        height={{base: "60vw", lg: "30vw"}}
        width={"100%"}
        justifyContent="space-evenly"
        spacing={0}
    >
        <Button
            boxSize={5}
            onClick={handlePrevious}
            height="100%"
            backgroundColor="white"
            minW="5%"
            width="5%"
            _hover={{backgroundColor: "white"}}
            _active={{backgroundColor: "white"}}
        >
            <ArrowLeftIcon color="black"/>
        </Button>

        {/!*<Image
                    src={images.length > 0 ? image(images[currentIndex].id) : noImage}
                    height="100%"
                    objectFit="contain"
                    minW="90%"
                    width="90%"
                    filter='auto'
                    blur='10px'
                    onClick={handleImageClick}
                />*!/}

        <Box position={"relative"} minW="90%" width="90%" height="100%">
            <Image
                src={images.length > 0 ? image(images[currentIndex].id) : noImage}
                height="100%"
                width="100%"
                objectFit="contain"
                position="absolute"
                top={0}
                left={0}
                zIndex={2}
                onClick={handleImageClick}
            />

            <Image
                src={images.length > 0 ? image(images[currentIndex].id) : noImage}
                height="100%"
                width="100%"
                objectFit="cover"
                position="absolute"
                top={0}
                left={0}
                zIndex={1}
                filter='auto'
                blur='5px'
            />
        </Box>

        <Button
            boxSize={5}
            onClick={handleNext}
            height="100%"
            backgroundColor="white"
            minW="5%"
            width="5%"
            _hover={{backgroundColor: "white"}}
            _active={{backgroundColor: "white"}}
        >
            <ArrowRightIcon color="black"/>
        </Button>
    </HStack>*/
}
