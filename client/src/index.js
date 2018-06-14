import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Blog from './Blog';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Blog />, document.getElementById('root'));
registerServiceWorker();
