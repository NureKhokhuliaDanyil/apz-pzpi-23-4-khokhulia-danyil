package com.khokhulia.washconnect.domain.usecase.laundry

import com.khokhulia.washconnect.domain.model.Laundry
import com.khokhulia.washconnect.domain.repository.LaundryRepository
import javax.inject.Inject

class GetLaundriesUseCase @Inject constructor(
    private val repository: LaundryRepository
) {
    suspend operator fun invoke(): Result<List<Laundry>> = repository.getLaundries()
}
