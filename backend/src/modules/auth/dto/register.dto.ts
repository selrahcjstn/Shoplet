import { CreateUserDto } from '../../users/dto/index.js';

/** Registration takes the same validated fields as creating a user. */
export class RegisterDto extends CreateUserDto {}
