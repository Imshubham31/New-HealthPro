import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    EventEmitter,
    Output,
} from '@angular/core';
import { Localise } from '@lib/localise/localise.pipe';
import { LocaliseService } from '@lib/localise/localise.service';
import { StepsService } from '@lib/goals/steps.service';
import {
    startOfMonth,
    getDaysInMonth,
    endOfMonth,
    startOfYear,
    startOfWeek,
    getMonth,
    getYear,
    addDays,
    getISOWeek,
    differenceInCalendarMonths,
    differenceInCalendarYears,
    differenceInWeeks,
    endOfYear,
    lastDayOfWeek,
    setMonth,
    isSameDay,
    setWeek,
    setYear,
    setHours,
} from 'date-fns';
import { AuthenticationService } from '@lib/authentication/authentication.service';
import { GoalService } from '@lib/goals/goal.service';
import { DateUtils } from '@lib/utils/date-utils';

export interface BarChartData {
    seriesData: BarChartColumn[];
    threshold?: number;
}
export interface BarChartColumn {
    label: number | Date | string;
    value: number;
}
@Component({
    selector: 'bar-chart',
    styleUrls: ['./bar-chart.component.scss'],
    templateUrl: './bar-chart.component.html',
})
export class BarChartComponent implements OnInit, OnChanges {
    chartData;
    weekView = true;
    monthView = false;
    yearView = false;
    showLoading = false;
    startMonthFDate;
    endMonthFDate;
    nextPrevMonthName;
    nextPrevYearName;
    startYearFormatDate;
    endYearFormatDate;
    addSubtractName;
    nextPrevWeek;
    lang = AuthenticationService.getUserLanguage();
    chatsValue = [];
    nextWeeksClicked = getISOWeek(new Date());
    nextMonthClicked = getMonth(new Date());
    nextYearClicked = getYear(new Date());
    profileDate = AuthenticationService.getUser().firstDayOfWeek;
    disablePrevNextButton = true;
    yearChartTooltip = [];
    lastDayInWeek;
    lastToday;
    weekDifference;
    monthDifference;
    yearDifference;
    timezoneDate = new Date().getTimezoneOffset();
    targetSteps;
    timeZoneStartYear;
    initialGoalLoaded = false;
    @Output() disablePrevNextPencil = new EventEmitter<boolean>();
    @Input()
    data: BarChartData = {
        seriesData: [],
    };
    weekShowData: boolean;
    monthShowData: boolean;
    yearShowData: boolean;

    private dailyCallbacks = {
        title: (tooltipItems, data) => {
            return this.getTitle(tooltipItems, data);
        },
        label: (tooltipItem, data) => {
            return this.getLabel(tooltipItem, data);
        },
        footer: () => {
            return this.localise.transform('total');
        },
    };

    private yearlyCallbacks = {
        title: (tooltipItems, data) => {
            let yearLabel = '';
            tooltipItems.forEach(tooltipItem => {
                yearLabel = data.datasets[tooltipItem.datasetIndex].year;
            });
            return this.getTitle(tooltipItems, data) + ' ' + yearLabel;
        },
        label: (tooltipItem, data) => {
            return this.getLabel(tooltipItem, data);
        },
        footer: () => {
            return this.localise.transform('dailyaverage');
        },
    };

    barChartType = 'bar';
    barChartLegend = false;
    colors = [
        {
            backgroundColor: BarChartComponent.getGradient(),
        },
    ];

    barChartOptions = this.generateOptions(this.dailyCallbacks);
    barChartLabels: string[] = [];
    barChartData: any[] = [
        {
            data: [],
            hoverBackgroundColor: BarChartComponent.getGradient(),
            xAxisID: 'bar-x-axis',
        },
        this.generateData(),
    ];

    mBarChartOptions = this.generateOptions(this.dailyCallbacks);
    mBarChartLabels: string[] = [];
    mBarChartData: any[] = [
        {
            data: [],
            hoverBackgroundColor: BarChartComponent.getGradient(),
            xAxisID: 'bar-x-axis',
        },
        this.generateData(),
    ];

    yBarChartOptions = this.generateOptions(this.yearlyCallbacks);
    yBarChartLabels: string[] = [];
    yBarChartData: any[] = [
        {
            data: [],
            hoverBackgroundColor: BarChartComponent.getGradient(),
            xAxisID: 'bar-x-axis',
        },
        this.generateData(),
    ];

    static getGradient() {
        const printCanvas = document.createElement('canvas');
        const ctx = printCanvas.getContext('2d');
        const grd = ctx.createLinearGradient(0, 170, 0, 0);
        grd.addColorStop(0, 'rgb(0,135,160)');
        grd.addColorStop(1, 'rgb(0,179,211)');
        return grd;
    }
    constructor(
        private localise: Localise,
        private localiseService: LocaliseService,
        public stepsService: StepsService,
        public goalService: GoalService,
    ) {}

    ngOnInit() {
        this.getStepWeekData();
        this.yearLabels();
        this.weekShow();
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes.data &&
            !changes.data.firstChange &&
            changes.data.currentValue.threshold !==
                changes.data.previousValue.threshold
        ) {
            if (this.initialGoalLoaded) {
                if (this.weekShowData === true) {
                    this.onNextPrev(this.addSubtractName);
                    this.getStepMonthData();
                    this.getStepYearData();
                }
                if (this.monthShowData === true) {
                    this.onMonthPrevNext(this.addSubtractName);
                    this.getStepWeekData();
                    this.getStepYearData();
                }
                if (this.yearShowData === true) {
                    this.onYearPrevNext(this.addSubtractName);
                    this.getStepWeekData();
                    this.getStepMonthData();
                }
            } else {
                this.getStepMonthData();
                this.getStepYearData();
            }

            this.initialGoalLoaded = true;
        }
    }

    private getTitle(tooltipItems, data) {
        let labelDate = '';
        tooltipItems.forEach(tooltipItem => {
            labelDate = this.localise.transform(
                data.datasets[tooltipItem.datasetIndex].labelDate[
                    tooltipItem.index
                ],
            );
        });
        return labelDate;
    }

    private getLabel(tooltipItem, data) {
        const dataset = data.datasets[tooltipItem.datasetIndex];
        const step = this.localise.transform(this.localise.transform('steps'));
        const count = this.localise.transform(
            `${dataset.data[tooltipItem.index]}`,
        );
        return `${count} ${step}`;
    }

    private generateOptions(callbacks) {
        return {
            scaleShowVerticalLines: false,
            responsive: true,
            scales: {
                xAxes: [
                    {
                        id: 'bar-x-axis',
                        ticks: {
                            fontSize: 12,
                            fontFamily: `'Source Sans Pro', sans-serif`,
                            fontColor: '#002B32',
                        },
                        gridLines: {
                            display: false,
                        },
                    },
                    {
                        display: false,
                        id: 'line-x-axis',
                        ticks: {
                            display: false,
                        },
                        gridLines: {
                            display: false,
                        },
                    },
                ],
                yAxes: [
                    {
                        position: 'right',
                        ticks: {
                            fontSize: 12,
                            maxTicksLimit: 5,
                            suggestedMax: this.data.threshold,
                            suggestedMin: 0,
                            fontFamily: `'Source Sans Pro', sans-serif`,
                            fontColor: '#002B32',
                        },
                        gridLines: {
                            color: '#999',
                            lineWidth: 0.5,
                            drawBorder: false,
                        },
                    },
                ],
            },
            tooltips: {
                backgroundColor: '#fff',
                titleFontSize: 13,
                titleFontFamily: 'Arial',
                titleFontColor: '#aaa',
                footerFontSize: 13,
                footerFontColor: '#aaa',
                footerFontFamily: 'Arial',
                displayColors: false,
                borderColor: '#CCC',
                borderWidth: 1,
                bodyFontColor: '#000',
                cornerRadius: 5,
                caretSize: 0,
                bodyAlign: 'left',
                xPadding: 15,
                yPadding: 15,
                position: 'average',
                bodyFontSize: 19,
                bodyFontStyle: 'bold',
                bodyFontFamily: 'Arial',
                callbacks,
            },
        };
    }
    private generateData() {
        return {
            data: [],
            label: 'Goal',
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
            type: 'line',
            borderWidth: 1,
            xAxisID: 'line-x-axis',
        };
    }
    private getMonths(value, i) {
        const values = value.filter(v => new Date(v.day).getUTCMonth() === i);
        if (values.length > 0) {
            const positiveDays = values.filter(c => c.steps > 0);
            const a = values
                .map(item => item.steps)
                .reduce((prev, next) => prev + next);
            this.chatsValue.push(a / positiveDays.length);
        } else {
            this.chatsValue.push(0);
        }
    }
    weekShow() {
        if (this.weekDifference === 0) {
            this.disablePrevNextPencil.emit(true);
            this.disablePrevNextButton = true;
        }
        this.weekShowData = true;
        this.monthShowData = false;
        this.yearShowData = false;
        this.weekView = true;
        this.monthView = false;
        this.yearView = false;
    }
    monthShow() {
        if (this.monthDifference === 0) {
            this.disablePrevNextPencil.emit(true);
            this.disablePrevNextButton = true;
        }
        this.onMonthPrevNext(this.addSubtractName);
        this.weekShowData = false;
        this.monthShowData = true;
        this.yearShowData = false;
        this.monthView = true;
        this.weekView = false;
        this.yearView = false;
    }
    yearShow() {
        if (this.yearDifference === 0) {
            this.disablePrevNextPencil.emit(true);
            this.disablePrevNextButton = true;
        }
        this.weekShowData = false;
        this.monthShowData = false;
        this.yearShowData = true;
        this.yearView = true;
        this.monthView = false;
        this.weekView = false;
    }
    getStartDay() {
        return DateUtils.getWeekdayIndex(this.profileDate);
    }
    private yearLabels() {
        for (let i = 0; i < 12; i++) {
            const date = setMonth(new Date(), i);
            this.yBarChartLabels.push(DateUtils.formatDate(date, 'MMM'));
            this.yearChartTooltip.push(DateUtils.formatDate(date, 'MMMM'));
        }

        if (this.localiseService.getDirection() === 'rtl') {
            this.yBarChartLabels.reverse();
            this.yearChartTooltip.reverse();
        }
    }

    private formatChartData(barChartData, amountDays) {
        this.formatDailyData(barChartData);
        const useSteps =
            this.data.threshold >= 0 ? this.data.threshold : this.targetSteps;
        barChartData[1].data = Array(amountDays).fill(useSteps);
        if (useSteps <= 0) {
            barChartData[1].borderColor = '#bbb';
        } else {
            barChartData[1].borderColor = '#4CBB17';
        }
    }

    formatChartDataNavigate(barChartData, difference, amountDays) {
        this.formatDailyData(barChartData);
        if (difference === 0) {
            const today = new Date();
            const targetValue = this.chartData.filter(b => {
                return isSameDay(new Date(b.day), today);
            });
            this.targetSteps = targetValue[0].target;
        } else {
            const targetValue = this.chartData.pop();
            this.targetSteps = targetValue.target;
        }
        barChartData[1].data = Array(amountDays).fill(this.targetSteps);
        if (this.targetSteps <= 0) {
            barChartData[1].borderColor = '#bbb';
        } else {
            barChartData[1].borderColor = '#4CBB17';
        }
    }

    private formatDailyData(barChartData) {
        barChartData[0].labelDate = this.chartData.map(a =>
            DateUtils.formatDate(
                addDays(new Date(a.day), this.timezoneDate > 0 ? 1 : 0),
                'dd MMM yyyy',
            ),
        );
        barChartData[0].data = this.chartData.map(a => a.steps);
        if (this.localiseService.getDirection() === 'rtl') {
            barChartData[0].labelDate.reverse();
            barChartData[0].data.reverse();
        }
    }

    private formatYearData() {
        for (let i = 0; i <= 11; i++) {
            this.getMonths(this.chartData, i);
        }
        this.yBarChartData[0].data = this.chatsValue;
        this.yBarChartData[0].labelDate = this.yearChartTooltip;
        this.yBarChartData[0].year = this.nextPrevYearName;
        if (this.localiseService.getDirection() === 'rtl') {
            this.yBarChartData[0].labelDate.reverse();
            this.yBarChartData[0].data.reverse();
        }
    }

    private getStepWeekData() {
        this.weekView = false;
        this.showLoading = true;
        this.lastDayInWeek = lastDayOfWeek(new Date(), {
            weekStartsOn: this.getStartDay(),
        });
        this.updateWeekData();
        const steps = {
            startDateTime: this.startMonthFDate,
            endDateTime: this.endMonthFDate,
        };
        this.stepsService.stepDateByStep(steps).subscribe(res => {
            this.chartData = res;
            const today = new Date();
            const targetValue = this.chartData.filter(b => {
                return isSameDay(new Date(b.day), today);
            });
            this.targetSteps = targetValue[0].target;
            this.formatChartData(this.barChartData, 7);
            this.barChartLabels = this.chartData.map(b => {
                return DateUtils.formatDate(
                    new Date(b.day),
                    'eee',
                ).toUpperCase();
            });
            if (this.localiseService.getDirection() === 'rtl') {
                this.barChartLabels.reverse();
            }
            this.showLoading = false;
            if (this.weekView === true) {
                this.weekView = true;
            }
        });
    }

    private updateWeekData() {
        const startDate = setWeek(new Date(), this.nextWeeksClicked);
        const timeStartWeek = DateUtils.clearTime(
            startOfWeek(startDate, { weekStartsOn: this.getStartDay() }),
        );
        this.lastToday = lastDayOfWeek(timeStartWeek, {
            weekStartsOn: this.getStartDay(),
        });
        this.weekDifference = differenceInWeeks(
            this.lastDayInWeek,
            this.lastToday,
        );
        const timeStartOfWeek = DateUtils.formatDate(
            new Date(timeStartWeek),
            'd MMM',
        );
        const timeEndOfWeek = DateUtils.formatDate(
            this.lastToday,
            'd MMM yyyy',
        );
        this.nextPrevWeek = `${timeStartOfWeek} - ${timeEndOfWeek}`;
        this.startMonthFDate = timeStartWeek;
        this.endMonthFDate = DateUtils.setEndOfDay(this.lastToday);
    }
    private getStepMonthData() {
        const startMonth = startOfMonth(
            setMonth(new Date(), this.nextMonthClicked),
        );
        this.updateMonthData(startMonth);
        const step = {
            startDateTime: this.startMonthFDate,
            endDateTime: this.endMonthFDate,
        };
        this.stepsService.stepDateByStep(step).subscribe(res => {
            this.chartData = res;
            this.formatChartData(
                this.mBarChartData,
                getDaysInMonth(startMonth),
            );
        });
    }

    private updateMonthData(startMonth) {
        startMonth = DateUtils.clearTime(startMonth);
        this.nextPrevMonthName = DateUtils.formatDate(startMonth, 'MMMM  yyyy');
        this.monthDifference = differenceInCalendarMonths(
            new Date(),
            startMonth,
        );
        this.startMonthFDate = startMonth;
        this.endMonthFDate = DateUtils.setEndOfDay(endOfMonth(startMonth));
        const labelMonth = getDaysInMonth(
            addDays(startMonth, this.timezoneDate > 0 ? 1 : 0),
        );
        const monthLabelValues = [];
        for (let i = 1; i <= labelMonth; i++) {
            monthLabelValues.push(i.toString());
        }
        this.mBarChartLabels = monthLabelValues;
        if (this.localiseService.getDirection() === 'rtl') {
            this.mBarChartLabels.reverse();
        }
        if (this.monthView === true) {
            this.monthView = true;
        }
    }

    private getStepYearData() {
        this.updateYearData();
        const step = {
            startDateTime: this.startYearFormatDate,
            endDateTime: this.endYearFormatDate,
        };
        this.stepsService.stepDateByStep(step).subscribe(res => {
            this.chartData = res;
            this.formatYearData();
            this.yBarChartData[1].data = Array(12).fill(this.data.threshold);
            if (this.data.threshold <= 0) {
                this.yBarChartData[1].borderColor = '#bbb';
            } else {
                this.yBarChartData[1].borderColor = '#4CBB17';
            }
            if (this.yearView === true) {
                this.yearView = true;
            }
        });
    }

    private updateYearData() {
        const startYear = DateUtils.clearTime(
            startOfYear(setYear(new Date(), this.nextYearClicked)),
        );
        this.nextPrevYearName = DateUtils.formatDate(startYear, 'yyyy');
        this.yearDifference = differenceInCalendarYears(new Date(), startYear);
        if (this.timezoneDate > 0) {
            this.yearDifference = differenceInCalendarYears(
                new Date(),
                addDays(startYear, 1),
            );
        }
        this.startYearFormatDate = startYear;
        this.timeZoneStartYear = setHours(startYear, 12);
        this.endYearFormatDate = DateUtils.setEndOfDay(endOfYear(startYear));
    }

    onNextPrev(addSubtractName) {
        this.weekView = false;
        this.showLoading = true;
        const weeks = getISOWeek(new Date());
        if (addSubtractName === 'add') {
            ++this.nextWeeksClicked;
            if (this.nextWeeksClicked >= weeks) {
                this.disablePrevNextPencil.emit(true);
                this.disablePrevNextButton = true;
            }
        } else if (addSubtractName === 'subtract') {
            --this.nextWeeksClicked;
            this.disablePrevNextPencil.emit(false);
            this.disablePrevNextButton = false;
        }
        this.updateWeekData();
        const step = {
            startDateTime: this.startMonthFDate,
            endDateTime: this.endMonthFDate,
        };
        this.stepsService.stepDateByStep(step).subscribe(res => {
            this.chartData = res;
            this.formatChartDataNavigate(
                this.barChartData,
                this.weekDifference,
                7,
            );
            this.showLoading = false;
            this.weekView = true;
        });
    }
    onMonthPrevNext(addSubtractName) {
        this.monthView = false;
        this.showLoading = true;
        const months = getMonth(new Date());
        if (addSubtractName === 'add') {
            ++this.nextMonthClicked;
            if (this.nextMonthClicked >= months) {
                this.disablePrevNextButton = true;
                this.disablePrevNextPencil.emit(true);
            }
        } else if (addSubtractName === 'subtract') {
            --this.nextMonthClicked;
            this.disablePrevNextButton = false;
            this.disablePrevNextPencil.emit(false);
        }
        const startMonth = startOfMonth(
            setMonth(new Date(), this.nextMonthClicked),
        );
        this.updateMonthData(startMonth);
        const step = {
            startDateTime: this.startMonthFDate,
            endDateTime: this.endMonthFDate,
        };
        this.stepsService.stepDateByStep(step).subscribe(res => {
            this.chartData = res;
            this.formatChartDataNavigate(
                this.mBarChartData,
                this.monthDifference,
                getDaysInMonth(startMonth),
            );
            this.showLoading = false;
            this.monthView = true;
        });
    }

    onYearPrevNext(addSubtractName) {
        this.yearView = false;
        this.showLoading = true;
        this.chatsValue = this.chatsValue.splice(0, 0);
        const years = getYear(new Date());
        if (addSubtractName === 'add') {
            ++this.nextYearClicked;
            if (this.nextYearClicked >= years) {
                this.disablePrevNextButton = true;
                this.disablePrevNextPencil.emit(true);
            }
        } else if (addSubtractName === 'subtract') {
            --this.nextYearClicked;
            this.disablePrevNextButton = false;
            this.disablePrevNextPencil.emit(false);
        }
        this.updateYearData();
        const step = {
            startDateTime: this.startYearFormatDate,
            endDateTime: this.endYearFormatDate,
        };
        this.stepsService.stepDateByStep(step).subscribe(res => {
            this.chartData = res;
            this.formatYearData();
            if (this.yearDifference === 0) {
                const today = new Date();
                const targetValue = this.chartData.filter(b => {
                    return isSameDay(new Date(b.day), today);
                });
                this.targetSteps = targetValue[0].target;
            } else {
                const targetValue = this.chartData.pop();
                this.targetSteps = targetValue.target;
            }
            this.yBarChartData[1].data = Array(12).fill(this.targetSteps);
            if (this.targetSteps <= 0) {
                this.yBarChartData[1].borderColor = '#bbb';
            } else {
                this.yBarChartData[1].borderColor = '#4CBB17';
            }
            this.showLoading = false;
            this.yearView = true;
        });
    }
}
