export class CreateUserDto {
  fullName: string;
  email: string;
  birthday: string;
  password: string;
}

export class AuthUserDto {
  email: string;
  password: string;
}
