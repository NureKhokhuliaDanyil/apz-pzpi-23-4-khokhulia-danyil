package com.khokhulia.washconnect.data.dto

data class NotificationResponseDto(
    val id: Int,
    val userId: Int,
    val title: String,
    val message: String,
    val isRead: Boolean
)

data class DepositRequestDto(
    val userId: Int,
    val amount: Double
)

data class ApplyPromoRequestDto(
    val userId: Int,
    val code: String
)
