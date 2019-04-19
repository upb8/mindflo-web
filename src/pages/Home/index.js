import React, { Component, Fragment } from 'react';
import YouTube from 'react-youtube';
import debug from 'debug';

import './style.scss';

const log = debug('page:home');

class Home extends Component {
	state = {
		videoId: 'mg7netw1JuM',
		videoStatus: 'Play',
		playerInstance: null,
		valBtn: '❚❚',
		control: 'Auto'
	};

	constructor(args) {
		super(args);
		const webSocket = new WebSocket(
			'wss://subscriptions.ap-northeast-1.graph.cool/v1/cjuhavbfm4dew0136f5svjec8',
			'graphql-subscriptions'
		);
		webSocket.onopen = (event) => {
			const message = {
				id: '1',
				type: 'init'
			};
			log('initiated');
			webSocket.send(JSON.stringify(message));
		};

		// webSocket.addEventListener('message', function (event) {
		// });
		webSocket.onmessage = (event) => {
			log('Message from server ', event.data);
			const data = JSON.parse(event.data);
			switch (data.type) {
				case 'init_success': {
					log('init_success, the handshake is complete');
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
					};
					webSocket.send(JSON.stringify(message));
					break;
				}
				case 'init_fail': {
					log('init fail');
					break;
				}
				case 'subscription_data': {
					log('subscription data has been received');
					log(data);
					// change the state
					if (data.payload.data.YoutubePlayer.node.playing) {
						this.state.playerInstance.playVideo();
						this.setState({ videoStatus: 'Play', valBtn: '❚❚' });
					} else {
						this.state.playerInstance.pauseVideo();
						this.setState({ videoStatus: 'Pause', valBtn: '►' });
					}
					break;
				}
				case 'subscription_success': {
					log('subscription_success');
					log(data);
					break;
				}
				case 'subscription_fail': {
					log('subscription fail');
					break;
				}
				default: {
					log('keep alive');
					log(data);
					break;
				}
			}
		};
	}

	onPlayerReady = (event) => {
		// access to player in all event handlers via event.target
		// event.target.pauseVideo();
		log('player ready');
		this.setState({ playerInstance: event.target });
	};

	updateVideoId = (e) => {
		if (e.target.value !== '') {
			const splitURL = e.target.value.split('=');
			const videoId = splitURL.length === 1 ? e.target.value : splitURL[1].split('&')[0];
			this.setState({ videoId });
		}
	};

	togglePlayStatus = () => {
		if (this.state.videoStatus === 'Play') {
			this.state.playerInstance.playVideo();
		} else {
			this.state.playerInstance.pauseVideo();
		}
		this.setState({
			videoStatus: this.state.videoStatus === 'Play' ? 'Pause' : 'Play', // Play
			control: this.state.videoStatus === 'Play' ? 'Halt' : 'Auto',
			valBtn: this.state.videoStatus === 'Play' ? '❚❚' : '►'
		});
		log('From Toggle Play videostatus :', this.state.videoStatus);
		log('From Toggle Play :', this.state.control);
	};

	togglePomodoro = () => {
		log(this.state.videoStatus);
		if (this.state.videoStatus === 'Play') {
			this.state.playerInstance.playVideo();
			this.setState({
				videoStatus: this.state.videoStatus === 'Play' ? 'Pause' : 'Play',
				control: this.state.videoStatus === 'Play' ? 'Halt' : 'Auto',
				valBtn: this.state.videoStatus === 'Play' ? '❚❚' : '►'
			}); // switched to Pause
			log('From togglePomodoro : ', this.state.control); // Auto

			setTimeout(() => {
				this.setState({ control: this.state.videoStatus === 'Play' ? 'Halt' : 'Auto' });
				log('From SetTimeOut State Control : ', this.state.control); // Halt
				if (this.state.control === 'Auto') {
					this.state.playerInstance.pauseVideo();
					log('Break Time');
					this.setState({
						videoStatus: this.state.videoStatus === 'Play' ? 'Pause' : 'Play',
						valBtn: this.state.videoStatus === 'Play' ? '❚❚' : '►'
					});
				} else {
					log('USER MANUALLY PAUSED');
				}
			}, 5000);
		}
	};

	render() {
		const opts = {
			playerVars: {
				// https://developers.google.com/youtube/player_parameters
				autoplay: 1,
				controls: 0
			}
		};
		return (
			<div className="page-container">
				<div className="youtube-container">
					<YouTube className="youtubePlayer" videoId={this.state.videoId} opts={opts} onReady={this.onPlayerReady} />
				</div>
				<div className="player-controls">
					<input className="video-url" type="text" placeholder="Insert Youtube video link or id" onBlur={this.updateVideoId} />
					<input className="play-btn" type="button" value={this.state.valBtn} onClick={this.togglePlayStatus} />
					<input className="pomo-btn" type="button" value="5s" onClick={this.togglePomodoro} />
				</div>
			</div>
		);
	}
}

export default Home;
