<template>
    <div :class="cx('root')" data-scrollselectors=".p-treetable-scrollable-body" :data-p="dataP" v-bind="ptmi('root')">
        <slot></slot>
        <transition name="p-overlay-mask">
            <div v-if="loading && loadingMode === 'mask'" :class="cx('loading')" v-bind="ptm('loading')">
                <div :class="cx('mask')" v-bind="ptm('mask')">
                    <slot name="loadingicon" :class="cx('loadingIcon')">
                        <component :is="loadingIcon ? 'span' : 'SpinnerIcon'" spin :class="[cx('loadingIcon'), loadingIcon]" v-bind="ptm('loadingIcon')" />
                    </slot>
                </div>
            </div>
        </transition>
        <div v-if="$slots.header" :class="cx('header')" v-bind="ptm('header')">
            <slot name="header"></slot>
        </div>
        <TTPaginator
            v-if="paginatorTop"
            :rows="d_rows"
            :first="d_first"
            :totalRecords="totalRecordsLength"
            :pageLinkSize="pageLinkSize"
            :template="paginatorTemplate"
            :rowsPerPageOptions="rowsPerPageOptions"
            :currentPageReportTemplate="currentPageReportTemplate"
            :class="cx('pcPaginator', { position: 'top' })"
            @page="onPage($event)"
            :alwaysShow="alwaysShowPaginator"
            :unstyled="unstyled"
            :pt="ptm('pcPaginator')"
        >
            <template v-if="$slots.paginatorcontainer" #container="slotProps">
                <slot
                    name="paginatorcontainer"
                    :first="slotProps.first"
                    :last="slotProps.last"
                    :rows="slotProps.rows"
                    :page="slotProps.page"
                    :pageCount="slotProps.pageCount"
                    :totalRecords="slotProps.totalRecords"
                    :firstPageCallback="slotProps.firstPageCallback"
                    :lastPageCallback="slotProps.lastPageCallback"
                    :prevPageCallback="slotProps.prevPageCallback"
                    :nextPageCallback="slotProps.nextPageCallback"
                    :rowChangeCallback="slotProps.rowChangeCallback"
                    :pageLinks="slotProps.pageLinks"
                    :changePageCallback="slotProps.changePageCallback"
                ></slot>
            </template>
            <template v-if="$slots.paginatorstart" #start>
                <slot name="paginatorstart"></slot>
            </template>
            <template v-if="$slots.paginatorend" #end>
                <slot name="paginatorend"></slot>
            </template>
            <template v-if="$slots.paginatorfirstpagelinkicon" #firstpagelinkicon="slotProps">
                <slot name="paginatorfirstpagelinkicon" :class="slotProps.class"></slot>
            </template>
            <template v-if="$slots.paginatorprevpagelinkicon" #prevpagelinkicon="slotProps">
                <slot name="paginatorprevpagelinkicon" :class="slotProps.class"></slot>
            </template>
            <template v-if="$slots.paginatornextpagelinkicon" #nextpagelinkicon="slotProps">
                <slot name="paginatornextpagelinkicon" :class="slotProps.class"></slot>
            </template>
            <template v-if="$slots.paginatorlastpagelinkicon" #lastpagelinkicon="slotProps">
                <slot name="paginatorlastpagelinkicon" :class="slotProps.class"></slot>
            </template>
            <template v-if="$slots.paginatorjumptopagedropdownicon" #jumptopagedropdownicon="slotProps">
                <slot name="paginatorjumptopagedropdownicon" :class="slotProps.class"></slot>
            </template>
            <template v-if="$slots.paginatorrowsperpagedropdownicon" #rowsperpagedropdownicon="slotProps">
                <slot name="paginatorrowsperpagedropdownicon" :class="slotProps.class"></slot>
            </template>
        </TTPaginator>
        <div :class="cx('tableContainer')" :style="[sx('tableContainer'), { maxHeight: scrollHeight }]" v-bind="ptm('tableContainer')">
            <table ref="table" role="treegrid" :class="[cx('table'), tableClass]" :style="tableStyle" v-bind="{ ...tableProps, ...ptm('table') }">
                <thead :class="cx('thead')" :style="sx('thead')" role="rowgroup" v-bind="ptm('thead')">
                    <tr role="row" v-bind="ptm('headerRow')">
                        <template v-for="(col, i) of columns" :key="columnProp(col, 'columnKey') || columnProp(col, 'field') || i">
                            <TTHeaderCell
                                v-if="!columnProp(col, 'hidden')"
                                :column="col"
                                :resizableColumns="resizableColumns"
                                :sortField="d_sortField"
                                :sortOrder="d_sortOrder"
                                :multiSortMeta="d_multiSortMeta"
                                :sortMode="sortMode"
                                :filters="d_filters"
                                :filtersStore="filters"
                                :filterDisplay="filterDisplay"
                                :filterInputProps="filterInputProps"
                                :filterButtonProps="headerFilterButtonProps"
                                @column-click="onColumnHeaderClick($event)"
                                @column-resizestart="onColumnResizeStart($event)"
                                @filter-change="onFilterChange"
                                @filter-apply="onFilterApply"
                                :index="i"
                                :unstyled="unstyled"
                                :pt="pt"
                            ></TTHeaderCell>
                        </template>
                    </tr>
                    <tr v-if="filterDisplay === 'row' || (!filterDisplay && hasColumnFilter())" v-bind="ptm('headerRow')">
                        <template v-for="(col, i) of columns" :key="columnProp(col, 'columnKey') || columnProp(col, 'field') || i">
                            <TTFilterHeaderCell
                                v-if="filterDisplay === 'row' && !columnProp(col, 'hidden')"
                                :column="col"
                                :index="i"
                                display="row"
                                :filters="d_filters"
                                :filtersStore="filters"
                                :filterInputProps="filterInputProps"
                                :filterButtonProps="headerFilterButtonProps"
                                @filter-change="onFilterChange"
                                @filter-apply="onFilterApply"
                                :unstyled="unstyled"
                                :pt="pt"
                            />
                            <th v-else-if="!columnProp(col, 'hidden')" :class="getFilterColumnHeaderClass(col)" :style="[columnProp(col, 'style'), columnProp(col, 'filterHeaderStyle')]" v-bind="ptm('headerCell', ptHeaderCellOptions(col))">
                                <component v-if="col.children && col.children.filter" :is="col.children.filter" :column="col" :index="i" />
                            </th>
                        </template>
                    </tr>
                </thead>
                <tbody :class="cx('tbody')" role="rowgroup" v-bind="ptm('tbody')">
                    <template v-if="!empty">
                        <TTRow
                            v-for="(node, index) of dataToRender"
                            :key="nodeKey(node)"
                            :dataKey="dataKey"
                            :columns="columns"
                            :node="node"
                            :level="0"
                            :expandedKeys="d_expandedKeys"
                            :indentation="indentation"
                            :selectionMode="selectionMode"
                            :selectionKeys="selectionKeys"
                            :ariaSetSize="dataToRender.length"
                            :ariaPosInset="index + 1"
                            :tabindex="setTabindex(node, index)"
                            :loadingMode="loadingMode"
                            :contextMenu="contextMenu"
                            :contextMenuSelection="contextMenuSelection"
                            :templates="$slots"
                            @node-toggle="onNodeToggle"
                            @node-click="onNodeClick"
                            @checkbox-change="onCheckboxChange"
                            @row-rightclick="onRowRightClick($event)"
                            :unstyled="unstyled"
                            :pt="pt"
                        ></TTRow>
                    </template>
                    <tr v-else :class="cx('emptyMessage')" v-bind="ptm('emptyMessage')">
                        <td :colspan="columns.length" v-bind="ptm('emptyMessageCell')">
                            <slot name="empty"></slot>
                        </td>
                    </tr>
                </tbody>
                <tfoot v-if="hasFooter" :class="cx('tfoot')" :style="sx('tfoot')" role="rowgroup" v-bind="ptm('tfoot')">
                    <tr role="row" v-bind="ptm('footerRow')">
                        <template v-for="(col, i) of columns" :key="columnProp(col, 'columnKey') || columnProp(col, 'field') || i">
                            <TTFooterCell v-if="!columnProp(col, 'hidden')" :column="col" :index="i" :unstyled="unstyled" :pt="pt"></TTFooterCell>
                        </template>
                    </tr>
                </tfoot>
            </table>
        </div>
        <TTPaginator
            v-if="paginatorBottom"
            :rows="d_rows"
            :first="d_first"
            :totalRecords="totalRecordsLength"
            :pageLinkSize="pageLinkSize"
            :template="paginatorTemplate"
            :rowsPerPageOptions="rowsPerPageOptions"
            :currentPageReportTemplate="currentPageReportTemplate"
            :class="cx('pcPaginator', { position: 'bottom' })"
            @page="onPage($event)"
            :alwaysShow="alwaysShowPaginator"
            :unstyled="unstyled"
            :pt="ptm('pcPaginator')"
        >
            <template v-if="$slots.paginatorcontainer" #container="slotProps">
                <slot
                    name="paginatorcontainer"
                    :first="slotProps.first"
                    :last="slotProps.last"
                    :rows="slotProps.rows"
                    :page="slotProps.page"
                    :pageCount="slotProps.pageCount"
                    :pageLinks="slotProps.pageLinks"
                    :totalRecords="slotProps.totalRecords"
                    :firstPageCallback="slotProps.firstPageCallback"
                    :lastPageCallback="slotProps.lastPageCallback"
                    :prevPageCallback="slotProps.prevPageCallback"
                    :nextPageCallback="slotProps.nextPageCallback"
                    :rowChangeCallback="slotProps.rowChangeCallback"
                    :changePageCallback="slotProps.changePageCallback"
                ></slot>
            </template>
            <template v-if="$slots.paginatorstart" #start>
                <slot name="paginatorstart"></slot>
            </template>
            <template v-if="$slots.paginatorend" #end>
                <slot name="paginatorend"></slot>
            </template>
            <template v-if="$slots.paginatorfirstpagelinkicon" #firstpagelinkicon="slotProps">
                <slot name="paginatorfirstpagelinkicon" :class="slotProps.class"></slot>
            </template>
            <template v-if="$slots.paginatorprevpagelinkicon" #prevpagelinkicon="slotProps">
                <slot name="paginatorprevpagelinkicon" :class="slotProps.class"></slot>
            </template>
            <template v-if="$slots.paginatornextpagelinkicon" #nextpagelinkicon="slotProps">
                <slot name="paginatornextpagelinkicon" :class="slotProps.class"></slot>
            </template>
            <template v-if="$slots.paginatorlastpagelinkicon" #lastpagelinkicon="slotProps">
                <slot name="paginatorlastpagelinkicon" :class="slotProps.class"></slot>
            </template>
            <template v-if="$slots.paginatorjumptopagedropdownicon" #jumptopagedropdownicon="slotProps">
                <slot name="paginatorjumptopagedropdownicon" :class="slotProps.class"></slot>
            </template>
            <template v-if="$slots.paginatorrowsperpagedropdownicon" #rowsperpagedropdownicon="slotProps">
                <slot name="paginatorrowsperpagedropdownicon" :class="slotProps.class"></slot>
            </template>
        </TTPaginator>
        <div v-if="$slots.footer" :class="cx('footer')" v-bind="ptm('footer')">
            <slot name="footer"></slot>
        </div>
        <div ref="resizeHelper" :class="cx('columnResizeIndicator')" style="display: none" v-bind="ptm('columnResizeIndicator')"></div>
    </div>
</template>

<script>
import { cn } from '@openuxkit/utils';
import { addStyle, clearSelection, find, getAttribute, getIndex, getOffset, getOuterWidth, isRTL, setAttribute } from '@openuxkit/utils/dom';
import { localeComparator, resolveFieldData, sort } from '@openuxkit/utils/object';
import { FilterMatchMode, FilterOperator, FilterService } from '@openvue/core/api';
import { getVNodeProp, HelperSet } from '@openvue/core/utils';
import SpinnerIcon from '@openvue/icons/spinner';
import Paginator from 'openvue/paginator';
import BaseTreeTable from './BaseTreeTable.vue';
import FilterHeaderCell from './FilterHeaderCell.vue';
import FooterCell from './FooterCell.vue';
import HeaderCell from './HeaderCell.vue';
import TreeTableRow from './TreeTableRow.vue';

export default {
    name: 'TreeTable',
    extends: BaseTreeTable,
    inheritAttrs: false,
    emits: [
        'node-expand',
        'node-collapse',
        'update:expandedKeys',
        'update:selectionKeys',
        'node-select',
        'node-unselect',
        'update:first',
        'update:rows',
        'page',
        'update:sortField',
        'update:sortOrder',
        'update:multiSortMeta',
        'sort',
        'filter',
        'update:filters',
        'column-resize-end',
        'update:contextMenuSelection',
        'row-contextmenu'
    ],
    provide() {
        return {
            $columns: this.d_columns
        };
    },
    data() {
        return {
            d_expandedKeys: this.expandedKeys || {},
            d_first: this.first,
            d_rows: this.rows,
            d_sortField: this.sortField,
            d_sortOrder: this.sortOrder,
            d_multiSortMeta: this.multiSortMeta ? [...this.multiSortMeta] : [],
            d_filters: this.cloneFilters(this.filters),
            hasASelectedNode: false,
            d_columns: new HelperSet({ type: 'Column' })
        };
    },
    documentColumnResizeListener: null,
    documentColumnResizeEndListener: null,
    lastResizeHelperX: null,
    resizeColumnElement: null,
    watch: {
        expandedKeys(newValue) {
            this.d_expandedKeys = newValue;
        },
        first(newValue) {
            this.d_first = newValue;
        },
        rows(newValue) {
            this.d_rows = newValue;
        },
        sortField(newValue) {
            this.d_sortField = newValue;
        },
        sortOrder(newValue) {
            this.d_sortOrder = newValue;
        },
        multiSortMeta(newValue) {
            this.d_multiSortMeta = newValue;
        },
        filters: {
            deep: true,
            handler: function (newValue) {
                this.d_filters = this.cloneFilters(newValue);
            }
        }
    },
    beforeUnmount() {
        this.destroyStyleElement();
        this.d_columns.clear();
    },
    methods: {
        columnProp(col, prop) {
            return getVNodeProp(col, prop);
        },
        ptHeaderCellOptions(column) {
            return {
                context: {
                    frozen: this.columnProp(column, 'frozen')
                }
            };
        },
        onNodeToggle(node) {
            const key = this.nodeKey(node);

            if (this.d_expandedKeys[key]) {
                delete this.d_expandedKeys[key];
                this.$emit('node-collapse', node);
            } else {
                this.d_expandedKeys[key] = true;
                this.$emit('node-expand', node);
            }

            this.d_expandedKeys = { ...this.d_expandedKeys };
            this.$emit('update:expandedKeys', this.d_expandedKeys);
        },
        onNodeClick(event) {
            if (this.rowSelectionMode && event.node.selectable !== false) {
                const metaSelection = event.nodeTouched ? false : this.metaKeySelection;
                const _selectionKeys = metaSelection ? this.handleSelectionWithMetaKey(event) : this.handleSelectionWithoutMetaKey(event);

                this.$emit('update:selectionKeys', _selectionKeys);
            }
        },
        nodeKey(node) {
            return resolveFieldData(node, this.dataKey);
        },
        handleSelectionWithMetaKey(event) {
            const originalEvent = event.originalEvent;
            const node = event.node;
            const nodeKey = this.nodeKey(node);
            const metaKey = originalEvent.metaKey || originalEvent.ctrlKey;
            const selected = this.isNodeSelected(node);
            let _selectionKeys;

            if (selected && metaKey) {
                if (this.isSingleSelectionMode()) {
                    _selectionKeys = {};
                } else {
                    _selectionKeys = { ...this.selectionKeys };
                    delete _selectionKeys[nodeKey];
                }

                this.$emit('node-unselect', node);
            } else {
                if (this.isSingleSelectionMode()) {
                    _selectionKeys = {};
                } else if (this.isMultipleSelectionMode()) {
                    _selectionKeys = !metaKey ? {} : this.selectionKeys ? { ...this.selectionKeys } : {};
                }

                _selectionKeys[nodeKey] = true;
                this.$emit('node-select', node);
            }

            return _selectionKeys;
        },
        handleSelectionWithoutMetaKey(event) {
            const node = event.node;
            const nodeKey = this.nodeKey(node);
            const selected = this.isNodeSelected(node);
            let _selectionKeys;

            if (this.isSingleSelectionMode()) {
                if (selected) {
                    _selectionKeys = {};
                    this.$emit('node-unselect', node);
                } else {
                    _selectionKeys = {};
                    _selectionKeys[nodeKey] = true;
                    this.$emit('node-select', node);
                }
            } else {
                if (selected) {
                    _selectionKeys = { ...this.selectionKeys };
                    delete _selectionKeys[nodeKey];

                    this.$emit('node-unselect', node);
                } else {
                    _selectionKeys = this.selectionKeys ? { ...this.selectionKeys } : {};
                    _selectionKeys[nodeKey] = true;

                    this.$emit('node-select', node);
                }
            }

            return _selectionKeys;
        },
        onCheckboxChange(event) {
            this.$emit('update:selectionKeys', event.selectionKeys);

            if (event.check) this.$emit('node-select', event.node);
            else this.$emit('node-unselect', event.node);
        },
        onRowRightClick(event) {
            if (this.contextMenu) {
                clearSelection();
                event.originalEvent.target.focus();
            }

            this.$emit('update:contextMenuSelection', event.node);
            this.$emit('row-contextmenu', event);
        },
        isSingleSelectionMode() {
            return this.selectionMode === 'single';
        },
        isMultipleSelectionMode() {
            return this.selectionMode === 'multiple';
        },
        onPage(event) {
            this.d_first = event.first;
            this.d_rows = event.rows;

            let pageEvent = this.createLazyLoadEvent(event);

            pageEvent.pageCount = event.pageCount;
            pageEvent.page = event.page;

            this.d_expandedKeys = {};
            this.$emit('update:expandedKeys', this.d_expandedKeys);
            this.$emit('update:first', this.d_first);
            this.$emit('update:rows', this.d_rows);
            this.$emit('page', pageEvent);
        },
        resetPage() {
            this.d_first = 0;
            this.$emit('update:first', this.d_first);
        },
        getFilterColumnHeaderClass(column) {
            return [this.cx('headerCell', { column }), this.columnProp(column, 'filterHeaderClass')];
        },
        onColumnHeaderClick(e) {
            let event = e.originalEvent;
            let column = e.column;

            if (this.columnProp(column, 'sortable')) {
                const targetNode = event.target;
                const columnField = this.columnProp(column, 'sortField') || this.columnProp(column, 'field');

                if (
                    getAttribute(targetNode, 'data-p-sortable-column') === true ||
                    getAttribute(targetNode, 'data-pc-section') === 'columntitle' ||
                    getAttribute(targetNode, 'data-pc-section') === 'columnheadercontent' ||
                    getAttribute(targetNode, 'data-pc-section') === 'sorticon' ||
                    getAttribute(targetNode.parentElement, 'data-pc-section') === 'sorticon' ||
                    getAttribute(targetNode.parentElement.parentElement, 'data-pc-section') === 'sorticon' ||
                    targetNode.closest('[data-p-sortable-column="true"]')
                ) {
                    clearSelection();

                    if (this.sortMode === 'single') {
                        if (this.d_sortField === columnField) {
                            if (this.removableSort && this.d_sortOrder * -1 === this.defaultSortOrder) {
                                this.d_sortOrder = null;
                                this.d_sortField = null;
                            } else {
                                this.d_sortOrder = this.d_sortOrder * -1;
                            }
                        } else {
                            this.d_sortOrder = this.defaultSortOrder;
                            this.d_sortField = columnField;
                        }

                        this.$emit('update:sortField', this.d_sortField);
                        this.$emit('update:sortOrder', this.d_sortOrder);
                        this.resetPage();
                    } else if (this.sortMode === 'multiple') {
                        let metaKey = event.metaKey || event.ctrlKey;

                        if (!metaKey) {
                            this.d_multiSortMeta = this.d_multiSortMeta.filter((meta) => meta.field === columnField);
                        }

                        this.addMultiSortField(columnField);
                        this.$emit('update:multiSortMeta', this.d_multiSortMeta);
                    }

                    this.$emit('sort', this.createLazyLoadEvent(event));
                }
            }
        },
        addMultiSortField(field) {
            let index = this.d_multiSortMeta.findIndex((meta) => meta.field === field);

            if (index >= 0) {
                if (this.removableSort && this.d_multiSortMeta[index].order * -1 === this.defaultSortOrder) this.d_multiSortMeta.splice(index, 1);
                else this.d_multiSortMeta[index] = { field: field, order: this.d_multiSortMeta[index].order * -1 };
            } else {
                this.d_multiSortMeta.push({ field: field, order: this.defaultSortOrder });
            }

            this.d_multiSortMeta = [...this.d_multiSortMeta];
        },
        sortSingle(nodes) {
            return this.sortNodesSingle(nodes);
        },
        sortNodesSingle(nodes) {
            const comparer = localeComparator();

            return [...nodes]
                .sort((node1, node2) => {
                    const value1 = resolveFieldData(node1.data, this.d_sortField);
                    const value2 = resolveFieldData(node2.data, this.d_sortField);

                    return sort(value1, value2, this.d_sortOrder, comparer);
                })
                .map((node) => (node.children && node.children.length ? { ...node, children: this.sortNodesSingle(node.children) } : node));
        },
        sortMultiple(nodes) {
            return this.sortNodesMultiple(nodes);
        },
        sortNodesMultiple(nodes) {
            return [...nodes]
                .sort((node1, node2) => {
                    return this.multisortField(node1, node2, 0);
                })
                .map((node) => (node.children && node.children.length ? { ...node, children: this.sortNodesMultiple(node.children) } : node));
        },
        multisortField(node1, node2, index) {
            const value1 = resolveFieldData(node1.data, this.d_multiSortMeta[index].field);
            const value2 = resolveFieldData(node2.data, this.d_multiSortMeta[index].field);
            const comparer = localeComparator();

            if (value1 === value2) {
                return this.d_multiSortMeta.length - 1 > index ? this.multisortField(node1, node2, index + 1) : 0;
            }

            return sort(value1, value2, this.d_multiSortMeta[index].order, comparer);
        },
        filter(value) {
            const strict = this.filterMode === 'strict';
            const activeFilters = this.getActiveFilters(this.filters);
            const hasGlobalFilter = Object.prototype.hasOwnProperty.call(activeFilters, 'global');
            let filteredNodes = value;

            if (Object.keys(activeFilters).length > 0) {
                const globalFilterFields = hasGlobalFilter ? this.globalFilterFields || this.columns.map((col) => this.columnProp(col, 'filterField') || this.columnProp(col, 'field')) : [];

                filteredNodes = [];

                for (let node of value) {
                    let copyNode = { ...node };
                    let localMatch = true;
                    let globalMatch = false;

                    //local
                    for (let j = 0; j < this.columns.length; j++) {
                        let col = this.columns[j];
                        let filterField = this.columnProp(col, 'filterField') || this.columnProp(col, 'field');

                        if (Object.prototype.hasOwnProperty.call(activeFilters, filterField)) {
                            localMatch = this.isColumnFilterMatched(copyNode, col, filterField, activeFilters[filterField], strict);
                        }

                        if (!localMatch) {
                            break;
                        }
                    }

                    //global
                    if (localMatch && hasGlobalFilter) {
                        const globalFilterMeta = activeFilters['global'];
                        const filterValue = this.isFilterMetaObject(globalFilterMeta) ? globalFilterMeta.value : globalFilterMeta;
                        const filterConstraint = this.resolveFilterConstraint(this.isFilterMetaObject(globalFilterMeta) ? globalFilterMeta.matchMode || FilterMatchMode.CONTAINS : FilterMatchMode.CONTAINS);

                        for (let filterField of globalFilterFields) {
                            let copyNodeForGlobal = { ...copyNode };

                            if (this.isNodeFilterMatched(copyNodeForGlobal, { filterField, filterValue, filterConstraint, strict })) {
                                globalMatch = true;
                                copyNode = copyNodeForGlobal;
                                break;
                            }
                        }
                    }

                    if (hasGlobalFilter ? localMatch && globalMatch : localMatch) {
                        filteredNodes.push(copyNode);
                    }
                }
            }

            let filterEvent = this.createLazyLoadEvent();

            filterEvent.filteredValue = filteredNodes;
            this.$emit('filter', filterEvent);

            return filteredNodes;
        },
        isFilterMetaObject(filterMeta) {
            return filterMeta !== null && typeof filterMeta === 'object';
        },
        resolveFilterConstraint(matchMode) {
            return FilterService.filters[matchMode || FilterMatchMode.STARTS_WITH];
        },
        isColumnFilterMatched(node, col, filterField, filterMeta, strict) {
            if (!this.isFilterMetaObject(filterMeta)) {
                // legacy flat value, the match mode comes from the column
                return this.isNodeFilterMatched(node, { filterField, filterValue: filterMeta, filterConstraint: this.resolveFilterConstraint(this.columnProp(col, 'filterMatchMode')), strict });
            }

            if (filterMeta.operator) {
                const constraints = filterMeta.constraints;

                if (filterMeta.operator === FilterOperator.OR) {
                    // single pass with a combined predicate, keeps every branch matching any constraint
                    const filterConstraint = (dataFieldValue, filterValue, filterLocale) => constraints.some((constraint) => this.resolveFilterConstraint(constraint.matchMode)(dataFieldValue, constraint.value, filterLocale));

                    return this.isNodeFilterMatched(node, { filterField, filterValue: null, filterConstraint, strict });
                }

                // each constraint prunes the subtree left by the previous one
                return constraints.every((constraint) => this.isNodeFilterMatched(node, { filterField, filterValue: constraint.value, filterConstraint: this.resolveFilterConstraint(constraint.matchMode), strict }));
            }

            return this.isNodeFilterMatched(node, { filterField, filterValue: filterMeta.value, filterConstraint: this.resolveFilterConstraint(filterMeta.matchMode || this.columnProp(col, 'filterMatchMode')), strict });
        },
        isNodeFilterMatched(node, paramsWithoutNode) {
            // evaluation order matters, findFilteredNodes prunes the children of the node copy
            return paramsWithoutNode.strict ? !!(this.findFilteredNodes(node, paramsWithoutNode) || this.isFilterMatched(node, paramsWithoutNode)) : !!(this.isFilterMatched(node, paramsWithoutNode) || this.findFilteredNodes(node, paramsWithoutNode));
        },
        getActiveFilters(filters) {
            const removeEmptyFilters = ([key, value]) => {
                if (!this.isFilterMetaObject(value)) {
                    return [key, value];
                }

                if (value.constraints) {
                    const filteredConstraints = value.constraints.filter((constraint) => constraint.value !== null);

                    if (filteredConstraints.length > 0) {
                        return [key, { ...value, constraints: filteredConstraints }];
                    }
                } else if (value.value !== null) {
                    return [key, value];
                }

                return undefined;
            };

            const filterValidEntries = (entry) => entry !== undefined;
            const entries = Object.entries(filters || {})
                .map(removeEmptyFilters)
                .filter(filterValidEntries);

            return Object.fromEntries(entries);
        },
        cloneFilters(filters) {
            let cloned = {};

            if (filters) {
                Object.entries(filters).forEach(([prop, value]) => {
                    if (!this.isFilterMetaObject(value)) {
                        cloned[prop] = value;
                    } else if (value.operator) {
                        cloned[prop] = {
                            operator: value.operator,
                            constraints: value.constraints.map((constraint) => {
                                return { ...constraint };
                            })
                        };
                    } else {
                        cloned[prop] = { ...value };
                    }
                });
            }

            return cloned;
        },
        onFilterChange(filters) {
            this.d_filters = filters;
        },
        onFilterApply() {
            this.d_first = 0;
            this.$emit('update:first', this.d_first);
            this.$emit('update:filters', this.d_filters);

            if (this.lazy) {
                const filterEvent = this.createLazyLoadEvent();

                filterEvent.filters = this.d_filters;
                this.$emit('filter', filterEvent);
            }
        },
        findFilteredNodes(node, paramsWithoutNode) {
            if (node) {
                let matched = false;

                if (node.children) {
                    let childNodes = [...node.children];

                    node.children = [];

                    for (let childNode of childNodes) {
                        let copyChildNode = { ...childNode };

                        if (this.isFilterMatched(copyChildNode, paramsWithoutNode)) {
                            matched = true;
                            node.children.push(copyChildNode);
                        }
                    }
                }

                if (matched) {
                    return true;
                }
            }
        },
        isFilterMatched(node, { filterField, filterValue, filterConstraint, strict }) {
            let matched = false;
            let dataFieldValue = resolveFieldData(node.data, filterField);

            if (filterConstraint(dataFieldValue, filterValue, this.filterLocale)) {
                matched = true;
            }

            if (!matched || (strict && !this.isNodeLeaf(node))) {
                matched = this.findFilteredNodes(node, { filterField, filterValue, filterConstraint, strict }) || matched;
            }

            return matched;
        },
        isNodeSelected(node) {
            return this.selectionMode && this.selectionKeys ? this.selectionKeys[this.nodeKey(node)] === true : false;
        },
        isNodeLeaf(node) {
            return node.leaf === false ? false : !(node.children && node.children.length);
        },
        createLazyLoadEvent(event) {
            let filterMatchModes;

            if (this.hasFilters()) {
                filterMatchModes = {};
                this.columns.forEach((col) => {
                    if (this.columnProp(col, 'field')) {
                        filterMatchModes[col.props.field] = this.columnProp(col, 'filterMatchMode');
                    }
                });
            }

            return {
                originalEvent: event,
                first: this.d_first,
                rows: this.d_rows,
                sortField: this.d_sortField,
                sortOrder: this.d_sortOrder,
                multiSortMeta: this.d_multiSortMeta,
                filters: this.filters,
                filterMatchModes: filterMatchModes
            };
        },
        onColumnResizeStart(event) {
            let containerLeft = getOffset(this.$el).left;

            this.resizeColumnElement = event.target.parentElement;
            this.columnResizing = true;
            this.lastResizeHelperX = event.pageX - containerLeft + this.$el.scrollLeft;

            this.bindColumnResizeEvents();
        },
        onColumnResize(event) {
            let containerLeft = getOffset(this.$el).left;

            this.$el.setAttribute('data-p-unselectable-text', 'true');
            !this.isUnstyled && addStyle(this.$el, { 'user-select': 'none' });
            this.$refs.resizeHelper.style.height = this.$el.offsetHeight + 'px';
            this.$refs.resizeHelper.style.top = 0 + 'px';
            this.$refs.resizeHelper.style.left = event.pageX - containerLeft + this.$el.scrollLeft + 'px';

            this.$refs.resizeHelper.style.display = 'block';
        },
        onColumnResizeEnd() {
            let delta = isRTL(this.$el) ? this.lastResizeHelperX - this.$refs.resizeHelper.offsetLeft : this.$refs.resizeHelper.offsetLeft - this.lastResizeHelperX;
            let columnWidth = this.resizeColumnElement.offsetWidth;
            let newColumnWidth = columnWidth + delta;
            let minWidth = this.resizeColumnElement.style.minWidth || 15;

            if (columnWidth + delta > parseInt(minWidth, 10)) {
                if (this.columnResizeMode === 'fit') {
                    let nextColumn = this.resizeColumnElement.nextElementSibling;
                    let nextColumnWidth = nextColumn.offsetWidth - delta;

                    if (newColumnWidth > 15 && nextColumnWidth > 15) {
                        this.resizeTableCells(newColumnWidth, nextColumnWidth);
                    }
                } else if (this.columnResizeMode === 'expand') {
                    const tableWidth = this.$refs.table.offsetWidth + delta + 'px';

                    const updateTableWidth = (el) => {
                        !!el && (el.style.width = el.style.minWidth = tableWidth);
                    };

                    // Reasoning: resize table cells before updating the table width so that it can use existing computed cell widths and adjust only the one column.
                    this.resizeTableCells(newColumnWidth);
                    updateTableWidth(this.$refs.table);
                }

                this.$emit('column-resize-end', {
                    element: this.resizeColumnElement,
                    delta: delta
                });
            }

            this.$refs.resizeHelper.style.display = 'none';
            this.resizeColumn = null;
            this.$el.removeAttribute('data-p-unselectable-text');
            !this.isUnstyled && (this.$el.style['user-select'] = '');

            this.unbindColumnResizeEvents();
        },
        resizeTableCells(newColumnWidth, nextColumnWidth) {
            let colIndex = getIndex(this.resizeColumnElement);
            let widths = [];
            let headers = find(this.$refs.table, 'thead[data-pc-section="thead"] > tr > th');

            headers.forEach((header) => widths.push(getOuterWidth(header)));

            this.destroyStyleElement();
            this.createStyleElement();

            let innerHTML = '';
            let selector = `[data-pc-name="treetable"][${this.$attrSelector}] > [data-pc-section="tablecontainer"] > table[data-pc-section="table"]`;

            widths.forEach((width, index) => {
                let colWidth = index === colIndex ? newColumnWidth : nextColumnWidth && index === colIndex + 1 ? nextColumnWidth : width;
                let style = `width: ${colWidth}px !important; max-width: ${colWidth}px !important`;

                innerHTML += `
                    ${selector} > thead[data-pc-section="thead"] > tr > th:nth-child(${index + 1}),
                    ${selector} > tbody[data-pc-section="tbody"] > tr > td:nth-child(${index + 1}),
                    ${selector} > tfoot[data-pc-section="tfoot"] > tr > td:nth-child(${index + 1}) {
                        ${style}
                    }
                `;
            });

            this.styleElement.innerHTML = innerHTML;
        },
        bindColumnResizeEvents() {
            if (!this.documentColumnResizeListener) {
                this.documentColumnResizeListener = document.addEventListener('mousemove', (event) => {
                    if (this.columnResizing) {
                        this.onColumnResize(event);
                    }
                });
            }

            if (!this.documentColumnResizeEndListener) {
                this.documentColumnResizeEndListener = document.addEventListener('mouseup', () => {
                    if (this.columnResizing) {
                        this.columnResizing = false;
                        this.onColumnResizeEnd();
                    }
                });
            }
        },
        unbindColumnResizeEvents() {
            if (this.documentColumnResizeListener) {
                document.removeEventListener('document', this.documentColumnResizeListener);
                this.documentColumnResizeListener = null;
            }

            if (this.documentColumnResizeEndListener) {
                document.removeEventListener('document', this.documentColumnResizeEndListener);
                this.documentColumnResizeEndListener = null;
            }
        },
        onColumnKeyDown(event, col) {
            if ((event.code === 'Enter' || event.code === 'NumpadEnter') && event.currentTarget.nodeName === 'TH' && getAttribute(event.currentTarget, 'data-p-sortable-column')) {
                this.onColumnHeaderClick(event, col);
            }
        },
        hasColumnFilter() {
            if (this.columns) {
                for (let col of this.columns) {
                    if (col.children && col.children.filter) {
                        return true;
                    }
                }
            }

            return false;
        },
        hasFilters() {
            return this.filters && Object.keys(this.filters).length > 0 && this.filters.constructor === Object;
        },
        hasGlobalFilter() {
            return this.filters && Object.prototype.hasOwnProperty.call(this.filters, 'global');
        },
        getItemLabel(node) {
            return node.data.name;
        },
        createStyleElement() {
            this.styleElement = document.createElement('style');
            this.styleElement.type = 'text/css';
            setAttribute(this.styleElement, 'nonce', this.$primevue?.config?.csp?.nonce);
            document.head.appendChild(this.styleElement);
        },
        destroyStyleElement() {
            if (this.styleElement) {
                document.head.removeChild(this.styleElement);
                this.styleElement = null;
            }
        },
        setTabindex(node, index) {
            if (this.isNodeSelected(node)) {
                this.hasASelectedNode = true;

                return 0;
            }

            if (this.selectionMode) {
                if (!this.isNodeSelected(node) && index === 0 && !this.hasASelectedNode) return 0;
            } else if (!this.selectionMode && index === 0) {
                return 0;
            }

            return -1;
        }
    },
    computed: {
        columns() {
            return this.d_columns.get(this);
        },
        headerFilterButtonProps() {
            return {
                filter: { severity: 'secondary', text: true, rounded: true },
                ...this.filterButtonProps,
                inline: {
                    clear: { severity: 'secondary', text: true, rounded: true },
                    ...this.filterButtonProps.inline
                },
                popover: {
                    addRule: { severity: 'info', text: true, size: 'small' },
                    removeRule: { severity: 'danger', text: true, size: 'small' },
                    apply: { size: 'small' },
                    clear: { outlined: true, size: 'small' },
                    ...this.filterButtonProps.popover
                }
            };
        },
        processedData() {
            if (this.lazy) {
                return this.value;
            } else {
                if (this.value && this.value.length) {
                    let data = this.value;

                    if (this.sorted) {
                        if (this.sortMode === 'single') data = this.sortSingle(data);
                        else if (this.sortMode === 'multiple') data = this.sortMultiple(data);
                    }

                    if (this.hasFilters()) {
                        data = this.filter(data);
                    }

                    return data;
                } else {
                    return null;
                }
            }
        },
        dataToRender() {
            const data = this.processedData;

            if (this.paginator) {
                const first = this.lazy ? 0 : this.d_first;

                return data.slice(first, first + this.d_rows);
            } else {
                return data;
            }
        },
        empty() {
            const data = this.processedData;

            return !data || data.length === 0;
        },
        sorted() {
            return this.d_sortField || (this.d_multiSortMeta && this.d_multiSortMeta.length > 0);
        },
        hasFooter() {
            let hasFooter = false;

            for (let col of this.columns) {
                if (this.columnProp(col, 'footer') || (col.children && col.children.footer)) {
                    hasFooter = true;
                    break;
                }
            }

            return hasFooter;
        },
        paginatorTop() {
            return this.paginator && (this.paginatorPosition !== 'bottom' || this.paginatorPosition === 'both');
        },
        paginatorBottom() {
            return this.paginator && (this.paginatorPosition !== 'top' || this.paginatorPosition === 'both');
        },
        singleSelectionMode() {
            return this.selectionMode && this.selectionMode === 'single';
        },
        multipleSelectionMode() {
            return this.selectionMode && this.selectionMode === 'multiple';
        },
        rowSelectionMode() {
            return this.singleSelectionMode || this.multipleSelectionMode;
        },
        totalRecordsLength() {
            if (this.lazy) {
                return this.totalRecords;
            } else {
                const data = this.processedData;

                return data ? data.length : 0;
            }
        },
        dataP() {
            return cn({
                scrollable: this.scrollable,
                'flex-scrollable': this.scrollable && this.scrollHeight === 'flex',
                [this.size]: this.size,
                loading: this.loading,
                empty: this.empty
            });
        }
    },
    components: {
        TTRow: TreeTableRow,
        TTPaginator: Paginator,
        TTHeaderCell: HeaderCell,
        TTFilterHeaderCell: FilterHeaderCell,
        TTFooterCell: FooterCell,
        SpinnerIcon: SpinnerIcon
    }
};
</script>
