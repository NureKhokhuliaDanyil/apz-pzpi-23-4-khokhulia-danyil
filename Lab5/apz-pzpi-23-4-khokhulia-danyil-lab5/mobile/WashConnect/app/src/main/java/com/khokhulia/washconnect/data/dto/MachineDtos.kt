package com.khokhulia.washconnect.data.dto

data class MachineResponseDto(
    val id: Int,
    val laundryId: Int,
    val serialNumber: String,
    val model: String,
    val status: String
)

data class WashModeResponseDto(
    val id: Int,
    val laundryId: Int,
    val name: String,
    val price: Double,
    val durationMinutes: Int,
    val temperature: Int
)
