import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    AlertDialog, AlertDialogBody,
    AlertDialogContent, AlertDialogFooter, AlertDialogOverlay,
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
    useToast, VStack
} from "@chakra-ui/react";
import React, {useContext, useEffect, useRef, useState} from "react";
import {
    BuildingType,
    buildingTypeMapping, Interior,
    interiorMapping,
    RealEstateDto, RentalFeatures, SaleFeatures,
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
import {useTranslation} from "react-i18next";

export default function NewHouseDetails() {
    const context = useContext(ThaiRaiContext);
    const {t} = useTranslation();
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
    const [buttonText, setButtonText] = useState(t('publish'));
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
        //onOpen()
    }, []);

    useEffect(() => {
        setRentTime(pressedButton)
    }, [pressedButton])

    const handleImagesChange = (newImages: ImageInfo[]) => {
        setImages(newImages);  // Update images state
    };

    const interiorHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value !== "") {
            setInteriorFeatures(event.target.value)
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
                title: t('log_in'),
                status: 'error',
                duration: 500,
                isClosable: true,
                position: 'top'
            })
        } else {
            if (name.trim() === '' || status.trim() === '' || type.trim() === '' || country.trim() === '' || region.trim() === '' || district.trim() === '' || regionInCity.trim() === '' || description.trim() === '') {
                toast({
                    title: t('fill_in_all_the_fields'),
                    status: 'error',
                    duration: 500,
                    isClosable: true,
                    position: 'top'
                })
            } else {
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
                    saleFeaturesDto: saleFeatures,
                    rentalFeaturesDto: rentalFeatures
                }

                console.log(realEstate)

                toastIdRef.current = toast({
                    title: t('downloading'),
                    description: t('data_uploading'),
                    status: 'loading',
                    isClosable: true,
                    position: 'top'
                })

                await uploadNewHouse(realEstate, images)
                    .then(it => {
                            if (toastIdRef.current) {
                                toast.update(toastIdRef.current, {
                                    title: t('success'),
                                    description: t('adv_uploaded_success'),
                                    status: 'success',
                                    duration: 1000,
                                    isClosable: true,
                                    position: 'top'
                                })
                            }
                            setIsUploaded(true)
                            setRealEstateId(it)
                            setButtonText(t('to_adv'))
                        }
                    ).catch(e => {
                            if (toastIdRef.current) {
                                toast.update(toastIdRef.current, {
                                    title: t('error'),
                                    description: t('data_uploaded_error'),
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
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('name')}:</Heading>
                    <Input
                        onChange={e => setName(e.target.value)}
                        background={"#fff"}
                    ></Input>
                </Box>

                <Box width={{base: "100%", lg: "50%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('sale/rent')}:</Heading>
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
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('real_estate_type')}:</Heading>
                    <Select
                        placeholder={`${t('real_estate_type')}:`}
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
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('country')}:</Heading>
                    <Select
                        onChange={e => setCountry(e.target.value)}
                        placeholder={t('country')}
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
                        onChange={e => setRegion(e.target.value)}
                        placeholder={t('province')}
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
                        placeholder={t('district')}
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
                        onChange={e => setStreet(e.target.value)}
                        background={"#fff"}
                    ></Input>
                </Box>
                <Box width={{base: "100%", lg: "50%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('index')}:</Heading>
                    <Input
                        onChange={e => setIndex(e.target.value)}
                        background={"#fff"}
                    ></Input>
                </Box>
                <Box width={{base: "100%", lg: "50%"}}>
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('house')}:</Heading>
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
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('room_count_short')}:</Heading>
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
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('area')}:</Heading>
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
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('floor')}:</Heading>
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
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('total_floors')}:</Heading>
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
                    <Heading fontSize={{base: "18px", lg: "22px"}} color="black">{t('year_of_construction')}:</Heading>
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

            <Accordion allowToggle my='24px' padding={{base: "0px 16px 0px 16px", lg: "0px"}}>
                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <Box as="span" flex='1' textAlign='left'>
                                {t('add_params')}
                            </Box>
                            <AccordionIcon/>
                        </AccordionButton>
                    </h2>
                    <AccordionPanel padding={0}>
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
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>

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
                                    <b>{t('sell_real_estate')}</b>
                                    <br/>
                                    {t('improve_visual')}
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                    <Button
                                        ref={cancelRef}
                                        onClick={onClose}
                                        backgroundColor={"#2d9d92"}
                                        _hover={{background: "#9cb1b1"}}
                                    >
                                        {t('close')}
                                    </Button>
                                    <Button
                                        backgroundColor={"#1b2222"}
                                        _hover={{background: "#9cb1b1"}}
                                        onClick={_ => {
                                        }} ml={3}
                                    >
                                        {t('submit_application')}
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