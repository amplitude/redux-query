import React from 'react';
import ReactDOM from 'react-dom';

import Playground from './components/Playground';
import demo from './demos/echo';
import './index.css';

ReactDOM.render(
    <Playground
        demo={demo}
    />,
    document.getElementById('root')
);
