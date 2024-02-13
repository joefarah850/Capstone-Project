export interface User {
    data: {
        id: number;
        username: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        dataOfBirth: Date;
        accountCreationDate: Date;
        lastLogin: Date;
        updateDate: Date;
        organizationId: number;
        profilePicUrl: string;
    };
    message: string;
}
    