import React from "react";
import axios from "axios";
import './NewPurchase.css'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

class NewPurchase extends React.Component {
  constructor(props) {
    super(props);
    this.state = { business: "...", purchase_date: "", price: "0.00", category: "", category_list: [] };
    this.onSubmit = this.onSubmit.bind(this);
    //this.handleChange = this.handleChange.bind(this);
    this.handleBusinessChange = this.handleBusinessChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.handlePurchDateChange = this.handlePurchDateChange.bind(this);
    this.buildPostDataJson = this.buildPostDataJson.bind(this);
    this.HttpGetCategories = this.HttpGetCategories.bind(this);
    this.DisplayCategories = this.DisplayCategories.bind(this);
    this.ValidateInputs = this.ValidateInputs.bind(this);
  }

  async HttpGetCategories() {
    const url = "https://localhost:5001/api/ct/newpurchase/categories";
    var list = []
    await axios.get(url)
      .then((resp) => list = resp.data.data)
      .catch(() => alert("HttpGetCategories() Failed:("));

    return list;
  }

  DisplayCategories() {
    const c_list = this.state.category_list;
    return c_list.map((category) => {
      return <option>{category}</option>
    })
  }

  ValidateInputs() {

  }

  async onSubmit(e) {
    e.preventDefault();
    debugger;
    const postUrl = "https://localhost:5001/api/ct/newpurchase/data";
    const bodyData = this.buildPostDataJson();
    const response = await axios.post(postUrl, bodyData, {
      headers: { 'Content-Type': 'application/json' }//, 'Content-Length': JSON.stringify(bodyData).length }
    });
    if (response.status == 200) {
      alert(response.data);
      console.log(response.data);
    }
    else {
      alert(response.data);
    }

    window.location.reload(true);
  }

  buildPostDataJson() {
    debugger;
    const json = {
      "price": this.state.price.toString(),
      "purchasedate": this.state.purchase_date.toString(),
      "category": this.state.category.toString(),
      "business": this.state.business.toString()
    }
    return json;
  }

  handleBusinessChange(event) {
    this.setState({ business: event.target.value });
  }

  handlePurchDateChange(value, event) {
    if (value != null) {
      let [month, date, year] = value.toLocaleDateString("en-US").split("/");
      const fullDate = year + '/' + month + '/' + date;
      this.setState({ purchase_date: fullDate });
    }

  }

  handlePriceChange(event) {
    var data = event.target.value;

    if (data[0] == '$') {
      data = data.slice(1, data.length);
    }
    this.setState({ price: data });
  }

  handleCategoryChange(event) {
    this.setState({ category: event.target.value });
  }


  async componentDidMount() {
    const c_list = await this.HttpGetCategories();
    this.setState({
      category_list: c_list
    });

    console.log(this.state.category_list);
  }

  render() {
    return (
      <div className="purchase-page">
        <h1>Enter a New Purchase</h1>
        <form onSubmit={this.onSubmit}>
          <label className="business-label">
            Business:{" "}
            <input
              type="text"
              value={this.state.business}
              onChange={this.handleBusinessChange}
              className="business-input"
            />
          </label>
          <label className="date-label">
            Purchase Date:
            <Calendar onChange={this.handlePurchDateChange} className="purchase-calendar" />
          </label>
          <label className="price-label">
            Price:{" "}
            <input
              input="text"
              value={this.state.price}
              onChange={this.handlePriceChange}
              className="price-input"
            ></input>
          </label>
          <label className="category-label">
            Category:{" "}
            <input
              type="text"
              list="categories"
              value={this.state.category}
              onChange={this.handleCategoryChange}
              className="category-input"
            />
            <datalist id="categories">
              {this.DisplayCategories()}
            </datalist>
          </label>
          <input type="submit" value="Submit" className="submit-input" />
        </form>
      </div >
    );
  }
}

export default NewPurchase;
