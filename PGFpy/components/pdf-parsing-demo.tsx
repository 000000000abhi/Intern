export default function PDFParsingDemo() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">PDF Parsing Process</h2>

        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-lg">Step 1: PDF Text Extraction</h3>
            <p className="text-gray-600 dark:text-gray-300">
              PDF.js extracts raw text from your PDF file and logs basic file information.
            </p>
            <div className="bg-black text-green-400 p-3 rounded mt-2 font-mono text-sm">
              <div>📄 PDF TEXT EXTRACTED FOR GPT PROCESSING</div>
              <div>📊 PDF Data Object:</div>
              <div>{`{`}</div>
              <div> filename: "resume.pdf",</div>
              <div> size: "2.34 MB",</div>
              <div> pages: 2,</div>
              <div> textLength: "3456 characters",</div>
              <div> metadata: {`{ title: "Resume", author: "John Doe" }`}</div>
              <div>{`}`}</div>
            </div>
          </div>

          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold text-lg">Step 2: GPT Parsing</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Raw PDF text is sent to GPT which analyzes and extracts structured data.
            </p>
            <div className="bg-black text-green-400 p-3 rounded mt-2 font-mono text-sm">
              <div>🤖 GPT PARSED DATA OBJECT</div>
              <div>📋 Complete Extracted Portfolio Data:</div>
              <div>{`{`}</div>
              <div> "personalInfo": {`{`}</div>
              <div> "name": "John Doe",</div>
              <div> "email": "john@example.com",</div>
              <div> "phone": "+1-555-123-4567"</div>
              <div> {`},`}</div>
              <div> "experience": [...],</div>
              <div> "education": [...],</div>
              <div> "skills": {`{ technical: [...], soft: [...] }`}</div>
              <div>{`}`}</div>
            </div>
          </div>

          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-semibold text-lg">Step 3: Detailed Breakdown</h3>
            <p className="text-gray-600 dark:text-gray-300">Console shows organized data with counts and summaries.</p>
            <div className="bg-black text-green-400 p-3 rounded mt-2 font-mono text-sm">
              <div>👤 Personal Information:</div>
              <div>┌─────────┬──────────────────────────┐</div>
              <div>│ (index) │ Values │</div>
              <div>├─────────┼──────────────────────────┤</div>
              <div>│ name │ 'John Doe' │</div>
              <div>│ email │ 'john@example.com' │</div>
              <div>└─────────┴──────────────────────────┘</div>
              <div>💼 Experience Count: 3</div>
              <div>🎓 Education Count: 2</div>
              <div>🛠️ Skills Categories: ["technical", "soft"]</div>
              <div>🚀 Projects Count: 4</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
