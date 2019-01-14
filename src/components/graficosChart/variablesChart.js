import randomScalingFactor from '../../lib/randomScalingFactor'
export const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

export const labelsMonths= [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July"
];

export const  label1  = "My First dataset";
export const  label2 = "hidden dataset";
export const  label3 = "My Second dataset";
export const  titleGrafica = 'Chart.js Line Chart';

export const datos = [
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor(),
    randomScalingFactor()
];

export const Data = props => {
    return {
        labels: props.labelsMonths,
        datasets: [
            {
                label: props.label1,
                data: props.datos,
                fill: false,
                borderDash: [5, 5]
            }, {
                hidden: true,
                label: props.label2,
                data: props.datos
            }, {
                label: props.label3,
                data: props.datos
            }
        ]
    }
}