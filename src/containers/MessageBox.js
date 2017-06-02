import {connect} from 'react-redux';
import {messages} from '../actions'
import MessageBox from '../components/MessageBox';

var mapStateToProps = (state, ownProps) => ({
  messages: state.messages
});

var mapDispatchToProps = (dispatch, ownProps) => ({
  getAll: (datas) => {
    dispatch(messages(datas,'ADD'))
  }
});

var _MessageBox = connect(
  mapStateToProps
  , mapDispatchToProps
)(MessageBox);

export default _MessageBox;
