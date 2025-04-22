import config from '../config/config.js';

let userManager;

switch (config.persistence) {
    case 'MEMORY':
        const { MemoryUserManager } = await import('./memory/MemoryUserManager.js');
        userManager = new MemoryUserManager();
        break;
    case 'MONGO':
    default: 
        const { UserManager } = await import('./mongo/UserManager.js');
        userManager = new UserManager();
        break;        
}

export { userManager };