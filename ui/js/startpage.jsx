/** @jsx React.DOM */
var React = require('react');
var twix = require('./libs/twix');
var AddCandidate = require('./add-candidate.jsx');

var Loader = React.createClass({
  render: function(){
    return (<div className={this.props.type + '-loader'}></div>);
  }
});
var CandidateBox = React.createClass({
  render: function() {
    return (
      <div className="candidates">
        <AddCandidate />
        <h2>Candidates</h2>
        <CandidateList url="/data.json" />
      </div>
    );
  }
});

var CandidateList = React.createClass({
  load: function(){
    var self = this;
    var loadingTimeout = window.setTimeout(function(){
      var state = self.state;
      state.loading = true;
      self.setState(state);
    }, 300);
    
    twix.ajax({
      url: self.props.url,
      success: function(data) {        
        window.clearTimeout(loadingTimeout);
        self.setState({data: data, loading:false});
      },
      error: function(xhr, status, err) {
        self.setState({data: [], loading:false})
        console.error(self.props.url, status, err.toString());
      }
    });
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
    return (
      <header className="navbar navbar-default">
        <Container>
          <div className="navbar-header">
            <a href="/" className="navbar-brand">Sidekick</a>
          </div>
        </Container>
      </header>
    );
  }
});

var Container = React.createClass({
  render: function renderHeading(){
    return (<div className="container">{this.props.children}</div>);
  }
});

var Page = React.createClass({
  render : function renderBody(){
    return (<div className="page">{this.props.children}</div>)
  }
});

module.exports = {
  render : function(){
    React.renderComponent(
      <Page>
        <Heading />
        <Container>
          <CandidateBox />
        </Container>
      </Page>,
      document.body
    );
  }
};