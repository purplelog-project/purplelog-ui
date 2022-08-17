import MainBox from '../layouts/MainBox';
import Detail from '../pages/Detail';
import Home from '../pages/Home';

export default [
  {
    path: '/',
    element: <MainBox />,
    children:  [
      {
        path: '/',
        element: <Home />,
      },
    ]
  },
];
