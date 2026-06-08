package com.khokhulia.washconnect.data.repository

import com.khokhulia.washconnect.data.api.ApiService
import com.khokhulia.washconnect.data.dto.LoginRequestDto
import com.khokhulia.washconnect.data.dto.RegisterRequestDto
import com.khokhulia.washconnect.data.local.TokenDataStore
import com.khokhulia.washconnect.domain.model.User
import com.khokhulia.washconnect.domain.repository.AuthRepository
import javax.inject.Inject

class AuthRepositoryImpl @Inject constructor(
    private val api: ApiService,
    private val tokenDataStore: TokenDataStore
) : AuthRepository {

    override suspend fun login(email: String, password: String): Result<User> = runCatching {
        val response = api.login(LoginRequestDto(email, password))
        tokenDataStore.saveSession(
            token = response.token,
            userId = response.userId,
            name = response.fullName,
            email = response.email,
            role = response.role
        )
        User(
            id = response.userId,
            fullName = response.fullName,
            email = response.email,
            role = response.role,
            balance = 0.0
        )
    }

    override suspend fun register(fullName: String, email: String, password: String): Result<User> = runCatching {
        val response = api.register(RegisterRequestDto(fullName, email, password))
        User(
            id = response.id,
            fullName = response.fullName,
            email = response.email,
            role = response.role,
            balance = response.balance
        )
    }
}
