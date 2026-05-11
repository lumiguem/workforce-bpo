package com.fcbpo.workforce.application.service;

import com.fcbpo.workforce.application.dto.WaveResponse;
import com.fcbpo.workforce.domain.model.Wave;
import com.fcbpo.workforce.domain.model.WaveStage;
import com.fcbpo.workforce.domain.repository.WaveRepository;
import com.fcbpo.workforce.infrastructure.persistence.repository.InterpreterDetailsJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class WaveService {
    private final WaveRepository waveRepository;
    private final InterpreterDetailsJpaRepository interpreterDetailsJpaRepository;

    @Transactional(readOnly = true)
    public List<WaveResponse> getAllWaves() {
        Map<Integer, Long> interpreterCountsByWaveId = getInterpreterCountsByWaveId();
        return waveRepository.findAll().stream()
                .map(wave -> toResponse(wave, interpreterCountsByWaveId.getOrDefault(wave.getWaveId(), 0L)))
                .toList();
    }

    @Transactional(readOnly = true)
    public WaveResponse getWaveById(Integer id) {
        Wave wave = waveRepository.findById(id).orElseThrow();
        Long interpreterCount = getInterpreterCountsByWaveId().getOrDefault(id, 0L);
        return toResponse(wave, interpreterCount);
    }

    public WaveResponse createWave(Wave wave) {
        return toResponse(waveRepository.save(wave), 0L);
    }

    public WaveResponse updateWave(Integer id, Wave wave) {
        wave.setWaveId(id);
        Long interpreterCount = getInterpreterCountsByWaveId().getOrDefault(id, 0L);
        return toResponse(waveRepository.save(wave), interpreterCount);
    }

    public void deleteWave(Integer id) {
        waveRepository.deleteById(id);
    }

    private Map<Integer, Long> getInterpreterCountsByWaveId() {
        return interpreterDetailsJpaRepository.countInterpretersByWaveId().stream()
                .collect(Collectors.toMap(
                        InterpreterDetailsJpaRepository.WaveInterpreterCountProjection::getWaveId,
                        InterpreterDetailsJpaRepository.WaveInterpreterCountProjection::getInterpreterCount
                ));
    }

    private WaveResponse toResponse(Wave wave, Long interpreterCount) {
        LocalDate now = LocalDate.now();
        String currentStage = "UPCOMING";
        
        List<WaveResponse.WaveStageResponse> stageResponses = null;
        if (wave.getStages() != null) {
            stageResponses = wave.getStages().stream()
                .map(s -> {
                    boolean isCurrent = (now.isEqual(s.getStartDate()) || now.isAfter(s.getStartDate())) && 
                                       (s.getEndDate() == null || now.isEqual(s.getEndDate()) || now.isBefore(s.getEndDate()));
                    return WaveResponse.WaveStageResponse.builder()
                            .waveStageId(s.getWaveStageId())
                            .stageName(s.getStageName())
                            .startDate(s.getStartDate())
                            .endDate(s.getEndDate())
                            .isCurrent(isCurrent)
                            .build();
                })
                .toList();

            // Find current stage string
            WaveStage current = wave.getStages().stream()
                .filter(s -> (now.isEqual(s.getStartDate()) || now.isAfter(s.getStartDate())) && 
                             (s.getEndDate() == null || now.isEqual(s.getEndDate()) || now.isBefore(s.getEndDate())))
                .findFirst()
                .orElse(null);
            
            if (current != null) {
                currentStage = current.getStageName();
            } else if (!wave.getStages().isEmpty() && now.isAfter(wave.getStages().get(wave.getStages().size()-1).getEndDate())) {
                currentStage = "COMPLETED";
            }
        }

        return WaveResponse.builder()
                .waveId(wave.getWaveId())
                .waveName(wave.getWaveName())
                .description(wave.getDescription())
                .startDate(wave.getStartDate())
                .currentStage(currentStage)
                .interpreterCount(interpreterCount)
                .stages(stageResponses)
                .build();
    }
}
