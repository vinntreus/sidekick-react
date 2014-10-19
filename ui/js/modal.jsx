/** @jsx React.DOM */
var React = require('react');

var Modal = React.createClass({
    openModal : function(){
        this.setState({modalOpen: true});
        if(this.props.onOpen){this.props.onOpen();}
    },
    closeModal : function(){
        this.setState({modalOpen: false});
        if(this.props.onClose){this.props.onClose();}
    },
    saveAndClose : function(){
        var modalOpen = false;
        if(this.props.onSave){
            modalOpen = this.props.onSave();
        }        
        this.setState({modalOpen: modalOpen});
    },
    getInitialState: function() {
        return { modalOpen : false};
    },
    render: function(){
        return (
            <div>
                <ModalTrigger trigger={this.openModal} disabled={this.state.modalOpen} text={this.props.triggerText} />
                <ModalDialog    show={this.state.modalOpen} 
                                hide={this.closeModal} 
                                save={this.saveAndClose}
                                title={this.props.title || this.props.triggerText}
                                body={this.props.body} />
            </div>
        );
    }
});

var ModalDialog = React.createClass({
    close : function(e){
        e.preventDefault();
        this.props.hide();
    },
    save: function(e){
        e.preventDefault();
        this.props.save();
    },
    shouldComponentUpdate : function(nextProps){
        if(nextProps.show){
            if(document.querySelector('.modal-backdrop')){ 
                return false;
            }
            var backdrop = document.createElement('div');
            backdrop.classList.add('modal-backdrop');
            backdrop.classList.add('fade');
            backdrop.classList.add('in');
            document.body.appendChild(backdrop);
        }
        else{
            document.querySelector('.modal-backdrop').remove();
        }
        return true;
    },
    render: function(){
        if(!this.props.show){ return false; }
        return (
            <div className="modal fade in" style={ {display:'block' } } role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" onClick={this.close} className="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span className="sr-only">Close</span></button>
                    <h4 className="modal-title">{this.props.title}</h4>
                  </div>
                  <div className="modal-body">{this.props.body}</div>
                  <div className="modal-footer">
                    <button type="button" onClick={this.close} className="btn btn-default" data-dismiss="modal">Close</button>
                    <input type="submit" onClick={this.save} className="btn btn-primary" value="Save changes" />
                  </div>
                </div>
              </div>
            </div>
        );
    }
});

var ModalTrigger = React.createClass({
    onClick : function(e){
        e.preventDefault();
        this.props.trigger();
    },
    render: function(){
        var disabled = this.props.disabled;
        return (
            <button onClick={this.onClick} disabled={disabled} className="btn btn-primary">{this.props.text}</button>
        );
    }
});

module.exports = Modal;