import CryptoJS from 'crypto-js';

// Storage keys
const STORAGE_KEYS = {
    USER_TOKEN: 'gentric_user_token',
    USER_DATA: 'gentric_user_data',
    ENCRYPTION_KEY: 'gentric_enc_key',
} as const;

// Generate a unique encryption key based on browser fingerprint
const generateEncryptionKey = (): string => {
    const browserFingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.width,
        screen.height,
        new Date().getTimezoneOffset(),
    ].join('|');

    return CryptoJS.SHA256(browserFingerprint).toString();
};

// Get or create encryption key
const getEncryptionKey = (): string => {
    let key = localStorage.getItem(STORAGE_KEYS.ENCRYPTION_KEY);

    if (!key) {
        key = generateEncryptionKey();
        localStorage.setItem(STORAGE_KEYS.ENCRYPTION_KEY, key);
    }

    return key;
};

// Encrypt data
const encrypt = (data: string): string => {
    const key = getEncryptionKey();
    return CryptoJS.AES.encrypt(data, key).toString();
};

// Decrypt data
const decrypt = (encryptedData: string): string | null => {
    try {
        const key = getEncryptionKey();
        const bytes = CryptoJS.AES.decrypt(encryptedData, key);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Decryption failed:', error);
        return null;
    }
};

// User data interface
export interface UserData {
    id: string;
    email: string;
    name: string;
    role?: string;
    avatar?: string;
    preferences?: Record<string, any>;
    lastLogin?: string;
}

// Token data interface
export interface TokenData {
    accessToken: string;
    refreshToken?: string;
    expiresAt: number;
    tokenType?: string;
}

// Encrypted Storage Service
export class EncryptedStorage {
    // Save user token
    static saveToken(tokenData: TokenData): boolean {
        try {
            const encryptedToken = encrypt(JSON.stringify(tokenData));
            localStorage.setItem(STORAGE_KEYS.USER_TOKEN, encryptedToken);
            return true;
        } catch (error) {
            console.error('Failed to save token:', error);
            return false;
        }
    }

    // Get user token
    static getToken(): TokenData | null {
        try {
            const encryptedToken = localStorage.getItem(STORAGE_KEYS.USER_TOKEN);
            if (!encryptedToken) return null;

            const decryptedToken = decrypt(encryptedToken);
            if (!decryptedToken) return null;

            return JSON.parse(decryptedToken) as TokenData;
        } catch (error) {
            console.error('Failed to get token:', error);
            return null;
        }
    }

    // Save user data
    static saveUserData(userData: UserData): boolean {
        try {
            const encryptedUserData = encrypt(JSON.stringify(userData));
            localStorage.setItem(STORAGE_KEYS.USER_DATA, encryptedUserData);
            return true;
        } catch (error) {
            console.error('Failed to save user data:', error);
            return false;
        }
    }

    // Get user data
    static getUserData(): UserData | null {
        try {
            const encryptedUserData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
            if (!encryptedUserData) return null;

            const decryptedUserData = decrypt(encryptedUserData);
            if (!decryptedUserData) return null;

            return JSON.parse(decryptedUserData) as UserData;
        } catch (error) {
            console.error('Failed to get user data:', error);
            return null;
        }
    }

    // Check if user is authenticated
    static isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        // Check if token is expired
        const now = Date.now();
        return token.expiresAt > now;
    }

    // Clear all stored data
    static clearAll(): void {
        localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        // Note: We don't remove the encryption key to maintain consistency
    }

    // Update user preferences
    static updateUserPreferences(preferences: Record<string, any>): boolean {
        const userData = this.getUserData();
        if (!userData) return false;

        const updatedUserData = {
            ...userData,
            preferences: {
                ...userData.preferences,
                ...preferences,
            },
        };

        return this.saveUserData(updatedUserData);
    }

    // Get user preferences
    static getUserPreferences(): Record<string, any> | null {
        const userData = this.getUserData();
        return userData?.preferences || null;
    }

    // Check if token needs refresh
    static needsTokenRefresh(): boolean {
        const token = this.getToken();
        if (!token) return false;

        // Refresh token if it expires within 5 minutes
        const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
        return token.expiresAt <= fiveMinutesFromNow;
    }

    // Get storage info (for debugging)
    static getStorageInfo(): {
        hasToken: boolean;
        hasUserData: boolean;
        isAuthenticated: boolean;
        tokenExpiresAt: number | null;
    } {
        const token = this.getToken();
        const userData = this.getUserData();

        return {
            hasToken: !!token,
            hasUserData: !!userData,
            isAuthenticated: this.isAuthenticated(),
            tokenExpiresAt: token?.expiresAt || null,
        };
    }
}

export default EncryptedStorage;
