package com.khokhulia.washconnect.domain.usecase.auth

import com.khokhulia.washconnect.domain.model.User
import com.khokhulia.washconnect.domain.repository.AuthRepository
import javax.inject.Inject

class LoginUseCase @Inject constructor(
    private val repository: AuthRepository
) {
    suspend operator fun invoke(email: String, password: String): Result<User> {
        if (email.isBlank()) return Result.failure(IllegalArgumentException("Email cannot be empty"))
        if (password.length < 6) return Result.failure(IllegalArgumentException("Password must be at least 6 characters"))
        return repository.login(email.trim(), password)
    }
}

class RegisterUseCase @Inject constructor(
    private val repository: AuthRepository
) {
    suspend operator fun invoke(fullName: String, email: String, password: String): Result<User> {
        if (fullName.isBlank()) return Result.failure(IllegalArgumentException("Name cannot be empty"))
        if (email.isBlank()) return Result.failure(IllegalArgumentException("Email cannot be empty"))
        if (password.length < 6) return Result.failure(IllegalArgumentException("Password must be at least 6 characters"))
        return repository.register(fullName.trim(), email.trim(), password)
    }
}
