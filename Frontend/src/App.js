import React from "react";
import "./App.css";
import NewPurchase from "./NewPurchase/NewPurchase";
import { Tabs, Tab, TabList, TabPanel } from "react-tabs";
import MonthlyStatistics from "./MonthlyStatistics/MonthlyStatistics";
import YearlyStatistics from "./YearlyStatistics/YearlyStatistics";
import CompareMonths from "./CompareMonths/CompareMonths";
import configData from "./configuration.json";

function App() {

  const lightGrey = { backgroundColor: "LightGrey" };
  const skyBlue = { backgroundColor: "SkyBlue" };
  const indianRed = { backgroundColor: "LightCoral" };
  const lightGreen = { backgroundColor: "LightGreen" };
  const BACKEND_URL = configData.BACKEND_URL;
  return (
    <div className="App">
      <div>
        <header className="header">
          <b>Cash Tracker...See Where Your Money Goes!</b>
        </header>
      </div>
      <div>
        <Tabs className="tab-row">
          <TabList>
            <Tab id="Tab1" style={lightGreen}>
              <div>New Purchase</div>
            </Tab>
            <Tab id="Tab2" style={skyBlue}>
              <div>Monthly Statistics</div>
            </Tab>
            <Tab id="Tab3" style={indianRed}>
              <div>Yearly Statistics</div>
            </Tab>
            <Tab id="Tab4" style={lightGrey}>
              <div>Compare Months</div>
            </Tab>
          </TabList>

          <TabPanel>
            <NewPurchase BACKEND_URL={BACKEND_URL} />
          </TabPanel>
          <TabPanel>
            <MonthlyStatistics BACKEND_URL={BACKEND_URL} />
          </TabPanel>
          <TabPanel>
            <YearlyStatistics BACKEND_URL={BACKEND_URL} />
          </TabPanel>
          <TabPanel>
            <CompareMonths BACKEND_URL={BACKEND_URL}></CompareMonths>
          </TabPanel>
        </Tabs>
      </div>
    </div >
  );
}

export default App;
