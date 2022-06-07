import { IUser } from "./user.model";
import { IWatch } from "./watch.model";

export interface IOrderRequest {
    userId: number | null,
    watchId: number| null
}

export interface IOrder {
    id: number,
    user: IUser,
    watch: IWatch,
    createdAt: Date,
    isCompleted: boolean
}