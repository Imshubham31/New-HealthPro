import * as $ from 'jquery';
import 'fullcalendar';

const FC = <any>$.fullCalendar;

// Copy of the standard theme, as we can't extend it because it is not exported
export const JNJTheme = FC.Theme.extend({
    classes: {
        widget: 'fc-unthemed',
        widgetHeader: 'fc-widget-header',
        widgetContent: 'fc-widget-content',

        buttonGroup: 'btn-group',
        button: 'btn',
        cornerLeft: 'fc-corner-left',
        cornerRight: 'fc-corner-right',
        stateDefault: 'fc-state-default',
        stateActive: 'fc-state-active',
        stateDisabled: 'fc-state-disabled',
        stateHover: 'fc-state-hover',
        stateDown: 'fc-state-down',

        popoverHeader: 'fc-widget-header',
        popoverContent: 'fc-widget-content',

        // day grid
        headerRow: 'fc-widget-header',
        dayRow: 'fc-widget-content',

        // list view
        listView: 'fc-widget-content',
    },

    baseIconClass: 'fa',
    iconClasses: {
        close: 'fc-icon-x',
        prev: 'fa-angle-left',
        next: 'fa-angle-right',
        prevYear: 'fc-icon-left-double-arrow',
        nextYear: 'fc-icon-right-double-arrow',
    },

    iconOverrideOption: 'buttonIcons',
    iconOverrideCustomButtonOption: 'icon',
    iconOverridePrefix: 'fc-icon-',
});
