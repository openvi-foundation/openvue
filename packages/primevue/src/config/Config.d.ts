import type { DefaultPassThrough, PassThrough } from '@openvue/core';
import type { PrimeVueCSPOptions, PrimeVueLocaleOptions, PrimeVueZIndexOptions } from '@openvue/core/config';
import type { AccordionPassThroughOptions } from 'openvue/accordion';
import type { AccordionContentPassThroughOptions } from 'openvue/accordioncontent';
import type { AccordionHeaderPassThroughOptions } from 'openvue/accordionheader';
import type { AccordionPanelPassThroughOptions } from 'openvue/accordionpanel';
import type { AccordionTabPassThroughOptions } from 'openvue/accordiontab';
import type { AnimateOnScrollDirectivePassThroughOptions } from 'openvue/animateonscroll';
import type { AutoCompletePassThroughOptions } from 'openvue/autocomplete';
import type { AvatarPassThroughOptions } from 'openvue/avatar';
import type { AvatarGroupPassThroughOptions } from 'openvue/avatargroup';
import type { BadgePassThroughOptions } from 'openvue/badge';
import type { BadgeDirectivePassThroughOptions } from 'openvue/badgedirective';
import type { BlockUIPassThroughOptions } from 'openvue/blockui';
import type { BreadcrumbPassThroughOptions } from 'openvue/breadcrumb';
import type { ButtonPassThroughOptions } from 'openvue/button';
import type { ButtonGroupPassThroughOptions } from 'openvue/buttongroup';
import type { CalendarPassThroughOptions } from 'openvue/calendar';
import type { CardPassThroughOptions } from 'openvue/card';
import type { CarouselPassThroughOptions } from 'openvue/carousel';
import type { CascadeSelectPassThroughOptions } from 'openvue/cascadeselect';
import type { ChartPassThroughOptions } from 'openvue/chart';
import type { CheckboxPassThroughOptions } from 'openvue/checkbox';
import type { CheckboxGroupPassThroughOptions } from 'openvue/checkboxgroup';
import type { ChipPassThroughOptions } from 'openvue/chip';
import type { ChipsPassThroughOptions } from 'openvue/chips';
import type { ColorPickerPassThroughOptions } from 'openvue/colorpicker';
import type { ColumnPassThroughOptions } from 'openvue/column';
import type { ColumnGroupPassThroughOptions } from 'openvue/columngroup';
import type { ConfirmDialogPassThroughOptions } from 'openvue/confirmdialog';
import type { ConfirmPopupPassThroughOptions } from 'openvue/confirmpopup';
import type { ContextMenuPassThroughOptions } from 'openvue/contextmenu';
import type { DataTablePassThroughOptions } from 'openvue/datatable';
import type { DataViewPassThroughOptions } from 'openvue/dataview';
import type { DatePickerPassThroughOptions } from 'openvue/datepicker';
import type { DeferredContentPassThroughOptions } from 'openvue/deferredcontent';
import type { DialogPassThroughOptions } from 'openvue/dialog';
import type { DividerPassThroughOptions } from 'openvue/divider';
import type { DockPassThroughOptions } from 'openvue/dock';
import type { DrawerPassThroughOptions } from 'openvue/drawer';
import type { DropdownPassThroughOptions } from 'openvue/dropdown';
import type { EditorPassThroughOptions } from 'openvue/editor';
import type { FieldsetPassThroughOptions } from 'openvue/fieldset';
import type { FileUploadPassThroughOptions } from 'openvue/fileupload';
import type { FloatLabelPassThroughOptions } from 'openvue/floatlabel';
import type { FluidPassThroughOptions } from 'openvue/fluid';
import type { FocusTrapDirectivePassThroughOptions } from 'openvue/focustrap';
import type { GalleriaPassThroughOptions } from 'openvue/galleria';
import type { IconFieldPassThroughOptions } from 'openvue/iconfield';
import type { IftaLabelPassThroughOptions } from 'openvue/iftalabel';
import type { ImagePassThroughOptions } from 'openvue/image';
import type { ImageComparePassThroughOptions } from 'openvue/imagecompare';
import type { InlineMessagePassThroughOptions } from 'openvue/inlinemessage';
import type { InplacePassThroughOptions } from 'openvue/inplace';
import type { InputChipsPassThroughOptions } from 'openvue/inputchips';
import type { InputGroupPassThroughOptions } from 'openvue/inputgroup';
import type { InputGroupAddonPassThroughOptions } from 'openvue/inputgroupaddon';
import type { InputIconPassThroughOptions } from 'openvue/inputicon';
import type { InputMaskPassThroughOptions } from 'openvue/inputmask';
import type { InputNumberPassThroughOptions } from 'openvue/inputnumber';
import type { InputOtpPassThroughOptions } from 'openvue/inputotp';
import type { InputSwitchPassThroughOptions } from 'openvue/inputswitch';
import type { InputTextPassThroughOptions } from 'openvue/inputtext';
import type { KeyFilterDirectivePassThroughOptions } from 'openvue/keyfilter';
import type { KnobPassThroughOptions } from 'openvue/knob';
import type { ListboxPassThroughOptions } from 'openvue/listbox';
import type { MegaMenuPassThroughOptions } from 'openvue/megamenu';
import type { MenuPassThroughOptions } from 'openvue/menu';
import type { MenubarPassThroughOptions } from 'openvue/menubar';
import type { MessagePassThroughOptions } from 'openvue/message';
import type { MeterGroupPassThroughOptions } from 'openvue/metergroup';
import type { MultiSelectPassThroughOptions } from 'openvue/multiselect';
import type { OrderListPassThroughOptions } from 'openvue/orderlist';
import type { OrganizationChartPassThroughOptions } from 'openvue/organizationchart';
import type { OverlayBadgePassThroughOptions } from 'openvue/overlaybadge';
import type { OverlayPanelPassThroughOptions } from 'openvue/overlaypanel';
import type { PaginatorPassThroughOptions } from 'openvue/paginator';
import type { PanelPassThroughOptions } from 'openvue/panel';
import type { PanelMenuPassThroughOptions } from 'openvue/panelmenu';
import type { PassThroughOptions } from 'openvue/passthrough';
import type { PasswordPassThroughOptions } from 'openvue/password';
import type { PickListPassThroughOptions } from 'openvue/picklist';
import type { PopoverPassThroughOptions } from 'openvue/popover';
import type { ProgressBarPassThroughOptions } from 'openvue/progressbar';
import type { ProgressSpinnerPassThroughOptions } from 'openvue/progressspinner';
import type { RadioButtonPassThroughOptions } from 'openvue/radiobutton';
import type { RadioButtonGroupPassThroughOptions } from 'openvue/radiobuttongroup';
import type { RatingPassThroughOptions } from 'openvue/rating';
import type { RippleDirectivePassThroughOptions } from 'openvue/ripple';
import type { RowPassThroughOptions } from 'openvue/row';
import type { ScrollPanelPassThroughOptions } from 'openvue/scrollpanel';
import type { ScrollTopPassThroughOptions } from 'openvue/scrolltop';
import type { SelectPassThroughOptions } from 'openvue/select';
import type { SelectButtonPassThroughOptions } from 'openvue/selectbutton';
import type { SidebarPassThroughOptions } from 'openvue/sidebar';
import type { SkeletonPassThroughOptions } from 'openvue/skeleton';
import type { SliderPassThroughOptions } from 'openvue/slider';
import type { SpeedDialPassThroughOptions } from 'openvue/speeddial';
import type { SplitButtonPassThroughOptions } from 'openvue/splitbutton';
import type { SplitterPassThroughOptions } from 'openvue/splitter';
import type { SplitterPanelPassThroughOptions } from 'openvue/splitterpanel';
import type { StepPassThroughOptions } from 'openvue/step';
import type { StepItemPassThroughOptions } from 'openvue/stepitem';
import type { StepListPassThroughOptions } from 'openvue/steplist';
import type { StepPanelPassThroughOptions } from 'openvue/steppanel';
import type { StepPanelsPassThroughOptions } from 'openvue/steppanels';
import type { StepperPassThroughOptions } from 'openvue/stepper';
import type { StepsPassThroughOptions } from 'openvue/steps';
import type { StyleClassDirectivePassThroughOptions } from 'openvue/styleclass';
import type { TabPassThroughOptions } from 'openvue/tab';
import type { TabListPassThroughOptions } from 'openvue/tablist';
import type { TabMenuPassThroughOptions } from 'openvue/tabmenu';
import type { TabPanelPassThroughOptions } from 'openvue/tabpanel';
import type { TabPanelsPassThroughOptions } from 'openvue/tabpanels';
import type { TabsPassThroughOptions } from 'openvue/tabs';
import type { TabViewPassThroughOptions } from 'openvue/tabview';
import type { TagPassThroughOptions } from 'openvue/tag';
import type { TerminalPassThroughOptions } from 'openvue/terminal';
import type { TextareaPassThroughOptions } from 'openvue/textarea';
import type { TieredMenuPassThroughOptions } from 'openvue/tieredmenu';
import type { TimelinePassThroughOptions } from 'openvue/timeline';
import type { ToastPassThroughOptions } from 'openvue/toast';
import type { ToggleButtonPassThroughOptions } from 'openvue/togglebutton';
import type { ToggleSwitchPassThroughOptions } from 'openvue/toggleswitch';
import type { ToolbarPassThroughOptions } from 'openvue/toolbar';
import type { TooltipDirectivePassThroughOptions } from 'openvue/tooltip';
import type { TreePassThroughOptions } from 'openvue/tree';
import type { TreeSelectPassThroughOptions } from 'openvue/treeselect';
import type { TreeTablePassThroughOptions } from 'openvue/treetable';
import type { VirtualScrollerPassThroughOptions } from 'openvue/virtualscroller';

export * from '@openvue/core/config';
export { default } from '@openvue/core/config';

export interface PrimeVueConfiguration {
    ripple?: boolean;
    /**
     * @deprecated since v4.0. Use 'inputVariant' instead.
     */
    inputStyle?: 'filled' | 'outlined' | undefined;
    inputVariant?: 'filled' | 'outlined' | undefined;
    locale?: PrimeVueLocaleOptions;
    filterMatchModeOptions?: any;
    zIndex?: PrimeVueZIndexOptions;
    theme?: any;
    unstyled?: boolean;
    pt?: PassThrough<PrimeVuePTOptions>;
    ptOptions?: PassThroughOptions;
    csp?: PrimeVueCSPOptions;
}

export interface PrimeVuePTOptions {
    accordion?: DefaultPassThrough<AccordionPassThroughOptions>;
    accordionpanel?: DefaultPassThrough<AccordionPanelPassThroughOptions>;
    accordionheader?: DefaultPassThrough<AccordionHeaderPassThroughOptions>;
    accordioncontent?: DefaultPassThrough<AccordionContentPassThroughOptions>;
    /**
     * @deprecated since v4. Use the new structure of Accordion instead.
     */
    accordiontab?: DefaultPassThrough<AccordionTabPassThroughOptions>;
    autocomplete?: DefaultPassThrough<AutoCompletePassThroughOptions>;
    avatar?: DefaultPassThrough<AvatarPassThroughOptions>;
    avatargroup?: DefaultPassThrough<AvatarGroupPassThroughOptions>;
    badge?: DefaultPassThrough<BadgePassThroughOptions>;
    blockui?: DefaultPassThrough<BlockUIPassThroughOptions>;
    breadcrumb?: DefaultPassThrough<BreadcrumbPassThroughOptions>;
    button?: DefaultPassThrough<ButtonPassThroughOptions>;
    buttongroup?: DefaultPassThrough<ButtonGroupPassThroughOptions>;
    /**
     * @deprecated since v4. Use the new structure of DatePicker instead.
     */
    calendar?: DefaultPassThrough<CalendarPassThroughOptions>;
    card?: DefaultPassThrough<CardPassThroughOptions>;
    carousel?: DefaultPassThrough<CarouselPassThroughOptions>;
    cascadeselect?: DefaultPassThrough<CascadeSelectPassThroughOptions>;
    chart?: DefaultPassThrough<ChartPassThroughOptions>;
    checkbox?: DefaultPassThrough<CheckboxPassThroughOptions>;
    checkboxgroup?: DefaultPassThrough<CheckboxGroupPassThroughOptions>;
    chip?: DefaultPassThrough<ChipPassThroughOptions>;
    /**
     * @deprecated since v4. Use the new structure of InputChips instead.
     */
    chips?: DefaultPassThrough<ChipsPassThroughOptions>;
    colorpicker?: DefaultPassThrough<ColorPickerPassThroughOptions>;
    column?: DefaultPassThrough<ColumnPassThroughOptions>;
    columngroup?: DefaultPassThrough<ColumnGroupPassThroughOptions>;
    confirmdialog?: DefaultPassThrough<ConfirmDialogPassThroughOptions>;
    confirmpopup?: DefaultPassThrough<ConfirmPopupPassThroughOptions>;
    contextmenu?: DefaultPassThrough<ContextMenuPassThroughOptions>;
    datatable?: DefaultPassThrough<DataTablePassThroughOptions>;
    dataview?: DefaultPassThrough<DataViewPassThroughOptions>;
    datepicker?: DefaultPassThrough<DatePickerPassThroughOptions>;
    deferredcontent?: DefaultPassThrough<DeferredContentPassThroughOptions>;
    divider?: DefaultPassThrough<DividerPassThroughOptions>;
    dialog?: DefaultPassThrough<DialogPassThroughOptions>;
    dock?: DefaultPassThrough<DockPassThroughOptions>;
    drawer?: DefaultPassThrough<DrawerPassThroughOptions>;
    /**
     * @deprecated since v4. Use the new structure of Select instead.
     */
    dropdown?: DefaultPassThrough<DropdownPassThroughOptions>;
    dynamicdialog?: DefaultPassThrough<DialogPassThroughOptions>;
    editor?: DefaultPassThrough<EditorPassThroughOptions>;
    fieldset?: DefaultPassThrough<FieldsetPassThroughOptions>;
    fileupload?: DefaultPassThrough<FileUploadPassThroughOptions>;
    floatlabel?: DefaultPassThrough<FloatLabelPassThroughOptions>;
    fluid?: DefaultPassThrough<FluidPassThroughOptions>;
    galleria?: DefaultPassThrough<GalleriaPassThroughOptions>;
    iconfield?: DefaultPassThrough<IconFieldPassThroughOptions>;
    iftalabel?: DefaultPassThrough<IftaLabelPassThroughOptions>;
    image?: DefaultPassThrough<ImagePassThroughOptions>;
    imagecompare?: DefaultPassThrough<ImageComparePassThroughOptions>;
    inlinemessage?: DefaultPassThrough<InlineMessagePassThroughOptions>;
    inplace?: DefaultPassThrough<InplacePassThroughOptions>;
    inputchips?: DefaultPassThrough<InputChipsPassThroughOptions>;
    inputgroup?: DefaultPassThrough<InputGroupPassThroughOptions>;
    inputgroupaddon?: DefaultPassThrough<InputGroupAddonPassThroughOptions>;
    inputicon?: DefaultPassThrough<InputIconPassThroughOptions>;
    inputmask?: DefaultPassThrough<InputMaskPassThroughOptions>;
    inputnumber?: DefaultPassThrough<InputNumberPassThroughOptions>;
    /**
     * @deprecated since v4. Use the new structure of ToggleSwitch instead.
     */
    inputotp?: DefaultPassThrough<InputOtpPassThroughOptions>;
    inputswitch?: DefaultPassThrough<InputSwitchPassThroughOptions>;
    inputtext?: DefaultPassThrough<InputTextPassThroughOptions>;
    knob?: DefaultPassThrough<KnobPassThroughOptions>;
    listbox?: DefaultPassThrough<ListboxPassThroughOptions>;
    megamenu?: DefaultPassThrough<MegaMenuPassThroughOptions>;
    menu?: DefaultPassThrough<MenuPassThroughOptions>;
    menubar?: DefaultPassThrough<MenubarPassThroughOptions>;
    message?: DefaultPassThrough<MessagePassThroughOptions>;
    metergroup?: DefaultPassThrough<MeterGroupPassThroughOptions>;
    multiselect?: DefaultPassThrough<MultiSelectPassThroughOptions>;
    orderlist?: DefaultPassThrough<OrderListPassThroughOptions>;
    organizationchart?: DefaultPassThrough<OrganizationChartPassThroughOptions>;
    overlaybadge?: DefaultPassThrough<OverlayBadgePassThroughOptions>;
    /**
     * @deprecated since v4. Use the new structure of Popover instead.
     */
    overlaypanel?: DefaultPassThrough<OverlayPanelPassThroughOptions>;
    paginator?: DefaultPassThrough<PaginatorPassThroughOptions>;
    panel?: DefaultPassThrough<PanelPassThroughOptions>;
    panelmenu?: DefaultPassThrough<PanelMenuPassThroughOptions>;
    password?: DefaultPassThrough<PasswordPassThroughOptions>;
    picklist?: DefaultPassThrough<PickListPassThroughOptions>;
    popover?: DefaultPassThrough<PopoverPassThroughOptions>;
    progressbar?: DefaultPassThrough<ProgressBarPassThroughOptions>;
    progressspinner?: DefaultPassThrough<ProgressSpinnerPassThroughOptions>;
    radiobutton?: DefaultPassThrough<RadioButtonPassThroughOptions>;
    radiobuttongroup?: DefaultPassThrough<RadioButtonGroupPassThroughOptions>;
    rating?: DefaultPassThrough<RatingPassThroughOptions>;
    row?: DefaultPassThrough<RowPassThroughOptions>;
    scrollpanel?: DefaultPassThrough<ScrollPanelPassThroughOptions>;
    scrolltop?: DefaultPassThrough<ScrollTopPassThroughOptions>;
    /**
     * @deprecated since v4. Use the new structure of Drawer instead.
     */
    sidebar?: DefaultPassThrough<SidebarPassThroughOptions>;
    skeleton?: DefaultPassThrough<SkeletonPassThroughOptions>;
    slider?: DefaultPassThrough<SliderPassThroughOptions>;
    speeddial?: DefaultPassThrough<SpeedDialPassThroughOptions>;
    selectbutton?: DefaultPassThrough<SelectButtonPassThroughOptions>;
    select?: DefaultPassThrough<SelectPassThroughOptions>;
    splitbutton?: DefaultPassThrough<SplitButtonPassThroughOptions>;
    splitter?: DefaultPassThrough<SplitterPassThroughOptions>;
    splitterpanel?: DefaultPassThrough<SplitterPanelPassThroughOptions>;
    step?: DefaultPassThrough<StepPassThroughOptions>;
    stepitem?: DefaultPassThrough<StepItemPassThroughOptions>;
    steplist?: DefaultPassThrough<StepListPassThroughOptions>;
    steppanel?: DefaultPassThrough<StepPanelPassThroughOptions>;
    steppanels?: DefaultPassThrough<StepPanelsPassThroughOptions>;
    stepper?: DefaultPassThrough<StepperPassThroughOptions>;
    steps?: DefaultPassThrough<StepsPassThroughOptions>;
    tabmenu?: DefaultPassThrough<TabMenuPassThroughOptions>;
    tabs?: DefaultPassThrough<TabsPassThroughOptions>;
    tablist?: DefaultPassThrough<TabListPassThroughOptions>;
    tab?: DefaultPassThrough<TabPassThroughOptions>;
    tabpanels?: DefaultPassThrough<TabPanelsPassThroughOptions>;
    tabpanel?: DefaultPassThrough<TabPanelPassThroughOptions>;
    /**
     * @deprecated since v4. Use tabs instead.
     */
    tabview?: DefaultPassThrough<TabViewPassThroughOptions>;
    tag?: DefaultPassThrough<TagPassThroughOptions>;
    terminal?: DefaultPassThrough<TerminalPassThroughOptions>;
    textarea?: DefaultPassThrough<TextareaPassThroughOptions>;
    tieredmenu?: DefaultPassThrough<TieredMenuPassThroughOptions>;
    timeline?: DefaultPassThrough<TimelinePassThroughOptions>;
    toast?: DefaultPassThrough<ToastPassThroughOptions>;
    togglebutton?: DefaultPassThrough<ToggleButtonPassThroughOptions>;
    toggleswitch?: DefaultPassThrough<ToggleSwitchPassThroughOptions>;
    toolbar?: DefaultPassThrough<ToolbarPassThroughOptions>;
    tree?: DefaultPassThrough<TreePassThroughOptions>;
    treeselect?: DefaultPassThrough<TreeSelectPassThroughOptions>;
    treetable?: DefaultPassThrough<TreeTablePassThroughOptions>;
    virtualscroller?: DefaultPassThrough<VirtualScrollerPassThroughOptions>;
    directives?: {
        animate?: AnimateOnScrollDirectivePassThroughOptions;
        badge?: BadgeDirectivePassThroughOptions;
        focustrap?: FocusTrapDirectivePassThroughOptions;
        keyfilter?: KeyFilterDirectivePassThroughOptions;
        ripple?: RippleDirectivePassThroughOptions;
        styleclass?: StyleClassDirectivePassThroughOptions;
        tooltip?: TooltipDirectivePassThroughOptions;
    };
    global?: {
        css?: ((options: any) => string | undefined) | string | undefined;
    };
}
