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
    useToast, VStack
} from "@chakra-ui/react";
import React, {ChangeEvent, useContext, useEffect, useRef, useState} from "react";
import {
    AdditionalParametersDto,
    BuildingType,
    buildingTypeMapping,
    facilities,
    Interior,
    interiorMapping,
    RealEstateDto, RentalFeatures,
    rules, SaleFeatures,
    Status,
    statusMapping
} from "../../api/model";
import {ImageInfo} from "../Images/Uploader";
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
import {useTranslation} from "react-i18next";

export default function UpdateRealEstate() {
    let context = useContext(ThaiRaiContext);
    const {t} = useTranslation();
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
    let [buttonText, setButtonText] = useState(t('update'));
    let toast = useToast()
    let toastIdRef = useRef<ToastId>()
    let navigate = useNavigate();

    let [pressedButton, setPressedButton] = useState<string | null>(null)

    const [images, setImages] = useState<ImageInfo[]>([]);
    const [deletedPhotoIds, setDeletedPhotoIds] = useState<number[]>([])

    const [saleFeatures, setSaleFeatures] = useState<SaleFeatures>({
        id: 0,
        realEstateId: 0,
        concierge: false,
        gatedCommunity: false,
        openParking: false,
        closedParking: false,
        closedTerritory: false,
        gym: false,
        playground: false,
        recreationArea: false,
        pool: false,
        terrace: false,
        fridge: false,
        dishwasher: false,
        diningTable: false,
        kitchenUtensils: false,
        appliances: false,
        tv: false,
        airConditioning: false,
        wardrobe: false,
        washingMachine: false,
        smokingArea: false,
        wifi: false,
        interior: null
    });

    const handleSaleFeaturesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = event.target;
        console.log(event.target.name)

        setSaleFeatures((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    };

    const [rentalFeatures, setRentalFeatures] = useState<RentalFeatures>({
        id: 0,
        realEstateId: 0,
        rentalTime: '',
        withPet: false,
        withChildren: false,
        airportTransfer: false,
        beachTransfer: false,
        concierge: false,
        openParking: false,
        closedParking: false,
        seaView: false,
        lakeView: false,
        mountainView: false,
        forestView: false,
        courtyard: false,
        pool: false,
        outdoorShower: false,
        bbqArea: false,
        outdoorDining: false,
        poolTable: false,
        gymEquipment: false,
        car: false,
        motorbike: false,
        sleepingPlaces: null,
        workspace: false,
        wifi: false,
        tv: false,
        airConditioning: false,
        fridge: false,
        dishwasher: false,
        diningTable: false,
        kitchenUtensils: false,
        bathtub: false,
        shower: false,
        washingMachine: false,
        cleaning: false,
        linenChange: false,
        videoSurveillance: false,
        closedTerritory: false,
        smokeDetector: false,
        firstAidKit: false,
        fireExtinguisher: false,
        carbonMonoxideDetector: false,
        smokingArea: false,
        interior: null
    });

    const handleRentalFeaturesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, type, checked, value} = event.target;
        setRentalFeatures((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const setSleepingPlaces = (value: number) => {
        setRentalFeatures((prevState) => ({
            ...prevState,
            sleepingPlaces: value,
        }))
    };

    const setRentTime = (value: string | null) => {
        setRentalFeatures((prevState) => ({
            ...prevState,
            rentalTime: value,
        }))
    };

    const setInteriorFeatures = (value: string) => {
        const interior = value as Interior;

        if (status === "RENT" && interior) {
            setRentalFeatures((prevState) => ({
                ...prevState,
                interior: interior,
            }))
        }

        if(status === "SALE" && interior) {
            setSaleFeatures((prevState) => ({
                ...prevState,
                interior: interior,
            }))
        }
    };

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

                console.log(house.saleFeaturesDto)
                console.log(house.rentalFeaturesDto)

                if (house.saleFeaturesDto) {
                    setSaleFeatures(house.saleFeaturesDto)
                }
                if (house.rentalFeaturesDto) {
                    setRentalFeatures(house.rentalFeaturesDto)
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
        if (pressedButton) {
            setRentTime(pressedButton)
            console.log(pressedButton)
        }
    }, [pressedButton])

    useEffect(() => {
        if (rentalFeatures.rentalTime) {
            setPressedButton(rentalFeatures.rentalTime)
            console.log(rentalFeatures.rentalTime)
        }
    }, [rentalFeatures.rentalTime])

    const interiorHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value !== "") {
            setInteriorFeatures(event.target.value)
        }
    }

    const clearAddFilters = () => {
        setPressedButton(null)
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStatus = Object.values(statusMapping).find(value => value === e.target.value);

        if (selectedStatus) {
            setStatus(selectedStatus.toString());
        }

        if (selectedStatus !== "RENT") {
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
                title: t('log_in'),
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top'
            })
        } else {
            if (name.trim() === "" || status?.trim() === "" || type.trim() === "" || country.trim() === "" || region.trim() === "" || district.trim() === "" || regionInCity.trim() === "" || description.trim() === "") {
                toast({
                    title: t('fill_in_all_the_fields'),
                    status: 'error',
                    duration: 500,
                    isClosable: true,
                    position: 'top'
                })
            } else {
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
                    saleFeaturesDto: saleFeatures,
                    rentalFeaturesDto: rentalFeatures
                }

                showToast('loading', 'Загрузка.', "Загружаем данные на сервер.");

                try {
                    const result = await updateRealEstate(realEstate, images.filter(image => !image.isOld), deletedPhotoIds);

                    if (result) {
                        showToast('success', t('success'), t('data_uploaded_success'));
                        setIsUploaded(true);
                        setButtonText(t('to_adv'));
                    } else {
                        showToast('error', t('error'), t('data_upload_error'));
                    }
                } catch (error) {
                    showToast('error', t('error'), t('data_upload_error'));
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
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('name')}:</Heading>
                    <Input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        background={"#fff"}
                    ></Input>
                </Box>

                <Box width={{base: "100%", lg: "50%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('sale/rent')}:</Heading>
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
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('real_estate_type')}:</Heading>
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
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('price')}:</Heading>
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
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('country')}:</Heading>
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
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('province')}:</Heading>
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
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('district')}:</Heading>
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
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('tambon')}:</Heading>
                    <Select
                        onChange={e => setRegionInCity(e.target.value)}
                        placeholder={t('tambon')}
                        value={regionInCity !== "" ? regionInCity : undefined}
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
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('street')}:</Heading>
                    <Input
                        value={street}
                        onChange={e => setStreet(e.target.value)}
                        background={"#fff"}
                    ></Input>
                </Box>
                <Box width={{base: "100%", lg: "50%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('index')}:</Heading>
                    <Input
                        value={index}
                        onChange={e => setIndex(e.target.value)}
                        background={"#fff"}
                    ></Input>
                </Box>
                <Box width={{base: "100%", lg: "50%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('house')}:</Heading>
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
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('room_count_short')}:</Heading>
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
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('area')}:</Heading>
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
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('floor')}:</Heading>
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
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('total_floors')}:</Heading>
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
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('year_of_construction')}:</Heading>
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

            <Stack direction={{base: 'column', lg: 'row'}} width={{base: "100%", lg: "100%"}} justify='space-between'
                   align={{lg: 'center'}} my='24px' padding={{base: "0px 16px 0px 16px", lg: "0px"}}
            >
                {
                    status === "RENT" &&
                    <Box width={{base: "100%", lg: "30%"}}>
                        <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('sleepingPlaces')}:</Heading>
                        <NumberInput
                            size='md'
                            defaultValue={rentalFeatures.sleepingPlaces || 0}
                            min={0}
                            name={"sleepingPlaces"}
                        >
                            <NumberInputField
                                onChange={e => rentalFeatures.sleepingPlaces && setSleepingPlaces(parseInt(e.target.value))}
                                background={"#fff"}
                            />
                            <NumberInputStepper>
                                <NumberIncrementStepper
                                    onClick={() => rentalFeatures.sleepingPlaces && setSleepingPlaces(rentalFeatures.sleepingPlaces + 1)}/>
                                <NumberDecrementStepper
                                    onClick={() => rentalFeatures.sleepingPlaces && setSleepingPlaces(rentalFeatures.sleepingPlaces - 1)}/>
                            </NumberInputStepper>
                        </NumberInput>
                    </Box>
                }

                <Checkbox
                    fontSize={{base: "18px", lg: "22px"}}
                    color="black"
                    width="100%"
                    padding={{base: "0px 16px 0px 16px", lg: "0px"}}
                    onChange={e => setNewBuilding(e.target.checked)}
                    colorScheme="green"
                >
                    {t('new')}
                </Checkbox>
            </Stack>

            {
                status === "SALE" &&
                <Stack
                    direction={{base: 'column', lg: 'row'}}
                    justify='space-between'
                    my='24px' spacing={"16px"}
                >
                    <Stack
                        direction="column"
                        justify='space-between'
                        align={{lg: 'center'}}
                        spacing={"16px"}
                        width={{base: "100%", lg: "100%"}}
                    >
                        <Box width={{base: "100%", lg: "100%"}}>
                            <Text fontSize={"16px"} textColor={"#2d9d92"}>{t('interior')}</Text>
                            <Select
                                height="44px"
                                width="100%"
                                variant="filled"
                                placeholder={t('interior')}
                                value={(rentalFeatures.interior && interiorMapping[rentalFeatures.interior]) || (saleFeatures.interior && interiorMapping[saleFeatures.interior]) || undefined}
                                onChange={interiorHandler}
                                colorScheme={"green"}
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
                    </Stack>

                    <Box width={{base: "100%", lg: "100%"}}>
                        <Text fontSize={"16px"} textColor={"#2d9d92"}>{t('facilities')}</Text>
                        <Checkbox
                            colorScheme="green"
                            width={"100%"}
                            isChecked={saleFeatures.concierge || false}
                            name={"concierge"}
                            onChange={handleSaleFeaturesChange}
                        >
                            {t('concierge')}
                        </Checkbox>
                        <Checkbox
                            colorScheme="green"
                            width={"100%"}
                            isChecked={saleFeatures.gatedCommunity || false}
                            name={"gatedCommunity"}
                            onChange={handleSaleFeaturesChange}
                        >
                            {t('gatedCommunity')}
                        </Checkbox>

                        <Checkbox
                            colorScheme="green"
                            width={"100%"}
                            isChecked={saleFeatures.openParking || false}
                            name={"openParking"}
                            onChange={handleSaleFeaturesChange}
                        >
                            {t('openParking')}
                        </Checkbox>
                        <Checkbox
                            colorScheme="green"
                            width={"100%"}
                            isChecked={saleFeatures.closedParking || false}
                            name={"closedParking"}
                            onChange={handleSaleFeaturesChange}
                        >
                            {t('closedParking')}
                        </Checkbox>

                        <Checkbox
                            colorScheme="green"
                            width={"100%"}
                            isChecked={saleFeatures.closedTerritory || false}
                            name={"closedTerritory"}
                            onChange={handleSaleFeaturesChange}
                        >
                            {t('closedTerritory')}
                        </Checkbox>
                        <Checkbox
                            colorScheme="green"
                            width={"100%"}
                            isChecked={saleFeatures.gym || false}
                            name={"gym"}
                            onChange={handleSaleFeaturesChange}
                        >
                            {t('gym')}
                        </Checkbox>

                        <Checkbox
                            colorScheme="green"
                            width={"100%"}
                            isChecked={saleFeatures.playground || false}
                            name={"playground"}
                            onChange={handleSaleFeaturesChange}
                        >
                            {t('playground')}
                        </Checkbox>
                        <Checkbox
                            colorScheme="green"
                            width={"100%"}
                            isChecked={saleFeatures.recreationArea || false}
                            name={"recreationArea"}
                            onChange={handleSaleFeaturesChange}
                        >
                            {t('recreationArea')}
                        </Checkbox>

                        <Checkbox
                            colorScheme="green"
                            width={"100%"}
                            isChecked={saleFeatures.pool || false}
                            name={"pool"}
                            onChange={handleSaleFeaturesChange}
                        >
                            {t('pool')}
                        </Checkbox>
                        <Checkbox
                            colorScheme="green"
                            width={"100%"}
                            isChecked={saleFeatures.terrace || false}
                            name={"terrace"}
                            onChange={handleSaleFeaturesChange}
                        >
                            {t('terrace')}
                        </Checkbox>

                        <Checkbox
                            colorScheme="green"
                            width={"100%"}
                            isChecked={saleFeatures.wifi || false}
                            name={"wifi"}
                            onChange={handleSaleFeaturesChange}
                        >
                            {t('wifi')}
                        </Checkbox>
                        <Checkbox
                            colorScheme="green"
                            width={"100%"}
                            isChecked={saleFeatures.washingMachine || false}
                            name={"washingMachine"}
                            onChange={handleSaleFeaturesChange}
                        >
                            {t('washingMachine')}
                        </Checkbox>

                        <Checkbox
                            colorScheme="green"
                            width={"100%"}
                            isChecked={saleFeatures.smokingArea || false}
                            name={"smokingArea"}
                            onChange={handleSaleFeaturesChange}
                        >
                            {t('smokingArea')}
                        </Checkbox>
                    </Box>

                    <VStack width={"100%"}>
                        <Box width={{base: "100%", lg: "100%"}}>
                            <Text fontSize={"16px"} textColor={"#2d9d92"}>{t('kitchen')}</Text>
                            <Checkbox
                                colorScheme="green"
                                width={"100%"}
                                isChecked={saleFeatures.fridge || false}
                                name={"fridge"}
                                onChange={handleSaleFeaturesChange}
                            >
                                {t('fridge')}
                            </Checkbox>
                            <Checkbox
                                colorScheme="green"
                                width={"100%"}
                                isChecked={saleFeatures.dishwasher || false}
                                name={"dishwasher"}
                                onChange={handleSaleFeaturesChange}
                            >
                                {t('dishwasher')}
                            </Checkbox>
                            <Checkbox
                                colorScheme="green"
                                width={"100%"}
                                isChecked={saleFeatures.diningTable || false}
                                name={"diningTable"}
                                onChange={handleSaleFeaturesChange}
                            >
                                {t('diningTable')}
                            </Checkbox>
                            <Checkbox
                                colorScheme="green"
                                width={"100%"}
                                isChecked={saleFeatures.kitchenUtensils || false}
                                name={"kitchenUtensils"}
                                onChange={handleSaleFeaturesChange}
                            >
                                {t('kitchenUtensils')}
                            </Checkbox>
                        </Box>

                        <Box width={{base: "100%", lg: "100%"}}>
                            <Text fontSize={"16px"} textColor={"#2d9d92"}>{t('livingRoom')}</Text>
                            <Checkbox
                                colorScheme="green"
                                width={"100%"}
                                isChecked={saleFeatures.appliances || false}
                                name={"appliances"}
                                onChange={handleSaleFeaturesChange}
                            >
                                {t('appliances')}
                            </Checkbox>
                            <Checkbox
                                colorScheme="green"
                                width={"100%"}
                                isChecked={saleFeatures.tv || false}
                                name={"tv"}
                                onChange={handleSaleFeaturesChange}
                            >
                                {t('tv')}
                            </Checkbox>
                            <Checkbox
                                colorScheme="green"
                                width={"100%"}
                                isChecked={saleFeatures.airConditioning || false}
                                name={"airConditioning"}
                                onChange={handleSaleFeaturesChange}
                            >
                                {t('airConditioning')}
                            </Checkbox>
                            <Checkbox
                                colorScheme="green"
                                width={"100%"}
                                isChecked={saleFeatures.wardrobe || false}
                                name={"wardrobe"}
                                onChange={handleSaleFeaturesChange}
                            >
                                {t('wardrobe')}
                            </Checkbox>
                        </Box>
                    </VStack>
                </Stack>
            }

            {
                status === "RENT" &&
                <Stack direction={{base: 'column', lg: 'row'}}
                       justify='space-between' my='24px' spacing={"16px"}
                >
                    <VStack spacing={"16px"} width={"100%"}>
                        <Box width={"100%"}>
                            <Text fontSize={"16px"} textColor={"#2d9d92"}>{t('interior')}</Text>
                            <Select
                                height="44px"
                                width="100%"
                                variant="filled"
                                colorScheme="green"
                                placeholder={t('interior')}
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


                        <Box width={"100%"}>
                            <Text fontSize={"16px"} textColor={"#2d9d92"}>{t('rent_time')}</Text>
                            <ButtonGroup
                                variant="contained"
                                aria-label={t('rent_time')}
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
                                    {t('daily')}
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
                                    {t('long_time')}
                                </Button>
                            </ButtonGroup>
                        </Box>
                    </VStack>

                    <Stack direction={{base: 'column', md: 'column'}} width={"100%"}>
                        <VStack width={"100%"}>
                            <Box width={"100%"}>
                                <Text fontSize={"16px"} textColor={"#2d9d92"}>{t('facilities')}</Text>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.airportTransfer || false}
                                    name={"airportTransfer"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('airportTransfer')}
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.beachTransfer || false}
                                    name={"beachTransfer"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('beachTransfer')}
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.concierge || false}
                                    name={"concierge"}
                                    onChange={handleRentalFeaturesChange || false}
                                >
                                    {t('concierge')}
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.openParking || false}
                                    name={"openParking"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('openParking')}
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.closedParking || false}
                                    name={"closedParking"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('closedParking')}
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.smokingArea || false}
                                    name={"smokingArea"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('smokingArea')}
                                </Checkbox>
                            </Box>

                            <Box width={"100%"}>
                                <Text fontSize={"16px"} textColor={"#2d9d92"}>{t('facilitiesInside')}</Text>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.workspace || false}
                                    name={"workspace"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('workspace')}
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.wifi || false}
                                    name={"wifi"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('wifi')}
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.tv || false}
                                    name={"tv"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('tv')}
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.airConditioning || false}
                                    name={"airConditioning"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('airConditioning')}
                                </Checkbox>
                            </Box>
                        </VStack>

                        <Box width={"100%"}>
                            <Text fontSize={"16px"} textColor={"#2d9d92"}>{t('peculiarities')}</Text>
                            <Checkbox
                                colorScheme="green"
                                width={"100%"}
                                isChecked={rentalFeatures.seaView || false}
                                name={"seaView"}
                                onChange={handleRentalFeaturesChange}
                            >
                                {t('seaView')}
                            </Checkbox>
                            <Checkbox
                                colorScheme="green"
                                width={"100%"}
                                isChecked={rentalFeatures.lakeView || false}
                                name={"lakeView"}
                                onChange={handleRentalFeaturesChange}
                            >
                                {t('lakeView')}
                            </Checkbox>
                            <Checkbox
                                colorScheme="green"
                                width={"100%"}
                                isChecked={rentalFeatures.mountainView}
                                name={"mountainView"}
                                onChange={handleRentalFeaturesChange}
                            >
                                {t('mountainView')}
                            </Checkbox>
                            <Checkbox
                                colorScheme="green"
                                width={"100%"}
                                isChecked={rentalFeatures.forestView}
                                name={"forestView"}
                                onChange={handleRentalFeaturesChange}
                            >
                                {t('forestView')}
                            </Checkbox>
                            <Checkbox
                                colorScheme="green"
                                width={"100%"}
                                isChecked={rentalFeatures.courtyard}
                                name={"courtyard"}
                                onChange={handleRentalFeaturesChange}
                            >
                                {t('courtyard')}
                            </Checkbox>
                            <Checkbox
                                colorScheme="green"
                                width={"100%"}
                                isChecked={rentalFeatures.pool}
                                name={"pool"}
                                onChange={handleRentalFeaturesChange}
                            >
                                {t('pool')}
                            </Checkbox>
                            <Checkbox
                                colorScheme="green"
                                width={"100%"}
                                isChecked={rentalFeatures.outdoorShower}
                                name={"outdoorShower"}
                                onChange={handleRentalFeaturesChange}
                            >
                                {t('outdoorShower')}
                            </Checkbox>
                            <Checkbox
                                colorScheme="green"
                                width={"100%"}
                                isChecked={rentalFeatures.bbqArea}
                                name={"bbqArea"}
                                onChange={handleRentalFeaturesChange}
                            >
                                {t('bbqArea')}
                            </Checkbox>
                            <Checkbox
                                colorScheme="green"
                                width={"100%"}
                                isChecked={rentalFeatures.outdoorDining}
                                name={"outdoorDining"}
                                onChange={handleRentalFeaturesChange}
                            >
                                {t('outdoorDining')}
                            </Checkbox>
                            <Checkbox
                                colorScheme="green"
                                width={"100%"}
                                isChecked={rentalFeatures.poolTable}
                                name={"poolTable"}
                                onChange={handleRentalFeaturesChange}
                            >
                                {t('poolTable')}
                            </Checkbox>
                            <Checkbox
                                colorScheme="green"
                                width={"100%"}
                                isChecked={rentalFeatures.gymEquipment}
                                name={"gymEquipment"}
                                onChange={handleRentalFeaturesChange}
                            >
                                {t('gymEquipment')}
                            </Checkbox>
                            <Checkbox
                                colorScheme="green"
                                width={"100%"}
                                isChecked={rentalFeatures.car}
                                name={"car"}
                                onChange={handleRentalFeaturesChange}
                            >
                                {t('car')}
                            </Checkbox>
                            <Checkbox
                                colorScheme="green"
                                width={"100%"}
                                isChecked={rentalFeatures.motorbike}
                                name={"motorbike"}
                                onChange={handleRentalFeaturesChange}
                            >
                                {t('motorbike')}
                            </Checkbox>
                        </Box>
                    </Stack>

                    <Stack direction={{base: 'column', md: 'column'}} width={"100%"}>
                        <VStack width={"100%"}>
                            <Box width={{base: "100%", lg: "100%"}}>
                                <Text fontSize={"16px"} textColor={"#2d9d92"}>{t('kitchen')}</Text>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.fridge}
                                    name={"fridge"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('fridge')}
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.dishwasher}
                                    name={"dishwasher"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('dishwasher')}
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.diningTable}
                                    name={"diningTable"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('diningTable')}
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.kitchenUtensils}
                                    name={"kitchenUtensils"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('kitchenUtensils')}
                                </Checkbox>
                            </Box>

                            <Box width={{base: "100%", lg: "100%"}}>
                                <Text fontSize={"16px"} textColor={"#2d9d92"}>{t('bathroom')}</Text>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.bathtub}
                                    name={"bathtub"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('bathtub')}
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.shower}
                                    name={"shower"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('shower')}
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.washingMachine}
                                    name={"washingMachine"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('washingMachine')}
                                </Checkbox>
                            </Box>

                            <Box width={{base: "100%", lg: "100%"}}>
                                <Text fontSize={"16px"} textColor={"#2d9d92"}>{t('additionally')}</Text>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.cleaning}
                                    name={"cleaning"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('cleaning')}
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.linenChange}
                                    name={"linenChange"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('linenChange')}
                                </Checkbox>
                            </Box>
                        </VStack>

                        <VStack width={"100%"}>
                            <Box width={{base: "100%", lg: "100%"}}>
                                <Text fontSize={"16px"} textColor={"#2d9d92"}>{t('rules')}</Text>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.withPet}
                                    name={"withPet"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('with_pets')}
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.withChildren}
                                    name={"withChildren"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('with_childes')}
                                </Checkbox>
                            </Box>
                            <Box width={{base: "100%", lg: "100%"}}>
                                <Text fontSize={"16px"} textColor={"#2d9d92"}>{t('safety')}</Text>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.videoSurveillance}
                                    name={"videoSurveillance"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('videoSurveillance')}
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.closedTerritory}
                                    name={"closedTerritory"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('closedTerritory')}
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.smokeDetector}
                                    name={"smokeDetector"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('smokeDetector')}
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.firstAidKit}
                                    name={"firstAidKit"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('firstAidKit')}
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.fireExtinguisher}
                                    name={"fireExtinguisher"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('fireExtinguisher')}
                                </Checkbox>
                                <Checkbox
                                    colorScheme="green"
                                    width={"100%"}
                                    isChecked={rentalFeatures.carbonMonoxideDetector}
                                    name={"carbonMonoxideDetector"}
                                    onChange={handleRentalFeaturesChange}
                                >
                                    {t('carbonMonoxideDetector')}
                                </Checkbox>
                            </Box>
                        </VStack>
                    </Stack>
                </Stack>
            }

            <Box width="100%" my='16px'>
                <Stack align={"center"}>
                    <Button
                        backgroundColor={"#2d9d92"}
                        onClick={clearAddFilters}
                        _hover={{background: "#9cb1b1"}}
                    >
                        {t('reset_add_params')}
                    </Button>
                </Stack>
            </Box>


            <Stack direction={{base: 'column', lg: 'row'}} justify='space-between' align={{lg: 'center'}} my='24px'
                   padding={{base: "0px 16px 0px 16px", lg: "0px"}}
            >
                <Box width={{base: "100%", lg: "100%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('description')}:</Heading>
                    <Textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder={t('description')}
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