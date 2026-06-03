package com.khokhulia.washconnect.data.dto

data class LoginRequestDto(
    val email: String,
    val password: String
)

data class LoginResponseDto(
    val userId: Int,
    val fullName: String,
    val email: String,
    val role: String,
    val token: String
)

data class RegisterRequestDto(
    val fullName: String,
    val email: String,
    val password: String
)

data class UserResponseDto(
    val id: Int,
    val fullName: String,
    val email: String,
    val role: String,
    val balance: Double,
    val registeredAt: String
)
