package com.khokhulia.washconnect.presentation.screens.laundries

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.khokhulia.washconnect.domain.model.Laundry
import com.khokhulia.washconnect.domain.usecase.laundry.GetLaundriesUseCase
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

sealed class LaundriesUiState {
    object Loading : LaundriesUiState()
    data class Success(val laundries: List<Laundry>) : LaundriesUiState()
    data class Error(val message: String) : LaundriesUiState()
}

@HiltViewModel
class LaundriesViewModel @Inject constructor(
    private val getLaundriesUseCase: GetLaundriesUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow<LaundriesUiState>(LaundriesUiState.Loading)
    val uiState: StateFlow<LaundriesUiState> = _uiState

    init { loadLaundries() }

    fun loadLaundries() {
        viewModelScope.launch {
            _uiState.value = LaundriesUiState.Loading
            getLaundriesUseCase()
                .onSuccess { _uiState.value = LaundriesUiState.Success(it) }
                .onFailure { _uiState.value = LaundriesUiState.Error(it.message ?: "Unknown error") }
        }
    }
}
