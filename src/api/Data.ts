import axios from "axios";
import {RealEstateInterface} from "../data";

const baseUrl = "http://127.0.0.1:8080"

interface RealEstateProps {
    limit: number,
    offset: number
}

export async function housesList(props: RealEstateProps | null): Promise<RealEstateInterface[]> {
    let url = props ? `${baseUrl}/realestates?limit=${props.limit}&offset=${props.offset}` : `${baseUrl}/realestates`;
    return axios.get<RealEstateInterface[]>(url)
        .then(response => {
            console.log(response.data);
            return response.data;
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
}

export const image = (id: number): string => `${baseUrl}/files/${id}`