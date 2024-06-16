import axios, {AxiosRequestConfig} from "axios";
import {Favorite, Filter, Photo, RealEstateDto, RealEstateInterface, UserDto, UserWithoutPassword} from "./model";
import {ImageInfo} from "../components/Images/Uploader";
import {ChatMessageDto, MessageType} from "../context/ChatProvider";
import {ChatRoomDto} from "../components/Chat/ChatRoom";

//export const baseUrlForApi = "https://c1bb-80-244-32-124.ngrok-free.app"
//export const wsUrl = "https://c1bb-80-244-32-124.ngrok-free.app/ws"
//export const baseUrl = "https://5e79-80-244-32-124.ngrok-free.app"

export const baseUrlForApi = "http://127.0.0.1:8080"
export const wsUrl = "http://127.0.0.1:8080/ws"
export const baseUrl = "http://localhost:3000"

//export const baseUrlForApi = "https://thairai.group:8443"
//export const wsUrl = "https://thairai.group:8443/ws"
//export const baseUrl = "https://thairai.group"

interface RealEstateProps {
    limit: number,
    offset: number
}

export interface AuthenticationResponse {
    accessToken: string,
    refreshToken: string
}

export interface ChatNotificationDto {
    chatId: string,
    sender: UserWithoutPassword,
    messageId: string,
    message: string,
    messageType: MessageType
}

export const saveFavorite = async (favorite: Favorite): Promise<boolean> => {
    try {
        const response = await axios.post(`${baseUrlForApi}/api/realestates/add-favorites`, favorite);
        return response.data;
    } catch (error) {
        console.error('Error adding favorite:', error);
        return false;
    }
};

export const deleteFavorite = async (favorite: Favorite): Promise<boolean> => {
    try {
        const response = await axios.post(`${baseUrlForApi}/api/realestates/delete-favorites`, favorite);
        return response.data;
    } catch (error) {
        console.error('Error deleting favorite:', error);
        return false;
    }
};

export const checkIsFavorite = async (favorite: Favorite): Promise<boolean> => {
    try {
        const response = await axios.post(`${baseUrlForApi}/api/realestates/check-is-favorite`, favorite);
        return response.data;
    } catch (error) {
        console.error('Error deleting favorite:', error);
        return false;
    }
};

export async function userByEmail(email: string, token: string): Promise<UserWithoutPassword> {
    const config: AxiosRequestConfig = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    try {
        const response = await axios.post<UserWithoutPassword>(
            `${baseUrlForApi}/api/user/email`,
            {
                "email": email
            },
            config
        )
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function housesList(props: RealEstateProps, filter: Filter | null): Promise<RealEstateInterface[]> {
    let url = `${baseUrlForApi}/api/realestates?limit=${props.limit}&offset=${props.offset}`;

    try {
        const response = await axios.post<RealEstateInterface[]>(url, filter, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function favoritesHousesList(props: RealEstateProps, userId: number): Promise<RealEstateInterface[]> {
    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify(userId)], {type: 'application/json'});
    const token = localStorage.getItem('accessToken')

    formData.append('userId', jsonBlob);

    let url = `${baseUrlForApi}/api/realestates/favorites?limit=${props.limit}&offset=${props.offset}`;

    try {
        const response = await axios.post<RealEstateInterface[]>(url, userId, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function realEstatesByOwnerId(props: RealEstateProps, userId: number): Promise<RealEstateInterface[]> {
    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify(userId)], {type: 'application/json'});
    const token = localStorage.getItem('accessToken')

    formData.append('userId', jsonBlob);

    let url = `${baseUrlForApi}/api/realestates/my?limit=${props.limit}&offset=${props.offset}`;

    try {
        const response = await axios.post<RealEstateInterface[]>(url, userId, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const image = (id: number): string => `${baseUrlForApi}/api/files/${id}`
export const userPhoto = (id: number): string => `${baseUrlForApi}/api/files/user/${id}`

export async function uploadNewHouse(realEstate: RealEstateDto, images: ImageInfo[]): Promise<number> {
    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify(realEstate)], {type: 'application/json'});
    const token = localStorage.getItem('accessToken')

    formData.append('realEstateDto', jsonBlob);
    images.forEach((image) => {
        formData.append("files", image.file)
    })

    try {
        const response = await axios.post<number>(`${baseUrlForApi}/api/realestates/create`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })
        console.log(response)

        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function userById(id: number): Promise<UserWithoutPassword> {
    let url = `${baseUrlForApi}/api/user/${id}`;

    try {
        const response = await axios.get<UserWithoutPassword>(url)
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function realEstateById(id: number): Promise<RealEstateInterface> {
    let url = `${baseUrlForApi}/api/realestates/${id}`;

    try {
        const response = await axios.get<RealEstateInterface>(url)
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function registerUser(user: UserDto): Promise<UserWithoutPassword> {
    try {
        const response = await axios.post<UserWithoutPassword>(`${baseUrlForApi}/api/user`, user)
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function authUser(email: string, password: string): Promise<AuthenticationResponse> {
    try {
        const response = await axios.post<AuthenticationResponse>(`${baseUrlForApi}/api/auth`, {
            email: email,
            password: password
        });
        return response.data
    } catch (error) {
        throw error;
    }
}

export async function updateUserData(user: UserWithoutPassword, token: string): Promise<boolean> {
    try {
        const response = await axios.post<boolean>(`${baseUrlForApi}/api/user/update`, user, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data
    } catch (error) {
        throw error;
    }
}

export async function updateRealEstate(realEstate: RealEstateDto, images: ImageInfo[], deletedPhotoIds: number[]): Promise<boolean> {
    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify(realEstate)], {type: 'application/json'});
    const deletedPhotoIdBlob = new Blob([JSON.stringify(deletedPhotoIds)], {type: 'application/json'});
    formData.append('deletedPhotoIds', deletedPhotoIdBlob);
    const token = localStorage.getItem('accessToken')
    formData.append('realEstateDto', jsonBlob);
    images.forEach((image) => {
        formData.append("files", image.file)
    })

    try {
        const response = await axios.post<boolean>(`${baseUrlForApi}/api/realestates/update`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })

        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteRealEstate(id: number): Promise<boolean> {
    const formData = new FormData();
    const token = localStorage.getItem('accessToken');
    console.log(formData)

    try {
        const response = await axios.post<boolean>(`${baseUrlForApi}/api/realestates/delete`, id, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}

async function loadImageInfo(photo: Photo): Promise<ImageInfo> {
    const imageUrl = image(photo.id)
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], photo.imageUrl.split('/').pop() ?? "", {type: blob.type});
    return {id: photo.id, file: file, url: imageUrl, isOld: true};
}

export async function loadImageInfoArray(imageUrls: Photo[]): Promise<ImageInfo[]> {
    const promises = imageUrls.map(photo => loadImageInfo(photo));
    return await Promise.all(promises);
}

export function zipArrays<T, U>(arr1: T[], arr2: U[]): [T, U][] {
    const zippedArray: [T, U][] = [];
    const minLength = Math.min(arr1.length, arr2.length);

    for (let i = 0; i < minLength; i++) {
        zippedArray.push([arr1[i], arr2[i]]);
    }

    return zippedArray;
}

export async function uploadPhotoProfile(userId: number, image: ImageInfo): Promise<boolean> {
    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify(userId)], {type: 'application/json'});
    const token = localStorage.getItem('accessToken')

    formData.append('userId', jsonBlob);
    formData.append("file", image.file)

    try {
        const response = await axios.post<boolean>(`${baseUrlForApi}/api/user/photo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })

        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getUser(id: number): Promise<UserWithoutPassword> {
    if (!localStorage.getItem('accessToken')) {
        return Promise.reject('No access token set.');
    }

    try {
        const response = await axios.get(`${baseUrlForApi}/api/user/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function getChatRooms(senderId: number): Promise<ChatRoomDto[]> {
    if (!localStorage.getItem('accessToken')) {
        return Promise.reject('No access token set.');
    }

    try {
        const response = await axios.get(`${baseUrlForApi}/api/chat/rooms/${senderId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function countNewMessages(senderId: string, recipientId: string): Promise<number> {
    if (!localStorage.getItem('accessToken')) {
        return Promise.reject('No access token set.');
    }

    try {
        const response = await axios.get(`${baseUrlForApi}/messages/${senderId}/${recipientId}/count`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function findChatMessages(senderId: number, recipientId: number): Promise<ChatMessageDto[]> {
    if (!localStorage.getItem('accessToken')) {
        return Promise.reject('No access token set.');
    }

    try {
        const response = await axios.get(`${baseUrlForApi}/messages/${senderId}/${recipientId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function findChatMessage(id: string): Promise<ChatMessageDto> {
    if (!localStorage.getItem('accessToken')) {
        return Promise.reject('No access token set.');
    }

    try {
        const response = await axios.get<ChatMessageDto>(`${baseUrlForApi}/messages/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export async function deleteChatMessage(message: ChatMessageDto): Promise<boolean> {
    const json = new Blob([JSON.stringify(message)], {type: 'application/json'});
    const token = localStorage.getItem('accessToken')

    try {
        const response = await axios.post<boolean>(`${baseUrlForApi}/messages/delete`, json, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        return response.data;
    } catch (error) {
        throw error;
    }
}