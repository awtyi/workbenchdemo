<template>
  <header class="top-nav">
    <div class="nav-left">
      <div class="logo-area">
        <div class="logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="9" height="9" rx="2" fill="#4096FF"/>
            <rect x="13" y="2" width="9" height="9" rx="2" fill="rgba(64,150,255,0.5)"/>
            <rect x="2" y="13" width="9" height="9" rx="2" fill="rgba(64,150,255,0.5)"/>
            <rect x="13" y="13" width="9" height="9" rx="2" fill="#4096FF"/>
          </svg>
        </div>
        <div class="logo-text">
          <span class="logo-main">工业互联网平台</span>
          <span class="logo-sub">履约项目管理</span>
        </div>
      </div>
      <div class="nav-divider" />
      <nav class="nav-menu">
        <a class="nav-item active">工作台</a>
        <a class="nav-item">项目管理</a>
        <a class="nav-item">函件中心</a>
        <a class="nav-item">风险管控</a>
        <a class="nav-item">成本预算</a>
      </nav>
    </div>
    <div class="nav-right">
      <div class="nav-actions">
        <a-tooltip title="消息通知">
          <a-badge :count="5" size="small">
            <div class="action-btn">
              <BellOutlined />
            </div>
          </a-badge>
        </a-tooltip>
        <a-tooltip title="全屏">
          <div class="action-btn">
            <FullscreenOutlined />
          </div>
        </a-tooltip>
        <a-tooltip title="设置">
          <div class="action-btn">
            <SettingOutlined />
          </div>
        </a-tooltip>
      </div>
      <div class="nav-divider" />
      <div class="user-area">
        <a-avatar :size="32" style="background: linear-gradient(135deg, #1677FF, #722ED1); font-size: 13px;">
          张
        </a-avatar>
        <div class="user-info">
          <span class="user-name">张项目经理</span>
          <span class="user-role">项目经理</span>
        </div>
        <DownOutlined style="font-size: 10px; opacity: 0.6;" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { BellOutlined, FullscreenOutlined, SettingOutlined, DownOutlined } from '@ant-design/icons-vue'
</script>

<style scoped>
.top-nav {
  height: 56px;
  background: linear-gradient(90deg, #0D2B5E 0%, #1a3d7a 50%, #0D2B5E 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 12px rgba(13, 43, 94, 0.4);
}

.nav-left, .nav-right {
  display: flex;
  align-items: center;
  gap: 0;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.logo-main {
  font-size: 15px;
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: 0.5px;
}

.logo-sub {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 1px;
}

.nav-divider {
  width: 1px;
  height: 24px;
  background: rgba(255, 255, 255, 0.15);
  margin: 0 20px;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-item {
  padding: 6px 14px;
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.nav-item:hover {
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  color: #FFFFFF;
  background: rgba(22, 119, 255, 0.5);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.75);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover {
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.12);
}

.user-area {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.user-area:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  color: #FFFFFF;
}

.user-role {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
}
</style>
