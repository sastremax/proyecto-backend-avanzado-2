export class MemoryUserManager {
    
    constructor() {
        this.user = [];
    }

    async createUser(userData) {
        const newUser = {id: this.user.length + 1, ...userData}
        this.user.push(newUser);
    }
}