import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ProfileDetail from "./pages/ProfileDetail";
import Publish from "./pages/Publish";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import BottomNav from "./components/BottomNav";


function Router() {
  return (
    <>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/profile/:id"} component={ProfileDetail} />
        <Route path={"/publish"} component={Publish} />
        <Route path={"/contact/:id"} component={Contact} />
        <Route path={"/me"} component={Profile} />
        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
      <BottomNav />
    </>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
