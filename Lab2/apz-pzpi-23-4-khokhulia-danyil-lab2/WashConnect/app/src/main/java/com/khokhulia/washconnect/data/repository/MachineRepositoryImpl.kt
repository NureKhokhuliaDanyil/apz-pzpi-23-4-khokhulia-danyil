package com.khokhulia.washconnect.data.repository

import com.khokhulia.washconnect.data.api.ApiService
import com.khokhulia.washconnect.domain.model.Machine
import com.khokhulia.washconnect.domain.model.WashMode
import com.khokhulia.washconnect.domain.repository.MachineRepository
import javax.inject.Inject

class MachineRepositoryImpl @Inject constructor(
    private val api: ApiService
) : MachineRepository {

    override suspend fun getMachines(): Result<List<Machine>> = runCatching {
        api.getMachines().map { Machine(it.id, it.laundryId, it.serialNumber, it.model, it.status) }
    }

    override suspend fun getMachinesByLaundry(laundryId: Int): Result<List<Machine>> = runCatching {
        api.getMachines()
            .filter { it.laundryId == laundryId }
            .map { Machine(it.id, it.laundryId, it.serialNumber, it.model, it.status) }
    }

    override suspend fun getWashModes(): Result<List<WashMode>> = runCatching {
        api.getWashModes().map {
            WashMode(it.id, it.laundryId, it.name, it.price, it.durationMinutes, it.temperature)
        }
    }
}
