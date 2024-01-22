import { User } from "../../application/entity/user";
import { IUser } from "../../application/interfaces/userInterface";
import { IUserRepo } from "../../application/repository/user.repository";

export class UserSpyRepo implements IUserRepo {
    private users: User[]

    constructor(users: User[]) {
        this.users = users
    }
    createUser(user: User): Promise<any> {
        try {
            return new Promise((resolve, reject) => {
                resolve(
                    this.users.push(user)
                )
            })
        } catch (error) {
            throw error
        }
    }
    findUserByEmail(email: string): Promise<User | null> {
        const user = this.users.find(users => users.email == email)

        return new Promise(resolve => {
            setTimeout(() => {
                resolve(user ? user : null)
            }, 300)
        })
    }
    findUserByUsername(username: string): Promise<User | null> {

        const user = this.users.find(users => users.username == username)

        return new Promise(resolve => {
            setTimeout(() => {
                resolve(user ? user : null)
            }, 300)
        })
    }
    findUserById(id: string): Promise<User | null> {
        const user = this.users.find(users => users.id == id)

        return new Promise(resolve => {
            setTimeout(() => {
                resolve(user ? user : null)
            }, 300)
        })
    }
    fetchAllUser(filter: Partial<IUser>): Promise<User[]> {

        return new Promise(resolve => {
            setTimeout(() => {
                resolve(this.users)
            }, 300)
        })
    }
    deleteUser(id: string): Promise<void> {
        return new Promise(resolve => {
            this.users = this.users.filter(users => users.id != id)
            setTimeout(() => { resolve() }, 300)
        })
    }
    updateUser(id: string, payload: Partial<IUser>): Promise<User> {
        throw new Error("Method not implemented.");
    }
}
