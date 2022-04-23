import {Genero} from './genero';

export interface User {
    id?: number;
    photo?: any;
    name?: string;
    email?: string;
    gender?: Genero;
    birthDate?: Date;
    active?: string;
    password?: string;
}
