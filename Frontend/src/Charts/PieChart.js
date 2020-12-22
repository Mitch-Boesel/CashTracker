import React from "react";
import CanvasJSReact from "../canvasjs.react"
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class PieChart extends React.Component {
    constructor(props) {
        super(props);
        // FIgure out how to make the props into state
        this.state = {
            data: props.data,
            title: props.title
        };
    }

    render() {
        const options = {
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: this.props.title
            },
            data: [{
                type: "pie",
                startAngle: 75,
                indexLabelFontSize: 16,
                indexLabel: "{label} - ${y}",
                dataPoints: this.props.data
            }]
        }
        return (
            <div>
                <CanvasJSChart options={options} />
            </div>
        );
    }
}

export default PieChart;