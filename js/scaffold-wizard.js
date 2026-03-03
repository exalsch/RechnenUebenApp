(function () {
    const PHASES = {
        DECOMPOSITION: 'decomposition',
        INTERMEDIATE: 'intermediate',
        SYNTHESIS: 'synthesis'
    };

    function parseQuestionText(text) {
        const cleaned = String(text || '').trim();
        const m = cleaned.match(/^(-?\d+)\s*([+\-⋅:])\s*(-?\d+)$/);
        if (!m) return null;
        const a = parseInt(m[1], 10);
        const symbol = m[2];
        const b = parseInt(m[3], 10);
        const operator = symbol === '⋅' ? '*' : (symbol === ':' ? '/' : symbol);
        return { a, b, symbol, operator };
    }

    function formatOperation(a, symbol, b) {
        return `${a} ${symbol} ${b}`;
    }

    function readIntValue(el) {
        const v = String(el?.value ?? '').trim();
        if (!v) return null;
        if (!/^-?\d+$/.test(v)) return null;
        return parseInt(v, 10);
    }

    function isSameNumber(a, b) {
        return typeof a === 'number' && typeof b === 'number' && !isNaN(a) && !isNaN(b) && a === b;
    }

    function sumParts(parts) {
        return parts.reduce((acc, n) => acc + n, 0);
    }

    function getDecompositionPlan(total) {
        const abs = Math.abs(total);
        if (abs >= 100 && abs <= 999) {
            const sign = total < 0 ? -1 : 1;
            const hundreds = Math.floor(abs / 100) * 100 * sign;
            const tens = Math.floor((abs % 100) / 10) * 10 * sign;
            const ones = (abs % 10) * sign;
            return {
                partCount: 3,
                suggestedParts: [hundreds, tens, ones]
            };
        }
        return {
            partCount: 2,
            suggestedParts: [null, null]
        };
    }

    function setHidden(el, hidden) {
        if (!el) return;
        if (hidden) el.classList.add('hidden');
        else el.classList.remove('hidden');
    }

    function setError(message) {
        const errorEl = document.getElementById('scaffold-error');
        if (!errorEl) return;
        if (!message) {
            errorEl.textContent = '';
            setHidden(errorEl, true);
            return;
        }
        errorEl.textContent = message;
        setHidden(errorEl, false);
    }

    function speakText(text) {
        try {
            if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance !== 'function') {
                return;
            }
            const utter = new SpeechSynthesisUtterance(String(text || ''));
            utter.lang = 'de-DE';
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utter);
        } catch (_) {
        }
    }

    function getStrategy(operator) {
        const strategies = {
            '+': {
                operator: '+',
                symbol: '+',
                targetOperandIndex: 1,
                visualizationType: 'linear',
                validateSplit(total, parts) {
                    return total === sumParts(parts);
                },
                getNextStep(context) {
                    const stepIndex = context.phase === PHASES.INTERMEDIATE
                        ? (context.stepIndex ?? 0)
                        : (context.parts.length - 1);
                    const previous = stepIndex === 0
                        ? context.operands[0]
                        : context.intermediate[stepIndex - 1];
                    return previous + context.parts[stepIndex];
                }
            },
            '-': {
                operator: '-',
                symbol: '-',
                targetOperandIndex: 1,
                visualizationType: 'linear',
                validateSplit(total, parts) {
                    return total === sumParts(parts);
                },
                getNextStep(context) {
                    const stepIndex = context.phase === PHASES.INTERMEDIATE
                        ? (context.stepIndex ?? 0)
                        : (context.parts.length - 1);
                    const previous = stepIndex === 0
                        ? context.operands[0]
                        : context.intermediate[stepIndex - 1];
                    return previous - context.parts[stepIndex];
                }
            },
            '*': {
                operator: '*',
                symbol: '⋅',
                targetOperandIndex: 1,
                visualizationType: 'branching',
                validateSplit(total, parts) {
                    return total === sumParts(parts);
                },
                getNextStep(context) {
                    const a = context.operands[0];
                    if (context.phase === PHASES.INTERMEDIATE) {
                        const which = context.branchIndex ?? 0;
                        return a * context.parts[which];
                    }
                    if (context.phase === PHASES.SYNTHESIS) return sumParts(context.intermediate);
                    return null;
                }
            },
            '/': {
                operator: '/',
                symbol: ':',
                targetOperandIndex: 0,
                visualizationType: 'branching',
                validateSplit(total, parts, context) {
                    if (total !== sumParts(parts)) return false;
                    const divisor = context.operands[1];
                    if (divisor === 0) return false;
                    return parts.every((p) => p % divisor === 0);
                },
                getNextStep(context) {
                    const divisor = context.operands[1];
                    if (context.phase === PHASES.INTERMEDIATE) {
                        const which = context.branchIndex ?? 0;
                        return context.parts[which] / divisor;
                    }
                    if (context.phase === PHASES.SYNTHESIS) return sumParts(context.intermediate);
                    return null;
                }
            }
        };

        return strategies[operator] || null;
    }

    class ScaffoldWizard {
        constructor(options) {
            this.modalEl = options.modalEl;
            this.contentEl = options.contentEl;
            this.questionEl = options.questionEl;
            this.answerEl = options.answerEl;

            this.phase = PHASES.DECOMPOSITION;
            this.operands = null;
            this.operator = null;
            this.symbol = null;
            this.strategy = null;
            this.decompositionPlan = { partCount: 2, suggestedParts: [null, null] };
            this.parts = [];
            this.intermediate = [];

            this._autoActionLock = false;
        }

        open() {
            const parsed = parseQuestionText(this.questionEl?.innerText);
            if (!parsed) {
                setError('Ich konnte die Aufgabe nicht lesen.');
                return;
            }

            window.scaffoldUsedThisRound = true;

            this.operands = [parsed.a, parsed.b];
            this.operator = parsed.operator;
            this.symbol = parsed.symbol;
            this.strategy = getStrategy(parsed.operator);

            if (!this.strategy) {
                setError('Diese Rechenart wird im Assistenten noch nicht unterstützt.');
                return;
            }

            this.decompositionPlan = getDecompositionPlan(this.getTargetTotal());
            this.phase = PHASES.DECOMPOSITION;
            this.parts = new Array(this.decompositionPlan.partCount).fill(null);
            this.intermediate = [];
            this._autoActionLock = false;
            setError('');

            this.render();
            this.modalEl.classList.remove('hidden');
            if (typeof window.updateBodyScrollLock === 'function') {
                window.updateBodyScrollLock();
            }
        }

        close() {
            this.modalEl.classList.add('hidden');
            if (typeof window.updateBodyScrollLock === 'function') {
                window.updateBodyScrollLock();
            }
        }

        getTargetTotal() {
            return this.operands[this.strategy.targetOperandIndex];
        }

        render() {
            this.contentEl.innerHTML = '';
            this.renderHistory();
            if (this.phase === PHASES.DECOMPOSITION) this.renderDecomposition();
            else if (this.phase === PHASES.INTERMEDIATE) this.renderIntermediate();
            else this.renderSynthesis();
        }

        renderHistory() {
            const wrapper = document.createElement('div');
            wrapper.className = 'scaffold-history';

            const title = document.createElement('div');
            title.className = 'scaffold-history-title';
            title.textContent = 'Bisherige Schritte';
            wrapper.appendChild(title);

            const items = [];
            items.push(`Aufgabe: ${formatOperation(this.operands[0], this.symbol, this.operands[1])}`);

            const targetTotal = this.getTargetTotal();
            const targetLabel = this.strategy.targetOperandIndex === 0 ? 'Dividend' : 'Zahl';
            items.push(`${targetLabel}: ${targetTotal}`);

            const knownParts = this.parts.filter((p) => p !== null);
            if (knownParts.length === this.parts.length && this.parts.length > 0) {
                items.push(`${targetTotal} = ${this.parts.join(' + ')}`);
            }

            if (this.strategy.visualizationType === 'linear') {
                for (let i = 0; i < this.parts.length; i++) {
                    const part = this.parts[i];
                    if (part === null) continue;
                    const previous = i === 0
                        ? this.operands[0]
                        : (this.intermediate[i - 1] ?? '?');
                    const expr = formatOperation(previous, this.strategy.symbol, part);
                    const result = this.intermediate[i];
                    if (typeof result === 'number') {
                        items.push(`${expr} = ${result}`);
                    } else {
                        items.push(`${expr} = ?`);
                    }
                }
            } else {
                const complete = this.intermediate.length === this.parts.length;
                for (let i = 0; i < this.parts.length; i++) {
                    const part = this.parts[i];
                    if (part === null) continue;
                    let expr;
                    if (this.operator === '*') {
                        expr = formatOperation(this.operands[0], this.strategy.symbol, part);
                    } else {
                        expr = formatOperation(part, this.strategy.symbol, this.operands[1]);
                    }
                    if (typeof this.intermediate[i] === 'number') {
                        items.push(`${expr} = ${this.intermediate[i]}`);
                    } else {
                        items.push(`${expr} = ?`);
                    }
                }
                if (complete && this.intermediate.length > 0) {
                    items.push(`${this.intermediate.join(' + ')} = ?`);
                }
            }

            items.forEach((t) => {
                const row = document.createElement('div');
                row.className = 'scaffold-history-item';
                row.textContent = t;
                wrapper.appendChild(row);
            });

            this.contentEl.appendChild(wrapper);
        }

        renderDecomposition() {
            const total = this.getTargetTotal();
            const partCount = this.decompositionPlan.partCount;

            const wrapper = document.createElement('div');
            wrapper.className = 'scaffold-section';

            const title = document.createElement('div');
            title.className = 'scaffold-step-title';
            title.textContent = 'Phase 1: Zerlegung';

            const instruction = document.createElement('div');
            instruction.className = 'scaffold-prompt scaffold-instruction-row';

            const instructionText = document.createElement('div');
            const partWord = partCount === 3 ? 'drei' : 'zwei';
            instructionText.innerHTML = `Zerlege <span class="scaffold-target-number">${total}</span> in ${partWord} Teile.`;

            const ttsBtn = document.createElement('button');
            ttsBtn.type = 'button';
            ttsBtn.className = 'scaffold-tts-btn';
            ttsBtn.title = 'Vorlesen';
            ttsBtn.setAttribute('aria-label', 'Vorlesen');
            ttsBtn.textContent = '🗣';
            ttsBtn.addEventListener('click', () => {
                speakText(`Zerlege ${total} in ${partWord} Teile.`);
            });

            instruction.appendChild(ttsBtn);
            instruction.appendChild(instructionText);

            const grid = document.createElement('div');
            grid.className = 'scaffold-grid';
            const partInputs = [];
            for (let i = 0; i < partCount; i++) {
                const input = document.createElement('input');
                input.type = 'text';
                input.inputMode = 'numeric';
                input.autocomplete = 'off';
                input.placeholder = `Teil ${i + 1}`;
                input.id = `scaffold-part-${i + 1}`;
                const suggested = this.decompositionPlan.suggestedParts[i];
                if (typeof suggested === 'number') {
                    input.value = String(suggested);
                }
                partInputs.push(input);
                grid.appendChild(input);
            }

            const hint = document.createElement('div');
            hint.className = 'scaffold-hint';
            if (this.operator === '/') {
                hint.textContent = `Wichtig: Alle Teile müssen durch ${this.operands[1]} teilbar sein.`;
            } else {
                hint.textContent = 'Tipp: Nimm oft zuerst einen runden Teil (z.B. 10, 20, 100).';
            }

            const actions = document.createElement('div');
            actions.className = 'scaffold-actions';

            const nextBtn = document.createElement('button');
            nextBtn.type = 'button';
            nextBtn.textContent = 'Weiter';

            const tryAdvance = () => {
                if (this._autoActionLock) return;
                const values = partInputs.map((el) => readIntValue(el));
                if (values.some((v) => v === null)) {
                    return false;
                }
                const ok = this.strategy.validateSplit(total, values, { operands: this.operands });
                if (!ok) {
                    if (this.operator === '/') {
                        setError(`Die Zerlegung muss ${total} ergeben und alle Teile müssen durch ${this.operands[1]} teilbar sein.`);
                    } else {
                        setError(`Die Zerlegung ist nicht korrekt. ${values.join(' + ')} muss ${total} ergeben.`);
                    }
                    return false;
                }

                setError('');
                this._autoActionLock = true;
                this.parts = values;
                this.phase = PHASES.INTERMEDIATE;
                this.render();
                return true;
            };

            nextBtn.addEventListener('click', () => {
                const ok = tryAdvance();
                if (!ok) {
                    const values = partInputs.map((el) => readIntValue(el));
                    if (values.some((v) => v === null)) {
                        setError(`Bitte gib ${partCount} Zahlen ein.`);
                    }
                }
            });

            const onInput = () => {
                this._autoActionLock = false;
                if (tryAdvance()) {
                    return;
                }
            };
            partInputs.forEach((input) => input.addEventListener('input', onInput));

            const onEnter = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    nextBtn.click();
                }
            };
            partInputs.forEach((input) => input.addEventListener('keydown', onEnter));

            actions.appendChild(nextBtn);

            wrapper.appendChild(title);
            wrapper.appendChild(instruction);
            wrapper.appendChild(grid);
            wrapper.appendChild(hint);
            wrapper.appendChild(actions);
            this.contentEl.appendChild(wrapper);

            if (partInputs[0]) {
                partInputs[0].focus();
            }
        }

        renderIntermediate() {
            const wrapper = document.createElement('div');
            wrapper.className = 'scaffold-section';

            const title = document.createElement('div');
            title.className = 'scaffold-step-title';
            title.textContent = 'Phase 2: Zwischenrechnungen';

            wrapper.appendChild(title);

            if (this.strategy.visualizationType === 'linear') {
                const stepIndex = this.intermediate.length;
                if (stepIndex >= this.parts.length - 1) {
                    this.phase = PHASES.SYNTHESIS;
                    this.render();
                    return;
                }

                const part = this.parts[stepIndex];
                const a = this.operands[0];
                const startValue = stepIndex === 0 ? a : this.intermediate[stepIndex - 1];

                const prompt = document.createElement('div');
                prompt.className = 'scaffold-prompt';
                prompt.textContent = `${formatOperation(startValue, this.strategy.symbol, part)} = ?`;

                const input = document.createElement('input');
                input.type = 'text';
                input.inputMode = 'numeric';
                input.autocomplete = 'off';
                input.placeholder = 'Zwischenergebnis';
                input.id = 'scaffold-intermediate-1';

                const actions = document.createElement('div');
                actions.className = 'scaffold-actions';

                const nextBtn = document.createElement('button');
                nextBtn.type = 'button';
                nextBtn.textContent = 'Weiter';

                const tryAdvance = () => {
                    if (this._autoActionLock) return;
                    const value = readIntValue(input);
                    if (value === null) {
                        return false;
                    }
                    const expected = this.strategy.getNextStep({
                        phase: PHASES.INTERMEDIATE,
                        operands: this.operands,
                        parts: this.parts,
                        intermediate: this.intermediate,
                        stepIndex
                    });
                    if (!isSameNumber(value, expected)) {
                        return false;
                    }
                    setError('');
                    this._autoActionLock = true;
                    this.intermediate.push(value);
                    if (this.intermediate.length >= this.parts.length - 1) {
                        this.phase = PHASES.SYNTHESIS;
                    }
                    this.render();
                    return true;
                };

                nextBtn.addEventListener('click', () => {
                    const ok = tryAdvance();
                    if (!ok) {
                        const value = readIntValue(input);
                        if (value === null) {
                            setError('Bitte gib das Zwischenergebnis ein.');
                        } else {
                            setError('Das stimmt noch nicht. Schau dir die Rechnung nochmal an.');
                        }
                    }
                });

                input.addEventListener('input', () => {
                    this._autoActionLock = false;
                    if (tryAdvance()) {
                        return;
                    }
                });

                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        nextBtn.click();
                    }
                });

                actions.appendChild(nextBtn);

                wrapper.appendChild(prompt);
                wrapper.appendChild(input);
                wrapper.appendChild(actions);

                this.contentEl.appendChild(wrapper);

                input.focus();
                return;
            }

            const prompts = document.createElement('div');
            prompts.className = 'scaffold-branching';
            const branchInputs = [];

            this.parts.forEach((part, index) => {
                const row = document.createElement('div');
                row.className = 'scaffold-branch-row';

                let expr;
                if (this.operator === '*') {
                    expr = formatOperation(this.operands[0], this.strategy.symbol, part);
                } else {
                    expr = formatOperation(part, this.strategy.symbol, this.operands[1]);
                }

                const label = document.createElement('div');
                label.className = 'scaffold-prompt';
                label.textContent = `${expr} = ?`;

                const input = document.createElement('input');
                input.type = 'text';
                input.inputMode = 'numeric';
                input.autocomplete = 'off';
                input.placeholder = `Ergebnis ${index + 1}`;
                input.id = `scaffold-intermediate-${index + 1}`;

                row.appendChild(label);
                row.appendChild(input);
                prompts.appendChild(row);
                branchInputs.push(input);
            });

            const actions = document.createElement('div');
            actions.className = 'scaffold-actions';

            const nextBtn = document.createElement('button');
            nextBtn.type = 'button';
            nextBtn.textContent = 'Weiter';

            const tryAdvance = () => {
                if (this._autoActionLock) return;
                const values = branchInputs.map((input) => readIntValue(input));
                if (values.some((v) => v === null)) {
                    return false;
                }

                for (let i = 0; i < values.length; i++) {
                    const expected = this.strategy.getNextStep({
                        phase: PHASES.INTERMEDIATE,
                        operands: this.operands,
                        parts: this.parts,
                        intermediate: this.intermediate,
                        branchIndex: i
                    });
                    if (!isSameNumber(values[i], expected)) {
                        return false;
                    }
                }

                setError('');
                this._autoActionLock = true;
                this.intermediate = values;
                this.phase = PHASES.SYNTHESIS;
                this.render();
                return true;
            };

            nextBtn.addEventListener('click', () => {
                const ok = tryAdvance();
                if (!ok) {
                    const values = branchInputs.map((input) => readIntValue(input));
                    if (values.some((v) => v === null)) {
                        setError('Bitte gib beide Zwischenergebnisse ein.');
                    } else {
                        setError('Mindestens ein Zwischenergebnis stimmt noch nicht.');
                    }
                }
            });

            const onInput = () => {
                this._autoActionLock = false;
                if (tryAdvance()) {
                    return;
                }
            };
            branchInputs.forEach((input) => input.addEventListener('input', onInput));

            const onEnter = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    nextBtn.click();
                }
            };
            branchInputs.forEach((input) => input.addEventListener('keydown', onEnter));

            actions.appendChild(nextBtn);

            wrapper.appendChild(prompts);
            wrapper.appendChild(actions);

            this.contentEl.appendChild(wrapper);

            if (branchInputs[0]) {
                branchInputs[0].focus();
            }
        }

        renderSynthesis() {
            const wrapper = document.createElement('div');
            wrapper.className = 'scaffold-section';

            const title = document.createElement('div');
            title.className = 'scaffold-step-title';
            title.textContent = 'Phase 3: Zusammenführung';

            wrapper.appendChild(title);

            let promptText;
            if (this.strategy.visualizationType === 'linear') {
                const finalPartIndex = this.parts.length - 1;
                const startValue = finalPartIndex === 0
                    ? this.operands[0]
                    : this.intermediate[finalPartIndex - 1];
                const finalPart = this.parts[finalPartIndex];
                promptText = `${formatOperation(startValue, this.strategy.symbol, finalPart)} = ?`;
            } else {
                promptText = `${this.intermediate.join(' + ')} = ?`;
            }

            const prompt = document.createElement('div');
            prompt.className = 'scaffold-prompt';
            prompt.textContent = promptText;

            const input = document.createElement('input');
            input.type = 'text';
            input.inputMode = 'numeric';
            input.autocomplete = 'off';
            input.placeholder = 'Endergebnis';
            input.id = 'scaffold-final';

            const actions = document.createElement('div');
            actions.className = 'scaffold-actions';

            const checkBtn = document.createElement('button');
            checkBtn.type = 'button';
            checkBtn.textContent = '✅';
            checkBtn.className = 'scaffold-check-btn';

            checkBtn.addEventListener('click', () => {
                const value = readIntValue(input);
                if (value === null) {
                    setError('Bitte gib das Endergebnis ein.');
                    return;
                }
                const expected = this.strategy.getNextStep({
                    phase: PHASES.SYNTHESIS,
                    operands: this.operands,
                    parts: this.parts,
                    intermediate: this.intermediate,
                    stepIndex: this.parts.length - 1
                });
                if (!isSameNumber(value, expected)) {
                    setError('Das Endergebnis stimmt noch nicht.');
                    return;
                }
                setError('');
                if (this.answerEl) {
                    this.answerEl.value = String(expected);
                    this.answerEl.focus();
                }
                this.close();
                if (typeof window.checkAnswer === 'function') {
                    window.checkAnswer();
                }
            });

            input.addEventListener('input', () => {
                const value = readIntValue(input);
                if (value === null) return;
                const expected = this.strategy.getNextStep({
                    phase: PHASES.SYNTHESIS,
                    operands: this.operands,
                    parts: this.parts,
                    intermediate: this.intermediate
                });
                if (isSameNumber(value, expected)) {
                    checkBtn.click();
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    checkBtn.click();
                }
            });

            actions.appendChild(checkBtn);

            wrapper.appendChild(prompt);
            wrapper.appendChild(input);
            wrapper.appendChild(actions);

            this.contentEl.appendChild(wrapper);

            input.focus();
        }
    }

    function init() {
        const button = document.getElementById('scaffold-button');
        const modalEl = document.getElementById('scaffold-modal');
        const closeBtn = document.getElementById('close-scaffold-modal');
        const contentEl = document.getElementById('scaffold-content');
        const questionEl = document.getElementById('question');
        const answerEl = document.getElementById('answer');

        if (!button || !modalEl || !closeBtn || !contentEl || !questionEl) return;

        const wizard = new ScaffoldWizard({
            modalEl,
            contentEl,
            questionEl,
            answerEl
        });

        window.openScaffoldWizard = () => wizard.open();
        window.closeScaffoldWizard = () => wizard.close();

        button.addEventListener('click', () => {
            wizard.open();
        });

        closeBtn.addEventListener('click', () => {
            wizard.close();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
