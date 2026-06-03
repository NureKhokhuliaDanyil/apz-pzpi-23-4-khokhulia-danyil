package com.khokhulia.washconnect.presentation.screens.machines

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.khokhulia.washconnect.domain.model.Machine
import com.khokhulia.washconnect.domain.usecase.machine.GetMachinesUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

sealed class MachinesUiState {
    object Loading : MachinesUiState()
    data class Success(val machines: List<Machine>) : MachinesUiState()
    data class Error(val message: String) : MachinesUiState()
}

@HiltViewModel
class MachinesViewModel @Inject constructor(
    private val getMachinesUseCase: GetMachinesUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow<MachinesUiState>(MachinesUiState.Loading)
    val uiState: StateFlow<MachinesUiState> = _uiState

    fun loadMachines(laundryId: Int) {
        viewModelScope.launch {
            _uiState.value = MachinesUiState.Loading
            getMachinesUseCase(laundryId)
                .onSuccess { _uiState.value = MachinesUiState.Success(it) }
                .onFailure { _uiState.value = MachinesUiState.Error(it.message ?: "Unknown error") }
        }
    }
}
