export default interface RealEstateContext {
    realEstates: RealEstateInterface[];
    city: string
    setCity(city: string): void
    price: string,
    setPrice(price: string): void
    property: string,
    setProperty(property: string): void,
    cities: string[]
    properties: string[],
    isLoading: boolean,
    searchHandler: () => void,
    resetFilter: () => void,
    offset: number,
    setOffset(offset: number): void
}

export const bannerData = [
    {1200: 'Premium Product'},
    {4500: 'Happy Customer'},
    {'240': 'Award Winning'}
]


export const countries = [
    "Тайланд",
    "Россия"
]

export const cities = [
    "Phuket",
    "Pattaya",
]

export interface Address {
    id: number;
    country: string;
    region: string;
    district: string;
    regionInCity: string;
    street: string;
    index: string;
    houseNumber: string;
}

export interface AddressDto {
    id?: number;
    country: string;
    region: string;
    district: string;
    regionInCity: string;
    street: string;
    index: string;
    houseNumber: string;
}

export interface Photo {
    id: number;
    realEstateId: number;
    imageUrl: string;
}

export interface PhotoDto {
    id?: number;
    realEstateId?: number;
    imageUrl: string;
}

export interface RealEstateInterface {
    id: number;
    owner: User;
    name: string;
    price: number;
    status: string;
    newBuilding: boolean;
    type: string;
    roomCount: number;
    area: number;
    description: string;
    constructionYear: number;
    floor: number;
    numberOfFloors: number;
    address: Address;
    createdAt: Date;
    updatedAt: Date;
    photos: Photo[];
}

export interface RealEstateDto {
    id?: number;
    owner: UserDto;
    name: string;
    price: number;
    status: string;
    newBuilding: boolean;
    type: string;
    roomCount: number;
    area: number;
    description: string;
    constructionYear: number;
    floor: number;
    numberOfFloors: number;
    address: AddressDto;
    createdAt?: Date;
    updatedAt?: Date;
    photos?: PhotoDto[];
}

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: Role;
    password: string;
}

export interface UserDto {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: Role;
    password: string;
}

export enum Role {
    ADMIN = "ADMIN",
    USER = "USER"
}

export const user: User = {
    id: 1,
    firstName: "Alina",
    lastName: "Rin",
    email: "email@gmail.com",
    phone: "+79991309576",
    role: Role.USER,
    password: "123"
}

export enum Status {
    RENT = "Сдача в аренду",
    SALE = "Продажа"
}

export const statusMapping = {
    [Status.RENT]: 'RENT',
    [Status.SALE]: 'SALE'
};

export enum BuildingType {
    HOUSE = "Дом",
    CONDO = "Кондо",
    APARTMENT = "Квартира"
}

export const realEstate: RealEstateInterface[] = [{
    id: 1,
    owner: {
        id: 1,
        firstName: "Alina",
        lastName: "Rin",
        email: "email@gmail.com",
        phone: "+79991309576",
        role: Role.USER,
        password: "123"
    },
    name: "Cozy apartment in the city center",
    price: 100000,
    status: statusMapping[Status.SALE],
    newBuilding: false,
    type: "Apartment",
    roomCount: 2,
    area: 50,
    description: "A beautiful and cozy apartment located in the heart of the city center.",
    constructionYear: 2005,
    floor: 3,
    numberOfFloors: 5,
    address: {
        id: 1,
        country: "USA",
        region: "Ufa",
        district: "",
        regionInCity: "Manhattan",
        street: "Broadway",
        index: "10001",
        houseNumber: "123"
    },
    createdAt: new Date(1478708162000),
    updatedAt: new Date(1478708162000),
    photos: [
        {
            id: 1,
            realEstateId: 1,
            imageUrl: "https://a0.muscache.com/im/pictures/miso/Hosting-30342158/original/1fe22d65-eb28-452c-92bf-ab62d55697f3.jpeg?im_w=1440"
        },
        {
            id: 2,
            realEstateId: 1,
            imageUrl: "https://a0.muscache.com/im/pictures/miso/Hosting-30342158/original/e01228af-5697-49a0-a78e-3a34496b5109.jpeg?im_w=1440"
        }
    ]
}, {
    id: 2,
    owner: {
        id: 1,
        firstName: "Alina",
        lastName: "Rin",
        email: "email@gmail.com",
        phone: "+79991309576",
        role: Role.USER,
        password: "123"
    },
    name: "Cozy apartment in the city center",
    price: 100000,
    status: statusMapping[Status.SALE],
    newBuilding: false,
    type: "Apartment",
    roomCount: 2,
    area: 50,
    description: "A beautiful and cozy apartment located in the heart of the city center.",
    constructionYear: 2005,
    floor: 3,
    numberOfFloors: 5,
    address: {
        id: 1,
        country: "USA",
        region: "Moscow",
        district: "",
        regionInCity: "Manhattan",
        street: "Broadway",
        index: "10001",
        houseNumber: "123"
    },
    createdAt: new Date(1478708162000),
    updatedAt: new Date(1478708162000),
    photos: [
        {
            id: 1,
            realEstateId: 1,
            imageUrl: "https://a0.muscache.com/im/pictures/43b18a51-7a85-4e85-8006-4b261887bdd7.jpg?im_w=1440"
        },
        {
            id: 2,
            realEstateId: 1,
            imageUrl: "https://a0.muscache.com/im/pictures/miso/Hosting-30342158/original/d8946442-e3b5-47d2-873d-b192792e6b03.jpeg?im_w=720"
        }
    ]
}, {
    id: 3,
    owner: {
        id: 1,
        firstName: "Alina",
        lastName: "Rin",
        email: "email@gmail.com",
        phone: "+79991309576",
        role: Role.USER,
        password: "123"
    },
    name: "Cozy apartment in the city center",
    price: 100000,
    status: statusMapping[Status.SALE],
    newBuilding: false,
    type: "House",
    roomCount: 2,
    area: 50,
    description: "A beautiful and cozy apartment located in the heart of the city center.",
    constructionYear: 2005,
    floor: 3,
    numberOfFloors: 5,
    address: {
        id: 1,
        country: "USA",
        region: "New York",
        district: "",
        regionInCity: "Manhattan",
        street: "Broadway",
        index: "10001",
        houseNumber: "123"
    },
    createdAt: new Date(1478708162000),
    updatedAt: new Date(1478708162000),
    photos: [
        {
            id: 1,
            realEstateId: 1,
            imageUrl: "https://a0.muscache.com/im/pictures/43b18a51-7a85-4e85-8006-4b261887bdd7.jpg?im_w=1440"
        },
        {
            id: 2,
            realEstateId: 1,
            imageUrl: "https://a0.muscache.com/im/pictures/miso/Hosting-30342158/original/d8946442-e3b5-47d2-873d-b192792e6b03.jpeg?im_w=720"
        }
    ]
},
    {
        id: 4,
        owner: {
            id: 1,
            firstName: "Alina",
            lastName: "Rin",
            email: "email@gmail.com",
            phone: "+79991309576",
            role: Role.USER,
            password: "123"
        },
        name: "Cozy apartment in the city center",
        price: 100000,
        status: statusMapping[Status.SALE],
        newBuilding: false,
        type: "Town house",
        roomCount: 2,
        area: 50,
        description: "A beautiful and cozy apartment located in the heart of the city center.",
        constructionYear: 2005,
        floor: 3,
        numberOfFloors: 5,
        address: {
            id: 1,
            country: "USA",
            region: "New York",
            district: "",
            regionInCity: "Manhattan",
            street: "Broadway",
            index: "10001",
            houseNumber: "123"
        },
        createdAt: new Date(1478708162000),
        updatedAt: new Date(1478708162000),
        photos: [
            {
                id: 1,
                realEstateId: 1,
                imageUrl: "https://a0.muscache.com/im/pictures/43b18a51-7a85-4e85-8006-4b261887bdd7.jpg?im_w=1440"
            },
            {
                id: 2,
                realEstateId: 1,
                imageUrl: "https://a0.muscache.com/im/pictures/miso/Hosting-30342158/original/d8946442-e3b5-47d2-873d-b192792e6b03.jpeg?im_w=720"
            }
        ]
    },
    {
        id: 5,
        owner: {
            id: 1,
            firstName: "Alina",
            lastName: "Rin",
            email: "email@gmail.com",
            phone: "+79991309576",
            role: Role.USER,
            password: "123"
        },
        name: "Cozy apartment in the city center",
        price: 100000,
        status: statusMapping[Status.SALE],
        newBuilding: false,
        type: "Apartment",
        roomCount: 2,
        area: 50,
        description: "A beautiful and cozy apartment located in the heart of the city center.",
        constructionYear: 2005,
        floor: 3,
        numberOfFloors: 5,
        address: {
            id: 1,
            country: "USA",
            region: "New York",
            district: "",
            regionInCity: "Manhattan",
            street: "Broadway",
            index: "10001",
            houseNumber: "123"
        },
        createdAt: new Date(1478708162000),
        updatedAt: new Date(1478708162000),
        photos: [
            {
                id: 1,
                realEstateId: 1,
                imageUrl: "https://a0.muscache.com/im/pictures/43b18a51-7a85-4e85-8006-4b261887bdd7.jpg?im_w=1440"
            },
            {
                id: 2,
                realEstateId: 1,
                imageUrl: "https://a0.muscache.com/im/pictures/miso/Hosting-30342158/original/d8946442-e3b5-47d2-873d-b192792e6b03.jpeg?im_w=720"
            }
        ]
    },
    {
        id: 6,
        owner: {
            id: 1,
            firstName: "Alina",
            lastName: "Rin",
            email: "email@gmail.com",
            phone: "+79991309576",
            role: Role.USER,
            password: "123"
        },
        name: "Cozy apartment in the city center",
        price: 100000,
        status: statusMapping[Status.SALE],
        newBuilding: false,
        type: "Apartment",
        roomCount: 2,
        area: 50,
        description: "A beautiful and cozy apartment located in the heart of the city center.",
        constructionYear: 2005,
        floor: 3,
        numberOfFloors: 5,
        address: {
            id: 1,
            country: "USA",
            region: "New York",
            district: "",
            regionInCity: "Manhattan",
            street: "Broadway",
            index: "10001",
            houseNumber: "123"
        },
        createdAt: new Date(1478708162000),
        updatedAt: new Date(1478708162000),
        photos: [
            {
                id: 1,
                realEstateId: 1,
                imageUrl: "https://a0.muscache.com/im/pictures/43b18a51-7a85-4e85-8006-4b261887bdd7.jpg?im_w=1440"
            },
            {
                id: 2,
                realEstateId: 1,
                imageUrl: "https://a0.muscache.com/im/pictures/miso/Hosting-30342158/original/d8946442-e3b5-47d2-873d-b192792e6b03.jpeg?im_w=720"
            }
        ]
    },
    {
        id: 7,
        owner: {
            id: 1,
            firstName: "Alina",
            lastName: "Rin",
            email: "email@gmail.com",
            phone: "+79991309576",
            role: Role.USER,
            password: "123"
        },
        name: "Cozy apartment in the city center",
        price: 100000,
        status: statusMapping[Status.SALE],
        newBuilding: false,
        type: "Apartment",
        roomCount: 2,
        area: 50,
        description: "A beautiful and cozy apartment located in the heart of the city center.",
        constructionYear: 2005,
        floor: 3,
        numberOfFloors: 5,
        address: {
            id: 1,
            country: "USA",
            region: "New York",
            district: "",
            regionInCity: "Manhattan",
            street: "Broadway",
            index: "10001",
            houseNumber: "123"
        },
        createdAt: new Date(1478708162000),
        updatedAt: new Date(1478708162000),
        photos: [
            {
                id: 1,
                realEstateId: 1,
                imageUrl: "https://a0.muscache.com/im/pictures/43b18a51-7a85-4e85-8006-4b261887bdd7.jpg?im_w=1440"
            },
            {
                id: 2,
                realEstateId: 1,
                imageUrl: "https://a0.muscache.com/im/pictures/miso/Hosting-30342158/original/d8946442-e3b5-47d2-873d-b192792e6b03.jpeg?im_w=720"
            }
        ]
    }]