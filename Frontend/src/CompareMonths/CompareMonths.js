import React from "react";
import axios from "axios";
import PieChart from "../Charts/PieChart";
import BreakdownChart from "../Charts/BreakdownChart";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import "./CompareMonths.css"

class CompareMonths extends React.Component {
    constructor(props) {
        super(props);
        const today = new Date();
        this.state = {
            Month1SpendingData: {},
            Month2SpendingData: {},
            Month1SpendingPoints: [],
            Month2SpendingPoints: [],
            BreakdownData: [],
            Month1: "January",
            Month2: "January",
            Year1: today.getFullYear(),
            Year2: today.getFullYear()
        }

        this.handleMonth1Change = this.handleMonth1Change.bind(this);
        this.handleMonth2Change = this.handleMonth2Change.bind(this);
        this.handleYear1Change = this.handleYear1Change.bind(this);
        this.handleYear2Change = this.handleYear2Change.bind(this);
        this.HTTPGetMonthlySpending = this.HTTPGetMonthlySpending.bind(this);
        this.CombineBreakdownData = this.CombineBreakdownData.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    async HTTPGetMonthlySpending() {
        const today = new Date();

        const url1 = this.props.BACKEND_URL + "api/ct/monthly/totals/all/" + this.state.Month1 + "/" + this.state.Year1;

        await axios.get(url1)
            .then((resp) => this.state.Month1SpendingData = resp.data.data)
            .catch(() => alert("GetMontlySpending() Failed:("));

        const url2 = this.props.BACKEND_URL + "api/ct/monthly/totals/all/" + this.state.Month2 + "/" + this.state.Year2;

        await axios.get(url2)
            .then((resp) => this.state.Month2SpendingData = resp.data.data)
            .catch(() => alert("GetMontlySpending() Failed:("));
    }

    async HTTPGetMonthlyBreakdown(month, year) {
        const today = new Date();
        const url = this.props.BACKEND_URL + "api/ct/monthly/breakdown/" + month + "/" + year;
        var list = [];
        await axios.get(url)
            .then((resp) => list = resp.data.data)
            .catch(() => alert("HTTPGetMonthlyBreakdown() Failed:("));
        //await axios.get(url)
        //    .then((resp) => bdata = resp.data.data)
        //    .catch(() => alert("HTTPGetMontlyBreakdown() Failed:("));
        return list;
    }

    SpendingToPieChartPoints() {
        const dict1 = this.state.Month1SpendingData;
        var points1 = [];
        for (var key in dict1) {
            var point = { y: parseFloat(dict1[key]), label: key }
            points1.push(point);
            //if (key != "Zyns") {
            //    var point = { y: parseFloat(dict[key]), label: key }
            //    points.push(point);
            //}
            // { y: 49, label: "Organic Search" }
        }
        const dict2 = this.state.Month2SpendingData;
        var points2 = [];
        for (var key in dict2) {
            var point = { y: parseFloat(dict2[key]), label: key }
            points2.push(point);
            //if (key != "Zyns") {
            //    var point = { y: parseFloat(dict[key]), label: key }
            //    points.push(point);
            //}
            // { y: 49, label: "Organic Search" }
        }

        var l = [];
        l.push(points1);
        l.push(points2);
        return l;
    }

    CombineBreakdownData(m1, m2) {
        var m1_keys = m1.slice(0, m1.length - 1).map((x) => x["category"]);
        var m2_keys = m2.slice(0, m2.length - 1).map((x) => x["category"]);
        const uniqueKeys = [...new Set(m1_keys.concat(m2_keys))];

        var d1 = {};
        for (var i = 0; i < m1.length - 1; i++) {
            var d = m1[i];
            d1[d["category"]] = [d["purchases"], d["spent"]];
        }

        var d2 = {};
        for (var i = 0; i < m2.length - 1; i++) {
            d = m2[i];
            d2[d["category"]] = [d["purchases"], d["spent"]];
        }


        var data = [];
        const abbrev_m1 = this.AbbreviatedMonth(this.state.Month1) + " " + this.state.Year1;
        const abbrev_m2 = this.AbbreviatedMonth(this.state.Month2) + " " + this.state.Year2;

        for (i = 0; i < uniqueKeys.length; i++) {
            var d = {};
            d["category"] = uniqueKeys[i];
            d[abbrev_m1 + " #"] = (uniqueKeys[i] in d1) ? d1[uniqueKeys[i]][0] : "0";
            d[abbrev_m2 + " #"] = (uniqueKeys[i] in d2) ? d2[uniqueKeys[i]][0] : "0";
            d[abbrev_m1 + " Spent"] = (uniqueKeys[i] in d1) ? d1[uniqueKeys[i]][1] : "0.00";
            d[abbrev_m2 + " Spent"] = (uniqueKeys[i] in d2) ? d2[uniqueKeys[i]][1] : "0.00";
            data.push(d);
        }

        var d = {};
        d["category"] = "TOTAL";
        d[abbrev_m1 + " #"] = m1[m1.length - 1]["purchases"];
        d[abbrev_m2 + " #"] = m2[m2.length - 1]["purchases"];
        d[abbrev_m1 + " Spent"] = m1[m1.length - 1]["spent"];
        d[abbrev_m2 + " Spent"] = m2[m2.length - 1]["spent"];
        data.push(d);
        debugger;

        return data;
    }

    AbbreviatedMonth(m) {
        debugger;
        if (m == "March" || m == "June" || m == "July") {
            return m + '.';

        }
        else {
            return m.substring(0, 3) + '.';
        }
    }

    handleMonth1Change(event) {
        this.setState({ Month1: event.target.value });
    }

    handleMonth2Change(event) {
        this.setState({ Month2: event.target.value });
    }

    handleYear1Change(event) {
        this.setState({ Year1: event.target.value });
    }

    handleYear2Change(event) {
        this.setState({ Year2: event.target.value });
    }

    async onSubmit(e) {
        e.preventDefault();
        await this.HTTPGetMonthlySpending();
        const m1_bdown_list = await this.HTTPGetMonthlyBreakdown(this.state.Month1, this.state.Year1);
        const m2_bdown_list = await this.HTTPGetMonthlyBreakdown(this.state.Month2, this.state.Year2);
        const bdown_list = this.CombineBreakdownData(m1_bdown_list, m2_bdown_list);

        //const purch_list = await this.HttpGetMonthlyPurchases();
        const points_list = this.SpendingToPieChartPoints();

        this.setState({
            Month1SpendingPoints: points_list[0],
            Month2SpendingPoints: points_list[1],
            BreakdownData: bdown_list
            //MonthlyBreakdownData: bdown_list,
            //MonthlyPurchases: purch_list
        });

        //this.setState(() => ({ MonthlySpendingPoints: [{ y: 84, label: "hi" }, { y: 12, label: "bye" }, { y: 43.21, label: "woah" }] }));
    }

    render() {
        const M1Points = this.state.Month1SpendingPoints;
        const M2Points = this.state.Month2SpendingPoints;
        const breakdownData = this.state.BreakdownData;

        const tuquiose = { backgroundColor: "rgb(121, 241, 209)" };
        const mediumOrchid = { backgroundColor: "rgb(196, 145, 251)" };
        return (
            <div>
                <div className="compare-div">
                    <form onSubmit={this.onSubmit} className="compare-form">
                        <label className="month-select">
                            Month1: {" "}
                            <select value={this.state.Month1} onChange={this.handleMonth1Change}>
                                <option value="January">January</option>
                                <option value="February">February</option>
                                <option value="March">March</option>
                                <option value="April">April</option>
                                <option value="May">May</option>
                                <option value="June">June</option>
                                <option value="July">July</option>
                                <option value="August">August</option>
                                <option value="September">September</option>
                                <option value="October">October</option>
                                <option value="November">November</option>
                                <option value="December">December</option>
                            </select>
                        </label>
                        <label className="month-select">
                            Year1: {""}
                            <select value={this.state.Year1} onChange={this.handleYear1Change}>
                                <option value={2022}>2022</option>
                                <option value={2021}>2021</option>
                                <option value={2020}>2020</option>
                                <option value={2019}>2019</option>

                            </select>
                        </label>
                        <label className="month-select">
                            Month2: {" "}
                            <select value={this.state.Month2} onChange={this.handleMonth2Change}>
                                <option value="January">January</option>
                                <option value="February">February</option>
                                <option value="March">March</option>
                                <option value="April">April</option>
                                <option value="May">May</option>
                                <option value="June">June</option>
                                <option value="July">July</option>
                                <option value="August">August</option>
                                <option value="September">September</option>
                                <option value="October">October</option>
                                <option value="November">November</option>
                                <option value="December">December</option>
                            </select>
                        </label>
                        <label className="month-select">
                            Year: {""}
                            <select value={this.state.Year2} onChange={this.handleYear2Change}>
                                <option value={2021}>2021</option>
                                <option value={2020}>2020</option>
                                <option value={2019}>2019</option>

                            </select>
                        </label>
                        <input type="submit" value="Submit" className="compare-submit" />
                    </form>
                </div>
                <Tabs>
                    <TabList>
                        <Tab id="CMTab1" style={tuquiose}>
                            <div>Compare Charts</div>
                        </Tab>
                        <Tab id="CMTab2" style={mediumOrchid}>
                            <div>Compare Percentages</div>
                        </Tab>
                    </TabList>
                    <TabPanel>
                        <PieChart data={M1Points} title={this.state.Month1 + " " + this.state.Year1} />
                        <PieChart data={M2Points} title={this.state.Month2 + " " + this.state.Year2} />
                    </TabPanel>
                    <TabPanel>
                        <BreakdownChart data={breakdownData}></BreakdownChart>
                    </TabPanel>
                </Tabs>
            </div>
        );
    }

}

export default CompareMonths;