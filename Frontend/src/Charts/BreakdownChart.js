import React from "react";
import "./BreakdownChart.css"

class BreakdownChart extends React.Component {
    constructor(props) {
        super(props);
        // FIgure out how to make the props into state
        /* this.state = {
             data: props.data,
             month: props.month
         };*/
        this.getHeader = this.getHeader.bind(this);
        this.getRowsData = this.getRowsData.bind(this);
        this.getKeys = this.getKeys.bind(this);
    }

    getKeys() {
        return Object.keys(this.props.data[0]);
    }

    getHeader() {
        var keys = this.getKeys();
        return keys.map((key, index) => {
            return <th key={key}>{key.toUpperCase()}</th>
        })
    }

    getRowsData() {
        var items = this.props.data;
        var keys = this.getKeys();
        return items.map((row, index) => {
            return <tr key={index} className="breakdown-row"><RenderRow key={index} data={row} keys={keys} /></tr>
        })
    }

    render() {
        if (this.props.data.length != 0) {
            return (
                <div>
                    <table className="breakdown-table">
                        <thead>
                            <tr>{this.getHeader()}</tr>
                        </thead>
                        <tbody>
                            {this.getRowsData()}
                        </tbody>
                    </table>
                </div>

            );
        }
        else {
            return (
                <h1>Loading...</h1>
            );
        }
    }

}
const RenderRow = (props) => {
    return props.keys.map((key, index) => {
        return <td key={props.data[key]}>{props.data[key]}</td>
    })
}

export default BreakdownChart;