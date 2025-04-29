
export interface SidebarProps {
    isCollapsed: boolean;
    onToggleCollapse: (collapsed: boolean) => void;
    handleSidebar: (key: any) => void;
  }