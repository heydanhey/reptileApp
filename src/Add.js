import React, { Component, Fragment } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import reptiles from "./reptiles.json";

class Add extends Component {
  state = {
    selected: [],
  };

  showAlert() {
    window.alert("Please add task");
  }

  add = () => {
    this.props.add(this.state.selected.pop());
    this.setState({
      selected: [],
    });
  };

  render() {
    return (
      <div className="row p-2">
        <div className="col-11 pb-2">
          <Typeahead
            id="test"
            selectHintOnEnter
            minLength={3}
            labelKey="name"
            options={reptiles.map((reptile) => {
              const name = reptile.Common_name.split("\n")
                .shift()
                .split(",")
                .shift();
              return { name: name, species: reptile.Species };
            })}
            placeholder="Choose a reptile..."
            onChange={(s) => this.setState({ selected: s })}
            selected={this.state.selected}
            renderMenuItemChildren={(option) => (
              <div>
                {option.name}
                <div>
                  <small>{option.species}</small>
                </div>
              </div>
            )}
          />
        </div>
        <div className="col-1">
          <button className="btn btn-outline-light" onClick={this.add}>
            Enter
          </button>
        </div>
      </div>
    );
  }
}

export default Add;
