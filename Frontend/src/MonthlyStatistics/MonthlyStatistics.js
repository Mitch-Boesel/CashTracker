import React from "react";
import axios from "axios";
import PieChart from "../Charts/PieChart";
import BreakdownChart from "../Charts/BreakdownChart";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import "./MonthlyStatistics.css";

class MonthlyStatistics extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            MonthlySpendingData: {},
            MonthlySpendingPoints: [],
            MonthlyBreakdownData: [],
            MonthlyPurchases: []
        }

        this.HTTPGetMonthlySpending = this.HTTPGetMonthlySpending.bind(this);
        this.SpendingToPieChartPoints = this.SpendingToPieChartPoints.bind(this);
        this.HttpGetMonthlyPurchases = this.HttpGetMonthlyPurchases.bind(this);
    }


    async HTTPGetMonthlySpending() {
        const today = new Date();
        console.log(today.getMonth())
        const url = "https://localhost:5001/api/ct/monthly/totals/all/" + (today.getMonth() + 1) + "/" + today.getFullYear();


        await axios.get(url)
            .then((resp) => this.state.MonthlySpendingData = resp.data.data)
            .catch(() => alert("GetMontlySpending() Failed:("));
    }

    async HTTPGetMonthlyBreakdown() {
        const today = new Date();
        const url = "https://localhost:5001/api/ct/monthly/breakdown/" + (today.getMonth() + 1) + "/" + today.getFullYear();
        var list = [];
        await axios.get(url)
            .then((resp) => list = resp.data.data)
            .catch(() => alert("HTTPGetMontlyBreakdown() Failed:("));
        //await axios.get(url)
        //    .then((resp) => bdata = resp.data.data)
        //    .catch(() => alert("HTTPGetMontlyBreakdown() Failed:("));
        return list;
    }

    async HttpGetMonthlyPurchases() {
        const today = new Date();
        const url = "https://localhost:5001/api/ct/monthly/purchases/" + (today.getMonth() + 1) + "/" + today.getFullYear();
        var list = []
        await axios.get(url)
            .then((resp) => list = resp.data.data)
            .catch(() => alert("HttpGetMonthlyPurchases() Failed:("));
        return list
    }

    SpendingToPieChartPoints() {
        const dict = this.state.MonthlySpendingData;
        var points = [];
        for (var key in dict) {
            var point = { y: parseFloat(dict[key]), label: key }
            points.push(point);
            //if (key != "Zyns") {
            //    var point = { y: parseFloat(dict[key]), label: key }
            //    points.push(point);
            //}
            // { y: 49, label: "Organic Search" }
        }

        return points;
    }

    async componentDidMount() {
        await this.HTTPGetMonthlySpending();
        const bdown_list = await this.HTTPGetMonthlyBreakdown();
        const purch_list = await this.HttpGetMonthlyPurchases();

        this.setState({
            MonthlySpendingPoints: this.SpendingToPieChartPoints(),
            MonthlyBreakdownData: bdown_list,
            MonthlyPurchases: purch_list
        });

        //this.setState(() => ({ MonthlySpendingPoints: [{ y: 84, label: "hi" }, { y: 12, label: "bye" }, { y: 43.21, label: "woah" }] }));
        console.log(this.state.MonthlySpendingPoints);
        console.log(this.state.MonthlyBreakdownData);
    }

    render() {
        const points = this.state.MonthlySpendingPoints;
        const breakdownData = this.state.MonthlyBreakdownData;
        const purchases = this.state.MonthlyPurchases;
        const date = new Date();
        const color = { backgroundColor: "yellow" };
        return (
            <div>
                <Tabs className="month-tab-row">
                    <TabList>
                        <Tab id="MSTab1">
                            <div>Spending Chart</div>
                        </Tab>
                        <Tab id='MSTab2'>
                            <div>Breakdown Table</div>
                        </Tab>
                        <Tab id="MSTab3">Purchase List</Tab>
                    </TabList>
                    <TabPanel className="pie-chart">
                        <PieChart data={points} title="This Month's Spending" />
                    </TabPanel>
                    <TabPanel>
                        <BreakdownChart data={breakdownData} month={date.getMonth() + 1} />
                    </TabPanel>
                    <TabPanel>
                        <BreakdownChart data={purchases} month={date.getMonth() + 1} />
                    </TabPanel>
                </Tabs>
            </div>
        );
    }
}

export default MonthlyStatistics;