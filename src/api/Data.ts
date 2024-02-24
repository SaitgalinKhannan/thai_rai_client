import axios, {AxiosRequestConfig} from "axios";
import {RealEstateDto, RealEstateInterface, UserDto, UserWithoutPassword} from "./model";
import {ImageInfo} from "../components/Images/Uploader";

export const baseUrl = "http://127.0.0.1:8080"

//"http://194.163.137.181:8080"

interface RealEstateProps {
    limit: number,
    offset: number
}

export interface AuthenticationResponse {
    accessToken: string,
    refreshToken: string
}

export async function userByEmail(email: string, token: string): Promise<UserWithoutPassword> {
    const config: AxiosRequestConfig = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    const response = await axios.post<UserWithoutPassword>(
        `${baseUrl}/api/user/email`,
        {
            "email": email
        },
        config
    )
    return response.data;
}

export async function housesList(props: RealEstateProps | null): Promise<RealEstateInterface[]> {
    let url = props ? `${baseUrl}/api/realestates?limit=${props.limit}&offset=${props.offset}` : `${baseUrl}/realestates`;
    const response = await axios.get<RealEstateInterface[]>(url)
    return response.data;
}

export const image = (id: number): string => `${baseUrl}/files/${id}`

export async function uploadNewHouse(realEstate: RealEstateDto, images: ImageInfo[]): Promise<number> {
    const formData = new FormData();
    const jsonBlob = new Blob([JSON.stringify(realEstate)], {type: 'application/json'});
    const token = localStorage.getItem('accessToken')

    formData.append('realEstateDto', jsonBlob);
    images.forEach((image) => {
        formData.append("files", image.file)
    })

    const response = await axios.post<number>(`${baseUrl}/api/realestates`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
    })
    return response.data;
}

export async function userById(id: number): Promise<UserWithoutPassword> {
    let url = `${baseUrl}/api/user/${id}`;
    const response = await axios.get<UserWithoutPassword>(url)
    return response.data;
}

export async function realEstateById(id: number): Promise<RealEstateInterface> {
    let url = `${baseUrl}/api/realestates/${id}`;
    const response = await axios.get<RealEstateInterface>(url)
    return response.data;
}

export async function registerUser(user: UserDto): Promise<UserWithoutPassword> {
    const response = await axios.post<UserWithoutPassword>(`${baseUrl}/api/user`, user)
    return response.data;
}

export async function authUser(email: string, password: string): Promise<AuthenticationResponse> {
    const response = await axios.post<AuthenticationResponse>(`${baseUrl}/api/auth`, {
        email: email,
        password: password
    });
    return response.data
}

export async function updateUserData(user: UserWithoutPassword, token: string): Promise<boolean> {
    const response = await axios.post<boolean>(`${baseUrl}/api/user/update`, user, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data
}