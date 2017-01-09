import React, { Component, PropTypes } from 'react';
import Nav from './common/Nav';
import SideNav from './common/SideNav';
import styles from './Playlist.module.css';
import Track from './Track';
import TorrentClient from '../core/TorrentClient';

export default class Playlist extends Component {

  static propTypes = {
    location: PropTypes.shape({
      query: PropTypes.shape({
        magnetUri: PropTypes.string
      })
    }),
    player: PropTypes.shape({}),
    setPlaylist: PropTypes.func,
    setMetadata: PropTypes.func,
    setTrackUrl: PropTypes.func
  };

  constructor(props) {
    super(props);

    const { magnetUri } = this.props.location.query;
    console.log(this.props.location);

    this.tc = new TorrentClient(magnetUri);
    this.state = {
      metadata: null,
      tracks: [],
      swarm: null
    };
    this.timer = null;
  }

  componentDidMount() {
    this.tc.on('tracks', (tracks) => {
      this.setState({ tracks });
      this.props.setPlaylist(tracks);
    });

    this.tc.on('metadata', (metadata) => {
      this.setState({ metadata });
      this.props.setMetadata(metadata);
    });

    this.timer = setInterval(() => {
      this.setState({ swarm: this.tc.getSwarm() });
    }, 2000);

    // setInterval(() => {
    //   this.tc.getProgress(() => {
    //     console.log('progress update');
    //   });
    // }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const metadata = this.state.metadata;
    const { setTrackUrl } = this.props;
    const { downloadPlaylist, downloadTrack, getFileProgress } = this.tc;

    const trackNodes = this.state.tracks.map((v, i) => {
      const isCurrentTrackPlaying = this.props.player.playing && this.props.player.track === i;
      return (
        <Track
          key={i}
          trackId={i}
          track={v}
          setTrackUrl={setTrackUrl}
          isPlaying={isCurrentTrackPlaying}
          getFileProgress={getFileProgress}
          downloadTrack={downloadTrack}
        />
      );
    });

    const swarm = this.state.swarm;
    const downloadSpeed = swarm !== null ? parseInt(swarm.downloadSpeed(), 10) : 0;
    const uploadSpeed = swarm !== null ? parseInt(swarm.uploadSpeed(), 10) : 0;

    return (
      <div className={styles.playlist}>
        <SideNav />
        <div className={styles.container}>
          <Nav
            swarm={swarm}
            download={downloadSpeed}
            upload={uploadSpeed}
          />

          <div className={styles.cover}>
            <h2>{metadata !== null ? metadata.name : 'Loading playlist...'}</h2>
            <div className={styles.buttons}>
              <button className={styles.button} onClick={downloadPlaylist}><i className="fa fa-download" /> Download</button>
            </div>
          </div>
          {trackNodes}
        </div>
      </div>
    );
  }
}
