import {useState} from "react";
import Cropper, {Area} from "react-easy-crop";
import {Box, Button, HStack, VStack} from "@chakra-ui/react";
import {getCroppedImg} from "./CanvasUtils";

export interface CropProps {
    image: string,
    close: () => void,
    setNewImage: (blob: Blob) => void
}

export default function Crop(props: CropProps) {
    const [crop, setCrop] = useState({x: 0, y: 0})
    const [zoom, setZoom] = useState(1)
    const [initialCroppedArea, setInitialCroppedArea] = useState<Area | null>(null)
    const [croppedArea, setCroppedArea] = useState<Area | null>(null)
    const [cropSize, setCropSize] = useState({width: 0, height: 0})
    const [mediaSize, setMediaSize] = useState({
        width: 0,
        height: 0,
        naturalWidth: 0,
        naturalHeight: 0,
    })

    const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedArea(croppedAreaPixels)
        console.log(croppedAreaPixels)
    }

    const onDownload = (image: string, croppedArea: Area | null) => {
        if (croppedArea) {

        } else {
            console.log("null()")
        }
    };

    const showCroppedImage = async () => {
        try {
            if (croppedArea) {
                const croppedImage = await getCroppedImg(
                    props.image,
                    croppedArea,
                    0
                )

                if (croppedImage) {
                    props.setNewImage(croppedImage)
                }
            }
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <VStack width="100%" height="70%" alignContent={"inherit"}>
            <Box
                position={"absolute"}
                top={0}
                left={0}
                right={0}
                bottom={"80px"}
            >
                <Cropper
                    image={props.image}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    setMediaSize={setMediaSize}
                    setCropSize={setCropSize}
                />
            </Box>

            <HStack
                position={"absolute"}
                bottom={"20px"}
                left={"50%"}
                width={"100%"}
                transform={"translateX(-50%)"}
                height={"40px"}
                display={"flex"}
                justifyContent={"center"}
            >
                <Button
                    background={"#2d9d92"}
                    onClick={props.close}
                >
                    Закрыть
                </Button>
                <Button
                    background={"#2d9d92"}
                    onClick={() => {
                        showCroppedImage()
                        props.close()
                    }}
                >
                    Сохранить
                </Button>
            </HStack>
        </VStack>
    )
}