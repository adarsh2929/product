import { Layout } from 'antd';
import  { useState } from 'react';
import Sidebar from '../../component/Global/Sidebar';
import { Outlet, useNavigate } from 'react-router-dom';
import AppHeader from '../../component/Global/Header';
const {  Content } = Layout;

const GlobalLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleSidebar = (key: any) => {
    console.log(key);
    switch(key.key) {
      case 'product':
        navigate('/');
        break;
      default:
        navigate('/');
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={(collapsed) => setIsCollapsed(collapsed)}
        handleSidebar={handleSidebar}
      />
      <Layout>
        <AppHeader
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default GlobalLayout;