package com.fcbpo.workforce.infrastructure.persistence.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode
public class InterpreterLanguageId implements Serializable {

    @Column(name = "interpreter_id")
    private Integer interpreterId;

    @Column(name = "language_id")
    private Integer languageId;
}
