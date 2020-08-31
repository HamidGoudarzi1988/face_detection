import React, { Component, Fragment } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
  apiKey: '749895eb4b0d414088b299a6b956e239',
});

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 300,
      },
    },
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignin: false,
    };
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayFaceBox = (box) => {
    this.setState({ box: box });
  };
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };
  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        // '749895eb4b0d414088b299a6b956e239',
        // URL
        this.state.input
      )
      .then((response) =>
        this.displayFaceBox(this.calculateFaceLocation(response))
      )

      // do something with responseconsole.log(response);
      .catch((err) => console.log(err));
  };

  onRouteChange = (route) => {
    if (route === 'signin') {
      this.setState({ isSignin: false })
    } else if (route === 'home') {
      this.setState({ isSignin: true })
    }
    this.setState({ route: route });
  }

  render() {
    return (
      <div className='App'>
        <Particles className='particles' params={particlesOptions} />
        <Navigation isSignin={this.state.isSignin} onRouteChange={this.onRouteChange} />
        {this.state.route === 'home'
          ?
          <Fragment>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />

            <FaceRecognition
              box={this.state.box}
              imageUrl={this.state.imageUrl}
            />
          </Fragment>
          : (
            this.state.route === 'signin' ?
              <Signin onRouteChange={this.onRouteChange} />
              : <Register onRouteChange={this.onRouteChange} />

          )
        }
      </div>
    );
  }
}

export default App;
