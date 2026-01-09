import { useState, useRef, useEffect } from 'react'
import './App.css'
import * as pdfjsLib from 'pdfjs-dist'

// PDF.js workerの設定
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

function App() {
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [scale, setScale] = useState(1.5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // PDFファイルを読み込む
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const arrayBuffer = await file.arrayBuffer()
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
      const pdf = await loadingTask.promise

      setPdfDoc(pdf)
      setTotalPages(pdf.numPages)
      setCurrentPage(1)
    } catch (err) {
      setError('PDFファイルの読み込みに失敗しました')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ページをレンダリング
  const renderPage = async (pageNum: number) => {
    if (!pdfDoc || !canvasRef.current) return

    try {
      const page = await pdfDoc.getPage(pageNum)
      const viewport = page.getViewport({ scale })
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      if (!context) return

      canvas.height = viewport.height
      canvas.width = viewport.width

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      }

      await page.render(renderContext).promise
    } catch (err) {
      setError('ページのレンダリングに失敗しました')
      console.error(err)
    }
  }

  // ページまたはスケールが変更されたらレンダリング
  useEffect(() => {
    if (pdfDoc) {
      renderPage(currentPage)
    }
  }, [pdfDoc, currentPage, scale])

  // ナビゲーション関数
  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3))
  }

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5))
  }

  const resetZoom = () => {
    setScale(1.5)
  }

  return (
    <div className="app">
      <header className="header">
        <h1>📄 PDF Viewer</h1>

        <div className="controls">
          <div className="file-input-wrapper">
            <input
              type="file"
              id="file-input"
              accept=".pdf"
              onChange={handleFileChange}
            />
            <label htmlFor="file-input" className="file-input-label">
              📁 PDFを開く
            </label>
          </div>

          {pdfDoc && (
            <>
              <div className="nav-controls">
                <button onClick={goToPrevPage} disabled={currentPage <= 1}>
                  ← 前へ
                </button>
                <span className="page-info">
                  {currentPage} / {totalPages}
                </span>
                <button onClick={goToNextPage} disabled={currentPage >= totalPages}>
                  次へ →
                </button>
              </div>

              <div className="zoom-controls">
                <button onClick={zoomOut}>－</button>
                <span className="zoom-info">{Math.round(scale * 100)}%</span>
                <button onClick={zoomIn}>＋</button>
                <button onClick={resetZoom}>リセット</button>
              </div>
            </>
          )}
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="content">
        {loading ? (
          <div className="loading">読み込み中...</div>
        ) : pdfDoc ? (
          <div className="pdf-container">
            <canvas ref={canvasRef} className="pdf-canvas" />
          </div>
        ) : (
          <div className="no-pdf">
            <div className="no-pdf-icon">📄</div>
            <p>PDFファイルを選択してください</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
