import {
    Box, Button,
    Checkbox,
    Heading,
    Input, NumberDecrementStepper, NumberIncrementStepper,
    NumberInput, NumberInputField, NumberInputStepper,
    Select,
    Stack, Text,
    Textarea, ToastId, useToast
} from "@chakra-ui/react";
import React, {useContext, useState} from "react";
import {BuildingType, RealEstateDto, Status, statusMapping} from "../../api/model";
import Uploader, {ImageInfo} from "../Images/Uploader";
import {realEstateById, uploadNewHouse} from "../../api/Data";
import {useNavigate} from "react-router-dom";
import {ThaiRaiContext} from "../../context/HouseProvider";

export default function NewHouseDetails() {
    let [name, setName] = React.useState('');
    let [price, setPrice] = React.useState(0);
    let [status, setStatus] = React.useState(statusMapping[Status.RENT]);
    let [newBuilding, setNewBuilding] = React.useState(false);
    let [type, setType] = React.useState('');
    let [roomCount, setRoomCount] = React.useState(0);
    let [area, setArea] = React.useState(0);
    let [description, setDescription] = React.useState('');
    let [constructionYear, setConstructionYear] = React.useState(0);
    let [floor, setFloor] = React.useState(0);
    let [numberOfFloors, setNumberOfFloors] = React.useState(0);
    let [region, setRegion] = React.useState('');
    let [district, setDistrict] = React.useState('');
    let [regionInCity, setRegionInCity] = React.useState('');
    let [street, setStreet] = React.useState('');
    let [index, setIndex] = React.useState('');
    let [houseNumber, setHouseNumber] = React.useState('');
    let [images, setImages] = React.useState<ImageInfo[]>([]);
    let [isUploaded, setUploaded] = useState(false);
    let [realEstateId, setRealEstateId] = useState<number | null>(null);
    let [buttonText, setButtonText] = useState("Опубликовать");
    let context = useContext(ThaiRaiContext);
    let toast = useToast()
    let toastIdRef = React.useRef<ToastId>()
    let navigate = useNavigate();

    const handleImagesChange = (newImages: ImageInfo[]) => {
        setImages(newImages);  // Update images state
    };

    const publishButtonClick = async () => {
        if (isUploaded && realEstateId != null) {
            realEstateById(realEstateId)
                .then(realEstate => {
                    context.setHouses(Array.of(realEstate))
                })
            navigate(`/property-details/${realEstateId}`)
            return
        }

        const userId = localStorage.getItem('userId')
        if (userId === null) {
            toast({
                title: 'Авторизуйтесь!',
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top'
            })
        } else {
            if (name.trim() === '' || status.trim() === '' || type.trim() === '' || region.trim() === '' || district.trim() === '' || regionInCity.trim() === '' || index.trim() === '' || houseNumber.trim() === '' || description.trim() === '') {
                toast({
                    title: 'Заполните все поля!',
                    status: 'error',
                    duration: 500,
                    isClosable: true,
                    position: 'top'
                })
            } else {
                let realEstate: RealEstateDto = {
                    ownerId: parseInt(userId),
                    name: name,
                    price: price,
                    status: status,
                    newBuilding: newBuilding,
                    type: type,
                    roomCount: roomCount,
                    area: area,
                    description: description,
                    constructionYear: constructionYear,
                    floor: floor,
                    numberOfFloors: numberOfFloors,
                    address: {
                        country: "Тайланд",
                        region: region,
                        district: district,
                        regionInCity: regionInCity,
                        street: street,
                        index: index,
                        houseNumber: houseNumber
                    }
                }

                toastIdRef.current = toast({
                    title: 'Загрузка.',
                    description: "Загружаем данные на сервер.",
                    status: 'loading',
                    isClosable: true,
                    position: 'top'
                })

                await uploadNewHouse(realEstate, images)
                    .then(it => {
                            if (toastIdRef.current) {
                                toast.update(toastIdRef.current, {
                                    title: 'Готово.',
                                    description: "Объявление успешно загружено.",
                                    status: 'success',
                                    duration: 1000,
                                    isClosable: true,
                                    position: 'top'
                                })
                            }
                            setUploaded(true)
                            setRealEstateId(it)
                            setButtonText("Перейти к объявлению")
                        }
                    ).catch(e => {
                            if (toastIdRef.current) {
                                toast.update(toastIdRef.current, {
                                    title: 'Ошибка.',
                                    description: "Не удалось загрузить данные.",
                                    status: 'error',
                                    duration: 1000,
                                    isClosable: true,
                                    position: 'top'
                                })
                            }
                            console.log(e)
                        }
                    )
            }
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedStatus = Object.values(Status).find(value => value === e.target.value);

        if (selectedStatus) {
            setStatus(selectedStatus.toString());
        }
    }

    return (
        <>
            <Stack direction={{base: 'column', md: 'row'}} justify='space-between' align={{md: 'center'}}
                   my='24px'>
                <Box width={{base: "100%", md: "100%"}}>
                    <Heading fontSize={{base: "18px", md: "22px"}} color='telegram.700'>Название:</Heading>
                    <Input
                        onChange={e => setName(e.target.value)}
                        background={"#fff"}
                    ></Input>
                </Box>

                <Box width={{base: "100%", md: "50%"}}>
                    <Heading fontSize={{base: "18px", md: "22px"}} color='telegram.700'>Продажа/Аренда:</Heading>
                    <Select
                        defaultValue={statusMapping[Status.RENT]}
                        onChange={() => handleChange}
                        background={"#fff"}
                    >
                        <option value={statusMapping[Status.RENT]}>{Status.RENT}</option>
                        <option value={statusMapping[Status.SALE]}>{Status.SALE}</option>
                    </Select>
                </Box>

                <Box width={{base: "100%", md: "50%"}}>
                    <Heading fontSize={{base: "18px", md: "22px"}} color='telegram.700'>Тип здания:</Heading>
                    <Select
                        placeholder='Тип здания:'
                        onChange={e => setType(e.target.value)}
                        background={"#fff"}
                    >
                        {Object.values(BuildingType).map(name => <option key={name} value={name}>{name}</option>)}
                    </Select>
                </Box>

                <Box width={{base: "100%", md: "50%"}}>
                    <Heading fontSize={{base: "18px", md: "22px"}} color='telegram.700'>Цена:</Heading>
                    <NumberInput
                        size='md'
                        defaultValue={0}
                        min={0}
                    >
                        <NumberInputField
                            background={"#fff"}
                            onChange={e => setPrice(parseFloat(e.target.value))}
                        />
                    </NumberInput>
                </Box>
            </Stack>

            <Stack direction={{base: 'column', md: 'row'}} justify='space-between' align={{md: 'center'}} my='24px'>
                <Box width={{base: "100%", md: "100%"}}>
                    <Heading fontSize={{base: "18px", md: "22px"}} color='telegram.700'>Провинция:</Heading>
                    <Input
                        onChange={e => setRegion(e.target.value)}
                        background={"#fff"}
                    ></Input>
                </Box>

                <Box width={{base: "100%", md: "100%"}}>
                    <Heading fontSize={{base: "18px", md: "22px"}} color='telegram.700'>Район:</Heading>
                    <Input
                        onChange={e => setDistrict(e.target.value)}
                        background={"#fff"}
                    ></Input>
                </Box>

                <Box width={{base: "100%", md: "100%"}}>
                    <Heading fontSize={{base: "18px", md: "22px"}} color='telegram.700'>Тамбон:</Heading>
                    <Input
                        onChange={e => setRegionInCity(e.target.value)}
                        background={"#fff"}
                    ></Input>
                </Box>
                <Box width={{base: "100%", md: "100%"}}>
                    <Heading fontSize={{base: "18px", md: "22px"}} color='telegram.700'>Улица:</Heading>
                    <Input
                        onChange={e => setStreet(e.target.value)}
                        background={"#fff"}
                    ></Input>
                </Box>
                <Box width={{base: "100%", md: "50%"}}>
                    <Heading fontSize={{base: "18px", md: "22px"}} color='telegram.700'>Индекс:</Heading>
                    <Input
                        onChange={e => setIndex(e.target.value)}
                        background={"#fff"}
                    ></Input>
                </Box>
                <Box width={{base: "100%", md: "50%"}}>
                    <Heading fontSize={{base: "18px", md: "22px"}} color='telegram.700'>Дом:</Heading>
                    <Input
                        onChange={e => setHouseNumber(e.target.value)}
                        background={"#fff"}
                    ></Input>
                </Box>
            </Stack>

            <Stack direction={{base: 'column', md: 'row'}} width={{base: "100%", md: "100%"}} justify='space-between'
                   align={{md: 'center'}} my='24px'>
                <Box width={{base: "100%", md: "100%"}}>
                    <Heading fontSize={{base: "18px", md: "22px"}} color='telegram.700'>Кол-во комнат:</Heading>
                    <NumberInput
                        size='md'
                        defaultValue={roomCount}
                        min={0}
                    >
                        <NumberInputField
                            onChange={e => setRoomCount(parseInt(e.target.value))}
                            background={"#fff"}
                        />
                        <NumberInputStepper>
                            <NumberIncrementStepper onClick={() => setRoomCount(roomCount + 1)}/>
                            <NumberDecrementStepper onClick={() => setRoomCount(roomCount - 1)}/>
                        </NumberInputStepper>
                    </NumberInput>
                </Box>

                <Box width={{base: "100%", md: "100%"}}>
                    <Heading fontSize={{base: "18px", md: "22px"}} color='telegram.700'>Площадь:</Heading>
                    <NumberInput
                        size='md'
                        defaultValue={area}
                        min={0}
                    >
                        <NumberInputField
                            onChange={e => setArea(parseFloat(e.target.value))}
                            background={"#fff"}
                        />
                        <NumberInputStepper>
                            <NumberIncrementStepper onClick={() => setArea(area + 1)}/>
                            <NumberDecrementStepper onClick={() => setArea(area - 1)}/>
                        </NumberInputStepper>
                    </NumberInput>
                </Box>

                <Box width={{base: "100%", md: "100%"}}>
                    <Heading fontSize={{base: "18px", md: "22px"}} color='telegram.700'>Этаж:</Heading>
                    <NumberInput
                        size='md'
                        defaultValue={floor}
                        min={0}
                    >
                        <NumberInputField
                            onChange={e => setFloor(parseInt(e.target.value))}
                            background={"#fff"}
                        />
                        <NumberInputStepper>
                            <NumberIncrementStepper onClick={() => setFloor(floor + 1)}/>
                            <NumberDecrementStepper onClick={() => setFloor(floor - 1)}/>
                        </NumberInputStepper>
                    </NumberInput>
                </Box>

                <Text></Text>

                <Box width={{base: "100%", md: "100%"}}>
                    <Heading fontSize={{base: "18px", md: "22px"}} color='telegram.700'>Всего этажей:</Heading>
                    <NumberInput
                        size='md'
                        defaultValue={numberOfFloors}
                        min={0}
                    >
                        <NumberInputField
                            onChange={e => setNumberOfFloors(parseInt(e.target.value))}
                            background={"#fff"}
                        />
                        <NumberInputStepper>
                            <NumberIncrementStepper onClick={() => setNumberOfFloors(numberOfFloors + 1)}/>
                            <NumberDecrementStepper onClick={() => setNumberOfFloors(numberOfFloors - 1)}/>
                        </NumberInputStepper>
                    </NumberInput>
                </Box>

                <Box width={{base: "100%", md: "100%"}}>
                    <Heading fontSize={{base: "18px", md: "22px"}} color='telegram.700'>Год постройки:</Heading>
                    <NumberInput
                        size='md'
                        defaultValue={constructionYear}
                        min={0}
                    >
                        <NumberInputField
                            onChange={e => setConstructionYear(parseInt(e.target.value))}
                            background={"#fff"}
                        />
                        <NumberInputStepper>
                            <NumberIncrementStepper onClick={() => setConstructionYear(constructionYear + 1)}/>
                            <NumberDecrementStepper onClick={() => setConstructionYear(constructionYear - 1)}/>
                        </NumberInputStepper>
                    </NumberInput>
                </Box>
            </Stack>

            <Checkbox fontSize={{base: "18px", md: "22px"}} color='telegram.700' width="100%"
                      onChange={e => setNewBuilding(e.target.checked)}>Новостройка</Checkbox>

            <Stack direction={{base: 'column', md: 'row'}} justify='space-between' align={{md: 'center'}} my='24px'>
                <Box width={{base: "100%", md: "100%"}}>
                    <Heading fontSize={{base: "18px", md: "22px"}} color='telegram.700'>Описание:</Heading>
                    <Textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder='Описание'
                        size='md'
                        resize='vertical'
                        background={"#fff"}
                        height={"300px"}
                        maxHeight={"500px"}
                    />
                </Box>
            </Stack>

            <Stack direction='column' justifyContent="center" align='center' my='24px'>
                <Uploader onImagesChange={handleImagesChange} images={images}/>
            </Stack>

            <Stack direction={{base: 'column', md: 'row'}} justifyContent="center" align={{md: 'center'}} my='24px' padding={"10px"}>
                <Button width={{base: "100%", md: "300px"}}
                        onClick={publishButtonClick}>{buttonText}</Button>
            </Stack>
        </>
    )
}