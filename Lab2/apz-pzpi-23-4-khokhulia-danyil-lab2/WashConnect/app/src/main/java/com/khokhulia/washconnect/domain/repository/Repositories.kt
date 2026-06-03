package com.khokhulia.washconnect.domain.repository

import com.khokhulia.washconnect.domain.model.*

interface AuthRepository {
    suspend fun login(email: String, password: String): Result<User>
    suspend fun register(fullName: String, email: String, password: String): Result<User>
}

interface LaundryRepository {
    suspend fun getLaundries(): Result<List<Laundry>>
    suspend fun getLaundryById(id: Int): Result<Laundry>
}

interface MachineRepository {
    suspend fun getMachines(): Result<List<Machine>>
    suspend fun getMachinesByLaundry(laundryId: Int): Result<List<Machine>>
    suspend fun getWashModes(): Result<List<WashMode>>
}

interface SessionRepository {
    suspend fun startSession(userId: Int, machineId: Int, modeId: Int): Result<WashSession>
    suspend fun cancelSession(sessionId: Int, userId: Int): Result<Unit>
    suspend fun previewPrice(laundryId: Int, modeId: Int, userId: Int): Result<PricingDetail>
}

interface NotificationRepository {
    suspend fun getNotifications(): Result<List<Notification>>
}

interface WalletRepository {
    suspend fun deposit(userId: Int, amount: Double): Result<Unit>
    suspend fun applyPromo(userId: Int, code: String): Result<Unit>
    suspend fun getUserById(id: Int): Result<com.khokhulia.washconnect.domain.model.User>
}
