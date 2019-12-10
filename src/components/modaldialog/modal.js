/**
* Copyright (c) 2018
* @summary Common Modal Contents
* @author Mangesh Pimprikar,Ankur Vishwakarma,Poonam Banode,Irfan Bagwan
*
*/
import React, { Component, PropTypes } from 'react';
import './modal.css';


//Remove all consoles in one way
// try {
//   if (typeof(window.console) != "undefined") {
//       window.console = {};
//       window.console.log = function () {};
//       window.console.info = function () {};
//       window.console.warn = function () {};
//       window.console.error = function () {};
//   }
//   if (typeof(alert) !== "undefined") {
//       alert = function ()
//       {}
//   }

// } catch (ex) {}

export default class Modal extends Component {

  listenKeyboard = (event) => {
    if (event.key === 'Escape' || event.keyCode === 27) {
     // this.props.onClose();
    }
  };

  componentDidMount () {
    if (this.props.onClose) {
      window.addEventListener('keydown', this.listenKeyboard, true);
    }
  }

  componentWillUnmount () {
    if (this.props.onClose) {
      window.removeEventListener('keydown', this.listenKeyboard, true);
    }
  }


  get close () {
    const { onClose } = this.props;
    return onClose ? (
      <div className='modal__close' onClick={onClose} />
    ) : null;
  }

  onOverlayClick = () => {
    //this.props.onClose();
  };

  onDialogClick = (event) => {
    event.stopPropagation();
  };

  render ({props} = this) {
    return (
      <div className={props.className ? props.className : '' }>
        <div className='overlay'> </div>
        <div className='content' onClick={this.onOverlayClick}>
          <div className='dialog' onClick={this.onDialogClick}>
                {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
