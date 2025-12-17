// src/components/DeviceAware.jsx
import { useDevice } from '../hooks/useDevice';

export const MobileOnly = ({ children }) => {
  const { isMobile } = useDevice();
  return isMobile ? children : null;
};

export const DesktopOnly = ({ children }) => {
  const { isMobile } = useDevice();
  return !isMobile ? children : null;
};

export const TabletOnly = ({ children }) => {
  const { device } = useDevice();
  return device === 'tablet' ? children : null;
};