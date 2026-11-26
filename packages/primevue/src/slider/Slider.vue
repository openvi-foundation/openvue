<template>
    <div :class="cx('root')" @click="onBarClick" v-bind="ptmi('root')" :data-p-sliding="false" :data-p="dataP">
        <span :class="cx('range')" :style="[sx('range'), rangeStyle()]" v-bind="ptm('range')" :data-p="dataP"></span>
        <span
            v-if="!range"
            :class="cx('handle')"
            :style="[sx('handle'), handleStyle()]"
            @touchstart.passive="onDragStart($event)"
            @touchmove.passive="onDrag($event)"
            @touchend="onDragEnd($event)"
            @mousedown="onMouseDown($event)"
            @keydown="onKeyDown($event)"
            @blur="onBlur($event)"
            :tabindex="disabled ? -1 : tabindex"
            role="slider"
            :aria-valuemin="min"
            :aria-valuenow="d_value"
            :aria-valuemax="max"
            :aria-labelledby="ariaLabelledby"
            :aria-label="ariaLabel"
            :aria-orientation="orientation"
            :aria-disabled="disabled"
            v-bind="ptm('handle')"
            :data-p="dataP"
        ></span>
        <span
            v-if="range"
            :class="cx('handle')"
            :style="[sx('handle'), rangeStartHandleStyle()]"
            @touchstart.passive="onDragStart($event, 0)"
            @touchmove.passive="onDrag($event)"
            @touchend="onDragEnd($event)"
            @mousedown="onMouseDown($event, 0)"
            @keydown="onKeyDown($event, 0)"
            @blur="onBlur($event, 0)"
            :tabindex="disabled ? -1 : tabindex"
            role="slider"
            :aria-valuemin="min"
            :aria-valuenow="d_value ? d_value[0] : null"
            :aria-valuemax="max"
            :aria-labelledby="ariaLabelledby"
            :aria-label="ariaLabel"
            :aria-orientation="orientation"
            :aria-disabled="disabled"
            v-bind="ptm('startHandler')"
            :data-p="dataP"
        ></span>
        <span
            v-if="range"
            :class="cx('handle')"
            :style="[sx('handle'), rangeEndHandleStyle()]"
            @touchstart.passive="onDragStart($event, 1)"
            @touchmove.passive="onDrag($event)"
            @touchend="onDragEnd($event)"
            @mousedown="onMouseDown($event, 1)"
            @keydown="onKeyDown($event, 1)"
            @blur="onBlur($event, 1)"
            :tabindex="disabled ? -1 : tabindex"
            role="slider"
            :aria-valuemin="min"
            :aria-valuenow="d_value ? d_value[1] : null"
            :aria-valuemax="max"
            :aria-labelledby="ariaLabelledby"
            :aria-label="ariaLabel"
            :aria-orientation="orientation"
            :aria-disabled="disabled"
            v-bind="ptm('endHandler')"
            :data-p="dataP"
        ></span>
    </div>
</template>

<script>
import { cn } from '@openuxkit/utils';
import { getAttribute, getWindowScrollLeft, getWindowScrollTop, isRTL } from '@openuxkit/utils/dom';
import BaseSlider from './BaseSlider.vue';

export default {
    name: 'Slider',
    extends: BaseSlider,
    inheritAttrs: false,
    emits: ['change', 'slideend'],
    dragging: false,
    handleIndex: null,
    initX: null,
    initY: null,
    barWidth: null,
    barHeight: null,
    dragListener: null,
    dragEndListener: null,
    beforeUnmount() {
        this.unbindDragListeners();
    },
    methods: {
        updateDomData() {
            let rect = this.$el.getBoundingClientRect();

            this.initX = rect.left + getWindowScrollLeft();
            this.initY = rect.top + getWindowScrollTop();
            this.barWidth = this.$el.offsetWidth;
            this.barHeight = this.$el.offsetHeight;
        },
        setValue(event) {
            let handleValue;
            let pageX = event.touches ? event.touches[0].pageX : event.pageX;
            let pageY = event.touches ? event.touches[0].pageY : event.pageY;

            if (this.orientation === 'horizontal') {
                // @todo: Check this
                if (isRTL(this.$el)) {
                    handleValue = ((this.initX + this.barWidth - pageX) * 100) / this.barWidth;
                } else {
                    handleValue = ((pageX - this.initX) * 100) / this.barWidth;
                }
            } else {
                handleValue = ((this.initY + this.barHeight - pageY) * 100) / this.barHeight;
            }

            if (this.inverted) {
                handleValue = 100 - handleValue;
            }

            const newValue = (this.max - this.min) * (handleValue / 100) + this.min;

            this.updateModel(event, this.snapToStep(newValue));
        },
        snapToStep(value) {
            const clamped = Math.min(Math.max(value, this.min), this.max);
            const snapped = this.min + Math.round((clamped - this.min) / this.stepSize) * this.stepSize;

            return Math.min(this.roundToPrecision(snapped), this.max);
        },
        roundToPrecision(value) {
            const factor = 10 ** this.precision;

            return Math.round(value * factor) / factor;
        },
        stepBy(event, count) {
            const value = this.range ? this.value[this.handleIndex] : this.value;
            const position = (value - this.min) / this.stepSize;
            const nearest = Math.round(position);
            let current;

            if (Math.abs(position - nearest) < 1e-9) current = nearest;
            else current = count > 0 ? Math.floor(position) : Math.ceil(position);

            const newValue = this.snapToStep(this.min + (current + count) * this.stepSize);

            if ((newValue - value) * count >= 0) {
                this.updateModel(event, newValue);
            }
        },
        updateModel(event, value) {
            let modelValue;

            if (this.range) {
                const index = this.handleIndex === 0 ? 0 : 1;

                if (this.d_value?.[index] === value) return;

                modelValue = [...this.value];
                modelValue[index] = value;
            } else {
                if (this.d_value === value) return;

                modelValue = value;
            }

            this.writeValue(modelValue, event);
            this.$emit('change', modelValue);
        },
        onDragStart(event, index) {
            if (this.disabled) {
                return;
            }

            this.$el.setAttribute('data-p-sliding', true);
            this.dragging = true;
            this.updateDomData();

            if (this.range && this.value[0] === this.snapToStep(this.max)) {
                this.handleIndex = 0;
            } else {
                this.handleIndex = index;
            }

            event.currentTarget.focus();
        },
        onDrag(event) {
            if (this.dragging) {
                this.setValue(event);
            }
        },
        onDragEnd(event) {
            if (this.dragging) {
                this.dragging = false;
                this.$el.setAttribute('data-p-sliding', false);
                this.$emit('slideend', { originalEvent: event, value: this.value });
            }
        },
        onBarClick(event) {
            if (this.disabled) {
                return;
            }

            if (getAttribute(event.target, 'data-pc-section') !== 'handle') {
                this.updateDomData();
                this.setValue(event);
            }
        },
        onMouseDown(event, index) {
            this.bindDragListeners();
            this.onDragStart(event, index);
        },
        onKeyDown(event, index) {
            if (this.disabled) {
                return;
            }

            this.handleIndex = index;

            switch (event.code) {
                case 'ArrowDown':
                case 'ArrowLeft':
                case 'ArrowUp':
                case 'ArrowRight':
                    this.stepBy(event, this.getArrowStep(event.code));
                    break;

                case 'PageDown':
                    this.stepBy(event, -10);
                    break;

                case 'PageUp':
                    this.stepBy(event, 10);
                    break;

                case 'Home':
                    this.updateModel(event, this.min);
                    break;

                case 'End':
                    this.updateModel(event, this.snapToStep(this.max));
                    break;

                default:
                    return;
            }

            event.preventDefault();
        },
        getArrowStep(code) {
            const step = code === 'ArrowUp' || code === 'ArrowRight' ? 1 : -1;
            const alongAxis = this.horizontal ? code === 'ArrowLeft' || code === 'ArrowRight' : code === 'ArrowUp' || code === 'ArrowDown';
            const reversed = this.horizontal ? this.inverted !== isRTL(this.$el) : this.inverted;

            return alongAxis && reversed ? -step : step;
        },
        onBlur(event, index) {
            this.formField.onBlur?.(event);
        },
        bindDragListeners() {
            if (!this.dragListener) {
                this.dragListener = this.onDrag.bind(this);
                document.addEventListener('mousemove', this.dragListener);
            }

            if (!this.dragEndListener) {
                this.dragEndListener = this.onDragEnd.bind(this);
                document.addEventListener('mouseup', this.dragEndListener);
            }
        },
        unbindDragListeners() {
            if (this.dragListener) {
                document.removeEventListener('mousemove', this.dragListener);
                this.dragListener = null;
            }

            if (this.dragEndListener) {
                document.removeEventListener('mouseup', this.dragEndListener);
                this.dragEndListener = null;
            }
        },
        rangeStyle() {
            let start;
            let size;

            if (this.range) {
                size = Math.abs(this.rangeEndPosition - this.rangeStartPosition);
                start = Math.min(this.rangeStartPosition, this.rangeEndPosition);

                if (this.inverted) start = 100 - start - size;
            } else {
                size = this.handlePosition;

                if (this.inverted) start = 100 - size;
            }

            const offset = start === undefined ? undefined : start + '%';

            return this.horizontal ? { 'inset-inline-start': offset, width: size + '%' } : { bottom: offset, height: size + '%' };
        },
        positionStyle(position) {
            const offset = (this.inverted ? 100 - position : position) + '%';

            return this.horizontal ? { 'inset-inline-start': offset } : { bottom: offset };
        },
        handleStyle() {
            return this.positionStyle(this.handlePosition);
        },
        rangeStartHandleStyle() {
            return this.positionStyle(this.rangeStartPosition);
        },
        rangeEndHandleStyle() {
            return this.positionStyle(this.rangeEndPosition);
        }
    },
    computed: {
        value() {
            if (this.range) {
                return [this.d_value?.[0] ?? this.min, this.d_value?.[1] ?? this.max];
            }

            return this.d_value ?? this.min;
        },
        stepSize() {
            return this.step || 1;
        },
        precision() {
            const decimals = (number) => String(number).split('.')[1]?.length ?? 0;

            return Math.max(decimals(this.stepSize), decimals(this.min));
        },
        horizontal() {
            return this.orientation === 'horizontal';
        },
        vertical() {
            return this.orientation === 'vertical';
        },
        handlePosition() {
            if (this.value < this.min) return 0;
            else if (this.value > this.max) return 100;
            else return ((this.value - this.min) * 100) / (this.max - this.min);
        },
        rangeStartPosition() {
            if (this.value && this.value[0] !== undefined) {
                if (this.value[0] < this.min) return 0;
                else return ((this.value[0] - this.min) * 100) / (this.max - this.min);
            } else return 0;
        },
        rangeEndPosition() {
            if (this.value && this.value.length === 2 && this.value[1] !== undefined) {
                if (this.value[1] > this.max) return 100;
                else return ((this.value[1] - this.min) * 100) / (this.max - this.min);
            } else return 100;
        },
        dataP() {
            return cn({
                [this.orientation]: this.orientation
            });
        }
    }
};
</script>
