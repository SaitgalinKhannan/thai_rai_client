import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    AlertDialog, AlertDialogBody,
    AlertDialogContent, AlertDialogFooter, AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    Divider,
    Heading,
    HStack,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
    Stack,
    Text,
    Textarea,
    ToastId, useDisclosure,
    useToast
} from "@chakra-ui/react";
import React, {useContext, useEffect, useRef, useState} from "react";
import {
    AdditionalParametersDto,
    BuildingType,
    buildingTypeMapping, facilities, Interior,
    interiorMapping,
    RealEstateDto, rules,
    Status,
    statusMapping
} from "../../api/model";
import Uploader, {ImageInfo} from "../Images/Uploader";
import {realEstateById, uploadNewHouse, zipArrays} from "../../api/Data";
import {useNavigate} from "react-router-dom";
import {ThaiRaiContext} from "../../context/HouseProvider";
import {
    countries,
    districts,
    kathuRegionsInCity,
    muangRegionsInCity, provinces,
    regionsInCity,
    talangRegionsInCity
} from "../../data/Address";

export default function NewHouseDetails() {
    const context = useContext(ThaiRaiContext);
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [status, setStatus] = useState(statusMapping[Status.RENT]);
    const [newBuilding, setNewBuilding] = useState(false);
    const [type, setType] = useState("");
    const [roomCount, setRoomCount] = useState(0);
    const [area, setArea] = useState(0);
    const [description, setDescription] = useState('');
    const [constructionYear, setConstructionYear] = useState(0);
    const [floor, setFloor] = useState(0);
    const [numberOfFloors, setNumberOfFloors] = useState(0);
    const [country, setCountry] = useState(countries[0]);
    const [region, setRegion] = useState(provinces[0]);
    const [district, setDistrict] = useState('');
    const [regionInCity, setRegionInCity] = useState('');
    const [localRegionsInCity, setLocalRegionsInCity] = useState(regionsInCity)
    const [street, setStreet] = useState('');
    const [index, setIndex] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [images, setImages] = useState<ImageInfo[]>([]);
    const [isUploaded, setIsUploaded] = useState(false);
    const [realEstateId, setRealEstateId] = useState<number | null>(null);
    const [buttonText, setButtonText] = useState("Опубликовать");
    const toast = useToast()
    const toastIdRef = useRef<ToastId>()
    const navigate = useNavigate();
    const [interior, setInterior] = useState<string | null>(null)
    const [rentTime, setRentTime] = useState<string | null>(null)
    const [pressedButton, setPressedButton] = useState<string | null>(null)
    const [ruleItems, setRuleItems] = React.useState([false, false])
    const [facilityItems, setFacilityItems] = React.useState([false, false, false, false, false, false, false])
    const {isOpen, onOpen, onClose} = useDisclosure()
    const cancelRef = React.useRef<HTMLButtonElement>(null)

    useEffect(() => {
        onOpen()
    }, []);

    useEffect(() => {
        setRentTime(pressedButton)
    }, [pressedButton])

    const handleImagesChange = (newImages: ImageInfo[]) => {
        setImages(newImages);  // Update images state
    };

    const interiorHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value !== "") {
            setInterior(event.target.value)
        }
    }

    const clearAddFilters = () => {
        setInterior(null)
        setRentTime(null)
        setPressedButton(null)
        setRuleItems([false, false])
        setFacilityItems([false, false, false, false, false, false, false])
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStatus = Object.values(statusMapping).find(value => value === e.target.value);

        if (selectedStatus) {
            setStatus(selectedStatus.toString());
        }

        if (selectedStatus !== "RENT") {
            setRentTime(null)
            setRuleItems([false, false])
        }
    }

    function districtChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value
        setDistrict(value)
        setRegionInCity('')
        changeRegionsInCity(value)
    }

    function changeRegionsInCity(value: string) {
        if (value === "Таланг") {
            setLocalRegionsInCity(talangRegionsInCity)
        } else if (value === "Катху") {
            setLocalRegionsInCity(kathuRegionsInCity)
        } else if (value === "Муанг") {
            setLocalRegionsInCity(muangRegionsInCity)
        } else {
            setLocalRegionsInCity(regionsInCity)
        }
    }

    const publishButtonClick = async () => {
        if (isUploaded && realEstateId != null) {
            realEstateById(realEstateId)
                .then(realEstate => {
                    context.setHouses(Array.of(realEstate))
                })
                .catch(e => {
                    console.log(e)
                })
            navigate(`/house/${realEstateId}`)
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
            if (name.trim() === '' || status.trim() === '' || type.trim() === '' || country.trim() === '' || region.trim() === '' || district.trim() === '' || regionInCity.trim() === '' || description.trim() === '') {
                toast({
                    title: 'Заполните все поля!',
                    status: 'error',
                    duration: 500,
                    isClosable: true,
                    position: 'top'
                })
            } else {
                const facilitiesZipped = zipArrays(facilityItems, facilities);
                const facilitiesString = facilitiesZipped
                    .filter(([bool, str]) => bool)
                    .map(([bool, str]) => str)
                    .join(", ");

                const rulesZipped = zipArrays(ruleItems, rules);
                const rulesString = rulesZipped
                    .filter(([bool, str]) => bool)
                    .map(([bool, str]) => str)
                    .join(", ");

                const additionalParameters: AdditionalParametersDto = {
                    interior: interior !== "" ? interior : null,
                    facility: facilitiesString !== "" ? facilitiesString : null,
                    rentTime: rentTime !== "" ? rentTime : null,
                    rules: rulesString !== "" ? rulesString : null
                }

                const realEstate: RealEstateDto = {
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
                    addressDto: {
                        country: country,
                        region: region,
                        district: district,
                        regionInCity: regionInCity,
                        street: street,
                        index: index,
                        houseNumber: houseNumber
                    },
                    additionalParametersDto: additionalParameters
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
                            setIsUploaded(true)
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

    return (
        <>
            <Stack direction={{base: 'column', lg: 'row'}} justify='space-between' align={{lg: 'center'}}
                   my='24px' padding={{base: "0px 16px 0px 16px", lg: "0px"}}
            >
                <Box width={{base: "100%", lg: "100%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">Название:</Heading>
                    <Input
                        onChange={e => setName(e.target.value)}
                        background={"#fff"}
                    ></Input>
                </Box>

                <Box width={{base: "100%", lg: "50%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">Продажа/Аренда:</Heading>
                    <Select
                        defaultValue={statusMapping[Status.RENT]}
                        onChange={e => handleChange(e)}
                        background={"#fff"}
                    >
                        {Object.values(Status).map((status) => (
                            <option key={status} value={statusMapping[status]}>
                                {status}
                            </option>
                        ))}
                    </Select>
                </Box>

                <Box width={{base: "100%", lg: "50%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">Тип здания:</Heading>
                    <Select
                        placeholder='Тип здания:'
                        onChange={e => setType(e.target.value)}
                        background={"#fff"}
                    >
                        {Object.values(BuildingType).map((type) => (
                            <option key={type} value={buildingTypeMapping[type]}>
                                {type}
                            </option>
                        ))}
                    </Select>
                </Box>

                <Box width={{base: "100%", lg: "50%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">Цена:</Heading>
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

                <Box width={{base: "100%", lg: "50%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">Страна:</Heading>
                    <Select
                        onChange={e => setCountry(e.target.value)}
                        placeholder={"Страна"}
                        value={country}
                        background={"#fff"}
                    >
                        {
                            countries.map((country, index) => (
                                <option key={index} value={country}>
                                    {country}
                                </option>
                            ))
                        }
                    </Select>
                </Box>
            </Stack>

            <Stack direction={{base: 'column', lg: 'row'}} justify='space-between' align={{lg: 'center'}} my='24px'
                   padding={{base: "0px 16px 0px 16px", lg: "0px"}}
            >
                <Box width={{base: "100%", lg: "100%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">Провинция:</Heading>
                    <Select
                        onChange={e => setRegion(e.target.value)}
                        placeholder={"Провинция"}
                        value={region}
                        background={"#fff"}
                    >
                        {
                            provinces.map((province, index) => (
                                <option key={index} value={province}>
                                    {province}
                                </option>
                            ))
                        }
                    </Select>
                </Box>

                <Box width={{base: "100%", lg: "100%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">Район:</Heading>
                    <Select
                        onChange={e => districtChange(e)}
                        placeholder={"Район"}
                        background={"#fff"}
                    >
                        {
                            districts.map((country, index) => (
                                <option key={index} value={country}>
                                    {country}
                                </option>
                            ))
                        }
                    </Select>
                </Box>

                <Box width={{base: "100%", lg: "100%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">Тамбон:</Heading>
                    <Select
                        onChange={e => setRegionInCity(e.target.value)}
                        placeholder={"Тамбон"}
                        value={regionInCity !== "" && regionInCity || undefined}
                        background={"#fff"}
                    >
                        {
                            localRegionsInCity.map((regionInCity, index) => (
                                <option key={index} value={regionInCity}>
                                    {regionInCity}
                                </option>
                            ))
                        }
                    </Select>
                </Box>
                <Box width={{base: "100%", lg: "100%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">Улица:</Heading>
                    <Input
                        onChange={e => setStreet(e.target.value)}
                        background={"#fff"}
                    ></Input>
                </Box>
                <Box width={{base: "100%", lg: "50%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">Индекс:</Heading>
                    <Input
                        onChange={e => setIndex(e.target.value)}
                        background={"#fff"}
                    ></Input>
                </Box>
                <Box width={{base: "100%", lg: "50%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">Дом:</Heading>
                    <Input
                        onChange={e => setHouseNumber(e.target.value)}
                        background={"#fff"}
                    ></Input>
                </Box>
            </Stack>

            <Stack direction={{base: 'column', lg: 'row'}} width={{base: "100%", lg: "100%"}} justify='space-between'
                   align={{lg: 'center'}} my='24px' padding={{base: "0px 16px 0px 16px", lg: "0px"}}
            >
                <Box width={{base: "100%", lg: "100%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">Кол-во комнат:</Heading>
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

                <Box width={{base: "100%", lg: "100%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">Площадь:</Heading>
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

                <Box width={{base: "100%", lg: "100%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">Этаж:</Heading>
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

                <Box width={{base: "100%", lg: "100%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">Всего этажей:</Heading>
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

                <Box width={{base: "100%", lg: "100%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">Год постройки:</Heading>
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

            <Checkbox
                fontSize={{base: "18px", lg: "22px"}}
                color="black"
                width="100%"
                padding={{base: "0px 16px 0px 16px", lg: "0px"}}
                onChange={e => setNewBuilding(e.target.checked)}
                colorScheme="green"
            >
                Новостройка
            </Checkbox>

            <Accordion allowToggle my='24px' padding={{base: "0px 16px 0px 16px", lg: "0px"}}>
                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <Box as="span" flex='1' textAlign='left'>
                                Дополнительные параметры
                            </Box>
                            <AccordionIcon/>
                        </AccordionButton>
                    </h2>
                    <AccordionPanel padding={0}>
                        <Stack direction={{base: 'column', lg: 'row'}} justify='space-around' align={{lg: 'center'}}
                               my='24px' spacing={"16px"}
                        >
                            <Stack direction="column"
                                   justify='space-between'
                                   align={{lg: 'center'}}
                                   spacing={"16px"}
                            >
                                <Box width={{base: "100%", lg: "100%"}}>
                                    <Text fontSize={"16px"} textColor={"#2d9d92"}>Интерьер</Text>
                                    <Select
                                        height="44px"
                                        width="100%"
                                        variant="filled"
                                        placeholder={"Интерьер"}
                                        onChange={interiorHandler}
                                    >
                                        {
                                            Object.values(Interior).map((type) => (
                                                <option key={type} value={interiorMapping[type]}>
                                                    {type}
                                                </option>
                                            ))
                                        }
                                    </Select>
                                </Box>

                                {
                                    status === "RENT" &&
                                    <Box width={{base: "100%", lg: "100%"}}>
                                        <Text fontSize={"16px"} textColor={"#2d9d92"}>Срок аренды</Text>
                                        <ButtonGroup
                                            variant="contained"
                                            aria-label="Срок аренды"
                                            spacing={0}
                                            width="100%"
                                            alignItems={"center"}
                                            borderColor="#EDF2F7"
                                            borderRadius={"6px"}
                                            borderWidth="2px"
                                        >
                                            <Button
                                                height="44px"
                                                width="35%"
                                                borderRadius={"6px 0 0 6px"}
                                                textAlign="center"
                                                textColor="black"
                                                fontSize="1rem"
                                                fontWeight=""
                                                overflow={"hidden"}
                                                backgroundColor={pressedButton === "daily" ? "#2d9d92" : "#ffffff"}
                                                onClick={() => setPressedButton("daily")}
                                            >
                                                Посуточно
                                            </Button>
                                            <Divider orientation='vertical' height="70%"/>
                                            <Button
                                                height="44px"
                                                width="65%"
                                                borderRadius={"0 6px 6px 0"}
                                                textAlign="center"
                                                textColor="black"
                                                fontSize="1rem"
                                                fontWeight=""
                                                overflow={"hidden"}
                                                backgroundColor={pressedButton === "long" ? "#2d9d92" : "#ffffff"}
                                                onClick={() => setPressedButton("long")}
                                            >
                                                На длительный срок
                                            </Button>
                                        </ButtonGroup>
                                    </Box>
                                }
                            </Stack>

                            <Box>
                                <Text fontSize={"16px"} textColor={"#2d9d92"}>Удобства</Text>
                                <HStack>
                                    <Checkbox
                                        colorScheme="green"
                                        width={"100%"}
                                        isChecked={facilityItems[0]}
                                        onChange={(e) => setFacilityItems([e.target.checked, facilityItems[1], facilityItems[2], facilityItems[3], facilityItems[4], facilityItems[5], facilityItems[6]])}
                                    >
                                        Бассейн
                                    </Checkbox>
                                    <Checkbox
                                        colorScheme="green"
                                        width={"100%"}
                                        isChecked={facilityItems[1]}
                                        onChange={(e) => setFacilityItems([facilityItems[0], e.target.checked, facilityItems[2], facilityItems[3], facilityItems[4], facilityItems[5], facilityItems[6]])}
                                    >
                                        Парковка
                                    </Checkbox>
                                </HStack>
                                <HStack>
                                    <Checkbox
                                        colorScheme="green"
                                        width={"100%"}
                                        isChecked={facilityItems[2]}
                                        onChange={(e) => setFacilityItems([facilityItems[0], facilityItems[1], e.target.checked, facilityItems[3], facilityItems[4], facilityItems[5], facilityItems[6]])}
                                    >
                                        Тренажерный зал
                                    </Checkbox>
                                    <Checkbox
                                        colorScheme="green"
                                        width={"100%"}
                                        isChecked={facilityItems[3]}
                                        onChange={(e) => setFacilityItems([facilityItems[0], facilityItems[1], facilityItems[2], e.target.checked, facilityItems[4], facilityItems[5], facilityItems[6]])}
                                    >
                                        WI-FI
                                    </Checkbox>
                                </HStack>

                                <HStack>
                                    <Checkbox
                                        colorScheme="green"
                                        width={"100%"}
                                        isChecked={facilityItems[4]}
                                        onChange={(e) => setFacilityItems([facilityItems[0], facilityItems[1], facilityItems[2], facilityItems[3], e.target.checked, facilityItems[5], facilityItems[6]])}
                                    >
                                        Стиральная машина
                                    </Checkbox>
                                    <Checkbox
                                        colorScheme="green"
                                        width={"100%"}
                                        isChecked={facilityItems[5]}
                                        onChange={(e) => setFacilityItems([facilityItems[0], facilityItems[1], facilityItems[2], facilityItems[3], facilityItems[4], e.target.checked, facilityItems[6]])}
                                    >
                                        Уборка
                                    </Checkbox>
                                </HStack>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={facilityItems[6]}
                                    onChange={(e) => setFacilityItems([facilityItems[0], facilityItems[1], facilityItems[2], facilityItems[3], facilityItems[4], facilityItems[5], e.target.checked])}
                                >
                                    Место для курения
                                </Checkbox>
                            </Box>

                            {
                                status === "RENT" &&
                                <Box>
                                    <Text fontSize={"16px"} textColor={"#2d9d92"}>Правила</Text>
                                    <Stack direction={{base: 'row', lg: 'column'}}>
                                        <Checkbox
                                            colorScheme="green"
                                            width={"100%"}
                                            isChecked={ruleItems[0]}
                                            onChange={(e) => setRuleItems([e.target.checked, ruleItems[1]])}
                                        >
                                            С детьми
                                        </Checkbox>
                                        <Checkbox
                                            colorScheme="green"
                                            width={"100%"}
                                            isChecked={ruleItems[1]}
                                            onChange={(e) => setRuleItems([ruleItems[0], e.target.checked])}
                                        >
                                            С животными
                                        </Checkbox>
                                    </Stack>
                                </Box>
                            }
                        </Stack>


                        <Box width="100%" my='16px'>
                            <Stack align={"center"}>
                                <Button
                                    backgroundColor={"#2d9d92"}
                                    onClick={clearAddFilters}
                                    _hover={{background: "#9cb1b1"}}
                                >
                                    Сбросить дополнительные параметры
                                </Button>
                            </Stack>
                        </Box>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>

            <Stack direction={{base: 'column', lg: 'row'}} justify='space-between' align={{lg: 'center'}} my='24px'
                   padding={{base: "0px 16px 0px 16px", lg: "0px"}}
            >
                <Box width={{base: "100%", lg: "100%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">Описание:</Heading>
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

            <Stack
                direction='column'
                justifyContent="center"
                align='center'
                my='24px'
                padding={{base: "0px 16px 0px 16px", lg: "0px"}}
            >
                <Uploader
                    onImagesChange={handleImagesChange}
                    images={images}
                />
            </Stack>

            <Stack
                direction={{base: 'column', lg: 'row'}}
                justifyContent="center"
                align={{lg: 'center'}}
                my='24px'
                padding={"10px"}
            >
                <Button
                    width={{base: "100%", lg: "300px"}}
                    onClick={publishButtonClick}
                    backgroundColor={"#2d9d92"}
                    _hover={{background: "#9cb1b1"}}
                >
                    {buttonText}
                </Button>
            </Stack>

            {
                <>
                    <AlertDialog
                        isOpen={isOpen}
                        leastDestructiveRef={cancelRef}
                        onClose={onClose}
                    >
                        <AlertDialogOverlay>
                            <AlertDialogContent>
                                <AlertDialogBody fontSize={"22px"}>
                                    <b>Продайте вашу недвижимость быстрее с нашим бесплатным фотографом!</b>
                                    <br/>
                                    Улучшите
                                    визуальное представление вашего объекта благодаря профессиональным снимкам интерьера
                                    и экстерьера. Оставьте заявку прямо сейчас, чтобы воспользоваться этой уникальной
                                    возможностью!
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                    <Button
                                        ref={cancelRef}
                                        onClick={onClose}
                                        backgroundColor={"#2d9d92"}
                                        _hover={{background: "#9cb1b1"}}
                                    >
                                        Закрыть
                                    </Button>
                                    <Button
                                        backgroundColor={"#1b2222"}
                                        _hover={{background: "#9cb1b1"}}
                                        onClick={_ => {}} ml={3}
                                    >
                                        Оставить заявку
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
                </>
            }
        </>
    )
}