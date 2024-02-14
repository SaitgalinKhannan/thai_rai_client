import {
    Box, Button,
    Checkbox,
    Heading,
    Input, NumberDecrementStepper, NumberIncrementStepper,
    NumberInput, NumberInputField, NumberInputStepper,
    Select,
    Stack, Text,
    Textarea
} from "@chakra-ui/react";
import React from "react";
import {BuildingType, RealEstateDto, Status, statusMapping, user} from "../../data";
import Uploader, {ImageInfo} from "../Images/Uploader";
import axios from "axios";

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

    const handleImagesChange = (newImages: ImageInfo[]) => {
        setImages(newImages);  // Update images state
    };

    const publishButtonClick = async () => {
        if (name.trim() === '' || status.trim() === '' || type.trim() === '' || region.trim() === '' || district.trim() === '' || regionInCity.trim() === '' || index.trim() === '' || houseNumber.trim() === '' || description.trim() === '') {
            alert('Заполните все поля.');
        } else {
            let realEstate: RealEstateDto = {
                owner: user,
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

            console.log(JSON.stringify(realEstate))

            const formData = new FormData();
            const jsonBlob = new Blob([JSON.stringify(realEstate)], { type: 'application/json' });

            formData.append('realEstateDto', jsonBlob);
            images.forEach((image) => {
                formData.append("files", image.file)
            })

            axios.post('http://127.0.0.1:8080/realestates/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
                .then(response => {
                    console.log(response.data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });

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
                        {Object.values(BuildingType).map(name => <option value={name}>{name}</option>)}
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

            <Stack direction={{base: 'column', md: 'row'}} justifyContent="center" align={{md: 'center'}} my='24px'>
                <Button width={{base: "100%", md: "300px"}} onClick={publishButtonClick}>Опубликовать</Button>
            </Stack>
        </>
    )
}