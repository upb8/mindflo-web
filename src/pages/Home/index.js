import React, { Component, Fragment } from "react";
import YouTube from "react-youtube";
import "./style.scss";

class Home extends Component {
  state = {
    videoId: "mg7netw1JuM",
    videoStatus: 'Pause',
    playerInstance: null
  }

  constructor(args) {
    super(args);
    let webSocket = new WebSocket('wss://subscriptions.ap-northeast-1.graph.cool/v1/cjuhavbfm4dew0136f5svjec8', 'graphql-subscriptions');
    webSocket.onopen = (event) => {
      const message = {
        id: '1',
        type: 'init'
      }     
      console.log('initiated')
      webSocket.send(JSON.stringify(message))
    }

    // webSocket.addEventListener('message', function (event) {
    // });
    webSocket.onmessage = (event) => {
      console.log('Message from server ', event.data);
      const data = JSON.parse(event.data)
      switch (data.type) {
        case 'init_success': {
          console.log('init_success, the handshake is complete')
          const message = {
            id: '2',
            type: 'subscription_start',
            query: `
              subscription youtubePlayer {
                YoutubePlayer(
                  filter: {
                    mutation_in: [CREATED, UPDATED]
                    node: {
                      id: "cjuibfqka0g0a0146mdnvw3et"
                    }
                  }
                ) {
                  mutation
                  node {
                    id
                    playing
                    user {
                      id
                      name
                    }
                  }
                }
              }
            `
          }      
          webSocket.send(JSON.stringify(message))
          break;
        }
        case 'init_fail': {
          console.log('init fail')
          break;
        }
        case 'subscription_data': {
          console.log('subscription data has been received')
          console.log(data)
          // change the state 
          if(data.payload.data.YoutubePlayer.node.playing){
            this.state.playerInstance.playVideo();
            this.setState({videoStatus: 'Play'})
          } else {
            this.state.playerInstance.pauseVideo();
            this.setState({videoStatus: 'Pause'})
          }
          break;
        }
        case 'subscription_success': {
          console.log('subscription_success')
          console.log(data)
          break;
        }
        case 'subscription_fail': {
          console.log('subscription fail')
          break;
        }
        default : {
          console.log('keep alive')
          console.log(data)
          break;
        }
      }
    }
  }

  onPlayerReady = (event) => {
    // access to player in all event handlers via event.target
    // event.target.pauseVideo();
    console.log('player ready')
    this.setState({playerInstance: event.target})
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
      this.state.playerInstance.playVideo();      
    } else {
      this.state.playerInstance.pauseVideo();    
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