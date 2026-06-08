package com.khokhulia.washconnect.presentation.screens.session

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.khokhulia.washconnect.data.local.TokenDataStore
import com.khokhulia.washconnect.domain.model.PricingDetail
import com.khokhulia.washconnect.domain.model.WashMode
import com.khokhulia.washconnect.domain.model.WashSession
import com.khokhulia.washconnect.domain.usecase.machine.GetWashModesUseCase
import com.khokhulia.washconnect.domain.usecase.session.CancelSessionUseCase
import com.khokhulia.washconnect.domain.usecase.session.PreviewPriceUseCase
import com.khokhulia.washconnect.domain.usecase.session.StartSessionUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.coroutines.launch
import javax.inject.Inject

data class SessionUiState(
    val washModes: List<WashMode> = emptyList(),
    val selectedMode: WashMode? = null,
    val pricingDetail: PricingDetail? = null,
    val activeSession: WashSession? = null,
    val isLoading: Boolean = false,
    val isLoadingModes: Boolean = true,
    val successMessage: String? = null,
    val errorMessage: String? = null
)

@HiltViewModel
class SessionViewModel @Inject constructor(
    private val getWashModesUseCase: GetWashModesUseCase,
    private val startSessionUseCase: StartSessionUseCase,
    private val cancelSessionUseCase: CancelSessionUseCase,
    private val previewPriceUseCase: PreviewPriceUseCase,
    private val tokenDataStore: TokenDataStore
) : ViewModel() {

    private val _uiState = MutableStateFlow(SessionUiState())
    val uiState: StateFlow<SessionUiState> = _uiState

    fun loadWashModes(laundryId: Int) {
        viewModelScope.launch {
            getWashModesUseCase()
                .onSuccess { modes ->
                    val filtered = modes.filter { it.laundryId == laundryId }
                    _uiState.value = _uiState.value.copy(washModes = filtered, isLoadingModes = false)
                }
                .onFailure {
                    _uiState.value = _uiState.value.copy(isLoadingModes = false, errorMessage = it.message)
                }
        }
    }

    fun selectMode(mode: WashMode, laundryId: Int) {
        _uiState.value = _uiState.value.copy(selectedMode = mode, pricingDetail = null)
        viewModelScope.launch {
            val userId = tokenDataStore.userId.firstOrNull() ?: return@launch
            previewPriceUseCase(laundryId, mode.id, userId)
                .onSuccess { _uiState.value = _uiState.value.copy(pricingDetail = it) }
        }
    }

    fun startSession(machineId: Int) {
        val mode = _uiState.value.selectedMode ?: return
        viewModelScope.launch {
            val userId = tokenDataStore.userId.firstOrNull() ?: return@launch
            _uiState.value = _uiState.value.copy(isLoading = true)
            startSessionUseCase(userId, machineId, mode.id)
                .onSuccess {
                    _uiState.value = _uiState.value.copy(
                        activeSession = it,
                        isLoading = false,
                        successMessage = "Session started! Machine is unlocked."
                    )
                }
                .onFailure {
                    _uiState.value = _uiState.value.copy(isLoading = false, errorMessage = it.message)
                }
        }
    }

    fun cancelSession() {
        val session = _uiState.value.activeSession ?: return
        viewModelScope.launch {
            val userId = tokenDataStore.userId.firstOrNull() ?: return@launch
            cancelSessionUseCase(session.id, userId)
                .onSuccess {
                    _uiState.value = _uiState.value.copy(activeSession = null, successMessage = "Session cancelled.")
                }
                .onFailure {
                    _uiState.value = _uiState.value.copy(errorMessage = it.message)
                }
        }
    }

    fun clearMessages() {
        _uiState.value = _uiState.value.copy(successMessage = null, errorMessage = null)
    }
}
