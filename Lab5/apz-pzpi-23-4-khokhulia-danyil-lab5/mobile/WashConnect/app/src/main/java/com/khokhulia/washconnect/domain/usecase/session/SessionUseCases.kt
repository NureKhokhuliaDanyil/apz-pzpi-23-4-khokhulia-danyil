package com.khokhulia.washconnect.domain.usecase.session

import com.khokhulia.washconnect.domain.model.PricingDetail
import com.khokhulia.washconnect.domain.model.WashSession
import com.khokhulia.washconnect.domain.repository.SessionRepository
import javax.inject.Inject

class StartSessionUseCase @Inject constructor(
    private val repository: SessionRepository
) {
    suspend operator fun invoke(userId: Int, machineId: Int, modeId: Int): Result<WashSession> =
        repository.startSession(userId, machineId, modeId)
}

class CancelSessionUseCase @Inject constructor(
    private val repository: SessionRepository
) {
    suspend operator fun invoke(sessionId: Int, userId: Int): Result<Unit> =
        repository.cancelSession(sessionId, userId)
}

class PreviewPriceUseCase @Inject constructor(
    private val repository: SessionRepository
) {
    suspend operator fun invoke(laundryId: Int, modeId: Int, userId: Int): Result<PricingDetail> =
        repository.previewPrice(laundryId, modeId, userId)
}
