import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { VocabularyProvider } from './context/VocabularyProvider'
import { AddVocabularyPage } from './pages/AddVocabularyPage'
import { DashboardPage } from './pages/DashboardPage'
import { EditVocabularyPage } from './pages/EditVocabularyPage'
import { VocabularyPage } from './pages/VocabularyPage'

export default function App() {
  return (
    <VocabularyProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="vocabulary" element={<VocabularyPage />} />
            <Route path="vocabulary/new" element={<AddVocabularyPage />} />
            <Route path="vocabulary/:id/edit" element={<EditVocabularyPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </VocabularyProvider>
  )
}
