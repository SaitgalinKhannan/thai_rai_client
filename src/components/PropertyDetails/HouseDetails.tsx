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
    BuildingType, Favorite, Interior, RealEstateInterface, StatusForUsers, translateFacilities,
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

export default function HouseDetails() {
    const {houseId} = useParams();
    const myHouseId: string = houseId ?? "";
    const thaiRaiContext = useContext(ThaiRaiContext);
    const houses: RealEstateInterface[] = thaiRaiContext.realEstates;
    const searchedHouse: RealEstateInterface | undefined = houses.find(value => value.id === parseInt(myHouseId));
    const [owner, setOwner] = useState<UserWithoutPassword | null>(null)
    const [facilities, setFacilities] = useState<string | null>(null)
    const navigate = useNavigate()
    const [favorite, setFavorite] = useState("Добавить в избранное")
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
                    setFavorite("В избранном")
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

            if (favorite === "Добавить в избранное") {
                await saveFavorite(favoriteRealEstate).then(res => {
                    if (res) {
                        setFavorite("В избранном")
                    }
                }).catch(e => {
                    console.log(e)
                })
            } else {
                await deleteFavorite(favoriteRealEstate).then(res => {
                    if (res) {
                        setFavorite("Добавить в избранное")
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
            showToast('loading', 'Загрузка.', "Загружаем данные на сервер.");

            try {
                const result = await deleteRealEstate(searchedHouse.id);

                if (result) {
                    showToast('success', 'Готово.', "Данные успешно удалены.");
                } else {
                    showToast('error', 'Ошибка.', "Не удалить обновить данные.");
                }
            } catch (error) {
                showToast('error', 'Ошибка.', "Не удалить обновить данные.");
                console.log(error);
            }
        } else {
            showToast('error', 'Ошибка.', "Не удалить обновить данные.");
        }
        const updatedRealEstates = thaiRaiContext.realEstates.filter(house => house.id !== searchedHouse?.id);
        thaiRaiContext.setHouses(updatedRealEstates);
        navigate("/")
    }

    useEffect(() => {
        ownerUpload()
        if (searchedHouse?.additionalParametersDto?.facility) {
            const translatedFacilities = translateFacilities(searchedHouse.additionalParametersDto.facility.split(", "));
            setFacilities(translatedFacilities)
        }
    }, [searchedHouse]);

    async function copyTextToClipboard(text: string) {
        await navigator.clipboard.writeText(text)
        toast({
            title: 'Ссылка скопирована',
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
                            <VStack align='left' maxW={{base: '100%', lg: '70%'}} position="relative" width="100%"
                                    margin={0}>
                                <HStack margin={0}>
                                    <Carousel images={searchedHouse.photos ? searchedHouse?.photos : []}/>
                                </HStack>

                                <Stack spacing={{sm: '3', lg: '5'}} direction={{base: 'row', lg: 'row'}}
                                       justifyContent={"space-between"}>
                                    <HStack>
                                        <HStack>
                                            <BiBed size={"24"} style={{color: "#2d9d92"}}/>
                                            <Text
                                                fontSize="18px">{searchedHouse.roomCount} {searchedHouse.roomCount === 1 ? "Комната" : "Комнат"}</Text>
                                        </HStack>

                                        <HStack>
                                            <BiArea size={"24"} style={{color: "#2d9d92"}}/>
                                            <Text fontSize="18px">{searchedHouse.area} кв/м</Text>
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
                                            backgroundColor={(favorite === "В избранном" && isMobile && "#2d9d92") || "#ffffff"}
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
                                            {isMobile || "Поделиться"}
                                            {
                                                isMobile &&
                                                <Image height={"18px"} width={"18px"} padding={0} src={share}/>
                                            }
                                        </Button>
                                    </HStack>

                                </Stack>

                                <Heading fontSize='22px' color={"#2d9d92"}>О недвижимости</Heading>
                                <Stack spacing={{sm: '3', lg: '5'}} direction={{base: "column", lg: "row"}}>
                                    <VStack alignItems={"left"} width={{base: "100%", lg: "50%"}}>
                                        <HStack>
                                            <Text fontSize="16px" color="#757575">Страна: </Text>
                                            <Text fontSize="16px"
                                                  color="#000000">{searchedHouse.addressDto.country}</Text>
                                        </HStack>

                                        <HStack>
                                            <Text fontSize="16px" color="#757575">Провинция: </Text>
                                            <Text fontSize="16px"
                                                  color="#000000">{searchedHouse.addressDto.region}</Text>
                                        </HStack>

                                        <HStack>
                                            <Text fontSize="16px" color="#757575">Район: </Text>
                                            <Text fontSize="16px"
                                                  color="#000000">{searchedHouse.addressDto.district}</Text>
                                        </HStack>

                                        <HStack>
                                            <Text fontSize="16px" color="#757575">Тамбон: </Text>
                                            <Text fontSize="16px"
                                                  color="#000000">{searchedHouse.addressDto.regionInCity}</Text>
                                        </HStack>

                                        <HStack>
                                            <Text fontSize="16px" color="#757575">Количество комнат: </Text>
                                            <Text fontSize="16px" color="#000000">{searchedHouse.roomCount}</Text>
                                        </HStack>

                                        <HStack>
                                            <Text fontSize="16px" color="#757575">Площадь, м²: </Text>
                                            <Text fontSize="16px" color="#000000">{searchedHouse.area}</Text>
                                        </HStack>

                                        <HStack>
                                            <Text fontSize="16px" color="#757575">Этаж: </Text>
                                            <Text fontSize="16px" color="#000000">{searchedHouse.floor}</Text>
                                        </HStack>

                                        <HStack>
                                            <Text fontSize="16px" color="#757575">Этажей в доме: </Text>
                                            <Text fontSize="16px" color="#000000">{searchedHouse.numberOfFloors}</Text>
                                        </HStack>

                                        <HStack>
                                            <Text fontSize="16px" color="#757575">Тип недвижимости: </Text>
                                            <Text fontSize="16px"
                                                  color="#000000">{searchedHouse.newBuilding ? "Новостройка" : "Вторичка"}</Text>
                                        </HStack>
                                    </VStack>

                                    <VStack alignItems={"left"} width={{base: "100%", lg: "50%"}}>
                                        {
                                            searchedHouse.additionalParametersDto?.interior &&
                                            <HStack>
                                                <Text fontSize="16px" color="#757575">Интерьер: </Text>
                                                <Text fontSize="16px"
                                                      color="#000000">{Interior[searchedHouse.additionalParametersDto?.interior as keyof typeof Interior]}</Text>
                                            </HStack>
                                        }
                                        {
                                            searchedHouse.additionalParametersDto?.facility &&
                                            <HStack alignItems={"left"}>
                                                <Text fontSize="16px" color="#757575">Удобства: </Text>
                                                <Text fontSize="16px"
                                                      color="#000000">{facilities}</Text>
                                            </HStack>
                                        }
                                        {
                                            searchedHouse.additionalParametersDto?.rentTime &&
                                            <HStack>
                                                <Text fontSize="16px" color="#757575">Срок аренды: </Text>
                                                <Text fontSize="16px"
                                                      color="#000000">{searchedHouse.additionalParametersDto?.rentTime === "daily" ? "Посуточно" : "Долгосрочно"}</Text>
                                            </HStack>
                                        }
                                        {
                                            searchedHouse.additionalParametersDto?.rules &&
                                            <>
                                                <Heading fontSize='22px' color={"#2d9d92"}>Правила</Heading>
                                                <HStack>
                                                    <Text fontSize="16px" color="#757575">Можно с детьми: </Text>
                                                    <Text fontSize="16px"
                                                          color="#000000">{searchedHouse.additionalParametersDto?.rules.split(", ")[0] === "CHILD" ? "Да" : "Нет"}</Text>
                                                </HStack>
                                                <HStack>
                                                    <Text fontSize="16px" color="#757575">Можно с животными: </Text>
                                                    <Text fontSize="16px"
                                                          color="#000000">{searchedHouse.additionalParametersDto?.rules.split(", ")[1] === "PET" ? "Да" : "Нет"}</Text>
                                                </HStack>
                                            </>
                                        }
                                    </VStack>
                                </Stack>

                                <Heading fontSize='22px' color={"#2d9d92"}>Расположение</Heading>
                                <Text fontSize='22px'>
                                    {searchedHouse.addressDto.region} {searchedHouse.addressDto.district} {searchedHouse.addressDto.regionInCity} {searchedHouse.addressDto.street} {searchedHouse.addressDto.houseNumber} {searchedHouse.addressDto.index}
                                </Text>

                                <Heading fontSize='22px' color={"#2d9d92"}>Описание</Heading>
                                <Text fontSize='18px'>{searchedHouse.description}</Text>
                            </VStack>

                            <VStack width={{base: '100%', lg: '30%'}} marginBottom={"24px"}>
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
                                                Редактировать
                                            </Button>
                                            <Button
                                                backgroundColor={"#2d9d92"}
                                                width={"100%"}
                                                _hover={{background: "#9cb1b1"}}
                                                onClick={onOpen}
                                            >
                                                Удалить
                                            </Button>
                                        </> :
                                        <>
                                            <Button
                                                backgroundColor={"#2d9d92"}
                                                width={"100%"}
                                                _hover={{background: "#9cb1b1"}}
                                                onClick={() => toChat()}
                                            >
                                                Написать
                                            </Button>
                                        </>
                                }
                            </VStack>
                        </Stack>
                    </>

                ) : (
                    <Text fontSize="18px" color={"#2d9d92"}>Загрузка...</Text>
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
                                    Удалить объявление?
                                </AlertDialogHeader>

                                <AlertDialogBody>
                                    Вы уверены? Вы не сможете отменить это действие впоследствии.
                                </AlertDialogBody>

                                <AlertDialogFooter>
                                    <Button
                                        ref={cancelRef}
                                        onClick={onClose}
                                        backgroundColor={"#2d9d92"}
                                        _hover={{background: "#9cb1b1"}}
                                    >
                                        Отменить
                                    </Button>
                                    <Button
                                        backgroundColor={"#1b2222"}
                                        _hover={{background: "#9cb1b1"}}
                                        onClick={() => deleteRealEstateClick()} ml={3}
                                    >
                                        Удалить
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
                        <ModalHeader>Поделиться</ModalHeader>
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
                                onClick={closeModal}>
                                Закрыть
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            }
        </>
    )
}
