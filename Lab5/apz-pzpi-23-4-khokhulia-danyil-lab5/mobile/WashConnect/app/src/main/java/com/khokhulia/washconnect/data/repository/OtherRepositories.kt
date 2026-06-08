package com.khokhulia.washconnect.data.repository

import com.khokhulia.washconnect.data.api.ApiService
import com.khokhulia.washconnect.data.dto.DepositRequestDto
import com.khokhulia.washconnect.data.dto.ApplyPromoRequestDto
import com.khokhulia.washconnect.domain.model.Notification
import com.khokhulia.washconnect.domain.model.User
import com.khokhulia.washconnect.domain.repository.NotificationRepository
import com.khokhulia.washconnect.domain.repository.WalletRepository
import javax.inject.Inject

class NotificationRepositoryImpl @Inject constructor(
    private val api: ApiService
) : NotificationRepository {
    override suspend fun getNotifications(): Result<List<Notification>> = runCatching {
        api.getNotifications().map { Notification(it.id, it.userId, it.title, it.message, it.isRead) }
    }
}

class WalletRepositoryImpl @Inject constructor(
    private val api: ApiService
) : WalletRepository {
    override suspend fun deposit(userId: Int, amount: Double): Result<Unit> = runCatching {
        api.deposit(DepositRequestDto(userId, amount))
    }

    override suspend fun applyPromo(userId: Int, code: String): Result<Unit> = runCatching {
        api.applyPromo(ApplyPromoRequestDto(userId, code))
    }

    override suspend fun getUserById(id: Int): Result<User> = runCatching {
        val dto = api.getUserById(id)
        User(dto.id, dto.fullName, dto.email, dto.role, dto.balance)
    }
}
