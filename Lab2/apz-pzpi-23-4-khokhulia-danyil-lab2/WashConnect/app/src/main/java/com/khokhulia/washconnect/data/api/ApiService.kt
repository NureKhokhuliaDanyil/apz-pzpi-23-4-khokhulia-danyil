package com.khokhulia.washconnect.data.api

import com.khokhulia.washconnect.data.dto.*
import retrofit2.http.*

interface ApiService {

    // ── Auth ──────────────────────────────────────────────────────────────────
    @POST("api/auth/login")
    suspend fun login(@Body dto: LoginRequestDto): LoginResponseDto

    @POST("api/auth/register")
    suspend fun register(@Body dto: RegisterRequestDto): UserResponseDto

    @POST("api/auth/forgot-password")
    suspend fun forgotPassword(@Body email: String): Map<String, String>

    // ── Laundries ─────────────────────────────────────────────────────────────
    @GET("api/laundries")
    suspend fun getLaundries(): List<LaundryResponseDto>

    @GET("api/laundries/{id}")
    suspend fun getLaundryById(@Path("id") id: Int): LaundryResponseDto

    // ── Machines ──────────────────────────────────────────────────────────────
    @GET("api/machines")
    suspend fun getMachines(): List<MachineResponseDto>

    @GET("api/machines/{id}")
    suspend fun getMachineById(@Path("id") id: Int): MachineResponseDto

    // ── Wash Modes ────────────────────────────────────────────────────────────
    @GET("api/tariffs")
    suspend fun getWashModes(): List<WashModeResponseDto>

    // ── Sessions ──────────────────────────────────────────────────────────────
    @POST("api/sessions/start")
    suspend fun startSession(@Body dto: StartSessionRequestDto): SessionResponseDto

    @POST("api/sessions/{id}/cancel")
    suspend fun cancelSession(@Path("id") id: Int, @Body userId: Int): Map<String, String>

    @POST("api/sessions/preview-price")
    suspend fun previewPrice(
        @Query("laundryId") laundryId: Int,
        @Query("modeId") modeId: Int,
        @Query("userId") userId: Int
    ): PricingDetailDto

    // ── Notifications ─────────────────────────────────────────────────────────
    @GET("api/notifications")
    suspend fun getNotifications(): List<NotificationResponseDto>

    // ── Wallet ────────────────────────────────────────────────────────────────
    @POST("api/wallet/deposit")
    suspend fun deposit(@Body dto: DepositRequestDto): Map<String, String>

    @POST("api/wallet/apply-promo")
    suspend fun applyPromo(@Body dto: ApplyPromoRequestDto): Map<String, String>

    // ── Users ─────────────────────────────────────────────────────────────────
    @GET("api/users/{id}")
    suspend fun getUserById(@Path("id") id: Int): UserResponseDto
}
