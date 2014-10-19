/** @jsx React.DOM */
var React = require('react');
var Modal = require('./modal.jsx');


var AddCandidate = React.createClass({
    save: function(){
        alert("hi: " + this.refs.candidateName.getDOMNode().value);
    },
    render: function(){
        var body = (
            <div className="form-group">
                <label htmlFor="addCandidateName">Name</label>
                <input type="text" className="form-control" id="addCandidateName" ref="candidateName" placeholder="Enter name" />
            </div>);

        return (
            <div className="pull-right">
                <Modal triggerText="Add candidate" body={body} onSave={this.save} />
            </div>
        );
    }
});


module.exports = AddCandidate;