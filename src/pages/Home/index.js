import React, { Component, Fragment } from "react";
import YouTube from "react-youtube";
import "./style.scss";

class Home extends Component {
  state = {
    videoId: "mg7netw1JuM",
    videoStatus: 'Play',
    playerInstance: null
  }
  onPlayerReady = (event) => {
    // access to player in all event handlers via event.target
    // event.target.pauseVideo();
    console.log('player ready')
  }

  updateVideoId = (e) => {
    if(e.target.value !== ''){
      const splitURL = e.target.value.split('=');
      const videoId = splitURL.length === 1 ? e.target.value : splitURL[1].split('&')[0];
      this.setState({videoId});
    }
  }

  togglePlayStatus = () => {
    if(this.state.videoStatus === 'Play'){
      this.state.playerInstance.pauseVideo();
    } else {
      this.state.playerInstance.playVideo();      
    }
    this.setState({videoStatus: this.state.videoStatus === 'Play' ? 'Pause' : 'Play'});
  }

  render() {
    const opts = {
      playerVars: {
        // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    };
    return (
      <Fragment>
        <YouTube videoId={this.state.videoId} opts={opts} onReady={this.onPlayerReady} />
        <div className="player-controls">
          <input type="text" placeholder="Insert Youtube video link or id" onBlur={this.updateVideoId} style={{minWidth: "200px", textAlign: 'center'}}/>
          <input type="button" value={this.state.videoStatus} onClick={this.togglePlayStatus}/>
        </div>
      </Fragment>
    );
  }
}

export default Home;
