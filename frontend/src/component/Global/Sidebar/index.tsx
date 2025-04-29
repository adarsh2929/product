import { Layout, Menu } from 'antd';

import { SidebarProps } from './types';
import { FORMDATA } from '../../../constant/Data';
const { Sider } = Layout;



const Sidebar = (props: SidebarProps) => {
  const { isCollapsed, onToggleCollapse, handleSidebar } = props;
  const { menuItems } = FORMDATA;
  return (
    <Sider
      collapsible
      collapsed={isCollapsed}
      onCollapse={onToggleCollapse}
      width={200}
      collapsedWidth={80}
      theme="dark"
    >
      <div className="demo-logo-vertical" />
      <Menu
        theme="dark"
        mode="inline"
        onClick={handleSidebar}
        defaultSelectedKeys={['1']}
        inlineCollapsed={isCollapsed}
        items={menuItems.map(item => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
        }))}
      />
    </Sider>
  );
};

export default Sidebar;