import { AntDesignOutlined, CrownOutlined, SmileOutlined, TabletOutlined } from '@ant-design/icons';

export default {
  route: {
    path: '/',
    routes: [
      {
        path: '/',
        name: '欢迎',
        icon: <SmileOutlined />,
      }
    ],
  },
  location: {
    pathname: '/',
  },
};
