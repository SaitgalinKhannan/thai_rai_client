import {
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    Divider,
    Heading,
    HStack, Image,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select, SimpleGrid,
    Stack,
    Text,
    Textarea,
    ToastId,
    useToast
} from "@chakra-ui/react";
import React, {ChangeEvent, useContext, useEffect, useRef, useState} from "react";
import {
    AdditionalParametersDto,
    BuildingType,
    buildingTypeMapping,
    facilities,
    Interior,
    interiorMapping,
    RealEstateDto,
    rules,
    Status,
    statusMapping
} from "../../api/model";
import Uploader, {ImageInfo} from "../Images/Uploader";
import {loadImageInfoArray, realEstateById, updateRealEstate, zipArrays} from "../../api/Data";
import {useNavigate} from "react-router-dom";
import {ThaiRaiContext} from "../../context/HouseProvider";
import {MdCloudUpload, MdDelete} from "react-icons/md";
import {AlertStatus} from "@chakra-ui/alert";
import {
    countries, districts,
    kathuRegionsInCity,
    muangRegionsInCity, provinces,
    regionsInCity,
    talangRegionsInCity
} from "../../data/Address";

export default function UpdateRealEstate() {
    let context = useContext(ThaiRaiContext);
    let [id, setId] = useState(0);
    let [name, setName] = useState("");
    let [price, setPrice] = useState(0);
    let [status, setStatus] = useState<string | null>(null);
    let [newBuilding, setNewBuilding] = useState(false);
    let [type, setType] = useState("");
    let [roomCount, setRoomCount] = useState(0);
    let [area, setArea] = useState(0);
    let [constructionYear, setConstructionYear] = useState(0);
    let [floor, setFloor] = useState(0);
    let [numberOfFloors, setNumberOfFloors] = useState(0);
    let [description, setDescription] = useState("");
    let [country, setCountry] = useState("");
    let [region, setRegion] = useState("");
    let [district, setDistrict] = useState("");
    let [regionInCity, setRegionInCity] = useState("");
    let [localRegionsInCity, setLocalRegionsInCity] = useState(regionsInCity)
    let [street, setStreet] = useState("");
    let [index, setIndex] = useState("");
    let [houseNumber, setHouseNumber] = useState("");
    let [isUploaded, setIsUploaded] = useState(false);
    let [buttonText, setButtonText] = useState("Обновить");
    let toast = useToast()
    let toastIdRef = useRef<ToastId>()
    let navigate = useNavigate();
    let [interior, setInterior] = useState<string | null>(null)
    let [rentTime, setRentTime] = useState<string | null>(null)
    let [pressedButton, setPressedButton] = useState<string | null>(null)
    let [ruleItems, setRuleItems] = React.useState([false, false])
    let [facilityItems, setFacilityItems] = React.useState([false, false, false, false, false, false, false])
    const [images, setImages] = useState<ImageInfo[]>([]);
    const [deletedPhotoIds, setDeletedPhotoIds] = useState<number[]>([])

    useEffect(() => {
        const realEstateId = localStorage.getItem("realEstateId")
        if (realEstateId != null) {
            realEstateById(parseInt(realEstateId)).then(house => {
                setId(house.id)
                setName(house.name)
                setPrice(house.price)
                setStatus(house.status)
                setNewBuilding(house.newBuilding)
                setType(house.type)
                setRoomCount(house.roomCount)
                setArea(house.area)
                setDescription(house.description)
                setFloor(house.floor)
                setNumberOfFloors(house.numberOfFloors)
                setConstructionYear(house.constructionYear)

                setCountry(house.addressDto.country)
                setRegion(house.addressDto.region)
                setDistrict(house.addressDto.district)
                changeRegionsInCity(house.addressDto.district)
                setRegionInCity(house.addressDto.regionInCity)
                setStreet(house.addressDto.street)
                setIndex(house.addressDto.index)
                setHouseNumber(house.addressDto.houseNumber)

                setInterior(house.additionalParametersDto?.interior ?? null)
                setRentTime(house.additionalParametersDto?.rentTime ?? null)

                if (house.additionalParametersDto?.facility !== null) {
                    const facilitiesZipped = zipArrays(facilityItems, facilities);
                    const facilitiesItems = facilitiesZipped
                        .map(([bool, str]) => {
                            return house.additionalParametersDto?.facility?.split(", ").includes(str) ?? false;
                        })
                    setFacilityItems(facilitiesItems)
                }


                if (house.additionalParametersDto?.rules !== null) {
                    const rulesZipped = zipArrays(ruleItems, rules);
                    const rulesSItems = rulesZipped
                        .map(([bool, str]) => {
                            return house.additionalParametersDto?.rules?.split(", ").includes(str) ?? false;
                        })
                    setRuleItems(rulesSItems)
                }

                loadImageInfoArray(house.photos).then(images => {
                    setImages(images)
                }).catch(e => {
                    console.log(e)
                })
            }).catch(e => {
                console.log(e)
            })
        }
    }, [])

    useEffect(() => {
        setRentTime(pressedButton)
    }, [pressedButton])

    useEffect(() => {
        setPressedButton(rentTime)
    }, [rentTime])

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

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (files && files.length > 0) {
            const fileList = Array.from(files);

            const newImages = fileList.map((file) => ({
                id: 0,
                file: file,
                url: URL.createObjectURL(file),
                isOld: false
            }));

            setImages((prevImages) => [...prevImages, ...newImages]);
        }
    };

    const handleDeleteClick = (index: number) => {
        if (images[index].id !== null) {
            setDeletedPhotoIds([...deletedPhotoIds, images[index].id])
        }

        setImages((prevImages) => {
            const newImages = [...prevImages];
            newImages.splice(index, 1);
            return newImages;
        });
    };

    const handleFormClick = () => {
        const inputField = document.querySelector(".input-field") as HTMLInputElement | null;
        if (inputField) {
            inputField.click();
        }
    };

    const showToast = (status: AlertStatus, title: string, description: string) => {
        if (toastIdRef.current) {
            toast.update(toastIdRef.current, {
                title,
                description,
                status,
                duration: 1000,
                isClosable: true,
                position: 'top'
            });
        } else {
            toastIdRef.current = toast({
                title,
                description,
                status,
                duration: 1000,
                isClosable: true,
                position: 'top'
            });
        }
    };

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

    const updateButtonClick = async () => {
        if (isUploaded && id != null) {
            realEstateById(id)
                .then(realEstate => {
                    context.setHouses(Array.of(realEstate))
                })
                .catch(e => {
                    console.log(e)
                })
            navigate(`/house/${id}`)
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
            if (name.trim() === "" || status?.trim() === "" || type.trim() === "" || country.trim() === "" || region.trim() === "" || district.trim() === "" || regionInCity.trim() === "" || description.trim() === "") {
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
                    .map(([, str]) => str)
                    .join(", ");

                const rulesZipped = zipArrays(ruleItems, rules);
                const rulesString = rulesZipped
                    .filter(([bool, str]) => bool)
                    .map(([, str]) => str)
                    .join(", ");

                let additionalParameters: AdditionalParametersDto = {
                    interior: interior !== "" ? interior : null,
                    facility: facilitiesString !== "" ? facilitiesString : null,
                    rentTime: rentTime !== "" ? rentTime : null,
                    rules: rulesString !== "" ? rulesString : null
                }

                let realEstate: RealEstateDto = {
                    id: id,
                    ownerId: parseInt(userId),
                    name: name,
                    price: price,
                    status: status ?? "SALE",
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

                showToast('loading', 'Загрузка.', "Загружаем данные на сервер.");

                try {
                    const result = await updateRealEstate(realEstate, images.filter(image => !image.isOld), deletedPhotoIds);

                    if (result) {
                        showToast('success', 'Готово.', "Данные успешно изменены.");
                        setIsUploaded(true);
                        setButtonText("Перейти к объявлению");
                    } else {
                        showToast('error', 'Ошибка.', "Не удалось обновить данные.");
                    }
                } catch (error) {
                    showToast('error', 'Ошибка.', "Не удалось обновить данные.");
                    console.log(error);
                }
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
                        value={name}
                        onChange={e => setName(e.target.value)}
                        background={"#fff"}
                    ></Input>
                </Box>

                <Box width={{base: "100%", lg: "50%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">Продажа/Аренда:</Heading>
                    <Select
                        value={status ?? undefined}
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
                        value={type}
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
                        value={price}
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
                        onChange={e => setCountry(e.target.value)}
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
                        value={district}
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
                        value={street}
                        onChange={e => setStreet(e.target.value)}
                        background={"#fff"}
                    ></Input>
                </Box>
                <Box width={{base: "100%", lg: "50%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">Индекс:</Heading>
                    <Input
                        value={index}
                        onChange={e => setIndex(e.target.value)}
                        background={"#fff"}
                    ></Input>
                </Box>
                <Box width={{base: "100%", lg: "50%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">Дом:</Heading>
                    <Input
                        value={houseNumber}
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
                        value={roomCount}
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
                        value={area}
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
                        value={floor}
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
                        value={numberOfFloors}
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
                        value={constructionYear}
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
                checked={newBuilding}
                fontSize={{base: "18px", lg: "22px"}}
                color="black"
                width="100%"
                padding={{base: "0px 16px 0px 16px", lg: "0px"}}
                onChange={e => setNewBuilding(e.target.checked)}
                colorScheme="green"
            >
                Новостройка
            </Checkbox>


            <Stack direction={{base: 'column', lg: 'row'}} justify='space-around' align={{lg: 'center'}}
                   my='24px' spacing={"16px"} px={"16px"}
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
                            value={interior ?? undefined}
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
                        </Box>}
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
                        <MdCloudUpload color={"#2d9d92"} size={60}/>
                        <p>Browse Files to upload</p>
                    </div>


                    <SimpleGrid width={"100%"} minChildWidth='250px' spacing='10px'>
                        {images.map((image, index) => (
                            <section key={index} className="uploaded_image">
                                <div className="image-container">
                                    <Image
                                        maxW={"250px"}
                                        maxH={"300px"}
                                        src={image.url} alt={`Uploaded Image ${index}`}
                                    />
                                </div>
                                <div className="info-container">
                                    <div className="delete-icon">
                                        <MdDelete onClick={() => handleDeleteClick(index)}/>
                                    </div>
                                </div>
                            </section>
                        ))}
                    </SimpleGrid>
                </>
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
                    onClick={updateButtonClick}
                    backgroundColor={"#2d9d92"}
                    _hover={{background: "#9cb1b1"}}
                >
                    {buttonText}
                </Button>
            </Stack>
        </>
    )
}