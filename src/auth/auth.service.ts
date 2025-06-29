import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) {}

    async signup(signupDto: SignupDto) {
        const user = await this.userService.create(signupDto);
        
        // Gerar token JWT
        const payload = { 
            username: user.username, 
            sub: user.id,
            roles: user.roles 
        };
        
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                username: user.username,
                roles: user.roles
            }
        };
    }

    async signupAdmin(signupDto: SignupDto) {
        // Verificar se já existe algum usuário no sistema
        const existingUsers = await this.userService.findAll();
        
        if (existingUsers.length > 0) {
            throw new ConflictException('Já existe um administrador no sistema');
        }

        // Criar usuário com role de admin
        const adminUser = await this.userService.create({
            ...signupDto,
            roles: ['admin']
        });
        
        // Gerar token JWT
        const payload = { 
            username: adminUser.username, 
            sub: adminUser.id,
            roles: adminUser.roles 
        };
        
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: adminUser.id,
                username: adminUser.username,
                roles: adminUser.roles
            }
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.userService.validateUser(loginDto.username, loginDto.password);
        
        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        // Gerar token JWT
        const payload = { 
            username: user.username, 
            sub: user.id,
            roles: user.roles 
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                username: user.username,
                roles: user.roles
            }
        };
    }

    async validateToken(token: string) {
        try {
            const payload = this.jwtService.verify(token);
            return payload;
        } catch (error) {
            throw new UnauthorizedException('Token inválido');
        }
    }
}