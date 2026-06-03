package com.khokhulia.washconnect.domain.usecase.machine

import com.khokhulia.washconnect.domain.model.Machine
import com.khokhulia.washconnect.domain.model.WashMode
import com.khokhulia.washconnect.domain.repository.MachineRepository
import javax.inject.Inject

class GetMachinesUseCase @Inject constructor(
    private val repository: MachineRepository
) {
    suspend operator fun invoke(laundryId: Int): Result<List<Machine>> =
        repository.getMachinesByLaundry(laundryId)
}

class GetWashModesUseCase @Inject constructor(
    private val repository: MachineRepository
) {
    suspend operator fun invoke(): Result<List<WashMode>> = repository.getWashModes()
}
