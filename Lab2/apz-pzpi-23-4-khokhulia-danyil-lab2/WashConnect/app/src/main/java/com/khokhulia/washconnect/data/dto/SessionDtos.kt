package com.khokhulia.washconnect.data.dto

data class StartSessionRequestDto(
    val userId: Int,
    val machineId: Int,
    val modeId: Int
)

data class SessionResponseDto(
    val id: Int,
    val userId: Int,
    val machineId: Int,
    val modeId: Int,
    val startTime: String,
    val endTime: String?,
    val status: String,
    val actualPrice: Double,
    val doorLocked: Boolean
)

data class PricingDetailDto(
    val basePrice: Double,
    val finalPrice: Double,
    val appliedModifiers: List<String>
)
