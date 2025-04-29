import { Layout, Button, Popover } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { HeaderProps } from './types';
import { useMemo, useState, useEffect,useCallback } from 'react'; 


const { Header } = Layout;



const AppHeader = (props: HeaderProps) => {
  const { isCollapsed, onToggleCollapse } = props;


 
  return (
    <Header 
      style={{ 
        background: '#fff', 
        padding: 0, 
        paddingLeft: 16,
        display: 'flex',
        alignItems: 'center',
        height: 64, 
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', 
        justifyContent: 'space-between',
      }}
    >
      <Button
        type="text"
        icon={isCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggleCollapse}
        style={{ 
          fontSize: '16px', 
          width: 64, 
          height: 64,
          borderRadius: 0 // Square button to match header
        }}
      />
      <div style={{ 
        display: 'flex', 
        marginRight: 16,
        gap: 8 
      }}>
        
      </div>
    </Header>
  );
};

export default AppHeader;