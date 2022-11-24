import { UserRole } from "src/common/constants"

export class GenerateTokenDto {
    email?: string
    role?: UserRole
    userId?: string
}