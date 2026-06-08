package com.khokhulia.washconnect.data.repository

import com.khokhulia.washconnect.data.api.ApiService
import com.khokhulia.washconnect.data.dto.StartSessionRequestDto
import com.khokhulia.washconnect.domain.model.PricingDetail
import com.khokhulia.washconnect.domain.model.WashSession
import com.khokhulia.washconnect.domain.repository.SessionRepository
import javax.inject.Inject

class SessionRepositoryImpl @Inject constructor(
    private val api: ApiService
) : SessionRepository {

    override suspend fun startSession(userId: Int, machineId: Int, modeId: Int): Result<WashSession> = runCatching {
        val dto = api.startSession(StartSessionRequestDto(userId, machineId, modeId))
        WashSession(dto.id, dto.userId, dto.machineId, dto.modeId, dto.startTime, dto.endTime, dto.status, dto.actualPrice, dto.doorLocked)
    }

    override suspend fun cancelSession(sessionId: Int, userId: Int): Result<Unit> = runCatching {
        api.cancelSession(sessionId, userId)
    }

    override suspend fun previewPrice(laundryId: Int, modeId: Int, userId: Int): Result<PricingDetail> = runCatching {
        val dto = api.previewPrice(laundryId, modeId, userId)
        PricingDetail(dto.basePrice, dto.finalPrice, dto.appliedModifiers)
    }
}
