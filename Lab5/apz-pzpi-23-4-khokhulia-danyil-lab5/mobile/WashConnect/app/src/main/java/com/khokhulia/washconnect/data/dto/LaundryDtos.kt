package com.khokhulia.washconnect.data.dto

data class LaundryResponseDto(
    val id: Int,
    val ownerId: Int,
    val name: String,
    val address: String,
    val workingHours: String
)
