package com.khokhulia.washconnect.domain.model

data class User(
    val id: Int,
    val fullName: String,
    val email: String,
    val role: String,
    val balance: Double
)

data class Laundry(
    val id: Int,
    val ownerId: Int,
    val name: String,
    val address: String,
    val workingHours: String
)

data class Machine(
    val id: Int,
    val laundryId: Int,
    val serialNumber: String,
    val model: String,
    val status: String
)

data class WashMode(
    val id: Int,
    val laundryId: Int,
    val name: String,
    val price: Double,
    val durationMinutes: Int,
    val temperature: Int
)

data class WashSession(
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

data class PricingDetail(
    val basePrice: Double,
    val finalPrice: Double,
    val appliedModifiers: List<String>
)

data class Notification(
    val id: Int,
    val userId: Int,
    val title: String,
    val message: String,
    val isRead: Boolean
)
