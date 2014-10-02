/** @jsx React.DOM */
var React = require('react');
var twix = require('./libs/twix');

var Loader = React.createClass({
  render: function(){
    return (<div className={this.props.type + '-loader'}></div>);
  }
});
var CandidateBox = React.createClass({
  render: function() {
    return (
      <div className="candidates">
        <h2>Candidates</h2>
        <CandidateList url="/data.json" />
      </div>
    );
  }
});

var CandidateList = React.createClass({
  load: function(){
    var self = this;
      twix.ajax({
      url: self.props.url,
      success: function(data) {
        window.setTimeout(function(){
          self.setState({data: data, loading:false});
        }, 1);
      },
      error: function(xhr, status, err) {
        console.error(self.props.url, status, err.toString());
      }
    });
    //self.setState({data: [], loading:false});
  },
  getInitialState: function() {
    return {data: [], loading : false};
  },
  componentDidMount: function() {
    this.load();
    //setInterval(function(){})
    //TODO: websockets
    //setInterval(this.load, this.props.pollInterval);
  },
  render: function() {
    if(this.state.loading){
      return (<Loader type="page"/>);
    }
    var nodes = this.state.data.map(function(d){
      return (<Candidate name={d.name} text={d.text} />);
    });
    return (
      <div className="list-group">
        {nodes}
      </div>
    );
  }
});

var Candidate = React.createClass({
  render: function(){
    return (
      <a href="#" className="list-group-item">
        <h4 className="list-group-item-heading">{this.props.name}</h4>
        <p className="list-group-item-text">{this.props.text}</p>
      </a>
    );
  }
});


var Heading = React.createClass({
  render: function renderHeading(){
    return (<h1>Sidekick</h1>);
  }
});

var Container = React.createClass({
  render: function renderHeading(){
    return (<div className="container">{this.props.children}</div>);
  }
});


React.renderComponent(
  <Container>
    <Heading />
    <CandidateBox />
  </Container>,
  document.body
);