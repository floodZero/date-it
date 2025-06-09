import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EventSearch } from './pages/EventSearch';
import { EventRegistration } from './pages/EventRegistration';
import { EventDetail } from './pages/EventDetail';
import { SearchDateCourse } from './pages/SearchDateCourse';
import { SearchLocation } from './pages/SearchLocation';
import { Layout } from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><EventSearch /></Layout>} />
        <Route path="/event/new" element={<Layout><EventRegistration /></Layout>} />
        <Route path="/event/:id" element={<Layout><EventDetail /></Layout>} />
        <Route path="/search/datecourse" element={<Layout><SearchDateCourse /></Layout>} />
        <Route path="/search/location" element={<Layout><SearchLocation /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
