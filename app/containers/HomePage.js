import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as PlaylistActions from '../actions/playlists';


function mapStateToProps(state) {
  return {
    playlists: state.playlists,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(PlaylistActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
