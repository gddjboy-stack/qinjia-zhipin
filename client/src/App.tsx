import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import { useState, useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { composeProviders } from "./lib/composeProviders";

// 新的拆分Context
import { AuthProvider } from "./contexts/AuthContext";
import { ProfileProvider } from "./contexts/ProfileContext";
import { ContactProvider } from "./contexts/ContactContext";
import { SettingsProvider, useSettings } from "./contexts/SettingsContext";

import ParentGuideModal from "./components/ParentGuideModal";
import Home from "./pages/Home";
import ProfileDetail from "./pages/ProfileDetail";
import Publish from "./pages/Publish";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import BottomNav from "./components/BottomNav";
import Analytics from "./pages/Analytics";
import SettingsIndex from "./pages/Settings/Index";
import SettingsPrivacy from "./pages/Settings/Privacy";
import SettingsNotifications from "./pages/Settings/Notifications";
import SettingsAbout from "./pages/Settings/About";


function Router() {
  const { isFirstVisit, markFirstVisitDone } = useSettings();
  const [location, setLocation] = useLocation();
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    // 只在首页且是首次访问时显示指南
    if (location === '/' && isFirstVisit) {
      setShowGuide(true);
    }
  }, [location, isFirstVisit]);

  const handleGetStarted = () => {
    markFirstVisitDone();
    setShowGuide(false);
    // 跳转到发布页面
    setLocation('/publish');
  };

  return (
    <>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/profile/:id"} component={ProfileDetail} />
        <Route path={"/publish"} component={Publish} />
        <Route path={"/contact/:id"} component={Contact} />
        <Route path={"/me"} component={Profile} />
        <Route path={"/analytics"} component={Analytics} />
        <Route path={"/settings"} component={SettingsIndex} />
        <Route path={"/settings/privacy"} component={SettingsPrivacy} />
        <Route path={"/settings/notifications"} component={SettingsNotifications} />
        <Route path={"/settings/about"} component={SettingsAbout} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
      <ParentGuideModal
        isOpen={showGuide}
        onClose={() => {
          markFirstVisitDone();
          setShowGuide(false);
        }}
        onGetStarted={handleGetStarted}
      />
    </>
  );
}

/**
 * Provider 组合顺序（重要）：
 * 1. AuthProvider     - 最外层：提供 userId，被所有其他 Context 依赖
 * 2. SettingsProvider - 依赖 Auth（需要 userId）
 * 3. ProfileProvider  - 依赖 Auth（需要 userId）
 * 4. ContactProvider  - 依赖 Auth（需要 userId）
 *
 * 新增 Provider 时只需在数组中加一行，不需要修改嵌套结构。
 */
const AppProviders = composeProviders([
  AuthProvider,
  SettingsProvider,
  ProfileProvider,
  ContactProvider,
]);

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <AppProviders>
        <ThemeProvider
          defaultTheme="light"
          // switchable
        >
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </AppProviders>
    </ErrorBoundary>
  );
}

export default App;
