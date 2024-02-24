import {FC, useState} from "react";
import {Photo} from "../../api/model";
import {HStack, Image} from "@chakra-ui/react";
import {ArrowLeftIcon, ArrowRightIcon} from "@chakra-ui/icons";
import {image} from "../../api/Data";
import noImage from "../../assets/images/no-photo.png"

interface CarouselProps {
    images: Readonly<Photo[]>;
}

const Carousel: FC<CarouselProps> = ({images}) => {
    const [currentIndex, setCurrentIndex] = useState(0);

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

    return (
        <HStack position="relative" maxW={"100vw"} height={{base: "60vw", md: "30vw"}} width={"100%"} border={"1px"} borderColor={"telegram.100"}>
            <ArrowLeftIcon boxSize={5} onClick={handlePrevious} style={{position: "absolute", left: "10px"}}/>
            <Image src={images.length > 0 ? image(images[currentIndex].id) : noImage} borderRadius="10px" width="100%"
                   height="100%" objectFit="contain"/>
            <ArrowRightIcon boxSize={5} onClick={handleNext} style={{position: "absolute", right: "10px"}}/>
        </HStack>

    );
};
export default Carousel;
