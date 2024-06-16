import {useNavigate, useParams} from "react-router-dom";
import React, {useContext, useEffect, useRef, useState} from "react";
import {
    AlertDialog,
    AlertDialogBody, AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader, AlertDialogOverlay,
    Box,
    Button,
    Heading,
    HStack,
    Stack,
    Text, ToastId, useBreakpointValue, useDisclosure, useToast,
    VStack, Image, ModalOverlay, ModalHeader, ModalBody, ModalCloseButton, Modal, ModalContent, ModalFooter, background
} from "@chakra-ui/react";
import {BiArea, BiBed} from "react-icons/bi";
import Form from "./Form";
import {ThaiRaiContext} from "../../context/HouseProvider";
import {
    BuildingType, Favorite, Interior, interiorMapping, RealEstateInterface, StatusForUsers, translateFacilities,
    UserWithoutPassword
} from "../../api/model";
import Carousel from "../Houses/Carousel";
import {
    saveFavorite,
    deleteFavorite,
    deleteRealEstate,
    userById,
    checkIsFavorite,
    baseUrl
} from "../../api/Data";
import {AlertStatus} from "@chakra-ui/alert";
import love from "../../assets/images/icons/favorite.png"
import share from "../../assets/images/icons/share.png"
import link from "../../assets/images/icons/link.png"
import {
    LineIcon,
    LineShareButton,
    TelegramIcon,
    TelegramShareButton,
    WhatsappIcon,
    WhatsappShareButton
} from "react-share";
import {useTranslation} from "react-i18next";

export default function HouseDetails() {
    const {t} = useTranslation();
    const {houseId} = useParams();
    const myHouseId: string = houseId ?? "";
    const thaiRaiContext = useContext(ThaiRaiContext);
    const houses: RealEstateInterface[] = thaiRaiContext.realEstates;
    const searchedHouse: RealEstateInterface | undefined = houses.find(value => value.id === parseInt(myHouseId));
    const [owner, setOwner] = useState<UserWithoutPassword | null>(null)
    const navigate = useNavigate()
    const [favorite, setFavorite] = useState(t('add_to_favorites'))
    const {isOpen, onOpen, onClose} = useDisclosure()
    const {isOpen: isModalOpen, onOpen: openModal, onClose: closeModal} = useDisclosure();
    const cancelRef = React.useRef<HTMLButtonElement>(null)
    const isMobile = useBreakpointValue({base: true, lg: false})
    let toast = useToast()
    let toastIdRef = useRef<ToastId>()
    const url = `${baseUrl}/house/${searchedHouse?.id}`;

    useEffect(() => {
        const userId = localStorage.getItem("userId")
        const houseId = parseInt(localStorage.getItem("searchedHouseId") || "")

        if (userId !== null && (searchedHouse?.id !== undefined || !isNaN(houseId))) {
            let favoriteRealEstate: Favorite = {
                userId: parseInt(userId),
                realEstateId: searchedHouse?.id || houseId
            }

            checkIsFavorite(favoriteRealEstate).then(res => {
                if (res) {
                    setFavorite(t('in_favorites'))
                }
            }).catch(e => {
                console.log(e)
            })
        }
    }, []);

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

    async function addFavorite() {
        const userId = localStorage.getItem("userId")
        const houseId = parseInt(localStorage.getItem("searchedHouseId") || "")

        if (userId !== null && (searchedHouse?.id !== undefined || !isNaN(houseId))) {
            let favoriteRealEstate: Favorite = {
                userId: parseInt(userId),
                realEstateId: searchedHouse?.id || houseId
            }

            if (favorite === t('add_to_favorites')) {
                await saveFavorite(favoriteRealEstate).then(res => {
                    if (res) {
                        setFavorite(t('in_favorites'))
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                await deleteFavorite(favoriteRealEstate).then(res => {
                    if (res) {
                        setFavorite(t('add_to_favorites'))
                    }
                }).catch(e => {
                    console.log(e)
                })
            }
        }
    }

    async function ownerUpload() {
        if (searchedHouse != null) {
            userById(searchedHouse?.ownerId)
                .then(user => setOwner(user))
                .catch(e => {
                    console.log(`Не удалось загрузить данные владельца. ${e}`);
                });
        }
    }

    function getBuildingTypeFromString(value: string): string {
        const str = value as keyof typeof BuildingType;
        if (BuildingType[str] != null) {
            return BuildingType[str]
        } else {
            return ""
        }
    }

    function checkUserIsOwner(): boolean {
        const userId = localStorage.getItem("userId");
        return userId !== null && userId === searchedHouse?.ownerId?.toString();
    }

    async function editRealEstate() {
        if (searchedHouse?.id !== null) {
            localStorage.setItem("realEstateId", searchedHouse?.id ? searchedHouse?.id.toString() : "")
            navigate("/edit")
        }
    }

    async function toChat() {
        const userId = localStorage.getItem("userId");
        if (userId !== null && owner?.id !== undefined) {
            navigate(`/chats/${userId}_${owner?.id}`)
        }
    }

    async function deleteRealEstateClick() {
        onClose()
        if (searchedHouse !== undefined) {
            showToast('loading', t('loading'), t('data_uploading'));

            try {
                const result = await deleteRealEstate(searchedHouse.id);

                if (result) {
                    showToast('success', t('success'), t('data_deleted_success'));
                } else {
                    showToast('error', t('error'), t('data_upload_error'));
                }
            } catch (error) {
                showToast('error', t('error'), t('data_upload_error'));
                console.log(error);
            }
        } else {
            showToast('error', t('error'), t('data_upload_error'));
        }
        const updatedRealEstates = thaiRaiContext.realEstates.filter(house => house.id !== searchedHouse?.id);
        thaiRaiContext.setHouses(updatedRealEstates);
        navigate("/")
    }

    useEffect(() => {
        ownerUpload()
    }, [searchedHouse]);

    async function copyTextToClipboard(text: string) {
        await navigator.clipboard.writeText(text)
        toast({
            title: t('link_copied'),
            colorScheme: 'green',
            status: 'success',
            duration: 500,
            isClosable: true,
        })
    }

    return (
        <>
            {
                searchedHouse ? (
                    <>
                        <Stack direction={{base: 'column', lg: 'row'}} justify='space-between'
                               my='28px' padding={{base: "0px 16px 0px 16px", lg: "0px"}}
                        >
                            <Box>
                                <Heading fontSize='32px'>{searchedHouse.name}</Heading>
                                <HStack my={"5px"}>
                                    <Text
                                        borderRadius="10"
                                        boxShadow='md'
                                        bg={"#2d9d92"}
                                        color={"white"}
                                        px={"5px"}
                                        fontSize="16px"
                                    >
                                        {getBuildingTypeFromString(searchedHouse.type)}
                                    </Text>
                                    <Text
                                        borderRadius="10"
                                        boxShadow='md'
                                        bg={"#2d9d92"}
                                        color={"white"}
                                        px={"5px"}
                                        fontSize="16px"
                                    >
                                        {StatusForUsers[searchedHouse.status as keyof typeof StatusForUsers]}
                                    </Text>
                                </HStack>
                            </Box>

                            <HStack>
                                <Text fontWeight="extrabold" fontSize="28px"
                                      color={"black"}> {searchedHouse.price}</Text>
                                <Text fontWeight="extrabold" fontSize="24px" color={"#2d9d92"}> / THB</Text>
                            </HStack>
                        </Stack>

                        <Stack
                            direction={{base: 'column', lg: 'row'}}
                            gap='6'

                            align={{base: 'center', lg: 'flex-start'}}
                            padding={{base: "0px 16px 0px 16px", lg: "0px"}}
                        >
                            <VStack align='left' maxW={{base: '100%', lg: '100%'}} position="relative" width="100%"
                                    margin={0}>
                                <HStack margin={0} alignItems={"flex-start"}>
                                    <Carousel images={searchedHouse.photos ? searchedHouse?.photos : []}/>

                                    {!isMobile && <VStack width={{base: '100%', lg: '30%'}} marginBottom={"24px"}>
                                        <Form owner={owner}/>

                                        {
                                            checkUserIsOwner() ?
                                                <>
                                                    <Button
                                                        backgroundColor={"#2d9d92"}
                                                        width={"100%"}
                                                        _hover={{background: "#9cb1b1"}}
                                                        onClick={() => editRealEstate()}
                                                    >
                                                        {t('edit')}
                                                    </Button>
                                                    <Button
                                                        backgroundColor={"#2d9d92"}
                                                        width={"100%"}
                                                        _hover={{background: "#9cb1b1"}}
                                                        onClick={onOpen}
                                                    >
                                                        {t('delete')}
                                                    </Button>
                                                </> :
                                                <>
                                                    <Button
                                                        backgroundColor={"#2d9d92"}
                                                        width={"100%"}
                                                        _hover={{background: "#9cb1b1"}}
                                                        onClick={() => toChat()}
                                                    >
                                                        {t('write')}
                                                    </Button>
                                                </>
                                        }
                                    </VStack>}
                                </HStack>

                                <Stack spacing={{sm: '3', lg: '5'}} direction={{base: 'row', lg: 'row'}}
                                       justifyContent={"space-between"}>
                                    <HStack>
                                        <HStack>
                                            <BiBed size={"24"} style={{color: "#2d9d92"}}/>
                                            <Text
                                                fontSize="18px">{searchedHouse.roomCount} {searchedHouse.roomCount === 1 ? t('room') : t('rooms')}</Text>
                                        </HStack>

                                        <HStack>
                                            <BiArea size={"24"} style={{color: "#2d9d92"}}/>
                                            <Text fontSize="18px">{searchedHouse.area} {t('sq/m')}</Text>
                                        </HStack>
                                    </HStack>

                                    <HStack>
                                        <Button
                                            size='sm'
                                            variant='outline'
                                            height={"32px"}
                                            color={"#2d9d92"}
                                            padding={{base: "0px", lg: "12px"}}
                                            onClick={() => addFavorite()}
                                            backgroundColor={(favorite === t('in_favorites') && isMobile && "#2d9d92") || "#ffffff"}
                                            _hover={{background: "#e3f2f9"}}
                                        >
                                            {isMobile || favorite}
                                            {
                                                isMobile &&
                                                <Image height={"18px"} width={"18px"} padding={0} src={love}/>
                                            }
                                        </Button>

                                        <Button
                                            size='sm'
                                            variant='outline'
                                            height={"32px"}
                                            color={"#2d9d92"}
                                            padding={{base: "0px", lg: "12px"}}
                                            onClick={openModal}
                                            _hover={{background: "#e3f2f9"}}
                                        >
                                            {isMobile || t('share')}
                                            {
                                                isMobile &&
                                                <Image height={"18px"} width={"18px"} padding={0} src={share}/>
                                            }
                                        </Button>
                                    </HStack>
                                </Stack>

                                {/*<Heading fontSize='22px' color={"#2d9d92"}>{t('about_real_estate')}</Heading>*/}
                                <Stack spacing={{sm: '3', lg: '5'}} direction={{base: "column", lg: "row"}}>
                                    <Stack spacing={{sm: '3', lg: '5'}} direction={{base: "column", lg: "row"}}
                                           width={"100%"}>
                                        <VStack alignItems={"left"} width={"100%"}>
                                            <Heading fontSize='22px'
                                                     color={"#2d9d92"}>{t('about_real_estate')}</Heading>
                                            <HStack>
                                                <Text fontSize="16px" color="#757575">{t('country')}: </Text>
                                                <Text fontSize="16px"
                                                      color="#000000">{searchedHouse.addressDto.country}</Text>
                                            </HStack>

                                            <HStack>
                                                <Text fontSize="16px" color="#757575">{t('province')}: </Text>
                                                <Text fontSize="16px"
                                                      color="#000000">{searchedHouse.addressDto.region}</Text>
                                            </HStack>

                                            <HStack>
                                                <Text fontSize="16px" color="#757575">{t('district')}: </Text>
                                                <Text fontSize="16px"
                                                      color="#000000">{searchedHouse.addressDto.district}</Text>
                                            </HStack>

                                            <HStack>
                                                <Text fontSize="16px" color="#757575">{t('tambon')}: </Text>
                                                <Text fontSize="16px"
                                                      color="#000000">{searchedHouse.addressDto.regionInCity}</Text>
                                            </HStack>

                                            <HStack>
                                                <Text fontSize="16px" color="#757575">{t('room_count')}: </Text>
                                                <Text fontSize="16px" color="#000000">{searchedHouse.roomCount}</Text>
                                            </HStack>

                                            {
                                                searchedHouse.rentalFeaturesDto?.sleepingPlaces &&
                                                <HStack>
                                                    <Text fontSize="16px" color="#757575">{t('sleepingPlaces')}: </Text>
                                                    <Text fontSize="16px"
                                                          color="#000000">{searchedHouse.rentalFeaturesDto?.sleepingPlaces}</Text>
                                                </HStack>
                                            }

                                            <HStack>
                                                <Text fontSize="16px" color="#757575">{t('area')}, м²: </Text>
                                                <Text fontSize="16px" color="#000000">{searchedHouse.area}</Text>
                                            </HStack>

                                            <HStack>
                                                <Text fontSize="16px" color="#757575">{t('floor')}: </Text>
                                                <Text fontSize="16px" color="#000000">{searchedHouse.floor}</Text>
                                            </HStack>

                                            <HStack>
                                                <Text fontSize="16px" color="#757575">{t('floors_in_house')}: </Text>
                                                <Text fontSize="16px"
                                                      color="#000000">{searchedHouse.numberOfFloors}</Text>
                                            </HStack>

                                            <HStack>
                                                <Text fontSize="16px" color="#757575">{t('property_type')}: </Text>
                                                <Text fontSize="16px"
                                                      color="#000000">{searchedHouse.newBuilding ? t('new') : t('secondary')}</Text>
                                            </HStack>

                                            {
                                                (searchedHouse.rentalFeaturesDto?.interior || searchedHouse.saleFeaturesDto?.interior) &&
                                                <HStack>
                                                    <Text fontSize="16px" color="#757575">{t('interior')}: </Text>
                                                    <Text fontSize="16px"
                                                          color="#000000">{(searchedHouse.rentalFeaturesDto?.interior && Interior[searchedHouse?.rentalFeaturesDto?.interior as unknown as keyof typeof Interior]) || (searchedHouse.saleFeaturesDto?.interior && Interior[searchedHouse?.saleFeaturesDto?.interior as unknown as keyof typeof Interior])}</Text>
                                                </HStack>
                                            }

                                            {
                                                searchedHouse.rentalFeaturesDto && <>
                                                    {
                                                        (searchedHouse.rentalFeaturesDto.withPet || searchedHouse.rentalFeaturesDto.withChildren) &&
                                                        <Heading fontSize='22px' color={"#2d9d92"}>{t('rules')}</Heading>
                                                    }

                                                    {searchedHouse.rentalFeaturesDto.withPet &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('with_pets')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.withChildren &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('with_childes')}</Text>}

                                                    {
                                                        (searchedHouse.rentalFeaturesDto.cleaning || searchedHouse.rentalFeaturesDto.linenChange) &&
                                                        <Heading fontSize='22px'
                                                                 color={"#2d9d92"}>{t('additionally')}</Heading>
                                                    }

                                                    {searchedHouse.rentalFeaturesDto.cleaning &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('cleaning')}</Text>}

                                                    {searchedHouse.rentalFeaturesDto.linenChange &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('linenChange')}</Text>}
                                                </>
                                            }
                                        </VStack>

                                        {
                                            searchedHouse.saleFeaturesDto &&
                                            <VStack alignItems={"left"} width={"100%"}>

                                                {
                                                    (
                                                        searchedHouse.saleFeaturesDto.concierge || searchedHouse.saleFeaturesDto.gatedCommunity ||
                                                        searchedHouse.saleFeaturesDto.openParking || searchedHouse.saleFeaturesDto.closedParking ||
                                                        searchedHouse.saleFeaturesDto.closedTerritory || searchedHouse.saleFeaturesDto.gym || searchedHouse.saleFeaturesDto.playground
                                                        || searchedHouse.saleFeaturesDto.recreationArea || searchedHouse.saleFeaturesDto.pool || searchedHouse.saleFeaturesDto.terrace
                                                        || searchedHouse.saleFeaturesDto.wifi || searchedHouse.saleFeaturesDto.washingMachine || searchedHouse.saleFeaturesDto.smokingArea
                                                    ) &&
                                                    <Heading fontSize='22px'
                                                             color={"#2d9d92"}>{t('facilities')}</Heading>
                                                }

                                                {searchedHouse.saleFeaturesDto.concierge &&
                                                    <Text fontSize="16px"
                                                          color="#757575">◦ {t('concierge')}</Text>}
                                                {searchedHouse.saleFeaturesDto.gatedCommunity &&
                                                    <Text fontSize="16px"
                                                          color="#757575">◦ {t('gatedCommunity')}</Text>}
                                                {searchedHouse.saleFeaturesDto.openParking &&
                                                    <Text fontSize="16px"
                                                          color="#757575">◦ {t('openParking')}</Text>}
                                                {searchedHouse.saleFeaturesDto.closedParking &&
                                                    <Text fontSize="16px"
                                                          color="#757575">◦ {t('closedParking')}</Text>}
                                                {searchedHouse.saleFeaturesDto.closedTerritory &&
                                                    <Text fontSize="16px"
                                                          color="#757575">◦ {t('closedTerritory')}</Text>}

                                                {searchedHouse.saleFeaturesDto.gym &&
                                                    <Text fontSize="16px"
                                                          color="#757575">◦ {t('gym')}</Text>}
                                                {searchedHouse.saleFeaturesDto.playground &&
                                                    <Text fontSize="16px"
                                                          color="#757575">◦ {t('playground')}</Text>}
                                                {searchedHouse.saleFeaturesDto.recreationArea &&
                                                    <Text fontSize="16px"
                                                          color="#757575">◦ {t('recreationArea')}</Text>}
                                                {searchedHouse.saleFeaturesDto.pool &&
                                                    <Text fontSize="16px"
                                                          color="#757575">◦ {t('pool')}</Text>}
                                                {searchedHouse.saleFeaturesDto.terrace &&
                                                    <Text fontSize="16px"
                                                          color="#757575">◦ {t('terrace')}</Text>}
                                                {searchedHouse.saleFeaturesDto.wifi &&
                                                    <Text fontSize="16px"
                                                          color="#757575">◦ {t('wifi')}</Text>}
                                                {searchedHouse.saleFeaturesDto.washingMachine &&
                                                    <Text fontSize="16px"
                                                          color="#757575">◦ {t('washingMachine')}</Text>}
                                                {searchedHouse.saleFeaturesDto.smokingArea &&
                                                    <Text fontSize="16px"
                                                          color="#757575">◦ {t('smokingArea')}</Text>}
                                            </VStack> || searchedHouse.rentalFeaturesDto &&
                                            <VStack alignItems={"left"} width={"100%"}>

                                                {
                                                    (
                                                        searchedHouse.rentalFeaturesDto.airportTransfer || searchedHouse.rentalFeaturesDto.concierge ||
                                                        searchedHouse.rentalFeaturesDto.openParking || searchedHouse.rentalFeaturesDto.closedParking ||
                                                        searchedHouse.rentalFeaturesDto.smokingArea
                                                    ) &&
                                                    <Heading fontSize='22px'
                                                             color={"#2d9d92"}>{t('facilities')}</Heading>
                                                }

                                                {searchedHouse.rentalFeaturesDto.airportTransfer &&
                                                    <Text fontSize="16px"
                                                          color="#757575">◦ {t('airportTransfer')}</Text>}
                                                {searchedHouse.rentalFeaturesDto.beachTransfer &&
                                                    <Text fontSize="16px" color="#757575">◦ {t('beachTransfer')}</Text>}
                                                {searchedHouse.rentalFeaturesDto.concierge &&
                                                    <Text fontSize="16px" color="#757575">◦ {t('concierge')}</Text>}
                                                {searchedHouse.rentalFeaturesDto.openParking &&
                                                    <Text fontSize="16px" color="#757575">◦ {t('openParking')}</Text>}
                                                {searchedHouse.rentalFeaturesDto.closedParking &&
                                                    <Text fontSize="16px" color="#757575">◦ {t('closedParking')}</Text>}
                                                {searchedHouse.rentalFeaturesDto.smokingArea &&
                                                    <Text fontSize="16px" color="#757575">◦ {t('smokingArea')}</Text>}

                                                {
                                                    (
                                                        searchedHouse.rentalFeaturesDto.workspace || searchedHouse.rentalFeaturesDto.wifi ||
                                                        searchedHouse.rentalFeaturesDto.tv || searchedHouse.rentalFeaturesDto.airConditioning
                                                    ) &&
                                                    <Heading fontSize='22px'
                                                             color={"#2d9d92"}>{t('facilitiesInside')}</Heading>
                                                }

                                                {searchedHouse.rentalFeaturesDto.workspace &&
                                                    <Text fontSize="16px" color="#757575">◦ {t('workspace')}</Text>}
                                                {searchedHouse.rentalFeaturesDto.wifi &&
                                                    <Text fontSize="16px" color="#757575">◦ {t('wifi')}</Text>}
                                                {searchedHouse.rentalFeaturesDto.tv &&
                                                    <Text fontSize="16px" color="#757575">◦ {t('tv')}</Text>}
                                                {searchedHouse.rentalFeaturesDto.airConditioning &&
                                                    <Text fontSize="16px"
                                                          color="#757575">◦ {t('airConditioning')}</Text>}
                                            </VStack>
                                        }
                                    </Stack>

                                    <Stack spacing={{sm: '3', lg: '5'}} direction={{base: "column", lg: "row"}}
                                           width={"100%"}>
                                        {
                                            searchedHouse.saleFeaturesDto && <>
                                                <VStack alignItems={"left"} width={"100%"}>
                                                    {
                                                        (
                                                            searchedHouse.saleFeaturesDto.fridge || searchedHouse.saleFeaturesDto.dishwasher
                                                            || searchedHouse.saleFeaturesDto.diningTable || searchedHouse.saleFeaturesDto.kitchenUtensils
                                                        ) &&
                                                        <Heading fontSize='22px'
                                                                 color={"#2d9d92"}>{t('kitchen')}</Heading>
                                                    }

                                                    {searchedHouse.saleFeaturesDto.fridge &&
                                                        <Text fontSize="16px"
                                                              color="#757575">◦ {t('fridge')}</Text>}
                                                    {searchedHouse.saleFeaturesDto.dishwasher &&
                                                        <Text fontSize="16px"
                                                              color="#757575">◦ {t('dishwasher')}</Text>}
                                                    {searchedHouse.saleFeaturesDto.diningTable &&
                                                        <Text fontSize="16px"
                                                              color="#757575">◦ {t('diningTable')}</Text>}
                                                    {searchedHouse.saleFeaturesDto.kitchenUtensils &&
                                                        <Text fontSize="16px"
                                                              color="#757575">◦ {t('kitchenUtensils')}</Text>}
                                                </VStack>

                                                <VStack alignItems={"left"} width={"100%"}>
                                                    {
                                                        (
                                                            searchedHouse.saleFeaturesDto.appliances || searchedHouse.saleFeaturesDto.tv
                                                            || searchedHouse.saleFeaturesDto.airConditioning || searchedHouse.saleFeaturesDto.wardrobe
                                                        ) &&
                                                        <Heading fontSize='22px'
                                                                 color={"#2d9d92"}>{t('livingRoom')}</Heading>
                                                    }

                                                    {searchedHouse.saleFeaturesDto.appliances &&
                                                        <Text fontSize="16px"
                                                              color="#757575">◦ {t('appliances')}</Text>}
                                                    {searchedHouse.saleFeaturesDto.tv &&
                                                        <Text fontSize="16px"
                                                              color="#757575">◦ {t('tv')}</Text>}
                                                    {searchedHouse.saleFeaturesDto.airConditioning &&
                                                        <Text fontSize="16px"
                                                              color="#757575">◦ {t('airConditioning')}</Text>}
                                                    {searchedHouse.saleFeaturesDto.wardrobe &&
                                                        <Text fontSize="16px"
                                                              color="#757575">◦ {t('wardrobe')}</Text>}
                                                </VStack>
                                            </> ||
                                            searchedHouse.rentalFeaturesDto && <>
                                                <VStack alignItems={"left"} width={"100%"}>
                                                    {
                                                        (
                                                            searchedHouse.rentalFeaturesDto.seaView || searchedHouse.rentalFeaturesDto.lakeView ||
                                                            searchedHouse.rentalFeaturesDto.mountainView || searchedHouse.rentalFeaturesDto.forestView ||
                                                            searchedHouse.rentalFeaturesDto.courtyard || searchedHouse.rentalFeaturesDto.pool ||
                                                            searchedHouse.rentalFeaturesDto.outdoorShower || searchedHouse.rentalFeaturesDto.bbqArea ||
                                                            searchedHouse.rentalFeaturesDto.outdoorDining || searchedHouse.rentalFeaturesDto.poolTable ||
                                                            searchedHouse.rentalFeaturesDto.gymEquipment || searchedHouse.rentalFeaturesDto.car ||
                                                            searchedHouse.rentalFeaturesDto.motorbike
                                                        ) &&
                                                        <Heading fontSize='22px'
                                                                 color={"#2d9d92"}>{t('peculiarities')}</Heading>
                                                    }

                                                    {searchedHouse.rentalFeaturesDto.seaView &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('seaView')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.lakeView &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('lakeView')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.mountainView &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('mountainView')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.forestView &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('forestView')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.courtyard &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('courtyard')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.pool &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('pool')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.outdoorShower &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('outdoorShower')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.bbqArea &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('bbqArea')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.outdoorDining &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('outdoorDining')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.poolTable &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('poolTable')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.gymEquipment &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('gymEquipment')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.car &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('car')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.motorbike &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('motorbike')}</Text>}

                                                    {
                                                        (searchedHouse.rentalFeaturesDto.cleaning || searchedHouse.rentalFeaturesDto.linenChange) &&
                                                        <Heading fontSize='22px'
                                                                 color={"#2d9d92"}>{t('additionally')}</Heading>
                                                    }

                                                    {searchedHouse.rentalFeaturesDto.cleaning &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('cleaning')}</Text>}

                                                    {searchedHouse.rentalFeaturesDto.linenChange &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('linenChange')}</Text>}
                                                </VStack>

                                                <VStack alignItems={"left"} width={"100%"}>
                                                    {
                                                        (
                                                            searchedHouse.rentalFeaturesDto.airportTransfer || searchedHouse.rentalFeaturesDto.beachTransfer ||
                                                            searchedHouse.rentalFeaturesDto.concierge || searchedHouse.rentalFeaturesDto.openParking ||
                                                            searchedHouse.rentalFeaturesDto.closedParking || searchedHouse.rentalFeaturesDto.smokingArea
                                                        ) &&
                                                        <Heading fontSize='22px' color={"#2d9d92"}>{t('kitchen')}</Heading>
                                                    }

                                                    {searchedHouse.rentalFeaturesDto.airportTransfer &&
                                                        <Text fontSize="16px"
                                                              color="#757575">◦ {t('airportTransfer')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.beachTransfer &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('beachTransfer')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.concierge &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('concierge')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.openParking &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('openParking')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.closedParking &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('closedParking')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.smokingArea &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('smokingArea')}</Text>}

                                                    {
                                                        (
                                                            searchedHouse.rentalFeaturesDto.workspace || searchedHouse.rentalFeaturesDto.wifi ||
                                                            searchedHouse.rentalFeaturesDto.tv || searchedHouse.rentalFeaturesDto.airConditioning
                                                        ) &&
                                                        <Heading fontSize='22px' color={"#2d9d92"}>{t('bathroom')}</Heading>
                                                    }

                                                    {searchedHouse.rentalFeaturesDto.workspace &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('workspace')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.wifi &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('wifi')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.tv &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('tv')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.airConditioning &&
                                                        <Text fontSize="16px"
                                                              color="#757575">◦ {t('airConditioning')}</Text>}

                                                    {
                                                        (
                                                            searchedHouse.rentalFeaturesDto.videoSurveillance || searchedHouse.rentalFeaturesDto.closedTerritory ||
                                                            searchedHouse.rentalFeaturesDto.smokeDetector || searchedHouse.rentalFeaturesDto.firstAidKit ||
                                                            searchedHouse.rentalFeaturesDto.carbonMonoxideDetector || searchedHouse.rentalFeaturesDto.fireExtinguisher
                                                        ) &&
                                                        <Heading fontSize='22px' color={"#2d9d92"}>{t('safety')}</Heading>
                                                    }

                                                    {searchedHouse.rentalFeaturesDto.videoSurveillance &&
                                                        <Text fontSize="16px"
                                                              color="#757575">◦ {t('videoSurveillance')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.closedTerritory &&
                                                        <Text fontSize="16px"
                                                              color="#757575">◦ {t('closedTerritory')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.smokeDetector &&
                                                        <Text fontSize="16px" color="#757575">◦ {t('smokeDetector')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.firstAidKit &&
                                                        <Text fontSize="16px"
                                                              color="#757575">◦ {t('firstAidKit')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.fireExtinguisher &&
                                                        <Text fontSize="16px"
                                                              color="#757575">◦ {t('fireExtinguisher')}</Text>}
                                                    {searchedHouse.rentalFeaturesDto.carbonMonoxideDetector &&
                                                        <Text fontSize="16px"
                                                              color="#757575">◦ {t('carbonMonoxideDetector')}</Text>}
                                                </VStack>
                                            </>
                                        }
                                    </Stack>
                                </Stack>

                                <Heading fontSize='22px' color={"#2d9d92"}>{t('location')}</Heading>
                                <Text fontSize='22px'>
                                    {searchedHouse.addressDto.region} {searchedHouse.addressDto.district} {searchedHouse.addressDto.regionInCity} {searchedHouse.addressDto.street} {searchedHouse.addressDto.houseNumber} {searchedHouse.addressDto.index}
                                </Text>

                                <Heading fontSize='22px' color={"#2d9d92"}>{t('description')}</Heading>
                                <Text fontSize='18px'>{searchedHouse.description}</Text>
                            </VStack>

                            {
                                isMobile && <VStack width={'100%'} marginBottom={"24px"}>
                                    <Form owner={owner}/>

                                    {
                                        checkUserIsOwner() ?
                                            <>
                                                <Button
                                                    backgroundColor={"#2d9d92"}
                                                    width={"100%"}
                                                    _hover={{background: "#9cb1b1"}}
                                                    onClick={() => editRealEstate()}
                                                >
                                                    {t('edit')}
                                                </Button>
                                                <Button
                                                    backgroundColor={"#2d9d92"}
                                                    width={"100%"}
                                                    _hover={{background: "#9cb1b1"}}
                                                    onClick={onOpen}
                                                >
                                                    {t('delete')}
                                                </Button>
                                            </> :
                                            <>
                                                <Button
                                                    backgroundColor={"#2d9d92"}
                                                    width={"100%"}
                                                    _hover={{background: "#9cb1b1"}}
                                                    onClick={() => toChat()}
                                                >
                                                    {t('write')}
                                                </Button>
                                            </>
                                    }
                                </VStack>
                            }
                        </Stack>
                    </>

                ) : (
                    <Text fontSize="18px" color={"#2d9d92"}>{t('downloading')}...</Text>
                )
            }

            {
                <>
                    <AlertDialog
                        isOpen={isOpen}
                        leastDestructiveRef={cancelRef}
                        onClose={onClose}
                    >
                        <AlertDialogOverlay>
                            <AlertDialogContent>
                                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                    {t('remove_adv')}
                                </AlertDialogHeader>

                                <AlertDialogBody>
                                    {t('are_you_sure')}
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                    <Button
                                        ref={cancelRef}
                                        onClick={onClose}
                                        backgroundColor={"#2d9d92"}
                                        _hover={{background: "#9cb1b1"}}
                                    >
                                        {t('cancel')}
                                    </Button>
                                    <Button
                                        backgroundColor={"#1b2222"}
                                        _hover={{background: "#9cb1b1"}}
                                        onClick={() => deleteRealEstateClick()} ml={3}
                                    >
                                        {t('delete')}
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
                </>
            }

            {
                <Modal isOpen={isModalOpen} onClose={closeModal} isCentered>
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalHeader>{t('share')}</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                            <HStack padding={0} marginBottom={"10px"} justifyContent={"space-evenly"}>
                                <TelegramShareButton
                                    url={url}
                                    title={searchedHouse?.name || ""}
                                    className="Demo__some-network__share-button"
                                >
                                    <TelegramIcon size={64} round/>
                                </TelegramShareButton>

                                <WhatsappShareButton
                                    url={url}
                                    title={searchedHouse?.name || ""}
                                    separator=":: "
                                    className="Demo__some-network__share-button"
                                >
                                    <WhatsappIcon size={64} round/>
                                </WhatsappShareButton>

                                <LineShareButton
                                    url={url}
                                    title={searchedHouse?.name || ""}
                                    className="Demo__some-network__share-button"
                                >
                                    <LineIcon size={64} round/>
                                </LineShareButton>

                                <Button
                                    backgroundColor={"#f2f1f0"}
                                    _hover={{background: "#f2f1f0"}}
                                    width={"64px"}
                                    height={"64px"}
                                    borderRadius={"100%"}
                                    onClick={() => copyTextToClipboard(url)}
                                >
                                    <Image src={link}/>
                                </Button>
                            </HStack>
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                backgroundColor={"#2d9d92"}
                                _hover={{background: "#9cb1b1"}}
                                mr={3}
                                onClick={closeModal}
                            >
                                {t('close')}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            }
        </>
    )
}
