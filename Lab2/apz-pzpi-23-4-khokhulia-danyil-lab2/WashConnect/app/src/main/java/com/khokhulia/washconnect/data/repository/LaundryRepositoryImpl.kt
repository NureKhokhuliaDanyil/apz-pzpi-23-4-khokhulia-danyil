package com.khokhulia.washconnect.data.repository

import com.khokhulia.washconnect.data.api.ApiService
import com.khokhulia.washconnect.domain.model.Laundry
import com.khokhulia.washconnect.domain.repository.LaundryRepository
import javax.inject.Inject

class LaundryRepositoryImpl @Inject constructor(
    private val api: ApiService
) : LaundryRepository {

    override suspend fun getLaundries(): Result<List<Laundry>> = runCatching {
        api.getLaundries().map { dto ->
            Laundry(
                id = dto.id,
                ownerId = dto.ownerId,
                name = dto.name,
                address = dto.address,
                workingHours = dto.workingHours
            )
        }
    }

    override suspend fun getLaundryById(id: Int): Result<Laundry> = runCatching {
        val dto = api.getLaundryById(id)
        Laundry(dto.id, dto.ownerId, dto.name, dto.address, dto.workingHours)
    }
}
