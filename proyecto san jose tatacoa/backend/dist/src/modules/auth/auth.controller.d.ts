import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    login(dto: {
        email: string;
        password: string;
    }): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            nombre: string;
            rol: string;
        };
    }>;
    me(user: any): Promise<{
        id: string;
        email: string;
        nombre: string;
        rol: string;
    }>;
}
