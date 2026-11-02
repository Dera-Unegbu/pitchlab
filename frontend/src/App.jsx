import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PitchLabProvider } from './context/PitchLabContext.jsx';
import Layout from './components/Layout.jsx';
import FeedPage from './pages/FeedPage.jsx';
import PitchDetailPage from './pages/PitchDetailPage.jsx';

export default function App() {
  return (
    <PitchLabProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<FeedPage mode="explore" />} />
            <Route path="/following" element={<FeedPage mode="following" />} />
            <Route path="/pitch/:pitchId" element={<PitchDetailPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PitchLabProvider>
  );
}
