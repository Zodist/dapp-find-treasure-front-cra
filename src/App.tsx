import { EthersContextProvider } from "./contexts";
import Home from "./pages/Home";

declare global {
  interface Window {
    ethereum?: any; // ExternalProvider;
  }
}

function App() {
  return (
    <EthersContextProvider>
      <Home />
    </EthersContextProvider>
  );
}

export default App;
